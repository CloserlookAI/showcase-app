'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useNewsData, useStockData } from "@/hooks/useStockData";
import {
  Newspaper,
  ExternalLink,
  Loader2,
  TrendingUp,
  Calendar,
  Globe,
  BarChart3
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
  BarElement
);

export default function NewsSection() {
  const { data: newsData, loading: newsLoading, error: newsError } = useNewsData('LWAY', 20);
  const { data: stockData } = useStockData('LWAY');

  if (newsLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#000721]" />
            <span className="text-[#000721]">Loading news data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (newsError || !newsData) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50/95 backdrop-blur-sm rounded-xl p-6 border border-red-200 shadow-xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-800">Error Loading News</h2>
            <p className="text-red-600 mt-2">{newsError || 'Failed to load news data'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stock Info */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#000721]/10 rounded-lg flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-[#000721]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#000721]">News & Media</h1>
              <p className="text-gray-600">Latest company and market updates</p>
            </div>
          </div>
          {stockData && (
            <div className="text-right">
              <div className="text-lg font-bold text-[#000721]">{formatCurrency(stockData.currentPrice)}</div>
              <div className="text-sm text-gray-600">LWAY • {stockData.symbol}</div>
            </div>
          )}
        </div>
      </div>

      {/* News Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recent News */}
        <div className="lg:col-span-3">
          <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#000721]">
                <Newspaper className="w-5 h-5" />
                <span>Recent News</span>
              </CardTitle>
              <CardDescription className="text-gray-600">Latest updates about Lifeway Foods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {newsData.map((article, index) => (
                  <div
                    key={article.id}
                    className={`p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-blue-50/50 border-blue-200' : ''}`}
                  >
                    <div className="flex items-start space-x-4">
                      {article.thumbnail && (
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium mb-2 line-clamp-2 ${index === 0 ? 'text-lg text-[#000721]' : 'text-gray-900'}`}>
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#000721] transition-colors flex items-start space-x-1"
                          >
                            <span>{article.title}</span>
                            <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0" />
                          </a>
                        </h4>
                        {article.summary && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3">{article.summary}</p>
                        )}
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Globe className="w-3 h-3" />
                            <span>{article.publisher}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{article.timeAgo}</span>
                          </div>
                          <Badge
                            variant={
                              article.sentiment === 'positive' ? 'success' :
                              article.sentiment === 'negative' ? 'destructive' :
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {article.sentiment}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* News Summary */}
        <div>
          <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#000721]">
                <TrendingUp className="w-5 h-5" />
                <span>News Summary</span>
              </CardTitle>
              <CardDescription className="text-gray-600">Analysis overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-800">Positive News</div>
                  <div className="text-2xl font-bold text-green-600">
                    {newsData.filter(n => n.sentiment === 'positive').length}
                  </div>
                  <div className="text-xs text-green-600">articles</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">Neutral News</div>
                  <div className="text-2xl font-bold text-gray-600">
                    {newsData.filter(n => n.sentiment === 'neutral').length}
                  </div>
                  <div className="text-xs text-gray-600">articles</div>
                </div>

                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-sm font-medium text-red-800">Negative News</div>
                  <div className="text-2xl font-bold text-red-600">
                    {newsData.filter(n => n.sentiment === 'negative').length}
                  </div>
                  <div className="text-xs text-red-600">articles</div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-700">Total Articles</div>
                  <div className="text-xl font-bold text-[#000721]">{newsData.length}</div>
                  <div className="text-xs text-gray-600">in feed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* News Sentiment Analysis Chart */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <BarChart3 className="w-5 h-5" />
            <span>News Sentiment Analysis</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Visual breakdown of news sentiment and publication sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Distribution Pie Chart */}
            <div className="h-64 flex flex-col items-center">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Sentiment Distribution</h4>
              <div className="w-48 h-48">
                <Doughnut
                  data={{
                    labels: ['Positive', 'Neutral', 'Negative'],
                    datasets: [
                      {
                        data: [
                          newsData.filter(n => n.sentiment === 'positive').length,
                          newsData.filter(n => n.sentiment === 'neutral').length,
                          newsData.filter(n => n.sentiment === 'negative').length
                        ],
                        backgroundColor: [
                          '#22c55e',
                          '#6b7280',
                          '#ef4444'
                        ],
                        borderColor: [
                          '#16a34a',
                          '#4b5563',
                          '#dc2626'
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
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const total = newsData.length;
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} articles (${percentage}%)`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>

            {/* Publisher Distribution */}
            <div className="h-72">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Top News Publishers</h4>
              <Bar
                data={{
                  labels: [...new Set(newsData.map(n => n.publisher))].slice(0, 6),
                  datasets: [
                    {
                      label: 'Articles Published',
                      data: [...new Set(newsData.map(n => n.publisher))].slice(0, 6).map(publisher =>
                        newsData.filter(n => n.publisher === publisher).length
                      ),
                      backgroundColor: [
                        'rgba(0, 7, 33, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(147, 51, 234, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                      ],
                      borderColor: [
                        '#000721',
                        '#22c55e',
                        '#3b82f6',
                        '#9333ea',
                        '#f59e0b',
                        '#ef4444'
                      ],
                      borderWidth: 1,
                      borderRadius: 4,
                      borderSkipped: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  layout: {
                    padding: {
                      bottom: 10,
                      left: 5,
                      right: 5
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.label}: ${context.parsed.y} articles`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      },
                      title: {
                        display: true,
                        text: 'Number of Articles'
                      }
                    },
                    x: {
                      ticks: {
                        maxRotation: 45,
                        font: {
                          size: 9
                        },
                        callback: function(value, index) {
                          const label = this.getLabelForValue(value);
                          return label.length > 12 ? label.substring(0, 12) + '...' : label;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Sentiment Timeline */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Recent Sentiment Trend</h4>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((newsData.filter(n => n.sentiment === 'positive').length / newsData.length) * 100)}%
                </div>
                <div className="text-xs text-gray-600">Positive Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {Math.round((newsData.filter(n => n.sentiment === 'neutral').length / newsData.length) * 100)}%
                </div>
                <div className="text-xs text-gray-600">Neutral Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Math.round((newsData.filter(n => n.sentiment === 'negative').length / newsData.length) * 100)}%
                </div>
                <div className="text-xs text-gray-600">Negative Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#000721]">{newsData.length}</div>
                <div className="text-xs text-gray-600">Total Articles</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}