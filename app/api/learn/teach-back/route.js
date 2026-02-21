// API Route: Learning - Submit Teach-Back Response
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { concepts } from '@/lib/learning/concepts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function POST(request) {
  try {
    const { 
      userId, 
      moduleId, 
      conceptId, 
      teachBackResponse,
      sessionType = 'ai_practice'
    } = await request.json();
    
    if (!userId || !moduleId || !conceptId || !teachBackResponse) {
      return NextResponse.json({
        error: 'Missing required fields: userId, moduleId, conceptId, teachBackResponse'
      }, { status: 400 });
    }
    
    const module = concepts[moduleId];
    const concept = module?.concepts.find(c => c.id === conceptId);
    
    if (!concept) {
      return NextResponse.json({ error: 'Concept not found' }, { status: 404 });
    }
    
    // System prompt for analysis
    const systemPrompt = `You are Aria, Excellere's AI learning coach. You are analysing a learner's teach-back response to assess their understanding of a concept.

Your role:
- Be honest but constructive - don't soften feedback into meaninglessness
- Be specific - reference their actual words
- Be contextual - relate to their role/sector if known
- Be actionable - tell them how to improve

Return valid JSON with your analysis.`;

    const userPrompt = `
CONCEPT: ${concept.name}
DESCRIPTION: ${concept.description}

CONCEPT CONTENT:
${concept.content}

LEARNER'S TEACH-BACK RESPONSE:
${teachBackResponse}

Analyse this response and return JSON:
{
  "understanding_level": "excellent|good|developing|limited",
  "key_insight": "What was their main understanding?",
  "misconception": "If any, what did they miss? (null if none)",
  "specific_praise": "Something specific they got right",
  "growth_edge": "Something to work on",
  "question_to_probe": "A question that would deepen their understanding",
  "applied_to_context": "Did they apply to their own work? (true/false)",
  "concept_accuracy": 0-100,
  "applied_to_own_context_score": 0-100,
  "double_loop_detected": true/false,
  "recommended_next": "What should they do next?"
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
    
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      // If parsing fails, create a basic analysis
      analysis = {
        understanding_level: 'developing',
        key_insight: 'Analysis unavailable',
        concept_accuracy: 50,
        recommended_next: 'Review the concept again'
      };
    }

    // Determine phase progression
    let nextPhase = 'teach';
    let nextAction = 'Dive deeper into the concept';
    
    if (analysis.concept_accuracy >= 85 && analysis.applied_to_context) {
      nextPhase = 'feedback';
      nextAction = 'Ready for feedback quiz';
    } else if (analysis.concept_accuracy >= 70) {
      nextPhase = 'teach';
      nextAction = 'Practice applying to your context';
    } else {
      nextPhase = 'understand';
      nextAction = 'Review the concept material';
    }

    return NextResponse.json({
      success: true,
      analysis: {
        ...analysis,
        concept_id: conceptId,
        module_id: moduleId,
        session_type: sessionType,
        submitted_at: new Date().toISOString()
      },
      next: {
        phase: nextPhase,
        action: nextAction,
        recommendation: analysis.recommended_next
      }
    });

  } catch (error) {
    console.error('Teach-back analysis error:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
