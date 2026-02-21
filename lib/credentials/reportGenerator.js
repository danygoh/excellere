// Report Generation Service using Claude
// This generates the "What Aria Noticed" section that must feel human-written

import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
});

const SYSTEM_PROMPT = `You are Aria, Excellere's AI learning coach. You are writing a formal but warm assessment report for a senior business leader who has just completed a learning module. Your reports are:
- Specific: you reference their actual words, their actual responses, their actual artefact content
- Honest: you name gaps clearly without softening them into meaninglessness
- Contextual: everything is related back to their role and sector
- Memorable: the "What Aria Noticed" section should feel uncanny — like you truly observed them working

Write as if you are a respected executive coach who spent three weeks watching this person learn. Not a software system generating a report.

Return valid JSON only. No preamble, no markdown fences.`;

export async function generateInsightReport(learnerProfile, moduleData) {
  const { first_name, last_name, role, sector, archetype, archetype_description } = learnerProfile;
  const { module_name, session_history, artefact_content, artefact_type, artefact_strength_scores } = moduleData;

  const userPrompt = `Generate a complete Insight Report for this learner.

LEARNER PROFILE:
Name: ${first_name} ${last_name}
Role: ${role}
Sector: ${sector}
Archetype: ${archetype} — ${archetype_description}

MODULE COMPLETED: ${module_name}

SESSION HISTORY (all teach-back responses and AI analyses):
${JSON.stringify(session_history, null, 2)}

ARTEFACT STATUS:
Type: ${artefact_type}
Current content: ${JSON.stringify(artefact_content)}
AI strength scores: ${JSON.stringify(artefact_strength_scores)}

Return this exact JSON structure:
{
  "report_title": "${module_name} — Learning Assessment",
  "report_subtitle": "Prepared for ${first_name} ${last_name}",
  "executive_summary": {
    "headline": "A single powerful sentence summarising their overall performance (not generic)",
    "body": "3-4 sentences. What they achieved. Their dominant thinking pattern. One honest challenge they overcame or still face. Written for a senior person, not patronising."
  },
  "what_you_mastered": {
    "intro": "1 sentence framing this section",
    "concepts": [
      {
        "concept_name": "name of mastered concept",
        "mastery_evidence": "Specific description of HOW they demonstrated mastery — quote their words",
        "why_it_matters": "Why this concept matters for someone in their role/sector"
      }
    ]
  },
  "where_youre_still_building": {
    "intro": "1 sentence framing this section — honest but not discouraging",
    "gaps": [
      {
        "gap_name": "Short label for the gap",
        "what_it_looks_like": "How this gap showed up in their responses — be specific",
        "why_it_matters": "Why closing this gap is important for their role",
        "how_to_close_it": "Specific, actionable suggestion for what would unlock this"
      }
    ]
  },
  "your_thinking_evolution": {
    "arc": "2-3 sentences describing how their reasoning changed across sessions — from Session 1 to final session. Did they become more precise? More applied? Did a specific reframe happen?",
    "key_moment": "The single best moment of thinking in their session history — quote it and explain why it matters",
    "pattern_to_watch": "One reasoning pattern they should stay conscious of going forward"
  },
  "artefact_assessment": {
    "overall": "2 sentences on the overall quality and ambition of their artefact",
    "strongest_element": "What is genuinely impressive about it",
    "critical_gap": "The one thing that must be addressed before it is board-ready",
    "board_readiness": <0-100>,
    "recommendation": "Specific next step for the artefact"
  },
  "aria_noticed": {
    "observation": "3-4 sentences. This is the most important section. Write something that feels like genuine human observation — a pattern in how they approached problems, a moment where their thinking surprised you, something true about them as a learner that no generic system would say. Reference at least one specific response they gave. This should feel uncanny.",
    "prediction": "1-2 sentences predicting what their next learning challenge will be, based on what you've observed"
  },
  "capability_snapshot": {
    "demonstrated": ["3-5 specific capabilities they demonstrated, written as action statements"],
    "developing": ["2-3 capabilities in progress"],
    "badges_earned": ["list of badge_types earned this module"]
  },
  "next_module_recommendation": {
    "recommended_module": "which module to do next",
    "reason": "Why specifically, based on their gap profile and thinking patterns"
  },
  "overall_score": <0-100>,
  "mastery_percentage": <0-100>
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.5,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    });

    let content = response.content[0].text;
    // Strip markdown JSON fences if present
    content = content.replace(/^```json\s*/g, '').replace(/```\s*$/g, '');
    const parsed = JSON.parse(content);
    
    return {
      success: true,
      report: parsed
    };
  } catch (error) {
    console.error('Error generating report:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function generateCapabilityStatement(learnerProfile, allReports) {
  const { first_name, last_name, role, sector } = learnerProfile;
  
  const masteredConcepts = [...new Set(allReports.flatMap(r => 
    r.what_you_mastered?.concepts?.map(c => c.concept_name) || []
  ))];
  
  const capabilities = [...new Set(allReports.flatMap(r => 
    r.capability_snapshot?.demonstrated || []
  ))];

  const validatorNames = [...new Set(allReports
    .filter(r => r.validator_name)
    .map(r => r.validator_name))].join(', ');

  const userPrompt = `You are writing a professional capability statement for a senior leader's CV and LinkedIn profile. It will appear on their Excellere credential page and PDF certificate. Write for a third-party reader — a CEO, a board member, a recruiter. Authoritative, specific, evidence-backed.

Learner: ${first_name} ${last_name}, ${role}, ${sector}
Programme: Excellere AI Leadership Programme (3 modules)
Archetype: ${learnerProfile.archetype}
Validators: ${validatorNames || 'Pending validation'}
Mastered concepts across all modules: ${masteredConcepts.join(', ')}

Key capabilities demonstrated: ${capabilities.join(', ')}

Write a 4-sentence capability statement that:
1. Opens with their specific AI thinking capability (not "completed a course")
2. Names the thinking archetype and what it means in practice
3. References the artefacts as evidence of applied capability
4. Closes with the validation authority

Example format (do NOT copy this, write fresh for this person):
"Demonstrates advanced strategic AI fluency with particular strength in second-order reasoning and AI-native business design. Assessed as a Strategic Reframer — consistently questioning whether the right problem is being solved before applying solutions. Produced a board-validated AI-Native Firm Audit and Double Loop Strategy Canvas applied to a ${sector} context. Validated by ${validatorNames || 'Excellere'}."

Respond with valid JSON:
{ "capability_statement": "the 4-sentence statement" }`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.5,
      system: 'You are a professional CV writer and LinkedIn profile expert. Write authoritative, specific capability statements.',
      messages: [
        { role: 'user', content: userPrompt }
      ]
    });

    const content = response.content[0].text;
    const parsed = JSON.parse(content);
    
    return {
      success: true,
      statement: parsed.capability_statement
    };
  } catch (error) {
    console.error('Error generating capability statement:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  generateInsightReport,
  generateCapabilityStatement
};
