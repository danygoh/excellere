// API Route: Generate Insight Report - Minimal test version
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'GET works' });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      status: 'POST works', 
      received: body 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
