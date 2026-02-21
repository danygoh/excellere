// API Route: Learning - Get Learner Progress
import { NextResponse } from 'next/server';

// In-memory progress store (would be database in production)
const learnerProgress = new Map();

// Seed with demo data
learnerProgress.set('l1', {
  userId: 'l1',
  currentModule: 'ai-native-business-design',
  currentConcept: 0,
  conceptsCompleted: [],
  sessionsCompleted: 0,
  phase: 'understand',
  startedAt: new Date().toISOString(),
  lastActivityAt: new Date().toISOString()
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ 
      error: 'userId parameter required' 
    }, { status: 400 });
  }
  
  const progress = learnerProgress.get(userId);
  
  if (!progress) {
    // Return default progress for new learners
    return NextResponse.json({
      success: true,
      progress: {
        userId,
        currentModule: 'ai-native-business-design',
        currentConcept: 0,
        conceptsCompleted: [],
        sessionsCompleted: 0,
        phase: 'understand',
        startedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        status: 'not_started'
      }
    });
  }
  
  return NextResponse.json({
    success: true,
    progress: {
      ...progress,
      status: progress.conceptsCompleted.length >= 3 ? 'completed' : 'in_progress'
    }
  });
}

export async function POST(request) {
  try {
    const { userId, action, data } = await request.json();
    
    if (!userId || !action) {
      return NextResponse.json({
        error: 'userId and action required'
      }, { status: 400 });
    }
    
    let progress = learnerProgress.get(userId);
    
    // Create new progress if doesn't exist
    if (!progress) {
      progress = {
        userId,
        currentModule: 'ai-native-business-design',
        currentConcept: 0,
        conceptsCompleted: [],
        sessionsCompleted: 0,
        phase: 'understand',
        startedAt: new Date().toISOString()
      };
    }
    
    switch (action) {
      case 'complete_concept':
        if (data.conceptId && !progress.conceptsCompleted.includes(data.conceptId)) {
          progress.conceptsCompleted.push(data.conceptId);
        }
        progress.currentConcept = (progress.currentConcept + 1) % 3;
        progress.lastActivityAt = new Date().toISOString();
        break;
        
      case 'complete_session':
        progress.sessionsCompleted += 1;
        progress.lastActivityAt = new Date().toISOString();
        break;
        
      case 'update_phase':
        progress.phase = data.phase;
        progress.lastActivityAt = new Date().toISOString();
        break;
        
      case 'next_module':
        const moduleOrder = ['ai-native-business-design', 'double-loop-strategy', 'agentic-ai'];
        const currentIndex = moduleOrder.indexOf(progress.currentModule);
        if (currentIndex < moduleOrder.length - 1) {
          progress.currentModule = moduleOrder[currentIndex + 1];
          progress.currentConcept = 0;
          progress.conceptsCompleted = [];
          progress.phase = 'understand';
        }
        break;
        
      case 'reset':
        progress = {
          userId,
          currentModule: 'ai-native-business-design',
          currentConcept: 0,
          conceptsCompleted: [],
          sessionsCompleted: 0,
          phase: 'understand',
          startedAt: new Date().toISOString(),
          lastActivityAt: new Date().toISOString()
        };
        break;
    }
    
    learnerProgress.set(userId, progress);
    
    return NextResponse.json({
      success: true,
      progress
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
