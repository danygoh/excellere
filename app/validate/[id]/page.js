'use client';
import { useState, use } from 'react';

export default function ValidatorReviewPage({ params }) {
  const resolvedParams = use(params);
  const reportId = resolvedParams?.id;
  
  const [step, setStep] = useState('review'); // review | validate | done
  const [comment, setComment] = useState('');
  const [scoreOverride, setScoreOverride] = useState('');
  const [status, setStatus] = useState('validated');
  
  // Sample report data
  const report = {
    id: reportId,
    learner_name: 'Sarah Chen',
    role: 'COO, FinTech Global',
    sector: 'FinTech',
    archetype: 'Strategic Reframer',
    module: 'AI-Native Business Design',
    overall_score: 84,
    aria_noticed: 'What struck me most was how you consistently refused to accept the premise of questions, instead reframing them at a deeper level. When discussing AI maturity, you did not just assess where your organization sits — you questioned whether the framework itself was asking the right questions.',
    key_moments: [
      'Session 1: "AI-native is about fundamentally rethinking how we create value"',
      'Session 2: "The gap to Level 3 is about our decision-making framework"',
      'Session 3: "AI-first means AI is the default, humans retain strategic override"'
    ],
    artefact: {
      title: 'AI-Native Operating Model Proposal',
      summary: 'Proposal to restructure core operational processes around AI decision-making.',
      board_readiness: 72
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would call an API
    setStep('done');
  };

  if (step === 'done') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>✓</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', marginBottom: '16px' }}>Report Validated!</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Sarah Chen has been notified. Their credential is now live.
        </p>
        <a href="/validate" style={{ background: '#e94560', color: 'white', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none' }}>
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <a href="/validate" style={{ display: 'inline-block', marginBottom: '20px', color: '#666', textDecoration: 'none' }}>← Back to Queue</a>
      
      <h1 style={{ fontSize: '24px', marginBottom: '30px' }}>Review Report: {report.learner_name}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '30px' }}>
        {/* Left Panel - Learner Context */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Learner Context</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 600, fontSize: '18px' }}>{report.learner_name}</div>
            <div style={{ color: '#666' }}>{report.role}</div>
            <div style={{ color: '#888', fontSize: '14px' }}>{report.sector}</div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <span style={{ background: '#1a1a2e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
              {report.archetype}
            </span>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            <strong>Module:</strong> {report.module}<br/>
            <strong>Submitted:</strong> Feb 20, 2026
          </div>
        </div>

        {/* Center Panel - Report */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Aria's Assessment</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <strong>Overall Score:</strong> {report.overall_score}/100
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <strong style={{ display: 'block', marginBottom: '8px' }}>What Aria Noticed:</strong>
            <p style={{ fontSize: '14px', fontStyle: 'italic', lineHeight: 1.6, color: '#444' }}>{report.aria_noticed}</p>
          </div>
          
          <div>
            <strong style={{ display: 'block', marginBottom: '8px' }}>Key Moments:</strong>
            <ul style={{ fontSize: '13px', color: '#666', paddingLeft: '20px' }}>
              {report.key_moments.map((m, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{m}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Panel - Validation */}
        <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '20px' }}>Validation</h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                Your Comment <span style={{ color: '#e94560' }}>*</span>
              </label>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                Write 2-4 sentences personal to this learner. This appears on their credential.
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Sarah demonstrates exceptional strategic thinking..."
                required
                style={{ width: '100%', height: '120px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', resize: 'none' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                Score Override (optional)
              </label>
              <input
                type="number"
                value={scoreOverride}
                onChange={(e) => setScoreOverride(e.target.value)}
                min="0"
                max="100"
                placeholder={report.overall_score}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
                Assessment
              </label>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="status" 
                  value="validated" 
                  checked={status === 'validated'}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                <span>✓ Validated — accurate assessment</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="status" 
                  value="needs_revision" 
                  checked={status === 'needs_revision'}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                <span>Needs Revision — return to Aria</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="status" 
                  value="exceptional" 
                  checked={status === 'exceptional'}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                <span>★ Exceptional — flag for feature</span>
              </label>
            </div>
            
            <button 
              type="submit"
              disabled={!comment.trim()}
              style={{ 
                width: '100%', 
                background: comment.trim() ? '#2ecc71' : '#ccc', 
                color: 'white', 
                border: 'none', 
                padding: '14px', 
                borderRadius: '8px', 
                fontSize: '15px', 
                fontWeight: 600, 
                cursor: comment.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Sign & Issue Credential
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
