import { NextResponse } from 'next/server'

export async function GET(request) {
  const sessionCookie = request.cookies.get('session')
  
  if (!sessionCookie) {
    return NextResponse.json({ user: null })
  }
  
  try {
    const session = JSON.parse(sessionCookie.value)
    return NextResponse.json({ user: session })
  } catch (err) {
    return NextResponse.json({ user: null })
  }
}
