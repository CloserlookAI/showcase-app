import { NextResponse } from 'next/server';
import { getAssetsData, parseThousands } from '@/lib/mongodb';
import { AssetsData } from '@/types/financial';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    let assetsData;

    if (year) {
      // Get specific year
      assetsData = await getAssetsData(parseInt(year)) as AssetsData;
      if (!assetsData) {
        return NextResponse.json({ error: `No assets data found for year ${year}` }, { status: 404 });
      }
    } else {
      // Get all years
      assetsData = await getAssetsData() as AssetsData[];
      if (!assetsData || assetsData.length === 0) {
        return NextResponse.json({ error: 'No assets data found' }, { status: 404 });
      }
    }

    // Process the data
    const processedData = Array.isArray(assetsData)
      ? assetsData.map(processAssetsData)
      : processAssetsData(assetsData);

    return NextResponse.json({
      success: true,
      data: processedData
    });
  } catch (error) {
    console.error('Error fetching assets data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets data' },
      { status: 500 }
    );
  }
}

function processAssetsData(assets: AssetsData) {
  const totalAssets = parseThousands(assets["Total Assets (thousands)"]) * 1000;
  const totalLiabilities = parseThousands(assets["Total Liabilities (thousands)"]) * 1000;
  const shareholdersEquity = parseThousands(assets["Total Stockholders Equity (thousands)"]) * 1000;
  const currentAssets = parseThousands(assets["Total Current Assets (thousands)"]) * 1000;
  const currentLiabilities = parseThousands(assets["Total Current Liabilities (thousands)"]) * 1000;
  const outstandingShares = parseThousands(assets["Common Stock Outstanding Shares"]);

  return {
    year: assets.Year,
    raw: assets, // Include raw data for debugging
    processed: {
      totalAssets,
      cash: parseThousands(assets["Cash and Cash Equivalents (thousands)"]) * 1000,
      accountsReceivable: parseThousands(assets["Accounts Receivable Net (thousands)"]) * 1000,
      inventory: parseThousands(assets["Inventories Net (thousands)"]) * 1000,
      currentAssets,
      propertyPlantEquipment: parseThousands(assets["Property Plant Equipment Net (thousands)"]) * 1000,
      goodwill: parseThousands(assets["Goodwill (thousands)"]) * 1000,
      intangibleAssets: parseThousands(assets["Intangible Assets Net (thousands)"]) * 1000,

      // Liabilities
      totalLiabilities,
      accountsPayable: parseThousands(assets["Accounts Payable (thousands)"]) * 1000,
      accruedExpenses: parseThousands(assets["Accrued Expenses (thousands)"]) * 1000,
      currentLiabilities,
      deferredIncomeTax: parseThousands(assets["Deferred Income Taxes Net (thousands)"]) * 1000,

      // Equity
      shareholdersEquity,
      outstandingShares,
      workingCapital: parseThousands(assets["Working Capital (thousands)"]) * 1000,

      // Calculated ratios
      currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
      debtToEquity: shareholdersEquity > 0 ? totalLiabilities / shareholdersEquity : 0,
      bookValuePerShare: outstandingShares > 0 ? shareholdersEquity / outstandingShares : 0,

      // Keep in thousands (original units from database)
      totalAssetsM: parseThousands(assets["Total Assets (thousands)"]),
      totalLiabilitiesM: parseThousands(assets["Total Liabilities (thousands)"]),
      shareholdersEquityM: parseThousands(assets["Total Stockholders Equity (thousands)"]),
      cashM: parseThousands(assets["Cash and Cash Equivalents (thousands)"]),
      workingCapitalM: parseThousands(assets["Working Capital (thousands)"]),
    }
  };
}