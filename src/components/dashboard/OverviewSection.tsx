'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useNewsData } from "@/hooks/useNewsData";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  BarChart3,
  Newspaper,
  Star,
  Package,
  Globe,
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

// Mock news removed - now using real Yahoo Finance data

// Mock reviews removed - using real data only

export default function OverviewSection() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const { data: financialData, loading, error } = useFinancialData(selectedYear);
  const { data: newsData, loading: newsLoading } = useNewsData('LWAY', 5);

  const availableYears = [2024, 2023, 2022, 2021, 2020];

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

  if (error || !financialData) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50/95 backdrop-blur-sm rounded-xl p-6 border border-red-200 shadow-xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-800">Error Loading Data</h2>
            <p className="text-red-600 mt-2">{error || 'Failed to load financial data'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Use real stock data or fallback to loading/error states

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#000721]">Company Financial Overview</h1>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">Financial Year {financialData.year}</p>
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
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-[#000721]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(financialData.totalAssets * 1000)}</div>
            <p className="text-xs text-gray-600 mt-1">Total company assets</p>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-[#000721]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(financialData.revenue * 1000)}</div>
            <div className="flex items-center space-x-1 text-xs mt-1">
              <span className="text-gray-600">Year {financialData.year}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#000721]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(financialData.netIncome * 1000)}</div>
            <p className="text-xs text-gray-600 mt-1">Net profit for {financialData.year}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">EPS</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#000721]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(financialData.eps)}</div>
            <p className="text-xs text-gray-600 mt-1">Earnings per share</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Financial Performance */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <BarChart3 className="w-5 h-5" />
              <span>Financial Performance</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Key financial metrics and ratios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Gross Margin</span>
                  <span className="font-semibold text-[#000721]">{formatPercent(financialData.grossMargin)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Operating Margin</span>
                  <span className="font-semibold text-[#000721]">{formatPercent(financialData.operatingMargin)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Net Margin</span>
                  <span className="font-semibold text-[#000721]">{formatPercent(financialData.netMargin)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Ratio</span>
                  <span className="font-semibold text-[#000721]">{financialData.currentRatio.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ROE</span>
                  <span className="font-semibold text-[#000721]">{formatPercent(financialData.returnOnEquity)}</span>
                </div>
              </div>
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4">
                <h4 className="font-semibold text-[#000721] mb-3 text-center">Key Financial Data</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Cash</span>
                    <span className="text-sm font-semibold text-[#000721] bg-blue-50 px-2 py-1 rounded">{formatCurrency(financialData.cash * 1000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Working Capital</span>
                    <span className="text-sm font-semibold text-[#000721] bg-blue-50 px-2 py-1 rounded">{formatCurrency(financialData.workingCapital * 1000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Shareholders' Equity</span>
                    <span className="text-sm font-semibold text-[#000721] bg-blue-50 px-2 py-1 rounded">{formatCurrency(financialData.shareholdersEquity * 1000)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Financial Performance Charts */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <BarChart3 className="w-5 h-5" />
            <span>Performance Analytics</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Visual analysis of financial metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Ratios Doughnut Chart */}
            <div className="h-64 flex flex-col items-center">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Financial Health Breakdown</h4>
              <div className="w-48 h-48">
                <Doughnut
                  data={{
                    labels: [
                      'ROE',
                      'ROA',
                      'Current Ratio',
                      'Other Metrics'
                    ],
                    datasets: [
                      {
                        data: [
                          financialData.returnOnEquity * 100,
                          financialData.returnOnAssets * 100,
                          financialData.currentRatio * 10, // Scale for visibility
                          30 // Placeholder for visualization
                        ],
                        backgroundColor: [
                          '#000721',
                          '#22c55e',
                          '#3b82f6',
                          '#f59e0b'
                        ],
                        borderColor: [
                          '#000721',
                          '#22c55e',
                          '#3b82f6',
                          '#f59e0b'
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
                          padding: 12,
                          usePointStyle: true,
                          font: {
                            size: 10
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label;
                            if (label === 'Current Ratio') {
                              return `${label}: ${(context.parsed / 10).toFixed(2)}x`;
                            }
                            return `${label}: ${context.parsed.toFixed(1)}%`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>

            {/* Financial Performance Chart */}
            <div className="h-64">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Financial Performance</h4>
              <Bar
                data={{
                  labels: ['Revenue', 'Net Income', 'Operating Income'],
                  datasets: [
                    {
                      label: 'Financial Metrics (thousands)',
                      data: [
                        financialData.revenue, // Revenue in thousands
                        financialData.netIncome, // Net income in thousands
                        financialData.operatingIncome // Operating income in thousands
                      ],
                      backgroundColor: [
                        'rgba(0, 7, 33, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(59, 130, 246, 0.8)'
                      ],
                      borderColor: [
                        '#000721',
                        '#22c55e',
                        '#3b82f6'
                      ],
                      borderWidth: 1,
                      borderRadius: 6,
                      borderSkipped: false,
                    },
                  ],
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
                        label: (context) => {
                          const label = context.label;
                          return `${label}: ${formatCurrency(context.parsed.y * 1000)}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Amount (Thousands USD)'
                      },
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
          </div>
        </CardContent>
      </Card>

      {/* Recent News */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <Newspaper className="w-5 h-5" />
            <span>Recent News</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Latest company and market updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsLoading ? (
              <div className="text-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-[#000721] mx-auto" />
                <p className="text-sm text-gray-600 mt-2">Loading latest news...</p>
              </div>
            ) : newsData.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600">No recent news available</p>
              </div>
            ) : (
              newsData.map((article) => (
                <div key={article.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Newspaper className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#000721] transition-colors"
                      >
                        {article.title}
                      </a>
                    </h4>
                    {article.summary && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.summary}</p>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{article.publisher}</span>
                      <span>•</span>
                      <span>{article.timeAgo}</span>
                      <Badge
                        variant={article.sentiment === 'positive' ? 'success' : article.sentiment === 'negative' ? 'destructive' : 'secondary'}
                        className="ml-2"
                      >
                        {article.sentiment}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-xl transition-all bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#000721]/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#000721]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#000721]">Financial Reports</h3>
                <p className="text-sm text-gray-600">View detailed financial statements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-xl transition-all bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#000721]">Product Analytics</h3>
                <p className="text-sm text-gray-600">Sales and performance metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-xl transition-all bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#000721]">Market Research</h3>
                <p className="text-sm text-gray-600">Industry trends and analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}