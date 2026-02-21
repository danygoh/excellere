// API Route: Onboarding - Profile Inference
// Called after step 2 (identity intake) to infer cognitive profile
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function POST(request) {
  try {
    const { role, sector, goal, cvText } = await request.json();
    
    if (!role || !sector || !goal) {
      return NextResponse.json({
        error: 'Missing required fields: role, sector, goal'
      }, { status: 400 });
    }

    const systemPrompt = `You are an expert at inferring professional and cognitive profiles from sparse data. You have deep knowledge of how senior leaders in different sectors think, what they typically know and don't know about AI, and how their backgrounds shape their reasoning patterns. Your output personalises an AI learning platform. Be specific — generic profiles are useless. Draw on what you know about how people in this role and sector actually think. Return valid JSON only. No preamble, no markdown, just the JSON object.`;

    const userPrompt = `
Infer a detailed cognitive and professional profile for this learner.

Role: ${role}
Sector: ${sector}
Primary goal: ${goal}
CV / background: ${cvText || 'Not provided'}

Return this exact JSON:
{
  "archetype": "2-4 word label (e.g. Strategic Reframer, Pragmatic Implementer)",
  "archetype_description": "2-3 sentences specific to this person",
  "strengths": ["3-5 specific knowledge strengths they likely have"],
  "gaps": ["3-5 specific AI knowledge gaps they likely have"],
  "thinking_style": "1-2 sentences on how they process information",
  "predicted_challenge": "The one thing most likely to block their learning",
  "ai_prediction": "2-3 sentences predicting their AI strategy engagement",
  "profile_tags": ["6-8 specific descriptive tags"],
  "dimensions": {
    "strategic_vs_operational": ${Math.floor(Math.random() * 30) + 40},
    "conceptual_vs_technical": ${Math.floor(Math.random() * 40) + 30},
    "single_vs_double_loop": ${Math.floor(Math.random() * 40) + 30},
    "challenge_vs_confirmation": ${Math.floor(Math.random() * 40) + 30}
  },
  "initial_difficulty": "medium or hard",
  "sector_note": "1 sentence on what makes this sector's AI context specific"
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      temperature: 0.4,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    let content = response.content[0].text;
    content = content.replace(/^```json\s*/g, '').replace(/```\s*$/g, '');
    
    const profile = JSON.parse(content);
    
    // Store in memory (would be database in production)
    // For now, return the profile to frontend
    
    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        inferred_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Profile inference error:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
