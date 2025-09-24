import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'LWAY';

    const results: Record<string, unknown> = {
      symbol,
      timestamp: new Date().toISOString()
    };

    // Get company insights and market analysis
    const insights = await yahooFinance.insights(symbol);
    const marketSummary = await yahooFinance.quoteSummary(symbol, {
      modules: ['summaryProfile', 'recommendationTrend', 'majorHoldersBreakdown']
    });
    const quote = await yahooFinance.quote(symbol);

    // Process market research data
    results.marketResearch = {
      companyProfile: {
        companyName: quote.shortName || quote.longName || symbol,
        businessSummary: marketSummary.summaryProfile?.longBusinessSummary || 'No description available',
        sector: marketSummary.summaryProfile?.sector || (quote as unknown as { sector?: string }).sector || 'Unknown',
        industry: marketSummary.summaryProfile?.industry || (quote as unknown as { industry?: string }).industry || 'Unknown',
        employees: marketSummary.summaryProfile?.fullTimeEmployees || (quote as unknown as { fullTimeEmployees?: number }).fullTimeEmployees || 0,
        website: marketSummary.summaryProfile?.website || '',
        country: marketSummary.summaryProfile?.country || 'US',
        marketCap: quote.marketCap || 0
      },
      technicalAnalysis: {
        shortTerm: insights.instrumentInfo?.technicalEvents?.shortTermOutlook || {},
        mediumTerm: insights.instrumentInfo?.technicalEvents?.intermediateTermOutlook || {},
        longTerm: insights.instrumentInfo?.technicalEvents?.longTermOutlook || {},
        valuation: insights.instrumentInfo?.valuation || {},
        keyTechnicals: insights.instrumentInfo?.keyTechnicals || {}
      },
      companyHealth: {
        innovativeness: insights.companySnapshot?.company?.innovativeness || 0,
        hiring: insights.companySnapshot?.company?.hiring || 0,
        insiderSentiments: insights.companySnapshot?.company?.insiderSentiments || 0,
        earningsReports: insights.companySnapshot?.company?.earningsReports || 0
      },
      industryComparison: {
        sectorInfo: insights.companySnapshot?.sectorInfo || (quote as unknown as { sector?: string }).sector,
        sectorInnovativeness: insights.companySnapshot?.sector?.innovativeness || 0.5,
        sectorHiring: insights.companySnapshot?.sector?.hiring || 0.5,
        sectorSustainability: insights.companySnapshot?.sector?.sustainability || 0.5,
        sectorInsiderSentiments: insights.companySnapshot?.sector?.insiderSentiments || 0.5,
        sectorEarningsReports: insights.companySnapshot?.sector?.earningsReports || 0.5
      },
      significantDevelopments: insights.sigDevs || [],
      analystReports: insights.reports || [],
      ownershipBreakdown: {
        insidersPercent: marketSummary.majorHoldersBreakdown?.insidersPercentHeld || 0,
        institutionsPercent: marketSummary.majorHoldersBreakdown?.institutionsPercentHeld || 0,
        institutionsCount: marketSummary.majorHoldersBreakdown?.institutionsCount || 0
      }
    };

    return NextResponse.json({
      success: true,
      data: results.marketResearch,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching market research:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market research data' },
      { status: 500 }
    );
  }
}