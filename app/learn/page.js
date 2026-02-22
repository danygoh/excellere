'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Learning phases
const PHASES = {
  SELECT: 'select',  // New: Module selection
  UNDERSTAND: 'understand',
  TEACH: 'teach',
  FEEDBACK: 'feedback',
  COMPLETE: 'complete'
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Inter, sans-serif',
    background: '#000',
    minHeight: '100vh',
    color: '#fff'
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    padding: '60px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid #222'
  },
  logo: {
    color: '#d4af37',
    fontSize: '14px',
    letterSpacing: '4px',
    cursor: 'pointer'
  },
  backBtn: {
    background: 'transparent',
    color: '#666',
    border: '1px solid #333',
    padding: '10px 20px',
    fontSize: '12px',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  moduleCard: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '30px',
    marginBottom: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  moduleNum: {
    color: '#444',
    fontSize: '12px',
    letterSpacing: '2px',
    marginBottom: '10px'
  },
  moduleName: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '28px',
    color: '#fff',
    marginBottom: '10px'
  },
  moduleDesc: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  moduleOutcome: {
    display: 'inline-block',
    background: '#d4af37',
    color: '#000',
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: '600',
    borderRadius: '4px'
  },
  progressBar: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #222',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progress: {
    color: '#666',
    fontSize: '14px'
  },
  conceptNav: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  conceptDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    cursor: 'pointer',
    border: '1px solid #333'
  },
  conceptDotActive: {
    background: '#d4af37',
    color: '#000',
    border: 'none'
  },
  conceptDotDone: {
    background: '#222',
    color: '#2ecc71',
    border: '1px solid #2ecc71'
  },
  conceptTitle: {
    fontSize: '32px',
    fontFamily: 'Playfair Display, serif',
    marginBottom: '30px',
    color: '#fff'
  },
  content: {
    background: '#0a0a0a',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '1px solid #222'
  },
  bodyText: {
    lineHeight: '1.8',
    color: '#ccc',
    fontSize: '16px'
  },
  keyInsight: {
    background: 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '30px',
    color: '#000'
  },
  example: {
    background: '#111',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
    borderLeft: '3px solid #d4af37'
  },
  teachPrompt: {
    background: '#0a0a0a',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #222'
  },
  textarea: {
    width: '100%',
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    color: '#fff',
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif',
    minHeight: '200px',
    marginBottom: '20px',
    resize: 'vertical'
  },
  primaryButton: {
    background: '#d4af37',
    color: '#000',
    border: 'none',
    padding: '16px 32px',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '1px',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  secondaryButton: {
    background: 'transparent',
    color: '#666',
    border: '1px solid #333',
    padding: '16px 32px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  buttonRow: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'space-between'
  },
  feedback: {
    background: '#0a0a0a',
    padding: '30px',
    borderRadius: '8px',
    border: '1px solid #222'
  },
  scoreCard: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  score: {
    fontSize: '72px',
    fontWeight: '700',
    color: '#d4af37',
    fontFamily: 'Playfair Display, serif'
  },
  scoreLabel: {
    fontSize: '14px',
    color: '#666',
    letterSpacing: '2px'
  },
  complete: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  completeIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  }
}

export default function Learn() {
  const [phase, setPhase] = useState(PHASES.SELECT)
  const [teachResponse, setTeachResponse] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [completedConcepts, setCompletedConcepts] = useState([])
  const [modules, setModules] = useState([])
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  // Fetch modules from API
  useEffect(() => {
    async function fetchModules() {
      try {
        const res = await fetch('/api/content/modules')
        const data = await res.json()
        if (data.success && data.modules) {
          setModules(data.modules)
        }
      } catch (err) {
        console.error('Failed to fetch modules:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchModules()
  }, [])

  // Get current module and concept
  const currentModule = modules[currentModuleIndex]
  const concepts = currentModule?.concepts || []
  const currentConcept = concepts[currentConceptIndex]

  // Simulated user profile
  const userProfile = {
    name: 'Learner',
    role: 'Business Leader',
    sector: 'Financial Services'
  }

  // Fetch full concept data
  const [conceptData, setConceptData] = useState(null)
  useEffect(() => {
    async function fetchConcept() {
      if (!currentConcept?.id) return
      try {
        const res = await fetch(`/api/content/concepts/${currentConcept.id}?sector=${userProfile.sector}`)
        const data = await res.json()
        if (data.success) {
          setConceptData(data.concept)
        }
      } catch (err) {
        console.error('Failed to fetch concept:', err)
      }
    }
    fetchConcept()
  }, [currentConcept])

  const startModule = (index) => {
    setCurrentModuleIndex(index)
    setCurrentConceptIndex(0)
    setCompletedConcepts([])
    setPhase(PHASES.UNDERSTAND)
  }

  const handleTeachSubmit = async () => {
    if (!teachResponse.trim()) return
    
    setIsAnalyzing(true)
    try {
      const res = await fetch('/api/sessions/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: currentConcept.id,
          response: teachResponse,
          userId: 'demo-user'
        })
      })
      const data = await res.json()
      setAnalysis(data.analysis)
      setPhase(PHASES.FEEDBACK)
      
      // Mark concept as completed
      const conceptKey = `${currentModuleIndex}-${currentConceptIndex}`
      if (!completedConcepts.includes(conceptKey)) {
        setCompletedConcepts([...completedConcepts, conceptKey])
      }
    } catch (err) {
      console.error('Analysis failed:', err)
      setAnalysis({
        score: 75,
        feedback: 'Good understanding of the concept!',
        primary_gap: null
      })
      setPhase(PHASES.FEEDBACK)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const goToConcept = (index) => {
    setCurrentConceptIndex(index)
    setPhase(PHASES.UNDERSTAND)
    setTeachResponse('')
    setAnalysis(null)
  }

  const handleNextConcept = () => {
    if (currentConceptIndex < concepts.length - 1) {
      setCurrentConceptIndex(prev => prev + 1)
      setPhase(PHASES.UNDERSTAND)
      setTeachResponse('')
      setAnalysis(null)
    } else if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1)
      setCurrentConceptIndex(0)
      setPhase(PHASES.UNDERSTAND)
      setTeachResponse('')
      setAnalysis(null)
    } else {
      setPhase(PHASES.COMPLETE)
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading your learning programme...</div>
      </div>
    )
  }

  // PHASE: SELECT MODULE
  if (phase === PHASES.SELECT) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logo} onClick={() => router.push('/dashboard')}>
            ✦ EXCELLERE
          </div>
          <Link href="/dashboard">
            <button style={styles.backBtn}>← Back to Dashboard</button>
          </Link>
        </div>

        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', marginBottom: '10px' }}>
          Choose a Module
        </h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>
          Select a module to continue your learning journey
        </p>

        {modules.map((module, index) => {
          const moduleKey = `${index}`
          const isStarted = completedConcepts.some(c => c.startsWith(moduleKey))
          
          return (
            <div 
              key={module.id}
              style={styles.moduleCard}
              onClick={() => startModule(index)}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#d4af37'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#222'}
            >
              <div style={styles.moduleNum}>MODULE {index + 1}</div>
              <div style={styles.moduleName}>{module.name}</div>
              <div style={styles.moduleDesc}>{module.description}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={styles.moduleOutcome}>→ {module.outcome}</span>
                {isStarted && <span style={{ color: '#2ecc71', fontSize: '12px' }}>✓ In Progress</span>}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // PHASE: COMPLETE
  if (phase === PHASES.COMPLETE) {
    return (
      <div style={styles.container}>
        <div style={styles.complete}>
          <div style={styles.completeIcon}>🎉</div>
          <h2 style={{ fontSize: '32px', marginBottom: '20px', fontFamily: 'Playfair Display, serif' }}>Congratulations!</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>You have completed all modules in the Excellere AI Leadership Programme.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link href="/dashboard">
              <button style={styles.secondaryButton}>← Back to Dashboard</button>
            </Link>
            <button style={styles.primaryButton} onClick={() => setPhase(PHASES.SELECT)}>
              Choose Another Module →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // PHASES: UNDERSTAND, TEACH, FEEDBACK
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ ...styles.logo, cursor: 'pointer' }} onClick={() => setPhase(PHASES.SELECT)}>
          ✦ EXCELLERE
        </div>
        <Link href="/dashboard">
          <button style={styles.backBtn}>← Exit to Dashboard</button>
        </Link>
      </div>

      {/* Progress */}
      <div style={styles.progressBar}>
        <div style={styles.progress}>
          <span style={{ color: '#d4af37' }}>{currentModule?.name}</span>
          {' • '}
          Concept {currentConceptIndex + 1} of {concepts.length}
        </div>
        <div style={styles.conceptNav}>
          {concepts.map((_, idx) => {
            const isDone = completedConcepts.includes(`${currentModuleIndex}-${idx}`)
            const isActive = idx === currentConceptIndex
            return (
              <div
                key={idx}
                style={{
                  ...styles.conceptDot,
                  ...(isActive ? styles.conceptDotActive : {}),
                  ...(isDone && !isActive ? styles.conceptDotDone : {})
                }}
                onClick={() => goToConcept(idx)}
              >
                {isDone ? '✓' : idx + 1}
              </div>
            )
          })}
        </div>
      </div>

      {phase === PHASES.UNDERSTAND && conceptData && (
        <>
          <div style={styles.conceptTitle}>{currentConcept?.name}</div>
          
          <div style={styles.content}>
            <div style={styles.bodyText}>
              {conceptData.body_text?.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginBottom: '16px' }}>{para}</p>
              ))}
            </div>

            {conceptData.key_insight && (
              <div style={styles.keyInsight}>
                <strong style={{ display: 'block', marginBottom: '10px' }}>💡 Key Insight</strong>
                <p style={{ margin: 0 }}>{conceptData.key_insight}</p>
              </div>
            )}

            {conceptData.sector_example && (
              <div style={styles.example}>
                <strong style={{ display: 'block', marginBottom: '10px', color: '#d4af37' }}>Example ({userProfile.sector}):</strong>
                <p style={{ margin: 0, color: '#999' }}>{conceptData.sector_example}</p>
              </div>
            )}
          </div>

          <button 
            style={styles.primaryButton}
            onClick={() => setPhase(PHASES.TEACH)}
          >
            I understand this concept →
          </button>
        </>
      )}

      {phase === PHASES.TEACH && (
        <>
          <div style={{...styles.conceptTitle, fontSize: '24px'}}>Teach Back: {currentConcept?.name}</div>
          
          <div style={styles.teachPrompt}>
            <strong style={{ display: 'block', marginBottom: '10px' }}>Your scenario:</strong>
            <p style={{ margin: 0, color: '#999' }}>{currentConcept?.teach_prompt || 'Explain this concept as if teaching someone else.'}</p>
          </div>

          <textarea
            style={styles.textarea}
            placeholder="Write your response here..."
            value={teachResponse}
            onChange={(e) => setTeachResponse(e.target.value)}
          />

          <div style={styles.buttonRow}>
            <button 
              style={styles.secondaryButton}
              onClick={() => setPhase(PHASES.UNDERSTAND)}
            >
              ← Review Concept
            </button>
            <button 
              style={styles.primaryButton}
              onClick={handleTeachSubmit}
              disabled={!teachResponse.trim() || isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Submit for Feedback →'}
            </button>
          </div>
        </>
      )}

      {phase === PHASES.FEEDBACK && (
        <>
          <div style={{...styles.conceptTitle, fontSize: '24px'}}>Your Feedback</div>
          
          <div style={styles.feedback}>
            {analysis?.score && (
              <div style={styles.scoreCard}>
                <div style={styles.score}>{analysis.score}</div>
                <div style={styles.scoreLabel}>SCORE</div>
              </div>
            )}
            
            <div style={styles.bodyText}>
              <strong style={{ display: 'block', marginBottom: '10px' }}>Feedback:</strong>
              <p>{analysis?.feedback || 'Great work on understanding this concept!'}</p>
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button 
              style={styles.secondaryButton}
              onClick={() => goToConcept(currentConceptIndex)}
            >
              ← Re-do Concept
            </button>
            <button 
              style={styles.primaryButton}
              onClick={handleNextConcept}
            >
              {currentConceptIndex < concepts.length - 1 
                ? 'Next Concept →' 
                : currentModuleIndex < modules.length - 1 
                  ? 'Next Module →'
                  : 'Finish Programme →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
