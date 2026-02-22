'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/reports')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setReports(data)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStatusBadge = (status) => {
    if (status === 'validated') return <span className="badge badge-green">Validated</span>
    if (status === 'in_progress') return <span className="badge badge-amber">In Progress</span>
    return <span className="badge badge-gray">Pending</span>
  }

  const handleView = (reportId) => {
    window.location.href = `/validate/${reportId}`
  }

  if (loading) return <div className="admin-main"><div className="empty-state">Loading...</div></div>

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Reports</h1><p className="page-subtitle">All generated assessment and programme reports</p></div>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>↻ Refresh</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Reports</div><div className="stat-value">{reports.length}</div></div>
        <div className="stat-card"><div className="stat-label">Validated</div><div className="stat-value green">{reports.filter(r => r.status === 'validated').length}</div></div>
        <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-value amber">{reports.filter(r => r.status === 'pending' || r.status === 'in_progress').length}</div></div>
        <div className="stat-card"><div className="stat-label">This Month</div><div className="stat-value">{reports.length}</div></div>
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
              <td style={{ fontWeight: 600 }}>{report.first_name} {report.last_name}</td>
              <td>{report.report_type || 'Assessment Report'}</td>
              <td>{report.module_id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '-'}</td>
              <td>{getStatusBadge(report.status)}</td>
              <td>{report.validator_name || '-'}</td>
              <td>{report.created_at ? new Date(report.created_at).toLocaleDateString() : '-'}</td>
              <td>
                <button className="btn btn-secondary btn-sm" onClick={() => handleView(report.id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reports.length === 0 && <div className="empty-state"><p>No reports found</p></div>}
    </div>
  )
}
