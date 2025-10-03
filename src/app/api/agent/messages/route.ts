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
    const { content: userMessage } = await request.json();

    // Step 1: Send user message with retry logic for busy agent
    const maxRetries = 10; // Retry up to 10 times
    const retryDelay = 2000; // Start with 2 second delay
    let userMessageResponse;
    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      userMessageResponse = await fetch(`${API_BASE_URL}/agents/${AGENT_NAME}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
        body: JSON.stringify({
          input: {
            content: [
              {
                type: "text",
                content: userMessage
              }
            ]
          },
          background: true,
        }),
      });

      // If successful or not a 409 error, break out of retry loop
      if (userMessageResponse.ok || userMessageResponse.status !== 409) {
        break;
      }

      // If 409 (Agent is busy), retry after delay
      if (userMessageResponse.status === 409) {
        try {
          const errorData = await userMessageResponse.json();
          lastError = errorData;
          console.log(`Attempt ${attempt + 1}/${maxRetries}: Agent is busy, retrying in ${retryDelay}ms...`);
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }

        // Wait before retrying (only if not the last attempt)
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    if (!userMessageResponse!.ok) {
      let errorMessage = `HTTP ${userMessageResponse!.status}: ${userMessageResponse!.statusText}`;
      let errorDetails = null;

      try {
        const errorData = lastError || await userMessageResponse!.json();
        errorMessage = errorData.message || errorMessage;
        errorDetails = errorData;
        console.error('RemoteAgent API Error after retries:', errorData);
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }

      return NextResponse.json(
        { error: errorMessage, details: errorDetails },
        { status: userMessageResponse!.status }
      );
    }

    const initialResponse = await userMessageResponse!.json();

    // If background=false timed out (504), fall back to polling
    let finalResponse = initialResponse;

    // With background=true, we always need to poll
    if (!['completed', 'failed'].includes(initialResponse.status)) {
      const maxAttempts = 1800; // 60 minutes (1800 * 2 seconds = 3600 seconds = 60 minutes)
      const pollDelay = 2000; // 2 seconds between polls


      for (let attempt = 0; attempt < maxAttempts && !['completed', 'failed'].includes(finalResponse.status); attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollDelay));

        // Poll the specific response by ID
        const pollResponse = await fetch(`${API_BASE_URL}/agents/${AGENT_NAME}/responses/${initialResponse.id}`, {
          headers: {
            'Authorization': `Bearer ${BEARER_TOKEN}`,
          },
        });

        if (pollResponse.ok) {
          const updatedResponse = await pollResponse.json();
          finalResponse = updatedResponse;

          if (['completed', 'failed'].includes(finalResponse.status)) {
            break;
          }
        }
      }
    }

    if (finalResponse.status === 'failed') {
      return NextResponse.json(
        { error: 'Agent failed to process the request' },
        { status: 500 }
      );
    }

    if (finalResponse.status !== 'completed') {
      return NextResponse.json(
        { error: 'Agent did not complete response within 60 minutes' },
        { status: 408 }
      );
    }

    // Transform the response to match the expected frontend format
    // Extract clean final content from output_content (includes title + content and URLs)
    let responseContent = '';

    if (finalResponse.output_content && finalResponse.output_content.length > 0) {
      const contentParts: string[] = [];

      for (const item of finalResponse.output_content) {
        if (item && typeof item === 'object') {
          let itemContent = '';

          // Add title if present
          if ('title' in item && typeof item.title === 'string') {
            itemContent += item.title + '\n';
          }

          // Add main content
          if ('content' in item && typeof item.content === 'string') {
            itemContent += item.content;
          }

          // Handle URL type specifically for published URLs
          if (item.type === 'url' && 'url' in item && typeof item.url === 'string') {
            if ('title' in item && typeof item.title === 'string') {
              itemContent += `\n\n${item.title}: ${item.url}`;
            } else {
              itemContent += `\n\n🔗 ${item.url}`;
            }
          }

          if (itemContent.trim()) {
            contentParts.push(itemContent);
          }
        }
      }

      responseContent = contentParts.join('\n\n');
    }

    const transformedResponse = {
      id: parseInt(finalResponse.id.replace(/-/g, '').substring(0, 10), 16), // Convert UUID to number-like ID
      role: 'agent' as const,
      content: responseContent || 'No response generated.',
      metadata: finalResponse.metadata || {},
      created_at: finalResponse.created_at,
      agent_name: finalResponse.agent_name
    };

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('Error in POST /api/agent/messages:', error);
    return NextResponse.json(
      { error: 'Failed to send message to agent', details: error instanceof Error ? error.message : String(error) },
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

    const response = await fetch(`${API_BASE_URL}/agents/${AGENT_NAME}/responses?limit=${limit}&offset=${offset}`, {
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

    // Transform the responses to match the expected frontend format
    const transformedData = Array.isArray(data)
      ? data.map((response: Record<string, unknown>) => ({
          id: parseInt(String(response.id).replace(/-/g, '').substring(0, 10), 16), // Convert UUID to number-like ID
          role: response.input_content && Array.isArray(response.input_content) && response.input_content.length > 0 ? 'user' : 'agent', // Determine role based on response structure
          content: (response.output_content as Record<string, unknown>[] | undefined)?.find((item: Record<string, unknown>) => item.type === 'text')?.content ||
                   (response.segments as Record<string, unknown>[] | undefined)?.find((segment: Record<string, unknown>) => segment.type === 'final')?.text ||
                   (response.input_content as Record<string, unknown>[] | undefined)?.find((item: Record<string, unknown>) => item.type === 'text')?.content || '',
          metadata: response.metadata || {},
          created_at: response.created_at,
          agent_name: response.agent_name
        }))
      : data;

    return NextResponse.json(transformedData);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch messages from agent' },
      { status: 500 }
    );
  }
}