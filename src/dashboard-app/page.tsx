'use client'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { AgentTable } from '@/components/dashboard/AgentTable'
import { ChartsSection } from '@/components/dashboard/Charts'
import { Filters } from '@/components/dashboard/Filters'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { ModernMetricCard } from '@/components/dashboard/ModernMetricCard'
import { summaryMetrics } from '@/lib/dashboardData'

export default function Dashboard() {
  return (
    <DashboardLayout
      sidebar={<Sidebar activeMenu="dashboard" />}
    >
      {/* Filters Section */}
      {/* <Filters /> */}

      {/* Enhanced Summary Cards with Modern Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        <ModernMetricCard
          label="Total Calls"
          value={summaryMetrics.totalCalls}
          change={12.5}
          changeLabel="vs yesterday"
          icon="📞"
          gradient="from-blue-50 to-cyan-50"
        />
        <ModernMetricCard
          label="Connected Calls"
          value={summaryMetrics.connected}
          change={8.3}
          changeLabel="vs yesterday"
          icon="✓"
          gradient="from-emerald-50 to-teal-50"
        />
        <ModernMetricCard
          label="Not Connected"
          value={summaryMetrics.notConnected}
          change={-5.2}
          changeLabel="vs yesterday"
          icon="✕"
          gradient="from-rose-50 to-orange-50"
        />
        <ModernMetricCard
          label="Conversion Rate"
          value={summaryMetrics.conversionRate}
          change={4.1}
          changeLabel="improvement"
          icon="📈"
          gradient="from-purple-50 to-blue-50"
        />
      </div>

      {/* Charts Section */}
      <div className="mt-8">
        <ChartsSection />
      </div>

      {/* Agent Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Agent Performance</h2>
        <AgentTable />
      </div>
    </DashboardLayout>
  )
}
