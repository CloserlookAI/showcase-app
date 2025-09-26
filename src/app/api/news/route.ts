import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'LWAY';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Suppress the survey notice
    yahooFinance.suppressNotices(['yahooSurvey']);

    // Get news for the company
    const newsResults = await yahooFinance.search(symbol, {
      newsCount: limit,
      quotesCount: 0, // We only want news
    });

    if (!newsResults.news || newsResults.news.length === 0) {
      return NextResponse.json({ error: 'No news found for this symbol' }, { status: 404 });
    }

    // Process news data
    const processedNews = newsResults.news.map((article) => ({
      id: article.uuid || Math.random().toString(),
      title: article.title || 'No title available',
      summary: (article as unknown as { summary?: string }).summary || '',
      publisher: article.publisher || 'Unknown',
      publishTime: article.providerPublishTime ? new Date(Number(article.providerPublishTime) * 1000).toISOString() : new Date().toISOString(),
      link: article.link || '#',
      thumbnail: article.thumbnail?.resolutions?.[0]?.url || null,
      // Calculate relative time
      timeAgo: article.providerPublishTime ? getTimeAgo(Number(article.providerPublishTime) * 1000) : 'Recently',
      // Simple sentiment analysis based on title keywords
      sentiment: analyzeSentiment(article.title || '')
    }));

    return NextResponse.json({
      success: true,
      data: processedNews,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch news data:', error instanceof Error ? error.message : error);

    return NextResponse.json(
      {
        error: 'Failed to fetch news data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  }
}

function analyzeSentiment(title: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['up', 'gain', 'rise', 'growth', 'increase', 'strong', 'beat', 'exceed', 'profit', 'success', 'good', 'positive'];
  const negativeWords = ['down', 'fall', 'drop', 'decline', 'decrease', 'weak', 'miss', 'loss', 'fail', 'bad', 'negative', 'concern'];

  const lowerTitle = title.toLowerCase();
  const hasPositive = positiveWords.some(word => lowerTitle.includes(word));
  const hasNegative = negativeWords.some(word => lowerTitle.includes(word));

  if (hasPositive && !hasNegative) return 'positive';
  if (hasNegative && !hasPositive) return 'negative';
  return 'neutral';
}