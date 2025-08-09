import { NextRequest, NextResponse } from 'next/server';

const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8001';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${CHAT_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Chat service unavailable',
          services: {
            chat_api: 'down',
            vector_service: 'unknown'
          }
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to check service health',
        services: {
          chat_api: 'down',
          vector_service: 'unknown'
        }
      },
      { status: 500 }
    );
  }
}
