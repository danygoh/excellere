'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [refinedProfile, setRefinedProfile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    sector: '',
    goal: '',
    cvText: ''
  });
  const [calibrationAnswers, setCalibrationAnswers] = useState({});
  const [selectedModules, setSelectedModules] = useState(['ai-native-business-design']);
  
  const router = useRouter();

  // Calibration questions (embedded)
  const calibrationQuestions = [
    {
      id: 1,
      question: "Your CEO says: 'We need to deploy AI or we'll fall behind.' Your first instinct is to ask which question?",
      options: [
        { id: 'A', text: "Behind on what, exactly? That answer changes everything." },
        { id: 'B', text: "Which AI tools are our competitors already using?" },
        { id: 'C', text: "Do we have the data infrastructure to support AI at scale?" },
        { id: 'D', text: "What's our risk appetite given regulatory exposure?" }
      ]
    },
    {
      id: 2,
      question: "Monzo builds features with AI designing the first version; humans review exceptions. A traditional bank has humans design with AI assisting. What's the strategic difference?",
      options: [
        { id: 'A', text: "Monzo is faster and cheaper — a process efficiency advantage" },
        { id: 'B', text: "They're both using AI — the difference is mostly cultural" },
        { id: 'C', text: "Monzo's process compounds — every AI improvement raises the whole team. The bank's is bounded by human capacity" },
        { id: 'D', text: "Monzo takes more risk by reducing human oversight" }
      ]
    },
    {
      id: 3,
      question: "A major insurer uses AI to process claims 60% faster with the same accuracy. The Board celebrates. The Strategy Director stays quiet. Why might she be the only one asking the right question?",
      options: [
        { id: 'A', text: "She's worried about the jobs that will be displaced" },
        { id: 'B', text: "She's questioning whether claims processing is still a defensible part of the value chain — or whether AI just made it a commodity anyone can replicate" },
        { id: 'C', text: "She's concerned accuracy metrics don't capture edge cases" },
        { id: 'D', text: "She's thinking about the regulatory implications" }
      ]
    }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 2: Submit profile for inference
  const handleProfileSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding/infer-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: formData.role,
          sector: formData.sector,
          goal: formData.goal,
          cvText: formData.cvText
        })
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setStep(4); // Go to mirror moment
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Step 6: Submit calibration for refinement
  const handleCalibrationSubmit = async () => {
    setLoading(true);
    try {
      const answers = Object.entries(calibrationAnswers).map(([qId, answer]) => ({
        question_id: parseInt(qId),
        answer
      }));
      
      const res = await fetch('/api/onboarding/calibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initialProfile: profile,
          answers
        })
      });
      const data = await res.json();
      if (data.success) {
        setRefinedProfile(data.profile);
        setStep(7); // Go to module selection
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Complete onboarding
  const handleComplete = () => {
    // Save user to localStorage (would be database in production)
    const user = {
      id: 'user_' + Date.now(),
      ...formData,
      profile: refinedProfile || profile,
      onboarding_complete: true,
      modules: selectedModules
    };
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/dashboard');
  };

  const sectors = [
    'Financial Services',
    'Healthcare',
    'Technology',
    'Manufacturing',
    'Retail',
    'Professional Services',
    'Media & Entertainment',
    'Energy & Utilities',
    'Real Estate',
    'Other'
  ];

  const roles = [
    'CEO / Executive',
    'CFO / Finance Leader',
    'CTO / Technology Leader',
    'COO / Operations Leader',
    'CDO / Chief Data Officer',
    'VP / Director',
    'Senior Manager',
    'Board Member',
    'Founder',
    'Other'
  ];

  const goals = [
    'Lead AI transformation at my organisation',
    'Build AI-native business strategies',
    'Understand AI for board-level decisions',
    'Transition to an AI-first role',
    'Drive innovation with AI',
    'Other'
  ];

  return (
    <div style={{ background: '#000', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Progress Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: '#111', zIndex: 100 }}>
        <div style={{ 
          height: '100%', 
          background: '#d4af37', 
          width: `${(step / 8) * 100}%`,
          transition: 'width 0.3s ease'
        }} />
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* Step 1: Landing */}
        {step === 1 && (
          <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✦</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', color: '#fff', marginBottom: '16px', letterSpacing: '2px' }}>
              EXCELLERE
            </h1>
            <p style={{ color: '#888', fontSize: '18px', marginBottom: '40px' }}>
              Build your AI leadership credential
            </p>
            
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.8', marginBottom: '40px' }}>
              A personalized learning programme validated by world-renowned faculty.<br/>
              Three modules. One assessment. A credential that means something.
            </p>
            
            <button 
              onClick={() => setStep(2)}
              style={{ background: '#d4af37', color: '#000', border: 'none', padding: '16px 40px', fontSize: '14px', fontWeight: 600, letterSpacing: '1px', cursor: 'pointer' }}
            >
              BEGIN →
            </button>
          </div>
        )}

        {/* Step 2: Identity Intake */}
        {step === 2 && (
          <div>
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '30px', textAlign: 'center' }}>
              Tell us about yourself
            </h2>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  style={{ background: '#0a0a0a', border: '1px solid #222', padding: '14px', color: '#fff', fontSize: '14px' }}
                />
                <input
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  style={{ background: '#0a0a0a', border: '1px solid #222', padding: '14px', color: '#fff', fontSize: '14px' }}
                />
              </div>
              
              <input
                name="email"
                type="email"
                placeholder="Work email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ background: '#0a0a0a', border: '1px solid #222', padding: '14px', color: '#fff', fontSize: '14px' }}
              />
              
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                style={{ background: '#0a0a0a', border: '1px solid #222', padding: '14px', color: formData.role ? '#fff' : '#666', fontSize: '14px' }}
              >
                <option value="">Select your role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              
              <select
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                style={{ background: '#0a0a0a', border: '1px solid #222', padding: '14px', color: formData.sector ? '#fff' : '#666', fontSize: '14px' }}
              >
                <option value="">Select your sector</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                style={{ background: '#0a0a0a', border: '1px solid #222', padding: '14px', color: formData.goal ? '#fff' : '#666', fontSize: '14px' }}
              >
                <option value="">What do you want to achieve?</option>
                {goals.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              
              <textarea
                name="cvText"
                placeholder="Brief background (optional): years of experience, key achievements, current responsibilities..."
                value={formData.cvText}
                onChange={handleInputChange}
                rows={4}
                style={{ background: '#0a0a0a', border: '1px solid #222', padding: '14px', color: '#fff', fontSize: '14px', resize: 'none' }}
              />
            </div>
            
            <button 
              onClick={handleProfileSubmit}
              disabled={loading || !formData.role || !formData.sector || !formData.goal}
              style={{ 
                background: '#d4af37', 
                color: '#000', 
                border: 'none', 
                padding: '16px 40px', 
                fontSize: '14px', 
                fontWeight: 600, 
                cursor: 'pointer',
                marginTop: '30px',
                width: '100%',
                opacity: loading || !formData.role || !formData.sector || !formData.goal ? 0.5 : 1
              }}
            >
              {loading ? 'ANALYSING...' : 'CONTINUE →'}
            </button>
          </div>
        )}

        {/* Step 3: Scanning Animation */}
        {step === 3 && (
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              border: '2px solid #d4af37', 
              borderRadius: '50%', 
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                border: '2px solid #d4af37', 
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
            </div>
            <p style={{ color: '#d4af37', fontSize: '14px', letterSpacing: '2px' }}>
              ARIA IS ANALYSING YOUR PROFILE
            </p>
            <p style={{ color: '#444', fontSize: '12px', marginTop: '20px' }}>
              Learning how you think...
            </p>
          </div>
        )}

        {/* Step 4: Mirror Moment */}
        {step === 4 && profile && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <span style={{ color: '#d4af37', fontSize: '14px', letterSpacing: '2px' }}>YOUR THINKING PROFILE</span>
            </div>
            
            <div style={{ 
              background: '#0a0a0a', 
              border: '1px solid #222', 
              padding: '30px',
              borderRadius: '8px',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: '#d4af37', fontSize: '28px', marginBottom: '10px', fontFamily: 'Playfair Display, serif' }}>
                {profile.archetype}
              </h3>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.8', marginBottom: '20px' }}>
                {profile.archetype_description}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
                <div>
                  <div style={{ color: '#444', fontSize: '10px', letterSpacing: '1px', marginBottom: '4px' }}>STRATEGIC VS OPERATIONAL</div>
                  <div style={{ color: '#fff', fontSize: '20px' }}>{profile.dimensions?.strategic_vs_operational || 50}%</div>
                </div>
                <div>
                  <div style={{ color: '#444', fontSize: '10px', letterSpacing: '1px', marginBottom: '4px' }}>DOUBLE LOOP</div>
                  <div style={{ color: '#fff', fontSize: '20px' }}>{profile.dimensions?.single_vs_double_loop || 50}%</div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setStep(5)}
              style={{ background: '#d4af37', color: '#000', border: 'none', padding: '16px 40px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%' }}
            >
              THAT'S ME — CONTINUE →
            </button>
            
            <button 
              onClick={() => setStep(2)}
              style={{ background: 'transparent', color: '#666', border: 'none', padding: '16px', fontSize: '12px', cursor: 'pointer', width: '100%', marginTop: '10px' }}
            >
              Not quite right? Go back →
            </button>
          </div>
        )}

        {/* Step 5: Calibration Game */}
        {step === 5 && (
          <div>
            <p style={{ color: '#444', fontSize: '12px', marginBottom: '20px', textAlign: 'center' }}>
              Three quick questions to refine your profile
            </p>
            
            {calibrationQuestions.map((q, idx) => (
              <div key={q.id} style={{ marginBottom: '30px' }}>
                <p style={{ color: '#fff', fontSize: '14px', marginBottom: '16px' }}>
                  <span style={{ color: '#d4af37', marginRight: '8px' }}>{idx + 1}.</span>
                  {q.question}
                </p>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {q.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCalibrationAnswers({ ...calibrationAnswers, [q.id]: opt.id })}
                      style={{ 
                        background: calibrationAnswers[q.id] === opt.id ? '#d4af37' : '#0a0a0a',
                        color: calibrationAnswers[q.id] === opt.id ? '#000' : '#888',
                        border: `1px solid ${calibrationAnswers[q.id] === opt.id ? '#d4af37' : '#222'}`,
                        padding: '14px',
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            <button 
              onClick={handleCalibrationSubmit}
              disabled={loading || Object.keys(calibrationAnswers).length < 3}
              style={{ 
                background: '#d4af37', 
                color: '#000', 
                border: 'none', 
                padding: '16px 40px', 
                fontSize: '14px', 
                fontWeight: 600, 
                cursor: 'pointer',
                width: '100%',
                opacity: loading || Object.keys(calibrationAnswers).length < 3 ? 0.5 : 1
              }}
            >
              {loading ? 'REFINING...' : 'COMPLETE CALIBRATION →'}
            </button>
          </div>
        )}

        {/* Step 6: Fingerprint Reveal */}
        {step === 6 && refinedProfile && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>
              Your Cognitive Fingerprint
            </h2>
            
            <div style={{ 
              background: '#0a0a0a', 
              border: '1px solid #d4af37', 
              padding: '24px',
              borderRadius: '8px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <p style={{ color: '#d4af37', fontSize: '14px', marginBottom: '12px' }}>
                Your insight:
              </p>
              <p style={{ color: '#fff', fontSize: '16px', fontStyle: 'italic', lineHeight: '1.6' }}>
                "{refinedProfile.fingerprint_insight}"
              </p>
            </div>
            
            <button 
              onClick={() => setStep(7)}
              style={{ background: '#d4af37', color: '#000', border: 'none', padding: '16px 40px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              CONTINUE →
            </button>
          </div>
        )}

        {/* Step 7: Module Selection */}
        {step === 7 && (
          <div>
            <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '20px', textAlign: 'center' }}>
              Choose your modules
            </h2>
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '30px', textAlign: 'center' }}>
              We recommend the full programme, but you can choose
            </p>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { id: 'ai-native-business-design', name: 'AI-Native Business Design', desc: 'Audit your processes for AI-native vs augmented', icon: '🎯' },
                { id: 'double-loop-strategy', name: 'Double Loop Strategy', desc: 'Master the strategy framework for AI transformation', icon: '🔄' },
                { id: 'agentic-ai', name: 'Agentic AI', desc: 'Identify opportunities for autonomous AI agents', icon: '🤖' }
              ].map(mod => (
                <label
                  key={mod.id}
                  style={{ 
                    background: selectedModules.includes(mod.id) ? '#0a0a0a' : '#050505',
                    border: `1px solid ${selectedModules.includes(mod.id) ? '#d4af37' : '#222'}`,
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(mod.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedModules([...selectedModules, mod.id]);
                      } else {
                        setSelectedModules(selectedModules.filter(m => m !== mod.id));
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>{mod.icon}</span>
                  <div>
                    <div style={{ color: '#fff', fontSize: '14px' }}>{mod.name}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{mod.desc}</div>
                  </div>
                  {selectedModules.includes(mod.id) && (
                    <span style={{ marginLeft: 'auto', color: '#d4af37' }}>✓</span>
                  )}
                </label>
              ))}
            </div>
            
            <button 
              onClick={handleComplete}
              disabled={selectedModules.length === 0}
              style={{ 
                background: '#d4af37', 
                color: '#000', 
                border: 'none', 
                padding: '16px 40px', 
                fontSize: '14px', 
                fontWeight: 600, 
                cursor: 'pointer',
                width: '100%',
                marginTop: '30px',
                opacity: selectedModules.length === 0 ? 0.5 : 1
              }}
            >
              START LEARNING →
            </button>
          </div>
        )}

      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
