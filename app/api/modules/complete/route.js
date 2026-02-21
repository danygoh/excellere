// API Route: Module Complete - Trigger report generation
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { conceptLibrary } from '@/lib/learning/conceptLibrary';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// In-memory storage (would be database)
const reports = new Map();
const sessions = new Map();

export async function POST(request) {
  try {
    const { userId, moduleId, userProfile, artefact } = await request.json();
    
    if (!userId || !moduleId) {
      return NextResponse.json({ error: 'userId and moduleId required' }, { status: 400 });
    }
    
    // Get sessions for this module
    const sessionKey = `${userId}_${moduleId}`;
    const moduleSessions = sessions.get(sessionKey) || [];
    
    if (moduleSessions.length === 0) {
      return NextResponse.json({ error: 'No sessions found for this module' }, { status: 400 });
    }
    
    // Format session history for report prompt
    const sessionHistory = moduleSessions.map((s, i) => ({
      session_number: i + 1,
      concept: s.topic,
      teach_response: s.teach_back_response,
      scores: s.ai_analysis?.scores,
      feedback_summary: s.ai_analysis?.feedback,
      primary_gap: s.ai_analysis?.primary_gap,
      final_status: s.ai_analysis?.knowledge_node_update?.status,
      badges_earned: s.badges_earned || []
    }));
    
    // Get module info
    const moduleConcepts = conceptLibrary.filter(c => c.module_id === moduleId);
    const moduleName = moduleConcepts[0]?.name || moduleId;
    
    // Generate report with Claude
    const systemPrompt = `You are Aria, Excellere's AI learning coach. You generate personalized insight reports for learners completing the AI leadership programme. Your reports are specific, insightful, and feel like they were written by someone who truly understands the learner.`;

    const userPrompt = `
Generate an Insight Report for this learner.

LEARNER PROFILE:
${JSON.stringify(userProfile, null, 2)}

MODULE: ${moduleName}
TOTAL SESSIONS: ${moduleSessions.length}

SESSION HISTORY:
${JSON.stringify(sessionHistory, null, 2)}

${artefact ? `ARTEFACT SUBMITTED: ${JSON.stringify(artefact, null, 2)}` : 'No artefact submitted.'}

Generate the report in this JSON format:

{
  "executive_summary": {
    "headline": "2-3 sentence summary that feels personal",
    "overall_assessment": "2 sentences on what they demonstrated",
    "key_strength": "The main thing they do well",
    "growth_edge": "The main area to develop"
  },
  "thinking_archetype": {
    "label": "2-4 word archetype label",
    "description": "3-4 sentences explaining what this means for them specifically"
  },
  "mastery": {
    "total_score": <0-100>,
    "concept_accuracy": <0-100>,
    "context_application": <0-100>,
    "strategic_depth": <0-100>
  },
  "what_aria_noticed": [
    {
      "observation": "Specific thing you noticed",
      "evidence": "What they said/did that showed this",
      "significance": "Why it matters"
    }
  ],
  "strengths": [
    { "area": "Specific strength", "evidence": "From their work" }
  ],
  "gaps": [
    { "area": "Specific gap", "why_matters": "For their role" }
  ],
  "recommendations": [
    { "title": "Specific recommendation", "reason": "Why this matters for them" }
  ],
  "badges_earned": ["list of badge types earned"],
  "next_module": "recommendation for next module"
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      temperature: 0.5,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    let content = response.content[0].text;
    content = content.replace(/^```json\s*/g, '').replace(/```\s*$/g, '');
    
    let reportContent;
    try {
      reportContent = JSON.parse(content);
    } catch (parseError) {
      reportContent = {
        executive_summary: {
          headline: 'Assessment complete',
          overall_assessment: 'Report generation in progress',
          key_strength: 'Continued learning',
          growth_edge: 'Keep practicing'
        },
        thinking_archetype: {
          label: 'Developing Thinker',
          description: 'Building strategic AI thinking capabilities.'
        }
      };
    }
    
    // Create report record
    const reportId = 'report_' + Date.now();
    const shareSlug = `${userId}_${moduleId}_${Date.now()}`.replace(/_/g, '-').substring(0, 20);
    
    const report = {
      id: reportId,
      user_id: userId,
      module_id: moduleId,
      module_name: moduleName,
      report_content: reportContent,
      ai_generated_at: new Date().toISOString(),
      overall_score: reportContent.mastery?.total_score || 50,
      mastery_percentage: reportContent.mastery?.total_score || 50,
      badges: reportContent.badges_earned || [],
      validation_status: 'pending',
      share_slug: shareSlug,
      is_public: false,
      view_count: 0
    };
    
    reports.set(reportId, report);
    
    return NextResponse.json({
      success: true,
      report,
      shareUrl: `/c/${shareSlug}`
    });
    
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Store session (called after each session)
export async function PUT(request) {
  try {
    const { userId, moduleId, sessionData } = await request.json();
    
    if (!userId || !moduleId || !sessionData) {
      return NextResponse.json({ error: 'userId, moduleId, sessionData required' }, { status: 400 });
    }
    
    const sessionKey = `${userId}_${moduleId}`;
    let moduleSessions = sessions.get(sessionKey) || [];
    
    const session = {
      ...sessionData,
      created_at: new Date().toISOString()
    };
    
    moduleSessions.push(session);
    sessions.set(sessionKey, moduleSessions);
    
    return NextResponse.json({
      success: true,
      sessionNumber: moduleSessions.length,
      totalSessions: moduleSessions.length
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get report
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get('id');
  const slug = searchParams.get('slug');
  
  let report = null;
  
  if (reportId) {
    report = reports.get(reportId);
  } else if (slug) {
    report = Array.from(reports.values()).find(r => r.share_slug === slug);
  }
  
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
  
  return NextResponse.json({
    success: true,
    report
  });
}
