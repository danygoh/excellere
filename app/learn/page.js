'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './learn.module.css'

// Learning phases
const PHASES = {
  UNDERSTAND: 'understand',
  TEACH: 'teach',
  ANALYSE: 'analyse',
  FEEDBACK: 'feedback',
  DEEPER: 'deeper',
  COMPLETE: 'complete'
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
      setAnalysis(data)
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
      <div className={styles.container}>
        <div className={styles.loading}>Loading your learning programme...</div>
      </div>
    )
  }

  if (!modules.length) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>No modules available. Please complete onboarding first.</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progress}>
          Module {currentModuleIndex + 1} of {modules.length}
          {concepts.length > 1 && ` • Concept ${currentConceptIndex + 1} of ${concepts.length}`}
        </div>
      </div>

      {phase === PHASES.UNDERSTAND && conceptData && (
        <>
          <div className={styles.moduleName}>{currentModule?.name}</div>
          <div className={styles.conceptTitle}>{currentConcept?.name}</div>
          
          <div className={styles.content}>
            <div className={styles.bodyText}>
              {conceptData.body_text?.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Key Insight Box */}
            {conceptData.key_insight && (
              <div className={styles.keyInsight}>
                <strong>💡 Key Insight</strong>
                <p>{conceptData.key_insight}</p>
              </div>
            )}

            {/* Sector Example */}
            {conceptData.sector_example && (
              <div className={styles.example}>
                <strong>Example ({userProfile.sector}):</strong>
                <p>{conceptData.sector_example}</p>
              </div>
            )}
          </div>

          <button 
            className={styles.primaryButton}
            onClick={() => setPhase(PHASES.TEACH)}
          >
            I understand this concept →
          </button>
        </>
      )}

      {phase === PHASES.TEACH && (
        <>
          <div className={styles.moduleName}>{currentModule?.name}</div>
          <div className={styles.conceptTitle}>Teach Back: {currentConcept?.name}</div>
          
          <div className={styles.teachPrompt}>
            <strong>Your scenario:</strong>
            <p>{currentConcept?.teach_prompt || 'Explain this concept as if teaching someone else.'}</p>
          </div>

          <textarea
            className={styles.textarea}
            placeholder="Write your response here..."
            value={teachResponse}
            onChange={(e) => setTeachResponse(e.target.value)}
            rows={8}
          />

          <div className={styles.buttonRow}>
            <button 
              className={styles.secondaryButton}
              onClick={() => setPhase(PHASES.UNDERSTAND)}
            >
              ← Review Concept
            </button>
            <button 
              className={styles.primaryButton}
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
          <div className={styles.moduleName}>{currentModule?.name}</div>
          <div className={styles.conceptTitle}>Your Feedback</div>
          
          <div className={styles.feedback}>
            {analysis?.score && (
              <div className={styles.scoreCard}>
                <div className={styles.score}>{analysis.score}</div>
                <div className={styles.scoreLabel}>Score</div>
              </div>
            )}
            
            <div className={styles.feedbackText}>
              <strong>Feedback:</strong>
              <p>{analysis?.feedback || 'Great work on understanding this concept!'}</p>
            </div>

            {analysis?.gap && (
              <div className={styles.gap}>
                <strong>Area to develop:</strong>
                <p>{analysis.gap}</p>
              </div>
            )}
          </div>

          <button 
            className={styles.primaryButton}
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
        <div className={styles.complete}>
          <div className={styles.completeIcon}>🎉</div>
          <h2>Congratulations!</h2>
          <p>You have completed all modules in the Excellere AI Leadership Programme.</p>
          <button 
            className={styles.primaryButton}
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard →
          </button>
        </div>
      )}
    </div>
  )
}
