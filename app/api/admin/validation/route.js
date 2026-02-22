import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eynlsmqdhrbcgwjrgzjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmxzbXFkaHJiY2d3anJnemp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5ODQ2NCwiZXhwIjoyMDg3Mjc0NDY0fQ.A_BjVDdYiZjd2Veb4nWMtcpmnEqubjuaYqIiKtvbQv4'

const supabase = createClient(supabaseUrl, supabaseKey)

function getUserFromSession(request) {
  const sessionCookie = request.cookies.get('session')
  if (!sessionCookie) return null
  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

export async function GET(request) {
  try {
    const user = getUserFromSession(request)
    
    // Get validation queue
    const { data: queue } = await supabase.from('validation_queue').select('*')
    
    // Get all related data
    const { data: users } = await supabase.from('users').select('id, first_name, last_name, job_title, organisation')
    const { data: validators } = await supabase.from('validators').select('id, name')
    const { data: reports } = await supabase.from('insight_reports').select('id, user_id, module_id')
    
    // Map queue to result
    let result = queue.map(item => {
      const report = reports.find(r => r.id === item.report_id)
      const reportUser = users.find(u => u.id === report?.user_id)
      const validator = validators.find(v => v.id === item.validator_id)
      
      return {
        id: item.id,
        user_id: reportUser?.id,
        first_name: reportUser?.first_name || 'Unknown',
        last_name: reportUser?.last_name || 'User',
        job_title: reportUser?.job_title || '',
        organisation: reportUser?.organisation || '',
        module_id: report?.module_id || 'ai-native-business-design',
        report_type: 'Assessment Report',
        validator_id: item.validator_id,
        validator_name: validator?.name || null,
        status: item.status,
        days_waiting: Math.floor((Date.now() - new Date(item.assigned_at).getTime()) / (1000 * 60 * 60 * 24))
      }
    })
    
    // If validator logged in, filter to only their students
    if (user?.role === 'validator' && user?.validator_id) {
      result = result.filter(item => item.validator_id === user.validator_id)
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const user = getUserFromSession(request)
    const body = await request.json()
    const { reportId, validatorId } = body
    
    if (user?.role === 'validator' && validatorId !== user.validator_id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    
    const { data, error } = await supabase.from('validation_queue')
      .update({ validator_id: validatorId, status: 'in_progress' })
      .eq('id', reportId)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to assign' }, { status: 500 })
  }
}
