import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request, { params }) {
  try {
    const { conceptId } = await params;
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    
    const concept = await db.getConcept(conceptId, sector);
    if (!concept) {
      return NextResponse.json({ success: false, error: 'Concept not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, concept });
  } catch (error) {
    console.error('Error fetching concept:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
