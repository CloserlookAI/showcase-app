import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_AGENT_API_BASE_URL || 'https://ra-hyp-1.raworc.com/api/v0';
const BEARER_TOKEN = process.env.AGENT_BEARER_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agentName = searchParams.get('agent');

  if (!agentName) {
    return NextResponse.json(
      { error: 'agent parameter is required' },
      { status: 400 }
    );
  }

  if (!BEARER_TOKEN) {
    return NextResponse.json(
      { error: 'AGENT_BEARER_TOKEN environment variable is required' },
      { status: 500 }
    );
  }

  try {
    // Fetch HTML file from specified agent - path is part of URL
    const response = await fetch(`${API_BASE_URL}/agents/${agentName}/files/read/content/lifeway_performance_report.html`, {
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

    // Get the HTML content
    const htmlContent = await response.text();

    return NextResponse.json({
      content: htmlContent,
      contentType: 'text/html',
      path: 'content/lifeway_performance_report.html',
      agent: agentName
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch HTML file from remix agent' },
      { status: 500 }
    );
  }
}