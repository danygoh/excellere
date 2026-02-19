/**
 * AI Service for Excellere
 * Handles all AI operations through Anthropic Claude API
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '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'
const ANTHROPIC_BASE_URL = 'https://api.anthropic.com/v1'

/**
 * Make request to Anthropic API
 */
async function anthropicRequest(messages, systemPrompt, maxTokens = 1024, model = 'claude-sonnet-4-20250514') {
  const response = await fetch(`${ANTHROPIC_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages
    })
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Anthropic API error:', error)
    throw new Error('AI request failed')
  }

  const data = await response.json()
  return data.content?.[0]?.text || ''
}

/**
 * 1. Profile Inference
 * Called after intake form submission to build initial cognitive profile
 */
export async function inferProfile({ role, sector, goal, cvText, linkedinUrl }) {
  const systemPrompt = `You are an expert at inferring cognitive and professional profiles from sparse data.
  
Given information about a senior business leader, infer their likely:
1. Knowledge strengths (3-5 specific items)
2. Knowledge gaps (3-5 specific items)  
3. Thinking style
4. Predicted learning challenges
5. Suggested profile tags (max 8)
6. Archetype label and description

Be specific. Draw on what senior ${sector} leaders typically know and don't know about AI.

Return as structured JSON.`

  const userMessage = `Role: ${role}
Sector: ${sector}
Goal: ${goal}
CV text: ${cvText || 'Not provided'}
LinkedIn: ${linkedinUrl || 'Not provided'}`

  const result = await anthropicRequest(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    1500
  )

  // Parse JSON from response
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse profile JSON:', e)
  }

  return { error: 'Failed to parse profile', raw: result }
}

/**
 * 2. Calibration Analysis
 * Called after each calibration question answer
 */
export async function analyzeCalibration({ questionId, answerId, answerText, previousAnswers }) {
  const systemPrompt = `You are analyzing a senior business leader's response to a cognitive calibration question.

Return a JSON object with:
- signal: A 1-2 sentence insight about what this answer reveals about their thinking pattern
- reasoning_pattern: The underlying cognitive pattern detected
- dimension_impact: Which of the 4 dimensions this affects (strategic/operational, conceptual/technical, single/double loop, challenge/confirmation)`

  const userMessage = `Question ID: ${questionId}
Answer: ${answerText}
Previous answers: ${JSON.stringify(previousAnswers)}`

  const result = await anthropicRequest(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    500
  )

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse calibration JSON:', e)
  }

  return { signal: result }
}

/**
 * 3. Teach-Back Analysis (CORE OPERATION)
 * The most important AI operation - analyzes learner's explanation
 */
export async function analyzeTeachBack({
  conceptId,
  conceptBody,
  teachResponse,
  cognitiveFingerprint,
  sector,
  identifiedGaps = []
}) {
  const systemPrompt = `You are analysing a senior business leader's teach-back response for the concept of ${conceptId}.

This is the CORE differentiator for Excellere. Your feedback MUST:
1. Quote or closely reference what they actually wrote
2. Name what they got right in SPECIFIC terms, not generic praise
3. Name the specific gap with PRECISION
4. Explain why the gap matters in their SPECIFIC context (${sector})
5. Make the next question feel like a natural, personalised consequence

Return JSON:
{
  "scores": {
    "concept_accuracy": 0-100,
    "applied_to_context": 0-100,
    "compounding_argument": 0-100,
    "clarity_for_non_technical": 0-100
  },
  "gaps": ["specific gap 1", "specific gap 2"],
  "strengths": ["what they got right"],
  "personalised_feedback": {
    "what_you_got_right": "text, specific to their response",
    "the_gap": "text, what was missing and why it matters",
    "tailored_for_sector": "text, explaining the gap specifically in ${sector} context"
  },
  "next_difficulty": "medium|hard|very_hard",
  "next_question_targeting": "string explaining what the next question should probe"
}`

  const userMessage = `Concept: ${conceptBody}

Learner's teach-back response:
${teachResponse}

Their cognitive fingerprint: ${JSON.stringify(cognitiveFingerprint)}

Previously identified gaps: ${identifiedGaps.join(', ') || 'None'}`

  const result = await anthropicRequest(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    1500,
    'claude-sonnet-4-20250514'
  )

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse teach-back JSON:', e)
  }

  return { 
    error: 'Failed to parse analysis',
    raw: result,
    scores: { concept_accuracy: 50, applied_to_context: 50, compounding_argument: 50, clarity_for_non_technical: 50 },
    gaps: [],
    strengths: [],
    personalised_feedback: { what_you_got_right: 'Analysis in progress', the_gap: '', tailored_for_sector: '' },
    next_difficulty: 'medium',
    next_question_targeting: ''
  }
}

/**
 * 4. Artefact Assistance
 * AI suggestions for artefact drafts
 */
export async function assistArtefact({
  artefactType,
  draftContent,
  learnerProfile,
  sessionHistory
}) {
  const systemPrompt = `You are an AI coach helping a senior business leader build their ${artefactType}.

Provide:
- strength_scores (strategic_clarity, firm_specificity, compounding_argument, board_readiness)
- suggestions (section, issue, suggestion)
- readiness_assessment
- priority_action`

  const userMessage = `Artefact type: ${artefactType}
Draft content: ${draftContent}
Learner profile: ${JSON.stringify(learnerProfile)}
Session history: ${JSON.stringify(sessionHistory)}`

  const result = await anthropicRequest(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    1000
  )

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse artefact assistance JSON:', e)
  }

  return { error: 'Failed to parse', suggestions: [] }
}

/**
 * 5. Live Session AI Coach
 * Real-time coaching during live sessions
 */
export async function getLiveSessionCoaching({
  learnerId,
  sessionContext,
  chatMessages,
  participationPatterns
}) {
  const systemPrompt = `You are an AI observer in a live cohort session. Generate per-learner coaching notes.

Provide:
- current_moment: What's happening right now relevant to this learner
- pattern_alerts: Any recurring reasoning patterns from their history
- preparation_notes: What they should prepare for upcoming segments
- intervention_suggestion: Whether to nudge them (and how)`

  const userMessage = `Learner: ${learnerId}
Session context: ${sessionContext}
Recent chat: ${JSON.stringify(chatMessages)}
Participation: ${JSON.stringify(participationPatterns)}`

  const result = await anthropicRequest(
    [{ role: 'user', content: userMessage }],
    systemPrompt,
    500,
    'claude-haiku-4-20250514'
  )

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse live coaching JSON:', e)
  }

  return { current_moment: '', pattern_alerts: [], preparation_notes: '', intervention_suggestion: '' }
}
