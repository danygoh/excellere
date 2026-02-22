// Aria Service - AI Layer for Excellere Platform
// All Claude API calls go through here
// Does NOT handle PDF generation - that's reportGenerator.js

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

let supabase = null;
function getSupabase() {
  if (!supabase && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return supabase;
}

// Base persona - prepended to EVERY system prompt
const ARIA_BASE_PERSONA = `You are Aria, Excellere's AI learning coach. You work with senior business leaders — C-suite executives, strategy directors, heads of function — who are developing their AI leadership capability.

You are warm, precise, and challenging. You never flatter. You never produce generic output. Every response you generate references this specific learner's role, sector, and the specific words they used. If your response could have been written for any learner, it is wrong — rewrite it.

Return valid JSON only. No preamble, no markdown, no explanation.`;

// Core call function - all Claude calls go through here
async function callAria({ userId, callType, systemPrompt, userPrompt, model = 'claude-sonnet-4-5', temperature = 0.5 }) {
  const fullSystemPrompt = ARIA_BASE_PERSONA + '\n\n' + systemPrompt;
  const start = Date.now();

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 4000,
      temperature,
      system: fullSystemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const output = response.content[0].text;
    const latency = Date.now() - start;

    // Log every call to database
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('aria_calls').insert({
        user_id: userId,
        call_type: callType,
        model,
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        latency_ms: latency,
        output_preview: output.substring(0, 200)
      });
    }

    // Try to parse as JSON, return raw if fails
    try {
      return JSON.parse(output);
    } catch {
      return { raw: output, parse_error: true };
    }
  } catch (error) {
    console.error(`Aria call failed [${callType}]:`, error);
    throw error;
  }
}

// Rate limit check
async function checkRateLimit(userId) {
  const supabase = getSupabase();
  if (!supabase) return true; // Skip if no DB

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('aria_calls')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneHourAgo);

  if (count >= 20) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  return true;
}

// ─── EXPORTED FUNCTIONS ───────────────────────────────────────────────

// Infer learner profile from initial info
export async function inferProfile(userId, { role, sector, goal, cvText }) {
  const systemPrompt = `You are inferring a learner's cognitive profile based on their initial information. Return a JSON object with: cognitive_archetype, strengths, gaps, recommended_learning_path.`;

  const userPrompt = `Infer the cognitive profile for this learner:
Role: ${role}
Sector: ${sector}
Learning Goal: ${goal}
CV/Background: ${cvText || 'Not provided'}

Return JSON:
{
  "cognitive_archetype": "string",
  "strengths": ["string"],
  "gaps": ["string"],
  "recommended_learning_path": ["module_id"]
}`;

  return callAria({ userId, callType: 'infer_profile', systemPrompt, userPrompt });
}

// Calibrate profile based on assessment answers
export async function calibrateProfile(userId, { initialProfile, answers }) {
  const systemPrompt = `You are calibrating a learner's profile based on their assessment answers. Return updated profile with dimension_scores.`;

  const userPrompt = `Calibrate this learner's profile:
Initial Profile: ${JSON.stringify(initialProfile)}
Assessment Answers: ${JSON.stringify(answers)}

Return JSON with updated dimension_scores (0-100 each):
{
  "dimension_scores": {
    "ai_conceptual_literacy": 0-100,
    "strategic_ai_orientation": 0-100,
    "ai_native_thinking": 0-100,
    "change_leadership_readiness": 0-100,
    "ethical_governance_awareness": 0-100
  },
  "overall_score": 0-100,
  "stage": "AI Unaware | AI Curious | AI Informed | AI Fluent | AI Native",
  "profile_adjustments": ["string"]
}`;

  return callAria({ userId, callType: 'calibrate_profile', systemPrompt, userPrompt });
}

// Analyze teach-back response
export async function analyseTeachBack(userId, { conceptId, conceptBody, teachResponse, userProfile }) {
  const systemPrompt = `You are analysing a learner's teach-back response for a concept. Evaluate against the concept's score dimensions and identify gaps. Return structured analysis.`;

  const userPrompt = `Analyse this teach-back:
Concept ID: ${conceptId}
Concept Body: ${conceptBody}
Learner Profile: ${JSON.stringify(userProfile)}
Teach-Back Response: ${teachResponse}

Return JSON:
{
  "scores": {
    "dimension_1": 0-100,
    ...
  },
  "overall_strength": 0-100,
  "gap_flags": ["gap_flag_name", ...],
  "primary_gap": "string",
  "feedback": "string",
  "mastery_achieved": boolean,
  "next_difficulty": "same | harder | easier"
}`;

  return callAria({ userId, callType: 'analyse_teach_back', systemPrompt, userPrompt });
}

// Analyze deeper question response
export async function analyseDeeperResponse(userId, { conceptId, gapFlag, deeperResponse, userProfile }) {
  const systemPrompt = `You are analysing a learner's deeper question response. Determine if they've addressed the gap and achieved mastery.`;

  const userPrompt = `Analyse this deeper response:
Concept ID: ${conceptId}
Gap Flag: ${gapFlag}
Learner Profile: ${JSON.stringify(userProfile)}
Deeper Response: ${deeperResponse}

Return JSON:
{
  "gap_addressed": boolean,
  "mastery_achieved": boolean,
  "feedback": "string",
  "insights": ["string"]
}`;

  return callAria({ userId, callType: 'analyse_deeper', systemPrompt, userPrompt });
}

// Assess artefact
export async function assessArtefact(userId, { moduleId, artefactContent, userProfile }) {
  const systemPrompt = `You are assessing a learner's artefact (AI-Native Firm Audit, Double Loop Canvas, or Agent Opportunity Map). Evaluate quality and board-readiness.`;

  const userPrompt = `Assess this artefact:
Module ID: ${moduleId}
Learner Profile: ${JSON.stringify(userProfile)}
Artefact Content: ${JSON.stringify(artefactContent)}

Return JSON:
{
  "overall_score": 0-100,
  "board_readiness": 0-100,
  "strongest_element": "string",
  "development_area": "string",
  "specific_improvements": ["string"],
  "verifier_notes": "string"
}`;

  return callAria({ userId, callType: 'assess_artefact', systemPrompt, userPrompt });
}

// Generate onboarding assessment report
export async function generateAssessmentReport(userId, { learner, dimensionScores, overallScore, stage, calibrationAnswers }) {
  const systemPrompt = `You are Aria, generating a one-page assessment report for a senior business leader. Your report must be specific to this person's role, sector, and scores. Be honest — do not flatter.`;

  const userPrompt = `Generate the assessment report:
Learner: ${learner.first_name} ${learner.last_name}
Role: ${learner.job_title}
Sector: ${learner.sector}
Overall Score: ${overallScore}/100
Stage: ${stage}
Dimension Scores: ${JSON.stringify(dimensionScores)}
Calibration Answers: ${JSON.stringify(calibrationAnswers)}

Return JSON:
{
  "executive_summary": {
    "headline": "string",
    "paragraph_1": "string (strengths)",
    "paragraph_2": "string (development area)",
    "paragraph_3": "string (next stage prediction)"
  },
  "aria_noticed": "string (3-4 sentences, personal observation)",
  "recommendations": [
    { "priority": 1, "title": "string", "rationale": "string", "module_id": "string" },
    ...
  ]
}`;

  return callAria({ userId, callType: 'generate_assessment_report', systemPrompt, userPrompt });
}

// Generate final programme report
export async function generateFinalReport(userId, { learner, allModuleSessions, allArtefacts, cognitiveProfile, onboardingScores }) {
  const systemPrompt = `You are Aria, generating the final programme assessment report. This is the most important document Excellere produces — it will go on their CV and be shared with their board. Be specific, quote their actual responses, honest about gaps.`;

  const userPrompt = `Generate the final programme report:
Learner: ${JSON.stringify(learner)}
Module Sessions: ${JSON.stringify(allModuleSessions)}
Artefacts: ${JSON.stringify(allArtefacts)}
Cognitive Profile: ${JSON.stringify(cognitiveProfile)}
Onboarding Scores: ${JSON.stringify(onboardingScores)}

Return JSON:
{
  "transformation_narrative": {
    "headline": "string",
    "opening_arc": "string",
    "key_evolution": "string"
  },
  "module_summaries": [
    {
      "module_id": "string",
      "mastery_evidence": "string (quote from their response)",
      "primary_gap": "string",
      "artefact_assessment": {
        "overall": "string",
        "strongest_element": "string",
        "development_area": "string"
      }
    }
  ],
  "cognitive_evolution": {
    "dimension_changes": {
      "dimension_name": { "start": 0, "end": 0, "narrative": "string" }
    },
    "most_significant_shift": "string"
  },
  "capability_statement": "string (4-5 sentences, third-person, for CV/LinkedIn)",
  "aria_noticed": "string (4-5 sentences, your best work - personal observation)",
  "overall_programme_score": 0-100,
  "badges_summary": [{ "badge": "string", "evidence": "string" }]
}`;

  return callAria({ userId, callType: 'generate_final_report', systemPrompt, userPrompt, temperature: 0.7 });
}

// Generate "What Aria Noticed" for insight reports
export async function generateAriaObservation(userId, { sessionHistory, artefacts, learnerProfile }) {
  const systemPrompt = `You are Aria. Generate a personal observation about this learner based on their programme progress. This is the "What Aria Noticed" section — your most personal and memorable output.`;

  const userPrompt = `Generate your observation:
Session History: ${JSON.stringify(sessionHistory)}
Artefacts: ${JSON.stringify(artefacts)}
Learner Profile: ${JSON.stringify(learnerProfile)}

Return JSON:
{
  "observation": "string (3-5 sentences, specific and personal)",
  "characteristic_moment": "string (specific quote or moment from their work)",
  "growth_area": "string",
  "prediction": "string (where they'll struggle next)"
}`;

  return callAria({ userId, callType: 'generate_aria_noticed', systemPrompt, userPrompt });
}

export default {
  inferProfile,
  calibrateProfile,
  analyseTeachBack,
  analyseDeeperResponse,
  assessArtefact,
  generateAssessmentReport,
  generateFinalReport,
  generateAriaObservation,
  checkRateLimit
};
