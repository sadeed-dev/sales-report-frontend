'use client'

import { agentData } from '@/lib/data'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function AgentTable() {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'totalCalls',
    direction: 'desc',
  })

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc',
    })
  }

  const sortedData = [...agentData].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof typeof a]
    const bValue = b[sortConfig.key as keyof typeof b]

    if (typeof aValue === 'string') {
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    }

    return sortConfig.direction === 'asc' ? (aValue as any) - (bValue as any) : (bValue as any) - (aValue as any)
  })

  const SortHeader = ({ label, sortKey }: { label: string; sortKey: string }) => (
    <th
      onClick={() => handleSort(sortKey)}
      className="px-6 py-4 text-left text-sm font-bold text-slate-900 bg-gradient-to-r from-slate-50 to-blue-50/30 cursor-pointer hover:bg-blue-50 transition-all"
    >
      <div className="flex items-center gap-2">
        {label}
        {sortConfig.key === sortKey && (
          sortConfig.direction === 'desc' ? <ChevronDown className="w-4 h-4 text-blue-600" /> : <ChevronUp className="w-4 h-4 text-blue-600" />
        )}
      </div>
    </th>
  )

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <SortHeader label="Sr #" sortKey="id" />
              <SortHeader label="Salesman" sortKey="name" />
              <SortHeader label="Mobile" sortKey="mobile" />
              <SortHeader label="Branch" sortKey="branch" />
              <SortHeader label="Total Calls" sortKey="totalCalls" />
              <SortHeader label="Connected" sortKey="connected" />
              <SortHeader label="Not Connected" sortKey="notConnected" />
              <SortHeader label="Total Talk Time" sortKey="talkTime" />
              <SortHeader label="Avg Talk Time" sortKey="avgTalkTime" />
            </tr>
          </thead>
          <tbody>
            {sortedData.map((agent, index) => (
              <tr
                key={agent.id}
                className={`border-b border-slate-100 transition-colors ${
                  index % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-white'
                }`}
              >
                <td className="px-6 py-4 text-sm text-slate-900 font-semibold">{agent.id}</td>
                <td className="px-6 py-4 text-sm text-slate-900 font-semibold">{agent.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{agent.mobile}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{agent.branch}</td>
                <td className="px-6 py-4 text-sm text-slate-900 font-bold">{agent.totalCalls}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {agent.connected}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                    {agent.notConnected}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-900 font-mono font-semibold">{agent.talkTime}</td>
                <td className="px-6 py-4 text-sm text-slate-900 font-mono font-semibold">{agent.avgTalkTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
