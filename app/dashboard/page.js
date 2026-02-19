'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '../../context/UserContext'
import styles from './dashboard.module.css'

export default function Dashboard() {
  const router = useRouter()
  const { user, logout } = useUser()
  const [activeTab, setActiveTab] = useState('overview')

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return <div className={styles.loading}>Loading...</div>
  }

  // Use user data or defaults
  const userData = {
    name: user.name || 'User',
    role: user.role || 'Learner',
    sector: user.sector || 'General',
    archetype: user.cognitiveFingerprint?.archetype || 'Explorer',
    progress: {
      overall: 35,
      modules: [
        { id: 1, name: 'AI-Native Business Design', progress: 65, status: 'active' },
        { id: 2, name: 'Double Loop Strategy', progress: 20, status: 'locked' },
        { id: 3, name: 'Agentic AI', progress: 0, status: 'locked' }
      ]
    },
    sessions: 12,
    artefacts: [
      { id: 1, name: 'AI-Native Firm Audit', status: 'in_progress', strength: 45 }
    ],
    nextSession: {
      type: 'AI Practice',
      topic: 'AI-Native Design',
      time: 'Today, 2:00 PM'
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Link href="/dashboard"><span>✦</span> Excellere</Link>
        </div>
        
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span> Overview
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'modules' ? styles.active : ''}`}
            onClick={() => setActiveTab('modules')}
          >
            <span>📚</span> Modules
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'sessions' ? styles.active : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            <span>🎯</span> Sessions
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'artefacts' ? styles.active : ''}`}
            onClick={() => setActiveTab('artefacts')}
          >
            <span>💎</span> Artefacts
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span>🧠</span> Profile
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{userData.name[0]}</div>
            <div>
              <div className={styles.userName}>{userData.name}</div>
              <div className={styles.userRole}>{userData.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1>Welcome back, {userData.name}</h1>
            <p>Continue your AI learning journey</p>
          </div>
          <Link href="/learn" className={styles.continueBtn}>
            Continue Learning →
          </Link>
        </header>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className={styles.content}>
            {/* Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{userData.progress.overall}%</div>
                <div className={styles.statLabel}>Overall Progress</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{userData.sessions}</div>
                <div className={styles.statLabel}>Sessions Completed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{userData.artefacts.length}</div>
                <div className={styles.statLabel}>Artefacts Created</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>🔥</div>
                <div className={styles.statLabel}>7 Day Streak</div>
              </div>
            </div>

            {/* Current Module */}
            <div className={styles.section}>
              <h2>Current Module</h2>
              <div className={styles.moduleCard}>
                <div className={styles.moduleInfo}>
                  <h3>AI-Native Business Design</h3>
                  <p>Learn to audit your organization's AI maturity</p>
                </div>
                <div className={styles.moduleProgress}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{width: '65%'}}></div>
                  </div>
                  <span>65% Complete</span>
                </div>
                <Link href="/learn" className={styles.moduleBtn}>
                  Continue →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.section}>
              <h2>Continue Learning</h2>
              <div className={styles.actionsGrid}>
                <Link href="/learn" className={styles.actionCard}>
                  <span className={styles.actionIcon}>🎯</span>
                  <div>
                    <h4>Practice Session</h4>
                    <p>Apply what you've learned</p>
                  </div>
                </Link>
                <Link href="/content" className={styles.actionCard}>
                  <span className={styles.actionIcon}>🎬</span>
                  <div>
                    <h4>Watch Content</h4>
                    <p>Async video lessons</p>
                  </div>
                </Link>
                <Link href="/live" className={styles.actionCard}>
                  <span className={styles.actionIcon}>👥</span>
                  <div>
                    <h4>Join Live</h4>
                    <p>Cohort sessions</p>
                  </div>
                </Link>
                <Link href="/office-hours" className={styles.actionCard}>
                  <span className={styles.actionIcon}>📅</span>
                  <div>
                    <h4>Book Office Hours</h4>
                    <p>Expert coaching</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className={styles.content}>
            <h2>Your Modules</h2>
            <div className={styles.modulesList}>
              {userData.progress.modules.map(module => (
                <div key={module.id} className={styles.moduleItem}>
                  <div className={styles.moduleNumber}>{module.id}</div>
                  <div className={styles.moduleDetails}>
                    <h3>{module.name}</h3>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{width: `${module.progress}%`}}></div>
                    </div>
                  </div>
                  <div className={styles.moduleStatus}>
                    <span className={`${styles.statusBadge} ${styles[module.status]}`}>
                      {module.status === 'active' ? 'In Progress' : module.status === 'completed' ? 'Completed' : 'Locked'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className={styles.content}>
            <h2>Learning Sessions</h2>
            <div className={styles.sessionsList}>
              <div className={styles.sessionItem}>
                <div className={styles.sessionIcon}>✅</div>
                <div className={styles.sessionInfo}>
                  <h3>Introduction to AI-Native Business</h3>
                  <p>Completed on Feb 15, 2026</p>
                </div>
              </div>
              <div className={styles.sessionItem}>
                <div className={styles.sessionIcon}>✅</div>
                <div className={styles.sessionInfo}>
                  <h3>Cognitive Profile Calibration</h3>
                  <p>Completed on Feb 14, 2026</p>
                </div>
              </div>
              <div className={styles.sessionItem}>
                <div className={styles.sessionIcon}>📅</div>
                <div className={styles.sessionInfo}>
                  <h3>AI Practice: Double Loop Strategy</h3>
                  <p>Scheduled for Feb 20, 2026</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Artefacts Tab */}
        {activeTab === 'artefacts' && (
          <div className={styles.content}>
            <h2>Your Artefacts</h2>
            <div className={styles.artefactsGrid}>
              {userData.artefacts.map(artefact => (
                <div key={artefact.id} className={styles.artefactCard}>
                  <h3>{artefact.name}</h3>
                  <div className={styles.artefactStrength}>
                    <span>Strength: {artefact.strength}%</span>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{width: `${artefact.strength}%`}}></div>
                    </div>
                  </div>
                  <Link href="/artefact" className={styles.artefactBtn}>
                    Continue Editing →
                  </Link>
                </div>
              ))}
              <Link href="/artefact" className={styles.artefactNew}>
                <span>+</span>
                <p>Create New Artefact</p>
              </Link>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className={styles.content}>
            <h2>Your Cognitive Profile</h2>
            <div className={styles.profileCard}>
              <div className={styles.archetype}>
                <span className={styles.archetypeIcon}>🧠</span>
                <h3>{userData.archetype}</h3>
              </div>
              <div className={styles.dimensions}>
                <div className={styles.dimension}>
                  <label>Strategic vs Operational</label>
                  <div className={styles.dimensionBar}>
                    <div style={{width: '85%'}}></div>
                  </div>
                </div>
                <div className={styles.dimension}>
                  <label>Conceptual vs Technical</label>
                  <div className={styles.dimensionBar}>
                    <div style={{width: '70%'}}></div>
                  </div>
                </div>
                <div className={styles.dimension}>
                  <label>Single vs Double Loop</label>
                  <div className={styles.dimensionBar}>
                    <div style={{width: '90%'}}></div>
                  </div>
                </div>
                <div className={styles.dimension}>
                  <label>Challenge vs Confirmation</label>
                  <div className={styles.dimensionBar}>
                    <div style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
