'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { useIncomeData } from "@/hooks/useFinancialData";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Loader2,
  TrendingDown as Loss,
  BarChart3,
  PieChart
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
import { Bar, Doughnut, Line } from 'react-chartjs-2';

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

export default function IncomeSection() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const { data: incomeData, loading, error } = useIncomeData(selectedYear);

  // Fetch multi-year data for charts
  const { data: income2020 } = useIncomeData(2020);
  const { data: income2021 } = useIncomeData(2021);
  const { data: income2022 } = useIncomeData(2022);
  const { data: income2023 } = useIncomeData(2023);
  const { data: income2024 } = useIncomeData(2024);

  const availableYears = [2024, 2023, 2022, 2021, 2020];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#000721]" />
            <span className="text-[#000721]">Loading income statement data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !incomeData) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50/95 backdrop-blur-sm rounded-xl p-6 border border-red-200 shadow-xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-800">Error Loading Income Data</h2>
            <p className="text-red-600 mt-2">{error || 'Failed to load income statement data'}</p>
          </div>
        </div>
      </div>
    );
  }

  const processedData = incomeData.processed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#000721]">Income Statement</h1>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">Revenue, expenses, and profit analysis • Year {incomeData.year}</p>
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

      {/* Key Income Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#000721]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(processedData.revenueM * 1000)}</div>
            <p className="text-xs text-gray-600 mt-1">Net sales for {incomeData.year}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(processedData.grossProfit)}</div>
            <div className="flex items-center space-x-1 text-xs mt-1">
              <span className="text-green-600">Margin: {formatPercent(processedData.grossMargin)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Operating Income</CardTitle>
            <Receipt className="h-4 w-4 text-[#000721]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(processedData.operatingIncomeM * 1000)}</div>
            <div className="flex items-center space-x-1 text-xs mt-1">
              <span className="text-gray-600">Margin: {formatPercent(processedData.operatingMargin)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(processedData.netIncomeM * 1000)}</div>
            <div className="flex items-center space-x-1 text-xs mt-1">
              <span className="text-green-600">Margin: {formatPercent(processedData.netMargin)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Statement Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Costs */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <DollarSign className="w-5 h-5" />
              <span>Revenue & Cost of Sales</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Top line revenue and direct costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Net Sales</span>
                <span className="font-semibold text-[#000721]">{formatCurrency(processedData.revenueM * 1000)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Cost of Goods Sold</span>
                <span className="font-medium text-red-600">({formatCurrency(processedData.costOfGoodsSold)})</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Cost of Goods Sold</span>
                <span className="font-medium text-red-600">({formatCurrency(processedData.totalCostOfGoodsSold)})</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-green-50 px-2 rounded">
                <span className="text-sm font-semibold text-green-800">Gross Profit</span>
                <span className="font-bold text-green-600">{formatCurrency(processedData.grossProfit)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Expenses */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <Receipt className="w-5 h-5" />
              <span>Operating Expenses</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Business operating costs breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Selling Expenses</span>
                <span className="font-medium text-red-600">({formatCurrency(processedData.sellingExpenses)})</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">General & Admin</span>
                <span className="font-medium text-red-600">({formatCurrency(processedData.adminExpenses)})</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Operating Expenses</span>
                <span className="font-medium text-red-600">({formatCurrency(processedData.totalOperatingExpenses)})</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-blue-50 px-2 rounded">
                <span className="text-sm font-semibold text-blue-800">Operating Income</span>
                <span className="font-bold text-blue-600">{formatCurrency(processedData.operatingIncomeM * 1000)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Line Results */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <TrendingUp className="w-5 h-5" />
            <span>Final Results & Margins</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Net income and profitability analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Income Before Taxes</div>
              <div className="text-lg font-bold text-[#000721]">{formatCurrency(processedData.incomeBeforeTaxes)}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Tax Provision</div>
              <div className="text-lg font-bold text-red-600">({formatCurrency(processedData.provisionForTaxes)})</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-700 mb-1">Net Income</div>
              <div className="text-xl font-bold text-green-600">{formatCurrency(processedData.netIncomeM * 1000)}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700 mb-1">Net Margin</div>
              <div className="text-xl font-bold text-blue-600">{formatPercent(processedData.netMargin)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Statement Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Year Revenue & Profit Trend */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <BarChart3 className="w-5 h-5" />
              <span>5-Year Income Trend</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Revenue, operating income, and net income progression</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line
                data={{
                  labels: ['2020', '2021', '2022', '2023', '2024'],
                  datasets: [
                    {
                      label: 'Revenue (millions)',
                      data: [
                        income2020?.processed?.revenueM || 0,
                        income2021?.processed?.revenueM || 0,
                        income2022?.processed?.revenueM || 0,
                        income2023?.processed?.revenueM || 0,
                        income2024?.processed?.revenueM || 0
                      ],
                      borderColor: '#000721',
                      backgroundColor: 'rgba(0, 7, 33, 0.1)',
                      fill: false,
                      tension: 0.4,
                      pointBackgroundColor: '#000721',
                      pointBorderColor: '#fff',
                      pointBorderWidth: 2,
                      pointRadius: 6,
                    },
                    {
                      label: 'Operating Income (millions)',
                      data: [
                        income2020?.processed?.operatingIncomeM || 0,
                        income2021?.processed?.operatingIncomeM || 0,
                        income2022?.processed?.operatingIncomeM || 0,
                        income2023?.processed?.operatingIncomeM || 0,
                        income2024?.processed?.operatingIncomeM || 0
                      ],
                      borderColor: '#3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      fill: false,
                      tension: 0.4,
                      pointBackgroundColor: '#3b82f6',
                      pointBorderColor: '#fff',
                      pointBorderWidth: 2,
                      pointRadius: 6,
                    },
                    {
                      label: 'Net Income (millions)',
                      data: [
                        income2020?.processed?.netIncomeM || 0,
                        income2021?.processed?.netIncomeM || 0,
                        income2022?.processed?.netIncomeM || 0,
                        income2023?.processed?.netIncomeM || 0,
                        income2024?.processed?.netIncomeM || 0
                      ],
                      borderColor: '#22c55e',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      fill: false,
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
                          return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}M`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Amount (Millions USD)'
                      },
                      ticks: {
                        callback: (value) => `$${value}M`
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Year'
                      }
                    }
                  },
                  layout: {
                    padding: {
                      bottom: 10,
                      left: 5,
                      right: 5
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Year Expense Breakdown */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <PieChart className="w-5 h-5" />
              <span>Expense Breakdown {selectedYear}</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Cost structure analysis for current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="w-64 h-64">
                <Doughnut
                  data={{
                    labels: [
                      'Cost of Goods Sold',
                      'Selling Expenses',
                      'Admin Expenses',
                      'Tax Provision',
                      'Net Income'
                    ],
                    datasets: [
                      {
                        data: [
                          processedData.totalCostOfGoodsSold,
                          processedData.sellingExpenses,
                          processedData.adminExpenses,
                          processedData.provisionForTaxes,
                          processedData.netIncomeM * 1000
                        ],
                        backgroundColor: [
                          '#ef4444',
                          '#f59e0b',
                          '#eab308',
                          '#6b7280',
                          '#22c55e'
                        ],
                        borderColor: [
                          '#dc2626',
                          '#d97706',
                          '#ca8a04',
                          '#4b5563',
                          '#16a34a'
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
                          padding: 15,
                          usePointStyle: true,
                          font: {
                            size: 10
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profitability Analysis Chart */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <BarChart3 className="w-5 h-5" />
            <span>Profitability Margins Analysis</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Gross, operating, and net margin trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Bar
              data={{
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [
                  {
                    label: 'Gross Margin (%)',
                    data: [
(income2020?.processed?.grossMargin || 0),
                      (income2021?.processed?.grossMargin || 0),
                      (income2022?.processed?.grossMargin || 0),
                      (income2023?.processed?.grossMargin || 0),
                      (income2024?.processed?.grossMargin || 0)
                    ],
                    backgroundColor: 'rgba(0, 7, 33, 0.8)',
                    borderColor: '#000721',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                  },
                  {
                    label: 'Operating Margin (%)',
                    data: [
                      (income2020?.processed?.operatingMargin || 0),
                      (income2021?.processed?.operatingMargin || 0),
                      (income2022?.processed?.operatingMargin || 0),
                      (income2023?.processed?.operatingMargin || 0),
                      (income2024?.processed?.operatingMargin || 0)
                    ],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                  },
                  {
                    label: 'Net Margin (%)',
                    data: [
                      (income2020?.processed?.netMargin || 0),
                      (income2021?.processed?.netMargin || 0),
                      (income2022?.processed?.netMargin || 0),
                      (income2023?.processed?.netMargin || 0),
                      (income2024?.processed?.netMargin || 0)
                    ],
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: '#22c55e',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
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
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Margin Percentage (%)'
                    },
                    ticks: {
                      callback: (value) => `${value}%`
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Year'
                    }
                  }
                },
                layout: {
                  padding: {
                    bottom: 10,
                    left: 5,
                    right: 5
                  }
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}