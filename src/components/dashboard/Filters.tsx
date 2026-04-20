'use client'

import { Calendar, Filter, Search } from 'lucide-react'
import { useState } from 'react'

interface FilterProps {
  onDateChange?: (date: string) => void
  onAgentChange?: (agent: string) => void
  onSearchChange?: (search: string) => void
  searchValue?: string   // ✅ ADD THIS
}

export function Filters({
  onDateChange,
  onAgentChange,
  onSearchChange,
  searchValue,
}: FilterProps) {
  const [dateRange, setDateRange] = useState('Today')
  const [selectedAgent, setSelectedAgent] = useState('all')


  const branches = ['all', 'Jaipur Galaxy', 'Jaipur Signature', 'Mojika']

  return (
<div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-md border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* LEFT SIDE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full">

        {/* SEARCH */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full sm:w-72 focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="w-4 h-4 text-slate-500" />
     <input
  type="text"
  placeholder="Search name / mobile..."
  value={searchValue || ''}
  onChange={(e) => onSearchChange?.(e.target.value)}
  className="bg-transparent outline-none text-sm w-full"
/>
        </div>

        {/* DATE */}
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition cursor-pointer">
          <Calendar className="w-4 h-4 text-slate-600" />
          <input
            type="date"
            onChange={(e) => onDateChange?.(e.target.value)}
            className="bg-transparent text-sm outline-none"
          />
        </div>

        {/* BRANCH */}
        <select
          value={selectedAgent}
          onChange={(e) => {
            setSelectedAgent(e.target.value)
            onAgentChange?.(e.target.value)
          }}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Branches</option>
          {branches.slice(1).map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

      {/* BUTTON */}
      <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition">
        <Filter className="w-4 h-4" />
        Apply
      </button>
    </div>
  )
}