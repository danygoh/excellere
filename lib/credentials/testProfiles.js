// Five realistic test profiles for testing the credential system

export const testProfiles = [
  {
    id: 'test-001',
    first_name: 'Sarah',
    last_name: 'Chen',
    email: 'sarah.chen@fintechglobal.com',
    role: 'Chief Operating Officer',
    sector: 'FinTech',
    archetype: 'Strategic Reframer',
    archetype_description: 'Sarah consistently questions whether the right problem is being solved before proposing solutions. She challenges assumptions at the root level and brings second-order thinking.',
    current_module: 'AI-Native Business Design',
    session_history: [
      { session: 1, topic: 'Introduction to AI-Native Thinking', response: 'I initially thought AI-native was just about using AI tools. But I realize now it\'s about fundamentally rethinking how we create value. For my COO role, this means questioning whether our current operational models can survive in an AI-first world.', ai_analysis: { reasoning_quality: 'Excellent', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 88 }},
      { session: 2, topic: 'The AI Maturity Matrix', response: 'Looking at our organisation through the maturity matrix, we\'re stuck at Level 2 - using AI for efficiency but not transformation. The gap to Level 3 (AI-native) isn\'t about technology - it\'s about our decision-making framework.', ai_analysis: { reasoning_quality: 'Outstanding', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 92 }},
      { session: 3, topic: 'Building AI-First Processes', response: 'The key insight was that AI-first doesn\'t mean AI-only. It means designing processes where AI is the default decision-maker, but humans retain strategic override.', ai_analysis: { reasoning_quality: 'Excellent', applied_to_own_context: true, double_loop_detected: false, concept_accuracy: 85 }}
    ],
    artefact: { type: 'AI-Native Operating Model Proposal', content: { title: 'Transforming FinTech Global to AI-Native Operations', summary: 'A proposal to restructure core operational processes around AI decision-making', key_points: ['Redesign credit decision workflow', 'Human-in-the-loop for edge cases', 'AI ops team with domain expertise'] }, strength_scores: { strategic_alignment: 88, feasibility: 72, innovation: 85, implementation_clarity: 68 }}
  },
  {
    id: 'test-002',
    first_name: 'Marcus',
    last_name: 'Williams',
    email: 'marcus.w@healthcareventures.com',
    role: 'VP of Innovation',
    sector: 'Healthcare',
    archetype: 'Pragmatic Implementer',
    archetype_description: 'Marcus grounds every AI discussion in practical implementation. He\'s focused on what can be deployed today with measurable ROI.',
    current_module: 'Agentic AI for Business',
    session_history: [
      { session: 1, topic: 'Understanding AI Agents', response: 'AI agents are autonomous decision-making systems. In healthcare, the immediate opportunity is automating prior authorization - it\'s rule-based, high-volume, and frustrating for patients.', ai_analysis: { reasoning_quality: 'Good', applied_to_own_context: true, double_loop_detected: false, concept_accuracy: 78 }},
      { session: 2, topic: 'Agent Architecture Patterns', response: 'The tool-use pattern makes sense. Our agents need to query EMR systems, access drug databases, and update patient records. The challenge is HIPAA compliance.', ai_analysis: { reasoning_quality: 'Good', applied_to_own_context: true, double_loop_detected: false, concept_accuracy: 82 }},
      { session: 3, topic: 'Multi-Agent Orchestration', response: 'We need three agents: eligibility, clinical guidelines, documentation. They should operate in sequence. Concerned about error propagation.', ai_analysis: { reasoning_quality: 'Very Good', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 79 }}
    ],
    artefact: { type: 'Multi-Agent System Design', content: { title: 'Healthcare Prior Authorization Agent System', summary: 'Design for a three-agent system', key_points: ['Three-agent sequential architecture', 'HIPAA-compliant audit logging', 'Human escalation for edge cases'] }, strength_scores: { strategic_alignment: 75, feasibility: 88, innovation: 65, implementation_clarity: 85 }}
  },
  {
    id: 'test-003',
    first_name: 'Elena',
    last_name: 'Rodriguez',
    email: 'elena.r@legacybank.com',
    role: 'Head of Digital Transformation',
    sector: 'Banking',
    archetype: 'Catalyst Leader',
    archetype_description: 'Elena\'s strength is driving organisational change around AI. She connects technical possibilities with business outcomes.',
    current_module: 'AI Strategy & Governance',
    session_history: [
      { session: 1, topic: 'AI Governance Frameworks', response: 'Our board wants an AI governance framework, but they\'re focused on compliance instead of stewardship. I need to reframe the conversation to competitive advantage.', ai_analysis: { reasoning_quality: 'Excellent', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 90 }},
      { session: 2, topic: 'Risk & Compliance in AI', response: 'The EU AI Act changes everything. As a European bank, we need to categorize all AI systems by risk. The question is: how do we turn compliance into a differentiator?', ai_analysis: { reasoning_quality: 'Excellent', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 87 }},
      { session: 3, topic: 'Building AI-Ready Culture', response: 'The biggest barrier isn\'t technology - it\'s our 30-year veterans who see AI as a threat. My approach: pair AI tools with mentorship programs.', ai_analysis: { reasoning_quality: 'Very Good', applied_to_own_context: true, double_loop_detected: false, concept_accuracy: 84 }}
    ],
    artefact: { type: 'AI Governance Strategy', content: { title: 'Legacy Bank AI Governance Framework 2026', summary: 'Comprehensive governance framework positioning AI compliance as competitive advantage', key_points: ['Risk-tiered AI system classification', 'Board-level AI stewardship committee', 'Responsible AI as brand differentiator'] }, strength_scores: { strategic_alignment: 92, feasibility: 70, innovation: 78, implementation_clarity: 75 }}
  },
  {
    id: 'test-004',
    first_name: 'James',
    last_name: 'O\'Connor',
    email: 'james.oconnor@manufacturing.io',
    role: 'CEO',
    sector: 'Manufacturing',
    archetype: 'Visionary Architect',
    archetype_description: 'James thinks in systems and structures. He sees AI as a foundation for redesigning entire value chains.',
    current_module: 'Double Loop Strategy',
    session_history: [
      { session: 1, topic: 'First vs Second Order Thinking', response: 'Most executives confuse first-order thinking with second-order. Our industry is guilty - we keep improving manufacturing efficiency while the market shifts toward service models.', ai_analysis: { reasoning_quality: 'Outstanding', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 95 }},
      { session: 2, topic: 'The Double Loop Framework', response: 'The double loop isn\'t about thinking harder - it\'s about thinking about the thinking. For our business, the second loop is: why are we optimizing production? Maybe the answer isn\'t more efficiency but a different business model.', ai_analysis: { reasoning_quality: 'Outstanding', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 93 }},
      { session: 3, topic: 'AI as Strategy Catalyst', response: 'AI gives us permission to question assumptions we\'ve held for decades. If AI can predict maintenance needs, do we need to own factories? The strategy is what AI enables us to stop doing.', ai_analysis: { reasoning_quality: 'Exceptional', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 97 }}
    ],
    artefact: { type: 'Strategic Transformation Canvas', content: { title: 'Manufacturing 2030: From Products to Services', summary: 'Double-loop strategy canvas reenvisioning the business model', key_points: ['Transition to outcome-based contracts', 'AI-enabled remote monitoring', 'Platform model'] }, strength_scores: { strategic_alignment: 98, feasibility: 55, innovation: 95, implementation_clarity: 60 }}
  },
  {
    id: 'test-005',
    first_name: 'Aisha',
    last_name: 'Patel',
    email: 'aisha.patel@consultingfirm.com',
    role: 'Managing Partner',
    sector: 'Professional Services',
    archetype: 'Bridge Builder',
    archetype_description: 'Aisha connects different worlds - technology and business, clients and consultants. She translates AI complexity into client-relevant language.',
    current_module: 'AI for Client Value',
    session_history: [
      { session: 1, topic: 'Identifying AI Opportunities', response: 'For our consulting clients, the biggest AI opportunity isn\'t in operations - it\'s in customer experience. Every client wants to talk about AI but doesn\'t know where to start.', ai_analysis: { reasoning_quality: 'Good', applied_to_own_context: true, double_loop_detected: false, concept_accuracy: 76 }},
      { session: 2, topic: 'Value Proposition Design', response: 'The mistake consultants make is pitching AI as a technology. We need to pitch it as capability. For retail: "we\'ll help you predict what customers want before they know it."', ai_analysis: { reasoning_quality: 'Very Good', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 83 }},
      { session: 3, topic: 'Scaling AI Solutions', response: 'The consulting model is broken for AI. We can\'t bill by the hour for something that gets cheaper by month. We need outcome-based pricing - take a % of revenue uplift.', ai_analysis: { reasoning_quality: 'Excellent', applied_to_own_context: true, double_loop_detected: true, concept_accuracy: 89 }}
    ],
    artefact: { type: 'AI Consulting Offer Development', content: { title: 'Professional Services AI Value Proposition', summary: 'Redesigned consulting offer repositioning as AI transformation partner', key_points: ['Outcome-based pricing model', 'Industry-specific AI playbooks', 'Client AI capability building'] }, strength_scores: { strategic_alignment: 85, feasibility: 82, innovation: 80, implementation_clarity: 88 }}
  }
];

export default testProfiles;
