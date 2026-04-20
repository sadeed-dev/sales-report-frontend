'use client'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { ModernMetricCard } from '@/components/dashboard/ModernMetricCard'
import {
  analyticsMetrics,
  dailyCallData,
  dispositionAnalytics,
  conversionFunnelData,
  hourlyTrendData,
  callDistributionByBranch,
} from '@/lib/dashboardData'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Cell,
  PieChart,
  Pie,
} from 'recharts'
import { Download, TrendingUp } from 'lucide-react'



export default function AnalyticsPage() {
  const colors = ['#10b981', '#ef4444', '#f59e0b', '#6b7280']

  return (
    <DashboardLayout
      sidebar={<Sidebar activeMenu="analytics" />}
      header={<Header title="Reports & Analytics" description="Deep dive into call metrics, conversions, and performance analysis." />}
    >
      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        <ModernMetricCard
          label="Total Calls"
          value={analyticsMetrics.totalCallsToday}
          change={15.8}
          changeLabel="vs yesterday"
          icon="☎️"
          gradient="from-blue-50 to-cyan-50"
        />
        <ModernMetricCard
          label="Conversion Rate"
          value={`${analyticsMetrics.conversionRate}%`}
          change={3.2}
          changeLabel="improvement"
          icon="📈"
          gradient="from-emerald-50 to-teal-50"
        />
        <ModernMetricCard
          label="Interested Leads"
          value={analyticsMetrics.interestedLeads}
          change={12.5}
          changeLabel="increase"
          icon="👥"
          gradient="from-purple-50 to-blue-50"
        />
        <ModernMetricCard
          label="Avg Call Duration"
          value={analyticsMetrics.avgCallDuration}
          change={-2.1}
          changeLabel="vs avg"
          icon="⏱️"
          gradient="from-orange-50 to-rose-50"
        />
      </div>

      {/* Charts Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Call Trends */}
        <div className="chart-container">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Daily Call Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyCallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              <Line type="monotone" dataKey="connected" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              <Line type="monotone" dataKey="leads" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Call Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Hourly Call Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="calls" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Disposition Analysis */}
        <div className="chart-container">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Call Disposition</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dispositionAnalytics}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={100}
                dataKey="value"
              >
                {dispositionAnalytics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Branch Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Calls by Branch</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={callDistributionByBranch} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 11 }} width={150} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="mt-6 chart-container">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Conversion Funnel</h3>
        <ResponsiveContainer width="100%" height={350}>
          <FunnelChart data={conversionFunnelData}>
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} />
            <Funnel dataKey="value" data={conversionFunnelData}>
              {conversionFunnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Tables */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel Details */}
        <div className="card-premium">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Funnel Breakdown</h3>
          <div className="space-y-3">
            {conversionFunnelData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.stage}</p>
                  <p className="text-xs text-slate-500">{item.value.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <span className="text-sm font-bold text-slate-900 w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="card-premium">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Key Performance Indicators</h3>
          <div className="space-y-4">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-lg">
              <p className="text-sm text-slate-600">Peak Hour</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{analyticsMetrics.peakHour}</p>
              <p className="text-xs text-slate-500 mt-1">Highest call volume period</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-rose-50 to-rose-100/30 rounded-lg">
              <p className="text-sm text-slate-600">Abandonment Rate</p>
              <p className="text-2xl font-bold text-rose-900 mt-1">{analyticsMetrics.abandonmentRate}%</p>
              <p className="text-xs text-slate-500 mt-1">Calls not connected</p>
            </div>
          </div>

          {/* Export Button */}
          <button className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
