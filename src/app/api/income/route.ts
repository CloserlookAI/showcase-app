import { NextResponse } from 'next/server';
import { getIncomeData, parseThousands, parsePercentage } from '@/lib/mongodb';
import { IncomeData } from '@/types/financial';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    let incomeData;

    if (year) {
      // Get specific year
      incomeData = await getIncomeData(parseInt(year)) as unknown as IncomeData;
      if (!incomeData) {
        return NextResponse.json({ error: `No income data found for year ${year}` }, { status: 404 });
      }
    } else {
      // Get all years
      incomeData = await getIncomeData() as unknown as IncomeData[];
      if (!incomeData || incomeData.length === 0) {
        return NextResponse.json({ error: 'No income data found' }, { status: 404 });
      }
    }

    // Process the data
    const processedData = Array.isArray(incomeData)
      ? incomeData.map(processIncomeData)
      : processIncomeData(incomeData);

    return NextResponse.json({
      success: true,
      data: processedData
    });
  } catch (error) {
    console.error('Error fetching income data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch income data' },
      { status: 500 }
    );
  }
}

function processIncomeData(income: IncomeData) {
  return {
    year: income.Year,
    raw: income, // Include raw data for debugging
    processed: {
      revenue: parseThousands(income["Net Sales (thousands)"]) * 1000,
      costOfGoodsSold: parseThousands(income["Cost of Goods Sold (thousands)"]) * 1000,
      totalCostOfGoodsSold: parseThousands(income["Total Cost of Goods Sold (thousands)"]) * 1000,
      grossProfit: parseThousands(income["Gross Profit (thousands)"]) * 1000,
      grossMargin: parsePercentage(income["Gross Profit Margin %"]),
      sellingExpenses: parseThousands(income["Selling Expenses (thousands)"]) * 1000,
      adminExpenses: parseThousands(income["General & Administrative Expenses (thousands)"]) * 1000,
      totalOperatingExpenses: parseThousands(income["Total Operating Expenses (thousands)"]) * 1000,
      operatingIncome: parseThousands(income["Income from Operations (thousands)"]) * 1000,
      operatingMargin: parsePercentage(income["Operating Margin %"]),
      incomeBeforeTaxes: parseThousands(income["Income Before Taxes (thousands)"]) * 1000,
      provisionForTaxes: parseThousands(income["Provision for Income taxes (thousands)"]) * 1000,
      netIncome: parseThousands(income["Net Income (thousands)"]) * 1000,
      netMargin: parsePercentage(income["Net Profit Margin %"]),
      // Keep in thousands (original units from database)
      revenueM: parseThousands(income["Net Sales (thousands)"]),
      netIncomeM: parseThousands(income["Net Income (thousands)"]),
      operatingIncomeM: parseThousands(income["Income from Operations (thousands)"]),
    }
  };
}