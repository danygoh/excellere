'use client'

import { useState, useEffect } from 'react'

// Fallback data in case API fails
const FALLBACK_VALIDATORS = [
  { id: 'v1', name: 'Prof. Mark Esposito', institution: 'Harvard / Hult' },
  { id: 'v2', name: 'Prof. Terence Tse', institution: 'ESCP Business School' },
  { id: 'v3', name: 'Danny Goh', institution: 'Excellere' }
]

const FALLBACK_QUEUE = [
  { id: '1', first_name: 'Emma', last_name: 'Davis', job_title: 'Director of AI', organisation: 'Consulting Co', module_id: 'agentic-ai', validator_name: 'Prof. Mark Esposito', status: 'pending', days_waiting: 3 },
  { id: '2', first_name: 'James', last_name: 'Wilson', job_title: 'COO', organisation: 'HealthPlus', module_id: 'double-loop-strategy', validator_name: 'Prof. Terence Tse', status: 'in_progress', days_waiting: 1 },
  { id: '3', first_name: 'Sarah', last_name: 'Chen', job_title: 'CEO', organisation: 'TechCorp Ltd', module_id: 'ai-native-business-design', validator_name: 'Prof. Terence Tse', status: 'pending', days_waiting: 2 },
  { id: '4', first_name: 'Michael', last_name: 'Brown', job_title: 'CTO', organisation: 'FinBank', module_id: 'ai-native-business-design', validator_name: 'Prof. Terence Tse', status: 'in_progress', days_waiting: 4 },
]

export default function ValidatorsPage() {
  const [validators, setValidators] = useState(FALLBACK_VALIDATORS)
  const [queue, setQueue] = useState(FALLBACK_QUEUE)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  // Fetch real data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [vRes, qRes] = await Promise.all([
          fetch('/api/admin/validators'),
          fetch('/api/admin/validation')
        ])
        
        if (vRes.ok) {
          const vData = await vRes.json()
          if (vData.validators?.length) setValidators(vData.validators)
        }
        
        if (qRes.ok) {
          const qData = await qRes.json()
          if (qData.length) setQueue(qData)
        }
      } catch (e) {
        console.log('Using fallback data')
      }
    }
    loadData()
  }, [])

  const getValidatorStudents = (validatorName) => {
    return queue.filter(q => q.validator_name === validatorName)
  }

  const filteredQueue = filter === 'all' 
    ? queue 
    : filter === 'unassigned'
      ? queue.filter(q => !q.validator_name)
      : queue.filter(q => q.validator_name === filter)

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Validators</h1><p className="page-subtitle">Manage validators and their workload</p></div>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>↻ Refresh</button>
      </div>

      <div className="stats-grid">
        {validators.map(v => (
          <div 
            key={v.id} 
            className="stat-card"
            style={{ cursor: 'pointer', border: filter === v.name ? '2px solid var(--amber)' : '1px solid var(--border)' }}
            onClick={() => setFilter(filter === v.name ? 'all' : v.name)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '16px' }}>{v.name?.split(' ').map(n => n[0]).join('') || 'V'}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{v.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{v.institution}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div className="stat-label">Assigned</div>
                <div className="stat-value" style={{ fontSize: '24px' }}>{getValidatorStudents(v.name).length}</div>
              </div>
              <div>
                <div className="stat-label">Pending</div>
                <div className="stat-value amber" style={{ fontSize: '24px' }}>{getValidatorStudents(v.name).filter(q => q.status === 'pending').length}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px' }}>
            {filter === 'all' ? 'All Students' : filter === 'unassigned' ? 'Unassigned Students' : `Students for ${filter}`}
          </h2>
          <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Validators</option>
            {validators.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
            <option value="unassigned">Unassigned</option>
          </select>
        </div>

        <table className="data-table">
          <thead><tr><th>Student</th><th>Module</th><th>Status</th><th>Waiting</th><th>Validator</th></tr></thead>
          <tbody>
            {filteredQueue.map(item => (
              <tr key={item.id}>
                <td>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.first_name} {item.last_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{item.job_title} • {item.organisation}</div>
                  </div>
                </td>
                <td>{item.module_id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '-'}</td>
                <td><span className={`badge badge-${item.status === 'in_progress' ? 'amber' : item.status === 'validated' ? 'green' : 'gray'}`}>{item.status}</span></td>
                <td>{item.days_waiting || 0} days</td>
                <td>{item.validator_name || 'Unassigned'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredQueue.length === 0 && <div className="empty-state"><p>No students in queue</p></div>}
      </div>
    </div>
  )
}
