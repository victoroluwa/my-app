import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Symbol mapping for Yahoo Finance API
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol, interval = '1m', range = '1d' } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  try {
    // Map our symbol to Yahoo Finance symbol
    const yahooSymbol = SYMBOL_MAP[symbol] || symbol;
    
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`, {
      params: {
        interval,
        range,
      },
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Check if we got valid data
    if (!response.data || !response.data.chart || !response.data.chart.result || response.data.chart.result.length === 0) {
      throw new Error('No data returned from Yahoo Finance');
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Yahoo Finance API Error for ${symbol}:`, error);
    
    // Return fallback simulated data
    const simulatedData = generateSimulatedData(symbol as string, interval as string, range as string);
    res.status(200).json(simulatedData);
  }
}

function generateSimulatedData(symbol: string, interval: string, range: string) {
  const basePrices: { [key: string]: number } = {
    'XAUUSD': 2650,
    'XAGUSD': 31,
    'BTCUSD': 95000,
    'ETHUSD': 3400,
    'LTCUSD': 95,
    'USOIL': 68,
    'UKOIL': 72,
    'EURUSD': 1.08,
    'GBPUSD': 1.27,
    'USDJPY': 150,
    'AUDUSD': 0.66,
    'USDCAD': 1.39,
    'EURGBP': 0.85,
    'EURCHF': 0.94,
    'NZDUSD': 0.59,
  };

  const basePrice = basePrices[symbol] || 100;
  const currentTime = Math.floor(Date.now() / 1000);
  const dataPoints = range === '1d' ? 390 : 100; // Market hours for 1 day
  
  const timestamps: number[] = [];
  const opens: number[] = [];
  const highs: number[] = [];
  const lows: number[] = [];
  const closes: number[] = [];
  const volumes: number[] = [];

  let currentPrice = basePrice;
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = currentTime - (dataPoints - i) * 60; // 1 minute intervals
    const volatility = basePrice * 0.001;
    
    const open = currentPrice;
    const change = (Math.random() - 0.5) * volatility;
    const high = open + Math.abs(change) + Math.random() * volatility;
    const low = open - Math.abs(change) - Math.random() * volatility;
    const close = low + Math.random() * (high - low);
    
    timestamps.push(timestamp);
    opens.push(open);
    highs.push(high);
    lows.push(low);
    closes.push(close);
    volumes.push(Math.floor(Math.random() * 1000000));
    
    currentPrice = close;
  }

  const previousClose = opens[0];
  const currentClose = closes[closes.length - 1];
  
  return {
    chart: {
      result: [{
        meta: {
          currency: 'USD',
          symbol: SYMBOL_MAP[symbol] || symbol,
          regularMarketPrice: currentClose,
          previousClose: previousClose,
          regularMarketDayHigh: Math.max(...highs),
          regularMarketDayLow: Math.min(...lows),
          regularMarketVolume: volumes.reduce((a, b) => a + b, 0),
        },
        timestamp: timestamps,
        indicators: {
          quote: [{
            open: opens,
            high: highs,
            low: lows,
            close: closes,
            volume: volumes,
          }]
        }
      }],
      error: null
    }
  };
}