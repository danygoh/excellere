// Validator Dashboard Page
import { NextResponse } from 'next/server';

// Validators data
const validators = [
  { id: 'mark', name: 'Prof. Mark Esposito', title: 'Harvard / Hult', email: 'mark@excellere.ai' },
  { id: 'terence', name: 'Prof. Terence Tse', title: 'ESCP Business School', email: 'terence@excellere.ai' },
  { id: 'danny', name: 'Danny Goh', title: 'Excellere', email: 'danny@excellere.ai' }
];

// Sample reports awaiting validation
const pendingReports = [
  { 
    id: 'r1', 
    learner_name: 'Sarah Chen', 
    role: 'COO, FinTech', 
    module: 'AI-Native Business Design',
    submitted_at: '2026-02-20',
    report_summary: 'Strategic Reframer with strong double-loop thinking...'
  },
  { 
    id: 'r2', 
    learner_name: 'Marcus Williams', 
    role: 'VP Innovation, Healthcare', 
    module: 'Agentic AI for Business',
    submitted_at: '2026-02-19',
    report_summary: 'Pragmatic implementer focusing on deployment timelines...'
  },
  { 
    id: 'r3', 
    learner_name: 'Elena Rodriguez', 
    role: 'Head of Digital, Banking', 
    module: 'AI Strategy & Governance',
    submitted_at: '2026-02-18',
    report_summary: 'Catalyst leader finding competitive advantage in constraints...'
  }
];

export default async function ValidatorDashboard({ searchParams }) {
  const validatorId = searchParams?.validator;
  const validator = validators.find(v => v.id === validatorId);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, letterSpacing: '4px', marginBottom: '8px' }}>EXCELLERE</div>
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Validator Dashboard</h1>
        <p style={{ color: '#666' }}>Review and validate learner assessment reports</p>
      </div>

      {/* Validator Selection */}
      {!validatorId ? (
        <div>
          <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>Select your identity to access the validation queue:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {validators.map(v => (
              <a 
                key={v.id}
                href={`/validate?validator=${v.id}`}
                style={{ 
                  display: 'block',
                  background: 'white', 
                  padding: '24px', 
                  borderRadius: '12px', 
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  textAlign: 'center'
                }}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600, margin: '0 auto 16px' }}>
                  {v.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{v.name}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{v.title}</div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        /* Dashboard View */
        <div>
          {/* Back link */}
          <a href="/validate" style={{ display: 'inline-block', marginBottom: '20px', color: '#666', textDecoration: 'none', fontSize: '14px' }}>← Select different validator</a>
          
          {/* Validator Info */}
          <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: '24px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600 }}>
              {validator.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>{validator.name}</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>{validator.title}</div>
            </div>
            <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px', fontSize: '12px' }}>
              {pendingReports.length} reports pending
            </div>
          </div>

          {/* Queue */}
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Reports Awaiting Validation</h2>
          
          {pendingReports.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>No reports pending validation.</p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {pendingReports.map(report => (
                <div key={report.id} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '18px' }}>{report.learner_name}</div>
                      <div style={{ fontSize: '14px', color: '#666' }}>{report.role}</div>
                    </div>
                    <span style={{ background: '#f39c12', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>
                      Pending
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                    <strong>Module:</strong> {report.module}<br/>
                    <strong>Submitted:</strong> {report.submitted_at}
                  </div>
                  
                  <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontStyle: 'italic' }}>
                    "{report.report_summary}"
                  </div>
                  
                  <button style={{ background: '#e94560', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                    Review & Validate →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#e8f4fd', borderRadius: '8px', fontSize: '14px' }}>
        <strong>Important:</strong> When validating a report, you must write a personal 2-4 sentence comment about the learner's progress. This comment appears permanently on their credential and cannot be auto-generated.
      </div>
    </div>
  );
}
