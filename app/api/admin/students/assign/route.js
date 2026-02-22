import { NextResponse } from 'next/server'
import db from '@/lib/database'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const validatorId = searchParams.get('validatorId')
    
    if (studentId && validatorId) {
      const student = await db.assignValidator(studentId, validatorId)
      return NextResponse.json(student)
    }
    
    const students = await db.getStudents()
    return NextResponse.json(students)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to assign validator' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const student = await db.assignValidator(body.studentId, body.validatorId)
    return NextResponse.json(student)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to assign validator' }, { status: 500 })
  }
}
