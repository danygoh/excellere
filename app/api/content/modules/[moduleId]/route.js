import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request, { params }) {
  try {
    const { moduleId } = await params;
    const module = await db.getModule(moduleId);
    if (!module) {
      return NextResponse.json({ success: false, error: 'Module not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, module });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
