"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useSymbolData } from "@/contexts/MarketDataContext";

interface TradingPanelProps {
  symbol: string;
}

export function TradingPanel({ symbol }: TradingPanelProps) {
  const [lots, setLots] = useState(0.01);
  const [stopLoss, setStopLoss] = useState(0);
  const [takeProfit, setTakeProfit] = useState(0);
  const [stopLossEnabled, setStopLossEnabled] = useState(false);
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
  const [selectedTab, setSelectedTab] = useState("contract");

  const symbolData = useSymbolData(symbol);

  const incrementLots = () => setLots(prev => Math.min(prev + 0.01, 10));
  const decrementLots = () => setLots(prev => Math.max(prev - 0.01, 0.01));

  const currentPrice = symbolData?.price || 0;
  const estimatedMargin = lots * 20;
  const estimatedFee = 0.3;

  const formatPrice = (price: number) => {
    if (symbol.includes('JPY')) return price.toFixed(3);
    if (price > 1000) return price.toFixed(2);
    if (price > 1) return price.toFixed(4);
    return price.toFixed(6);
  };

  const handleBuyOrder = () => {
    // TODO: Implement buy order logic
    console.log('Buy order placed:', {
      symbol,
      lots,
      price: currentPrice,
      stopLoss: stopLossEnabled ? stopLoss : null,
      takeProfit: takeProfitEnabled ? takeProfit : null,
    });
  };

  const handleSellOrder = () => {
    // TODO: Implement sell order logic
    console.log('Sell order placed:', {
      symbol,
      lots,
      price: currentPrice,
      stopLoss: stopLossEnabled ? stopLoss : null,
      takeProfit: takeProfitEnabled ? takeProfit : null,
    });
  };

  return (
    <div className="w-80 bg-[#1a1d26] border-l border-[#2a2d3a] flex flex-col">
      {/* Account Info Card */}
      <div className="m-4 p-4 bg-gradient-to-br from-[#83bb06] to-[#6fa005] rounded-lg text-white">
        <div className="text-sm font-medium mb-1">UID:</div>
        <div className="text-sm mb-3">Available funds</div>
        <div className="text-3xl font-bold mb-2">$0</div>
        <div className="text-sm mb-3">Score:</div>
        <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">
          Today: 0 ▲ 0%
        </div>
      </div>

      {/* Contact Button */}
      <div className="px-4 mb-4">
        <Button className="w-full bg-[#83bb06] hover:bg-[#6fa005] text-white">
          Contract
        </Button>
      </div>

      {/* Trading Tabs */}
      <div className="px-4 mb-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#272f3f]">
            <TabsTrigger
              value="contract"
              className="data-[state=active]:bg-[#83bb06] data-[state=active]:text-white"
            >
              Contract
            </TabsTrigger>
            <TabsTrigger
              value="future"
              className="data-[state=active]:bg-[#83bb06] data-[state=active]:text-white"
            >
              Future
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Symbol Info */}
      <div className="px-4 mb-4">
        <div className="text-white text-lg font-semibold mb-2">{symbol}</div>
        <div className="text-[#83bb06] text-2xl font-bold">
          {symbolData ? formatPrice(currentPrice) : "Loading..."}
        </div>
        {symbolData && (
          <div className={`text-sm mt-1 ${symbolData.changePercent >= 0 ? "text-[#83bb06]" : "text-[#d32f2f]"}`}>
            {symbolData.changePercent >= 0 ? "+" : ""}{symbolData.changePercent.toFixed(2)}%
            ({symbolData.changePercent >= 0 ? "+" : ""}{symbolData.change.toFixed(symbolData.price > 100 ? 2 : 4)})
          </div>
        )}
      </div>

      {/* Market Price Selector */}
      <div className="px-4 mb-4">
        <Select defaultValue="market">
          <SelectTrigger className="w-full bg-[#272f3f] border-[#2a2d3a] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#272f3f] border-[#2a2d3a]">
            <SelectItem value="market">Market Price</SelectItem>
            <SelectItem value="limit">Limit Order</SelectItem>
            <SelectItem value="stop">Stop Order</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stop Loss */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white">Set Loss</span>
          <Switch
            checked={stopLossEnabled}
            onCheckedChange={setStopLossEnabled}
            className="data-[state=checked]:bg-[#83bb06]"
          />
        </div>
        <Input
          type="number"
          value={stopLoss}
          onChange={(e) => setStopLoss(Number(e.target.value))}
          disabled={!stopLossEnabled}
          className="bg-[#272f3f] border-[#2a2d3a] text-white disabled:opacity-50"
          placeholder="0"
        />
      </div>

      {/* Take Profit */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white">Set Profit</span>
          <Switch
            checked={takeProfitEnabled}
            onCheckedChange={setTakeProfitEnabled}
            className="data-[state=checked]:bg-[#83bb06]"
          />
        </div>
        <Input
          type="number"
          value={takeProfit}
          onChange={(e) => setTakeProfit(Number(e.target.value))}
          disabled={!takeProfitEnabled}
          className="bg-[#272f3f] border-[#2a2d3a] text-white disabled:opacity-50"
          placeholder="0"
        />
      </div>

      {/* Lots Control */}
      <div className="px-4 mb-4">
        <div className="text-white mb-2">Lots(Step:0.01)</div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={decrementLots}
            className="bg-transparent border-[#2a2d3a] text-white hover:bg-[#2a2d3a] p-2"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Input
            type="number"
            value={lots.toFixed(2)}
            onChange={(e) => setLots(Number(e.target.value))}
            step="0.01"
            min="0.01"
            className="flex-1 bg-[#272f3f] border-[#2a2d3a] text-white text-center"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={incrementLots}
            className="bg-transparent border-[#2a2d3a] text-white hover:bg-[#2a2d3a] p-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Trading Info */}
      <div className="px-4 mb-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-300">
          <span>Each Lots</span>
          <span className="text-white">1 Lots = 2000 {symbol}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Estimated Handling Fee</span>
          <span className="text-white">{estimatedFee}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Estimated Margin</span>
          <span className="text-white">{estimatedMargin}</span>
        </div>
        {symbolData && (
          <div className="flex justify-between text-gray-300">
            <span>Current Price</span>
            <span className="text-white">{formatPrice(currentPrice)}</span>
          </div>
        )}
      </div>

      {/* Buy/Sell Buttons */}
      <div className="px-4 mb-4 flex gap-2">
        <Button
          onClick={handleBuyOrder}
          disabled={!symbolData}
          className="flex-1 bg-[#83bb06] hover:bg-[#6fa005] text-white h-12 text-lg font-semibold disabled:opacity-50"
        >
          Buy
        </Button>
        <Button
          onClick={handleSellOrder}
          disabled={!symbolData}
          className="flex-1 bg-[#d32f2f] hover:bg-[#b71c1c] text-white h-12 text-lg font-semibold disabled:opacity-50"
        >
          Sell
        </Button>
      </div>

      {/* Additional Trading Tabs */}
      <div className="flex-1 px-4">
        <Tabs defaultValue="positions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#272f3f] text-xs">
            <TabsTrigger
              value="positions"
              className="data-[state=active]:bg-[#83bb06] data-[state=active]:text-white"
            >
              Position holding
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-[#83bb06] data-[state=active]:text-white"
            >
              Pending Orders
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#83bb06] data-[state=active]:text-white"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="mt-4">
            <div className="text-center text-gray-400 py-8">
              No positions
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <div className="text-center text-gray-400 py-8">
              No pending orders
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="text-center text-gray-400 py-8">
              No trading history
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
