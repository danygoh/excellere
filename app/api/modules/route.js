// API Route: Get modules in correct learning order
import { NextResponse } from 'next/server';

export async function GET() {
  // Correct order: AI-Native → Double Loop → Agentic
  // Double Loop is the conceptual bridge between understanding AI-native design (Module 1) 
  // and knowing where to deploy autonomous agents (Module 3)
  const modules = [
    {
      id: 'ai-native-business-design',
      name: 'AI-Native Business Design',
      description: 'Audit which processes are AI-native vs augmented',
      outcome: 'AI-Native Firm Audit',
      order: 1,
      icon: '🎯'
    },
    {
      id: 'double-loop-strategy',
      name: 'Double Loop Strategy',
      description: 'Master the strategy framework for AI transformation',
      outcome: 'Double Loop Strategy Canvas',
      order: 2,
      icon: '🔄'
    },
    {
      id: 'agentic-ai',
      name: 'Agentic AI',
      description: 'Identify opportunities for agentic AI in your workflows',
      outcome: 'Agent Opportunity Map',
      order: 3,
      icon: '🤖'
    }
  ];

  return NextResponse.json({
    success: true,
    modules
  });
}
