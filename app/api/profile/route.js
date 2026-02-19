import { NextResponse } from 'next/server'

// In-memory storage (would be database in production)
const profiles = new Map()

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }
  
  const profile = profiles.get(userId)
  if (!profile) {
    return NextResponse.json({ 
      archetype: 'Strategic Reframer',
      dimensions: {
        strategic_vs_operational: 85,
        conceptual_vs_technical: 70,
        single_vs_double_loop: 90,
        challenge_vs_confirmation: 75
      },
      strengths: ['Deep industry knowledge', 'Board-level communication'],
      gaps: ['Technical AI foundations'],
      tags: ['Finance', 'Strategy', 'Transformation']
    })
  }
  
  return NextResponse.json(profile)
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { userId, profile } = data
    
    if (!userId || !profile) {
      return NextResponse.json({ error: 'userId and profile required' }, { status: 400 })
    }
    
    profiles.set(userId, profile)
    
    return NextResponse.json({ success: true, profile })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
