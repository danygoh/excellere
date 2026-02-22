'use client'

import { useState, useEffect } from 'react'

const MODULES = [
  { id: 'ai-native-business-design', name: 'AI-Native Business Design' },
  { id: 'double-loop-strategy', name: 'Double Loop Strategy' },
  { id: 'agentic-ai', name: 'Agentic AI' }
]

const MOCK_CONCEPTS = [
  { id: '1', module_id: 'ai-native-business-design', name: 'AI-Native Business Fundamentals', summary: 'Understanding the core principles of AI-native enterprise architecture.', is_active: true },
  { id: '2', module_id: 'ai-native-business-design', name: 'Data as Strategic Asset', summary: 'Learn how to treat data as a strategic asset.', is_active: true },
  { id: '3', module_id: 'ai-native-business-design', name: 'AI-Driven Decision Making', summary: 'Transform decision-making with AI-powered insights.', is_active: true },
  { id: '4', module_id: 'ai-native-business-design', name: 'Scaling AI Operations', summary: 'Move from pilots to enterprise-wide deployment.', is_active: true },
  { id: '5', module_id: 'double-loop-strategy', name: 'First Loop: Strategy Execution', summary: 'Master fundamentals of strategy execution.', is_active: true },
  { id: '6', module_id: 'double-loop-strategy', name: 'Second Loop: Strategy Formation', summary: 'Question assumptions and develop new frameworks.', is_active: true },
  { id: '7', module_id: 'double-loop-strategy', name: 'AI in Strategic Context', summary: 'Apply AI thinking to strategic challenges.', is_active: true },
  { id: '8', module_id: 'double-loop-strategy', name: 'Double Loop in Practice', summary: 'Real-world case studies.', is_active: true },
  { id: '9', module_id: 'agentic-ai', name: 'Introduction to Agentic AI', summary: 'Understanding autonomous AI agents.', is_active: true },
  { id: '10', module_id: 'agentic-ai', name: 'Building AI Agent Systems', summary: 'Technical foundations for AI agents.', is_active: true },
  { id: '11', module_id: 'agentic-ai', name: 'Agentic AI Use Cases', summary: 'Enterprise use cases across industries.', is_active: true },
  { id: '12', module_id: 'agentic-ai', name: 'Future of Agentic AI', summary: 'Emerging trends and landscape.', is_active: true }
]

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingConcept, setEditingConcept] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    async function loadConcepts() {
      try {
        const res = await fetch('/api/admin/concepts')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setConcepts(data)
            setLoading(false)
            return
          }
        }
        setConcepts(MOCK_CONCEPTS)
      } catch (err) {
        console.error('Failed to load concepts:', err)
        setConcepts(MOCK_CONCEPTS)
      } finally {
        setLoading(false)
      }
    }
    loadConcepts()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleEdit = (concept) => {
    setEditingConcept(concept)
    setShowModal(true)
  }

  const handleSave = async (data) => {
    try {
      const res = await fetch('/api/admin/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id: editingConcept.id, data })
      })
      
      if (res.ok) {
        showToast('Concept updated!')
        // Refresh concepts
        const res = await fetch('/api/admin/concepts')
        if (res.ok) {
          const data = await res.json()
          setConcepts(data)
        }
      } else {
        showToast('Failed to update', 'error')
      }
    } catch (err) {
      console.error('Save error:', err)
      showToast('Failed to update', 'error')
    }
    
    setShowModal(false)
    setEditingConcept(null)
  }

  const conceptsByModule = MODULES.map(mod => ({
    ...mod,
    concepts: concepts.filter(c => c.module_id === mod.id).sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  }))

  if (loading) return <div className="admin-main"><div className="empty-state">Loading...</div></div>

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Course Concepts</h1><p className="page-subtitle">View and manage course content ({concepts.length} total concepts)</p></div>
      </div>

      {conceptsByModule.map(mod => (
        <div key={mod.id} style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--amber)' }}>{mod.name} ({mod.concepts.length} concepts)</h2>
          {mod.concepts.length === 0 && <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>No concepts in this module</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {mod.concepts.map((concept, idx) => (
              <div key={concept.id} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{idx + 1}. {concept.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{concept.summary?.substring(0, 100)}...</div>
                  </div>
                  <span className={`badge ${concept.is_active ? 'badge-green' : 'badge-gray'}`}>{concept.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleEdit(concept)}>Edit in Content Editor</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {showModal && (
        <ConceptModal concept={editingConcept} onClose={() => { setShowModal(false); setEditingConcept(null) }} onSave={handleSave} />
      )}
    </div>
  )
}

function ConceptModal({ concept, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: concept?.name || '',
    summary: concept?.summary || '',
    module_id: concept?.module_id || 'ai-native-business-design',
    is_active: concept?.is_active !== false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Concept</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Concept Name</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Summary</label>
              <textarea 
                className="form-input form-textarea"
                value={formData.summary}
                onChange={e => setFormData({...formData, summary: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Module</label>
              <select 
                className="form-select"
                value={formData.module_id}
                onChange={e => setFormData({...formData, module_id: e.target.value})}
              >
                {MODULES.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                />
                <span>Active</span>
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}
