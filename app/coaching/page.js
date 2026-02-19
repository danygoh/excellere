'use client'

import { useState } from 'react'
import styles from './coaching.module.css'

export default function Coaching() {
  const [selectedCoach, setSelectedCoach] = useState(null)
  const [step, setStep] = useState('select') // select, Artefact, confirm
  
  // Coach profiles
  const coaches = [
    {
      id: 1,
      name: 'Dr. James Wilson',
      role: 'Senior AI Strategy Consultant',
      expertise: ['AI Strategy', 'Board Presentations', 'Digital Transformation'],
      rating: 4.9,
      sessions: 156,
      bio: 'Former CTO of Fortune 500 company. Specializes in helping executives understand AI at board level.',
      price: '$500/session'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'FinTech AI Leader',
      expertise: ['FinTech AI', 'Product Strategy', 'AI Governance'],
      rating: 4.8,
      sessions: 89,
      bio: 'Led AI initiatives at major FinTech unicorn. Expert in financial services AI applications.',
      price: '$450/session'
    },
    {
      id: 3,
      name: 'Robert Kim',
      role: 'Board Advisor & Ex-CEO',
      expertise: ['Board Prep', 'CEO Coaching', 'AI Investment'],
      rating: 4.95,
      sessions: 234,
      bio: 'Former CEO with 20 years board experience. Helps executives prepare for AI-driven board discussions.',
      price: '$750/session'
    }
  ]

  // Artefacts ready for review
  const artefacts = [
    { id: 1, name: 'AI-Native Firm Audit', status: 'ready', strength: 72 },
    { id: 2, name: 'Double Loop Canvas', status: 'draft', strength: 45 },
  ]

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>← Back to Dashboard</div>
        <h1>1-2-1 Coaching</h1>
        <div></div>
      </header>

      <div className={styles.main}>
        {step === 'select' && (
          <>
            <div className={styles.content}>
              <div className={styles.section}>
                <h2>Select Your Coach</h2>
                <div className={styles.coachesGrid}>
                  {coaches.map(coach => (
                    <div 
                      key={coach.id} 
                      className={`${styles.coachCard} ${selectedCoach?.id === coach.id ? styles.selected : ''}`}
                      onClick={() => setSelectedCoach(coach)}
                    >
                      <div className={styles.coachAvatar}>{coach.name.split(' ').map(n => n[0]).join('')}</div>
                      <div className={styles.coachInfo}>
                        <h3>{coach.name}</h3>
                        <div className={styles.coachRole}>{coach.role}</div>
                        <div className={styles.coachExpertise}>
                          {coach.expertise.map((e, i) => (
                            <span key={i} className={styles.tag}>{e}</span>
                          ))}
                        </div>
                        <div className={styles.coachStats}>
                          <span>⭐ {coach.rating}</span>
                          <span>•</span>
                          <span>{coach.sessions} sessions</span>
                        </div>
                      </div>
                      <div className={styles.coachPrice}>{coach.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCoach && (
                <div className={styles.bioSection}>
                  <h3>About {selectedCoach.name}</h3>
                  <p>{selectedCoach.bio}</p>
                  <button className={styles.btnPrimary} onClick={() => setStep('artefact')}>
                    Continue to Artefact Selection
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {step === 'artefact' && (
          <div className={styles.content}>
            <div className={styles.section}>
              <h2>Select Artefact for Review</h2>
              <p className={styles.sectionDesc}>Which artefact would you like to review in your coaching session?</p>
              
              <div className={styles.artefactsList}>
                {artefacts.map(artefact => (
                  <div key={artefact.id} className={styles.artefactOption}>
                    <div className={styles.artefactInfo}>
                      <h4>{artefact.name}</h4>
                      <span className={`${styles.badge} ${artefact.status === 'ready' ? styles.ready : styles.draft}`}>
                        {artefact.status}
                      </span>
                    </div>
                    <div className={styles.strengthBar}>
                      <span>Strength: {artefact.strength}%</span>
                      <div className={styles.bar}>
                        <div style={{width: `${artefact.strength}%`}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.btnPrimary} onClick={() => setStep('confirm')}>
                Confirm Booking
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className={styles.content}>
            <div className={styles.confirmCard}>
              <span className={styles.confirmIcon}>✅</span>
              <h2>Booking Confirmed!</h2>
              <p>Your 1-2-1 coaching session has been scheduled.</p>
              
              <div className={styles.confirmDetails}>
                <div><strong>Coach:</strong> {selectedCoach?.name}</div>
                <div><strong>Artefact:</strong> AI-Native Firm Audit</div>
                <div><strong>Duration:</strong> 60 minutes</div>
              </div>

              <p className={styles.confirmNote}>You'll receive a calendar invite with the video call link.</p>
              
              <button className={styles.btnSecondary} onClick={() => { setStep('select'); setSelectedCoach(null); }}>
                Book Another Session
              </button>
            </div>
          </div>
        )}

        <aside className={styles.sidebar}>
          <h3>What to Expect</h3>
          <ul className={styles.expectList}>
            <li>60-minute dedicated session</li>
            <li>Review your artefact draft</li>
            <li>Get personalized feedback</li>
            <li>Expert guidance on next steps</li>
            <li>Actionable recommendations</li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
