"use client";

import { Button } from "@/components/ui/button";
import {
  Search,
  Settings,
  Camera,
  ChevronDown,
  DollarSign,
  CreditCard,
  Copy,
  LogIn,
  UserPlus
} from "lucide-react";
import { SettingsModal } from "@/components/SettingsModal";
import Image from "next/image";
import { useState } from "react";

const timeIntervals = ["1M", "5M", "15M", "30M", "1H", "1D"];

export function TopNavigation() {
  const [activeInterval, setActiveInterval] = useState("1M");
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <div className="h-14 bg-[#1a1d26] border-b border-[#2a2d3a] flex items-center px-4 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#83bb06] to-[#6fa005] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-white font-semibold hidden sm:block">Etorous</span>
        </div>

        {/* Product List & Submit Order */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-[#83bb06] text-white border-[#83bb06] hover:bg-[#6fa005] h-8 px-3 text-sm"
          >
            Product List
          </Button>
          <Button
            variant="outline"
            className="bg-[#83bb06] text-white border-[#83bb06] hover:bg-[#6fa005] h-8 px-3 text-sm"
          >
            Submit Order
          </Button>
        </div>

        {/* Time Intervals */}
        <div className="flex gap-1">
          {timeIntervals.map((interval) => (
            <Button
              key={interval}
              variant={activeInterval === interval ? "default" : "ghost"}
              className={`h-8 px-3 text-sm ${
                activeInterval === interval
                  ? "bg-[#83bb06] text-white hover:bg-[#6fa005]"
                  : "text-gray-300 hover:text-white hover:bg-[#2a2d3a]"
              }`}
              onClick={() => setActiveInterval(interval)}
            >
              {interval}
            </Button>
          ))}
        </div>

        {/* Indicator Button */}
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-white hover:bg-[#2a2d3a] h-8 px-3 text-sm"
        >
          Indicator
        </Button>

        <div className="flex-1" />

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Settings, Search, Camera, etc. */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettingsModal(true)}
            className="text-gray-300 hover:text-white hover:bg-[#2a2d3a] p-2"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#2a2d3a] p-2">
            <Camera className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#2a2d3a] p-2">
            <Search className="w-4 h-4" />
          </Button>

          {/* Additional Buttons */}
          <Button
            variant="outline"
            className="bg-transparent border-[#2a2d3a] text-gray-300 hover:text-white hover:bg-[#2a2d3a] h-8 px-3 text-sm"
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Loan
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-[#2a2d3a] text-gray-300 hover:text-white hover:bg-[#2a2d3a] h-8 px-3 text-sm"
          >
            <CreditCard className="w-4 h-4 mr-1" />
            Financial
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-[#2a2d3a] text-gray-300 hover:text-white hover:bg-[#2a2d3a] h-8 px-3 text-sm"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>

          {/* Language Selector */}
          <Button
            variant="outline"
            className="bg-transparent border-[#2a2d3a] text-gray-300 hover:text-white hover:bg-[#2a2d3a] h-8 px-3 text-sm"
          >
            English
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>

          {/* Login/Register */}
          <Button
            variant="outline"
            className="bg-transparent border-[#2a2d3a] text-gray-300 hover:text-white hover:bg-[#2a2d3a] h-8 px-3 text-sm"
          >
            <LogIn className="w-4 h-4 mr-1" />
            Login
          </Button>
          <Button
            variant="outline"
            className="bg-[#83bb06] text-white border-[#83bb06] hover:bg-[#6fa005] h-8 px-3 text-sm"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Register
          </Button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
}
