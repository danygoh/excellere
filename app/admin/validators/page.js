'use client'

import { useState, useEffect } from 'react'

const MOCK_VALIDATORS = [
  { id: 'mark', name: 'Prof. Mark Esposito', title: 'Professor of Business & Economics', institution: 'Harvard / Hult', pending: 3, completed: 12 },
  { id: 'terence', name: 'Prof. Terence Tse', title: 'Professor of Finance & AI Transformation', institution: 'ESCP Business School', pending: 2, completed: 8 },
  { id: 'danny', name: 'Danny Goh', title: 'AI Strategy Practitioner', institution: 'Excellere', pending: 1, completed: 15 }
]

const MOCK_QUEUE = [
  { id: '1', student: 'Sarah Chen', module: 'AI-Native Business Design', validator: 'Prof. Mark Esposito', days: 3 },
  { id: '2', student: 'James Wilson', module: 'Double Loop Strategy', validator: 'Prof. Terence Tse', days: 6 },
  { id: '3', student: 'Emma Davis', module: 'Agentic AI', validator: 'Danny Goh', days: 1 },
  { id: '4', student: 'Michael Brown', module: 'AI-Native Business Design', validator: null, days: 4 }
]

export default function ValidatorsPage() {
  const [validators, setValidators] = useState([])
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/validators')
        if (res.ok) {
          const data = await res.json()
          if (data && data.validators && data.validators.length > 0) {
            setValidators(data.validators)
            setQueue(data.queue || [])
            setLoading(false)
            return
          }
        }
        setValidators(MOCK_VALIDATORS)
        setQueue(MOCK_QUEUE)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setValidators(MOCK_VALIDATORS)
        setQueue(MOCK_QUEUE)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredQueue = filter === 'all' ? queue : queue.filter(q => q.validator === filter || (filter === 'unassigned' && !q.validator))

  if (loading) return <div className="admin-main"><div className="empty-state">Loading...</div></div>

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Validators</h1><p className="page-subtitle">Manage validators and their workload</p></div>
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
                <td style={{ fontWeight: 600 }}>{item.student}</td>
                <td>{item.module}</td>
                <td>{item.validator || 'Unassigned'}</td>
                <td>{item.days} days</td>
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
