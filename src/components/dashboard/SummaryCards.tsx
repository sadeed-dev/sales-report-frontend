'use client'

import { summaryMetrics } from '@/lib/data'

export function SummaryCards() {
  const metrics = [
    { label: 'Total Calls', value: summaryMetrics.totalCalls, icon: '📞', accentColor: 'text-blue-600' },
    { label: 'Connected', value: summaryMetrics.connected, icon: '✓', accentColor: 'text-green-600' },
    { label: 'Not Connected', value: summaryMetrics.notConnected, icon: '✕', accentColor: 'text-red-600' },
    { label: 'Total Talk Time', value: summaryMetrics.totalTalkTime, icon: '⏱', accentColor: 'text-purple-600' },
    { label: 'Avg Talk Time', value: summaryMetrics.avgTalkTime, icon: '⌛', accentColor: 'text-orange-600' },
    { label: 'Interested Leads', value: summaryMetrics.interestedLeads, icon: '👤', accentColor: 'text-cyan-600' },
    { label: 'Conversion Rate', value: summaryMetrics.conversionRate, icon: '📈', accentColor: 'text-indigo-600' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="metric-card group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-3">{metric.label}</p>
              <p className="text-3xl font-bold text-slate-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">{metric.value}</p>
            </div>
            <span className="text-3xl opacity-60 group-hover:opacity-100 transition-opacity">{metric.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
