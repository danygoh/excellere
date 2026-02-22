'use client'

import { useState, useEffect } from 'react'

export default function ValidatorsPage() {
  const [validators, setValidators] = useState([])
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingValidator, setEditingValidator] = useState(null)
  const [toast, setToast] = useState(null)

  const fetchData = async () => {
    try {
      const [vRes, qRes] = await Promise.all([
        fetch('/api/admin/validators'),
        fetch('/api/admin/validation')
      ])
      
      if (vRes.ok) {
        const vData = await vRes.json()
        setValidators(vData.validators || [])
      }
      
      if (qRes.ok) {
        const qData = await qRes.json()
        setQueue(qData || [])
      }
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const getValidatorStudents = (validatorName) => {
    return queue.filter(q => q.validator_name === validatorName)
  }

  const filteredQueue = filter === 'all' 
    ? queue 
    : filter === 'unassigned'
      ? queue.filter(q => !q.validator_name)
      : queue.filter(q => q.validator_name === filter)

  const handleEdit = (validator) => {
    setEditingValidator(validator)
    setShowModal(true)
  }

  const handleDelete = async (validator) => {
    if (confirm(`Delete validator "${validator.name}"?`)) {
      try {
        const res = await fetch('/api/admin/validators', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id: validator.id })
        })
        
        if (res.ok) {
          showToast('Validator deleted!')
          fetchData()
        } else {
          showToast('Failed to delete', 'error')
        }
      } catch (err) {
        showToast('Failed to delete', 'error')
      }
    }
  }

  const handleSave = async (data) => {
    try {
      const payload = {
        action: editingValidator ? 'update' : 'create',
        id: editingValidator?.id,
        data
      }
      
      const res = await fetch('/api/admin/validators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        showToast(editingValidator ? 'Validator updated!' : 'Validator added!')
        fetchData()
      } else {
        showToast('Failed to save', 'error')
      }
    } catch (err) {
      showToast('Failed to save', 'error')
    }
    
    setShowModal(false)
    setEditingValidator(null)
  }

  if (loading) return <div className="admin-main"><div className="empty-state">Loading...</div></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Validators</h1>
          <p className="page-subtitle">Manage validators and their workload</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={fetchData}>↻ Refresh</button>
          <button className="btn btn-primary" onClick={() => { setEditingValidator(null); setShowModal(true) }}>+ Add Validator</button>
        </div>
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
              <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '16px' }}>
                {v.name?.split(' ').map(n => n[0]).join('') || 'V'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{v.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{v.institution}</div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={(e) => { e.stopPropagation(); handleEdit(v) }}
                  style={{ padding: '4px 8px', fontSize: '10px' }}
                >Edit</button>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={(e) => { e.stopPropagation(); handleDelete(v) }}
                  style={{ padding: '4px 8px', fontSize: '10px', color: 'var(--red)' }}
                >✕</button>
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

      {/* Queue Table */}
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
          <thead>
            <tr>
              <th>Student</th>
              <th>Module</th>
              <th>Status</th>
              <th>Waiting</th>
              <th>Validator</th>
            </tr>
          </thead>
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

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {showModal && (
        <ValidatorModal 
          validator={editingValidator} 
          onClose={() => { setShowModal(false); setEditingValidator(null) }} 
          onSave={handleSave} 
        />
      )}
    </div>
  )
}

function ValidatorModal({ validator, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: validator?.name || '',
    title: validator?.title || '',
    institution: validator?.institution || '',
    email: validator?.email || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{validator ? 'Edit Validator' : 'Add Validator'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Institution</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.institution}
                onChange={e => setFormData({...formData, institution: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{validator ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
