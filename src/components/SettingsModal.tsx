"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Monitor,
  Globe,
  TrendingUp,
  X
} from "lucide-react";
import { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("general");

  // General Settings
  const [language, setLanguage] = useState("english");
  const [timezone, setTimezone] = useState("utc");
  const [theme, setTheme] = useState("dark");

  // Trading Settings
  const [defaultLotSize, setDefaultLotSize] = useState(0.01);
  const [riskLevel, setRiskLevel] = useState([50]);
  const [autoClose, setAutoClose] = useState(false);
  const [confirmOrders, setConfirmOrders] = useState(true);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(false);

  // Display Settings
  const [showVolume, setShowVolume] = useState(true);
  const [chartType, setChartType] = useState("candlestick");
  const [gridLines, setGridLines] = useState(true);
  const [crosshair, setCrosshair] = useState(true);

  const handleSave = () => {
    // TODO: Implement settings save logic
    console.log('Settings saved:', {
      general: { language, timezone, theme },
      trading: { defaultLotSize, riskLevel: riskLevel[0], autoClose, confirmOrders },
      notifications: { emailNotifications, pushNotifications, priceAlerts, newsAlerts },
      display: { showVolume, chartType, gridLines, crosshair }
    });
    onClose();
  };

  const handleReset = () => {
    // Reset to defaults
    setLanguage("english");
    setTimezone("utc");
    setTheme("dark");
    setDefaultLotSize(0.01);
    setRiskLevel([50]);
    setAutoClose(false);
    setConfirmOrders(true);
    setEmailNotifications(true);
    setPushNotifications(true);
    setPriceAlerts(true);
    setNewsAlerts(false);
    setShowVolume(true);
    setChartType("candlestick");
    setGridLines(true);
    setCrosshair(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1d26] border-[#2a2d3a] text-white max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Settings Navigation */}
          <div className="w-64 border-r border-[#2a2d3a] pr-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                <TabsTrigger
                  value="general"
                  className="w-full justify-start data-[state=active]:bg-[#83bb06] data-[state=active]:text-white text-gray-300 hover:text-white"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="trading"
                  className="w-full justify-start data-[state=active]:bg-[#83bb06] data-[state=active]:text-white text-gray-300 hover:text-white"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trading
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="w-full justify-start data-[state=active]:bg-[#83bb06] data-[state=active]:text-white text-gray-300 hover:text-white"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="display"
                  className="w-full justify-start data-[state=active]:bg-[#83bb06] data-[state=active]:text-white text-gray-300 hover:text-white"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Display
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="w-full justify-start data-[state=active]:bg-[#83bb06] data-[state=active]:text-white text-gray-300 hover:text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="w-full justify-start data-[state=active]:bg-[#83bb06] data-[state=active]:text-white text-gray-300 hover:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Settings Content */}
          <div className="flex-1 pl-6 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-[#272f3f] border-[#2a2d3a] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#272f3f] border-[#2a2d3a]">
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Español</SelectItem>
                        <SelectItem value="french">Français</SelectItem>
                        <SelectItem value="german">Deutsch</SelectItem>
                        <SelectItem value="chinese">中文</SelectItem>
                        <SelectItem value="japanese">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="bg-[#272f3f] border-[#2a2d3a] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#272f3f] border-[#2a2d3a]">
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">EST</SelectItem>
                        <SelectItem value="pst">PST</SelectItem>
                        <SelectItem value="gmt">GMT</SelectItem>
                        <SelectItem value="jst">JST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="bg-[#272f3f] border-[#2a2d3a] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#272f3f] border-[#2a2d3a]">
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Trading Settings */}
              <TabsContent value="trading" className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Trading Settings</h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="defaultLotSize">Default Lot Size</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={defaultLotSize}
                        onChange={(e) => setDefaultLotSize(Number(e.target.value))}
                        className="bg-[#272f3f] border-[#2a2d3a] text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskLevel">Risk Level: {riskLevel[0]}%</Label>
                    <Slider
                      value={riskLevel}
                      onValueChange={setRiskLevel}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoClose">Auto-close positions at loss limit</Label>
                      <Switch
                        checked={autoClose}
                        onCheckedChange={setAutoClose}
                        className="data-[state=checked]:bg-[#83bb06]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="confirmOrders">Confirm orders before execution</Label>
                      <Switch
                        checked={confirmOrders}
                        onCheckedChange={setConfirmOrders}
                        className="data-[state=checked]:bg-[#83bb06]"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      className="data-[state=checked]:bg-[#83bb06]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                      className="data-[state=checked]:bg-[#83bb06]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="priceAlerts">Price Alerts</Label>
                    <Switch
                      checked={priceAlerts}
                      onCheckedChange={setPriceAlerts}
                      className="data-[state=checked]:bg-[#83bb06]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="newsAlerts">News Alerts</Label>
                    <Switch
                      checked={newsAlerts}
                      onCheckedChange={setNewsAlerts}
                      className="data-[state=checked]:bg-[#83bb06]"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Display Settings */}
              <TabsContent value="display" className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Display Settings</h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="chartType">Chart Type</Label>
                    <Select value={chartType} onValueChange={setChartType}>
                      <SelectTrigger className="bg-[#272f3f] border-[#2a2d3a] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#272f3f] border-[#2a2d3a]">
                        <SelectItem value="candlestick">Candlestick</SelectItem>
                        <SelectItem value="line">Line</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="area">Area</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showVolume">Show Volume</Label>
                      <Switch
                        checked={showVolume}
                        onCheckedChange={setShowVolume}
                        className="data-[state=checked]:bg-[#83bb06]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="gridLines">Grid Lines</Label>
                      <Switch
                        checked={gridLines}
                        onCheckedChange={setGridLines}
                        className="data-[state=checked]:bg-[#83bb06]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="crosshair">Crosshair</Label>
                      <Switch
                        checked={crosshair}
                        onCheckedChange={setCrosshair}
                        className="data-[state=checked]:bg-[#83bb06]"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Security Settings</h3>

                <div className="space-y-4">
                  <Button className="w-full bg-[#83bb06] hover:bg-[#6fa005] text-white">
                    Change Password
                  </Button>
                  <Button className="w-full bg-[#272f3f] hover:bg-[#2a2d3a] text-white border border-[#2a2d3a]">
                    Enable Two-Factor Authentication
                  </Button>
                  <Button className="w-full bg-[#272f3f] hover:bg-[#2a2d3a] text-white border border-[#2a2d3a]">
                    Manage API Keys
                  </Button>
                </div>
              </TabsContent>

              {/* Account Settings */}
              <TabsContent value="account" className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="bg-[#272f3f] border-[#2a2d3a] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="bg-[#272f3f] border-[#2a2d3a] text-white"
                    />
                  </div>

                  <Button className="w-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white">
                    Delete Account
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between pt-4 border-t border-[#2a2d3a]">
          <Button
            variant="outline"
            onClick={handleReset}
            className="bg-transparent border-[#2a2d3a] text-gray-300 hover:text-white hover:bg-[#2a2d3a]"
          >
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-[#2a2d3a] text-gray-300 hover:text-white hover:bg-[#2a2d3a]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#83bb06] hover:bg-[#6fa005] text-white"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
