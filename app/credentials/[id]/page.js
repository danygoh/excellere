// Full Programme Credential Page
import { notFound } from 'next/navigation';

// Full credential data (simulated)
const fullCredentials = {
  'sarah-chen': {
    learner: { first_name: 'Sarah', last_name: 'Chen', role: 'COO', sector: 'FinTech' },
    archetype: 'Strategic Reframer',
    modules: [
      { name: 'AI-Native Business Design', completed: '2026-01-15', score: 84, validator: 'Prof. Mark Esposito' },
      { name: 'Agentic AI for Business', completed: '2026-02-01', score: 88, validator: 'Prof. Terence Tse' },
      { name: 'Double Loop Strategy', completed: '2026-02-18', score: 91, validator: 'Danny Goh' }
    ],
    badges: ['Strategic Reframer', 'Double Loop Thinker', 'Context Applier', 'Precision Thinker', 'AI-Native Architect'],
    capability_statement: 'Demonstrates advanced strategic AI fluency with particular strength in second-order reasoning and AI-native business design. Assessed as a Strategic Reframer — consistently questioning whether the right problem is being solved before applying solutions. Produced board-validated artefacts applied to a FinTech context. Validated by Prof. Mark Esposito, Harvard University.',
    validators: [
      { name: 'Prof. Mark Esposito', title: 'Harvard / Hult', comment: 'Exceptional strategic thinking. Sarah consistently challenges assumptions at the root level.' },
      { name: 'Prof. Terence Tse', title: 'ESCP Business School', comment: 'Excellent application of agentic AI concepts to real business contexts.' },
      { name: 'Danny Goh', title: 'Excellere', comment: 'Outstanding double-loop reasoning. A true AI-native thinker.' }
    ]
  }
};

export default async function FullCredentialPage({ params }) {
  const id = params.id;
  const credential = fullCredentials[id] || fullCredentials['sarah-chen'];

  if (!credential) {
    notFound();
  }

  const { learner, archetype, modules, badges, capability_statement, validators } = credential;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif', background: '#fff', minHeight: '100vh' }}>
      {/* Card */}
      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #eee' }}>
        
        {/* Header */}
        <div style={{ background: '#f8f9fa', borderBottom: '1px solid #eee', padding: '20px 30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, letterSpacing: '4px', color: '#1a1a2e' }}>EXCELLERE</div>
            <div style={{ background: '#2ecc71', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>✓ Programme Complete</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#e94560', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 600, margin: '0 auto 20px' }}>
              {learner.first_name[0]}{learner.last_name[0]}
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', marginBottom: '8px', color: '#1a1a2e' }}>{learner.first_name} {learner.last_name}</h1>
            <p style={{ color: '#e94560', fontWeight: 500, marginBottom: '4px' }}>{learner.role}</p>
            <p style={{ color: '#888', fontSize: '14px' }}>{learner.sector}</p>
          </div>

          {/* Archetype */}
          <div style={{ background: '#f8f9fa', border: '1px solid #eee', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '8px' }}>Thinking Archetype</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#1a1a2e' }}>{archetype}</div>
          </div>

          {/* Modules */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Completed Modules</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {modules.map((m, i) => (
                <div key={i} style={{ background: '#f8f9fa', padding: '16px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eee' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{m.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Validated by {m.validator}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#e94560' }}>{m.score}</div>
                    <div style={{ fontSize: '10px', color: '#888' }}>{m.completed}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Badges Earned</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {badges.map((b, i) => (
                <span key={i} style={{ background: '#f0f0f0', color: '#333', padding: '8px 16px', borderRadius: '20px', fontSize: '13px' }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Capability Statement */}
          <div style={{ background: '#fffbf0', borderLeft: '4px solid #d4af37', padding: '20px', marginBottom: '24px', borderRadius: '0 8px 8px 0' }}>
            <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#d4af37', marginBottom: '12px' }}>Capability Statement</div>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontStyle: 'italic', lineHeight: 1.7, color: '#333' }}>{capability_statement}</p>
          </div>

          {/* Validators */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Validated By</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {validators.map((v, i) => (
                <div key={i} style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #eee' }}>
                  <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{v.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{v.title}</div>
                  <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#555' }}>"{v.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Share */}
          <div style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid #eee' }}>
            <p style={{ marginBottom: '16px', color: '#666' }}>Share your credential</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://excellere.vercel.app/credentials/' + id)}`} target="_blank" rel="noopener" style={{ background: '#0077b5', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
                Share on LinkedIn
              </a>
              <span style={{ background: '#f0f0f0', color: '#666', padding: '12px 24px, borderRadius: 6px, fontSize: 14px }}>
                PDF Download (Coming Soon)
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '12px', color: '#888' }}>
          <p>Credential ID: EXC-2026-{learner.first_name.toUpperCase()}{learner.last_name.toUpperCase()}</p>
          <p style={{ marginTop: '8px' }}>Verified at excellere.ai/credentials/{id}</p>
        </div>
      </div>
    </div>
  );
}
