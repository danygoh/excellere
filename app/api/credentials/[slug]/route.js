// API Route: Get credential by slug - Server-side version
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const slug = params.slug;
  
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
  
  const profile = testProfiles.find(p => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    return slug.includes(fullName.replace(' ', '-').toLowerCase()) ||
           slug.includes(p.first_name.toLowerCase());
  });
  
  if (!profile) {
    return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
  }
  
  return NextResponse.json({
    success: true,
    credential: {
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
    }
  });
}
