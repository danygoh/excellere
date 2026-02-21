// API Route: Learning - Get Concepts
import { NextResponse } from 'next/server';
import { concepts } from '@/lib/learning/concepts';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const moduleId = searchParams.get('module');
  
  if (!moduleId) {
    return NextResponse.json({ 
      error: 'module parameter required' 
    }, { status: 400 });
  }
  
  const module = concepts[moduleId];
  
  if (!module) {
    return NextResponse.json({ 
      error: 'Module not found' 
    }, { status: 404 });
  }
  
  // Return concepts without full content (for listing)
  const conceptList = module.concepts.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description,
    keyQuestions: c.keyQuestions
  }));
  
  return NextResponse.json({
    success: true,
    module: {
      id: module.id,
      name: module.name,
      concepts: conceptList
    }
  });
}
