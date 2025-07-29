"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMarketData } from "@/contexts/MarketDataContext";
import Image from "next/image";

interface AssetListProps {
  selectedSymbol: string;
  onSymbolSelect: (symbol: string) => void;
}

const assetIcons: { [key: string]: string } = {
  'XAUUSD': "https://ext.same-assets.com/743133255/4091161672.png",
  'XAGUSD': "https://ext.same-assets.com/743133255/3537670328.png",
  'BTCUSD': "https://ext.same-assets.com/743133255/2167902497.png",
  'ETHUSD': "https://ext.same-assets.com/743133255/4203177872.png",
  'LTCUSD': "https://ext.same-assets.com/743133255/325457727.png",
  'USOIL': "https://ext.same-assets.com/743133255/315756830.png",
  'UKOIL': "https://ext.same-assets.com/743133255/4162414179.png",
  'EURUSD': "https://ext.same-assets.com/743133255/2921494186.png",
  'GBPUSD': "https://ext.same-assets.com/743133255/4162414179.png",
  'USDJPY': "https://ext.same-assets.com/743133255/3003598439.png",
  'AUDUSD': "https://ext.same-assets.com/743133255/4162414179.png",
  'USDCAD': "https://ext.same-assets.com/743133255/654470580.png",
  'EURGBP': "https://ext.same-assets.com/743133255/2921494186.png",
  'EURCHF': "https://ext.same-assets.com/743133255/2921494186.png",
  'NZDUSD': "https://ext.same-assets.com/743133255/4160476828.png",
};

const assetNames: { [key: string]: string } = {
  'XAUUSD': "Gold/USD",
  'XAGUSD': "Silver/USD",
  'BTCUSD': "Bitcoin/USD",
  'ETHUSD': "Ethereum/USD",
  'LTCUSD': "Litecoin/USD",
  'USOIL': "US Oil",
  'UKOIL': "UK Oil",
  'EURUSD': "EUR/USD",
  'GBPUSD': "GBP/USD",
  'USDJPY': "USD/JPY",
  'AUDUSD': "AUD/USD",
  'USDCAD': "USD/CAD",
  'EURGBP': "EUR/GBP",
  'EURCHF': "EUR/CHF",
  'NZDUSD': "NZD/USD",
};

export function AssetList({ selectedSymbol, onSymbolSelect }: AssetListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { marketData, isLoading, error, refreshData } = useMarketData();

  const filteredAssets = Object.values(marketData).filter(asset =>
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (assetNames[asset.symbol] || asset.symbol).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes('JPY')) return price.toFixed(3);
    if (price > 1000) return price.toFixed(2);
    if (price > 1) return price.toFixed(4);
    return price.toFixed(6);
  };

  if (error) {
    return (
      <div className="w-80 bg-[#1a1d26] border-r border-[#2a2d3a] flex flex-col items-center justify-center p-4">
        <p className="text-red-400 text-sm mb-4">Failed to load market data</p>
        <Button
          onClick={refreshData}
          className="bg-[#83bb06] hover:bg-[#6fa005] text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-[#1a1d26] border-r border-[#2a2d3a] flex flex-col">
      {/* Search Section */}
      <div className="p-4 border-b border-[#2a2d3a]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#272f3f] border-[#2a2d3a] text-white placeholder-gray-400 focus:border-[#83bb06]"
          />
        </div>

        <div className="mt-3">
          <Button
            variant="ghost"
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#2a2d3a] h-8"
          >
            Select
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading market data...</span>
          </div>
        </div>
      )}

      {/* Asset List */}
      {!isLoading && (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredAssets.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              No assets found
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <div
                key={asset.symbol}
                className={`flex items-center p-3 cursor-pointer transition-colors border-b border-[#2a2d3a] hover:bg-[#272f3f] ${
                  selectedSymbol === asset.symbol ? "bg-[#272f3f] border-l-2 border-l-[#83bb06]" : ""
                }`}
                onClick={() => onSymbolSelect(asset.symbol)}
              >
                {/* Asset Icon */}
                <div className="w-8 h-6 mr-3 flex items-center justify-center">
                  {assetIcons[asset.symbol] ? (
                    <Image
                      src={assetIcons[asset.symbol]}
                      alt={asset.symbol}
                      width={24}
                      height={16}
                      className="rounded"
                      onError={(e) => {
                        // Hide image if it fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-6 h-4 bg-[#83bb06] rounded text-xs flex items-center justify-center text-white">
                      {asset.symbol.slice(0, 2)}
                    </div>
                  )}
                </div>

                {/* Asset Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">{asset.symbol}</span>
                    <span className="text-white text-sm">
                      {formatPrice(asset.price, asset.symbol)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-400 text-xs truncate">
                      {assetNames[asset.symbol] || asset.symbol}
                    </span>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      asset.changePercent >= 0
                        ? "bg-[#83bb06] text-white"
                        : "bg-[#d32f2f] text-white"
                    }`}>
                      {asset.changePercent >= 0 ? "+" : ""}{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
