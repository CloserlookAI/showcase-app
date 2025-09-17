'use client';

import { useState, useEffect } from 'react';

export interface StockData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  marketCap: number;
  previousClose: number;
  dayLow: number;
  dayHigh: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  peRatio: number;
  dividendYield: number;
  lastUpdated: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  publisher: string;
  publishTime: string;
  link: string;
  thumbnail: string | null;
  timeAgo: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export function useStockData(symbol: string = 'LWAY') {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStockData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/stock?symbol=${symbol}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          throw new Error(result.error || 'Failed to fetch stock data');
        }
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStockData();

    // Auto-refresh every 5 minutes during market hours
    const interval = setInterval(fetchStockData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [symbol]);

  return { data, loading, error };
}

export function useNewsData(symbol: string = 'LWAY', limit: number = 10) {
  const [data, setData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewsData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/news?symbol=${symbol}&limit=${limit}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          throw new Error(result.error || 'Failed to fetch news data');
        }
      } catch (err) {
        console.error('Error fetching news data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNewsData();

    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchNewsData, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [symbol, limit]);

  return { data, loading, error };
}

// Hook for historical stock data
export function useHistoricalStockData(symbol: string, period: string = '1mo', interval: string = '1d') {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/stock/historical?symbol=${symbol}&period=${period}&interval=${interval}`);
        if (!response.ok) {
          throw new Error('Failed to fetch historical data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch historical data');
        console.error('Error fetching historical stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [symbol, period, interval]);

  return { data, loading, error };
}