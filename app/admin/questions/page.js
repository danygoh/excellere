'use client'

import { useState, useEffect } from 'react'
import db from '@/lib/database'

const DIMENSIONS = [
  { id: 'ai_conceptual_literacy', label: 'AI Conceptual Literacy' },
  { id: 'strategic_ai_orientation', label: 'Strategic AI Orientation' },
  { id: 'ai_native_thinking', label: 'AI-Native Thinking' },
  { id: 'change_leadership_readiness', label: 'Change Leadership Readiness' },
  { id: 'ethical_governance_awareness', label: 'Ethical & Governance Awareness' },
]

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const data = await db.getAssessmentQuestions()
      setQuestions(data || [])
    } catch (err) {
      console.error('Failed to load questions:', err)
      showToast('Failed to load questions', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const getSignalColor = (strength) => {
    const colors = { strong: 'var(--green)', moderate: 'var(--amber)', weak: 'var(--red)', irrelevant: 'var(--text-dim)' }
    return colors[strength] || 'var(--text-dim)'
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setShowModal(true)
  }

  const handleDelete = async (question) => {
    if (confirm(`Delete this question?\n\n"${question.question_text.substring(0, 100)}..."`)) {
      showToast('Question deleted (soft delete)')
    }
  }

  const handleSave = async (data) => {
    showToast(editingQuestion ? 'Question updated!' : 'Question added!')
    setShowModal(false)
    setEditingQuestion(null)
  }

  const questionsByDimension = DIMENSIONS.map(dim => ({
    ...dim,
    questions: questions.filter(q => q.dimension === dim.id)
  }))

  if (loading) {
    return <div className="admin-main"><div className="empty-state">Loading...</div></div>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Assessment Questions</h1>
          <p className="page-subtitle">Manage onboarding assessment questions</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingQuestion(null); setShowModal(true) }}>
          + Add Question
        </button>
      </div>

      {questionsByDimension.map(dim => (
        <div key={dim.id} style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--amber)' }}>
            {dim.label} ({dim.questions.length})
          </h2>
          
          {dim.questions.map((q, idx) => (
            <div key={q.id} className="stat-card" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Q{idx + 1}: {q.question_text}</div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {q.options?.map((opt, i) => (
                      <span 
                        key={i}
                        style={{ 
                          fontSize: '12px', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          background: `${getSignalColor(opt.signal_strength)}20`,
                          color: getSignalColor(opt.signal_strength)
                        }}
                      >
                        {opt.id}: {opt.signal_strength}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(q)}>Edit</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(q)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {showModal && (
        <QuestionModal 
          question={editingQuestion} 
          onClose={() => { setShowModal(false); setEditingQuestion(null) }} 
          onSave={handleSave} 
        />
      )}
    </div>
  )
}

function QuestionModal({ question, onClose, onSave }) {
  const [formData, setFormData] = useState({
    dimension: question?.dimension || 'ai_conceptual_literacy',
    questionText: question?.question_text || '',
    options: question?.options || [
      { id: 'A', text: '', signalStrength: 'strong' },
      { id: 'B', text: '', signalStrength: 'moderate' },
      { id: 'C', text: '', signalStrength: 'weak' },
      { id: 'D', text: '', signalStrength: 'irrelevant' },
    ]
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate: must have exactly one strong signal
    const strongCount = formData.options.filter(o => o.signalStrength === 'strong').length
    if (strongCount !== 1) {
      setError('Must have exactly one option with "Strong" signal strength')
      return
    }
    
    if (!formData.questionText.trim()) {
      setError('Question text is required')
      return
    }

    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{question ? 'Edit Question' : 'Add Question'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div style={{ color: 'var(--red)', marginBottom: '16px', padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>{error}</div>}
            
            <div className="form-group">
              <label className="form-label">Dimension</label>
              <select 
                className="form-select"
                value={formData.dimension}
                onChange={e => setFormData({...formData, dimension: e.target.value})}
              >
                {DIMENSIONS.map(d => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Question Text</label>
              <textarea 
                className="form-input form-textarea"
                value={formData.questionText}
                onChange={e => setFormData({...formData, questionText: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Answer Options</label>
              {formData.options.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                  <span style={{ width: '24px', fontWeight: 600 }}>{opt.id}</span>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder={`Option ${opt.id} text`}
                    value={opt.text}
                    onChange={e => {
                      const newOptions = [...formData.options]
                      newOptions[idx].text = e.target.value
                      setFormData({...formData, options: newOptions})
                    }}
                    style={{ flex: 1 }}
                  />
                  <select 
                    className="form-select"
                    style={{ width: '120px' }}
                    value={opt.signalStrength}
                    onChange={e => {
                      const newOptions = [...formData.options]
                      newOptions[idx].signalStrength = e.target.value
                      setFormData({...formData, options: newOptions})
                    }}
                  >
                    <option value="strong">Strong</option>
                    <option value="moderate">Moderate</option>
                    <option value="weak">Weak</option>
                    <option value="irrelevant">Irrelevant</option>
                  </select>
                </div>
              ))}
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>Select exactly one "Strong" signal option</p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Question</button>
          </div>
        </form>
      </div>
    </div>
  )
}
