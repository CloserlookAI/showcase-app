import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'LWAY';

    // Get competitor recommendations
    const recommendations = await yahooFinance.recommendationsBySymbol(symbol);

    // Get detailed competitor data
    const competitorData = [];

    if (recommendations.recommendedSymbols && recommendations.recommendedSymbols.length > 0) {
      // Limit to top 5 competitors to avoid API rate limits
      const topCompetitors = recommendations.recommendedSymbols.slice(0, 5);

      for (const competitor of topCompetitors) {
        try {
          const [quote, summary] = await Promise.all([
            yahooFinance.quote(competitor.symbol),
            yahooFinance.quoteSummary(competitor.symbol, {
              modules: ['summaryProfile', 'financialData', 'defaultKeyStatistics']
            }).catch(() => null) // Some companies might not have all data
          ]);

          competitorData.push({
            symbol: competitor.symbol,
            score: competitor.score,
            companyName: quote.shortName || quote.longName || competitor.symbol,
            sector: quote.sector,
            industry: quote.industry,
            marketCap: quote.marketCap,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            volume: quote.regularMarketVolume,
            peRatio: quote.trailingPE,
            eps: quote.trailingEps,
            dividend: quote.dividendRate,
            employees: quote.fullTimeEmployees,
            website: summary?.summaryProfile?.website || '',
            businessSummary: summary?.summaryProfile?.longBusinessSummary || '',
            revenue: summary?.financialData?.totalRevenue || 0,
            grossMargin: summary?.financialData?.grossMargins || 0,
            operatingMargin: summary?.financialData?.operatingMargins || 0,
            profitMargin: summary?.financialData?.profitMargins || 0,
            roe: summary?.financialData?.returnOnEquity || 0,
            roa: summary?.financialData?.returnOnAssets || 0,
            debtToEquity: summary?.financialData?.debtToEquity || 0,
            currentRatio: summary?.financialData?.currentRatio || 0,
            beta: summary?.defaultKeyStatistics?.beta || 0
          });
        } catch (error) {
          console.warn(`Failed to fetch data for competitor ${competitor.symbol}:`, error);
          // Add basic data even if detailed fetch fails
          competitorData.push({
            symbol: competitor.symbol,
            score: competitor.score,
            companyName: competitor.symbol,
            error: 'Failed to fetch detailed data'
          });
        }
      }
    }

    // Also search for similar dairy/food companies
    let industryPeers = [];
    try {
      const search = await yahooFinance.search('dairy food beverage', {
        quotesCount: 8,
        newsCount: 0
      });

      if (search.quotes && search.quotes.length > 0) {
        industryPeers = search.quotes
          .filter(q => q.symbol !== symbol && q.sector && q.industry)
          .slice(0, 5)
          .map(q => ({
            symbol: q.symbol,
            companyName: q.shortName || q.longName,
            sector: q.sector,
            industry: q.industry,
            marketCap: q.marketCap,
            isPeer: true
          }));
      }
    } catch (error) {
      console.warn('Failed to fetch industry peers:', error);
    }

    return NextResponse.json({
      success: true,
      data: {
        directCompetitors: competitorData,
        industryPeers: industryPeers,
        totalCompetitors: competitorData.length,
        analysisDate: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching competitors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitor data' },
      { status: 500 }
    );
  }
}