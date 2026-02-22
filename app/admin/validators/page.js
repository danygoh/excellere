'use client'

import { useState, useEffect } from 'react'

const MOCK_QUEUE = [
  { id: '1', student: 'Sarah Chen', module: 'AI-Native Business Design', validator: 'Prof. Mark Esposito', days: 3 },
]

export default function ValidatorsPage() {
  const [validators, setValidators] = useState([])
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Fetch validators
  const fetchValidators = async () => {
    try {
      const res = await fetch('/api/admin/validators')
      if (res.ok) {
        const data = await res.json()
        if (data && data.validators) {
          setValidators(data.validators)
          setQueue(data.queue || [])
          setLoading(false)
          return
        }
      }
      setQueue([])
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch validation queue
  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/admin/validation')
      if (res.ok) {
        const data = await res.json()
        setQueue(data || [])
      }
    } catch (err) {
      console.error('Failed to fetch queue:', err)
    }
  }

  useEffect(() => {
    fetchValidators()
  }, [])

  const filteredQueue = filter === 'all' 
    ? queue 
    : queue.filter(q => q.validator_name === filter || (filter === 'unassigned' && !q.validator_name))

  if (loading) return <div className="admin-main"><div className="empty-state">Loading...</div></div>

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Validators</h1><p className="page-subtitle">Manage validators and their workload</p></div>
        <button className="btn btn-secondary" onClick={fetchValidators}>↻ Refresh</button>
      </div>

      <div className="stats-grid">
        {validators.map(v => (
          <div key={v.id} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '16px' }}>{v.name?.split(' ').map(n => n[0]).join('') || 'V'}</div>
              <div><div style={{ fontWeight: 600 }}>{v.name}</div><div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{v.institution}</div></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><div className="stat-label">Pending</div><div className="stat-value" style={{ fontSize: '24px' }}>{v.pending || 0}</div></div>
              <div><div className="stat-label">Completed</div><div className="stat-value green" style={{ fontSize: '24px' }}>{v.completed || 0}</div></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px' }}>Validation Queue</h2>
          <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Validators</option>
            {validators.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
            <option value="unassigned">Unassigned</option>
          </select>
        </div>

        <table className="data-table">
          <thead><tr><th>Student</th><th>Module</th><th>Assigned To</th><th>Waiting</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredQueue.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600 }}>{item.first_name} {item.last_name}</td>
                <td>{item.module_id?.replace(/-/g, ' ') || item.module}</td>
                <td>{item.validator_name || 'Unassigned'}</td>
                <td>{item.days_waiting || 0} days</td>
                <td><button className="btn btn-secondary btn-sm">Reassign</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredQueue.length === 0 && <div className="empty-state"><p>No items in queue</p></div>}
      </div>
    </div>
  )
}
