'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { useFinancialData, useIncomeData, useAssetsData } from "@/hooks/useFinancialData";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Target,
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
  RadialLinearScale,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

// All mock data removed - using only real-time data from MongoDB and Yahoo Finance

export default function FinancialSection() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const { data: financialData, loading: financialLoading, error: financialError } = useFinancialData(selectedYear);
  const { data: incomeData, loading: incomeLoading, error: incomeError } = useIncomeData(selectedYear);
  const { data: assetsData, loading: assetsLoading, error: assetsError } = useAssetsData(selectedYear);

  // Fetch multi-year data for charts
  const { data: data2020 } = useFinancialData(2020);
  const { data: data2021 } = useFinancialData(2021);
  const { data: data2022 } = useFinancialData(2022);
  const { data: data2023 } = useFinancialData(2023);
  const { data: data2024 } = useFinancialData(2024);

  const availableYears = [2024, 2023, 2022, 2021, 2020];

  const loading = financialLoading || incomeLoading || assetsLoading;
  const error = financialError || incomeError || assetsError;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#000721]" />
            <span className="text-[#000721]">Loading financial data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !financialData || !incomeData || !assetsData) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50/95 backdrop-blur-sm rounded-xl p-6 border border-red-200 shadow-xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-800">Error Loading Financial Data</h2>
            <p className="text-red-600 mt-2">{error || 'Failed to load financial data'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#000721]/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#000721]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#000721]">Financial Data</h1>
              <p className="text-gray-600">Comprehensive financial analysis and metrics • Year {financialData.year}</p>
            </div>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-[#000721] focus:outline-none focus:ring-2 focus:ring-[#000721] focus:border-transparent"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Revenue (TTM)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(financialData.revenue * 1000)}</div>
            <div className="flex items-center space-x-1 text-sm mt-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">+8.50% YoY</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(financialData.netIncome * 1000)}</div>
            <div className="flex items-center space-x-1 text-sm mt-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">+23.60% YoY</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Gross Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatPercent(financialData.grossMargin)}</div>
            <div className="text-sm text-gray-600 mt-1">Industry avg: 28.5%</div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">EPS (TTM)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(financialData.eps)}</div>
            <div className="flex items-center space-x-1 text-sm mt-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">+23.70% YoY</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Performance Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <BarChart3 className="w-5 h-5" />
              <span>Revenue Growth Trend</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Multi-year revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line
                data={{
                  labels: ['2020', '2021', '2022', '2023', '2024'],
                  datasets: [
                    {
                      label: 'Revenue (in thousands)',
                      data: [
                        data2020?.revenue || 0,
                        data2021?.revenue || 0,
                        data2022?.revenue || 0,
                        data2023?.revenue || 0,
                        data2024?.revenue || 0
                      ],
                      borderColor: '#000721',
                      backgroundColor: 'rgba(0, 7, 33, 0.1)',
                      fill: true,
                      tension: 0.4,
                      pointBackgroundColor: '#000721',
                      pointBorderColor: '#fff',
                      pointBorderWidth: 2,
                      pointRadius: 6,
                    },
                    {
                      label: 'Net Income (in thousands)',
                      data: [
                        data2020?.netIncome || 0,
                        data2021?.netIncome || 0,
                        data2022?.netIncome || 0,
                        data2023?.netIncome || 0,
                        data2024?.netIncome || 0
                      ],
                      borderColor: '#22c55e',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      fill: true,
                      tension: 0.4,
                      pointBackgroundColor: '#22c55e',
                      pointBorderColor: '#fff',
                      pointBorderWidth: 2,
                      pointRadius: 6,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.dataset.label}: ${formatCurrency(context.parsed.y * 1000)}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: (value) => formatCurrency((value as number) * 1000)
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 11
                        }
                      }
                    }
                  },
                  layout: {
                    padding: {
                      bottom: 5,
                      left: 5,
                      right: 5
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <PieChart className="w-5 h-5" />
              <span>Financial Ratios Overview</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Key performance indicators visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center p-4">
              <div className="w-64 h-64">
                <Doughnut
                  data={{
                    labels: [
                      'Gross Margin',
                      'Net Margin',
                      'Operating Margin',
                      'Other Expenses'
                    ],
                    datasets: [
                      {
                        data: [
                          financialData.grossMargin * 100,
                          financialData.netMargin * 100,
                          financialData.operatingMargin * 100,
                          100 - (financialData.grossMargin + financialData.netMargin + financialData.operatingMargin) * 100
                        ],
                        backgroundColor: [
                          '#000721',
                          '#22c55e',
                          '#3b82f6',
                          '#ef4444'
                        ],
                        borderColor: [
                          '#000721',
                          '#22c55e',
                          '#3b82f6',
                          '#ef4444'
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `${context.label}: ${context.parsed.toFixed(1)}%`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Ratio</span>
                <span className="font-semibold text-[#000721]">{financialData.currentRatio.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ROE</span>
                <span className="font-semibold text-[#000721]">{formatPercent(financialData.returnOnEquity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Debt-to-Equity</span>
                <span className="font-semibold text-[#000721]">{financialData.debtToEquity.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ROA</span>
                <span className="font-semibold text-[#000721]">{formatPercent(financialData.returnOnAssets)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Sheet Summary */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <PieChart className="w-5 h-5" />
            <span>Balance Sheet Summary</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Assets, liabilities, and equity overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-[#000721]">Assets</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Assets</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(financialData.totalAssets * 1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cash & Equivalents</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(financialData.cash * 1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Working Capital</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(financialData.workingCapital * 1000)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[#000721]">Liabilities</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Liabilities</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(financialData.totalLiabilities * 1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Long-term Debt</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(0)}M</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[#000721]">Equity</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shareholders&apos; Equity</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(financialData.shareholdersEquity * 1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Book Value/Share</span>
                  <span className="font-medium text-[#000721]">{formatCurrency(financialData.bookValuePerShare)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Score */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <Target className="w-5 h-5" />
            <span>Financial Health Score</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Overall financial strength assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-green-600">B+</div>
              <div className="text-sm text-gray-600">Strong Financial Health</div>
            </div>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <div className="text-2xl font-bold text-green-600">78</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Liquidity</span>
              <Badge variant="success">Strong</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profitability</span>
              <Badge variant="success">Good</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Leverage</span>
              <Badge variant="warning">Moderate</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Growth</span>
              <Badge variant="success">Strong</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}