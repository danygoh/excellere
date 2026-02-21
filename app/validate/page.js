// Validator Dashboard Page

const validators = [
  { id: 'mark', name: 'Prof. Mark Esposito', title: 'Harvard / Hult', email: 'mark@excellere.ai' },
  { id: 'terence', name: 'Prof. Terence Tse', title: 'ESCP Business School', email: 'terence@excellere.ai' },
  { id: 'danny', name: 'Danny Goh', title: 'Excellere', email: 'danny@excellere.ai' }
];

const pendingReports = [
  { id: 'r1', learner_name: 'Sarah Chen', role: 'COO, FinTech', module: 'AI-Native Business Design', submitted_at: '2026-02-20', report_summary: 'Strategic Reframer with strong double-loop thinking...' },
  { id: 'r2', learner_name: 'Marcus Williams', role: 'VP Innovation, Healthcare', module: 'Agentic AI for Business', submitted_at: '2026-02-19', report_summary: 'Pragmatic implementer focusing on deployment timelines...' },
  { id: 'r3', learner_name: 'Elena Rodriguez', role: 'Head of Digital, Banking', module: 'AI Strategy & Governance', submitted_at: '2026-02-18', report_summary: 'Catalyst leader finding competitive advantage in constraints...' }
];

export default async function ValidatorDashboard({ searchParams }) {
  const validatorId = searchParams?.validator;
  const validator = validators.find(v => v.id === validatorId);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif', background: '#0f172a', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, letterSpacing: '4px', marginBottom: '8px', color: '#e2e8f0' }}>EXCELLERE</div>
        <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#e2e8f0' }}>Validator Dashboard</h1>
        <p style={{ color: '#94a3b8' }}>Review and validate learner assessment reports</p>
      </div>

      {/* Validator Selection */}
      {!validatorId ? (
        <div>
          <p style={{ marginBottom: '20px', fontSize: '14px', color: '#94a3b8' }}>Select your identity to access the validation queue:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {validators.map(v => (
              <a 
                key={v.id}
                href={`/validate?validator=${v.id}`}
                style={{ 
                  display: 'block',
                  background: '#1e293b', 
                  padding: '24px', 
                  borderRadius: '12px', 
                  textDecoration: 'none',
                  color: '#e2e8f0',
                  border: '1px solid #334155',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  textAlign: 'center'
                }}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#334155', color: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600, margin: '0 auto 16px' }}>
                  {v.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{v.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{v.title}</div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <a href="/validate" style={{ display: 'inline-block', marginBottom: '20px', color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>← Select different validator</a>
          
          {/* Validator Info */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '24px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600 }}>
              {validator.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#e2e8f0' }}>{validator.name}</div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>{validator.title}</div>
            </div>
            <div style={{ marginLeft: 'auto', background: '#134e4a', color: '#10b981', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>
              {pendingReports.length} reports pending
            </div>
          </div>

          {/* Queue */}
          <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#e2e8f0' }}>Reports Awaiting Validation</h2>
          
          {pendingReports.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No reports pending validation.</p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {pendingReports.map(report => (
                <div key={report.id} style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '18px', color: '#e2e8f0' }}>{report.learner_name}</div>
                      <div style={{ fontSize: '14px', color: '#94a3b8' }}>{report.role}</div>
                    </div>
                    <span style={{ background: '#f59e0b', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>
                      Pending
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
                    <strong>Module:</strong> {report.module}<br/>
                    <strong>Submitted:</strong> {report.submitted_at}
                  </div>
                  
                  <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontStyle: 'italic', color: '#94a3b8' }}>
                    "{report.report_summary}"
                  </div>
                  
                  <a href={`/validate/${report.id}`} style={{ display: 'inline-block', background: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                    Review & Validate →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#134e4a', borderRadius: '8px', fontSize: '14px', color: '#e2e8f0' }}>
        <strong>Important:</strong> When validating a report, you must write a personal 2-4 sentence comment about the learner's progress. This comment appears permanently on their credential and cannot be auto-generated.
      </div>
    </div>
  );
}
