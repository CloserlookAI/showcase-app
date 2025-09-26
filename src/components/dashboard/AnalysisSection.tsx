'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useMarketResearch } from "@/hooks/useMarketResearch";
import { useCompetitors } from "@/hooks/useCompetitors";
import { useNewsData } from "@/hooks/useNewsData";
import { BarChart3, TrendingUp, Send, Loader2, Newspaper } from 'lucide-react';

export default function AnalysisSection() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const router = useRouter();

  // Fetch real-time data
  const { data: financialData, loading: financialLoading } = useFinancialData(2024);
  const { data: marketData, loading: marketLoading } = useMarketResearch('LWAY');
  const { data: competitorData, loading: competitorLoading } = useCompetitors('LWAY');
  const { data: newsData, loading: newsLoading } = useNewsData('LWAY', 3);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    router.push(`/analysis/response?query=${encodeURIComponent(input.trim())}`);
  };


  const handleDiscussClick = () => {
    router.push('/analysis/canvas');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#000721]/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#000721]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#000721]">Analysis Dashboard</h1>
              <p className="text-gray-600">Real-time business intelligence and insights • Updated {currentTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance Report Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Performance Report</CardTitle>
            <BarChart3 className="h-4 w-4 text-[#000721]" />
          </CardHeader>
          <CardContent>
            {financialLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#000721]" />
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : financialData ? (
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-[#000721]">
                    {formatCurrency(financialData.revenue * 1000)}
                  </div>
                  <div className="text-xs text-gray-600">Total Revenue (TTM)</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Revenue Growth</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-green-600 font-medium text-xs">+8.50% YoY</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Net Income</span>
                    <span className="font-semibold text-[#000721] text-xs">
                      {formatCurrency(financialData.netIncome * 1000)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={handleDiscussClick}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-[#000721] text-white rounded-lg hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#000721]/50 transition-all text-sm font-medium"
                  >
                    <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center">
                      <Image
                        src="https://avatars.githubusercontent.com/u/223376538?s=200&v=4"
                        alt="Remote Agent"
                        width={16}
                        height={16}
                        className="object-cover rounded-full"
                      />
                    </div>
                    <span>Discuss</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-red-600">Failed to load data</div>
            )}
          </CardContent>
        </Card>

        {/* Competitors & Market Research Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Competitors & Market</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#000721]" />
          </CardHeader>
          <CardContent>
            {(competitorLoading || marketLoading) ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#000721]" />
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : (competitorData && marketData) ? (
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-[#000721]">#3</div>
                  <div className="text-xs text-gray-600">Market Position</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Market Cap</span>
                    <span className="font-semibold text-[#000721] text-xs">
                      {formatCurrency(marketData.companyProfile.marketCap)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Technical Outlook</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-green-600 font-medium text-xs">
                        {String(marketData.technicalAnalysis.shortTerm.direction || 'Neutral')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-red-600">Failed to load data</div>
            )}
          </CardContent>
        </Card>

        {/* News Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Latest News</CardTitle>
            <Newspaper className="h-4 w-4 text-[#000721]" />
          </CardHeader>
          <CardContent>
            {newsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#000721]" />
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : newsData && newsData.length > 0 ? (
              <div className="space-y-3">
                <div>
                  <div className="text-lg font-bold text-[#000721]">{newsData.length}</div>
                  <div className="text-xs text-gray-600">Recent Articles</div>
                </div>

                <div className="space-y-2">
                  {newsData.slice(0, 2).map((article, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-[#000721] truncate">
                          {article.title}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {article.publisher} • {article.timeAgo}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-lg font-bold text-[#000721]">0</div>
                <div className="text-xs text-gray-600">No recent news available</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Remote Agent Assistant */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#000721]">
            <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="https://avatars.githubusercontent.com/u/223376538?s=200&v=4"
                alt="Remote Agent"
                width={24}
                height={24}
                className="object-cover rounded-full"
              />
            </div>
            <span>Remote Agent Assistant</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Give remote agent a task to work on and get insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chat Input */}
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the task or analysis you need..."
                  disabled={isLoading}
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#000721]/50 focus:border-[#000721]/50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-6 py-3 bg-[#000721] text-white rounded-xl hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#000721]/50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[100px]"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}