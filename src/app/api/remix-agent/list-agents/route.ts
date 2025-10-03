import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_AGENT_API_BASE_URL || 'https://ra-hyp-1.raworc.com/api/v0';
const BEARER_TOKEN = process.env.AGENT_BEARER_TOKEN;

export async function GET(request: NextRequest) {
  if (!BEARER_TOKEN) {
    return NextResponse.json(
      { error: 'AGENT_BEARER_TOKEN environment variable is required' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get('prefix') || '';
  const limit = parseInt(searchParams.get('limit') || '100');
  const page = parseInt(searchParams.get('page') || '1');

  try {
    // Get agents with the specified prefix using proper pagination
    const apiUrl = `${API_BASE_URL}/agents?q=${encodeURIComponent(prefix)}&limit=${limit}&page=${page}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      agents: data.items || [],
      total: data.total || 0,
      page: data.page || 1,
      pages: data.pages || 1,
      limit: data.limit || limit
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to list agents' },
      { status: 500 }
    );
  }
}