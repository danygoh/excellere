import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ValidatorReviewPage() {
  const searchParams = useSearchParams();
  const reportId = 'r1'; // For demo
  
  const [step, setStep] = useState('review');
  const [comment, setComment] = useState('');
  
  const report = {
    learner_name: 'Sarah Chen',
    role: 'COO, FinTech Global',
    sector: 'FinTech',
    archetype: 'Strategic Reframer',
    module: 'AI-Native Business Design',
    overall_score: 84,
    aria_noticed: 'What struck me most was how you consistently refused to accept the premise of questions, instead reframing them at a deeper level.',
    key_moments: ['Session 1: "AI-native is about fundamentally rethinking"', 'Session 2: "The gap to Level 3 is about our decision-making"', 'Session 3: "AI-first means AI is the default"']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('done');
  };

  if (step === 'done') {
    return (
      <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '60px', color: '#d4af37', marginBottom: '20px' }}>✓</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', color: '#fff', marginBottom: '16px' }}>Report Validated!</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>Sarah Chen has been notified.</p>
          <a href="/validate" style={{ background: '#d4af37', color: '#000', padding: '14px 28px', textDecoration: 'none', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>BACK TO DASHBOARD</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <a href="/validate" style={{ display: 'inline-block', color: '#666', textDecoration: 'none', fontSize: '12px', marginBottom: '30px' }}>← BACK TO QUEUE</a>
        
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#fff', marginBottom: '40px' }}>Review: {report.learner_name}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 380px', gap: '20px' }}>
          {/* Left - Context */}
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px' }}>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '20px' }}>LEARNER CONTEXT</p>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#fff', marginBottom: '8px' }}>{report.learner_name}</h3>
            <p style={{ color: '#d4af37', fontSize: '12px', marginBottom: '4px' }}>{report.role}</p>
            <p style={{ color: '#444', fontSize: '12px', marginBottom: '16px' }}>{report.sector}</p>
            <span style={{ background: '#1a1a1a', color: '#888', padding: '4px 12px', fontSize: '11px' }}>{report.archetype}</span>
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#444' }}>
              <strong style={{ color: '#666' }}>Module:</strong> {report.module}<br/>
              <strong style={{ color: '#666' }}>Submitted:</strong> Feb 20, 2026
            </div>
          </div>

          {/* Center - Report */}
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px' }}>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '20px' }}>ARIA'S ASSESSMENT</p>
            <p style={{ color: '#d4af37', fontSize: '24px', marginBottom: '20px' }}>{report.overall_score}<span style={{ fontSize: '12px', color: '#444' }}>/100</span></p>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '8px' }}>WHAT ARIA NOTICED</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', color: '#fff', fontStyle: 'italic', lineHeight: 1.7 }}>{report.aria_noticed}</p>
          </div>

          {/* Right - Validation */}
          <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px' }}>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', marginBottom: '20px' }}>VALIDATION</p>
            <form onSubmit={handleSubmit}>
              <p style={{ color: '#666', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>YOUR COMMENT *</p>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write 2-4 sentences about this learner's progress..." required style={{ width: '100%', height: '140px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '12px', fontSize: '13px', resize: 'none', marginBottom: '20px' }} />
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>
                <input type="radio" name="status" value="validated" defaultChecked style={{ accentColor: '#d4af37' }} />
                Validated — accurate assessment
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>
                <input type="radio" name="status" value="needs_revision" style={{ accentColor: '#d4af37' }} />
                Needs Revision
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>
                <input type="radio" name="status" value="exceptional" style={{ accentColor: '#d4af37' }} />
                ★ Exceptional
              </label>
              
              <button type="submit" disabled={!comment.trim()} style={{ width: '100%', background: comment.trim() ? '#d4af37' : '#333', color: comment.trim() ? '#000' : '#666', border: 'none', padding: '14px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', cursor: comment.trim() ? 'pointer' : 'not-allowed' }}>
                SIGN & ISSUE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
