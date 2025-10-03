import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_AGENT_API_BASE_URL || 'https://ra-hyp-1.raworc.com/api/v0';
const BEARER_TOKEN = process.env.AGENT_BEARER_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { agentName, prompt = null } = await request.json();

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

    console.log(`Waking agent: ${agentName}${prompt ? ' with prompt' : ''}`);

    const response = await fetch(
      `${API_BASE_URL}/agents/${agentName}/wake`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
        body: JSON.stringify(prompt ? { prompt } : {}),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to wake agent ${agentName}:`, errorText);
      return NextResponse.json(
        { error: `Failed to wake agent: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Successfully woke agent: ${agentName}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error waking agent:', error);
    return NextResponse.json(
      { error: 'Failed to wake agent' },
      { status: 500 }
    );
  }
}
