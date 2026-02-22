'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ValidatorReviewPage({ params }) {
  const reportId = params?.id
  const searchParams = useSearchParams()
  const validatorId = searchParams?.get('validator')
  
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState('validated')

  useEffect(() => {
    async function fetchReport() {
      if (!reportId) return
      
      try {
        const res = await fetch(`/api/reports/${reportId}`)
        const data = await res.json()
        
        if (data.success && data.report) {
          setReport(data.report)
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchReport()
  }, [reportId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const res = await fetch(`/api/reports/${reportId}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment, status, validatorId })
      })
      
      if (res.ok) {
        window.location.href = '/validate'
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', color: '#666', textAlign: 'center' }}>Loading...</div>
      </div>
    )
  }

  if (!report) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <a href="/validate" style={{ display: 'inline-block', color: '#666', textDecoration: 'none', fontSize: '12px', marginBottom: '30px' }}>← BACK TO QUEUE</a>
          <p style={{ color: '#666' }}>Report not found</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <a href={`/validate?validator=${validatorId}`} style={{ display: 'inline-block', color: '#666', textDecoration: 'none', fontSize: '12px', marginBottom: '30px' }}>← BACK TO QUEUE</a>
        
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#fff', marginBottom: '40px' }}>Review: {report.student_name}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 380px', gap: '20px' }}>
          {/* Left - Context */}
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px' }}>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '20px' }}>LEARNER CONTEXT</p>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#fff', marginBottom: '8px' }}>{report.student_name}</h3>
            <p style={{ color: '#d4af37', fontSize: '12px', marginBottom: '4px' }}>{report.student_job_title}, {report.student_organisation}</p>
            <p style={{ color: '#444', fontSize: '12px', marginBottom: '16px' }}>{report.student_email}</p>
            <span style={{ background: '#1a1a1a', color: '#888', padding: '4px 12px', fontSize: '11px' }}>{report.module_id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Module'}</span>
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#444' }}>
              <strong style={{ color: '#666' }}>Module:</strong> {report.module_id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}<br/>
              <strong style={{ color: '#666' }}>Submitted:</strong> {report.created_at ? new Date(report.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
            </div>
          </div>

          {/* Center - Report */}
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px' }}>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '20px' }}>ARIA'S ASSESSMENT</p>
            <p style={{ color: '#d4af37', fontSize: '24px', marginBottom: '20px' }}>{report.overall_score || 0}<span style={{ fontSize: '12px', color: '#444' }}>/100</span></p>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>WHAT ARIA NOTICED</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', color: '#fff', fontStyle: 'italic', lineHeight: 1.7 }}>
              {report.ai_generated_summary || 'No assessment available yet.'}
            </p>
          </div>

          {/* Right - Validation Form */}
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px' }}>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '20px' }}>VALIDATION</p>
            <form onSubmit={handleSubmit}>
              <p style={{ color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>YOUR COMMENT *</p>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required 
                placeholder="Write 2-4 sentences about this learner's progress..." 
                style={{ width: '100%', height: '140px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '12px', fontSize: '13px', resize: 'none', marginBottom: '20px' }} 
              />
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: status === 'validated' ? '#d4af37' : '#888', fontSize: '12px', cursor: 'pointer', marginBottom: '10px', fontWeight: 400 }}>
                  <input 
                    type="radio" 
                    name="status" 
                    value="validated" 
                    checked={status === 'validated'}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ accentColor: '#d4af37', width: '12px', height: '12px' }} 
                  />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: status === 'validated' ? '#d4af37' : '#666', flexShrink: 0 }} />
                  <span>Validated — accurate assessment</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: status === 'needs_revision' ? '#d4af37' : '#888', fontSize: '12px', cursor: 'pointer', marginBottom: '10px', fontWeight: 400 }}>
                  <input 
                    type="radio" 
                    name="status" 
                    value="needs_revision" 
                    checked={status === 'needs_revision'}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ accentColor: '#d4af37', width: '12px', height: '12px' }} 
                  />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: status === 'needs_revision' ? '#d4af37' : '#666', flexShrink: 0 }} />
                  <span>Needs Revision</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: status === 'exceptional' ? '#d4af37' : '#888', fontSize: '12px', cursor: 'pointer', marginBottom: '20px', fontWeight: 400 }}>
                  <input 
                    type="radio" 
                    name="status" 
                    value="exceptional" 
                    checked={status === 'exceptional'}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ accentColor: '#d4af37', width: '12px', height: '12px' }} 
                  />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: status === 'exceptional' ? '#d4af37' : '#666', flexShrink: 0 }} />
                  <span>★ Exceptional</span>
                </label>
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                style={{ width: '100%', background: '#d4af37', color: '#000', border: 'none', padding: '14px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', cursor: 'pointer', opacity: submitting ? 0.5 : 1 }}
              >
                {submitting ? 'SUBMITTING...' : 'SIGN & ISSUE'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
