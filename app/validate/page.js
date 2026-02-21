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
    <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '14px', letterSpacing: '8px', color: '#d4af37' }}>✦</span>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 400, color: '#fff', letterSpacing: '6px', marginTop: '10px' }}>VALIDATOR</div>
          <p style={{ color: '#666', marginTop: '20px', fontSize: '14px' }}>Review and validate learner assessment reports</p>
        </div>

        {!validatorId ? (
          /* Validator Selection */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {validators.map(v => (
              <a key={v.id} href={`/validate?validator=${v.id}`} style={{ display: 'block', background: '#0a0a0a', border: '1px solid #222', padding: '40px', textDecoration: 'none', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#1a1a1a', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600, margin: '0 auto 16px', fontFamily: 'Playfair Display, serif' }}>
                  {v.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff' }}>{v.name}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{v.title}</div>
              </a>
            ))}
          </div>
        ) : (
          /* Dashboard */
          <div>
            <a href="/validate" style={{ display: 'inline-block', color: '#666', textDecoration: 'none', fontSize: '12px', marginBottom: '30px' }}>← Select validator</a>
            
            {/* Info */}
            <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#d4af37', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600, fontFamily: 'Playfair Display, serif' }}>
                {validator.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#fff' }}>{validator.name}</div>
                <div style={{ color: '#666', fontSize: '12px' }}>{validator.title}</div>
              </div>
              <div style={{ marginLeft: 'auto', background: '#1a1a1a', color: '#d4af37', padding: '8px 16px', fontSize: '11px', letterSpacing: '1px' }}>
                {pendingReports.length} PENDING
              </div>
            </div>

            {/* Queue */}
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff', marginBottom: '20px' }}>Reports Awaiting Validation</h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {pendingReports.map(report => (
                <div key={report.id} style={{ background: '#0a0a0a', border: '1px solid #222', padding: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff' }}>{report.learner_name}</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>{report.role}</div>
                    </div>
                    <span style={{ background: '#d4af37', color: '#000', padding: '4px 12px', fontSize: '10px', letterSpacing: '1px' }}>PENDING</span>
                  </div>
                  <div style={{ color: '#444', fontSize: '12px', marginBottom: '16px' }}>
                    <strong style={{ color: '#666' }}>Module:</strong> {report.module}<br/>
                    <strong style={{ color: '#666' }}>Submitted:</strong> {report.submitted_at}
                  </div>
                  <div style={{ background: '#1a1a1a', padding: '12px', fontSize: '13px', fontStyle: 'italic', color: '#666', marginBottom: '16px' }}>
                    "{report.report_summary}"
                  </div>
                  <a href={`/validate/${report.id}`} style={{ display: 'inline-block', background: '#d4af37', color: '#000', padding: '12px 24px', textDecoration: 'none', fontSize: '11px', fontWeight: 600, letterSpacing: '1px' }}>
                    REVIEW & VALIDATE →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
