'use client';

import { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import OverviewSection from './dashboard/OverviewSection';
import FinancialSection from './dashboard/FinancialSection';
import IncomeSection from './dashboard/IncomeSection';
import AssetsSection from './dashboard/AssetsSection';
import ReviewsSection from './dashboard/ReviewsSection';
import NewsSection from './dashboard/NewsSection';

// Placeholder components for other sections

function MarketSection() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Research</h2>
      <p className="text-gray-600">Market research content coming soon...</p>
    </div>
  );
}

export default function LifewayDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'financial':
        return <FinancialSection />;
      case 'income':
        return <IncomeSection />;
      case 'assets':
        return <AssetsSection />;
      case 'reviews':
        return <ReviewsSection />;
      case 'news':
        return <NewsSection />;
      case 'market':
        return <MarketSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000721] via-[#1e293b] to-[#334155] flex">
      {/* Sidebar */}
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}