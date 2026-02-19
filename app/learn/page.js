'use client'

import { useState } from 'react'
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

// Sample module data
const MODULE_DATA = {
  id: 1,
  name: 'AI-Native Business Design',
  concept: {
    id: 'ai-native-design',
    title: 'What is an AI-Native Business?',
    body: `An AI-native business is one that is built from the ground up with AI as a core capability, not as an add-on.

Unlike traditional businesses that layer AI onto existing processes, AI-native businesses:

• Design workflows around AI capabilities first
• Use AI for decision-making at every level
• Build data infrastructure as foundational
• Treat AI as competitive advantage, not efficiency tool

The key difference: AI-augmented businesses use AI to do what humans do, faster. AI-native businesses do what AI does best - processing vast data, finding patterns, optimizing at scale.`,
    examples: [
      'Netflix: AI recommends content, optimizes licensing, predicts viewer preferences',
      'Amazon: AI predicts demand, optimizes logistics, personalizes shopping',
      'Spotify: AI curates playlists, predicts listener preferences'
    ]
  }
}

export default function Learn() {
  const [phase, setPhase] = useState(PHASES.UNDERSTAND)
  const [teachResponse, setTeachResponse] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  // Simulated user profile
  const userProfile = {
    name: 'Sarah',
    role: 'Head of Strategy',
    sector: 'FinTech',
    archetype: 'Strategic Reframer'
  }

  const handleTeachSubmit = () => {
    if (!teachResponse.trim()) return
    setPhase(PHASES.ANALYSE)
    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        scores: {
          concept_accuracy: 75,
          applied_to_context: 80,
          compounding_argument: 65,
          clarity_for_non_technical: 85
        },
        gaps: ['compounding_mechanism', 'data_infrastructure'],
        strengths: ['correct_understanding_of_core_concept', 'good_business_context'],
        personalised_feedback: {
          what_you_got_right: 'You correctly identified that AI-native businesses design workflows around AI capabilities, not just add AI to existing processes.',
          the_gap: "You didn't mention the compounding mechanism - how each AI improvement applies to every future decision automatically, creating exponential returns.",
          tailored_for_sector: 'In FinTech, this is especially powerful. Each model improvement instantly benefits every credit decision, fraud detection, and customer interaction - with zero additional cost.'
        },
        next_difficulty: 'hard',
        next_question_targeting: "Probe the learner's understanding of how AI-native creates sustainable competitive advantage vs temporary efficiency gains."
      })
      setIsAnalyzing(false)
      setPhase(PHASES.FEEDBACK)
    }, 2000)
  }

  const handleDeeperQuestion = () => {
    setPhase(PHASES.DEEPER)
  }

  const handleComplete = () => {
    setPhase(PHASES.COMPLETE)
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.backLink}>← Back to Dashboard</div>
        <div className={styles.moduleName}>{MODULE_DATA.name}</div>
        <div className={styles.userBadge}>{userProfile.name}</div>
      </header>

      {/* Progress */}
      <div className={styles.progressContainer}>
        <div className={styles.phases}>
          {Object.values(PHASES).filter(p => p !== 'complete').map((p, i) => (
            <div 
              key={p} 
              className={`${styles.phase} ${phase === p ? styles.phaseActive : ''} ${Object.values(PHASES).indexOf(phase) > i ? styles.phaseDone : ''}`}
            >
              <div className={styles.phaseDot}></div>
              <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className={styles.main}>
        {phase === PHASES.UNDERSTAND && (
          <UnderstandPhase 
            concept={MODULE_DATA.concept} 
            onComplete={() => setPhase(PHASES.TEACH)} 
          />
        )}

        {phase === PHASES.TEACH && (
          <TeachPhase 
            concept={MODULE_DATA.concept}
            response={teachResponse}
            setResponse={setTeachResponse}
            onSubmit={handleTeachSubmit}
          />
        )}

        {phase === PHASES.ANALYSE && (
          <AnalysePhase isAnalyzing={isAnalyzing} />
        )}

        {phase === PHASES.FEEDBACK && analysis && (
          <FeedbackPhase 
            analysis={analysis}
            userProfile={userProfile}
            onDeeper={handleDeeperQuestion}
          />
        )}

        {phase === PHASES.DEEPER && (
          <DeeperPhase 
            concept={MODULE_DATA.concept}
            previousGap={analysis?.gaps[0]}
            onComplete={handleComplete}
          />
        )}

        {phase === PHASES.COMPLETE && (
          <CompletePhase />
        )}
      </main>
    </div>
  )
}

// Phase: Understand
function UnderstandPhase({ concept, onComplete }) {
  return (
    <div className={styles.phaseContent}>
      <div className={styles.conceptHeader}>
        <span className={styles.phaseLabel}>UNDERSTAND</span>
        <h1>{concept.title}</h1>
      </div>

      <div className={styles.conceptBody}>
        {concept.body.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className={styles.examples}>
        <h3>Examples</h3>
        {concept.examples.map((ex, i) => (
          <div key={i} className={styles.example}>
            <span className={styles.exampleIcon}>💡</span>
            {ex}
          </div>
        ))}
      </div>

      <button className={styles.btnPrimary} onClick={onComplete}>
        I've read it — now teach it back
        <span>→</span>
      </button>
    </div>
  )
}

// Phase: Teach
function TeachPhase({ concept, response, setResponse, onSubmit }) {
  return (
    <div className={styles.phaseContent}>
      <div className={styles.conceptHeader}>
        <span className={styles.phaseLabel}>TEACH</span>
        <h1>Explain to a colleague</h1>
        <p className={styles.teachPrompt}>
          Imagine you're explaining this to a colleague who doesn't know AI. 
          What would you say? Be specific to {concept.sector || 'your sector'}.
        </p>
      </div>

      <textarea
        className={styles.teachInput}
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Start typing your explanation..."
        rows={10}
      />

      <button 
        className={styles.btnPrimary} 
        onClick={onSubmit}
        disabled={!response.trim()}
      >
        Submit for analysis
        <span>→</span>
      </button>
    </div>
  )
}

// Phase: Analyse
function AnalysePhase({ isAnalyzing }) {
  return (
    <div className={styles.phaseContent}>
      <div className={styles.analyseVisual}>
        <div className={styles.analyseCircle}>
          <div className={styles.analyseInner}></div>
        </div>
      </div>
      <h2>Analysing your explanation...</h2>
      <p>Our AI is comparing your response against the concept, your profile, and your sector context.</p>
    </div>
  )
}

// Phase: Feedback
function FeedbackPhase({ analysis, userProfile, onDeeper }) {
  const { scores, gaps, strengths, personalised_feedback } = analysis

  return (
    <div className={styles.phaseContent}>
      <div className={styles.feedbackHeader}>
        <span className={styles.phaseLabel}>FEEDBACK</span>
        <h1>Your Personalised Feedback</h1>
      </div>

      {/* Scores */}
      <div className={styles.scoresGrid}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreValue} style={{ color: 'var(--accent-teal)' }}>
            {scores.concept_accuracy}%
          </div>
          <div className={styles.scoreLabel}>Concept Accuracy</div>
        </div>
        <div className={styles.scoreCard}>
          <div className={styles.scoreValue} style={{ color: 'var(--accent-violet)' }}>
            {scores.applied_to_context}%
          </div>
          <div className={styles.scoreLabel}>Context Applied</div>
        </div>
        <div className={styles.scoreCard}>
          <div className={styles.scoreValue} style={{ color: 'var(--accent-gold)' }}>
            {scores.compounding_argument}%
          </div>
          <div className={styles.scoreLabel}>Compounding Argument</div>
        </div>
      </div>

      {/* Personalised Feedback */}
      <div className={styles.feedbackCard}>
        <div className={styles.feedbackSection}>
          <h3>✓ What you got right</h3>
          <p>{personalised_feedback.what_you_got_right}</p>
        </div>

        <div className={styles.feedbackSection}>
          <h3>🎯 The gap</h3>
          <p>{personalised_feedback.the_gap}</p>
        </div>

        <div className={styles.feedbackSection}>
          <h3>💼 In your context ({userProfile.sector})</h3>
          <p>{personalised_feedback.tailored_for_sector}</p>
        </div>
      </div>

      <button className={styles.btnPrimary} onClick={onDeeper}>
        Let me probe deeper
        <span>→</span>
      </button>
    </div>
  )
}

// Phase: Deeper
function DeeperPhase({ concept, previousGap, onComplete }) {
  const question = previousGap === 'compounding_mechanism'
    ? "How would you measure if the compounding effect of AI is creating sustainable competitive advantage for a FinTech company, versus just temporary efficiency gains?"
    : "How would you explain the data infrastructure requirements to a non-technical board?"

  return (
    <div className={styles.phaseContent}>
      <div className={styles.conceptHeader}>
        <span className={styles.phaseLabel}>DEEPER</span>
        <h1>Follow-up Question</h1>
        <p className={styles.teachPrompt}>{question}</p>
      </div>

      <textarea
        className={styles.teachInput}
        placeholder="Your answer..."
        rows={8}
      />

      <button className={styles.btnPrimary} onClick={onComplete}>
        Submit
        <span>→</span>
      </button>
    </div>
  )
}

// Phase: Complete
function CompletePhase() {
  return (
    <div className={styles.phaseContent}>
      <div className={styles.completeVisual}>🎉</div>
      <h1>Concept Mastered!</h1>
      <p>You've completed this concept. The next question will build on this learning.</p>
      
      <div className={styles.completeActions}>
        <button className={styles.btnPrimary}>
          Next Concept
          <span>→</span>
        </button>
        <button className={styles.btnSecondary}>
          Review
        </button>
      </div>
    </div>
  )
}
