'use client'

import { useState, useEffect } from 'react'

export default function ValidationQueuePage() {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    // Mock data - in production this would fetch from API
    setQueue([
      { id: '1', first_name: 'Sarah', last_name: 'Chen', job_title: 'CEO', organisation: 'TechCorp Ltd', module_id: 'ai-native-business-design', report_type: 'Assessment Report', days_waiting: 3, validator_name: 'Prof. Mark Esposito', status: 'pending' },
      { id: '2', first_name: 'James', last_name: 'Wilson', job_title: 'COO', organisation: 'HealthPlus', module_id: 'double-loop-strategy', report_type: 'Programme Report', days_waiting: 6, validator_name: null, status: 'pending' },
      { id: '3', first_name: 'Emma', last_name: 'Davis', job_title: 'Director of AI', organisation: 'Consulting Co', module_id: 'agentic-ai', report_type: 'Assessment Report', days_waiting: 1, validator_name: 'Prof. Terence Tse', status: 'pending' },
    ])
    setLoading(false)
  }, [])

  const getUrgency = (days) => {
    if (days >= 5) return 'critical'
    if (days >= 3) return 'high'
    if (days >= 1) return 'medium'
    return 'low'
  }

  const getUrgencyBadge = (days) => {
    const urgency = getUrgency(days)
    const colors = { critical: 'red', high: 'orange', medium: 'amber', low: 'gray' }
    return <span className={`badge badge-${colors[urgency]}`}>{urgency}</span>
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  if (loading) {
    return <div className="admin-main"><div className="empty-state">Loading...</div></div>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Validation Queue</h1>
          <p className="page-subtitle">Pending reports awaiting validator review</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Pending</div>
          <div className="stat-value">{queue.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Critical</div>
          <div className="stat-value red">{queue.filter(q => q.days_waiting >= 5).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">High Priority</div>
          <div className="stat-value">{queue.filter(q => q.days_waiting >= 3 && q.days_waiting < 5).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Wait Time</div>
          <div className="stat-value">{Math.round(queue.reduce((acc, q) => acc + q.days_waiting, 0) / queue.length)} days</div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Report Type</th>
            <th>Module</th>
            <th>Waiting</th>
            <th>Assigned To</th>
            <th>Urgency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queue.map(item => (
            <tr key={item.id}>
              <td>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.first_name} {item.last_name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{item.job_title} • {item.organisation}</div>
                </div>
              </td>
              <td>{item.report_type}</td>
              <td>{item.module_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
              <td>{item.days_waiting} days</td>
              <td>{item.validator_name || 'Unassigned'}</td>
              <td>{getUrgencyBadge(item.days_waiting)}</td>
              <td>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAssignModal(true)}
                >
                  {item.validator_name ? 'Reassign' : 'Assign'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {queue.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">✓</div>
          <p>No pending validations</p>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Assign Validator</h2>
              <button className="modal-close" onClick={() => setShowAssignModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {['Prof. Mark Esposito', 'Prof. Terence Tse', 'Danny Goh'].map(validator => (
                <div 
                  key={validator}
                  className="stat-card"
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => { showToast('Validator assigned!'); setShowAssignModal(false) }}
                >
                  <div style={{ fontWeight: 600 }}>{validator}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
