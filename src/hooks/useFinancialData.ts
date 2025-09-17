'use client';

import { useState, useEffect } from 'react';

interface FinancialSummary {
  year: number;
  revenue: number;
  revenueGrowth: number;
  netIncome: number;
  operatingIncome: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  totalAssets: number;
  totalLiabilities: number;
  shareholdersEquity: number;
  cash: number;
  workingCapital: number;
  eps: number;
  bookValuePerShare: number;
  outstandingShares: number;
  currentRatio: number;
  debtToEquity: number;
  returnOnAssets: number;
  returnOnEquity: number;
  marketCap: number;
  peRatio: number;
  volume: number;
}

export function useFinancialData(year?: number) {
  const [data, setData] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFinancialData() {
      try {
        setLoading(true);
        const url = year ? `/api/financial-summary?year=${year}` : '/api/financial-summary';
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          throw new Error(result.error || 'Failed to fetch financial data');
        }
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchFinancialData();
  }, [year]);

  return { data, loading, error };
}

export function useIncomeData(year?: number) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIncomeData() {
      try {
        setLoading(true);
        const url = year ? `/api/income?year=${year}` : '/api/income';
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          throw new Error(result.error || 'Failed to fetch income data');
        }
      } catch (err) {
        console.error('Error fetching income data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchIncomeData();
  }, [year]);

  return { data, loading, error };
}

export function useAssetsData(year?: number) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssetsData() {
      try {
        setLoading(true);
        const url = year ? `/api/assets?year=${year}` : '/api/assets';
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          throw new Error(result.error || 'Failed to fetch assets data');
        }
      } catch (err) {
        console.error('Error fetching assets data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAssetsData();
  }, [year]);

  return { data, loading, error };
}