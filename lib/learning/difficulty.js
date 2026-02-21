// Adaptive Difficulty Logic
// Adjusts question difficulty based on learner performance

const DIFFICULTY_ORDER = ['easy', 'medium', 'hard', 'very_hard'];

export function getNextDifficulty(knowledgeNode, aiAnalysis) {
  if (!knowledgeNode || !aiAnalysis) return 'medium';
  
  const { status, strength, consecutive_correct } = knowledgeNode;
  const { overall_strength, next_difficulty } = aiAnalysis;
  
  // Trust Claude's recommendation first
  if (next_difficulty && DIFFICULTY_ORDER.includes(next_difficulty)) {
    return next_difficulty;
  }
  
  // Escalate if strong performance
  if (overall_strength >= 85 && consecutive_correct >= 2) {
    return escalate(knowledgeNode.difficulty || 'medium');
  }
  
  // De-escalate if poor performance
  if (overall_strength < 50) {
    return deescalate(knowledgeNode.difficulty || 'medium');
  }
  
  return knowledgeNode.difficulty || 'medium';
}

function escalate(current) {
  const map = {
    'easy': 'medium',
    'medium': 'hard',
    'hard': 'very_hard',
    'very_hard': 'very_hard'
  };
  return map[current] || 'medium';
}

function deescalate(current) {
  const map = {
    'very_hard': 'hard',
    'hard': 'medium',
    'medium': 'easy',
    'easy': 'easy'
  };
  return map[current] || 'medium';
}

// A concept is mastered when:
export function isMastered(knowledgeNode, analysisScores) {
  if (!knowledgeNode || !analysisScores) return false;
  
  return (
    analysisScores.concept_accuracy >= 80 &&
    analysisScores.explained_key_mechanism >= 75 &&
    (knowledgeNode.difficulty === 'hard' || knowledgeNode.difficulty === 'very_hard')
  );
}

// Get difficulty label for display
export function getDifficultyLabel(difficulty) {
  const labels = {
    'easy': 'Foundation',
    'medium': 'Applied',
    'hard': 'Advanced',
    'very_hard': 'Expert'
  };
  return labels[difficulty] || 'Applied';
}

// Get difficulty color
export function getDifficultyColor(difficulty) {
  const colors = {
    'easy': '#2ecc71',
    'medium': '#3498db',
    'hard': '#e67e22',
    'very_hard': '#e74c3c'
  };
  return colors[difficulty] || '#3498db';
}
