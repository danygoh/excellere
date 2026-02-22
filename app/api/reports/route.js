import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const validator = searchParams.get('validator');
    
    const reports = await db.getInsightReports();
    
    if (!reports) {
      return NextResponse.json({ success: true, reports: [] });
    }

    // If validator specified, filter
    let filtered = reports;
    if (validator && validator !== 'danny') {
      // Non-Danny validators see only their assigned or unassigned reports
      filtered = reports.filter(r => r.validator_id === validator || !r.validator_id);
    }
    
    return NextResponse.json({ success: true, reports: filtered });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
