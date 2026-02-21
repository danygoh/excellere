// API Route: Generate Insight Report
import { NextResponse } from 'next/server';

const testProfiles = [
  { id: 'test-001', first_name: 'Sarah', last_name: 'Chen', role: 'COO', sector: 'FinTech', archetype: 'Strategic Reframer', current_module: 'AI-Native Business Design', session_history: [{ session: 1, topic: 'Intro', response: 'AI-native is about fundamentally rethinking how we create value. For my COO role, this means questioning whether our current operational models can survive in an AI-first world.', ai_analysis: { reasoning_quality: 'Excellent', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 88 }}], artefact: { type: 'Proposal', content: { title: 'AI-Native Operations' }, strength_scores: { strategic_alignment: 88 }}},
  { id: 'test-002', first_name: 'Marcus', last_name: 'Williams', role: 'VP Innovation', sector: 'Healthcare', archetype: 'Pragmatic Implementer', current_module: 'Agentic AI', session_history: [{ session: 1, topic: 'AI Agents', response: 'In healthcare, the immediate opportunity is automating prior authorization - rule-based, high-volume, frustrating for patients.', ai_analysis: { reasoning_quality: 'Good', applied_to_own_context: true, double_loop_detected: false, concept_accuracy: 78 }}], artefact: { type: 'System Design', content: { title: 'Healthcare Agent System' }, strength_scores: { strategic_alignment: 75 }}},
  { id: 'test-003', first_name: 'Elena', last_name: 'Rodriguez', role: 'Head of Digital', sector: 'Banking', archetype: 'Catalyst Leader', current_module: 'AI Strategy', session_history: [{ session: 1, topic: 'Governance', response: 'Our board wants AI governance but focuses on compliance. I need to reframe to competitive advantage.', ai_analysis: { reasoning_quality: 'Excellent', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 90 }}], artefact: { type: 'Strategy', content: { title: 'AI Governance Framework' }, strength_scores: { strategic_alignment: 92 }}},
  { id: 'test-004', first_name: 'James', last_name: 'OConnor', role: 'CEO', sector: 'Manufacturing', archetype: 'Visionary Architect', current_module: 'Double Loop Strategy', session_history: [{ session: 1, topic: 'Second Order', response: 'Most executives confuse first-order thinking with second-order. We keep improving manufacturing while market shifts to services.', ai_analysis: { reasoning_quality: 'Outstanding', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 95 }}], artefact: { type: 'Canvas', content: { title: 'Manufacturing 2030' }, strength_scores: { strategic_alignment: 98 }}},
  { id: 'test-005', first_name: 'Aisha', last_name: 'Patel', role: 'Managing Partner', sector: 'Professional Services', archetype: 'Bridge Builder', current_module: 'AI for Client Value', session_history: [{ session: 1, topic: 'Opportunities', response: 'For consulting clients, biggest AI opportunity is customer experience - they want to talk about AI but dont know where to start.', ai_analysis: { reasoning_quality: 'Good', applied_to_own_context: true, double_loop_detected: false, concept_accuracy: 76 }}], artefact: { type: 'Offer', content: { title: 'AI Consulting Value Prop' }, strength_scores: { strategic_alignment: 85 }}}
];

export async function GET() {
  return NextResponse.json({
    profiles: testProfiles.map(p => ({ id: p.id, name: `${p.first_name} ${p.last_name}`, role: p.role, sector: p.sector, archetype: p.archetype }))
  });
}

export async function POST(request) {
  try {
    const { profile_id } = await request.json();
    const profile = testProfiles.find(p => p.id === profile_id);
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    // Simple report generation based on profile data
    const ariaObservations = {
      'test-001': 'What struck me most was how you consistently refused to accept the premise of questions, instead reframing them at a deeper level. When discussing AI maturity, you did not just assess where your organization sits - you questioned whether the framework itself was asking the right questions.',
      'test-002': 'What struck me most was how you consistently translated every concept through a 3-month deployment filter. This is not just pragmatism - it is a specific cognitive pattern where you evaluate ideas by their implementation timeline rather than their transformative potential.',
      'test-003': 'Elena has a distinctive pattern of immediately looking beyond the obvious answer to find competitive advantage. When discussing governance frameworks, most leaders focus on compliance requirements - Elena immediately questioned whether the board was asking the right questions.',
      'test-004': 'You consistently use manufacturing language to challenge manufacturing assumptions - a sophisticated rhetorical move that shows you are thinking like a true systems architect. When you said why are we optimizing production, you were genuinely wrestling with decades of industry conditioning.',
      'test-005': 'Aisha has a gift for translating technical complexity into client-relevant language. Rather than explaining AI capabilities, she frames them in terms of business outcomes - what the client cares about, not what the technology can do.'
    };
    
    const scores = { 'test-001': 84, 'test-002': 78, 'test-003': 78, 'test-004': 85, 'test-005': 82 };
    
    const report = {
      report_title: `${profile.current_module} — Learning Assessment`,
      executive_summary: {
        headline: `${profile.first_name} demonstrated exceptional ${profile.archetype.toLowerCase()} thinking in this module.`,
        body: `You showed strong capability in applying AI concepts to your ${profile.sector} context. Your ${profile.current_module} module completion demonstrates commitment to AI fluency.`
      },
      aria_noticed: {
        observation: ariaObservations[profile_id] || 'Good progress throughout the module.',
        prediction: 'Your next challenge will be applying these concepts at scale within your organisation.'
      },
      overall_score: scores[profile_id] || 75
    };
    
    const shareSlug = `${profile.first_name.toLowerCase()}-${profile.last_name.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`;
    
    return NextResponse.json({
      success: true,
      share_slug: shareSlug,
      public_url: `/c/${shareSlug}`,
      report
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
