'use client'

import { useState, useEffect } from 'react'

const REPORTS = [
  { id: '1', student: 'Sarah Chen', type: 'Assessment Report', module: 'AI-Native Business Design', status: 'validated', validator: 'Prof. Mark Esposito', date: '2026-02-20' },
  { id: '2', student: 'James Wilson', type: 'Programme Report', module: 'Double Loop Strategy', status: 'validated', validator: 'Prof. Terence Tse', date: '2026-02-18' },
  { id: '3', student: 'Emma Davis', type: 'Assessment Report', module: 'Agentic AI', status: 'pending', validator: null, date: '2026-02-21' },
  { id: '4', student: 'Michael Brown', type: 'Programme Report', module: 'AI-Native Business Design', status: 'pending', validator: 'Danny Goh', date: '2026-02-19' },
]

export default function ReportsPage() {
  const [reports] = useState(REPORTS)

  const getStatusBadge = (status) => {
    return status === 'validated' 
      ? <span className="badge badge-green">Validated</span>
      : <span className="badge badge-amber">Pending</span>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">All generated assessment and programme reports</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Reports</div>
          <div className="stat-value">{reports.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Validated</div>
          <div className="stat-value green">{reports.filter(r => r.status === 'validated').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value amber">{reports.filter(r => r.status === 'pending').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">This Month</div>
          <div className="stat-value">{reports.length}</div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Report Type</th>
            <th>Module</th>
            <th>Status</th>
            <th>Validator</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td style={{ fontWeight: 600 }}>{report.student}</td>
              <td>{report.type}</td>
              <td>{report.module}</td>
              <td>{getStatusBadge(report.status)}</td>
              <td>{report.validator || '-'}</td>
              <td>{report.date}</td>
              <td>
                <button className="btn btn-secondary btn-sm">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
