import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_AGENT_API_BASE_URL || 'https://remoteagent.raworc.com/api/v0';
const AGENT_NAME = process.env.NEXT_PUBLIC_AGENT_NAME;
const BEARER_TOKEN = process.env.AGENT_BEARER_TOKEN;

export async function GET(request: NextRequest) {
  if (!AGENT_NAME || !BEARER_TOKEN) {
    return NextResponse.json(
      { error: 'Missing required environment variables' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const userMessageTime = searchParams.get('after');
    const lastKnownCount = parseInt(searchParams.get('count') || '0');

    if (!userMessageTime) {
      return NextResponse.json(
        { error: 'Missing after parameter' },
        { status: 400 }
      );
    }

    // Get recent messages
    const messagesResponse = await fetch(`${API_BASE_URL}/agents/${AGENT_NAME}/messages`, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (!messagesResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch messages from agent' },
        { status: messagesResponse.status }
      );
    }

    const messages = await messagesResponse.json();

    // Find all agent responses that came after the user message
    const afterTime = new Date(userMessageTime);
    const agentResponses = messages
      .filter((msg: unknown) => {
        const message = msg as { role: string; created_at: string };
        return message.role === 'agent' && new Date(message.created_at) > afterTime;
      })
      .sort((a: unknown, b: unknown) => {
        const msgA = a as { created_at: string };
        const msgB = b as { created_at: string };
        return new Date(msgA.created_at).getTime() - new Date(msgB.created_at).getTime();
      });

    // Return only new responses (responses beyond what the client already knows)
    const newResponses = agentResponses.slice(lastKnownCount);

    return NextResponse.json({
      responses: newResponses,
      totalCount: agentResponses.length,
      hasNewResponses: newResponses.length > 0
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to poll agent responses' },
      { status: 500 }
    );
  }
}