import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eynlsmqdhrbcgwjrgzjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmxzbXFkaHJiY2d3anJnemp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5ODQ2NCwiZXhwIjoyMDg3Mjc0NDY0fQ.A_BjVDdYiZjd2Veb4nWMtcpmnEqubjuaYqIiKtvbQv4'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request, { params }) {
  try {
    const reportId = params.id
    
    // Get report
    const { data: report } = await supabase.from('insight_reports').select('*').eq('id', reportId).single()
    
    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 })
    }
    
    // Get user info
    const { data: user } = await supabase.from('users').select('*').eq('id', report.user_id).single()
    
    // Build response
    const result = {
      ...report,
      student_name: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
      student_email: user?.email || '',
      student_job_title: user?.job_title || '',
      student_organisation: user?.organisation || '',
    }
    
    return NextResponse.json({ success: true, report: result })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const reportId = params.id
    const { comment, status, validatorId } = await request.json()
    
    // Update report
    const { data: report, error } = await supabase.from('insight_reports').update({
      validation_status: status === 'validated' ? 'validated' : status === 'needs_revision' ? 'needs_revision' : 'validated',
      validator_comment: comment,
      validator_id: validatorId,
      validated_at: new Date().toISOString()
    }).eq('id', reportId).select().single()
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
