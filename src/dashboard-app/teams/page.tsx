'use client'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { ModernMetricCard } from '@/components/dashboard/ModernMetricCard'
import { TeamCard } from '@/components/dashboard/TeamCard'
import { teamsData, summaryMetrics } from '@/lib/dashboardData'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function TeamsPerformance() {
  const teamComparisonData = [
    { name: 'Jaipur Galaxy', calls: 1350, connected: 467, leads: 245 },
    { name: 'Jaipur Signature', calls: 134, connected: 58, leads: 32 },
    { name: 'Mojika', calls: 64, connected: 35, leads: 10 },
  ]

  const teamTrendData = [
    { day: 'Mon', 'Jaipur Galaxy': 92, 'Jaipur Signature': 85, Mojika: 88 },
    { day: 'Tue', 'Jaipur Galaxy': 94, 'Jaipur Signature': 87, Mojika: 91 },
    { day: 'Wed', 'Jaipur Galaxy': 91, 'Jaipur Signature': 86, Mojika: 89 },
    { day: 'Thu', 'Jaipur Galaxy': 95, 'Jaipur Signature': 89, Mojika: 93 },
    { day: 'Fri', 'Jaipur Galaxy': 93, 'Jaipur Signature': 88, Mojika: 92 },
    { day: 'Sat', 'Jaipur Galaxy': 96, 'Jaipur Signature': 90, Mojika: 95 },
  ]

  const teamDistributionData = [
    { name: 'Jaipur Galaxy', value: 1350, color: '#3b82f6' },
    { name: 'Jaipur Signature', value: 134, color: '#8b5cf6' },
    { name: 'Mojika', value: 64, color: '#ec4899' },
  ]

  return (
    <DashboardLayout
      sidebar={<Sidebar activeMenu="teams" />}
      header={<Header title="Teams Performance" description="Comprehensive team analytics and performance metrics." />}
    >
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        <ModernMetricCard
          label="Active Teams"
          value={3}
          change={0}
          icon="👥"
          gradient="from-blue-50 to-cyan-50"
        />
        <ModernMetricCard
          label="Total Members"
          value={9}
          change={12.5}
          changeLabel="vs last week"
          icon="👨‍💼"
          gradient="from-purple-50 to-blue-50"
        />
        <ModernMetricCard
          label="Avg Team Performance"
          value="91.7%"
          change={5.2}
          changeLabel="improvement"
          icon="📊"
          gradient="from-emerald-50 to-teal-50"
        />
        <ModernMetricCard
          label="Total Calls Today"
          value={summaryMetrics.totalCalls}
          change={8.3}
          changeLabel="vs yesterday"
          icon="📞"
          gradient="from-orange-50 to-rose-50"
        />
      </div>

      {/* Teams Grid */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Team Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {teamsData.map((team) => (
            <TeamCard
              key={team.id}
              name={team.name}
              members={team.members}
              totalCalls={team.totalCalls}
              connected={team.connected}
              conversionRate={team.conversionRate}
              performance={team.performance}
              trend={team.trend}
            />
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Comparison Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Team Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="calls" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="connected" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="leads" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Call Distribution Pie */}
        <div className="chart-container">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Call Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={teamDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                dataKey="value"
              >
                {teamDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Team Performance Trend */}
        <div className="chart-container lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={teamTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="Jaipur Galaxy" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              <Line type="monotone" dataKey="Jaipur Signature" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              <Line type="monotone" dataKey="Mojika" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  )
}
