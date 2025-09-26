import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_AGENT_API_BASE_URL || 'https://ra-hyp-1.raworc.com/api/v0';
const BEARER_TOKEN = process.env.AGENT_BEARER_TOKEN;

export async function POST(request: NextRequest) {
  if (!BEARER_TOKEN) {
    return NextResponse.json(
      { error: 'AGENT_BEARER_TOKEN environment variable is required' },
      { status: 500 }
    );
  }

  try {
    const { parentAgentName, newAgentName } = await request.json();

    if (!parentAgentName || !newAgentName) {
      return NextResponse.json(
        { error: 'parentAgentName and newAgentName are required' },
        { status: 400 }
      );
    }

    // Create remix agent using the API
    const response = await fetch(`${API_BASE_URL}/agents/${parentAgentName}/remix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify({
        name: newAgentName,
        code: true,
        secrets: true,
        content: true,
      }),
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

    const remixedAgent = await response.json();

    return NextResponse.json({
      success: true,
      parentAgent: parentAgentName,
      newAgent: newAgentName,
      agentData: remixedAgent
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to remix agent' },
      { status: 500 }
    );
  }
}