// Mock data for Excellere
// In production, this would be PostgreSQL + Redis

export const users = new Map([
  ['demo-user', {
    id: 'demo-user',
    email: 'demo@excellere.ai',
    name: 'Sarah Chen',
    role: 'Head of Strategy',
    sector: 'FinTech',
    seniority: 'Executive',
    goal: 'Lead AI transformation',
    cognitiveFingerprint: {
      archetype: 'Strategic Reframer',
      dimensions: {
        strategic_vs_operational: 85,
        conceptual_vs_technical: 70,
        single_vs_double_loop: 90,
        challenge_vs_confirmation: 75
      }
    },
    createdAt: '2026-02-01T00:00:00Z'
  }]
])

export const modules = [
  {
    id: 1,
    name: 'AI-Native Business Design',
    description: 'Audit which processes are AI-native vs augmented',
    outcome: 'AI-Native Firm Audit',
    concepts: [
      {
        id: 'ai-native-intro',
        title: 'What is an AI-Native Business?',
        body: 'An AI-native business is one that is built from the ground up with AI as a core capability...',
        difficulty: 'easy'
      },
      {
        id: 'ai-native-examples',
        title: 'Real-world Examples',
        body: 'Companies like Netflix, Amazon, and Spotify are AI-native...',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 2,
    name: 'Double Loop Strategy',
    description: 'Master the strategy framework for AI transformation',
    outcome: 'Double Loop Strategy Canvas'
  },
  {
    id: 3,
    name: 'Agentic AI',
    description: 'Identify opportunities for agentic AI in your workflows',
    outcome: 'Agent Opportunity Map'
  }
]

export const sessions = []
export const artefacts = []
export const knowledgeGraph = new Map()
