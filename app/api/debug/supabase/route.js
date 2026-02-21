// Debug endpoint to check Supabase connection
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  const status = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    supabaseClient: supabase ? 'INITIALIZED' : 'NULL'
  };

  // Try a simple query if client is initialized
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('id, name')
        .limit(3);
      
      status.queryResult = error ? error.message : 'SUCCESS';
      status.modules = data;
    } catch (e) {
      status.queryError = e.message;
    }
  }

  return NextResponse.json(status);
}
