import { useState, useMemo } from 'react'
import { useVICallLogs } from '../../hooks/useCallLogs'
import { ChevronUp, ChevronDown, Download, Loader2 } from 'lucide-react'

export default function VICallLogsReport() {
  const [sortConfig, setSortConfig] = useState({ key: 'sr_no', direction: 'asc' })
  const [params, setParams] = useState(undefined)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [isExportingExcel, setIsExportingExcel] = useState(false)
  const [isExportingImage, setIsExportingImage] = useState(false)

  const { data, isLoading, error } = useVICallLogs(params)

  // ✅ FIXED: correct data mapping
  const callLogs = useMemo(() => {
    return data?.data?.summary || []
  }, [data])

  // ✅ SORT
  const sortedData = useMemo(() => {
    return [...callLogs].sort((a, b) => {
      const sortKey = sortConfig.key
      const aValue = a?.[sortKey] ?? ''
      const bValue = b?.[sortKey] ?? ''

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }

      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [callLogs, sortConfig])

  // ✅ FILTER
  const filteredData =
    (params && params.branch) ? sortedData : (selectedBranch === 'all' ? sortedData : sortedData.filter((row) => row.branch === selectedBranch))

  // ✅ BRANCH LIST
  const branches = [
    'all',
    ...new Set(callLogs.map((r) => r.branch).filter(Boolean)),
  ]

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

  // ✅ EXPORT (clean + React safe)
  const handleExportImage = async () => {
    setIsExportingImage(true)
    try {
      let url = `http://localhost:3008/api/v1/reports/vi/call-logs?format=image`
      if (fromDate) url += `&from_date=${fromDate}`
      if (toDate) url += `&to_date=${toDate}`
      if (selectedBranch && selectedBranch !== 'all') url += `&branch=${selectedBranch}`
      
      const response = await fetch(url)

      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const fileUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = fileUrl
      link.download = `vi-call-logs-${new Date().toISOString().split('T')[0]}.zip`
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(fileUrl)
    } catch (err) {
      console.error(err)
      alert('Image export failed')
    } finally {
      setIsExportingImage(false)
    }
  }

  const handleExportExcel = async () => {
    setIsExportingExcel(true)
    try {
      let url = `http://localhost:3008/api/v1/reports/vi/call-logs?format=xlsx`
      if (fromDate) url += `&from_date=${fromDate}`
      if (toDate) url += `&to_date=${toDate}`
      if (selectedBranch && selectedBranch !== 'all') url += `&branch=${selectedBranch}`

      const response = await fetch(url)

      if (!response.ok) throw new Error('Excel export failed')

      const blob = await response.blob()
      const fileUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = fileUrl
      link.download = `vi-call-logs-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(fileUrl)
    } catch (err) {
      console.error(err)
      alert('Excel export failed')
    } finally {
      setIsExportingExcel(false)
    }
  }

  const SortHeader = ({ label, sortKey }) => (
    <th
      onClick={() => handleSort(sortKey)}
      className="px-6 py-4 text-left text-sm font-bold cursor-pointer"
    >
      <div className="flex items-center gap-2">
        {label}
        {sortConfig.key === sortKey &&
          (sortConfig.direction === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          ))}
      </div>
    </th>
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error loading data</div>
  }

  return  (
  <div className="space-y-6">
    {/* STICKY HEADER & FILTERS */}
    <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm rounded-t-2xl p-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">VI Call Logs</h2>
          <p className="text-sm text-slate-500">
            Salesman-wise call performance
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            {branches.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Apply
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
    </div>

    {/* TABLE CARD */}
    <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          
          {/* HEADER */}
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 sticky top-0 z-10">
            <tr className="text-left text-slate-600 text-xs uppercase tracking-wider">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Salesman</th>
              <th className="px-6 py-4">Mobile</th>
              <th className="px-6 py-4">Branch</th>
              <th className="px-6 py-4 text-center">Total</th>
              <th className="px-6 py-4 text-center">Connected</th>
              <th className="px-6 py-4 text-center">Not Connected</th>
              <th className="px-6 py-4 text-center">Talk Time</th>
              <th className="px-6 py-4 text-center">Avg</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-slate-400">
                  No data found
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-blue-50/40 transition"
                >
                  {/* SR */}
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {row.sr_no}
                  </td>

                  {/* NAME */}
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {row.user_name}
                  </td>

                  {/* MOBILE */}
                  <td className="px-6 py-4 text-slate-600">
                    {row.phone_number}
                  </td>

                  {/* BRANCH */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                      {row.branch}
                    </span>
                  </td>

                  {/* TOTAL */}
                  <td className="px-6 py-4 text-center font-bold text-slate-900">
                    {row.total_calls}
                  </td>

                  {/* CONNECTED */}
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full">
                      {row.connected_calls}
                    </span>
                  </td>

                  {/* NOT CONNECTED */}
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 text-xs font-bold bg-rose-100 text-rose-700 rounded-full">
                      {row.not_connected_calls}
                    </span>
                  </td>

                  {/* TALK TIME */}
                  <td className="px-6 py-4 text-center font-mono text-slate-800">
                    {row.total_talk_time}
                  </td>

                  {/* AVG */}
                  <td className="px-6 py-4 text-center font-mono text-slate-800">
                    {row.avg_talk_time}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="px-6 py-3 bg-slate-50 text-sm text-slate-500 flex justify-between">
        <span>Total Rows: {filteredData.length}</span>
        <span>Updated just now</span>
      </div>
    </div>
  </div>
)
}