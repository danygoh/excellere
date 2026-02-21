// Simple test endpoint to verify Supabase write
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(request) {
  const { email, firstName } = await request.json();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not initialized' }, { status: 500 });
  }
  
  // Try to insert
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: email || 'test@test.com',
      first_name: firstName || 'Test',
      last_name: 'User',
      role: 'learner',
      password_hash: 'test123'
    })
    .select();
  
  return NextResponse.json({ 
    success: !error, 
    data, 
    error: error?.message,
    supabaseUrl: !!supabase
  });
}

export async function GET() {
  // Try to fetch
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  return NextResponse.json({ 
    count: data?.length || 0, 
    error: error?.message,
    data: data?.slice(0, 3)
  });
}
