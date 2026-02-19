'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  const [demoMode, setDemoMode] = useState(false)

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span>Excellere</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.navLink}>Log in</Link>
          <Link href="/signup" className={styles.btnPrimary}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            AI-Native Learning
          </div>
          
          <h1 className={styles.heroTitle}>
            Learn AI strategically.<br />
            <span className={styles.heroTitleAccent}>Not technically.</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            Personalised executive education that adapts to your role, 
            sector, and thinking style. From your first minute.
          </p>
          
          <div className={styles.heroCta}>
            <Link href="/signup" className={styles.btnPrimary}>
              Start Your Journey
              <span className={styles.btnArrow}>→</span>
            </Link>
            <button 
              onClick={() => setDemoMode(!demoMode)}
              className={styles.btnSecondary}
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* Hero Visual */}
        <div className={styles.heroVisual}>
          <div className={styles.demoPreview}>
            <div className={styles.demoHeader}>
              <div className={styles.demoDots}>
                <span></span><span></span><span></span>
              </div>
              <span className={styles.demoTitle}>Excellere</span>
            </div>
            <div className={styles.demoContent}>
              <div className={styles.demoProfile}>
                <div className={styles.demoAvatar}>SC</div>
                <div>
                  <div className={styles.demoName}>Sarah Chen</div>
                  <div className={styles.demoRole}>Head of Strategy, FinTech Co</div>
                </div>
              </div>
              <div className={styles.demoStats}>
                <div className={styles.demoStat}>
                  <span className={styles.demoStatValue}>87%</span>
                  <span className={styles.demoStatLabel}>Mastered</span>
                </div>
                <div className={styles.demoStat}>
                  <span className={styles.demoStatValue}>3</span>
                  <span className={styles.demoStatLabel}>Modules</span>
                </div>
                <div className={styles.demoStat}>
                  <span className={styles.demoStatValue}>12</span>
                  <span className={styles.demoStatLabel}>Sessions</span>
                </div>
              </div>
              <div className={styles.demoProgress}>
                <div className={styles.demoProgressLabel}>Current Module</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width: '65%'}}></div>
                </div>
                <div className={styles.demoProgressText}>AI-Native Business Design • 65%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>
          Built different.<br />
          <span className={styles.sectionTitleAccent}>For leaders like you.</span>
        </h2>
        
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span>🧠</span>
            </div>
            <h3>Cognitive First</h3>
            <p>We build your cognitive profile before teaching anything. Know your thinking style, strengths, and gaps from minute one.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span>🔄</span>
            </div>
            <h3>Adaptive Practice</h3>
            <p>The Understand → Teach → Analyse → Feedback loop adapts in real-time. Questions get harder as you improve.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span>💎</span>
            </div>
            <h3>Personalised Feedback</h3>
            <p>Every response gets feedback that references YOUR role, YOUR sector, YOUR exact words. Not generic advice.</p>
          </div>
        </div>
      </section>

      {/* Modules Preview */}
      <section className={styles.modules}>
        <h2 className={styles.sectionTitle}>
          Three transformative<br />
          <span className={styles.sectionTitleAccent}>modules.</span>
        </h2>
        
        <div className={styles.moduleGrid}>
          <div className={styles.moduleCard}>
            <div className={styles.moduleNumber}>01</div>
            <h3>AI-Native Business Design</h3>
            <p>Audit which of your core processes are AI-native vs AI-augmented. Produce a board-ready document.</p>
            <div className={styles.moduleOutcome}>
              <span>Outcome:</span> AI-Native Firm Audit
            </div>
          </div>
          
          <div className={styles.moduleCard}>
            <div className={styles.moduleNumber}>02</div>
            <h3>Double Loop Strategy</h3>
            <p>Master the strategy framework that separates good leaders from great ones. Apply to your business unit.</p>
            <div className={styles.moduleOutcome}>
              <span>Outcome:</span> Double Loop Strategy Canvas
            </div>
          </div>
          
          <div className={styles.moduleCard}>
            <div className={styles.moduleNumber}>03</div>
            <h3>Agentic AI</h3>
            <p>Identify where agentic AI could replace human-led workflows. Map your opportunities.</p>
            <div className={styles.moduleOutcome}>
              <span>Outcome:</span> Agent Opportunity Map
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>Ready to transform<br />your AI fluency?</h2>
        <p>Join senior leaders who are already ahead of the curve.</p>
        <Link href="/signup" className={styles.btnPrimary}>
          Begin Now
          <span className={styles.btnArrow}>→</span>
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span className={styles.logoIcon}>✦</span>
            <span>Excellere</span>
          </div>
          <p className={styles.footerText}>
            © 2026 Excellere. AI-Native Learning for Business Leaders.
          </p>
        </div>
      </footer>
    </div>
  )
}
