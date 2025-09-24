'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCompetitors } from "@/hooks/useCompetitors";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Globe,
  Loader2,
  BarChart3,
  Target,
  ExternalLink,
  Star,
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
import { Bar } from 'react-chartjs-2';

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

export default function CompetitorsSection() {
  const { data: competitorData, loading, error } = useCompetitors('LWAY');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#000721]" />
            <span className="text-[#000721]">Loading competitor analysis...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !competitorData) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50/95 backdrop-blur-sm rounded-xl p-6 border border-red-200 shadow-xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-800">Error Loading Competitors</h2>
            <p className="text-red-600 mt-2">{error || 'Failed to load competitor data'}</p>
          </div>
        </div>
      </div>
    );
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#000721]">Competitor Analysis</h1>
            <p className="text-gray-600">Direct competitors and industry peer comparison • {competitorData.totalCompetitors} companies analyzed</p>
          </div>
        </div>
      </div>

      {/* Direct Competitors Overview */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <Building2 className="w-5 h-5" />
            <span>Direct Competitors</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Top competitors based on Yahoo Finance analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitorData.directCompetitors.map((competitor) => (
              <div key={competitor.symbol} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-[#000721]">{competitor.symbol}</h3>
                      {competitor.score && (
                        <Badge variant="outline" className="text-xs">
                          Score: {competitor.score.toFixed(3)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{competitor.companyName}</p>
                    {competitor.industry && (
                      <Badge variant="secondary" className="text-xs">{competitor.industry}</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    {competitor.price && (
                      <div className="text-lg font-bold text-[#000721]">
                        {formatCurrency(competitor.price)}
                      </div>
                    )}
                    {competitor.change && competitor.changePercent && (
                      <div className={`flex items-center space-x-1 text-xs ${getChangeColor(competitor.change)}`}>
                        {getChangeIcon(competitor.change)}
                        <span>{competitor.changePercent.toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {competitor.marketCap && (
                    <div>
                      <span className="text-gray-500">Market Cap:</span>
                      <div className="font-medium">{formatCurrency(competitor.marketCap)}</div>
                    </div>
                  )}
                  {competitor.peRatio && (
                    <div>
                      <span className="text-gray-500">P/E:</span>
                      <div className="font-medium">{competitor.peRatio.toFixed(1)}</div>
                    </div>
                  )}
                  {competitor.employees && (
                    <div>
                      <span className="text-gray-500">Employees:</span>
                      <div className="font-medium">{competitor.employees.toLocaleString()}</div>
                    </div>
                  )}
                  {competitor.beta && (
                    <div>
                      <span className="text-gray-500">Beta:</span>
                      <div className="font-medium">{competitor.beta.toFixed(2)}</div>
                    </div>
                  )}
                </div>

                {competitor.website && (
                  <div className="mt-3">
                    <a
                      href={competitor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-xs text-blue-600 hover:underline"
                    >
                      <Globe className="w-3 h-3" />
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {competitor.error && (
                  <div className="mt-2 text-xs text-red-600">
                    {competitor.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Comparison Chart */}
      {competitorData.directCompetitors.some(c => c.marketCap && c.revenue) && (
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <BarChart3 className="w-5 h-5" />
              <span>Financial Comparison</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Market cap and revenue comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar
                data={{
                  labels: competitorData.directCompetitors
                    .filter(c => c.marketCap && c.revenue)
                    .map(c => c.symbol),
                  datasets: [
                    {
                      label: 'Market Cap (Millions)',
                      data: competitorData.directCompetitors
                        .filter(c => c.marketCap && c.revenue)
                        .map(c => c.marketCap! / 1000000),
                      backgroundColor: 'rgba(0, 7, 33, 0.6)',
                      borderColor: '#000721',
                      borderWidth: 1,
                      yAxisID: 'y',
                    },
                    {
                      label: 'Revenue (Millions)',
                      data: competitorData.directCompetitors
                        .filter(c => c.marketCap && c.revenue)
                        .map(c => c.revenue! / 1000000),
                      backgroundColor: 'rgba(34, 197, 94, 0.6)',
                      borderColor: '#22c55e',
                      borderWidth: 1,
                      yAxisID: 'y1',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index' as const,
                    intersect: false,
                  },
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                  scales: {
                    y: {
                      type: 'linear' as const,
                      display: true,
                      position: 'left' as const,
                      title: {
                        display: true,
                        text: 'Market Cap (Millions USD)'
                      }
                    },
                    y1: {
                      type: 'linear' as const,
                      display: true,
                      position: 'right' as const,
                      title: {
                        display: true,
                        text: 'Revenue (Millions USD)'
                      },
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profitability Comparison */}
      {competitorData.directCompetitors.some(c => c.grossMargin && c.operatingMargin) && (
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <PieChart className="w-5 h-5" />
              <span>Profitability Metrics</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Margin comparison across competitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {competitorData.directCompetitors
                .filter(c => c.grossMargin && c.operatingMargin && c.profitMargin)
                .map((competitor) => (
                <div key={competitor.symbol} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[#000721] mb-3">{competitor.symbol}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gross Margin</span>
                      <span className="font-medium text-green-600">{formatPercent(competitor.grossMargin!)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Operating Margin</span>
                      <span className="font-medium text-blue-600">{formatPercent(competitor.operatingMargin!)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Profit Margin</span>
                      <span className="font-medium text-[#000721]">{formatPercent(competitor.profitMargin!)}</span>
                    </div>
                    {competitor.roe && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ROE</span>
                        <span className="font-medium text-purple-600">{formatPercent(competitor.roe)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Industry Peers */}
      {competitorData.industryPeers && competitorData.industryPeers.length > 0 && (
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#000721]">
              <Globe className="w-5 h-5" />
              <span>Industry Peers</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Related companies in the food & beverage industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitorData.industryPeers.map((peer) => (
                <div key={peer.symbol} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-[#000721]">{peer.symbol}</h4>
                      <p className="text-sm text-gray-700 mb-1">{peer.companyName}</p>
                      {peer.sector && (
                        <Badge variant="outline" className="text-xs">{peer.industry}</Badge>
                      )}
                    </div>
                    {peer.marketCap && (
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(peer.marketCap)}</div>
                        <div className="text-xs text-gray-500">Market Cap</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Summary */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <Star className="w-5 h-5" />
            <span>Analysis Summary</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Key insights from competitor analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[#000721] mb-3">Market Position</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Direct Competitors</span>
                  <Badge variant="outline">{competitorData.directCompetitors.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Industry Peers</span>
                  <Badge variant="outline">{competitorData.industryPeers.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Analysis Date</span>
                  <span className="text-sm font-medium">{new Date(competitorData.analysisDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#000721] mb-3">Key Observations</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• LWAY operates in the specialized kefir/probiotic dairy segment</li>
                <li>• Limited direct competition in the kefir market niche</li>
                <li>• Broader food & beverage industry provides context for growth</li>
                <li>• Consumer defensive sector generally stable during economic uncertainty</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}