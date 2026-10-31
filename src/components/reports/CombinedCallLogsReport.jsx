import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCombinedCallLogs } from '../../hooks/useCallLogs'
import reportAPI from '../../lib/api/reports'
import CallActivityTable from './CallActivityTable'
import { ChevronUp, ChevronDown, Loader2, SlidersHorizontal, FileSpreadsheet, Image, Layers } from 'lucide-react'

export default function CombinedCallLogsReport() {
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' })
  const [today] = useState(() => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10))
  const [params, setParams] = useState(() => ({ from_date: today, to_date: today }))
  const [fromDate, setFromDate] = useState(today)
  const [toDate, setToDate] = useState(today)
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [isExportingExcel, setIsExportingExcel] = useState(false)
  const [isExportingImage, setIsExportingImage] = useState(false)
const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isSalesmanInterest = params?.report === 'salesman-interest';
  const isCallActivity = selectedDepartment === 'call-activity'
  const [activityParams, setActivityParams] = useState(() => ({ from: today, to: today }))
  const activityQuery = useQuery({
    queryKey: ['call-activity-report', activityParams.from, activityParams.to],
    queryFn: () => reportAPI.getDailyPresentData({ from: activityParams.from, to: activityParams.to }),
    enabled: isCallActivity,
    retry: false,
  })
  const activityRows = activityQuery.data?.data?.summary || []
  const visibleActivityRows = activityParams.branch ? activityRows.filter((row) => row.branch === activityParams.branch) : activityRows


    const { data, isLoading, error } = useCombinedCallLogs(params, { enabled: !isCallActivity })
// Loader overlay when API is loading
const callLogs = (data?.data?.summary || []).map((row) => ({
  ...row,
  total_calls: Number(row.total_calls) || 0,
  total_interested: Number(row.total_interested) || 0,
  total_interested_pct: Number(row.total_interested_pct) || 0,
  connected_calls: Number(row.connected_calls) || 0,
  not_connected_calls: Number(row.not_connected_calls) || 0,
  dialshree_talk_time_sec: Number(row.dialshree_talk_time_sec ?? row.tata_talk_time_sec) || 0,
  vi_talk_time_sec: Number(row.vi_talk_time_sec) || 0,
  total_talk_time_sec: Number(row.total_talk_time_sec) || 0,
  avg_talk_time_sec: Number(row.avg_talk_time_sec) || 0,
  dialshree_talk_time: row.dialshree_talk_time || row.tata_talk_time || "00:00:00",
  vi_talk_time: row.vi_talk_time || "00:00:00",
  total_talk_time: row.total_talk_time || "00:00:00",
  avg_talk_time: row.avg_talk_time || "00:00:00",
}))

  const branches = ['all', ...new Set((isCallActivity ? activityRows : callLogs).map((row) => row.branch).filter(Boolean)), ...(isCallActivity && selectedBranch !== 'all' && !activityRows.some((row) => row.branch === selectedBranch) ? [selectedBranch] : [])]

  const filteredData =
    (params && params.branch) ? callLogs : (selectedBranch === 'all' ? callLogs : callLogs.filter((row) => row.branch === selectedBranch))

    const handleSort = (key) => {
      setSortConfig((prev) => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
      }))
    }

    const handleApplyFilters = () => {
      if (isCallActivity) {
        const today = new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10)
        const nextParams = { from: fromDate || today, to: toDate || today }
        if (nextParams.from > nextParams.to) return alert('From date must be on or before to date.')
        if (selectedBranch !== 'all') nextParams.branch = selectedBranch
        setActivityParams(nextParams)
        return
      }
      const newParams = {}
      if (fromDate) newParams.from_date = fromDate
      if (toDate) newParams.to_date = toDate
      if (selectedBranch && selectedBranch !== 'all') newParams.branch = selectedBranch
      if (selectedDepartment === 'salesman-interest') {
        newParams.report = 'salesman-interest'
        setSortConfig({ key: 'total_interested', direction: 'desc' })
      }
      else if (selectedDepartment !== 'all') newParams.department = selectedDepartment
      setParams(Object.keys(newParams).length > 0 ? newParams : undefined)
    }

    const exportCallActivity = async (format) => {
      const today = new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10)
      const from = fromDate || today
      const to = toDate || today
      if (from > to) {
        alert('From date must be on or before to date.')
        return
      }
      const setExporting = format === 'image' ? setIsExportingImage : setIsExportingExcel
      setExporting(true)
      try {
        const response = await reportAPI.getDailyPresentReport({ from, to, format, ...(selectedBranch !== 'all' ? { branch: selectedBranch } : {}) })
        const url = window.URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.download = `daily present.${format === 'xlsx' ? 'xlsx' : 'zip'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (err) {
        let message = 'Unable to export the call activity report. Please try again.'
        if (err.response?.data instanceof Blob) {
          try { message = JSON.parse(await err.response.data.text()).message || message } catch { /* Use fallback message. */ }
        }
        alert(message)
      } finally {
        setExporting(false)
      }
    }

    // /api/v1/reports/combined/call-logs
    const handleExportImage = async () => {
      if (isCallActivity) return exportCallActivity('image')
      setIsExportingImage(true)
      try {
        let url = `${apiUrl}/reports/combined/call-logs?format=image`
        if (selectedDepartment === 'salesman-interest') url += '&report=salesman-interest'
        else if (selectedDepartment !== 'all') url += `&department=${selectedDepartment}`
        if (fromDate) url += `&from_date=${fromDate}`
        if (toDate) url += `&to_date=${toDate}`
        if (selectedBranch && selectedBranch !== 'all') url += `&branch=${encodeURIComponent(selectedBranch)}`
        
        const response = await fetch(url, { method: 'POST' })

        if (!response.ok) {
          throw new Error('Export failed')
        }

        const blob = await response.blob()
        const url2 = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url2
        a.download = `${selectedDepartment === 'all' ? 'combined-call-logs' : `${selectedDepartment}-talktime`}-${new Date().toISOString().split('T')[0]}.zip`
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
      if (isCallActivity) return exportCallActivity('xlsx')
      setIsExportingExcel(true)
      try {
        let url = `${apiUrl}/reports/combined/call-logs?format=xlsx`
        if (selectedDepartment === 'salesman-interest') url += '&report=salesman-interest'
        else if (selectedDepartment !== 'all') url += `&department=${selectedDepartment}`
        if (fromDate) url += `&from_date=${fromDate}`
        if (toDate) url += `&to_date=${toDate}`
        if (selectedBranch && selectedBranch !== 'all') url += `&branch=${encodeURIComponent(selectedBranch)}`
        
        const response = await fetch(url, { method: 'POST' })

        if (!response.ok) {
          throw new Error('Excel export failed')
        }

        const blob = await response.blob()
        const url2 = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url2
        a.download = `${selectedDepartment === 'all' ? 'combined-call-logs' : `${selectedDepartment}-talktime`}-${new Date().toISOString().split('T')[0]}.xlsx`
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
      aria-sort={sortConfig.key === sortKey ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      className="report-sort-header"
    >
      <button type="button" onClick={() => handleSort(sortKey)} className="flex w-full items-center gap-2 text-left">
        {label}
        {sortConfig.key === sortKey && (
          sortConfig.direction === 'desc' ? (
            <ChevronDown className="w-4 h-4 text-blue-600" />
          ) : (
            <ChevronUp className="w-4 h-4 text-blue-600" />
          )
        )}
      </button>
    </th>
  )

  if (!isCallActivity && isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <span className="ml-3 text-gray-600">Loading combined call logs...</span>
      </div>
    )
  }

  if (!isCallActivity && error) {
    return (
      <div className="text-red-600 p-6">Error loading combined call logs: {error.message}</div>
    )
  }

  return (
    <div className="report-panel">
      <div className="report-toolbar">
        <div className="report-toolbar-title">
          <span className="report-icon"><Layers size={19} /></span>
          <div><h2>Call logs overview</h2><p>Choose a report and refine your view.</p></div>
        </div>
        <div className="report-export-actions" aria-label="Export report">
          <button type="button" onClick={handleExportExcel} disabled={isExportingExcel || isExportingImage} className="report-button report-button-secondary">
            {isExportingExcel ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
            {isExportingExcel ? 'Exporting...' : 'Export Excel'}
          </button>
          <button type="button" onClick={handleExportImage} disabled={isExportingExcel || isExportingImage} className="report-button report-button-secondary">
            {isExportingImage ? <Loader2 size={16} className="animate-spin" /> : <Image size={16} />}
            {isExportingImage ? 'Exporting...' : 'Export Image'}
          </button>
        </div>
      </div>
      <div className="report-filters">
        <div className="report-field report-type-field">
          <label htmlFor="talktime-department">Report type</label>
          <div className="report-select-wrap">
            <select id="talktime-department" value={selectedDepartment} onChange={(event) => {
              const value = event.target.value
              setSelectedDepartment(value)
              if (value === 'call-activity') {
                const today = new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10)
                const from = fromDate || today
                const to = toDate || today
                setFromDate(from)
                setToDate(to)
                setActivityParams({ from, to })
                setSelectedBranch('all')
              }
            }}>
              <option value="all">Combined Call Logs</option>
              <option value="call-activity">Call activity report</option>
              <option value="salesman-interest">Salesman Interested + 300 Sec Report</option>
              <option value="hr-operations">HR + Operations Talktime Reports</option>
              <option value="hr">HR Talktime Report</option>
              <option value="operations">Operations Talktime Report</option>
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
        </div>
        <div className="report-field">
          <label htmlFor="combined-from-date">From date</label>
          <input id="combined-from-date" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
        </div>
        <div className="report-field">
          <label htmlFor="combined-to-date">To date</label>
          <input id="combined-to-date" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
        </div>
        <div className="report-field">
          <label htmlFor="combined-branch">Branch</label>
          <div className="report-select-wrap">
            <select id="combined-branch" value={selectedBranch} onChange={(event) => setSelectedBranch(event.target.value)}>
              {branches.map((branch) => <option key={branch} value={branch}>{branch === 'all' ? 'All branches' : branch}</option>)}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
        </div>
        <button type="button" onClick={handleApplyFilters} className="report-button report-button-primary report-apply"><SlidersHorizontal size={16} />Apply filters</button>
      </div>
      {isCallActivity ? (
        <CallActivityTable rows={visibleActivityRows} isLoading={activityQuery.isFetching} error={activityQuery.error} warning={activityQuery.data?.data?.metadata?.warning} />
      ) : (
      <>
      <div className="report-results-heading">
        <div className="flex flex-wrap items-center gap-2"><h3>Report results</h3><span className="report-count">{sortedData.length} records</span></div>
        <p>Click a column heading to sort</p>
      </div>

      <div className="report-table-scroll" role="region" aria-label="Call activity results" tabIndex={0}>
{isSalesmanInterest ? (
          <table className="report-data-table">
            <thead><tr className="border-b border-slate-200">
              <SortHeader label="S.R." sortKey="sr_no" />
              <SortHeader label="Salesman" sortKey="user_name" />
              <SortHeader label="Total Calls" sortKey="total_calls" />
              <SortHeader label="Total Interested + 300 Sec" sortKey="total_interested" />
              <SortHeader label="Total Duration" sortKey="total_talk_time_sec" />
              <SortHeader label="Total Interested %" sortKey="total_interested_pct" />
              <SortHeader label="Source" sortKey="source" />
            </tr></thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr key={row.sr_no || index} className="border-b border-slate-100 odd:bg-white even:bg-slate-50/50">
                  {[row.sr_no, row.user_name, row.total_calls, row.total_interested,
                    row.total_talk_time, `${row.total_interested_pct.toFixed(2)}%`,
                    row.source || '-'].map((value, column) => (
                    <td key={column} className="px-6 py-4 text-sm text-slate-900">{value}</td>
                  ))}
                </tr>
              ))}
              {sortedData.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-slate-500">No calls found for these filters.</td></tr>}
            </tbody>
          </table>
        ) : (
<table className="report-data-table">
  <thead>
    <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30">
      <SortHeader label="S.R." sortKey="sr_no" />
      <SortHeader label="Name" sortKey="user_name" />
      <SortHeader label="Mobile" sortKey="phone_number" />
      <SortHeader label="Branch" sortKey="branch" />
      <SortHeader label="Total Calls" sortKey="total_calls" />
      <SortHeader label="Connected" sortKey="connected_calls" />
      <SortHeader label="Not Connected" sortKey="not_connected_calls" />
      <SortHeader label="Dialshree Dur." sortKey="dialshree_talk_time_sec" />
      <SortHeader label="VI Dur" sortKey="vi_talk_time_sec" />
      <SortHeader label="Total Dur" sortKey="total_talk_time_sec" />
      <SortHeader label="Avg Dur" sortKey="avg_talk_time" />
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
            {row.dialshree_talk_time || "00:00:00"}
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
    {sortedData.length === 0 && <tr><td colSpan={11} className="p-12 text-center text-sm text-slate-500">No calls found for these filters.</td></tr>}
  </tbody>
</table>
        )}
      </div>
      
      <div className="report-table-footer">
        <span>{sortedData.length} {sortedData.length === 1 ? 'record' : 'records'} shown</span>
        {!isSalesmanInterest && <span className="report-legend"><span aria-hidden="true" /> Highlighted rows: talk time under 1 hour</span>}
      </div>
      </>
      )}
    </div>
  )
}
