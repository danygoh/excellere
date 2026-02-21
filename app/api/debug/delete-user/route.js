// Debug endpoint to delete test users
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not initialized' }, { status: 500 });
  }
  
  if (!email) {
    return NextResponse.json({ error: 'email parameter required' }, { status: 400 });
  }
  
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('email', email)
    .select();
  
  return NextResponse.json({ 
    success: !error, 
    deleted: data,
    error: error?.message 
  });
}
