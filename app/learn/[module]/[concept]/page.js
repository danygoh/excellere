'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function LearnConcept() {
  const params = useParams();
  const router = useRouter();
  const { module: moduleId, concept: conceptId } = params;
  
  const [user, setUser] = useState(null);
  const [concept, setConcept] = useState(null);
  const [phase, setPhase] = useState('understand'); // understand, teach, analyse, feedback, deeper, complete
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [teachResponse, setTeachResponse] = useState('');
  const [deeperResponse, setDeeperResponse] = useState('');
  const [timeOnConcept, setTimeOnConcept] = useState(0);
  const [checkboxes, setCheckboxes] = useState({});
  
  useEffect(() => {
    // Get user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
    
    // Fetch concept
    fetch(`/api/learn/concepts?module=${moduleId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const foundConcept = data.module?.concepts?.find(c => c.id === conceptId);
          // For now, use a simple concept object
          setConcept({
            id: conceptId,
            name: foundConcept?.name || conceptId,
            description: foundConcept?.description || '',
            body_text: getConceptBody(conceptId),
            teach_prompt: getTeachPrompt(conceptId)
          });
        }
      });
  }, [moduleId, conceptId]);
  
  // Timer for time on concept
  useEffect(() => {
    if (phase === 'understand') {
      const timer = setInterval(() => {
        setTimeOnConcept(t => t + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  const handleSubmitTeach = async () => {
    if (teachResponse.trim().split(/\s+/).length < 40) {
      alert('Please write at least 40 words');
      return;
    }
    
    setLoading(true);
    setPhase('analyse');
    
    try {
      const res = await fetch('/api/sessions/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          conceptId,
          teachResponse,
          userProfile: user?.profile || user,
          difficulty: 'medium'
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
        
        // Store session
        await fetch('/api/modules/complete', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            moduleId,
            sessionData: {
              concept_id: conceptId,
              topic: concept?.name,
              teach_back_response: teachResponse,
              ai_analysis: data.analysis,
              phase_reached: 'feedback',
              completed: true,
              completed_at: new Date().toISOString()
            }
          })
        });
        
        setPhase('feedback');
      }
    } catch (error) {
      console.error(error);
    }
    
    setLoading(false);
  };

  const handleSubmitDeeper = async () => {
    if (deeperResponse.trim().split(/\s+/).length < 30) {
      alert('Please write at least 30 words');
      return;
    }
    
    setLoading(true);
    
    // Analyze deeper response
    try {
      const res = await fetch('/api/sessions/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          conceptId: conceptId + '_deeper',
          teachResponse: deeperResponse,
          userProfile: user?.profile || user,
          difficulty: 'hard'
        })
      });
      
      const data = await res.json();
      
      if (data.success && data.analysis?.overall_strength >= 80) {
        // Mark as mastered
        setPhase('complete');
      } else {
        // Still feedback
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error(error);
    }
    
    setLoading(false);
  };

  if (!concept) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', padding: '60px', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        background: '#0a0a0a', 
        borderBottom: '1px solid #222',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100
      }}>
        <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Dashboard
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#444', fontSize: '12px' }}>{concept.name}</span>
          <span style={{ color: '#d4af37', fontSize: '10px', letterSpacing: '1px', background: '#d4af3711', padding: '4px 8px' }}>
            {phase.toUpperCase()}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 60px' }}>
        
        {/* Phase Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
          {['understand', 'teach', 'analyse', 'feedback', 'deeper'].map((p, i) => (
            <div key={p} style={{ 
              flex: 1, 
              height: '3px', 
              background: phase === p ? '#d4af37' : (['understand', 'teach', 'analyse', 'feedback', 'deeper'].indexOf(phase) > i ? '#2ecc71' : '#222'),
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {/* Phase: Understand */}
        {phase === 'understand' && (
          <div>
            <h1 style={{ color: '#fff', fontSize: '28px', fontFamily: 'Playfair Display, serif', marginBottom: '8px' }}>
              {concept.name}
            </h1>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>
              Read carefully. Check the boxes when you're ready to proceed.
            </p>
            
            <div style={{ 
              background: '#0a0a0a', 
              border: '1px solid #222', 
              padding: '30px', 
              borderRadius: '8px',
              color: '#ccc',
              fontSize: '15px',
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap'
            }}>
              {concept.body_text}
            </div>
            
            {/* Comprehension checkboxes */}
            <div style={{ marginTop: '30px' }}>
              <p style={{ color: '#444', fontSize: '12px', marginBottom: '16px' }}>Confirm your understanding:</p>
              {[
                'I can explain the key difference between AI-augmented and AI-native',
                'I understand why mindset matters more than technology for AI-native',
                'I can apply this to my own organisation context'
              ].map((item, i) => (
                <label key={i} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '12px',
                  background: checkboxes[i] ? '#d4af3711' : '#050505',
                  border: `1px solid ${checkboxes[i] ? '#d4af37' : '#222'}`,
                  marginBottom: '8px',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox" 
                    checked={!!checkboxes[i]}
                    onChange={() => setCheckboxes({ ...checkboxes, [i]: !checkboxes[i] })}
                    style={{ accentColor: '#d4af37' }}
                  />
                  <span style={{ color: checkboxes[i] ? '#fff' : '#666', fontSize: '14px' }}>{item}</span>
                </label>
              ))}
            </div>
            
            <button 
              onClick={() => setPhase('teach')}
              disabled={Object.keys(checkboxes).length < 2 || timeOnConcept < 45}
              style={{ 
                background: '#d4af37', 
                color: '#000', 
                border: 'none', 
                padding: '16px 32px', 
                fontSize: '14px', 
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '30px',
                opacity: Object.keys(checkboxes).length < 2 || timeOnConcept < 45 ? 0.5 : 1
              }}
            >
              READY TO TEACH →
            </button>
            
            <p style={{ color: '#444', fontSize: '11px', marginTop: '12px' }}>
              Time on concept: {Math.floor(timeOnConcept / 60)}:{(timeOnConcept % 60).toString().padStart(2, '0')}
            </p>
          </div>
        )}

        {/* Phase: Teach */}
        {phase === 'teach' && (
          <div>
            <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '20px' }}>
              Teach Back
            </h2>
            
            <div style={{ 
              background: '#0a0a0a', 
              border: '1px solid #222', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#d4af37', fontSize: '12px', marginBottom: '8px' }}>YOUR CHALLENGE:</p>
              <p style={{ color: '#fff', fontSize: '16px', fontStyle: 'italic' }}>
                {concept.teach_prompt}
              </p>
            </div>
            
            <textarea
              value={teachResponse}
              onChange={(e) => setTeachResponse(e.target.value)}
              placeholder="Write your explanation here... (minimum 40 words)"
              rows={10}
              style={{ 
                background: '#050505', 
                border: '1px solid #222', 
                padding: '16px', 
                color: '#fff', 
                fontSize: '14px',
                width: '100%',
                resize: 'none'
              }}
            />
            
            <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
              Word count: {teachResponse.trim().split(/\s+/).filter(w => w).length} (minimum 40)
            </p>
            
            <button 
              onClick={handleSubmitTeach}
              disabled={loading || teachResponse.trim().split(/\s+/).length < 40}
              style={{ 
                background: '#d4af37', 
                color: '#000', 
                border: 'none', 
                padding: '16px 32px', 
                fontSize: '14px', 
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '20px',
                opacity: loading || teachResponse.trim().split(/\s+/).length < 40 ? 0.5 : 1
              }}
            >
              {loading ? 'ANALYSING...' : 'SUBMIT FOR ANALYSIS →'}
            </button>
          </div>
        )}

        {/* Phase: Analyse */}
        {phase === 'analyse' && (
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              border: '3px solid #d4af37', 
              borderRadius: '50%', 
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                border: '3px solid #d4af37', 
                borderRadius: '50%',
                animation: 'pulse 1.5s infinite'
              }} />
            </div>
            <p style={{ color: '#d4af37', fontSize: '14px', letterSpacing: '2px' }}>
              ARIA IS READING YOUR RESPONSE
            </p>
            <p style={{ color: '#444', fontSize: '12px', marginTop: '20px' }}>
              Analysing your understanding...
            </p>
          </div>
        )}

        {/* Phase: Feedback */}
        {phase === 'feedback' && analysis && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <span style={{ color: '#2ecc71', fontSize: '12px', letterSpacing: '2px' }}>✓ ASSESSMENT COMPLETE</span>
            </div>
            
            {/* Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '30px' }}>
              {Object.entries(analysis.scores || {}).map(([key, value]) => (
                <div key={key} style={{ background: '#0a0a0a', border: '1px solid #222', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ color: '#444', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div style={{ color: '#fff', fontSize: '24px', fontWeight: 600 }}>{value}%</div>
                </div>
              ))}
            </div>
            
            {/* Feedback */}
            <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '24px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ color: '#2ecc71', fontSize: '14px', marginBottom: '12px' }}>✓ What You Got Right</h3>
              <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.7' }}>
                {analysis.feedback?.what_you_got_right}
              </p>
            </div>
            
            <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '24px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ color: '#e74c3c', fontSize: '14px', marginBottom: '12px' }}>↗ The Gap</h3>
              <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.7' }}>
                {analysis.feedback?.the_gap}
              </p>
            </div>
            
            <div style={{ background: '#0a0a0a', border: '1px solid #d4af37', padding: '24px', borderRadius: '8px', marginBottom: '30px' }}>
              <h3 style={{ color: '#d4af37', fontSize: '14px', marginBottom: '12px' }}>💡 Tailored Insight</h3>
              <p style={{ color: '#fff', fontSize: '14px', lineHeight: '1.7' }}>
                {analysis.feedback?.tailored_insight}
              </p>
            </div>
            
            {/* Next Action */}
            {analysis.overall_strength >= 85 ? (
              <div>
                <p style={{ color: '#2ecc71', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
                  Excellent work! Ready for a deeper question?
                </p>
                <button 
                  onClick={() => setPhase('deeper')}
                  style={{ background: '#d4af37', color: '#000', border: 'none', padding: '16px 32px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%' }}
                >
                  GO DEEPER →
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
                  Review and try again to strengthen your understanding.
                </p>
                <button 
                  onClick={() => { setPhase('understand'); setTeachResponse(''); }}
                  style={{ background: '#222', color: '#fff', border: 'none', padding: '16px 32px', fontSize: '14px', cursor: 'pointer', width: '100%' }}
                >
                  REVIEW CONCEPT →
                </button>
              </div>
            )}
            
            <button 
              onClick={() => router.push('/dashboard')}
              style={{ background: 'transparent', color: '#444', border: 'none', padding: '16px', fontSize: '12px', cursor: 'pointer', width: '100%', marginTop: '12px' }}
            >
              Save and continue later
            </button>
          </div>
        )}

        {/* Phase: Deeper */}
        {phase === 'deeper' && (
          <div>
            <h2 style={{ color: '#d4af37', fontSize: '20px', marginBottom: '20px', textAlign: 'center' }}>
              Deeper Dive
            </h2>
            
            <div style={{ background: '#0a0a0a', border: '1px solid #d4af37', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ color: '#d4af37', fontSize: '12px', marginBottom: '8px' }}>ADVANCED CHALLENGE:</p>
              <p style={{ color: '#fff', fontSize: '15px', lineHeight: '1.7' }}>
                {analysis?.next_question_focus || "Apply this concept to a specific strategic challenge in your organisation. What would have to be true for your current strategy to fail?"}
              </p>
            </div>
            
            <textarea
              value={deeperResponse}
              onChange={(e) => setDeeperResponse(e.target.value)}
              placeholder="Your advanced analysis... (minimum 30 words)"
              rows={8}
              style={{ 
                background: '#050505', 
                border: '1px solid #222', 
                padding: '16px', 
                color: '#fff', 
                fontSize: '14px',
                width: '100%',
                resize: 'none'
              }}
            />
            
            <button 
              onClick={handleSubmitDeeper}
              disabled={loading || deeperResponse.trim().split(/\s+/).length < 30}
              style={{ 
                background: '#d4af37', 
                color: '#000', 
                border: 'none', 
                padding: '16px 32px', 
                fontSize: '14px', 
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '20px',
                width: '100%',
                opacity: loading || deeperResponse.trim().split(/\s+/).length < 30 ? 0.5 : 1
              }}
            >
              {loading ? 'ANALYSING...' : 'SUBMIT →'}
            </button>
          </div>
        )}

        {/* Phase: Complete */}
        {phase === 'complete' && (
          <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ color: '#fff', fontSize: '24px', fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
              Concept Mastered
            </h2>
            <p style={{ color: '#888', fontSize: '16px', marginBottom: '30px' }}>
              You've demonstrated strong understanding of {concept.name}
            </p>
            
            {analysis?.badges_earned?.length > 0 && (
              <div style={{ background: '#0a0a0a', border: '1px solid #d4af37', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <p style={{ color: '#d4af37', fontSize: '12px', marginBottom: '12px' }}>BADGE EARNED!</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  {analysis.badges_earned.map((badge, i) => (
                    <span key={i} style={{ fontSize: '24px' }}>{getBadgeIcon(badge)}</span>
                  ))}
                </div>
              </div>
            )}
            
            <Link 
              href="/dashboard"
              style={{ background: '#d4af37', color: '#000', border: 'none', padding: '16px 32px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
            >
              CONTINUE TO NEXT CONCEPT →
            </Link>
          </div>
        )}

      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

// Helper functions
function getConceptBody(conceptId) {
  const bodies = {
    'ai-native-vs-augmented': `The Spectrum of AI Adoption

Most organisations sit on the left side of this spectrum:

Level 0: No AI - Manual processes everywhere
Level 1: AI-Augmented - AI assists, humans decide
Level 2: AI-Enhanced - AI optimizes within existing workflows
Level 3: AI-Native - AI is the default decision-maker

The key insight: The gap from Level 2 to Level 3 isn't about technology. It's about mindset.

AI-native organisations don't ask "How can we use AI in our existing processes?"
They ask "If AI could make this decision, what would the process look like?"`,
    'default': `Read the concept material carefully. Consider how this applies to your organisation and role. Think about the strategic implications and practical applications.`
  };
  return bodies[conceptId] || bodies['default'];
}

function getTeachPrompt(conceptId) {
  return "Your CEO walks into your office and asks: 'What do you mean when you say we're not AI-native? We've invested millions in AI.' You have 60 seconds. Explain the difference in a way that makes the strategic implication clear.";
}

function getBadgeIcon(badgeType) {
  const icons = {
    'strategic_reframer': '🎯',
    'double_loop_thinker': '🔄',
    'context_applier': '🏢',
    'precision_thinker': '🎯'
  };
  return icons[badgeType] || '🏅';
}
