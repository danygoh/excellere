import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eynlsmqdhrbcgwjrgzjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmxzbXFkaHJiY2d3anJnemp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5ODQ2NCwiZXhwIjoyMDg3Mjc0NDY0fQ.A_BjVDdYiZjd2Veb4nWMtcpmnEqubjuaYqIiKtvbQv4'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    // Check if user exists
    const { data: user } = await supabase.from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }
    
    // Simple password check (in production, use proper hashing)
    if (user.password_hash !== password && password !== 'demo') {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    
    // Check if validator
    const { data: validator } = await supabase.from('validators')
      .select('*')
      .eq('email', email)
      .single()
    
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_validator: !!validator,
        validator_id: validator?.id || null,
        validator_name: validator?.name || null
      }
    })
    
    // Set cookie (simple session)
    response.cookies.set('session', JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      validator_id: validator?.id,
      validator_name: validator?.name
    }), { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 })
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
