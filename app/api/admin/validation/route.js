import { NextResponse } from 'next/server'
import db from '@/lib/database'

export async function GET(request) {
  try {
    const queue = await db.getValidationQueue()
    return NextResponse.json(queue)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const result = await db.assignValidationReport(body.reportId, body.validatorId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to assign report' }, { status: 500 })
  }
}
