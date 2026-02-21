// API Route: Generate Insight Report
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Simple test endpoint
  return NextResponse.json({
    status: 'ok',
    message: 'Credentials reports API is ready',
    envKey: process.env.ANTHROPIC_API_KEY ? 'present' : 'missing'
  });
}

export async function POST(request) {
  try {
    // Dynamic import to avoid build issues
    const { default: slugify } = await import('slugify');
    const { v4: uuidv4 } = await import('uuid');
    
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    
    const { default: db } = await import('../../../../lib/credentials/db');
    const { default: testProfiles } = await import('../../../../lib/credentials/testProfiles');
    
    const { profile_id } = await request.json();
    
    const profile = testProfiles.find(p => p.id === profile_id);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }
    
    const SYSTEM_PROMPT = `You are Aria, Excellere's AI learning coach. Write a formal assessment report. Be specific - reference their actual words. Return valid JSON only.`;

    const userPrompt = `Generate JSON for ${profile.first_name} ${profile.last_name}, ${profile.role}, ${profile.sector}.

Archetype: ${profile.archetype}

Sessions: ${JSON.stringify(profile.session_history)}

Return: { "report_title": "...", "executive_summary": {"headline":"...","body":"..."}, "aria_noticed": {"observation":"3-4 sentences specific to this person","prediction":"1-2 sentences"}, "overall_score": 0-100 }`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.5,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    });

    let content = response.content[0].text;
    content = content.replace(/^```json\s*/g, '').replace(/```\s*$/g, '');
    const report = JSON.parse(content);

    const shareSlug = slugify(`${profile.first_name}-${profile.last_name}`, { lower: true }) + '-' + Math.random().toString(36).substring(2, 7);

    return NextResponse.json({
      success: true,
      share_slug: shareSlug,
      report: {
        report_title: report.report_title,
        executive_summary: report.executive_summary,
        aria_noticed: report.aria_noticed,
        overall_score: report.overall_score
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
