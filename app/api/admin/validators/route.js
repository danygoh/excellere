import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eynlsmqdhrbcgwjrgzjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmxzbXFkaHJiY2d3anJnemp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5ODQ2NCwiZXhwIjoyMDg3Mjc0NDY0fQ.A_BjVDdYiZjd2Veb4nWMtcpmnEqubjuaYqIiKtvbQv4'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request) {
  try {
    const { data: validators } = await supabase.from('validators').select('*').order('created_at', { ascending: true })
    const { data: queue } = await supabase.from('validation_queue').select('*')
    
    const result = validators?.map(v => {
      const pending = queue?.filter(q => q.validator_id === v.id && q.status !== 'validated').length || 0
      const completed = queue?.filter(q => q.validator_id === v.id && q.status === 'validated').length || 0
      
      return {
        id: v.id,
        name: v.name,
        title: v.title,
        institution: v.institution,
        pending,
        completed
      }
    }) || []
    
    return NextResponse.json({ validators: result, queue: queue || [] })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      validators: [
        { id: 'mark', name: 'Prof. Mark Esposito', title: 'Professor of Business & Economics', institution: 'Harvard / Hult', pending: 3, completed: 12 },
        { id: 'terence', name: 'Prof. Terence Tse', title: 'Professor of Finance & AI Transformation', institution: 'ESCP Business School', pending: 2, completed: 8 },
      ],
      queue: []
    })
  }
}
