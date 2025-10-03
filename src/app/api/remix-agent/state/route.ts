import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_AGENT_API_BASE_URL || 'https://ra-hyp-1.raworc.com/api/v0';
const BEARER_TOKEN = process.env.AGENT_BEARER_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const agentName = searchParams.get('agentName');

    if (!agentName) {
      return NextResponse.json(
        { error: 'Agent name is required' },
        { status: 400 }
      );
    }

    if (!BEARER_TOKEN) {
      return NextResponse.json(
        { error: 'AGENT_BEARER_TOKEN not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/agents/${agentName}`,
      {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to get agent state ${agentName}:`, errorText);
      return NextResponse.json(
        { error: `Failed to get agent state: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting agent state:', error);
    return NextResponse.json(
      { error: 'Failed to get agent state' },
      { status: 500 }
    );
  }
}
