// API Route: Sessions - Store and manage learning sessions
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(request) {
  try {
    const { userId, moduleId, conceptId, phase, teachBackResponse, aiAnalysis, durationSeconds } = await request.json();
    
    if (!userId || !moduleId || !conceptId) {
      return NextResponse.json({ error: 'userId, moduleId, conceptId required' }, { status: 400 });
    }
    
    // Get existing session count
    let sessionNumber = 1;
    if (supabase) {
      const { data: existing } = await supabase
        .from('sessions')
        .select('id')
        .eq('user_id', userId)
        .eq('module_id', moduleId);
      
      sessionNumber = (existing?.length || 0) + 1;
    }
    
    const session = {
      user_id: userId,
      module_id: moduleId,
      concept_id: conceptId,
      session_number: sessionNumber,
      session_type: 'ai_practice',
      topic: conceptId,
      teach_back_response: teachBackResponse,
      ai_analysis: aiAnalysis,
      phase_reached: phase || 'understand',
      duration_seconds: durationSeconds,
      completed: phase === 'complete',
      completed_at: phase === 'complete' ? new Date().toISOString() : null
    };
    
    // Store to Supabase if available
    if (supabase) {
      const { data, error } = await supabase
        .from('sessions')
        .insert(session)
        .select()
        .single();
      
      if (!error && data) {
        session.id = data.id;
      }
    } else {
      session.id = 'session_' + Date.now();
    }
    
    // Get progress
    let totalSessions = sessionNumber;
    let completedSessions = phase === 'complete' ? 1 : 0;
    
    if (supabase) {
      const { data: all } = await supabase
        .from('sessions')
        .select('completed')
        .eq('user_id', userId)
        .eq('module_id', moduleId);
      
      if (all) {
        totalSessions = all.length;
        completedSessions = all.filter(s => s.completed).length;
      }
    }
    
    const progressPercent = Math.round((completedSessions / totalSessions) * 100);
    
    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        session_number: sessionNumber
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
  
  if (supabase) {
    let query = supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId);
    
    if (moduleId) {
      query = query.eq('module_id', moduleId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: true });
    
    if (!error) {
      return NextResponse.json({
        success: true,
        sessions: data || [],
        total: data?.length || 0
      });
    }
  }
  
  return NextResponse.json({
    success: true,
    sessions: [],
    total: 0
  });
}
