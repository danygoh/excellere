import { NextResponse } from 'next/server'

// In-memory storage
const sessions = []

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }
  
  const userSessions = sessions.filter(s => s.userId === userId)
  return NextResponse.json(userSessions)
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { userId, moduleId, phase, teachResponse, analysis } = data
    
    if (!userId || !moduleId) {
      return NextResponse.json({ error: 'userId and moduleId required' }, { status: 400 })
    }
    
    const session = {
      id: Date.now().toString(),
      userId,
      moduleId,
      phase: phase || 'understand',
      teachResponse,
      analysis,
      completedAt: new Date().toISOString()
    }
    
    sessions.push(session)
    
    return NextResponse.json({ success: true, session })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
