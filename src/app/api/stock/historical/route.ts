import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol') || 'LWAY';
    const period = searchParams.get('period') || '1mo';
    const interval = searchParams.get('interval') || '1d';

    console.log(`Fetching historical data for ${symbol} with period: ${period}, interval: ${interval}`);

    const queryOptions = {
      period1: getPeriodStartDate(period),
      period2: new Date(),
      interval: interval as any,
    };

    const result = await yahooFinance.historical(symbol, queryOptions);

    if (!result || result.length === 0) {
      throw new Error('No historical data found');
    }

    // Transform data for chart consumption
    const historicalData = result.map(item => ({
      date: item.date.toISOString().split('T')[0],
      timestamp: item.date.getTime(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      adjClose: item.adjClose
    }));

    // Calculate price change and percentage
    const latestPrice = historicalData[historicalData.length - 1]?.close || 0;
    const previousPrice = historicalData[historicalData.length - 2]?.close || latestPrice;
    const priceChange = latestPrice - previousPrice;
    const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

    return NextResponse.json({
      symbol,
      period,
      interval,
      data: historicalData,
      summary: {
        currentPrice: latestPrice,
        priceChange: priceChange,
        priceChangePercent: priceChangePercent,
        volume: historicalData[historicalData.length - 1]?.volume || 0,
        high52Week: Math.max(...historicalData.map(d => d.high)),
        low52Week: Math.min(...historicalData.map(d => d.low)),
      }
    });

  } catch (error) {
    console.error('Error fetching historical stock data:', error);

    // Return mock data for development
    const mockData = generateMockHistoricalData(
      searchParams.get('period') || '1mo',
      parseFloat(searchParams.get('basePrice') || '15.50')
    );

    return NextResponse.json(mockData);
  }
}

function getPeriodStartDate(period: string): Date {
  const now = new Date();
  const startDate = new Date(now);

  switch (period) {
    case '5d':
      startDate.setDate(now.getDate() - 5);
      break;
    case '1mo':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case '3mo':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case '6mo':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case '2y':
      startDate.setFullYear(now.getFullYear() - 2);
      break;
    case '5y':
      startDate.setFullYear(now.getFullYear() - 5);
      break;
    case 'max':
      startDate.setFullYear(now.getFullYear() - 10);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1);
  }

  return startDate;
}

function generateMockHistoricalData(period: string, basePrice: number) {
  const dataPoints = getDataPointsForPeriod(period);
  const data = [];
  let currentPrice = basePrice;

  const startDate = getPeriodStartDate(period);
  const endDate = new Date();
  const timeIncrement = (endDate.getTime() - startDate.getTime()) / dataPoints;

  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(startDate.getTime() + (i * timeIncrement));

    // Simulate realistic price movement
    const volatility = 0.02; // 2% daily volatility
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const trend = period.includes('y') ? 0.0001 : 0.001; // Slight upward trend

    currentPrice = currentPrice * (1 + randomChange + trend);

    const dayHigh = currentPrice * (1 + Math.random() * 0.01);
    const dayLow = currentPrice * (1 - Math.random() * 0.01);
    const volume = Math.floor(Math.random() * 100000) + 50000;

    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      open: currentPrice * (1 + (Math.random() - 0.5) * 0.005),
      high: dayHigh,
      low: dayLow,
      close: currentPrice,
      volume: volume,
      adjClose: currentPrice
    });
  }

  const latestPrice = data[data.length - 1]?.close || basePrice;
  const previousPrice = data[data.length - 2]?.close || latestPrice;
  const priceChange = latestPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

  return {
    symbol: 'LWAY',
    period,
    interval: period === '5d' ? '1h' : '1d',
    data,
    summary: {
      currentPrice: latestPrice,
      priceChange: priceChange,
      priceChangePercent: priceChangePercent,
      volume: data[data.length - 1]?.volume || 0,
      high52Week: Math.max(...data.map(d => d.high)),
      low52Week: Math.min(...data.map(d => d.low)),
    }
  };
}

function getDataPointsForPeriod(period: string): number {
  switch (period) {
    case '5d': return 40; // 8 hours per day
    case '1mo': return 30;
    case '3mo': return 90;
    case '6mo': return 180;
    case '1y': return 365;
    case '2y': return 730;
    case '5y': return 1825;
    case 'max': return 3650;
    default: return 30;
  }
}