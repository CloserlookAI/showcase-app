import { NextResponse } from 'next/server';
import { getLatestFinancialData, parseThousands, parsePercentage } from '@/lib/mongodb';
import { IncomeData, AssetsData } from '@/types/financial';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    let income, assets;

    if (year) {
      // Get specific year data
      const { getIncomeData, getAssetsData } = await import('@/lib/mongodb');
      income = await getIncomeData(parseInt(year));
      assets = await getAssetsData(parseInt(year));
    } else {
      // Get latest year data
      const { income: latestIncome, assets: latestAssets } = await getLatestFinancialData();
      income = latestIncome;
      assets = latestAssets;
    }

    if (!income || !assets) {
      return NextResponse.json({ error: 'No financial data found' }, { status: 404 });
    }

    const incomeData = income as IncomeData;
    const assetsData = assets as AssetsData;

    // Calculate key metrics for dashboard (values are already in thousands)
    const revenue = parseThousands(incomeData["Net Sales (thousands)"]);
    const netIncome = parseThousands(incomeData["Net Income (thousands)"]);
    const operatingIncome = parseThousands(incomeData["Income from Operations (thousands)"]);
    const totalAssets = parseThousands(assetsData["Total Assets (thousands)"]);
    const totalLiabilities = parseThousands(assetsData["Total Liabilities (thousands)"]);
    const shareholdersEquity = parseThousands(assetsData["Total Stockholders Equity (thousands)"]);
    const outstandingShares = parseThousands(assetsData["Common Stock Outstanding Shares"]);
    const currentAssets = parseThousands(assetsData["Total Current Assets (thousands)"]);
    const currentLiabilities = parseThousands(assetsData["Total Current Liabilities (thousands)"]);

    // Calculate derived metrics (converting thousands to actual dollars for calculations)
    const eps = outstandingShares > 0 ? (netIncome * 1000) / outstandingShares : 0;
    const bookValuePerShare = outstandingShares > 0 ? (shareholdersEquity * 1000) / outstandingShares : 0;
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const debtToEquity = shareholdersEquity > 0 ? totalLiabilities / shareholdersEquity : 0;
    const returnOnAssets = totalAssets > 0 ? ((netIncome * 1000) / (totalAssets * 1000)) * 100 : 0;
    const returnOnEquity = shareholdersEquity > 0 ? ((netIncome * 1000) / (shareholdersEquity * 1000)) * 100 : 0;

    const dashboardData = {
      year: incomeData.Year,
      // Revenue metrics (keep in thousands)
      revenue: revenue, // Already in thousands from database
      revenueGrowth: 0, // TODO: Calculate from historical data

      // Profitability (keep in thousands)
      netIncome: netIncome,
      operatingIncome: operatingIncome,
      grossMargin: parsePercentage(incomeData["Gross Profit Margin %"]),
      operatingMargin: parsePercentage(incomeData["Operating Margin %"]),
      netMargin: parsePercentage(incomeData["Net Profit Margin %"]),

      // Balance sheet (keep in thousands)
      totalAssets: totalAssets,
      totalLiabilities: totalLiabilities,
      shareholdersEquity: shareholdersEquity,
      cash: parseThousands(assetsData["Cash and Cash Equivalents (thousands)"]),
      workingCapital: parseThousands(assetsData["Working Capital (thousands)"]),

      // Per share metrics
      eps,
      bookValuePerShare,
      outstandingShares,

      // Financial ratios
      currentRatio,
      debtToEquity,
      returnOnAssets,
      returnOnEquity,

      // For dashboard display
      marketCap: 0, // Will need stock price API
      peRatio: 0, // Will need stock price API
      volume: 0, // Will need stock price API
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial summary' },
      { status: 500 }
    );
  }
}