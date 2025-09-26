'use client';

import { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import OverviewSection from './dashboard/OverviewSection';
import AnalysisSection from './dashboard/AnalysisSection';
import FinancialSection from './dashboard/FinancialSection';
import IncomeSection from './dashboard/IncomeSection';
import AssetsSection from './dashboard/AssetsSection';
import NewsSection from './dashboard/NewsSection';
import MarketResearchSection from './dashboard/MarketResearchSection';
import CompetitorsSection from './dashboard/CompetitorsSection';

export default function LifewayDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'analysis':
        return <AnalysisSection />;
      case 'financial':
        return <FinancialSection />;
      case 'income':
        return <IncomeSection />;
      case 'assets':
        return <AssetsSection />;
      case 'news':
        return <NewsSection />;
      case 'market':
        return <MarketResearchSection />;
      case 'competitors':
        return <CompetitorsSection />;
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