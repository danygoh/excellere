'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const validators = [
  { id: 'mark', name: 'Prof. Mark Esposito', title: 'Harvard / Hult', email: 'mark@excellere.ai' },
  { id: 'terence', name: 'Prof. Terence Tse', title: 'ESCP Business School', email: 'terence@excellere.ai' },
  { id: 'danny', name: 'Danny Goh', title: 'Excellere', email: 'danny@excellere.ai' }
];

function ValidatorCard({ validator, onClick }) {
  return (
    <a 
      href={`/validate?validator=${validator.id}`}
      onClick={(e) => { e.preventDefault(); onClick(validator.id); }}
      style={{ 
        display: 'block', 
        background: '#0a0a0a', 
        border: '1px solid #222', 
        padding: '40px', 
        textDecoration: 'none', 
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <div style={{ 
        width: '60px', 
        height: '60px', 
        borderRadius: '50%', 
        background: '#1a1a1a', 
        color: '#d4af37', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '18px', 
        fontWeight: 600, 
        margin: '0 auto 16px', 
        fontFamily: 'Playfair Display, serif' 
      }}>
        {validator.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff' }}>{validator.name}</div>
      <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{validator.title}</div>
    </a>
  )
}

function ReportCard({ report, validatorId }) {
  return (
    <a 
      href={`/validate/${report.id}?validator=${validatorId}`} 
      style={{ 
        display: 'block', 
        background: '#0a0a0a', 
        border: '1px solid #222', 
        padding: '24px', 
        marginBottom: '12px', 
        textDecoration: 'none' 
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff', marginBottom: '8px' }}>
            {report.first_name} {report.last_name}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {report.role} • {report.sector}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#d4af37', marginBottom: '4px' }}>
            {report.content?.type === 'assessment' ? 'Assessment Report' : 'Programme Report'}
          </div>
          <div style={{ fontSize: '11px', color: '#444' }}>
            {new Date(report.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </a>
  )
}

export default function ValidatorDashboard() {
  const searchParams = useSearchParams()
  const validatorId = searchParams?.get('validator')
  
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const validator = validators.find(v => v.id === validatorId)

  // Fetch reports when validator is selected
  useEffect(() => {
    async function fetchReports() {
      if (!validatorId) return
      
      setLoading(true)
      setError(null)
      
      try {
        const res = await fetch(`/api/reports?validator=${validatorId}`)
        const data = await res.json()
        
        if (data.success) {
          // Filter based on validator
          let filtered = data.reports || []
          if (validatorId === 'danny') {
            // Danny sees all
            filtered = filtered
          } else {
            // Others see assigned or unassigned
            filtered = filtered.filter(r => r.validator_id === validatorId || !r.validator_id)
          }
          setReports(filtered)
        } else {
          setError(data.error || 'Failed to load reports')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchReports()
  }, [validatorId])

  const handleValidatorClick = (id) => {
    window.location.href = `/validate?validator=${id}`
  }

  // Not selected - show validator selection
  if (!validatorId) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '14px', letterSpacing: '8px', color: '#d4af37' }}>✦</span>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 400, color: '#fff', letterSpacing: '6px', marginTop: '10px' }}>VALIDATOR</div>
            <p style={{ color: '#666', marginTop: '20px', fontSize: '14px' }}>Review and validate learner assessment reports</p>
          </div>

          {/* Validator Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {validators.map(v => (
              <ValidatorCard key={v.id} validator={v} onClick={handleValidatorClick} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <a href="/validate" style={{ display: 'inline-block', color: '#666', textDecoration: 'none', fontSize: '12px', marginBottom: '30px' }}>← Select validator</a>
          <div style={{ background: '#0a0a0a', border: '1px solid #e74c3c', padding: '40px', textAlign: 'center', color: '#e74c3c' }}>
            Error: {error}
          </div>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div>
          <a href="/validate" style={{ display: 'inline-block', color: '#666', textDecoration: 'none', fontSize: '12px', marginBottom: '30px' }}>← Select validator</a>
          
          {/* Info */}
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: '#d4af37', 
              color: '#000', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '20px', 
              fontWeight: 600, 
              fontFamily: 'Playfair Display, serif' 
            }}>
              {validator?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#fff' }}>{validator?.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{validator?.title}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
            <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontFamily: 'Playfair Display, serif', color: '#d4af37' }}>{reports.length}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Total Reports</div>
            </div>
            <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontFamily: 'Playfair Display, serif', color: '#d4af37' }}>{reports.filter(r => r.status === 'pending').length}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Pending</div>
            </div>
            <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontFamily: 'Playfair Display, serif', color: '#d4af37' }}>{reports.filter(r => r.status === 'validated').length}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Validated</div>
            </div>
          </div>

          {/* Reports List */}
          <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
            {loading ? 'Loading reports...' : `${reports.length} Reports`}
          </div>
          
          {!loading && reports.length === 0 && (
            <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '60px', textAlign: 'center', color: '#666' }}>
              No reports assigned to you yet.
            </div>
          )}

          {!loading && reports.map(report => (
            <ReportCard key={report.id} report={report} validatorId={validatorId} />
          ))}
        </div>
      </div>
    </div>
  )
}
