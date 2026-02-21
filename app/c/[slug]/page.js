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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif', background: '#0f172a', minHeight: '100vh' }}>
      {/* Card */}
      <div style={{ background: '#1e293b', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', overflow: 'hidden', border: '1px solid #334155' }}>
        
        {/* Header */}
        <div style={{ background: '#0f172a', padding: '20px 30px', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, letterSpacing: '4px', color: '#e2e8f0' }}>EXCELLERE</div>
            <div style={{ background: '#10b981', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>✓ Verified Credential</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#334155', color: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 600, margin: '0 auto 16px', border: '2px solid #10b981' }}>
              {profile.first_name[0]}{profile.last_name[0]}
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', marginBottom: '8px', color: '#f1f5f9' }}>{profile.first_name} {profile.last_name}</h1>
            <p style={{ color: '#10b981', fontWeight: 500, marginBottom: '4px' }}>{profile.role}</p>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>{profile.sector} · AI Leadership Credential</p>
          </div>

          {/* Archetype */}
          <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>Thinking Archetype</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#e2e8f0' }}>{profile.archetype}</div>
          </div>

          {/* Aria Noticed */}
          <div style={{ background: '#134e4a', borderLeft: '4px solid #10b981', padding: '20px', marginBottom: '24px', borderRadius: '0 8px 8px 0' }}>
            <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#10b981', marginBottom: '10px' }}>What Aria Noticed</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontStyle: 'italic', lineHeight: 1.6, color: '#e2e8f0' }}>{report.aria_noticed.observation}</div>
          </div>

          {/* Score */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #10b981', display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>{report.overall_score}</span>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>Score</span>
            </div>
          </div>

          {/* Validator */}
          {validated && validator && (
            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>Validated By</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontWeight: 600, color: '#e2e8f0' }}>{validator.name}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>{validator.title}</div>
              {validator.comment && (
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontStyle: 'italic', color: '#10b981' }}>"{validator.comment}"</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px', borderTop: '1px solid #334155', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
          <p>This credential was issued by Excellere</p>
          <p style={{ marginTop: '4px' }}>Credential ID: EXC-{share_slug.split('-').pop().toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
