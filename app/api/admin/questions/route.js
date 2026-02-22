import { NextResponse } from 'next/server'
import db from '@/lib/database'

export async function GET(request) {
  try {
    const questions = await db.getAssessmentQuestions()
    return NextResponse.json(questions)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    if (body.action === 'create') {
      const question = await db.createQuestion(body.data)
      return NextResponse.json(question)
    } else if (body.action === 'update') {
      const question = await db.updateQuestion(body.id, body.data)
      return NextResponse.json(question)
    } else if (body.action === 'delete') {
      const question = await db.deleteQuestion(body.id)
      return NextResponse.json(question)
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 })
  }
}
