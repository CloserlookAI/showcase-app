'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  DollarSign,
  Star,
  Newspaper,
  TrendingUp,
  Users,
  Globe,
  Home,
  Receipt,
  Wallet
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    icon: Home,
    description: 'Main dashboard with key metrics'
  },
  {
    id: 'financial',
    label: 'Financial Data',
    icon: DollarSign,
    description: 'Comprehensive financial analysis and metrics'
  },
  {
    id: 'income',
    label: 'Income Statement',
    icon: Receipt,
    description: 'Revenue, expenses, and profit analysis'
  },
  {
    id: 'assets',
    label: 'Balance Sheet',
    icon: Wallet,
    description: 'Assets, liabilities, and equity overview'
  },
  {
    id: 'revenue',
    label: 'Revenue Analytics',
    icon: TrendingUp,
    description: 'Revenue trends and analysis'
  },
  {
    id: 'reviews',
    label: 'Reviews & Ratings',
    icon: Star,
    description: 'Customer and employee reviews'
  },
  {
    id: 'news',
    label: 'News & Media',
    icon: Newspaper,
    description: 'Latest news and market intelligence'
  },
  {
    id: 'market',
    label: 'Market Research',
    icon: Globe,
    description: 'Industry trends and competitive analysis'
  }
];

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function DashboardSidebar({
  activeSection,
  onSectionChange,
  isCollapsed = false,
  onToggleCollapse
}: DashboardSidebarProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date().toLocaleTimeString());

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "bg-gray-800 border-r border-gray-700 h-screen transition-all duration-300 flex flex-col relative sticky top-0",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center w-full")}>
            <div className="w-8 h-8 bg-[#000721] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-white">Lifeway Foods</h2>
                <p className="text-xs text-gray-400">NASDAQ: LWAY</p>
              </div>
            )}
          </div>
          {onToggleCollapse && !isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-2"
              title="Collapse sidebar"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
          {onToggleCollapse && isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="absolute -right-3 top-4 p-1.5 bg-gray-700 border border-gray-600 hover:bg-gray-600 rounded-full transition-colors shadow-lg z-10"
              title="Expand sidebar"
            >
              <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out",
                isActive
                  ? "bg-[#000721] text-white shadow-sm border border-[#000721]/30"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                isCollapsed ? "justify-center px-2" : "space-x-3"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn(
                "flex-shrink-0 transition-all duration-300 ease-in-out",
                isActive ? "text-white" : "text-gray-400",
                isCollapsed ? "w-5 h-5" : "w-4 h-4"
              )} />
              <div className={cn(
                "text-left transition-all duration-300 ease-in-out overflow-hidden",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                <div className="font-medium whitespace-nowrap">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t border-gray-700 transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "h-0 opacity-0" : "h-auto opacity-100"
      )}>
        <div className="p-4">
          <div className="text-xs text-gray-400 text-center">
            <p className="whitespace-nowrap">
              Last updated: {mounted ? currentTime : '--:--:--'}
            </p>
            <p className="mt-1 whitespace-nowrap">Market data delayed 15 min</p>
          </div>
        </div>
      </div>
    </div>
  );
}