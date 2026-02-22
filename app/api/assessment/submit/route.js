import { NextResponse } from 'next/server';
import db from '@/lib/database';
import aria from '@/lib/aria';
import slugify from 'slugify';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, learner, answers } = body;
    
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ success: false, error: 'Answers required' }, { status: 400 });
    }
    
    // Get questions and config
    const [questions, config] = await Promise.all([
      db.getAssessmentQuestions(),
      db.getScoringConfig()
    ]);
    
    // Calculate scores
    const { dimensionScores, overallScore, stage } = db.calculateScores(answers, questions, config);
    
    // Generate report using Aria
    let report = null;
    try {
      report = await aria.generateAssessmentReport(userId, {
        learner: learner || { first_name: 'Learner', last_name: '', job_title: '', sector: '' },
        dimensionScores,
        overallScore,
        stage: stage?.label || 'Unknown',
        calibrationAnswers: answers
      });
    } catch (ariaError) {
      console.error('Aria report generation failed:', ariaError);
    }
    
    // Create insight report
    const shareSlug = slugify(`${learner?.first_name || 'learner'}-${learner?.last_name || ''}-${Date.now()}`, { lower: true });
    
    const insightReport = await db.createInsightReport({
      user_id: userId,
      share_slug: shareSlug,
      first_name: learner?.first_name,
      last_name: learner?.last_name,
      role: learner?.job_title,
      sector: learner?.sector,
      organisation: learner?.organisation,
      content: {
        type: 'assessment',
        dimension_scores: dimensionScores,
        overall_score: overallScore,
        stage: stage,
        report: report,
        answers: answers
      }
    });
    
    return NextResponse.json({
      success: true,
      result: {
        scores: dimensionScores,
        overall_score: overallScore,
        stage: stage,
        report_id: insightReport.id,
        share_slug: shareSlug
      }
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
