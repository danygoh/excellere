import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eynlsmqdhrbcgwjrgzjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmxzbXFkaHJiY2d3anJnemp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5ODQ2NCwiZXhwIjoyMDg3Mjc0NDY0fQ.A_BjVDdYiZjd2Veb4nWMtcpmnEqubjuaYqIiKtvbQv4'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request) {
  try {
    // Fetch users with learner role
    const { data: users } = await supabase.from('users').select('*').eq('role', 'learner')
    
    // Fetch learner profiles
    const { data: profiles } = await supabase.from('learner_profiles').select('*')
    
    // Fetch validators
    const { data: validators } = await supabase.from('validators').select('*')
    
    // Fetch validation queue for validator assignments
    const { data: queue } = await supabase.from('validation_queue').select('*')
    
    // Fetch insight reports for scores
    const { data: reports } = await supabase.from('insight_reports').select('*')
    
    // Map stage based on onboarding step
    const getStage = (step) => {
      if (step >= 12) return 'AI Native'
      if (step >= 8) return 'AI Fluent'
      if (step >= 4) return 'AI Informed'
      if (step >= 1) return 'AI Curious'
      return 'AI Unaware'
    }
    
    // Calculate readiness score (mock for now)
    const getReadinessScore = (userId) => {
      const userReports = reports?.filter(r => r.user_id === userId) || []
      if (userReports.length > 0) {
        return userReports[0].overall_score || 65
      }
      return 65
    }
    
    // Get validator name for user
    const getValidatorName = (userId) => {
      const userReports = reports?.filter(r => r.user_id === userId) || []
      if (userReports.length > 0 && userReports[0].validator_id) {
        const validator = validators?.find(v => v.id === userReports[0].validator_id)
        return validator?.name || null
      }
      return null
    }
    
    const students = users?.map(user => {
      const profile = profiles?.find(p => p.user_id === user.id)
      const onboardingStep = profile?.onboarding_step || 0
      const sessionsCompleted = Math.min(onboardingStep, 12)
      
      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        job_title: user.job_title || '',
        sector: user.sector || '',
        organisation: user.organisation || '',
        sessions_completed: sessionsCompleted,
        sessions_total: 12,
        readiness_score: getReadinessScore(user.id),
        stage: getStage(onboardingStep),
        validator_name: getValidatorName(user.id),
        onboarding_complete: profile?.onboarding_complete || false,
        last_active: user.updated_at
      }
    }) || []
    
    return NextResponse.json(students)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json([
      { id: '1', first_name: 'Sarah', last_name: 'Chen', email: 'sarah.chen@techcorp.com', job_title: 'CEO', sector: 'Financial Services', organisation: 'TechCorp Ltd', sessions_completed: 8, sessions_total: 12, readiness_score: 72, stage: 'AI Fluent', validator_name: 'Prof. Mark Esposito', last_active: new Date().toISOString() },
    ])
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Create user first
    const { data: user, error: userError } = await supabase.from('users').insert({
      email: body.email,
      password_hash: 'demo',
      first_name: body.firstName,
      last_name: body.lastName,
      role: 'learner',
      job_title: body.jobTitle,
      sector: body.sector,
      organisation: body.organisation
    }).select().single()
    
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }
    
    // Create learner profile
    await supabase.from('learner_profiles').insert({
      user_id: user.id,
      onboarding_step: 0,
      onboarding_complete: false
    })
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}
