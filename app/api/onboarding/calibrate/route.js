// API Route: Onboarding - Calibration
// Refines the inferred profile based on actual answers to calibration questions
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Calibration questions
export const calibrationQuestions = [
  {
    id: 1,
    question: "Your CEO says: 'We need to deploy AI or we'll fall behind.' Your first instinct is to ask which question?",
    persona: "CEO",
    dimension: "single_vs_double_loop",
    options: [
      { id: 'A', text: "Behind on what, exactly? That answer changes everything.", signal: "double_loop" },
      { id: 'B', text: "Which AI tools are our competitors already using?", signal: "single_loop" },
      { id: 'C', text: "Do we have the data infrastructure to support AI at scale?", signal: "implementation" },
      { id: 'D', text: "What's our risk appetite given regulatory exposure?", signal: "risk_first" }
    ]
  },
  {
    id: 2,
    question: "Monzo builds features with AI designing the first version; humans review exceptions. A traditional bank has humans design with AI assisting. What's the strategic difference?",
    persona: "Board",
    dimension: "conceptual_vs_technical",
    options: [
      { id: 'A', text: "Monzo is faster and cheaper — a process efficiency advantage", signal: "efficiency" },
      { id: 'B', text: "They're both using AI — the difference is mostly cultural", signal: "skeptic" },
      { id: 'C', text: "Monzo's process compounds — every AI improvement raises the whole team. The bank's is bounded by human capacity", signal: "compound" },
      { id: 'D', text: "Monzo takes more risk by reducing human oversight", signal: "risk" }
    ]
  },
  {
    id: 3,
    question: "A major insurer uses AI to process claims 60% faster with the same accuracy. The Board celebrates. The Strategy Director stays quiet. Why might she be the only one asking the right question?",
    persona: "Strategy Director",
    dimension: "challenge_vs_confirmation",
    options: [
      { id: 'A', text: "She's worried about the jobs that will be displaced", signal: "people" },
      { id: 'B', text: "She's questioning whether claims processing is still a defensible part of the value chain — or whether AI just made it a commodity anyone can replicate", signal: "double_loop" },
      { id: 'C', text: "She's concerned accuracy metrics don't capture edge cases", signal: "technical" },
      { id: 'D', text: "She's thinking about the regulatory implications", signal: "risk" }
    ]
  }
];

export async function GET() {
  // Return calibration questions
  return NextResponse.json({
    success: true,
    questions: calibrationQuestions.map(q => ({
      id: q.id,
      question: q.question,
      persona: q.persona,
      options: q.options.map(o => ({ id: o.id, text: o.text }))
    }))
  });
}

export async function POST(request) {
  try {
    const { initialProfile, answers } = await request.json();
    
    if (!initialProfile || !answers || answers.length < 3) {
      return NextResponse.json({
        error: 'Initial profile and 3 answers required'
      }, { status: 400 });
    }

    // Map answers to signals
    const answerMap = calibrationQuestions.reduce((acc, q) => {
      const answer = answers.find(a => a.question_id === q.id);
      if (answer) {
        const selectedOption = q.options.find(o => o.id === answer.answer);
        acc[q.id] = {
          answer_text: selectedOption?.text || '',
          signal: selectedOption?.signal || 'unknown',
          dimension: q.dimension
        };
      }
      return acc;
    }, {});

    const systemPrompt = `You are refining a cognitive profile based on actual answers to calibration questions. The user has completed three strategic thinking questions. Use their specific answer patterns to refine the profile. Return valid JSON only.`;

    const userPrompt = `
User profile (initial inference):
${JSON.stringify(initialProfile, null, 2)}

Calibration answers:

Q1 (Strategic Framing - ${answerMap[1]?.dimension}): "${answerMap[1]?.answer_text}" — signal: ${answerMap[1]?.signal}

Q2 (AI-Native Thinking - ${answerMap[2]?.dimension}): "${answerMap[2]?.answer_text}" — signal: ${answerMap[2]?.signal}

Q3 (Double Loop Thinking - ${answerMap[3]?.dimension}): "${answerMap[3]?.answer_text}" — signal: ${answerMap[3]?.signal}

Refine the profile based on these actual answers. Return JSON:

{
  "refined_archetype": "updated label if needed, otherwise same",
  "refined_description": "updated 2-3 sentences that reference their answer pattern specifically",
  "updated_dimensions": {
    "strategic_vs_operational": <refined score 0-100>,
    "conceptual_vs_technical": <refined score 0-100>,
    "single_vs_double_loop": <refined score 0-100>,
    "challenge_vs_confirmation": <refined score 0-100>
  },
  "fingerprint_insight": "1-2 sentences that will feel uncanny — like the platform read their mind. Reference their specific answer pattern."
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      temperature: 0.3,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    let content = response.content[0].text;
    content = content.replace(/^```json\s*/g, '').replace(/```\s*$/g, '');
    
    const refinedProfile = JSON.parse(content);
    
    return NextResponse.json({
      success: true,
      profile: {
        ...refinedProfile,
        calibrated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Calibration error:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
