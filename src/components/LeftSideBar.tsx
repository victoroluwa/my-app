"use client";

import { Button } from "@/components/ui/button";
import {
  Search,
  BarChart3,
  Clock,
  Play,
  Settings,
  TrendingUp,
  Mail,
  PenTool,
  Lock,
  Eye,
  Trash2
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { icon: Search, label: "Search", id: "search" },
  { icon: BarChart3, label: "Charts", id: "charts", active: true },
  { icon: Clock, label: "Watchlist", id: "watchlist" },
  { icon: Play, label: "Playback", id: "playback" },
  { icon: Settings, label: "Settings", id: "settings" },
  { icon: TrendingUp, label: "Indicators", id: "indicators" },
  { icon: Mail, label: "Messages", id: "messages" },
  { icon: PenTool, label: "Drawing", id: "drawing" },
  { icon: Lock, label: "Account", id: "account" },
  { icon: Eye, label: "View", id: "view" },
  { icon: Trash2, label: "Clear", id: "clear" },
];

export function LeftSidebar() {
  const [activeItem, setActiveItem] = useState("charts");

  return (
    <div className="w-14 bg-gradient-to-b from-[#1a1d26] to-[#16181e] border-r border-[#2a2d3a] flex flex-col items-center py-4 gap-2">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;

        return (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`w-10 h-10 p-0 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-[#83bb06] text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-[#2a2d3a]"
            }`}
            onClick={() => setActiveItem(item.id)}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        );
      })}
    </div>
  );
}
