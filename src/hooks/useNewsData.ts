'use client';

import { useState, useEffect } from 'react';

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