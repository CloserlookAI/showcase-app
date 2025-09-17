'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { useStockData, useHistoricalStockData } from "@/hooks/useStockData";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  DollarSign,
  Target,
  Calendar,
  Package,
  Loader2
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

// Using only Yahoo Finance stock data for all metrics

export default function RevenueSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('1mo');
  const { data: stockData, loading, error } = useStockData('LWAY');
  const { data: historicalData, loading: chartLoading } = useHistoricalStockData('LWAY', selectedPeriod);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#000721]" />
            <span className="text-[#000721]">Loading stock data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stockData) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50/95 backdrop-blur-sm rounded-xl p-6 border border-red-200 shadow-xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-800">Error Loading Stock Data</h2>
            <p className="text-red-600 mt-2">{error || 'Failed to load stock data'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate financial metrics from Yahoo Finance data
  const currentPrice = stockData.currentPrice;
  const marketCap = stockData.marketCap;
  const volume = stockData.volume;
  const peRatio = stockData.peRatio;
  const dividendYield = stockData.dividendYield;

  // Estimate annual revenue based on market cap (typical P/S ratio for food companies is ~1.5-3x)
  const estimatedAnnualRevenue = marketCap / 2; // Using 2x P/S ratio assumption
  const monthlyRevenue = estimatedAnnualRevenue / 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#000721]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#000721]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#000721]">Stock & Revenue Analytics</h1>
              <p className="text-gray-600">Comprehensive analysis based on Yahoo Finance data</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(currentPrice)}</div>
            <div className="flex items-center space-x-1 justify-end">
              {stockData.priceChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`font-medium ${stockData.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stockData.priceChange >= 0 ? '+' : ''}{formatCurrency(stockData.priceChange)} ({stockData.priceChangePercent.toFixed(2)}%)
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Vol: {formatNumber(volume)} • Mkt Cap: {formatCurrency(marketCap)}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(currentPrice)}</div>
            <div className="flex items-center space-x-1 text-sm mt-1">
              {stockData.priceChange >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span className={`font-medium ${stockData.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stockData.priceChangePercent.toFixed(2)}% today
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(marketCap)}</div>
            <div className="text-sm text-gray-600 mt-1">Total valuation</div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Est. Annual Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(estimatedAnnualRevenue)}</div>
            <div className="text-sm text-gray-600 mt-1">Based on P/S ratio</div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatNumber(volume)}</div>
            <div className="text-sm text-gray-600 mt-1">Shares traded</div>
          </CardContent>
        </Card>
      </div>

      {/* Yahoo Finance-Style Stock Chart */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#000721]" />
              <div>
                <CardTitle className="text-[#000721]">LWAY Stock Performance</CardTitle>
                <CardDescription className="text-gray-600">
                  {historicalData ?
                    `${formatCurrency(historicalData.summary.currentPrice)} ${historicalData.summary.priceChangePercent >= 0 ? '+' : ''}${historicalData.summary.priceChange.toFixed(2)} (${historicalData.summary.priceChangePercent.toFixed(2)}%)` :
                    'Loading stock data...'
                  }
                </CardDescription>
              </div>
            </div>

            {/* Time Period Selector */}
            <div className="flex items-center space-x-1">
              {['5D', '1M', '3M', '6M', '1Y', '2Y', '5Y', 'MAX'].map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    const periodMap: {[key: string]: string} = {
                      '5D': '5d',
                      '1M': '1mo',
                      '3M': '3mo',
                      '6M': '6mo',
                      '1Y': '1y',
                      '2Y': '2y',
                      '5Y': '5y',
                      'MAX': 'max'
                    };
                    setSelectedPeriod(periodMap[period] || '1mo');
                  }}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    (() => {
                      const periodMap: {[key: string]: string} = {
                        '5D': '5d', '1M': '1mo', '3M': '3mo', '6M': '6mo',
                        '1Y': '1y', '2Y': '2y', '5Y': '5y', 'MAX': 'max'
                      };
                      return selectedPeriod === periodMap[period];
                    })()
                      ? 'bg-[#000721] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#000721] mx-auto mb-2" />
                <p className="text-gray-600">Loading stock data...</p>
              </div>
            </div>
          ) : historicalData && historicalData.data ? (
            <div className="space-y-4">
              {/* Price Chart */}
              <div className="h-80">
                <Line
                  data={{
                    labels: historicalData.data.map((item: any) => {
                      const date = new Date(item.timestamp);
                      if (selectedPeriod === '5d') {
                        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                      }
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }),
                    datasets: [
                      {
                        label: 'Stock Price',
                        data: historicalData.data.map((item: any) => item.close),
                        borderColor: historicalData.summary.priceChangePercent >= 0 ? '#22c55e' : '#ef4444',
                        backgroundColor: historicalData.summary.priceChangePercent >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.1,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        borderWidth: 2,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                          title: (tooltipItems) => {
                            const dataIndex = tooltipItems[0].dataIndex;
                            const date = new Date(historicalData.data[dataIndex].timestamp);
                            return date.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            });
                          },
                          label: (context) => {
                            const dataIndex = context.dataIndex;
                            const item = historicalData.data[dataIndex];
                            return [
                              `Open: ${formatCurrency(item.open)}`,
                              `High: ${formatCurrency(item.high)}`,
                              `Low: ${formatCurrency(item.low)}`,
                              `Close: ${formatCurrency(item.close)}`,
                              `Volume: ${formatNumber(item.volume)}`
                            ];
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        display: true,
                        grid: {
                          display: false
                        },
                        ticks: {
                          maxRotation: 0,
                          font: {
                            size: 10
                          }
                        }
                      },
                      y: {
                        display: true,
                        position: 'right',
                        title: {
                          display: true,
                          text: 'Price ($)'
                        },
                        ticks: {
                          callback: (value) => formatCurrency(value as number),
                          font: {
                            size: 10
                          }
                        }
                      }
                    },
                    interaction: {
                      intersect: false,
                      mode: 'index'
                    },
                    layout: {
                      padding: {
                        right: 10
                      }
                    }
                  }}
                />
              </div>

              {/* Volume Chart */}
              <div className="h-32">
                <Bar
                  data={{
                    labels: historicalData.data.map((item: any) => {
                      const date = new Date(item.timestamp);
                      if (selectedPeriod === '5d') {
                        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                      }
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }),
                    datasets: [
                      {
                        label: 'Volume',
                        data: historicalData.data.map((item: any) => item.volume),
                        backgroundColor: 'rgba(107, 114, 128, 0.6)',
                        borderColor: 'rgba(107, 114, 128, 0.8)',
                        borderWidth: 0.5,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => `Volume: ${formatNumber(context.parsed.y)}`
                        }
                      }
                    },
                    scales: {
                      x: {
                        display: true,
                        grid: {
                          display: false
                        },
                        ticks: {
                          display: false
                        }
                      },
                      y: {
                        display: true,
                        position: 'right',
                        title: {
                          display: true,
                          text: 'Volume'
                        },
                        ticks: {
                          callback: (value) => formatNumber(value as number),
                          font: {
                            size: 10
                          }
                        }
                      }
                    },
                    layout: {
                      padding: {
                        right: 10
                      }
                    }
                  }}
                />
              </div>

              {/* Stock Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600">52W High</div>
                  <div className="font-semibold text-[#000721]">{formatCurrency(historicalData.summary.high52Week)}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600">52W Low</div>
                  <div className="font-semibold text-[#000721]">{formatCurrency(historicalData.summary.low52Week)}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600">Volume</div>
                  <div className="font-semibold text-[#000721]">{formatNumber(historicalData.summary.volume)}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600">Market Cap</div>
                  <div className="font-semibold text-[#000721]">{stockData ? formatCurrency(stockData.marketCap) : 'N/A'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-600">No stock data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Insights with Stock Performance */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <BarChart3 className="w-5 h-5" />
            <span>Revenue & Market Performance</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Financial metrics combined with stock performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-[#000721] mb-2">Revenue Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Annual Revenue</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(estimatedAnnualRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Revenue</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(monthlyRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">P/E Ratio</span>
                  <span className="font-medium text-[#000721]">{peRatio.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dividend Yield</span>
                  <span className="font-medium text-[#000721]">{formatPercent(dividendYield)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-[#000721] mb-2">Stock Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Price</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(currentPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Change</span>
                  <span className={`font-medium ${stockData.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stockData.priceChange >= 0 ? '+' : ''}{formatCurrency(stockData.priceChange)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Cap</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(marketCap)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">52W High</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(stockData.fiftyTwoWeekHigh)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-[#000721] mb-2">Trading Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-medium text-[#000721]">{formatNumber(volume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">52W Low</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(stockData.fiftyTwoWeekLow)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Previous Close</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(stockData.previousClose)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Day Range</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(stockData.dayLow)} - {formatCurrency(stockData.dayHigh)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Analysis Based on Yahoo Finance Data */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <Target className="w-5 h-5" />
            <span>Stock Analysis Summary</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Key metrics and projections based on Yahoo Finance data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-[#000721] mb-2">Market Valuation</h3>
              <div className="text-2xl font-bold text-blue-600 mb-1">{formatCurrency(marketCap)}</div>
              <div className="text-sm text-gray-600">Current market capitalization</div>
              <div className="text-xs text-blue-600 mt-2">
                P/E Ratio: {peRatio.toFixed(2)}x
              </div>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-[#000721] mb-2">Est. Revenue</h3>
              <div className="text-2xl font-bold text-green-600 mb-1">{formatCurrency(estimatedAnnualRevenue)}</div>
              <div className="text-sm text-gray-600">Estimated annual revenue</div>
              <div className="text-xs text-green-600 mt-2">
                Based on 2x P/S ratio assumption
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-[#000721] mb-3">Key Stock Metrics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Price Change %</span>
                <span className={`font-medium ${stockData.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stockData.priceChangePercent >= 0 ? '+' : ''}{stockData.priceChangePercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dividend Yield</span>
                <span className="font-medium text-[#000721]">{formatPercent(dividendYield)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">52W High</span>
                <span className="font-medium text-[#000721]">{formatCurrency(stockData.fiftyTwoWeekHigh)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">52W Low</span>
                <span className="font-medium text-[#000721]">{formatCurrency(stockData.fiftyTwoWeekLow)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}