// API Route: Sessions - Store and manage learning sessions
import { NextResponse } from 'next/server';

// In-memory session storage (would be database in production)
const sessions = new Map();

export async function POST(request) {
  try {
    const { userId, moduleId, conceptId, phase, teachBackResponse, aiAnalysis, durationSeconds } = await request.json();
    
    if (!userId || !moduleId || !conceptId) {
      return NextResponse.json({ error: 'userId, moduleId, conceptId required' }, { status: 400 });
    }
    
    const sessionKey = `${userId}_${moduleId}`;
    let moduleSessions = sessions.get(sessionKey) || [];
    
    const session = {
      id: 'session_' + Date.now(),
      user_id: userId,
      module_id: moduleId,
      concept_id: conceptId,
      phase_reached: phase || 'understand',
      teach_back_response: teachBackResponse,
      ai_analysis: aiAnalysis,
      duration_seconds: durationSeconds,
      completed: phase === 'complete',
      completed_at: phase === 'complete' ? new Date().toISOString() : null,
      created_at: new Date().toISOString()
    };
    
    moduleSessions.push(session);
    sessions.set(sessionKey, moduleSessions);
    
    // Get progress
    const totalSessions = moduleSessions.length;
    const completedSessions = moduleSessions.filter(s => s.completed).length;
    const progressPercent = Math.round((completedSessions / totalSessions) * 100);
    
    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        session_number: totalSessions
      },
      progress: {
        total: totalSessions,
        completed: completedSessions,
        percent: progressPercent
      }
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const moduleId = searchParams.get('module');
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }
  
  const sessionKey = `${userId}_${moduleId || 'all'}`;
  const moduleSessions = sessions.get(sessionKey) || [];
  
  return NextResponse.json({
    success: true,
    sessions: moduleSessions,
    total: moduleSessions.length
  });
}
