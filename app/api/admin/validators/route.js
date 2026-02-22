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
    // Get validators
    const { data: validators } = await supabase
      .from('validators')
      .select('*')
      .order('created_at', { ascending: true })
    
    // Get validation queue
    const { data: queue } = await supabase
      .from('validation_queue')
      .select('*')
    
    // Calculate pending/completed counts per validator
    const result = validators.map(v => {
      const validatorQueue = queue?.filter(q => q.validator_id === v.id) || []
      const pending = validatorQueue.filter(q => q.status !== 'validated').length
      const completed = validatorQueue.filter(q => q.status === 'validated').length
      
      return {
        ...v,
        pending,
        completed
      }
    })
    
    return NextResponse.json({ validators: result, queue: queue || [] })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      validators: [
        { id: 'v1', name: 'Prof. Mark Esposito', title: 'Professor', institution: 'Harvard', pending: 0, completed: 0 }
      ], 
      queue: [] 
    })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { action, id, data } = body
    
    if (action === 'create') {
      const newValidator = {
        id: generateUUID(),
        name: data.name,
        title: data.title,
        institution: data.institution,
        email: data.email,
        created_at: new Date().toISOString()
      }
      
      const { data: validator, error } = await supabase
        .from('validators')
        .insert(newValidator)
        .select()
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(validator)
    }
    
    if (action === 'update' && id) {
      const { data: validator, error } = await supabase
        .from('validators')
        .update({
          name: data.name,
          title: data.title,
          institution: data.institution,
          email: data.email
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(validator)
    }
    
    if (action === 'delete' && id) {
      const { error } = await supabase
        .from('validators')
        .delete()
        .eq('id', id)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
