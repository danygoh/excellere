'use client'

import { useState, useEffect } from 'react'

export default function ValidatorsPage() {
  const [validators, setValidators] = useState([])
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Fetch validators and queue
  const fetchData = async () => {
    try {
      const [validatorsRes, queueRes] = await Promise.all([
        fetch('/api/admin/validators'),
        fetch('/api/admin/validation')
      ])
      
      if (validatorsRes.ok) {
        const vData = await validatorsRes.json()
        setValidators(vData.validators || [])
      }
      
      if (queueRes.ok) {
        const qData = await queueRes.json()
        setQueue(qData || [])
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Get students for selected validator
  const getValidatorStudents = (validatorName) => {
    return queue.filter(q => q.validator_name === validatorName)
  }

  const filteredQueue = filter === 'all' 
    ? queue 
    : filter === 'unassigned'
      ? queue.filter(q => !q.validator_name)
      : queue.filter(q => q.validator_name === filter)

  if (loading) return <div className="admin-main"><div className="empty-state">Loading...</div></div>

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Validators</h1><p className="page-subtitle">Manage validators and their workload</p></div>
        <button className="btn btn-secondary" onClick={fetchData}>↻ Refresh</button>
      </div>

      {/* Validator Cards */}
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

      {/* Queue Table - Filtered by Validator */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px' }}>
            {filter === 'all' ? 'All Students' : filter === 'unassigned' ? 'Unassigned Students' : `Students for ${filter}`}
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Validators</option>
              {validators.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
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
