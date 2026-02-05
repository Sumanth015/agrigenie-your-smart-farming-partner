import { useState } from 'react';
import { 
  Home, Leaf, MessageSquare, Camera, Bell, Settings, Menu, X, 
  Droplets, TrendingUp, WifiOff, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount: number;
}

export function BottomNav({ activeTab, onTabChange, notificationCount }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'recommendations', icon: Leaf, label: 'Crops' },
    { id: 'chat', icon: MessageSquare, label: 'Assistant' },
    { id: 'disease', icon: Camera, label: 'Scan' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center h-full px-4 transition-colors ${
              activeTab === tab.id 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'scale-110' : ''} transition-transform`} />
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

interface SideNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function SideNav({ activeTab, onTabChange, notificationCount, isOpen, onClose }: SideNavProps) {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'recommendations', icon: Leaf, label: 'Crop Recommendations' },
    { id: 'chat', icon: MessageSquare, label: 'AI Assistant' },
    { id: 'disease', icon: Camera, label: 'Disease Detection' },
    { id: 'sustainability', icon: Droplets, label: 'Sustainability' },
    { id: 'market', icon: TrendingUp, label: 'Market Insights' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">AgriGenie</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-full hover:bg-sidebar-accent flex items-center justify-center"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Offline Status */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 rounded-xl bg-sidebar-accent/50 flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-sidebar-foreground/70" />
            <span className="text-xs text-sidebar-foreground/70">Last synced: Just now</span>
            <RefreshCw className="w-4 h-4 text-sidebar-foreground/70 ml-auto cursor-pointer hover:rotate-180 transition-transform duration-500" />
          </div>
        </div>
      </aside>
    </>
  );
}

interface TopBarProps {
  onMenuClick: () => void;
  onNotificationClick: () => void;
  notificationCount: number;
}

export function TopBar({ onMenuClick, onNotificationClick, notificationCount }: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-background/80 backdrop-blur-lg border-b border-border z-30">
      <div className="h-full flex items-center justify-between px-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        <div className="flex-1 lg:flex-none">
          <h1 className="text-lg font-semibold text-foreground text-center lg:text-left">
            Welcome, Farmer! 🌾
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onNotificationClick}
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
