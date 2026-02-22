'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Learning phases
const PHASES = {
  UNDERSTAND: 'understand',
  TEACH: 'teach',
  ANALYSE: 'analyse',
  FEEDBACK: 'feedback',
  DEEPER: 'deeper',
  COMPLETE: 'complete'
}

const styles = {
  container: {
    maxWidth: '800px',
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
  progressBar: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #222'
  },
  progress: {
    color: '#666',
    fontSize: '14px'
  },
  moduleName: {
    color: '#d4af37',
    fontSize: '12px',
    letterSpacing: '2px',
    marginBottom: '10px',
    fontFamily: 'Inter, sans-serif'
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
  feedbackText: {
    lineHeight: '1.8',
    color: '#ccc',
    marginBottom: '20px'
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
  const [phase, setPhase] = useState(PHASES.UNDERSTAND)
  const [teachResponse, setTeachResponse] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
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

  // Simulated user profile (in real app, get from context/database)
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

  const handleTeachSubmit = async () => {
    if (!teachResponse.trim()) return
    
    setIsAnalyzing(true)
    try {
      // Call the sessions analyse API
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
    } catch (err) {
      console.error('Analysis failed:', err)
      // Fallback for demo
      setAnalysis({
        score: 75,
        feedback: 'Good understanding of the concept! Consider how this applies specifically to your organisation.',
        gap: null
      })
      setPhase(PHASES.FEEDBACK)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNextConcept = () => {
    if (currentConceptIndex < concepts.length - 1) {
      setCurrentConceptIndex(prev => prev + 1)
      setPhase(PHASES.UNDERSTAND)
      setTeachResponse('')
      setAnalysis(null)
    } else if (currentModuleIndex < modules.length - 1) {
      // Move to next module
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

  if (!modules.length) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>No modules available. Please complete onboarding first.</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Progress bar */}
      <div style={styles.progressBar}>
        <div style={styles.progress}>
          Module {currentModuleIndex + 1} of {modules.length}
          {concepts.length > 1 && ` • Concept ${currentConceptIndex + 1} of ${concepts.length}`}
        </div>
      </div>

      {phase === PHASES.UNDERSTAND && conceptData && (
        <>
          <div style={styles.moduleName}>{currentModule?.name}</div>
          <div style={styles.conceptTitle}>{currentConcept?.name}</div>
          
          <div style={styles.content}>
            <div style={styles.bodyText}>
              {conceptData.body_text?.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginBottom: '16px' }}>{para}</p>
              ))}
            </div>

            {/* Key Insight Box */}
            {conceptData.key_insight && (
              <div style={styles.keyInsight}>
                <strong style={{ display: 'block', marginBottom: '10px' }}>💡 Key Insight</strong>
                <p style={{ margin: 0 }}>{conceptData.key_insight}</p>
              </div>
            )}

            {/* Sector Example */}
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
          <div style={styles.moduleName}>{currentModule?.name}</div>
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
          <div style={styles.moduleName}>{currentModule?.name}</div>
          <div style={{...styles.conceptTitle, fontSize: '24px'}}>Your Feedback</div>
          
          <div style={styles.feedback}>
            {analysis?.score && (
              <div style={styles.scoreCard}>
                <div style={styles.score}>{analysis.score}</div>
                <div style={styles.scoreLabel}>SCORE</div>
              </div>
            )}
            
            <div style={styles.feedbackText}>
              <strong style={{ display: 'block', marginBottom: '10px' }}>Feedback:</strong>
              <p>{analysis?.feedback || 'Great work on understanding this concept!'}</p>
            </div>

            {analysis?.primary_gap?.name && (
              <div style={{...styles.example, borderColor: '#e74c3c'}}>
                <strong style={{ display: 'block', marginBottom: '10px', color: '#e74c3c' }}>Area to develop:</strong>
                <p style={{ margin: 0, color: '#999' }}>{analysis.primary_gap.name}</p>
              </div>
            )}
          </div>

          <button 
            style={styles.primaryButton}
            onClick={handleNextConcept}
          >
            {currentConceptIndex < concepts.length - 1 
              ? 'Next Concept →' 
              : currentModuleIndex < modules.length - 1 
                ? 'Next Module →'
                : 'Complete Programme →'}
          </button>
        </>
      )}

      {phase === PHASES.COMPLETE && (
        <div style={styles.complete}>
          <div style={styles.completeIcon}>🎉</div>
          <h2 style={{ fontSize: '32px', marginBottom: '20px', fontFamily: 'Playfair Display, serif' }}>Congratulations!</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>You have completed all modules in the Excellere AI Leadership Programme.</p>
          <button 
            style={styles.primaryButton}
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard →
          </button>
        </div>
      )}
    </div>
  )
}
