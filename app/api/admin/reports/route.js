import { NextResponse } from 'next/server'
import db from '@/lib/database'

export async function GET(request) {
  try {
    const reports = await db.getAllReports()
    return NextResponse.json(reports)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}
