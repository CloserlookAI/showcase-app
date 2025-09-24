import { NextResponse } from 'next/server';

const API_URL = "https://api.search.brave.com/res/v1/web/search";
const BRAVE_API_KEY = process.env.BRAVE_SEARCH_API_KEY;

const SAFES_SEARCH_MAP = { 0: 'off', 1: 'moderate', 2: 'strict' };

interface SearchParams {
  q: string;
  count?: number;
  offset?: number;
  country?: string;
  search_lang?: string;
  safesearch?: 0 | 1 | 2;
  freshness?: 'pd' | 'pw' | 'pm' | 'py';
  spellcheck?: 0 | 1;
  extra_snippets?: 0 | 1;
  summary?: 0 | 1;
}

function buildParams(params: SearchParams): Record<string, any> {
  const searchParams: Record<string, any> = {
    q: params.q,
    count: params.count || 10,
    offset: params.offset || 0,
    country: params.country || 'us',
    search_lang: params.search_lang || 'en',
    safesearch: SAFES_SEARCH_MAP[params.safesearch || 0],
    spellcheck: params.spellcheck !== undefined ? params.spellcheck : 1,
  };

  if (params.freshness) {
    searchParams.freshness = params.freshness;
  }
  if (params.extra_snippets) {
    searchParams.extra_snippets = 1;
  }
  if (params.summary) {
    searchParams.summary = 1;
  }

  return searchParams;
}

function extractWebResults(respJson: any): any[] {
  if (respJson.web && typeof respJson.web === 'object') {
    return respJson.web.results || [];
  }
  return respJson.results || [];
}

export async function POST(request: Request) {
  try {
    if (!BRAVE_API_KEY) {
      return NextResponse.json(
        { error: 'BRAVE_SEARCH_API_KEY environment variable is required' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { q: query } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter (q) is required' },
        { status: 400 }
      );
    }

    const headers = {
      "X-Subscription-Token": BRAVE_API_KEY,
      "Accept": "application/json"
    };

    const searchParams = buildParams(body);
    const urlParams = new URLSearchParams(searchParams);

    const response = await fetch(`${API_URL}?${urlParams}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brave Search API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Brave Search API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract and process web results
    const webResults = extractWebResults(data);

    // Enhanced response format
    const processedResults = {
      query: data.query?.original || query,
      web: {
        results: webResults.map((result: any) => ({
          title: result.title || '',
          url: result.url || '',
          description: result.description || '',
          age: result.age || null,
          language: result.language || null,
          family_friendly: result.family_friendly || true,
          snippet: result.description || ''
        }))
      },
      news: data.news?.results || [],
      videos: data.videos?.results || [],
      locations: data.locations?.results || [],
      infobox: data.infobox || null,
      mixed: data.mixed?.results || [],
      totalCount: webResults.length,
      searchTime: new Date().toISOString(),
      originalResponse: data // Include full response for debugging
    };

    return NextResponse.json({
      success: true,
      data: processedResults,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in Brave Search API:', error);
    return NextResponse.json(
      {
        error: 'Failed to search with Brave Search API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter (q) is required' },
        { status: 400 }
      );
    }

    // Convert GET params to POST body format
    const postBody = {
      q: query,
      count: parseInt(searchParams.get('count') || '10'),
      offset: parseInt(searchParams.get('offset') || '0'),
      country: searchParams.get('country') || 'us',
      search_lang: searchParams.get('lang') || 'en',
      safesearch: parseInt(searchParams.get('safesearch') || '0') as 0 | 1 | 2,
      freshness: searchParams.get('freshness') as 'pd' | 'pw' | 'pm' | 'py' | undefined,
      spellcheck: parseInt(searchParams.get('spellcheck') || '1') as 0 | 1,
      extra_snippets: parseInt(searchParams.get('extra_snippets') || '0') as 0 | 1,
      summary: parseInt(searchParams.get('summary') || '0') as 0 | 1,
    };

    // Reuse POST logic
    const postRequest = new Request(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postBody)
    });

    return POST(postRequest);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process GET request' },
      { status: 500 }
    );
  }
}