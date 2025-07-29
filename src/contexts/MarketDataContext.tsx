"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { FinancialDataService, MarketData, CandleData } from '@/lib/financialApi';

interface MarketDataContextType {
  marketData: { [symbol: string]: MarketData };
  candleData: { [symbol: string]: CandleData[] };
  selectedSymbol: string;
  isLoading: boolean;
  error: string | null;
  updateSymbol: (symbol: string) => void;
  refreshData: () => void;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

const TRADING_SYMBOLS = [
  'XAUUSD', 'XAGUSD', 'BTCUSD', 'ETHUSD', 'LTCUSD',
  'USOIL', 'UKOIL', 'EURUSD', 'GBPUSD', 'USDJPY',
  'AUDUSD', 'USDCAD', 'EURGBP', 'EURCHF', 'NZDUSD'
];

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [marketData, setMarketData] = useState<{ [symbol: string]: MarketData }>({});
  const [candleData, setCandleData] = useState<{ [symbol: string]: CandleData[] }>({});
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const financialService = FinancialDataService.getInstance();

  const updateMarketData = useCallback((data: MarketData) => {
    setMarketData(prev => ({
      ...prev,
      [data.symbol]: data
    }));
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load market data for all symbols
      const marketDataResults = await financialService.getMultipleMarketData(TRADING_SYMBOLS);
      const marketDataMap: { [symbol: string]: MarketData } = {};

      marketDataResults.forEach(data => {
        marketDataMap[data.symbol] = data;
      });

      setMarketData(marketDataMap);

      // Load candle data for selected symbol
      const candles = await financialService.getCandleData(selectedSymbol);
      setCandleData(prev => ({
        ...prev,
        [selectedSymbol]: candles
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load market data');
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [financialService, selectedSymbol]);

  const updateSymbol = useCallback(async (symbol: string) => {
    setSelectedSymbol(symbol);

    // Load candle data for new symbol if not already cached
    if (!candleData[symbol]) {
      try {
        const candles = await financialService.getCandleData(symbol);
        setCandleData(prev => ({
          ...prev,
          [symbol]: candles
        }));
      } catch (err) {
        console.error(`Error loading candle data for ${symbol}:`, err);
      }
    }
  }, [financialService, candleData]);

  const refreshData = useCallback(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Initialize data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Set up real-time data updates
  useEffect(() => {
    let websocket: WebSocket | null = null;

    const startRealTimeUpdates = () => {
      websocket = financialService.createWebSocketConnection(
        TRADING_SYMBOLS,
        updateMarketData
      );
    };

    // Start real-time updates after initial data is loaded
    if (!isLoading && Object.keys(marketData).length > 0) {
      startRealTimeUpdates();
    }

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [financialService, updateMarketData, isLoading, marketData]);

  // Periodically refresh data to ensure freshness
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        refreshData();
      }
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [refreshData, isLoading]);

  const contextValue: MarketDataContextType = {
    marketData,
    candleData,
    selectedSymbol,
    isLoading,
    error,
    updateSymbol,
    refreshData,
  };

  return (
    <MarketDataContext.Provider value={contextValue}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
}

// Custom hooks for specific data
export function useSymbolData(symbol: string) {
  const { marketData } = useMarketData();
  return marketData[symbol] || null;
}

export function useCurrentSymbolData() {
  const { marketData, selectedSymbol } = useMarketData();
  return marketData[selectedSymbol] || null;
}

export function useCandleData(symbol?: string) {
  const { candleData, selectedSymbol } = useMarketData();
  const targetSymbol = symbol || selectedSymbol;
  return candleData[targetSymbol] || [];
}
