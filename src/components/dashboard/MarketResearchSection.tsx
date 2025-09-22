'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMarketResearch } from "@/hooks/useMarketResearch";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Building,
  Globe,
  Users,
  Loader2,
  AlertTriangle,
  FileText,
  Activity,
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
  RadialLinearScale,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  RadialLinearScale
);

export default function MarketResearchSection() {
  const { data: marketData, loading, error } = useMarketResearch('LWAY');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#000721]" />
            <span className="text-[#000721]">Loading market research data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !marketData) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50/95 backdrop-blur-sm rounded-xl p-6 border border-red-200 shadow-xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-800">Error Loading Market Research</h2>
            <p className="text-red-600 mt-2">{error || 'Failed to load market research data'}</p>
          </div>
        </div>
      </div>
    );
  }

  const getTechnicalBadgeColor = (direction: string) => {
    switch (direction?.toLowerCase()) {
      case 'bullish': return 'success';
      case 'bearish': return 'destructive';
      default: return 'secondary';
    }
  };

  const getValueBadgeColor = (description: string) => {
    if (description?.toLowerCase().includes('overvalued')) return 'destructive';
    if (description?.toLowerCase().includes('undervalued')) return 'success';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#000721]">Market Research</h1>
            <p className="text-gray-600">Industry analysis and market positioning • {marketData.companyProfile.industry}</p>
          </div>
        </div>
      </div>

      {/* Company Profile */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <Building className="w-5 h-5" />
            <span>Company Profile</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Business overview and key details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[#000721] mb-2">Company: {marketData.companyProfile.companyName}</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {marketData.companyProfile.businessSummary}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Globe className="w-4 h-4 text-gray-500" />
                <a
                  href={marketData.companyProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {marketData.companyProfile.website || 'No website available'}
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sector</span>
                <Badge variant="outline" className="text-[#000721]">{marketData.companyProfile.sector}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Industry</span>
                <Badge variant="outline" className="text-[#000721]">{marketData.companyProfile.industry}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Market Cap</span>
                <span className="font-medium text-[#000721]">{formatCurrency(marketData.companyProfile.marketCap)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Employees</span>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-gray-500" />
                  <span className="font-medium text-[#000721]">{marketData.companyProfile.employees?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Country</span>
                <span className="font-medium text-[#000721]">{marketData.companyProfile.country}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Analysis */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <Activity className="w-5 h-5" />
            <span>Technical Analysis</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Market outlook and valuation assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-[#000721]">Short Term</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Direction</span>
                  <Badge variant={getTechnicalBadgeColor(marketData.technicalAnalysis.shortTerm.direction)}>
                    {marketData.technicalAnalysis.shortTerm.direction || 'N/A'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Score</span>
                  <span className="font-medium text-[#000721]">{marketData.technicalAnalysis.shortTerm.score || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-[#000721]">Medium Term</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Direction</span>
                  <Badge variant={getTechnicalBadgeColor(marketData.technicalAnalysis.mediumTerm.direction)}>
                    {marketData.technicalAnalysis.mediumTerm.direction || 'N/A'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Score</span>
                  <span className="font-medium text-[#000721]">{marketData.technicalAnalysis.mediumTerm.score || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-[#000721]">Long Term</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Direction</span>
                  <Badge variant={getTechnicalBadgeColor(marketData.technicalAnalysis.longTerm.direction)}>
                    {marketData.technicalAnalysis.longTerm.direction || 'N/A'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Score</span>
                  <span className="font-medium text-[#000721]">{marketData.technicalAnalysis.longTerm.score || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {marketData.technicalAnalysis.valuation && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-[#000721] mb-3">Valuation Assessment</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Valuation</span>
                <Badge variant={getValueBadgeColor(marketData.technicalAnalysis.valuation.description)}>
                  {marketData.technicalAnalysis.valuation.description} ({marketData.technicalAnalysis.valuation.discount})
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Health vs Industry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <Target className="w-5 h-5" />
              <span>Company Health Score</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Performance metrics vs industry average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar
                data={{
                  labels: ['Innovation', 'Hiring', 'Insider Sentiment', 'Earnings Quality'],
                  datasets: [
                    {
                      label: 'LWAY',
                      data: [
                        marketData.companyHealth.innovativeness * 100,
                        marketData.companyHealth.hiring * 100,
                        marketData.companyHealth.insiderSentiments * 100,
                        marketData.companyHealth.earningsReports * 100
                      ],
                      backgroundColor: 'rgba(0, 7, 33, 0.8)',
                      borderColor: '#000721',
                      borderWidth: 1,
                    },
                    {
                      label: 'Industry Avg',
                      data: [
                        marketData.industryComparison.sectorInnovativeness * 100,
                        marketData.industryComparison.sectorHiring * 100,
                        marketData.industryComparison.sectorInsiderSentiments * 100,
                        marketData.industryComparison.sectorEarningsReports * 100
                      ],
                      backgroundColor: 'rgba(34, 197, 94, 0.6)',
                      borderColor: '#22c55e',
                      borderWidth: 1,
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
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Score (%)'
                      }
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
              <span>Ownership Structure</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Institutional vs insider ownership breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center p-4">
              <div className="w-64 h-64">
                <Doughnut
                  data={{
                    labels: ['Insiders', 'Institutions', 'Public Float'],
                    datasets: [
                      {
                        data: [
                          marketData.ownershipBreakdown.insidersPercent * 100,
                          marketData.ownershipBreakdown.institutionsPercent * 100,
                          100 - (marketData.ownershipBreakdown.insidersPercent + marketData.ownershipBreakdown.institutionsPercent) * 100
                        ],
                        backgroundColor: [
                          '#000721',
                          '#22c55e',
                          '#3b82f6'
                        ],
                        borderColor: [
                          '#000721',
                          '#22c55e',
                          '#3b82f6'
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
            <div className="mt-4 text-center text-sm text-gray-600">
              {marketData.ownershipBreakdown.institutionsCount} institutional holders
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Significant Developments */}
      {marketData.significantDevelopments && marketData.significantDevelopments.length > 0 && (
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <AlertTriangle className="w-5 h-5" />
              <span>Significant Developments</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Recent key events and announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketData.significantDevelopments.map((dev, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">{dev.headline}</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {new Date(dev.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analyst Reports */}
      {marketData.analystReports && marketData.analystReports.length > 0 && (
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <FileText className="w-5 h-5" />
              <span>Recent Analyst Reports</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Professional research and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketData.analystReports.slice(0, 3).map((report, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-[#000721] mb-1">{report.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{report.provider}</p>
                      <p className="text-sm text-gray-700">{report.reportTitle}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={report.investmentRating === 'Bullish' ? 'success' :
                                report.investmentRating === 'Bearish' ? 'destructive' : 'secondary'}
                      >
                        {report.investmentRating}
                      </Badge>
                      {report.targetPrice && (
                        <p className="text-sm text-gray-600 mt-1">
                          Target: {formatCurrency(report.targetPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}