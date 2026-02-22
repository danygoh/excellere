import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    const modules = await db.getModules();
    return NextResponse.json({ success: true, modules });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
