import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eynlsmqdhrbcgwjrgzjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmxzbXFkaHJiY2d3anJnemp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5ODQ2NCwiZXhwIjoyMDg3Mjc0NDY0fQ.A_BjVDdYiZjd2Veb4nWMtcpmnEqubjuaYqIiKtvbQv4'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request) {
  try {
    // Get all insight reports
    const { data: reports } = await supabase
      .from('insight_reports')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Get users
    const { data: users } = await supabase
      .from('users')
      .select('id, first_name, last_name')
    
    // Get validators
    const { data: validators } = await supabase
      .from('validators')
      .select('id, name')
    
    // Join data
    const result = reports.map(report => {
      const user = users.find(u => u.id === report.user_id)
      const validator = validators.find(v => v.id === report.validator_id)
      
      return {
        ...report,
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        validator_name: validator?.name || null
      }
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}
