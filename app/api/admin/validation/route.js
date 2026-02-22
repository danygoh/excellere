import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eynlsmqdhrbcgwjrgzjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmxzbXFkaHJiY2d3anJnemp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5ODQ2NCwiZXhwIjoyMDg3Mjc0NDY0fQ.A_BjVDdYiZjd2Veb4nWMtcpmnEqubjuaYqIiKtvbQv4'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request) {
  try {
    const { data, error } = await supabase.from('validation_queue')
      .select('*')
      .order('assigned_at', { ascending: true })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Get user and validator data
    const { data: users } = await supabase.from('users').select('id, first_name, last_name, job_title, organisation')
    const { data: validators } = await supabase.from('validators').select('id, name')
    const { data: reports } = await supabase.from('insight_reports').select('id, user_id, module_id')
    
    const result = data.map(item => {
      const report = reports?.find(r => r.id === item.report_id)
      const user = users?.find(u => u.id === report?.user_id)
      const validator = validators?.find(v => v.id === item.validator_id)
      
      return {
        id: item.id,
        first_name: user?.first_name || 'Unknown',
        last_name: user?.last_name || 'User',
        job_title: user?.job_title || '',
        organisation: user?.organisation || '',
        module_id: report?.module_id || 'ai-native-business-design',
        report_type: 'Assessment Report',
        validator_name: validator?.name || null,
        status: item.status,
        days_waiting: Math.floor((Date.now() - new Date(item.assigned_at).getTime()) / (1000 * 60 * 60 * 24))
      }
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json([
      { id: '1', first_name: 'Sarah', last_name: 'Chen', job_title: 'CEO', organisation: 'TechCorp Ltd', module_id: 'ai-native-business-design', report_type: 'Assessment Report', days_waiting: 3, validator_name: 'Prof. Mark Esposito', status: 'pending' },
    ])
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase.from('validation_queue')
      .update({ validator_id: body.validatorId, status: 'in_progress' })
      .eq('id', body.reportId)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to assign report' }, { status: 500 })
  }
}
