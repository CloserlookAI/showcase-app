'use client';

import { useState, useEffect } from 'react';

export interface CompetitorData {
  symbol: string;
  score?: number;
  companyName: string;
  sector?: string;
  industry?: string;
  marketCap?: number;
  price?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  peRatio?: number;
  eps?: number;
  dividend?: number;
  employees?: number;
  website?: string;
  businessSummary?: string;
  revenue?: number;
  grossMargin?: number;
  operatingMargin?: number;
  profitMargin?: number;
  roe?: number;
  roa?: number;
  debtToEquity?: number;
  currentRatio?: number;
  beta?: number;
  isPeer?: boolean;
  error?: string;
}

export interface CompetitorsResponse {
  directCompetitors: CompetitorData[];
  industryPeers: CompetitorData[];
  totalCompetitors: number;
  analysisDate: string;
}

export function useCompetitors(symbol: string = 'LWAY') {
  const [data, setData] = useState<CompetitorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompetitors() {
      try {
        setLoading(true);
        const response = await fetch(`/api/competitors?symbol=${symbol}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          throw new Error(result.error || 'Failed to fetch competitors data');
        }
      } catch (err) {
        console.error('Error fetching competitors data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitors();
  }, [symbol]);

  return { data, loading, error };
}