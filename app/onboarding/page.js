'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './onboarding.module.css'

// Onboarding steps
const STEPS = [
  'identity',    // Step 1: Identity intake
  'scanning',    // Step 2: AI profile building
  'mirror',      // Step 3: Mirror moment
  'calibration', // Step 4: Calibration game
  'fingerprint',  // Step 5: Cognitive fingerprint
  'modules',      // Step 6: Module selection
]

export default function Onboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Identity
    name: '',
    role: '',
    sector: '',
    seniority: '',
    goal: '',
    cvText: '',
    linkedinUrl: '',
    // Calibration
    calibrationAnswers: [],
    // Mirror corrections
    corrections: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  const step = STEPS[currentStep]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding - go to dashboard
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className={styles.container}>
      {/* Progress */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
        </div>
        <div className={styles.progressText}>
          Step {currentStep + 1} of {STEPS.length}
        </div>
      </div>

      {/* Step Content */}
      <div className={styles.content}>
        {step === 'identity' && (
          <IdentityStep 
            formData={formData} 
            setFormData={setFormData} 
            onNext={handleNext}
          />
        )}
        {step === 'scanning' && (
          <ScanningStep 
            formData={formData}
            setProfile={setProfile}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onNext={handleNext}
          />
        )}
        {step === 'mirror' && (
          <MirrorStep 
            profile={profile}
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 'calibration' && (
          <CalibrationStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 'fingerprint' && (
          <FingerprintStep
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 'modules' && (
          <ModuleStep
            profile={profile}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  )
}

// Step 1: Identity Intake
function IdentityStep({ formData, setFormData, onNext }) {
  const sectors = [
    'Financial Services',
    'Healthcare',
    'Technology',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Real Estate',
    'Energy',
    'Media & Entertainment',
    'Other'
  ]

  const roles = [
    'CEO / Managing Director',
    'CFO',
    'COO',
    'CTO / CIO',
    'CMO',
    'Chief Strategy Officer',
    'VP / Director',
    'Head of',
    'Partner',
    'Other'
  ]

  const seniority = [
    'Executive (C-Suite)',
    'SVP / VP',
    'Director',
    'Senior Manager',
    'Manager'
  ]

  const goals = [
    'Lead AI transformation',
    'Understand AI for board discussions',
    'Identify AI opportunities',
    'Build AI strategy',
    'Evaluate AI vendors',
    'Prepare for AI disruption',
    'Other'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <span className={styles.stepNumber}>01</span>
        <h1>Tell us about yourself</h1>
        <p>This helps us personalise your learning experience.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Sarah Chen"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Your Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            >
              <option value="">Select role...</option>
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Sector / Industry</label>
            <select
              value={formData.sector}
              onChange={(e) => setFormData({...formData, sector: e.target.value})}
              required
            >
              <option value="">Select sector...</option>
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Seniority Level</label>
            <select
              value={formData.seniority}
              onChange={(e) => setFormData({...formData, seniority: e.target.value})}
              required
            >
              <option value="">Select level...</option>
              {seniority.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>What brings you to Excellere?</label>
          <select
            value={formData.goal}
            onChange={(e) => setFormData({...formData, goal: e.target.value})}
            required
          >
            <option value="">Select your primary goal...</option>
            {goals.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>CV / Resume (Optional)</label>
          <textarea
            value={formData.cvText}
            onChange={(e) => setFormData({...formData, cvText: e.target.value})}
            placeholder="Paste your CV text here, or upload below..."
            rows={4}
          />
          
          {/* File Upload */}
          <div className={styles.uploadBox}>
            <input
              type="file"
              id="cv-upload"
              accept=".pdf,.docx,.doc,.txt"
              onChange={async (e) => {
                const file = e.target.files[0]
                if (!file) return
                
                try {
                  let text = ''
                  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                    text = await file.text()
                  } else if (file.name.endsWith('.pdf')) {
                    alert('For PDF files, please copy-paste the text content. PDF parsing requires server-side processing.')
                    return
                  } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                    alert('For Word documents, please copy-paste the text content. Doc parsing requires server-side processing.')
                    return
                  }
                  
                  if (text) {
                    setFormData({...formData, cvText: text})
                  }
                } catch (err) {
                  console.error('Error reading file:', err)
                  alert('Error reading file. Please copy-paste your CV text instead.')
                }
              }}
              style={{ display: 'none' }}
            />
            <label htmlFor="cv-upload" className={styles.uploadLabel}>
              <span className={styles.uploadIcon}>📎</span>
              <span>Upload CV (PDF, Word, or Text)</span>
            </label>
            <p className={styles.uploadHint}>Or drag and drop a file</p>
          </div>
        </div>

        <button type="submit" className={styles.btnPrimary}>
          Continue
          <span>→</span>
        </button>
      </form>
    </div>
  )
}

// Step 2: Scanning
function ScanningStep({ formData, setProfile, isLoading, setIsLoading, onNext }) {
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      // Simulate scanning animation
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            // Set mock profile
            setProfile({
              archetype: 'Strategic Reframer',
              strengths: [
                'Deep industry knowledge',
                'Board-level communication',
                'Strategic thinking'
              ],
              gaps: [
                'Technical AI foundations',
                'Data architecture'
              ],
              tags: ['Finance', 'Strategy', 'Transformation'],
              dimensions: {
                strategic_vs_operational: 85,
                conceptual_vs_technical: 70,
                single_vs_double_loop: 90,
                challenge_vs_confirmation: 75
              }
            })
            setTimeout(onNext, 1000)
            return 100
          }
          return prev + 2
        })
      }, 50)
    }
  }, [isLoading])

  const handleStartScan = () => {
    setIsLoading(true)
  }

  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <span className={styles.stepNumber}>02</span>
        <h1>Building your profile</h1>
        <p>Our AI is analysing your background to create a personalized learning path.</p>
      </div>

      {!isLoading ? (
        <div className={styles.scanStart}>
          <button onClick={handleStartScan} className={styles.btnPrimary}>
            Start Analysis
            <span>→</span>
          </button>
        </div>
      ) : (
        <div className={styles.scanning}>
          <div className={styles.scanVisual}>
            <div className={styles.scanCircle}>
              <div className={styles.scanInner}></div>
            </div>
          </div>
          <div className={styles.scanProgress}>
            <div className={styles.scanProgressText}>
              {scanProgress < 30 && 'Analysing professional background...'}
              {scanProgress >= 30 && scanProgress < 60 && 'Mapping cognitive patterns...'}
              {scanProgress >= 60 && scanProgress < 90 && 'Identifying knowledge gaps...'}
              {scanProgress >= 90 && 'Finalising profile...'}
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${scanProgress}%` }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Step 3: Mirror Moment
function MirrorStep({ profile, formData, setFormData, onNext, onBack }) {
  if (!profile) return null

  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <span className={styles.stepNumber}>03</span>
        <h1>This is what we think</h1>
        <p>Does this feel right? Let us know if we'd better.</p>
      </div>

      <div className={styles.mirrorCard}>
        <div className={styles.archetype}>
          <div className={styles.archetypeIcon}>🎯</div>
          <h2>{profile.archetype}</h2>
        </div>

        <div className={styles.profileDetails}>
          <div className={styles.profileSection}>
            <h4>Your Strengths</h4>
            <ul>
              {profile.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className={styles.profileSection}>
            <h4>Knowledge Gaps</h4>
            <ul>
              {profile.gaps.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>

          <div className={styles.profileTags}>
            {profile.tags.map((tag, i) => (
              <span key={i} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className={styles.mirrorActions}>
          <button onClick={onBack} className={styles.btnSecondary}>
            Adjust Profile
          </button>
          <button onClick={onNext} className={styles.btnPrimary}>
            Looks Right
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Step 4: Calibration Game
function CalibrationStep({ formData, setFormData, onNext, onBack }) {
  const questions = [
    {
      id: 1,
      question: "When evaluating a new technology for your business, what's your first step?",
      options: [
        "Request a detailed technical demo from the vendor",
        "Ask peers in your network about their experience",
        "Look for case studies in your specific industry",
        "Estimate the ROI and payback period yourself"
      ]
    },
    {
      id: 2,
      question: "How do you typically approach strategic decisions?",
      options: [
        "Data-driven analysis with clear metrics",
        "Board discussions and consensus building",
        "Pilot programs to test assumptions",
        "Strategic intuition backed by experience"
      ]
    },
    {
      id: 3,
      question: "What's your biggest challenge with AI?",
      options: [
        "Understanding what's technically possible",
        "Building business case for investment",
        "Change management and adoption",
        "Finding the right use cases"
      ]
    }
  ]

  const currentQ = formData.calibrationAnswers.length
  const question = questions[currentQ]

  const handleAnswer = (answer) => {
    setFormData({
      ...formData,
      calibrationAnswers: [...formData.calibrationAnswers, { questionId: question.id, answer }]
    })

    if (currentQ >= questions.length - 1) {
      onNext()
    }
  }

  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <span className={styles.stepNumber}>04</span>
        <h1>Calibration Questions</h1>
        <p>These aren't tests — they help us understand how you think.</p>
      </div>

      <div className={styles.calibration}>
        <div className={styles.questionProgress}>
          Question {currentQ + 1} of {questions.length}
        </div>

        <h3 className={styles.questionText}>{question.question}</h3>

        <div className={styles.options}>
          {question.options.map((option, i) => (
            <button
              key={i}
              className={styles.optionBtn}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Step 5: Cognitive Fingerprint
function FingerprintStep({ formData, onNext, onBack }) {
  const archetype = 'Strategic Reframer'

  const dimensions = [
    { label: 'Strategic vs Operational', value: 85, color: 'var(--accent-teal)' },
    { label: 'Conceptual vs Technical', value: 70, color: 'var(--accent-violet)' },
    { label: 'Single vs Double Loop', value: 90, color: 'var(--accent-gold)' },
    { label: 'Challenge vs Confirmation', value: 75, color: 'var(--accent-teal)' },
  ]

  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <span className={styles.stepNumber}>05</span>
        <h1>Your Cognitive Fingerprint</h1>
        <p>Your unique thinking pattern that shapes how you learn.</p>
      </div>

      <div className={styles.fingerprint}>
        <div className={styles.archetypeBadge}>
          <span className={styles.archetypeIcon}>🎯</span>
          <span>{archetype}</span>
        </div>

        <div className={styles.dimensions}>
          {dimensions.map((dim, i) => (
            <div key={i} className={styles.dimension}>
              <div className={styles.dimensionHeader}>
                <span>{dim.label}</span>
                <span>{dim.value}%</span>
              </div>
              <div className={styles.dimensionBar}>
                <div 
                  className={styles.dimensionFill} 
                  style={{ width: `${dim.value}%`, background: dim.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.fingerprintNote}>
          <p>You learn best through strategic frameworks and peer discussions. 
          Technical details should be translated to business outcomes.</p>
        </div>

        <div className={styles.fingerprintActions}>
          <button onClick={onBack} className={styles.btnSecondary}>
            Back
          </button>
          <button onClick={onNext} className={styles.btnPrimary}>
            Continue
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Step 6: Module Selection
function ModuleStep({ profile, onNext, onBack }) {
  const modules = [
    {
      id: 1,
      name: 'AI-Native Business Design',
      description: 'Audit which processes are AI-native vs augmented',
      outcome: 'AI-Native Firm Audit',
      tailored: 'Tailored for strategic leaders in Financial Services',
      icon: '🎯'
    },
    {
      id: 2,
      name: 'Double Loop Strategy',
      description: 'Master the strategy framework for AI transformation',
      outcome: 'Double Loop Strategy Canvas',
      tailored: 'Focuses on board-level communication',
      icon: '🔄'
    },
    {
      id: 3,
      name: 'Agentic AI',
      description: 'Identify opportunities for agentic AI in your workflows',
      outcome: 'Agent Opportunity Map',
      tailored: 'Practical implementation focus',
      icon: '🤖'
    }
  ]

  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <span className={styles.stepNumber}>06</span>
        <h1>Your Personalized Modules</h1>
        <p>Based on your profile, these are your recommended starting points.</p>
      </div>

      <div className={styles.modulesList}>
        {modules.map((mod) => (
          <div key={mod.id} className={styles.moduleOption}>
            <div className={styles.moduleIcon}>{mod.icon}</div>
            <div className={styles.moduleContent}>
              <h3>{mod.name}</h3>
              <p>{mod.description}</p>
              <div className={styles.moduleOutcome}>
                <span>Outcome:</span> {mod.outcome}
              </div>
              <div className={styles.moduleTailored}>
                ✦ {mod.tailored}
              </div>
            </div>
            <button className={styles.btnSelect}>Select</button>
          </div>
        ))}
      </div>

      <div className={styles.moduleActions}>
        <button onClick={onBack} className={styles.btnSecondary}>
          Back
        </button>
        <button onClick={onNext} className={styles.btnPrimary}>
          Start Learning
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
