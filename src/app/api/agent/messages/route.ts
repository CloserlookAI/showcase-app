import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_AGENT_API_BASE_URL || 'https://remoteagent.raworc.com/api/v0';
const AGENT_NAME = process.env.NEXT_PUBLIC_AGENT_NAME;
const BEARER_TOKEN = process.env.AGENT_BEARER_TOKEN;

export async function POST(request: NextRequest) {
  if (!AGENT_NAME) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_AGENT_NAME environment variable is required' },
      { status: 500 }
    );
  }

  if (!BEARER_TOKEN) {
    return NextResponse.json(
      { error: 'AGENT_BEARER_TOKEN environment variable is required' },
      { status: 500 }
    );
  }

  try {
    const { content } = await request.json();

    // Step 1: Send user message
    const userMessageResponse = await fetch(`${API_BASE_URL}/agents/${AGENT_NAME}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify({
        role: 'user',
        content,
      }),
    });

    if (!userMessageResponse.ok) {
      let errorMessage = `HTTP ${userMessageResponse.status}: ${userMessageResponse.statusText}`;

      try {
        const errorData = await userMessageResponse.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: userMessageResponse.status }
      );
    }

    const userMessage = await userMessageResponse.json();

    // Step 2: Wait for agent to complete all processing and return the final response
    let allAgentResponses: any[] = [];
    const maxAttempts = 60; // 2 minutes max
    const pollDelay = 2000; // 2 seconds between polls
    let lastResponseCount = 0;
    let stableAttempts = 0;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, pollDelay));

      // Get recent messages
      const messagesResponse = await fetch(`${API_BASE_URL}/agents/${AGENT_NAME}/messages`, {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
      });

      if (messagesResponse.ok) {
        const messages = await messagesResponse.json();

        // Find all agent responses that came after our user message
        const userMessageTime = new Date(userMessage.created_at);
        allAgentResponses = messages
          .filter((msg: any) =>
            msg.role === 'agent' &&
            new Date(msg.created_at) > userMessageTime
          )
          .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        // Check if responses have stabilized (no new responses for a while)
        if (allAgentResponses.length > 0) {
          if (allAgentResponses.length === lastResponseCount) {
            stableAttempts++;
            // If stable for 10 attempts (20 seconds), agent is probably done
            if (stableAttempts >= 10) {
              break;
            }
          } else {
            stableAttempts = 0;
            lastResponseCount = allAgentResponses.length;
          }
        }
      }
    }

    if (allAgentResponses.length === 0) {
      return NextResponse.json(
        { error: 'Agent did not respond within expected time' },
        { status: 408 }
      );
    }

    // Return the last (final) response from the agent
    const finalResponse = allAgentResponses[allAgentResponses.length - 1];
    return NextResponse.json(finalResponse);
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message to agent' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!AGENT_NAME) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_AGENT_NAME environment variable is required' },
      { status: 500 }
    );
  }

  if (!BEARER_TOKEN) {
    return NextResponse.json(
      { error: 'AGENT_BEARER_TOKEN environment variable is required' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';

    const response = await fetch(`${API_BASE_URL}/agents/${AGENT_NAME}/messages?limit=${limit}&offset=${offset}`, {
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
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch messages from agent' },
      { status: 500 }
    );
  }
}