'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './dashboard.module.css'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock user data
  const user = {
    name: 'Sarah',
    role: 'Head of Strategy',
    sector: 'FinTech',
    archetype: 'Strategic Reframer',
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

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span>✦</span> Excellere
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
            <span>👤</span> Profile
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.cognitiveBadge}>
            <span>🧠</span>
            <div>
              <div className={styles.badgeTitle}>{user.archetype}</div>
              <div className={styles.badgeSubtitle}>Your Cognitive Style</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1>Welcome back, {user.name}</h1>
            <p>Continue your AI learning journey</p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/learn" className={styles.btnPrimary}>
              Continue Learning →
            </Link>
          </div>
        </header>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className={styles.content}>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{user.progress.overall}%</div>
                <div className={styles.statLabel}>Overall Progress</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width: `${user.progress.overall}%`}}></div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{user.sessions}</div>
                <div className={styles.statLabel}>Sessions Completed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{user.artefacts.length}</div>
                <div className={styles.statLabel}>Artefacts In Progress</div>
              </div>
            </div>

            {/* Next Session */}
            <div className={styles.nextSession}>
              <h3>Next Session</h3>
              <div className={styles.sessionCard}>
                <div className={styles.sessionType}>{user.nextSession.type}</div>
                <div className={styles.sessionTopic}>{user.nextSession.topic}</div>
                <div className={styles.sessionTime}>{user.nextSession.time}</div>
                <Link href="/learn" className={styles.btnPrimary}>
                  Start Now
                </Link>
              </div>
            </div>

            {/* Module Progress */}
            <div className={styles.moduleProgress}>
              <h3>Your Modules</h3>
              <div className={styles.modulesList}>
                {user.progress.modules.map(mod => (
                  <div key={mod.id} className={styles.moduleItem}>
                    <div className={styles.moduleInfo}>
                      <div className={styles.moduleName}>{mod.name}</div>
                      <div className={styles.moduleStatus}>
                        <span className={`${styles.statusBadge} ${styles[mod.status]}`}>
                          {mod.status}
                        </span>
                      </div>
                    </div>
                    <div className={styles.moduleProgress}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{width: `${mod.progress}%`}}></div>
                      </div>
                      <span>{mod.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className={styles.content}>
            <h2>All Modules</h2>
            <div className={styles.modulesGrid}>
              {user.progress.modules.map(mod => (
                <div key={mod.id} className={styles.moduleCard}>
                  <div className={styles.moduleCardHeader}>
                    <span className={styles.moduleNumber}>0{mod.id}</span>
                    <span className={`${styles.statusBadge} ${styles[mod.status]}`}>
                      {mod.status}
                    </span>
                  </div>
                  <h3>{mod.name}</h3>
                  <div className={styles.moduleProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{width: `${mod.progress}%`}}></div>
                    </div>
                    <span>{mod.progress}%</span>
                  </div>
                  {mod.status === 'active' && (
                    <Link href="/learn" className={styles.btnSecondary}>
                      Continue
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className={styles.content}>
            <h2>Learning Modes</h2>
            <div className={styles.modesGrid}>
              <div className={styles.modeCard}>
                <div className={styles.modeIcon}>🤖</div>
                <h3>AI Practice</h3>
                <p>Solo AI sessions with personalized feedback</p>
                <span className={styles.modeStatus}>Available Now</span>
              </div>
              <div className={styles.modeCard}>
                <div className={styles.modeIcon}>🎬</div>
                <h3>Async Content</h3>
                <p>Recorded practitioner lectures with annotations</p>
                <span className={styles.modeStatus}>Coming Soon</span>
              </div>
              <div className={styles.modeCard}>
                <div className={styles.modeIcon}>👥</div>
                <h3>Live Cohort</h3>
                <p>Small group (8-12) facilitated sessions</p>
                <span className={styles.modeStatus}>Coming Soon</span>
              </div>
              <div className={styles.modeCard}>
                <div className={styles.modeIcon}>💬</div>
                <h3>Office Hours</h3>
                <p>Drop-in Q&A with practitioners</p>
                <span className={styles.modeStatus}>Coming Soon</span>
              </div>
              <div className={styles.modeCard}>
                <div className={styles.modeIcon}>🎓</div>
                <h3>1-2-1 Coaching</h3>
                <p>Private sessions with senior practitioners</p>
                <span className={styles.modeStatus}>Coming Soon</span>
              </div>
            </div>
          </div>
        )}

        {/* Artefacts Tab */}
        {activeTab === 'artefacts' && (
          <div className={styles.content}>
            <h2>Your Artefacts</h2>
            <p className={styles.sectionDesc}>
              Every module produces a concrete deliverable — not a certificate.
            </p>
            <div className={styles.artefactsList}>
              {user.artefacts.map(art => (
                <div key={art.id} className={styles.artefactCard}>
                  <h3>{art.name}</h3>
                  <div className={styles.artefactStrength}>
                    <span>Strength:</span>
                    <div className={styles.strengthMeter}>
                      <div className={styles.strengthFill} style={{width: `${art.strength}%`}}></div>
                    </div>
                    <span>{art.strength}%</span>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[art.status.replace('_', '')]}`}>
                    {art.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className={styles.content}>
            <h2>Your Cognitive Profile</h2>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.avatar}>{user.name[0]}</div>
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.role}, {user.sector}</p>
                </div>
              </div>
              <div className={styles.archetypeDisplay}>
                <span>🎯</span>
                <div>
                  <div className={styles.archetypeTitle}>{user.archetype}</div>
                  <div className={styles.archetypeDesc}>Your Cognitive Style</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
