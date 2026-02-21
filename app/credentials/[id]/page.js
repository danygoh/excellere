// Full Programme Credential Page
import { notFound } from 'next/navigation';

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
    capability_statement: 'Demonstrates advanced strategic AI fluency with particular strength in second-order reasoning and AI-native business design.',
    validators: [
      { name: 'Prof. Mark Esposito', title: 'Harvard / Hult', comment: 'Exceptional strategic thinking.' },
      { name: 'Prof. Terence Tse', title: 'ESCP Business School', comment: 'Excellent application of AI concepts.' },
      { name: 'Danny Goh', title: 'Excellere', comment: 'Outstanding double-loop reasoning.' }
    ]
  }
};

export default async function FullCredentialPage({ params }) {
  const id = params.id;
  const credential = fullCredentials[id] || fullCredentials['sarah-chen'];
  if (!credential) notFound();

  const { learner, archetype, modules, badges, capability_statement, validators } = credential;

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '14px', letterSpacing: '8px', color: '#d4af37' }}>✦</span>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 400, color: '#fff', letterSpacing: '6px', marginTop: '10px' }}>EXCELLERE</div>
        </div>

        {/* Card */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '50px' }}>
          
          {/* Badge */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#d4af37', fontSize: '12px', letterSpacing: '3px' }}>✓ PROGRAMME COMPLETE</span>
          </div>

          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 600, margin: '0 auto', fontFamily: 'Playfair Display, serif' }}>
              {learner.first_name[0]}{learner.last_name[0]}
            </div>
          </div>

          {/* Name */}
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 400, color: '#fff', marginBottom: '8px' }}>{learner.first_name} {learner.last_name}</h1>
            <p style={{ color: '#d4af37', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>{learner.role}</p>
            <p style={{ color: '#444', fontSize: '11px', marginTop: '4px' }}>{learner.sector}</p>
          </div>

          {/* Archetype */}
          <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
            <p style={{ color: '#444', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>Thinking Archetype</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#fff', fontStyle: 'italic' }}>{archetype}</p>
          </div>

          {/* Modules */}
          <div style={{ marginTop: '40px' }}>
            <p style={{ color: '#444', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Completed Modules</p>
            {modules.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #1a1a1a' }}>
                <div>
                  <p style={{ color: '#fff', fontSize: '14px' }}>{m.name}</p>
                  <p style={{ color: '#444', fontSize: '11px' }}>Validated by {m.validator}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#d4af37', fontSize: '20px', fontWeight: 600 }}>{m.score}</p>
                  <p style={{ color: '#333', fontSize: '10px' }}>{m.completed}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div style={{ marginTop: '30px' }}>
            <p style={{ color: '#444', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Badges</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {badges.map((b, i) => (
                <span key={i} style={{ background: '#1a1a1a', color: '#888', padding: '6px 14px', fontSize: '11px', letterSpacing: '1px' }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Capability */}
          <div style={{ marginTop: '30px', padding: '20px', background: '#0f0f0f', borderLeft: '2px solid #d4af37' }}>
            <p style={{ color: '#444', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>Capability Statement</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', color: '#fff', fontStyle: 'italic', lineHeight: 1.7 }}>{capability_statement}</p>
          </div>

          {/* Validators */}
          <div style={{ marginTop: '30px' }}>
            <p style={{ color: '#444', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Validated By</p>
            {validators.map((v, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid #1a1a1a' }}>
                <p style={{ color: '#fff', fontSize: '14px' }}>{v.name}</p>
                <p style={{ color: '#444', fontSize: '11px' }}>{v.title}</p>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '12px', color: '#d4af37', fontStyle: 'italic', marginTop: '4px' }}>"{v.comment}"</p>
              </div>
            ))}
          </div>

          {/* Share */}
          <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #222' }}>
            <p style={{ color: '#444', fontSize: '11px', marginBottom: '16px' }}>Share your credential</p>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://excellere.vercel.app/credentials/' + id)}`} target="_blank" style={{ background: '#d4af37', color: '#000', padding: '14px 28px', textDecoration: 'none', fontSize: '11px', fontWeight: 600, letterSpacing: '1px' }}>
              LINKEDIN
            </a>
          </div>

        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '30px', color: '#333', fontSize: '10px', letterSpacing: '2px' }}>
          CREDENTIAL ID: EXC-2026-{learner.first_name.toUpperCase()}{learner.last_name.toUpperCase()} • EXCELLERE.AI
        </div>

      </div>
    </div>
  );
}
