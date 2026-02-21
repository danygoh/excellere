// API Route: Get modules in correct learning order
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// Correct order: AI-Native → Double Loop → Agentic
const defaultModules = [
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

export async function GET() {
  // Try to fetch from Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (!error && data && data.length > 0) {
        return NextResponse.json({
          success: true,
          modules: data.map(m => ({
            id: m.id,
            name: m.name,
            description: m.description,
            outcome: m.outcome,
            order: m.order_index
          }))
        });
      }
    } catch (e) {
      console.log('Using default modules');
    }
  }
  
  // Fallback to default
  return NextResponse.json({
    success: true,
    modules: defaultModules
  });
}
