import { NextResponse } from 'next/server'
import db from '@/lib/database'

export async function GET(request) {
  try {
    const validators = await db.getValidators()
    const queue = await db.getValidationQueue()
    return NextResponse.json({ validators, queue })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch validators' }, { status: 500 })
  }
}
