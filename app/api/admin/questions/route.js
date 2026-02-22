import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eynlsmqdhrbcgwjrgzjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmxzbXFkaHJiY2d3anJnemp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5ODQ2NCwiZXhwIjoyMDg3Mjc0NDY0fQ.A_BjVDdYiZjd2Veb4nWMtcpmnEqubjuaYqIiKtvbQv4'

const supabase = createClient(supabaseUrl, supabaseKey)

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('is_active', true)
      .order('order_index')
    
    if (error) {
      console.error('Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    const questions = data.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }))
    
    return NextResponse.json(questions)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { action, id, data } = body
    
    if (action === 'create') {
      const newQuestion = {
        id: generateUUID(),
        ...data,
        is_active: true,
        created_at: new Date().toISOString()
      }
      
      const { data: question, error } = await supabase
        .from('assessment_questions')
        .insert(newQuestion)
        .select()
        .single()
      
      if (error) {
        console.error('Create error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(question)
    } 
    else if (action === 'update') {
      const { data: question, error } = await supabase
        .from('assessment_questions')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Update error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(question)
    }
    else if (action === 'delete') {
      const { data: question, error } = await supabase
        .from('assessment_questions')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Delete error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(question)
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 })
  }
}
