import { useState } from 'react'
import { useCombinedCallLogs } from '../../hooks/useCallLogs'
import { ChevronUp, ChevronDown, Download, Loader2 } from 'lucide-react'

export default function CombinedCallLogsReport() {
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' })
  const [params, setParams] = useState(undefined)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [isExportingExcel, setIsExportingExcel] = useState(false)
  const [isExportingImage, setIsExportingImage] = useState(false)

    const { data, isLoading, error } = useCombinedCallLogs(params)
// Loader overlay when API is loading
const callLogs = (data?.data?.summary || []).map((row) => ({
  ...row,
  total_calls: Number(row.total_calls) || 0,
  connected_calls: Number(row.connected_calls) || 0,
  not_connected_calls: Number(row.not_connected_calls) || 0,
  tata_talk_time_sec: Number(row.tata_talk_time_sec) || 0,
  vi_talk_time_sec: Number(row.vi_talk_time_sec) || 0,
  total_talk_time_sec: Number(row.total_talk_time_sec) || 0,
  avg_talk_time_sec: Number(row.avg_talk_time_sec) || 0,
  tata_talk_time: row.tata_talk_time || "00:00:00",
  vi_talk_time: row.vi_talk_time || "00:00:00",
  total_talk_time: row.total_talk_time || "00:00:00",
  avg_talk_time: row.avg_talk_time || "00:00:00",
}))

  const branches = ['all', ...new Set(callLogs.map((row) => row.branch).filter(Boolean))]

  const filteredData =
    (params && params.branch) ? callLogs : (selectedBranch === 'all' ? callLogs : callLogs.filter((row) => row.branch === selectedBranch))

    const handleSort = (key) => {
      setSortConfig((prev) => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
      }))
    }

    const handleApplyFilters = () => {
      const newParams = {}
      if (fromDate) newParams.from_date = fromDate
      if (toDate) newParams.to_date = toDate
      if (selectedBranch && selectedBranch !== 'all') newParams.branch = selectedBranch
      setParams(Object.keys(newParams).length > 0 ? newParams : undefined)
    }

    // /api/v1/reports/combined/call-logs
    const handleExportImage = async () => {
      setIsExportingImage(true)
      try {
        let url = `http://localhost:3008/api/v1/reports/combined/call-logs?format=image`
        if (fromDate) url += `&from_date=${fromDate}`
        if (toDate) url += `&to_date=${toDate}`
        if (selectedBranch && selectedBranch !== 'all') url += `&branch=${selectedBranch}`
        
        const response = await fetch(url, { method: 'POST' })

        if (!response.ok) {
          throw new Error('Export failed')
        }

        const blob = await response.blob()
        const url2 = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url2
        a.download = `combined-call-logs-${new Date().toISOString().split('T')[0]}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url2)
        document.body.removeChild(a)
      } catch (err) {
        console.error('Export failed:', err)
        alert('Image export failed')
      } finally {
        setIsExportingImage(false)
      }
    }

    const handleExportExcel = async () => {
      setIsExportingExcel(true)
      try {
        let url = `http://localhost:3008/api/v1/reports/combined/call-logs?format=xlsx`
        if (fromDate) url += `&from_date=${fromDate}`
        if (toDate) url += `&to_date=${toDate}`
        if (selectedBranch && selectedBranch !== 'all') url += `&branch=${selectedBranch}`
        
        const response = await fetch(url, { method: 'POST' })

        if (!response.ok) {
          throw new Error('Excel export failed')
        }

        const blob = await response.blob()
        const url2 = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url2
        a.download = `combined-call-logs-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url2)
        document.body.removeChild(a)
      } catch (err) {
        console.error('Export failed:', err)
        alert('Excel export failed')
      } finally {
        setIsExportingExcel(false)
      }
    }

 const sortedData = [...filteredData].sort((a, b) => {
  const sortKey = sortConfig.key
  const aValue = a?.[sortKey]
  const bValue = b?.[sortKey]

  if (!isNaN(aValue) && !isNaN(bValue)) {
    return sortConfig.direction === 'asc'
      ? Number(aValue) - Number(bValue)
      : Number(bValue) - Number(aValue)
  }

  return sortConfig.direction === 'asc'
    ? String(aValue ?? '').localeCompare(String(bValue ?? ''))
    : String(bValue ?? '').localeCompare(String(aValue ?? ''))
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <span className="ml-3 text-gray-600">Loading combined call logs...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 p-6">Error loading combined call logs: {error.message}</div>
    )
  }

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
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Branch:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors">
            Apply Filters
          </button>
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel || isExportingImage}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
              isExportingExcel
                ? 'bg-green-400 text-white cursor-not-allowed opacity-75'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isExportingExcel ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Excel
              </>
            )}
          </button>
          <button
            onClick={handleExportImage}
            disabled={isExportingExcel || isExportingImage}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
              isExportingImage
                ? 'bg-emerald-400 text-white cursor-not-allowed opacity-75'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isExportingImage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Image
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
<table className="w-full">
  <thead>
    <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30">
      <SortHeader label="Sr #" sortKey="sr_no" />
      <SortHeader label="Salesman" sortKey="user_name" />
      <SortHeader label="Mobile" sortKey="phone_number" />
      <SortHeader label="Branch" sortKey="branch" />
      <SortHeader label="Total Calls" sortKey="total_calls" />
      <SortHeader label="Connected" sortKey="connected_calls" />
      <SortHeader label="Not Connected" sortKey="not_connected_calls" />
      <SortHeader label="Tata Talk Time" sortKey="tata_talk_time_sec" />
      <SortHeader label="VI Talk Time" sortKey="vi_talk_time_sec" />
      <SortHeader label="Total Talk Time" sortKey="total_talk_time_sec" />
      <SortHeader label="Avg Talk Time" sortKey="avg_talk_time" />
      {/* <SortHeader label="Talktime %" sortKey="talktimePercent" /> */}
    </tr>
  </thead>

  <tbody>
    {sortedData.map((row, index) => {
      const totalTalkTimeSec = Number(row.total_talk_time_sec) || 0;
      const isLowTalkTime = totalTalkTimeSec > 0 && totalTalkTimeSec < 3600; // Less than 1 hour and greater than 0
      return (
        <tr
          key={row.sr_no || index}
          className={`border-b border-slate-100 transition-colors ${
            isLowTalkTime
              ? 'bg-red-50 hover:bg-red-100'
              : index % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-white'
          }`}
        >
          <td className={`px-6 py-4 text-sm font-semibold ${isLowTalkTime ? 'text-red-900' : 'text-slate-900'}`}>
            {row.sr_no}
          </td>

          <td className={`px-6 py-4 text-sm font-semibold ${isLowTalkTime ? 'text-red-900' : 'text-slate-900'}`}>
            {row.user_name}
          </td>

          <td className={`px-6 py-4 text-sm ${isLowTalkTime ? 'text-red-700' : 'text-slate-600'}`}>
            {row.phone_number || '-'}
          </td>

          <td className={`px-6 py-4 text-sm ${isLowTalkTime ? 'text-red-700' : 'text-slate-600'}`}>
            {row.branch || '-'}
          </td>

          <td className={`px-6 py-4 text-sm font-bold ${isLowTalkTime ? 'text-red-900' : 'text-slate-900'}`}>
            {row.total_calls}
          </td>

          <td className="px-6 py-4 text-sm">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
              isLowTalkTime
                ? 'bg-red-100 text-red-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {row.connected_calls}
            </span>
          </td>

          <td className="px-6 py-4 text-sm">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
              isLowTalkTime
                ? 'bg-red-100 text-red-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {row.not_connected_calls}
            </span>
          </td>

          <td className={`px-6 py-4 text-sm font-mono font-semibold ${isLowTalkTime ? 'text-red-900' : 'text-slate-900'}`}>
            {row.tata_talk_time || "00:00:00"}
          </td>

          <td className={`px-6 py-4 text-sm font-mono font-semibold ${isLowTalkTime ? 'text-red-900' : 'text-slate-900'}`}>
            {row.vi_talk_time || "00:00:00"}
          </td>

          <td className={`px-6 py-4 text-sm font-mono font-semibold ${isLowTalkTime ? 'text-red-900 bg-red-100' : 'text-slate-900'}`}>
            {row.total_talk_time || "00:00:00"}
          </td>

          <td className={`px-6 py-4 text-sm font-mono font-semibold ${isLowTalkTime ? 'text-red-900' : 'text-slate-900'}`}>
            {row.avg_talk_time || "00:00:00"}
          </td>


        </tr>
      );
    })}
  </tbody>
</table>
      </div>
      
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <span className="text-sm text-slate-600">{sortedData.length} row(s) total.</span>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel || isExportingImage}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
              isExportingExcel
                ? 'bg-green-400 text-white cursor-not-allowed opacity-75'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isExportingExcel ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Excel
              </>
            )}
          </button>
          <button
            onClick={handleExportImage}
            disabled={isExportingExcel || isExportingImage}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
              isExportingImage
                ? 'bg-emerald-400 text-white cursor-not-allowed opacity-75'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isExportingImage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
