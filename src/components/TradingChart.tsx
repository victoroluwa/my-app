"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, ColorType } from "lightweight-charts";
import { useMarketData, useCandleData, useCurrentSymbolData } from "../contexts/MarketDataContext";
import { Loader2 } from "lucide-react";

interface TradingChartProps {
  symbol: string;
}

export function TradingChart({ symbol }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const { isLoading } = useMarketData();
  const currentSymbolData = useCurrentSymbolData();
  const candleData = useCandleData(symbol);

  useEffect(() => {
    if (!chartContainerRef.current || isLoading || !candleData.length) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#1a1d26" },
        textColor: "#b0b3b8",
      },
      grid: {
        vertLines: { color: "#2a2d3a" },
        horzLines: { color: "#2a2d3a" },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: "#2a2d3a",
      },
      timeScale: {
        borderColor: "#2a2d3a",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#83bb06",
      downColor: "#d32f2f",
      borderDownColor: "#d32f2f",
      borderUpColor: "#83bb06",
      wickDownColor: "#d32f2f",
      wickUpColor: "#83bb06",
    });

    seriesRef.current = candlestickSeries;

    // Convert and set data
    const chartData = candleData.map(candle => ({
      time: Math.floor(new Date(candle.time).getTime() / 1000), // Convert to timestamp
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    candlestickSeries.setData(chartData);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol, candleData, isLoading]);

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    if (symbol.includes('JPY')) return price.toFixed(3);
    if (price > 1000) return price.toFixed(2);
    if (price > 1) return price.toFixed(4);
    return price.toFixed(6);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-[#1a1d26]">
        <div className="p-4 border-b border-[#2a2d3a]">
          <h2 className="text-white text-xl font-semibold">{symbol}</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading chart data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1a1d26]">
      {/* Chart Header */}
      <div className="p-4 border-b border-[#2a2d3a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white text-xl font-semibold">{symbol}</h2>
            <div className="text-gray-400 text-sm">
              Time: {formatTime()}
            </div>
          </div>
          {currentSymbolData && (
            <div className="flex items-center gap-6 text-sm">
              <span className="text-gray-400">
                Open: <span className="text-white">{formatPrice(currentSymbolData.open)}</span>
              </span>
              <span className="text-gray-400">
                High: <span className="text-white">{formatPrice(currentSymbolData.high)}</span>
              </span>
              <span className="text-gray-400">
                Low: <span className="text-white">{formatPrice(currentSymbolData.low)}</span>
              </span>
              <span className="text-gray-400">
                Close: <span className="text-white">{formatPrice(currentSymbolData.price)}</span>
              </span>
              <span className="text-gray-400">
                Volume: <span className="text-white">{currentSymbolData.volume}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 relative">
        <div ref={chartContainerRef} className="absolute inset-0" />

        {/* Current Price Indicator */}
        {currentSymbolData && (
          <div className="absolute top-4 right-4 bg-[#272f3f] border border-[#2a2d3a] rounded-lg p-3">
            <div className="text-right">
              <div className="text-white text-lg font-semibold">
                {formatPrice(currentSymbolData.price)}
              </div>
              <div className={`text-sm ${currentSymbolData.changePercent >= 0 ? "text-[#83bb06]" : "text-[#d32f2f]"}`}>
                {currentSymbolData.changePercent >= 0 ? "+" : ""}{currentSymbolData.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
