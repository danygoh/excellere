// Server component for credential page
import { notFound } from 'next/navigation';

// Sample data (same as API)
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
      executive_summary: {
        headline: `${profile.first_name} demonstrated exceptional ${profile.archetype.toLowerCase()} thinking.`,
        body: `You showed strong capability in applying AI concepts to your ${profile.sector} context.`
      },
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Card */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        
        {/* Header with dark background */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '30px', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, letterSpacing: '4px' }}>EXCELLERE</div>
            <div style={{ background: '#2ecc71', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>✓ Verified Credential</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #e94560 0%, #d6304b 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 600, margin: '0 auto 16px' }}>
              {profile.first_name[0]}{profile.last_name[0]}
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', marginBottom: '8px', color: '#1a1a2e' }}>{profile.first_name} {profile.last_name}</h1>
            <p style={{ color: '#e94560', fontWeight: 500, marginBottom: '4px' }}>{profile.role}</p>
            <p style={{ color: '#666', fontSize: '14px' }}>{profile.sector} · AI Leadership Credential</p>
          </div>

          {/* Archetype - Dark card */}
          <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '8px' }}>Thinking Archetype</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px' }}>{profile.archetype}</div>
          </div>

          {/* Aria Noticed - Gold accent */}
          <div style={{ background: '#fffbf0', borderLeft: '4px solid #d4af37', padding: '20px', marginBottom: '24px', borderRadius: '0 8px 8px 0' }}>
            <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#d4af37', marginBottom: '10px' }}>What Aria Noticed</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontStyle: 'italic', lineHeight: 1.6, color: '#333' }}>{report.aria_noticed.observation}</div>
          </div>

          {/* Score */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #e94560', display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#e94560' }}>{report.overall_score}</span>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>Score</span>
            </div>
          </div>

          {/* Validator */}
          {validated && validator && (
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#666', marginBottom: '12px' }}>Validated By</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontWeight: 600, color: '#1a1a2e' }}>{validator.name}</div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>{validator.title}</div>
              {validator.comment && (
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontStyle: 'italic', color: '#444' }}>"{validator.comment}"</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '12px', color: '#888' }}>
          <p>This credential was issued by Excellere</p>
          <p style={{ marginTop: '4px' }}>Credential ID: EXC-{share_slug.split('-').pop().toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
