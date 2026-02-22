'use client'

import { useState, useEffect } from 'react'
import db from '@/lib/database'

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ stage: '', sector: '', status: '' })
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState(null)

  // Fetch students
  useEffect(() => {
    async function fetchStudents() {
      try {
        const reports = await db.getInsightReports()
        // For now, we'll create mock student data from reports
        // In production, this would be a proper API call
        setStudents([
          {
            id: '1',
            first_name: 'Sarah',
            last_name: 'Chen',
            email: 'sarah.chen@example.com',
            job_title: 'CEO',
            sector: 'Financial Services',
            organisation: 'TechCorp Ltd',
            onboarding_complete: true,
            validator_name: 'Prof. Mark Esposito',
            sessions_completed: 8,
            sessions_total: 12,
            readiness_score: 72,
            stage: 'AI Fluent',
            last_active: new Date().toISOString()
          },
          {
            id: '2',
            first_name: 'James',
            last_name: 'Wilson',
            email: 'james.wilson@example.com',
            job_title: 'COO',
            sector: 'Healthcare',
            organisation: 'HealthPlus',
            onboarding_complete: true,
            validator_name: 'Prof. Terence Tse',
            sessions_completed: 12,
            sessions_total: 12,
            readiness_score: 85,
            stage: 'AI Native',
            last_active: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            first_name: 'Emma',
            last_name: 'Davis',
            email: 'emma.davis@example.com',
            job_title: 'Director of AI',
            sector: 'Professional Services',
            organisation: 'Consulting Co',
            onboarding_complete: true,
            validator_name: null,
            sessions_completed: 4,
            sessions_total: 12,
            readiness_score: 58,
            stage: 'AI Informed',
            last_active: new Date(Date.now() - 86400000 * 5).toISOString()
          }
        ])
      } catch (err) {
        console.error('Failed to fetch students:', err)
        showToast('Failed to load students', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = search === '' || 
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.organisation?.toLowerCase().includes(search.toLowerCase())
    
    const matchesStage = filters.stage === '' || student.stage === filters.stage
    const matchesSector = filters.sector === '' || student.sector === filters.sector
    const matchesStatus = filters.status === '' || getStatus(student) === filters.status
    
    return matchesSearch && matchesStage && matchesSector && matchesStatus
  })

  // Get status
  const getStatus = (student) => {
    if (student.sessions_completed === student.sessions_total && student.sessions_total > 0) return 'completed'
    const daysSinceActive = (Date.now() - new Date(student.last_active)) / (1000 * 60 * 60 * 24)
    if (daysSinceActive > 7) return 'stalled'
    return 'active'
  }

  // Get progress percentage
  const getProgress = (student) => {
    return Math.round((student.sessions_completed / 12) * 100)
  }

  // Get module status
  const getModuleStatus = (student, moduleNum) => {
    const moduleStart = (moduleNum - 1) * 4
    const moduleEnd = moduleNum * 4
    const completedInModule = Math.max(0, Math.min(student.sessions_completed, moduleEnd) - moduleStart)
    
    if (completedInModule === 4) return 'done'
    if (completedInModule > 0) return 'active'
    return 'pending'
  }

  // Format date
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

  // Handle assign validator
  const handleAssignValidator = async (validatorId) => {
    showToast('Validator assigned successfully!')
    setShowAssignModal(false)
  }

  // Handle add student
  const handleAddStudent = async (data) => {
    showToast('Student added successfully! Invitation sent.')
    setShowAddModal(false)
  }

  if (loading) {
    return (
      <div className="admin-main">
        <div className="empty-state">Loading...</div>
      </div>
    )
  }

  // Calculate stats
  const totalEnrolled = students.length
  const completedProgramme = students.filter(s => s.sessions_completed === 12).length
  const activeThisWeek = students.filter(s => {
    const daysSince = (Date.now() - new Date(s.last_active)) / (1000 * 60 * 60 * 24)
    return daysSince < 7
  }).length
  const avgScore = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + (s.readiness_score || 0), 0) / students.length)
    : 0

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage learner accounts and track progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Enrolled</div>
          <div className="stat-value">{totalEnrolled}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed Programme</div>
          <div className="stat-value green">{completedProgramme}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active This Week</div>
          <div className="stat-value">{activeThisWeek}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Readiness Score</div>
          <div className="stat-value">{avgScore}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="form-select" 
          style={{ width: 'auto' }}
          value={filters.stage}
          onChange={(e) => setFilters({...filters, stage: e.target.value})}
        >
          <option value="">All Stages</option>
          <option value="AI Unaware">AI Unaware</option>
          <option value="AI Curious">AI Curious</option>
          <option value="AI Informed">AI Informed</option>
          <option value="AI Fluent">AI Fluent</option>
          <option value="AI Native">AI Native</option>
        </select>
        <select 
          className="form-select" 
          style={{ width: 'auto' }}
          value={filters.sector}
          onChange={(e) => setFilters({...filters, sector: e.target.value})}
        >
          <option value="">All Sectors</option>
          <option value="Financial Services">Financial Services</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Professional Services">Professional Services</option>
        </select>
        <select 
          className="form-select" 
          style={{ width: 'auto' }}
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="stalled">Stalled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Sector</th>
            <th>Stage</th>
            <th>Score</th>
            <th>Modules</th>
            <th>Progress</th>
            <th>Last Active</th>
            <th>Validator</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id} onClick={() => setSelectedStudent(student)} style={{ cursor: 'pointer' }}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="avatar">
                    {student.first_name[0]}{student.last_name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{student.first_name} {student.last_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{student.job_title}</div>
                  </div>
                </div>
              </td>
              <td>{student.sector}</td>
              <td>{student.stage || '-'}</td>
              <td>{student.readiness_score || '-'}</td>
              <td>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3].map(m => (
                    <span 
                      key={m}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getModuleStatus(student, m) === 'done' ? 'var(--green)' :
                                   getModuleStatus(student, m) === 'active' ? 'var(--amber)' : 'var(--border)'
                      }}
                    />
                  ))}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="progress-bar" style={{ width: '60px' }}>
                    <div className="progress-fill" style={{ width: `${getProgress(student)}%` }} />
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{getProgress(student)}%</span>
                </div>
              </td>
              <td>{formatDate(student.last_active)}</td>
              <td>{student.validator_name || '-'}</td>
              <td>
                <span className={`badge badge-${getStatus(student) === 'completed' ? 'green' : getStatus(student) === 'active' ? 'amber' : 'gray'}`}>
                  {getStatus(student)}
                </span>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAssignModal(true)}
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredStudents.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p>No students found</p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Assign Validator Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Assign Validator</h2>
              <button className="modal-close" onClick={() => setShowAssignModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '20px', color: 'var(--text-dim)' }}>Select a validator for this student:</p>
              {['Prof. Mark Esposito', 'Prof. Terence Tse', 'Danny Goh'].map(validator => (
                <div 
                  key={validator}
                  className="stat-card"
                  style={{ marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => handleAssignValidator(validator)}
                >
                  <div style={{ fontWeight: 600 }}>{validator}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <AddStudentModal 
          onClose={() => setShowAddModal(false)} 
          onSubmit={handleAddStudent} 
        />
      )}
    </div>
  )
}

function AddStudentModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    sector: '',
    organisation: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Student</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
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
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.jobTitle}
                onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sector</label>
              <select 
                className="form-select"
                value={formData.sector}
                onChange={e => setFormData({...formData, sector: e.target.value})}
                required
              >
                <option value="">Select sector</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Professional Services">Professional Services</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Organisation</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.organisation}
                onChange={e => setFormData({...formData, organisation: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Student</button>
          </div>
        </form>
      </div>
    </div>
  )
}
