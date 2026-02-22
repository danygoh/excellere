import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    const [config, stages] = await Promise.all([
      db.getScoringConfig(),
      db.getReadinessStages()
    ]);
    return NextResponse.json({ success: true, config, stages });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
