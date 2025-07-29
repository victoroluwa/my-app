"use client";

import { TopNavigation } from "@/components/TopNavigation";
import { LeftSidebar } from "@/components/LeftSidebar";
import { AssetList } from "@/components/AssetList";
import { TradingChart } from "@/components/TradingChart";
import { TradingPanel } from "@/components/TradingPanel";
import { WelcomeModal } from "@/components/WelcomeModal";
import { MarketDataProvider, useMarketData } from "@/contexts/MarketDataContext";
import { useState } from "react";

function TradingPlatformContent() {
  const { selectedSymbol, updateSymbol } = useMarketData();
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-[#16181e] text-white">
      {/* Top Navigation */}
      <TopNavigation />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Asset List Panel */}
        <AssetList
          selectedSymbol={selectedSymbol}
          onSymbolSelect={updateSymbol}
        />

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col">
          <TradingChart symbol={selectedSymbol} />
        </div>

        {/* Right Trading Panel */}
        <TradingPanel symbol={selectedSymbol} />
      </div>

      {/* Welcome Modal */}
      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}
    </div>
  );
}

export default function TradingPlatform() {
  return (
    <MarketDataProvider>
      <TradingPlatformContent />
    </MarketDataProvider>
  );
}
