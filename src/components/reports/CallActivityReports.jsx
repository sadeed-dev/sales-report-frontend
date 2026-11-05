import { useEffect, useRef, useState } from 'react'
import { CalendarDays, FileText, Clock, Users, MapPin, Building2, Download, ChevronDown, Loader2 } from 'lucide-react'
import reportAPI from '../../lib/api/reports'
import { downloadReportZip, reportDownloadError } from '../../lib/reportDownload'

export default function CallActivityReports({ fromDate, toDate }) {
  const [error, setError] = useState(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportMenuRef = useRef(null)
  const [exporting, setExporting] = useState(false)
  const [exportingAbsentUsers, setExportingAbsentUsers] = useState(false)
  const [exportingAbsentUsersBranchwise, setExportingAbsentUsersBranchwise] = useState(false)
  const [exportingAbsentUsersDepartmentwise, setExportingAbsentUsersDepartmentwise] = useState(false)
  const [exportingDailyPresent, setExportingDailyPresent] = useState(null)


  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  async function exportLateArrivalImages() {
    setExporting(true)
    setError(null)
    try {
      const response = await reportAPI.getLateArrivalImages({ from: fromDate, to: toDate })
      await downloadReportZip(response, `late-users-${fromDate}-to-${toDate}.zip`)
    } catch (err) {
      setError(await reportDownloadError(err, 'Unable to export late arrival images. Please try again.'))
    } finally {
      setExporting(false)
    }
  }

  async function exportDailyPresentReport(format = 'image') {
    setExportingDailyPresent(format)
    setError(null)
    try {
      const response = await reportAPI.getDailyPresentReport({ from: fromDate, to: toDate, format })
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `daily present.${format === 'xlsx' ? 'xlsx' : 'zip'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      let message = 'Unable to export the daily present report. Please try again.'
      if (err.response?.data instanceof Blob) {
        try { message = JSON.parse(await err.response.data.text()).message || message } catch { /* Use fallback message. */ }
      }
      setError(message)
    } finally {
      setExportingDailyPresent(null)
    }
  }

  async function exportAbsentUsersAllBranches() {
    setExportingAbsentUsers(true)
    setError(null)
    try {
      const response = await reportAPI.getAbsentUsersImages({ from: fromDate, to: toDate })
      await downloadReportZip(response, `absent-users-all-branches-${fromDate}-to-${toDate}.zip`)
    } catch (err) {
      setError(await reportDownloadError(err, 'Unable to export absent users images. Please try again.'))
    } finally {
      setExportingAbsentUsers(false)
    }
  }

  async function exportAbsentUsersBranchwise() {
    setExportingAbsentUsersBranchwise(true)
    setError(null)
    try {
      const response = await reportAPI.getAbsentUsersBranchwiseImages({ from: fromDate, to: toDate })
      await downloadReportZip(response, `absent-users-branchwise-${fromDate}-to-${toDate}.zip`)
    } catch (err) {
      setError(await reportDownloadError(err, 'Unable to export branch-wise absent users images. Please try again.'))
    } finally {
      setExportingAbsentUsersBranchwise(false)
    }
  }

  async function exportAbsentUsersDepartmentwise() {
    setExportingAbsentUsersDepartmentwise(true)
    setError(null)
    try {
      const response = await reportAPI.getAbsentUsersDepartmentwiseImages({ from: fromDate, to: toDate })
      await downloadReportZip(response, `absent-users-departmentwise-${fromDate}-to-${toDate}.zip`)
    } catch (err) {
      setError(await reportDownloadError(err, 'Unable to export department-wise absent users images. Please try again.'))
    } finally {
      setExportingAbsentUsersDepartmentwise(false)
    }
  }



  const bulkExportOptions = [
    {
      key: 'daily-present',
      label: 'Daily Present Report',
      description: 'Branch images: arrival, designation and calls',
      icon: CalendarDays,
      tone: 'text-emerald-600 bg-emerald-50',
      onClick: () => exportDailyPresentReport('image'),
      loading: exportingDailyPresent === 'image',
    },
    {
      key: 'daily-present-excel',
      label: 'Daily Present (Excel)',
      description: 'Arrival times and Dialshree + VI calls',
      icon: FileText,
      tone: 'text-teal-600 bg-teal-50',
      onClick: () => exportDailyPresentReport('xlsx'),
      loading: exportingDailyPresent === 'xlsx',
    },
    {
      key: 'late',
      label: 'Late Arrivals',
      description: 'Photo pack of late check-ins',
      icon: Clock,
      tone: 'text-red-600 bg-red-50',
      onClick: exportLateArrivalImages,
      loading: exporting,
    },
    {
      key: 'absent',
      label: 'Absent Users',
      description: 'All branches, single pack',
      icon: Users,
      tone: 'text-orange-600 bg-orange-50',
      onClick: exportAbsentUsersAllBranches,
      loading: exportingAbsentUsers,
    },
    {
      key: 'absent-branch',
      label: 'Absent (Branch-wise)',
      description: 'Grouped by branch',
      icon: MapPin,
      tone: 'text-amber-600 bg-amber-50',
      onClick: exportAbsentUsersBranchwise,
      loading: exportingAbsentUsersBranchwise,
    },
    {
      key: 'absent-department',
      label: 'Absent (Department-wise)',
      description: 'Grouped by department',
      icon: Building2,
      tone: 'text-yellow-600 bg-yellow-50',
      onClick: exportAbsentUsersDepartmentwise,
      loading: exportingAbsentUsersDepartmentwise,
    },
  ]

  const isBulkExporting = exporting || exportingAbsentUsers || exportingAbsentUsersBranchwise || exportingAbsentUsersDepartmentwise || Boolean(exportingDailyPresent)


  return (
    <>
        <div className="relative" ref={exportMenuRef} onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setShowExportMenu(false)
            exportMenuRef.current?.querySelector('button')?.focus()
          }
        }}>
          <button type="button" onClick={() => setShowExportMenu((open) => !open)} disabled={isBulkExporting || !fromDate || !toDate || fromDate > toDate} aria-expanded={showExportMenu} aria-controls="activity-report-downloads" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
            {isBulkExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isBulkExporting ? 'Exporting...' : 'Bulk Exports'}
            <ChevronDown size={15} className={showExportMenu ? 'rotate-180' : ''} />
          </button>
          {showExportMenu && (
            <div id="activity-report-downloads" className="absolute right-0 z-30 mt-2 max-h-[60vh] w-80 max-w-[calc(100vw-4rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
              <div className="border-b border-slate-100 px-4 py-3"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Image Packs</p></div>
              {bulkExportOptions.filter((option) => option.key !== 'daily-present' && option.key !== 'daily-present-excel').map((option) => {
                const Icon = option.icon
                return (
                  <button type="button" key={option.key} onClick={() => { option.onClick(); setShowExportMenu(false) }} disabled={isBulkExporting} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 disabled:opacity-50">
                    <span className={'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ' + option.tone}><Icon size={16} /></span>
                    <span className="min-w-0"><span className="block text-sm font-semibold text-slate-800">{option.label}</span><span className="block text-xs leading-relaxed text-slate-400">{option.description}</span></span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
    </>
  )
}
