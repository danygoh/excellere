import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eynlsmqdhrbcgwjrgzjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmxzbXFkaHJiY2d3anJnemp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5ODQ2NCwiZXhwIjoyMDg3Mjc0NDY0fQ.A_BjVDdYiZjd2Veb4nWMtcpmnEqubjuaYqIiKtvbQv4'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const validator = searchParams.get('validator')
    
    // Get all reports
    const { data: reports } = await supabase.from('insight_reports').select('*').order('created_at', { ascending: false })
    
    // Get all users
    const { data: users } = await supabase.from('users').select('*')
    
    // Get validators
    const { data: validators } = await supabase.from('validators').select('*')
    
    // Join user data with reports
    let result = reports.map(report => {
      const user = users.find(u => u.id === report.user_id)
      const validator = validators.find(v => v.id === report.validator_id)
      
      return {
        ...report,
        student_name: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
        student_email: user?.email || '',
        student_job_title: user?.job_title || '',
        student_organisation: user?.organisation || '',
        validator_name: validator?.name || null
      }
    })
    
    // Filter by validator if specified
    if (validator && validator !== 'danny') {
      const validatorInfo = validators.find(v => v.id === validator)
      if (validatorInfo) {
        result = result.filter(r => r.validator_name === validatorInfo.name || !r.validator_name)
      }
    }
    
    return NextResponse.json({ success: true, reports: result })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
