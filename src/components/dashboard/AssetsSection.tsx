'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { useAssetsData } from "@/hooks/useFinancialData";
import {
  DollarSign,
  Wallet,
  Building2,
  Package,
  CreditCard,
  Loader2,
  PieChart,
  Calculator,
  BarChart3,
  TrendingUp
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

export default function AssetsSection() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const { data: assetsData, loading, error } = useAssetsData(selectedYear);

  // Fetch multi-year data for charts
  const { data: assets2020 } = useAssetsData(2020);
  const { data: assets2021 } = useAssetsData(2021);
  const { data: assets2022 } = useAssetsData(2022);
  const { data: assets2023 } = useAssetsData(2023);
  const { data: assets2024 } = useAssetsData(2024);

  const availableYears = [2024, 2023, 2022, 2021, 2020];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#000721]" />
            <span className="text-[#000721]">Loading balance sheet data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !assetsData) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50/95 backdrop-blur-sm rounded-xl p-6 border border-red-200 shadow-xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-800">Error Loading Assets Data</h2>
            <p className="text-red-600 mt-2">{error || 'Failed to load balance sheet data'}</p>
          </div>
        </div>
      </div>
    );
  }

  const processedData = assetsData.processed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#000721]">Balance Sheet</h1>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">Assets and liabilities overview • Year {assetsData.year}</p>
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

      {/* Key Balance Sheet Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Assets</CardTitle>
            <Building2 className="h-4 w-4 text-[#000721]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(processedData.totalAssetsM * 1000)}</div>
            <p className="text-xs text-gray-600 mt-1">Total company assets</p>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Cash & Equivalents</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(processedData.cashM * 1000)}</div>
            <p className="text-xs text-gray-600 mt-1">Liquid assets available</p>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Liabilities</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000721]">{formatCurrency(processedData.totalLiabilitiesM * 1000)}</div>
            <p className="text-xs text-gray-600 mt-1">Total obligations</p>
          </CardContent>
        </Card>

      </div>

      {/* Assets Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Assets */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <Wallet className="w-5 h-5" />
              <span>Current Assets</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Short-term assets and liquidity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Cash & Cash Equivalents</span>
                <span className="font-semibold text-green-600">{formatCurrency(processedData.cashM * 1000)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Accounts Receivable</span>
                <span className="font-medium text-[#000721]">{formatCurrency(processedData.accountsReceivable)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Inventory</span>
                <span className="font-medium text-[#000721]">{formatCurrency(processedData.inventory)}</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-blue-50 px-2 rounded">
                <span className="text-sm font-semibold text-blue-800">Total Current Assets</span>
                <span className="font-bold text-blue-600">{formatCurrency(processedData.currentAssets)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fixed Assets */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <Building2 className="w-5 h-5" />
              <span>Fixed Assets</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Long-term assets and investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Property, Plant & Equipment</span>
                <span className="font-medium text-[#000721]">{formatCurrency(processedData.propertyPlantEquipment)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Goodwill</span>
                <span className="font-medium text-[#000721]">{formatCurrency(processedData.goodwill)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Intangible Assets</span>
                <span className="font-medium text-[#000721]">{formatCurrency(processedData.intangibleAssets)}</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-green-50 px-2 rounded">
                <span className="text-sm font-semibold text-green-800">Total Fixed Assets</span>
                <span className="font-bold text-green-600">{formatCurrency(processedData.totalAssets - processedData.currentAssets)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liabilities & Equity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liabilities */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <CreditCard className="w-5 h-5" />
              <span>Liabilities</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Company obligations and debt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Accounts Payable</span>
                <span className="font-medium text-red-600">{formatCurrency(processedData.accountsPayable)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Accrued Expenses</span>
                <span className="font-medium text-red-600">{formatCurrency(processedData.accruedExpenses)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Current Liabilities</span>
                <span className="font-medium text-red-600">{formatCurrency(processedData.currentLiabilities)}</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-red-50 px-2 rounded">
                <span className="text-sm font-semibold text-red-800">Total Liabilities</span>
                <span className="font-bold text-red-600">{formatCurrency(processedData.totalLiabilitiesM * 1000)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equity & Ratios */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <Calculator className="w-5 h-5" />
              <span>Equity & Key Ratios</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Financial strength indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Working Capital</span>
                <span className="font-medium text-green-600">{formatCurrency(processedData.workingCapitalM * 1000)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Current Ratio</span>
                <span className="font-medium text-[#000721]">{processedData.currentRatio.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Debt-to-Equity</span>
                <span className="font-medium text-[#000721]">{processedData.debtToEquity.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-purple-50 px-2 rounded">
                <span className="text-sm font-semibold text-purple-800">Book Value/Share</span>
                <span className="font-bold text-purple-600">{formatCurrency(processedData.bookValuePerShare)}</span>
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
            <span>Balance Sheet Equation</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Assets and liabilities overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700 mb-2">Total Assets</div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(processedData.totalAssetsM * 1000)}</div>
              <div className="text-xs text-blue-600 mt-1">What we own</div>
            </div>
            <div className="p-6 bg-red-50 rounded-lg">
              <div className="text-sm text-red-700 mb-2">Total Liabilities</div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(processedData.totalLiabilitiesM * 1000)}</div>
              <div className="text-xs text-red-600 mt-1">What we owe</div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Outstanding Shares: {formatNumber(processedData.outstandingShares)} • Book Value per Share: {formatCurrency(processedData.bookValuePerShare)}
          </div>
        </CardContent>
      </Card>

      {/* Balance Sheet Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Composition Chart */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <PieChart className="w-5 h-5" />
              <span>Asset Composition {selectedYear}</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Breakdown of company assets by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="w-64 h-64">
                <Doughnut
                  data={{
                    labels: [
                      'Cash & Equivalents',
                      'Accounts Receivable',
                      'Inventory',
                      'PP&E (Net)',
                      'Other Assets'
                    ],
                    datasets: [
                      {
                        data: [
                          processedData.cashAndEquivalents,
                          processedData.accountsReceivable,
                          processedData.inventory,
                          processedData.propertyPlantEquipmentNet,
                          processedData.totalAssets - (processedData.cashAndEquivalents + processedData.accountsReceivable + processedData.inventory + processedData.propertyPlantEquipmentNet)
                        ],
                        backgroundColor: [
                          '#000721',
                          '#22c55e',
                          '#3b82f6',
                          '#f59e0b',
                          '#8b5cf6'
                        ],
                        borderColor: [
                          '#000000',
                          '#16a34a',
                          '#2563eb',
                          '#d97706',
                          '#7c3aed'
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

        {/* Liabilities & Equity Structure */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <BarChart3 className="w-5 h-5" />
              <span>Liabilities Structure {selectedYear}</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Company liabilities breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: ['Current Liabilities', 'Long-term Debt', 'Total Liabilities'],
                  datasets: [
                    {
                      label: 'Amount (thousands)',
                      data: [
                        processedData.currentLiabilities,
                        processedData.longTermDebt,
                        processedData.totalLiabilities
                      ],
                      backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(107, 114, 128, 0.8)'
                      ],
                      borderColor: [
                        '#dc2626',
                        '#d97706',
                        '#6b7280'
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
                          return `${context.label}: ${formatCurrency(context.parsed.y)}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Amount (USD)'
                      },
                      ticks: {
                        callback: (value) => formatCurrency(value as number)
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 10
                        }
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

      {/* Multi-Year Balance Sheet Trends */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <TrendingUp className="w-5 h-5" />
            <span>Assets & Liabilities Growth Trends</span>
          </CardTitle>
          <CardDescription className="text-gray-600">5-year progression of assets and liabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line
              data={{
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [
                  {
                    label: 'Total Assets',
                    data: [
                      assets2020?.processed?.totalAssets || 0,
                      assets2021?.processed?.totalAssets || 0,
                      assets2022?.processed?.totalAssets || 0,
                      assets2023?.processed?.totalAssets || 0,
                      assets2024?.processed?.totalAssets || 0
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
                    label: 'Total Liabilities',
                    data: [
                      assets2020?.processed?.totalLiabilities || 0,
                      assets2021?.processed?.totalLiabilities || 0,
                      assets2022?.processed?.totalLiabilities || 0,
                      assets2023?.processed?.totalLiabilities || 0,
                      assets2024?.processed?.totalLiabilities || 0
                    ],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                  },
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
                        return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount (USD)'
                    },
                    ticks: {
                      callback: (value) => formatCurrency(value as number)
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

      {/* Financial Health Ratios Chart */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <Calculator className="w-5 h-5" />
            <span>Financial Health Ratios</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Key liquidity and leverage ratios over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Bar
              data={{
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [
                  {
                    label: 'Current Ratio',
                    data: [
                      assets2020?.processed?.currentRatio || 0,
                      assets2021?.processed?.currentRatio || 0,
                      assets2022?.processed?.currentRatio || 0,
                      assets2023?.processed?.currentRatio || 0,
                      assets2024?.processed?.currentRatio || 0
                    ],
                    backgroundColor: 'rgba(0, 7, 33, 0.8)',
                    borderColor: '#000721',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                  },
                  {
                    label: 'Debt-to-Equity Ratio',
                    data: [
                      assets2020?.processed?.debtToEquityRatio || 0,
                      assets2021?.processed?.debtToEquityRatio || 0,
                      assets2022?.processed?.debtToEquityRatio || 0,
                      assets2023?.processed?.debtToEquityRatio || 0,
                      assets2024?.processed?.debtToEquityRatio || 0
                    ],
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: '#ef4444',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                  },
                  {
                    label: 'Asset Turnover Ratio',
                    data: [
                      assets2020?.processed?.assetTurnoverRatio || 0,
                      assets2021?.processed?.assetTurnoverRatio || 0,
                      assets2022?.processed?.assetTurnoverRatio || 0,
                      assets2023?.processed?.assetTurnoverRatio || 0,
                      assets2024?.processed?.assetTurnoverRatio || 0
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
                        const label = context.dataset.label;
                        const value = context.parsed.y;
                        if (label?.includes('Ratio')) {
                          return `${label}: ${value.toFixed(2)}x`;
                        }
                        return `${label}: ${value.toFixed(2)}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Ratio Value'
                    },
                    ticks: {
                      callback: (value) => `${value}x`
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