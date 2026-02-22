import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    const questions = await db.getAssessmentQuestions();
    // Remove signal strength from options
    const sanitized = questions.map(q => ({
      ...q,
      options: q.options.map(o => ({ id: o.id, text: o.text }))
    }));
    return NextResponse.json({ success: true, questions: sanitized });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
