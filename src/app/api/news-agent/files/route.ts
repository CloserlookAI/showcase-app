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
    // Use Files API to read from agent's /agent workspace
    // Path is relative to /agent (no leading slash)
    const filesApiUrl = `${API_BASE_URL}/agents/${agentName}/files/read/content/lway_news_report.html`;

    const response = await fetch(filesApiUrl, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If we can't parse error, use default message
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // The Files API returns raw bytes with Content-Type header
    const htmlContent = await response.text();

    return NextResponse.json({
      content: htmlContent,
      contentType: 'text/html',
      path: `content/lway_news_report.html`,
      agent: agentName
    });
  } catch (error) {
    console.error('Error fetching HTML file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch HTML file from news agent', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
