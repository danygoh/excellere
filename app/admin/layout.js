import Link from 'next/link'
import './admin.css'

export default function AdminLayout({ children }) {
  const navItems = [
    { href: '/admin/students', label: 'Students', icon: '👥' },
    { href: '/admin/validation', label: 'Validation Queue', icon: '✓' },
    { href: '/admin/questions', label: 'Assessment Questions', icon: '?' },
    { href: '/admin/concepts', label: 'Course Concepts', icon: '📚' },
    { href: '/admin/validators', label: 'Validators', icon: '🎓' },
    { href: '/admin/reports', label: 'Reports', icon: '📊' },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link href="/admin" className="admin-logo">✦ ADMIN</Link>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className="nav-item">
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Link href="/dashboard" className="nav-item">
            <span className="nav-icon">←</span>
            <span className="nav-label">Back to Dashboard</span>
          </Link>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
