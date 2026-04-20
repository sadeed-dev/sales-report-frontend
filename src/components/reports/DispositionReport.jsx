import { useState } from 'react'
import { dispositionData } from '../../lib/data'
import { ChevronUp, ChevronDown, Download } from 'lucide-react'

export default function DispositionReport() {
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' })
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleApplyFilters = () => {
    // Filter logic can be added here if backend filtering is needed
    console.log('Filters applied:', { fromDate, toDate })
  }

  const sortedData = [...dispositionData].sort((a, b) => {
    const aValue = a[sortConfig.key] || ''
    const bValue = b[sortConfig.key] || ''

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
    }

    return sortConfig.direction === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })

  const SortHeader = ({ label, sortKey }) => (
    <th
      onClick={() => handleSort(sortKey)}
      className="px-6 py-4 text-left text-sm font-bold text-slate-900 bg-gradient-to-r from-slate-50 to-blue-50/30 cursor-pointer hover:bg-blue-50 transition-all"
    >
      <div className="flex items-center gap-2">
        {label}
        {sortConfig.key === sortKey && (
          sortConfig.direction === 'desc' ? (
            <ChevronDown className="w-4 h-4 text-blue-600" />
          ) : (
            <ChevronUp className="w-4 h-4 text-blue-600" />
          )
        )}
      </div>
    </th>
  )

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-20 px-6 py-4 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30">
              <SortHeader label="Sr #" sortKey="id" />
              <SortHeader label="Salesman" sortKey="salesman" />
              <SortHeader label="Mobile" sortKey="mobile" />
              <SortHeader label="Interested" sortKey="interested" />
              <SortHeader label="Not Interested" sortKey="notInterested" />
              <SortHeader label="Callback Required" sortKey="callbackRequired" />
              <SortHeader label="Call Failed" sortKey="callFailed" />
              <SortHeader label="No Response" sortKey="noResponse" />
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-slate-100 transition-colors ${
                  index % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-white'
                }`}
              >
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.salesman}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{row.mobile}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {row.interested}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                    {row.notInterested}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {row.callbackRequired}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                    {row.callFailed}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {row.noResponse}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <span className="text-sm text-slate-600">{sortedData.length} row(s) total.</span>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors">
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>
    </div>
  )
}
