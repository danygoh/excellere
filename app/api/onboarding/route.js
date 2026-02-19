import { NextResponse } from 'next/server'
import { inferProfile } from '../../../lib/ai'

// In-memory user storage
const users = new Map()

export async function POST(request) {
  try {
    const data = await request.json()
    const { step, formData, profile } = data
    
    const userId = 'demo-user' // In production, get from session
    
    if (step === 'submit') {
      // Run AI profile inference
      const aiProfile = await inferProfile({
        role: formData.role,
        sector: formData.sector,
        goal: formData.goal,
        cvText: formData.cvText,
        linkedinUrl: formData.linkedinUrl
      })
      
      const userProfile = {
        id: userId,
        name: formData.name,
        role: formData.role,
        sector: formData.sector,
        seniority: formData.seniority,
        goal: formData.goal,
        cognitiveFingerprint: {
          archetype: aiProfile.archetype_label || 'Strategic Reframer',
          dimensions: {
            strategic_vs_operational: 85,
            conceptual_vs_technical: 70,
            single_vs_double_loop: 90,
            challenge_vs_confirmation: 75
          }
        },
        createdAt: new Date().toISOString()
      }
      
      users.set(userId, userProfile)
      
      return NextResponse.json({ success: true, profile: userProfile, redirect: '/dashboard' })
    }
    
    if (step === 'mirror') {
      // Apply corrections to profile
      const user = users.get(userId)
      if (user) {
        user.corrections = formData.corrections
        users.set(userId, user)
      }
      return NextResponse.json({ success: true })
    }
    
    if (step === 'calibration') {
      // Save calibration answers
      const user = users.get(userId)
      if (user) {
        user.calibrationAnswers = formData.answers
        users.set(userId, user)
      }
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Unknown step' }, { status: 400 })
    
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
