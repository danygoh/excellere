// API Route: Knowledge Graph - Update learner knowledge after each session
import { NextResponse } from 'next/server';

// In-memory knowledge nodes (would be database in production)
const knowledgeNodes = new Map();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const moduleId = searchParams.get('module');
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }
  
  const key = `${userId}_${moduleId || 'all'}`;
  const nodes = knowledgeNodes.get(key) || [];
  
  return NextResponse.json({
    success: true,
    nodes
  });
}

export async function POST(request) {
  try {
    const { userId, moduleId, conceptId, status, strength, gapFlags, difficulty } = await request.json();
    
    if (!userId || !conceptId) {
      return NextResponse.json({ error: 'userId and conceptId required' }, { status: 400 });
    }
    
    const key = `${userId}_${moduleId || 'all'}`;
    let nodes = knowledgeNodes.get(key) || [];
    
    // Find existing node
    const existingIndex = nodes.findIndex(n => n.concept_id === conceptId);
    
    const now = new Date().toISOString();
    const node = {
      user_id: userId,
      module_id: moduleId,
      concept_id: conceptId,
      status: status || 'taught',
      strength: strength || 50,
      gap_flags: gapFlags || [],
      difficulty: difficulty || 'medium',
      consecutive_correct: 0,
      first_seen_at: existingIndex >= 0 ? nodes[existingIndex].first_seen_at : now,
      last_tested_at: now,
      mastered_at: status === 'mastered' ? now : (existingIndex >= 0 ? nodes[existingIndex].mastered_at : null),
      updated_at: now
    };
    
    if (existingIndex >= 0) {
      nodes[existingIndex] = node;
    } else {
      node.first_seen_at = now;
      nodes.push(node);
    }
    
    knowledgeNodes.set(key, nodes);
    
    // Calculate mastery percentage
    const mastered = nodes.filter(n => n.status === 'mastered').length;
    const total = nodes.length;
    const masteryPercentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
    
    return NextResponse.json({
      success: true,
      node,
      masteryPercentage,
      totalConcepts: total,
      masteredConcepts: mastered
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get or create knowledge node
export async function PUT(request) {
  try {
    const { userId, moduleId, conceptId } = await request.json();
    
    if (!userId || !conceptId) {
      return NextResponse.json({ error: 'userId and conceptId required' }, { status: 400 });
    }
    
    const key = `${userId}_${moduleId || 'all'}`;
    let nodes = knowledgeNodes.get(key) || [];
    
    let node = nodes.find(n => n.concept_id === conceptId);
    
    if (!node) {
      const now = new Date().toISOString();
      node = {
        user_id: userId,
        module_id: moduleId,
        concept_id: conceptId,
        status: 'introduced',
        strength: 0,
        gap_flags: [],
        difficulty: 'medium',
        consecutive_correct: 0,
        first_seen_at: now,
        last_tested_at: null,
        mastered_at: null,
        created_at: now,
        updated_at: now
      };
      nodes.push(node);
      knowledgeNodes.set(key, nodes);
    }
    
    return NextResponse.json({
      success: true,
      node
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
