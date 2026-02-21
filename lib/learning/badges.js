// Badge Evaluation Service
// Evaluates and awards badges based on session performance

export const BADGE_CRITERIA = {
  strategic_reframer: {
    name: 'Strategic Reframer',
    icon: '🎯',
    description: 'Questions the premise before answering within it',
    check: (sessions, calibration) => {
      // Check calibration answers for reframe signals
      if (calibration?.q1 === 'A' || calibration?.q3 === 'B') {
        return true;
      }
      // Or check session responses
      const reframeCount = sessions.filter(s => 
        s.ai_analysis?.primary_gap?.name?.includes('frame') ||
        s.ai_analysis?.knowledge_node_update?.gap_flags?.includes('reframing')
      ).length;
      return reframeCount >= 2;
    }
  },
  
  double_loop_thinker: {
    name: 'Double Loop Thinker',
    icon: '🔄',
    description: 'Demonstrated second-order reasoning unprompted',
    check: (sessions) => {
      const doubleLoopSessions = sessions.filter(s => 
        s.ai_analysis?.scores?.concept_accuracy >= 70 &&
        (s.ai_analysis?.feedback?.what_you_got_right?.toLowerCase().includes('second') ||
         s.ai_analysis?.feedback?.what_you_got_right?.toLowerCase().includes('questioning the frame'))
      ).length;
      return doubleLoopSessions >= 2;
    }
  },
  
  context_applier: {
    name: 'Context Applier',
    icon: '🏢',
    description: 'Consistently applies concepts to own context',
    check: (sessions) => {
      const contextSessions = sessions.filter(s => 
        s.ai_analysis?.scores?.applied_to_own_context >= 75
      ).length;
      return contextSessions >= 3;
    }
  },
  
  gap_closer: {
    name: 'Gap Closer',
    icon: '📈',
    description: 'Identified a gap and closed it within the same module',
    check: (sessions, calibration, knowledgeNodes) => {
      // Find any concept that was in 'gap' status and is now 'mastered'
      const gapClosed = knowledgeNodes?.find(kn => 
        kn.status === 'mastered' && 
        kn.gap_flags?.length > 0 &&
        kn.mastered_at
      );
      return !!gapClosed;
    }
  },
  
  precision_thinker: {
    name: 'Precision Thinker',
    icon: '🎯',
    description: 'Named the specific mechanism, not just the concept',
    check: (sessions) => {
      const precisionSessions = sessions.filter(s => 
        s.ai_analysis?.scores?.concept_accuracy >= 85
      ).length;
      return precisionSessions >= 2;
    }
  },
  
  ai_native_architect: {
    name: 'AI-Native Architect',
    icon: '🏛️',
    description: 'Artefact assessed as board-ready by expert',
    check: (sessions, calibration, knowledgeNodes, artefact) => {
      return artefact?.board_readiness >= 80 && artefact?.status === 'validated';
    }
  }
};

export async function evaluateBadges(userId, moduleId, latestAnalysis, sessionHistory, knowledgeNodes, artefact) {
  const earned = [];
  
  // Get calibration answers from user profile
  const calibration = latestAnalysis?.calibration;
  
  for (const [badgeType, criteria] of Object.entries(BADGE_CRITERIA)) {
    try {
      const isEarned = criteria.check(sessionHistory, calibration, knowledgeNodes, artefact);
      if (isEarned) {
        earned.push({
          type: badgeType,
          name: criteria.name,
          icon: criteria.icon,
          description: criteria.description
        });
      }
    } catch (e) {
      console.error(`Error checking badge ${badgeType}:`, e);
    }
  }
  
  return earned;
}

export function getBadgeDisplayInfo(badgeType) {
  return BADGE_CRITERIA[badgeType] || {
    name: badgeType,
    icon: '🏅',
    description: 'Achievement'
  };
}
