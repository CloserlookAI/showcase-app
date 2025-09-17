import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'LWAY';

    // Get current stock quote
    const quote = await yahooFinance.quote(symbol);

    if (!quote) {
      return NextResponse.json({ error: 'Stock data not found' }, { status: 404 });
    }

    // Calculate price change and percentage
    const currentPrice = quote.regularMarketPrice || 0;
    const previousClose = quote.regularMarketPreviousClose || 0;
    const priceChange = currentPrice - previousClose;
    const priceChangePercent = previousClose > 0 ? (priceChange / previousClose) * 100 : 0;

    const stockData = {
      symbol: quote.symbol,
      companyName: quote.longName || quote.shortName,
      currentPrice,
      priceChange,
      priceChangePercent,
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap || 0,
      previousClose: previousClose,
      dayLow: quote.regularMarketDayLow || 0,
      dayHigh: quote.regularMarketDayHigh || 0,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
      peRatio: quote.trailingPE || 0,
      dividendYield: quote.dividendYield || 0,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: stockData
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}