// Phase Progression Logic
// Part of the Learning Loop

export const PHASE_ORDER = ['understand', 'teach', 'analyse', 'feedback', 'deeper', 'complete'];

export function canAdvance(currentPhase, sessionData) {
  switch (currentPhase) {
    case 'understand':
      // Require at least 45 seconds on page + checkboxes ticked
      return sessionData.timeOnConcept >= 45 && sessionData.checkboxes >= 2;
    
    case 'teach':
      // Require minimum word count
      const words = (sessionData.teachResponse || '').trim().split(/\s+/).filter(w => w).length;
      return words >= 40;
    
    case 'analyse':
      // Auto-advance after Claude returns analysis
      return sessionData.analysisComplete === true;
    
    case 'feedback':
      // Always can advance — user chooses whether to take deeper question
      return true;
    
    case 'deeper':
      // Require minimum response
      const deeperWords = (sessionData.deeperResponse || '').trim().split(/\s+/).filter(w => w).length;
      return deeperWords >= 30;
    
    default:
      return false;
  }
}

export function getNextPhase(current) {
  const idx = PHASE_ORDER.indexOf(current);
  if (idx >= PHASE_ORDER.length - 1) return 'complete';
  return PHASE_ORDER[idx + 1];
}

export function getPhaseLabel(phase) {
  const labels = {
    'understand': 'Understand',
    'teach': 'Teach Back',
    'analyse': 'Analyse',
    'feedback': 'Feedback',
    'deeper': 'Deeper Dive',
    'complete': 'Complete'
  };
  return labels[phase] || phase;
}

export function getPhaseDescription(phase) {
  const descriptions = {
    'understand': 'Read the concept material carefully',
    'teach': 'Explain the concept in your own words',
    'analyse': 'Aria is analysing your response...',
    'feedback': 'See your personalized feedback',
    'deeper': 'Take your understanding further',
    'complete': 'Module complete!'
  };
  return descriptions[phase] || '';
}
