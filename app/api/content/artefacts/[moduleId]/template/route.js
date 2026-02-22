import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request, { params }) {
  try {
    const { moduleId } = await params;
    const template = await db.getArtefactTemplate(moduleId);
    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
