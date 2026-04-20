'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { TataCallLogsReport } from '@/components/reports/TataCallLogsReport'
import { VICallLogsReport } from '@/components/reports/VICallLogsReport'
import { CombinedCallLogsReport } from '@/components/reports/CombinedCallLogsReport'
import { DispositionReport } from '@/components/reports/DispositionReport'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('tata')

  const tabs = [
    { id: 'tata', label: 'Tata Call Logs', icon: '📊' },
    { id: 'vi', label: 'VI Call Logs', icon: '📱' },
    { id: 'combined', label: 'Combined Call Logs', icon: '📈' },
    { id: 'disposition', label: 'Agent Wise Disposition', icon: '👥' },
  ]

  return (
    <DashboardLayout
      sidebar={<Sidebar activeMenu="reports" />}
    >
      {/* Premium Tab Navigation */}
      <div className="mb-8">
        <div className="flex gap-3 overflow-x-auto pb-4 px-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap font-semibold transition-all duration-300 text-sm flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'tata' && <TataCallLogsReport />}
        {activeTab === 'vi' && <VICallLogsReport />}
        {activeTab === 'combined' && <CombinedCallLogsReport />}
        {activeTab === 'disposition' && <DispositionReport />}
      </div>
    </DashboardLayout>
  )
}
