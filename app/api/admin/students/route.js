import { NextResponse } from 'next/server'
import db from '@/lib/database'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const stage = searchParams.get('stage')
    const sector = searchParams.get('sector')
    const status = searchParams.get('status')
    
    const students = await db.getStudents({ stage, sector, status })
    return NextResponse.json(students)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const student = await db.createStudent(body)
    return NextResponse.json(student)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}
