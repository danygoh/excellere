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
  const credential = fullCredentials[id] || fullCredentials['sarah-chen']; // Default for demo

  if (!credential) {
    notFound();
  }

  const { learner, archetype, modules, badges, capability_statement, validators } = credential;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, letterSpacing: '4px' }}>EXCELLERE</div>
        <div style={{ background: '#2ecc71', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>✓ Programme Complete</div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 600, margin: '0 auto 20px' }}>
          {learner.first_name[0]}{learner.last_name[0]}
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', marginBottom: '8px' }}>{learner.first_name} {learner.last_name}</h1>
        <p style={{ color: '#e94560', fontWeight: 500, marginBottom: '4px' }}>{learner.role}</p>
        <p style={{ color: '#888', fontSize: '14px' }}>{learner.sector}</p>
      </div>

      {/* Archetype */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '8px' }}>Thinking Archetype</div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px' }}>{archetype}</div>
      </div>

      {/* Modules */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Completed Modules</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {modules.map((m, i) => (
            <div key={i} style={{ background: 'white', padding: '16px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{m.name}</div>
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
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Badges Earned</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {badges.map((b, i) => (
            <span key={i} style={{ background: '#1a1a2e', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '13px' }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Capability Statement */}
      <div style={{ background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%)', borderLeft: '4px solid #d4af37', padding: '24px', marginBottom: '30px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#d4af37', marginBottom: '12px' }}>Capability Statement</div>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontStyle: 'italic', lineHeight: 1.7 }}>{capability_statement}</p>
      </div>

      {/* Validators */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Validated By</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {validators.map((v, i) => (
            <div key={i} style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600 }}>{v.name}</div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{v.title}</div>
              <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#444' }}>"{v.comment}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Share */}
      <div style={{ textAlign: 'center', padding: '30px', borderTop: '1px solid #eee' }}>
        <p style={{ marginBottom: '16px', color: '#666' }}>Share your credential</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://excellere.ai/c/sarah-chen')}`} target="_blank" rel="noopener" style={{ background: '#0077b5', color: 'white', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
            LinkedIn
          </a>
          <button style={{ background: '#1a1a2e', color: 'white', padding: '12px 24px', borderRadius: '6px', border: 'none', fontSize: '14px', cursor: 'pointer' }}>
            Download PDF
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee', fontSize: '12px', color: '#888' }}>
        <p>Credential ID: EXC-2026-{learner.first_name.toUpperCase()}{learner.last_name.toUpperCase()}</p>
        <p style={{ marginTop: '8px' }}>Verified at excellere.ai/credentials/{id}</p>
      </div>
    </div>
  );
}
