'use client';

import { useState, useEffect } from 'react';

export interface MarketResearchData {
  companyProfile: {
    companyName: string;
    businessSummary: string;
    sector: string;
    industry: string;
    employees: number;
    website: string;
    country: string;
    marketCap: number;
  };
  technicalAnalysis: {
    shortTerm: any;
    mediumTerm: any;
    longTerm: any;
    valuation: any;
    keyTechnicals: any;
  };
  companyHealth: {
    innovativeness: number;
    hiring: number;
    insiderSentiments: number;
    earningsReports: number;
  };
  industryComparison: {
    sectorInfo: string;
    sectorInnovativeness: number;
    sectorHiring: number;
    sectorSustainability: number;
    sectorInsiderSentiments: number;
    sectorEarningsReports: number;
  };
  significantDevelopments: any[];
  analystReports: any[];
  ownershipBreakdown: {
    insidersPercent: number;
    institutionsPercent: number;
    institutionsCount: number;
  };
}

export function useMarketResearch(symbol: string = 'LWAY') {
  const [data, setData] = useState<MarketResearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarketResearch() {
      try {
        setLoading(true);
        const response = await fetch(`/api/market-research?symbol=${symbol}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          throw new Error(result.error || 'Failed to fetch market research data');
        }
      } catch (err) {
        console.error('Error fetching market research data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMarketResearch();
  }, [symbol]);

  return { data, loading, error };
}