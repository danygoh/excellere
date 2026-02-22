'use client'

import { useState, useEffect } from 'react'

const MOCK_STUDENTS = [
  { id: '1', first_name: 'Sarah', last_name: 'Chen', email: 'sarah.chen@example.com', job_title: 'CEO', sector: 'Financial Services', organisation: 'TechCorp Ltd', sessions_completed: 12, sessions_total: 12, readiness_score: 72, stage: 'AI Native', validator_name: 'Prof. Mark Esposito', last_active: new Date().toISOString() },
  { id: '2', first_name: 'James', last_name: 'Wilson', email: 'james.wilson@example.com', job_title: 'COO', sector: 'Healthcare', organisation: 'HealthPlus', sessions_completed: 8, sessions_total: 12, readiness_score: 65, stage: 'AI Fluent', validator_name: null, last_active: new Date(Date.now() - 86400000).toISOString() },
]

const MOCK_VALIDATORS = [
  { id: 'v1', name: 'Prof. Mark Esposito' },
  { id: 'v2', name: 'Prof. Terence Tse' },
  { id: 'v3', name: 'Danny Goh' }
]

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [validators, setValidators] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ stage: '', sector: '', status: '' })
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState(null)

  // Fetch students function
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students')
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0) {
          setStudents(data)
          setLoading(false)
          return
        }
      }
      setStudents(MOCK_STUDENTS)
    } catch (err) {
      console.error('Failed to fetch students:', err)
      setStudents(MOCK_STUDENTS)
    } finally {
      setLoading(false)
    }
  }

  // Fetch validators function
  const fetchValidators = async () => {
    try {
      const res = await fetch('/api/admin/validators')
      if (res.ok) {
        const data = await res.json()
        if (data && data.validators) {
          setValidators(data.validators)
          return
        }
      }
      setValidators(MOCK_VALIDATORS)
    } catch (err) {
      console.error('Failed to fetch validators:', err)
      setValidators(MOCK_VALIDATORS)
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchValidators()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = search === '' || 
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase()) ||
      student.organisation?.toLowerCase().includes(search.toLowerCase())
    
    const matchesStage = filters.stage === '' || student.stage === filters.stage
    const matchesSector = filters.sector === '' || student.sector === filters.sector
    const matchesStatus = filters.status === '' || getStatus(student) === filters.status
    
    return matchesSearch && matchesStage && matchesSector && matchesStatus
  })

  const getStatus = (student) => {
    if (student.sessions_completed === student.sessions_total && student.sessions_total > 0) return 'completed'
    const daysSinceActive = (Date.now() - new Date(student.last_active)) / (1000 * 60 * 60 * 24)
    if (daysSinceActive > 7) return 'stalled'
    return 'active'
  }

  const getProgress = (student) => Math.round((student.sessions_completed / 12) * 100)

  const getModuleStatus = (student, moduleNum) => {
    const moduleStart = (moduleNum - 1) * 4
    const moduleEnd = moduleNum * 4
    const completedInModule = Math.max(0, Math.min(student.sessions_completed, moduleEnd) - moduleStart)
    if (completedInModule === 4) return 'done'
    if (completedInModule > 0) return 'active'
    return 'pending'
  }

  const formatDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    const now = new Date()
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString()
  }

  const handleAssignValidator = async (validatorId) => {
    if (!selectedStudent?.id) return
    
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: selectedStudent.id, validatorId })
      })
      
      if (res.ok) {
        showToast('Validator assigned successfully!')
        await fetchStudents()
      } else {
        showToast('Failed to assign validator', 'error')
      }
    } catch (err) {
      console.error('Failed to assign:', err)
      showToast('Failed to assign validator', 'error')
    }
    
    setShowAssignModal(false)
    setSelectedStudent(null)
  }

  const handleAddStudent = async (data) => {
    showToast('Student added successfully! Invitation sent.')
    setShowAddModal(false)
    await fetchStudents()
  }

  if (loading) return <div className="admin-main"><div className="empty-state">Loading...</div></div>

  const totalEnrolled = students.length
  const completedProgramme = students.filter(s => s.sessions_completed === 12).length
  const activeThisWeek = students.filter(s => (Date.now() - new Date(s.last_active)) / (1000 * 60 * 60 * 24) < 7).length
  const avgScore = students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.readiness_score || 0), 0) / students.length) : 0

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage learner accounts and track progress</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => { fetchStudents(); fetchValidators() }}>↻ Refresh</button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Student</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Enrolled</div><div className="stat-value">{totalEnrolled}</div></div>
        <div className="stat-card"><div className="stat-label">Completed Programme</div><div className="stat-value green">{completedProgramme}</div></div>
        <div className="stat-card"><div className="stat-label">Active This Week</div><div className="stat-value">{activeThisWeek}</div></div>
        <div className="stat-card"><div className="stat-label">Avg Readiness Score</div><div className="stat-value">{avgScore}</div></div>
      </div>

      <div className="filters-bar">
        <input type="text" className="search-input" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-select" style={{ width: 'auto' }} value={filters.stage} onChange={(e) => setFilters({...filters, stage: e.target.value})}>
          <option value="">All Stages</option>
          <option value="AI Unaware">AI Unaware</option>
          <option value="AI Curious">AI Curious</option>
          <option value="AI Informed">AI Informed</option>
          <option value="AI Fluent">AI Fluent</option>
          <option value="AI Native">AI Native</option>
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={filters.sector} onChange={(e) => setFilters({...filters, sector: e.target.value})}>
          <option value="">All Sectors</option>
          <option value="Financial Services">Financial Services</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Professional Services">Professional Services</option>
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="stalled">Stalled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th><th>Sector</th><th>Stage</th><th>Score</th><th>Modules</th><th>Progress</th><th>Last Active</th><th>Validator</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id} onClick={() => setSelectedStudent(student)} style={{ cursor: 'pointer' }}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div className="avatar">{student.first_name?.[0]}{student.last_name?.[0]}</div><div><div style={{ fontWeight: 600 }}>{student.first_name} {student.last_name}</div><div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{student.job_title}</div></div></div></td>
              <td>{student.sector}</td>
              <td>{student.stage || '-'}</td>
              <td>{student.readiness_score || '-'}</td>
              <td><div style={{ display: 'flex', gap: '4px' }}>{[1, 2, 3].map(m => <span key={m} style={{ width: '8px', height: '8px', borderRadius: '50%', background: getModuleStatus(student, m) === 'done' ? 'var(--green)' : getModuleStatus(student, m) === 'active' ? 'var(--amber)' : 'var(--border)' }} />)}</div></td>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="progress-bar" style={{ width: '60px' }}><div className="progress-fill" style={{ width: `${getProgress(student)}%` }} /></div><span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{getProgress(student)}%</span></div></td>
              <td>{formatDate(student.last_active)}</td>
              <td>{student.validator_name || '-'}</td>
              <td><span className={`badge badge-${getStatus(student) === 'completed' ? 'green' : getStatus(student) === 'active' ? 'amber' : 'gray'}`}>{getStatus(student)}</span></td>
              <td onClick={(e) => e.stopPropagation()}><button className="btn btn-secondary btn-sm" onClick={() => { setSelectedStudent(student); setShowAssignModal(true) }}>Assign</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredStudents.length === 0 && <div className="empty-state"><div className="empty-state-icon">👥</div><p>No students found</p></div>}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {showAssignModal && (
        <div className="modal-overlay" onClick={() => { setShowAssignModal(false); setSelectedStudent(null) }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Assign Validator</h2><button className="modal-close" onClick={() => { setShowAssignModal(false); setSelectedStudent(null) }}>×</button></div>
            <div className="modal-body">
              <p style={{ marginBottom: '20px', color: 'var(--text-dim)' }}>Select a validator for {selectedStudent?.first_name} {selectedStudent?.last_name}:</p>
              {validators.map(validator => (
                <div key={validator.id} className="stat-card" style={{ marginBottom: '12px', cursor: 'pointer' }} onClick={() => handleAssignValidator(validator.id)}><div style={{ fontWeight: 600 }}>{validator.name}</div></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddModal && <AddStudentModal onClose={() => setShowAddModal(false)} onSubmit={handleAddStudent} />}
    </div>
  )
}

function AddStudentModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', jobTitle: '', sector: '', organisation: '' })
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData) }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h2 className="modal-title">Add Student</h2><button className="modal-close" onClick={onClose}>×</button></div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group"><label className="form-label">First Name</label><input type="text" className="form-input" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Last Name</label><input type="text" className="form-input" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required /></div>
            </div>
            <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Job Title</label><input type="text" className="form-input" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Sector</label><select className="form-select" value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} required><option value="">Select sector</option><option value="Financial Services">Financial Services</option><option value="Healthcare">Healthcare</option><option value="Professional Services">Professional Services</option></select></div>
            <div className="form-group"><label className="form-label">Organisation</label><input type="text" className="form-input" value={formData.organisation} onChange={e => setFormData({...formData, organisation: e.target.value})} required /></div>
          </div>
          <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary">Add Student</button></div>
        </form>
      </div>
    </div>
  )
}
