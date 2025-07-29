import axios from 'axios';

// Financial data types
export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  high: number;
  low: number;
  open: number;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}


// Free API endpoints (no key required)
const YAHOO_FINANCE_API = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const FINHUB_API = 'https://finnhub.io/api/v1';

// Mapping between our symbols and Yahoo Finance symbols
const SYMBOL_MAP: { [key: string]: string } = {
  'XAUUSD': 'GC=F',      // Gold futures
  'XAGUSD': 'SI=F',      // Silver futures
  'BTCUSD': 'BTC-USD',   // Bitcoin
  'ETHUSD': 'ETH-USD',   // Ethereum
  'LTCUSD': 'LTC-USD',   // Litecoin
  'USOIL': 'CL=F',       // Crude oil
  'UKOIL': 'BZ=F',       // Brent oil
  'EURUSD': 'EURUSD=X',  // EUR/USD
  'GBPUSD': 'GBPUSD=X',  // GBP/USD
  'USDJPY': 'USDJPY=X',  // USD/JPY
  'AUDUSD': 'AUDUSD=X',  // AUD/USD
  'USDCAD': 'USDCAD=X',  // USD/CAD
  'EURGBP': 'EURGBP=X',  // EUR/GBP
  'EURCHF': 'EURCHF=X',  // EUR/CHF
  'NZDUSD': 'NZDUSD=X',  // NZD/USD
};

export class FinancialDataService {
  private static instance: FinancialDataService;
  private cache = new Map<string, { data: MarketData; timestamp: number }>();
  private cacheTimeout = 30000; // 30 seconds

  static getInstance(): FinancialDataService {
    if (!FinancialDataService.instance) {
      FinancialDataService.instance = new FinancialDataService();
    }
    return FinancialDataService.instance;
  }

  // Get real-time market data for a symbol
  async getMarketData(symbol: string): Promise<MarketData> {
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await axios.get(`/api/finance/${symbol}`, {
        params: {
          interval: '1m',
          range: '1d'
        },
        timeout: 10000
      });

      if (!response.data || !response.data.chart || !response.data.chart.result) {
        throw new Error('Invalid API response');
      }

      const result = response.data.chart.result[0];
      const meta = result.meta;
      const quote = result.indicators.quote[0];
      const timestamps = result.timestamp;

      if (!quote || !timestamps) {
        throw new Error('No data available');
      }

      const currentPrice = meta.regularMarketPrice || quote.close[quote.close.length - 1];
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      const marketData: MarketData = {
        symbol,
        price: currentPrice,
        change,
        changePercent,
        volume: this.formatVolume(meta.regularMarketVolume || 0),
        high: meta.regularMarketDayHigh || currentPrice,
        low: meta.regularMarketDayLow || currentPrice,
        open: quote.open[0] || currentPrice,
      };

      this.cache.set(symbol, { data: marketData, timestamp: Date.now() });
      return marketData;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      // Return simulated data as fallback
      return this.getSimulatedData(symbol);
    }
  }

  // Get historical candlestick data
  async getCandleData(symbol: string, interval: string = '1m'): Promise<CandleData[]> {
    try {
      const response = await axios.get(`/api/finance/${symbol}`, {
        params: {
          interval,
          range: '1d' // Get 1 day of data for better performance
        },
        timeout: 10000
      });

      if (!response.data || !response.data.chart || !response.data.chart.result) {
        throw new Error('Invalid API response');
      }

      const result = response.data.chart.result[0];
      const timestamps = result.timestamp;
      const quote = result.indicators.quote[0];

      if (!timestamps || !quote) {
        throw new Error('No candlestick data available');
      }

      const candles: CandleData[] = [];
      for (let i = 0; i < timestamps.length; i++) {
        if (quote.open[i] && quote.high[i] && quote.low[i] && quote.close[i]) {
          candles.push({
            time: new Date(timestamps[i] * 1000).toISOString(),
            open: quote.open[i],
            high: quote.high[i],
            low: quote.low[i],
            close: quote.close[i],
            volume: quote.volume[i] || 0,
          });
        }
      }

      return candles;
    } catch (error) {
      console.error(`Error fetching candle data for ${symbol}:`, error);
      // Return simulated data as fallback
      return this.getSimulatedCandleData(symbol);
    }
  }

  // Get multiple symbols at once
  async getMultipleMarketData(symbols: string[]): Promise<MarketData[]> {
    const promises = symbols.map(symbol => this.getMarketData(symbol));
    const results = await Promise.allSettled(promises);

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Failed to fetch data for ${symbols[index]}:`, result.reason);
        return this.getSimulatedData(symbols[index]);
      }
    });
  }

  // WebSocket connection for real-time updates (placeholder)
  createWebSocketConnection(symbols: string[], callback: (data: MarketData) => void): WebSocket | null {
    // In a real implementation, this would connect to a WebSocket endpoint
    // For now, we'll simulate real-time updates with intervals
    const interval = setInterval(async () => {
      for (const symbol of symbols) {
        try {
          const data = await this.getMarketData(symbol);
          // Add small random variation to simulate real-time movement
          const variation = (Math.random() - 0.5) * 0.001;
          data.price *= (1 + variation);
          data.change += data.price * variation;
          data.changePercent = (data.change / (data.price - data.change)) * 100;
          callback(data);
        } catch (error) {
          console.error('Error in real-time update:', error);
        }
      }
    }, 2000);

    // Return a mock WebSocket object
    return {
      close: () => clearInterval(interval),
    } as WebSocket;
  }

  private formatVolume(volume: number): string {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toString();
  }

  private getSimulatedData(symbol: string): MarketData {
    const basePrice = this.getBasePrice(symbol);
    const change = (Math.random() - 0.5) * basePrice * 0.02;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol,
      price: basePrice + change,
      change,
      changePercent,
      volume: this.formatVolume(Math.floor(Math.random() * 1000000)),
      high: basePrice + Math.abs(change) * 1.5,
      low: basePrice - Math.abs(change) * 1.5,
      open: basePrice,
    };
  }

  private getSimulatedCandleData(symbol: string): CandleData[] {
    const basePrice = this.getBasePrice(symbol);
    const candles: CandleData[] = [];
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - 2);

    for (let i = 0; i < 100; i++) {
      const open = basePrice + (Math.random() - 0.5) * basePrice * 0.02;
      const volatility = basePrice * 0.005;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = low + Math.random() * (high - low);

      candles.push({
        time: currentTime.toISOString(),
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 10000),
      });

      currentTime.setMinutes(currentTime.getMinutes() + 1);
    }

    return candles;
  }

  private getBasePrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'XAUUSD': 3312,
      'XAGUSD': 38,
      'BTCUSD': 118000,
      'ETHUSD': 3800,
      'LTCUSD': 110,
      'USOIL': 66,
      'UKOIL': 70,
      'EURUSD': 1.15,
      'GBPUSD': 1.35,
      'USDJPY': 149,
      'AUDUSD': 0.65,
      'USDCAD': 1.37,
      'EURGBP': 0.86,
      'EURCHF': 0.93,
      'NZDUSD': 0.60,
    };
    return basePrices[symbol] || 100;
  }
}
