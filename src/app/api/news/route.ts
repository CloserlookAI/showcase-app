import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'LWAY';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get news for the company
    const newsResults = await yahooFinance.search(symbol, {
      newsCount: limit,
    });

    if (!newsResults.news || newsResults.news.length === 0) {
      return NextResponse.json({ error: 'No news found' }, { status: 404 });
    }

    // Process news data
    const processedNews = newsResults.news.map((article) => ({
      id: article.uuid,
      title: article.title,
      summary: article.summary || '',
      publisher: article.publisher,
      publishTime: article.providerPublishTime ? new Date(article.providerPublishTime * 1000).toISOString() : new Date().toISOString(),
      link: article.link,
      thumbnail: article.thumbnail?.resolutions?.[0]?.url || null,
      // Calculate relative time
      timeAgo: article.providerPublishTime ? getTimeAgo(article.providerPublishTime * 1000) : 'Recently',
      // Simple sentiment analysis based on title keywords
      sentiment: analyzeSentiment(article.title)
    }));

    return NextResponse.json({
      success: true,
      data: processedNews,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching news data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
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