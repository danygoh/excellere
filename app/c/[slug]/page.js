// Server component for credential page
import { notFound } from 'next/navigation';

const testProfiles = [
  { id: 'test-001', first_name: 'Sarah', last_name: 'Chen', role: 'COO', sector: 'FinTech', archetype: 'Strategic Reframer' },
  { id: 'test-002', first_name: 'Marcus', last_name: 'Williams', role: 'VP Innovation', sector: 'Healthcare', archetype: 'Pragmatic Implementer' },
  { id: 'test-003', first_name: 'Elena', last_name: 'Rodriguez', role: 'Head of Digital', sector: 'Banking', archetype: 'Catalyst Leader' },
  { id: 'test-004', first_name: 'James', last_name: 'OConnor', role: 'CEO', sector: 'Manufacturing', archetype: 'Visionary Architect' },
  { id: 'test-005', first_name: 'Aisha', last_name: 'Patel', role: 'Managing Partner', sector: 'Professional Services', archetype: 'Bridge Builder' }
];

const ariaObservations = {
  'Sarah Chen': 'What struck me most was how you consistently refused to accept the premise of questions, instead reframing them at a deeper level.',
  'Marcus Williams': 'You consistently translated every concept through a 3-month deployment filter - a specific cognitive pattern.',
  'Elena Rodriguez': 'A distinctive pattern of immediately looking beyond the obvious answer to find competitive advantage.',
  'James OConnor': 'You use manufacturing language to challenge manufacturing assumptions - a sophisticated rhetorical move.',
  'Aisha Patel': 'A gift for translating technical complexity into client-relevant language.'
};

export default async function CredentialPage({ params }) {
  const slug = params.slug;
  
  const profile = testProfiles.find(p => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    return slug.includes(fullName.replace(' ', '-').toLowerCase()) ||
           slug.includes(p.first_name.toLowerCase());
  });

  if (!profile) {
    notFound();
  }

  const credential = {
    share_slug: slug,
    profile,
    report: {
      report_title: 'AI-Native Business Design — Learning Assessment',
      overall_score: 84,
      aria_noticed: {
        observation: ariaObservations[`${profile.first_name} ${profile.last_name}`] || 'Good progress.',
        prediction: 'Your next challenge will be applying these concepts at scale.'
      }
    },
    validated: true,
    validator: {
      name: 'Prof. Mark Esposito',
      title: 'Harvard University / Hult International Business School',
      comment: 'Excellent progress demonstrating genuine AI fluency and strategic thinking capability.'
    }
  };

  const { report, validated, validator, share_slug } = credential;

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '60px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '14px', letterSpacing: '8px', color: '#d4af37' }}>✦</span>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 400, color: '#fff', letterSpacing: '6px', marginTop: '10px' }}>EXCELLERE</div>
        </div>

        {/* Main Card */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '2px', padding: '50px' }}>
          
          {/* Verified Badge */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#d4af37', fontSize: '12px', letterSpacing: '3px' }}>✓ VERIFIED CREDENTIAL</span>
          </div>

          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)', 
              color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '36px', fontWeight: 600, margin: '0 auto', fontFamily: 'Playfair Display, serif'
            }}>
              {profile.first_name[0]}{profile.last_name[0]}
            </div>
          </div>

          {/* Name & Role */}
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 400, color: '#fff', marginBottom: '8px' }}>
              {profile.first_name} {profile.last_name}
            </h1>
            <p style={{ color: '#d4af37', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>{profile.role}</p>
            <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>{profile.sector}</p>
          </div>

          {/* Archetype */}
          <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>Thinking Archetype</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#fff', fontStyle: 'italic' }}>{profile.archetype}</p>
          </div>

          {/* What Aria Noticed */}
          <div style={{ marginTop: '40px' }}>
            <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>What Aria Noticed</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#fff', fontStyle: 'italic', lineHeight: 1.7 }}>
              "{report.aria_noticed.observation}"
            </p>
          </div>

          {/* Score */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <div style={{ display: 'inline-block' }}>
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                border: '2px solid #d4af37', display: 'flex', flexDirection: 'column', 
                justifyContent: 'center', alignItems: 'center' 
              }}>
                <span style={{ fontSize: '28px', fontWeight: 600, color: '#d4af37' }}>{report.overall_score}</span>
                <span style={{ fontSize: '8px', color: '#666', letterSpacing: '2px' }}>SCORE</span>
              </div>
            </div>
          </div>

          {/* Validator */}
          {validated && validator && (
            <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #222', textAlign: 'center' }}>
              <p style={{ color: '#666', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Validated by</p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#fff' }}>{validator.name}</p>
              <p style={{ color: '#666', fontSize: '11px', marginTop: '4px' }}>{validator.title}</p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', color: '#d4af37', fontStyle: 'italic', marginTop: '12px' }}>"{validator.comment}"</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '30px', color: '#444', fontSize: '10px', letterSpacing: '2px' }}>
          CREDENTIAL ID: EXC-{share_slug.split('-').pop().toUpperCase()} • EXCELLERE.AI
        </div>

      </div>
    </div>
  );
}
