// API Route: Onboarding - Profile Inference
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import supabase from '@/lib/supabase';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function POST(request) {
  try {
    const { role, sector, goal, cvText, firstName, lastName, email } = await request.json();
    
    if (!role || !sector || !goal) {
      return NextResponse.json({ error: 'Missing required fields: role, sector, goal' }, { status: 400 });
    }

    const systemPrompt = `You are an expert at inferring professional and cognitive profiles from sparse data. Return valid JSON only.`;

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
    
    // If Supabase is available, create user and profile
    if (supabase && email) {
      try {
        // Create or update user
        const { data: user, error: userError } = await supabase
          .from('users')
          .upsert({
            email,
            first_name: firstName,
            last_name: lastName,
            role: 'learner',
            sector,
            job_title: role,
            password_hash: 'demo'
          }, { onConflict: 'email' })
          .select()
          .single();
        
        if (!userError && user) {
          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from('learner_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if (!existingProfile) {
            // Create learner profile
            await supabase
              .from('learner_profiles')
              .insert({
                user_id: user.id,
                archetype: profile.archetype,
                archetype_description: profile.archetype_description,
                ai_prediction: profile.ai_prediction,
                profile_tags: profile.profile_tags,
                strategic_vs_operational: profile.dimensions?.strategic_vs_operational,
                conceptual_vs_technical: profile.dimensions?.conceptual_vs_technical,
                single_vs_double_loop: profile.dimensions?.single_vs_double_loop,
                challenge_vs_confirmation: profile.dimensions?.challenge_vs_confirmation,
                onboarding_step: 4,
                primary_goal: goal,
                cv_text: cvText
              });
          }
          
          profile.userId = user.id;
        }
      } catch (e) {
        console.log('Supabase insert error:', e);
      }
    }
    
    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        inferred_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Profile inference error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
