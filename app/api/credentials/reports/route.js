// API Route: Generate Insight Report
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import slugify from 'slugify';
import db, { BADGE_CRITERIA } from '../../../../lib/credentials/db';
import testProfiles from '../../../../lib/credentials/testProfiles';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
});

const SYSTEM_PROMPT = `You are Aria, Excellere's AI learning coach. You are writing a formal but warm assessment report for a senior business leader who has just completed a learning module. Your reports are:
- Specific: you reference their actual words, their actual responses, their artefact content
- Honest: you name gaps clearly without softening them
- Contextual: everything relates back to their role and sector
- Memorable: the "What Aria Noticed" section should feel uncanny — like you truly observed them working

Write as if you're a respected executive coach who spent three weeks watching this person learn.

Return valid JSON only. No preamble, no markdown fences.`;

function generateSlug(firstName, lastName) {
  const base = slugify(`${firstName}-${lastName}`, { lower: true });
  const random = Math.random().toString(36).substring(2, 7);
  return `${base}-${random}`;
}

function evaluateBadges(sessionHistory, artefactScores) {
  const earned = [];
  const doubleLoopCount = sessionHistory.filter(s => s.ai_analysis?.double_loop_detected === true).length;
  const contextApplyCount = sessionHistory.filter(s => s.ai_analysis?.applied_to_own_context === true).length;
  const precisionCount = sessionHistory.filter(s => (s.ai_analysis?.concept_accuracy || 0) > 85).length;
  
  if (doubleLoopCount >= 2) { earned.push('strategic_reframer'); earned.push('double_loop_thinker'); }
  if (contextApplyCount >= 3) earned.push('context_applier');
  if (precisionCount >= 2) earned.push('precision_thinker');
  if ((artefactScores?.strategic_alignment || 0) > 80) earned.push('ai_native_architect');
  
  return earned;
}

export async function POST(request) {
  console.log('API called, ANTHROPIC_API_KEY present:', !!process.env.ANTHROPIC_API_KEY);
  try {
    const { profile_id } = await request.json();
    
    const profile = testProfiles.find(p => p.id === profile_id);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }
    
    const userPrompt = `Generate a complete Insight Report for this learner.

LEARNER: ${profile.first_name} ${profile.last_name}, ${profile.role}, ${profile.sector}
Archetype: ${profile.archetype} — ${profile.archetype_description}

MODULE: ${profile.current_module}

SESSION HISTORY:
${JSON.stringify(profile.session_history, null, 2)}

ARTEFACTS:
${JSON.stringify(profile.artefact, null, 2)}

Return this exact JSON structure:
{
  "report_title": "${profile.current_module} — Learning Assessment",
  "executive_summary": { "headline": "single powerful sentence", "body": "3-4 sentences" },
  "what_you_mastered": { "intro": "1 sentence", "concepts": [{ "concept_name": "name", "mastery_evidence": "specific quote from their responses", "why_it_matters": "why important for their role" }] },
  "where_youre_still_building": { "intro": "1 sentence", "gaps": [{ "gap_name": "label", "what_it_looks_like": "specific", "why_it_matters": "importance", "how_to_close_it": "actionable" }] },
  "your_thinking_evolution": { "arc": "2-3 sentences", "key_moment": "quote their best thinking", "pattern_to_watch": "one pattern" },
  "artefact_assessment": { "overall": "2 sentences", "strongest_element": "what's impressive", "critical_gap": "what must be addressed", "board_readiness": 0-100, "recommendation": "next step" },
  "aria_noticed": { "observation": "3-4 sentences, reference at least one specific response, feel uncanny", "prediction": "1-2 sentences about next challenge" },
  "capability_snapshot": { "demonstrated": ["3-5 action statements"], "developing": ["2-3"], "badges_earned": [] },
  "next_module_recommendation": { "recommended_module": "which", "reason": "why based on gaps" },
  "overall_score": 0-100, "mastery_percentage": 0-100
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.5,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    });

    let content = response.content[0].text;
    content = content.replace(/^```json\s*/g, '').replace(/```\s*$/g, '');
    const report = JSON.parse(content);
    
    const badgesEarned = evaluateBadges(profile.session_history, profile.artefact.strength_scores);
    const shareSlug = generateSlug(profile.first_name, profile.last_name);
    
    const reportRecord = db.createInsightReport({
      user_id: profile.id,
      profile_data: profile,
      module_id: slugify(profile.current_module, { lower: true }),
      report_content: report,
      share_slug: shareSlug,
      is_public: false,
      badges_earned: badgesEarned,
      overall_score: report.overall_score,
      mastery_percentage: report.mastery_percentage
    });
    
    badgesEarned.forEach(badgeType => {
      db.createBadge({
        user_id: profile.id,
        badge_type: badgeType,
        badge_name: BADGE_CRITERIA[badgeType]?.name || badgeType,
        badge_description: BADGE_CRITERIA[badgeType]?.description,
        evidence: `Earned in ${profile.current_module}`,
        shown_on_credential: true
      });
    });

    return NextResponse.json({
      success: true,
      report_id: reportRecord.id,
      share_slug: shareSlug,
      badges_earned: badgesEarned,
      report: {
        report_title: report.report_title,
        executive_summary: report.executive_summary,
        aria_noticed: report.aria_noticed,
        overall_score: report.overall_score,
        mastery_percentage: report.mastery_percentage
      }
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const profiles = testProfiles.map(p => ({
    id: p.id,
    name: `${p.first_name} ${p.last_name}`,
    role: p.role,
    sector: p.sector,
    archetype: p.archetype
  }));
  return NextResponse.json({ success: true, profiles });
}
