// API Route: Sessions - Analyse Teach-Back Response
// Part of the Learning Loop - Analyse phase
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import db from '@/lib/database';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function POST(request) {
  try {
    const { 
      sessionId,
      userId,
      conceptId,
      teachResponse,
      userProfile,
      difficulty = 'medium'
    } = await request.json();
    
    if (!conceptId || !teachResponse) {
      return NextResponse.json({
        error: 'Missing required fields: conceptId, teachResponse'
      }, { status: 400 });
    }
    
    // Fetch concept from database
    const concept = await db.getConcept(conceptId, userProfile?.sector);
    
    if (!concept) {
      return NextResponse.json({ error: 'Concept not found' }, { status: 404 });
    }

    const systemPrompt = `You are Aria, Excellere's AI learning coach. You analyse how senior business leaders explain complex concepts and give them precise, personalised feedback.

Your feedback must:
1. Reference the specific words and phrases they used in their response
2. Name what they got right with precision — not generic praise
3. Identify the specific gap with a clear short name
4. Explain why that gap matters specifically in their role and sector
5. Write as if you know them — because you do

Never be generic. If your feedback could apply to any learner, rewrite it.

Return valid JSON only.`;

    const userPrompt = `
Learner:
- Name: ${userProfile?.first_name || userProfile?.firstName || 'Learner'}
- Role: ${userProfile?.job_title || userProfile?.role || 'professional'} at a ${userProfile?.sector || 'organisation'}

Concept: "${concept.name}"
Full concept text: ${concept.body_text}

Their explanation: "${teachResponse}"

Analyse and return:

{
  "scores": {
    "concept_accuracy": <0-100>,
    "applied_to_own_context": <0-100>,
    "explained_key_mechanism": <0-100>,
    "clarity_for_non_technical": <0-100>
  },
  "overall_strength": <0-100>,
  "feedback": {
    "what_you_got_right": "2-3 sentences. Quote their specific words. Genuine, not flattering.",
    "the_gap": "2-3 sentences. Name the missing element clearly.",
    "tailored_insight": "2-3 sentences. Apply the gap to their context."
  },
  "primary_gap": {
    "name": "short label e.g. 'compounding mechanism'",
    "what_was_missing": "specific description",
    "why_it_matters": "why this matters"
  },
  "next_difficulty": "easy|medium|hard|very_hard",
  "badges_earned": []
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.5,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    let content = response.content[0].text;
    content = content.replace(/^```json\s*/g, '').replace(/```\s*$/g, '');
    
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      analysis = {
        scores: { concept_accuracy: 50, applied_to_own_context: 50 },
        overall_strength: 50,
        feedback: {
          what_you_got_right: 'Analysis in progress',
          the_gap: 'Continue learning',
          tailored_insight: 'Keep going'
        },
        primary_gap: { name: 'learning', what_was_missing: '', why_it_matters: '' },
        badges_earned: []
      };
    }

    // Check for badges
    if (analysis.scores?.applied_to_own_context >= 75) {
      analysis.badges_earned = [...(analysis.badges_earned || []), 'context_applier'];
    }

    return NextResponse.json({
      success: true,
      analysis: {
        ...analysis,
        concept_id: conceptId,
        session_id: sessionId,
        analysed_at: new Date().toISOString()
      },
      next: {
        phase: analysis.overall_strength >= 85 ? 'deeper' : 'feedback'
      }
    });

  } catch (error) {
    console.error('Teach-back analysis error:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
