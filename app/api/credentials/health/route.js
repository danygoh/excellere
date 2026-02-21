// Simple health check for credentials API
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Credentials API is running',
    apiKeyPresent: !!process.env.ANTHROPIC_API_KEY,
    apiKeyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 15) || 'NOT SET'
  });
}
