import { NextResponse } from 'next/server'

const modules = [
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
        examples: ['Netflix', 'Amazon', 'Spotify']
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

export async function GET(request) {
  return NextResponse.json(modules)
}
