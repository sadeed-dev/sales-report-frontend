import { useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import {
  Phone,
  Users,
  Timer,
  Target,
  Trophy,
  Star,
  Calendar,
  BarChart3,
  ThumbsUp,
  PhoneCall,
  PhoneOff,
  AlertTriangle,
  Settings,
  Loader2,
  Download,
} from 'lucide-react'
import { useLeadListDispositionReport } from '../../hooks/useLeadListDispositionReport'
import { formatNumber, formatPercent } from '../../lib/reportFormat'
import LeadListDispositionExportTable from './LeadListDispositionExportTable'

const CATEGORY_STYLES = {
  positive_engagement: { icon: ThumbsUp, badge: 'bg-blue-100 text-blue-600', tint: 'bg-blue-50/50' },
  followup: { icon: PhoneCall, badge: 'bg-teal-100 text-teal-600', tint: 'bg-teal-50/40' },
  unsuccessful_contact: { icon: PhoneOff, badge: 'bg-slate-200 text-slate-600', tint: 'bg-white' },
  negative_qualification: { icon: AlertTriangle, badge: 'bg-rose-100 text-rose-600', tint: 'bg-rose-50/40' },
  pending_system: { icon: Settings, badge: 'bg-violet-100 text-violet-600', tint: 'bg-violet-50/40' },
}

const CATEGORY_LABEL_COL = 'w-48 min-w-[12rem]'
const ROW_LABEL_COL = 'w-40 min-w-[10rem] left-48'

export default function LeadListDispositionReport() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [params, setParams] = useState(undefined)
  const [isExporting, setIsExporting] = useState(false)
  const exportRef = useRef(null)

  const { data, isLoading, isFetching, error } = useLeadListDispositionReport(params)

  const handleApply = () => {
    const next = {}
    if (fromDate) next.from_date = fromDate
    if (toDate) next.to_date = toDate
    setParams(Object.keys(next).length ? next : undefined)
  }

  const meta = data?.meta
  const report = data?.data

  const handleDownloadImage = async () => {
    const node = exportRef.current
    if (!node || isExporting) return

    setIsExporting(true)
    try {
      // Let the off-screen export table finish laying out before capture.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
      })

      const link = document.createElement('a')
      link.download = `lead-list-disposition-report-${meta?.to_date || 'report'}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Report image export failed:', err)
      alert('Failed to generate the report image. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const snapshotLabel = useMemo(() => {
    if (!meta?.to_date) return '—'
    const d = new Date(`${meta.to_date}T00:00:00`)
    if (isNaN(d.getTime())) return meta.to_date
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }, [meta?.to_date])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-3 text-slate-600">Loading lead list report...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600 p-6">Error loading report: {error.message}</div>
  }

  const leadLists = report?.lead_lists || []
  const categories = report?.categories || []
  const grandTotalRow = report?.grand_total_row
  const summary = report?.summary
  const topLists = report?.top_performing_lists || []
  const highlights = report?.highlights || {}
  const hasData = leadLists.length > 0

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleApply}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Apply
        </button>
        {isFetching && !isLoading && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}

        <button
          onClick={handleDownloadImage}
          disabled={isExporting || !hasData}
          className="ml-auto flex items-center gap-2 px-4 py-1.5 bg-[#0a1230] hover:bg-[#141f4a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Report
            </>
          )}
        </button>
      </div>

      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1230] via-[#101c46] to-[#0a1230] px-6 py-7 md:px-10 md:py-8 shadow-xl">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-40">
          <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="none">
            <path d="M -20 190 C 140 190 190 15 420 15" fill="none" stroke="#d4af6a" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg shadow-amber-500/30">
              <BarChart3 className="h-7 w-7 text-[#0a1230]" strokeWidth={2.5} />
            </div>
            <div>
              <h1
                className="text-2xl md:text-[1.75rem] font-bold text-white tracking-tight"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Lead List Performance &amp; Disposition Report
              </h1>
              <p className="mt-1 text-sm md:text-base text-amber-300/90 font-medium">
                Campaign-wise engagement, disposition and conversion overview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl border border-amber-400/30 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
            <Calendar className="h-4 w-4 text-amber-300" />
            <div className="text-xs leading-tight">
              <div className="text-slate-300">Updated Snapshot</div>
              <div className="font-semibold text-white">{snapshotLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard icon={Phone} label="Total Calls" value={formatNumber(summary?.total_calls)} />
        <StatCard icon={Users} label="Interested" value={formatNumber(summary?.interested)} />
        <StatCard icon={Timer} label="300 Sec+" value={formatNumber(summary?.sec_300_plus)} />
        <StatCard icon={Target} label="Total Interested" value={formatNumber(summary?.total_interested)} />
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 flex flex-col justify-center">
          <span className="text-xs font-semibold text-blue-700">Overall Conversion</span>
          <span className="mt-1 text-2xl font-bold text-blue-700">
            {formatPercent(summary?.overall_conversion_pct)}
          </span>
        </div>
      </div>

      {!hasData ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          No lead lists met the minimum call threshold for the selected date range.
        </div>
      ) : (
        <>
          {/* Top performers */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Top Performing Lead Lists{' '}
                <span className="font-normal text-slate-500">by Total Interested %</span>
              </h2>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-stretch gap-6">
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {topLists.map((l, i) => (
                  <div key={l.list_name} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0a1230] text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 leading-snug">
                        {l.list_name}
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatPercent(l.total_interested_pct)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block w-px bg-slate-200" />

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-72">
                <HighlightCard
                  icon={Trophy}
                  label="Highest Volume"
                  name={highlights.highest_volume?.list_name}
                  value={formatNumber(highlights.highest_volume?.grand_total)}
                />
                <HighlightCard
                  icon={Star}
                  label="Highest Total Interested"
                  name={highlights.highest_total_interested?.list_name}
                  value={formatNumber(highlights.highest_total_interested?.total_interested)}
                />
              </div>
            </div>
          </div>

          {/* Disposition table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 md:px-6 py-4 border-b border-slate-200">
              <BarChart3 className="h-5 w-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Disposition Breakdown by Lead List</h2>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#0a1230] text-white">
                    <th
                      colSpan={2}
                      className="sticky left-0 z-20 bg-[#0a1230] px-4 py-3 text-left font-semibold whitespace-nowrap"
                      style={{ width: '22rem', minWidth: '22rem' }}
                    >
                      Disposition Category
                    </th>
                    {leadLists.map((name) => (
                      <th key={name} className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                        {name}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right font-semibold whitespace-nowrap bg-[#0a1230]">
                      Grand Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <CategoryBlock key={cat.key} category={cat} leadLists={leadLists} />
                  ))}

                  {grandTotalRow && (
                    <tr className="bg-[#0a1230] text-white font-bold">
                      <td
                        className={`sticky left-0 z-20 bg-[#0a1230] px-4 py-3 whitespace-nowrap ${CATEGORY_LABEL_COL}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                            <BarChart3 className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-bold">F. Overall Volume</span>
                        </div>
                      </td>
                      <td className={`sticky z-20 bg-[#0a1230] px-4 py-3 text-xs font-bold whitespace-nowrap ${ROW_LABEL_COL}`}>
                        Grand Total
                      </td>
                      {leadLists.map((name) => (
                        <td key={name} className="px-4 py-3 text-right whitespace-nowrap">
                          {formatNumber(grandTotalRow.values[name])}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {formatNumber(grandTotalRow.grand_total)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Off-screen premium export table — this is what "Download Report" captures */}
      <div style={{ height: 0, overflow: 'hidden' }} aria-hidden="true">
        <LeadListDispositionExportTable ref={exportRef} report={report} meta={meta} />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-3 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-medium text-slate-500">{label}</div>
        <div className="text-xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  )
}

function HighlightCard({ icon: Icon, label, name, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#0a1230] px-4 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-amber-400">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-medium text-slate-300">{label}</div>
        <div className="text-sm font-bold text-white truncate">{name || '—'}</div>
        <div className="text-xs font-semibold text-amber-300">{value}</div>
      </div>
    </div>
  )
}

function CategoryBlock({ category, leadLists }) {
  const style = CATEGORY_STYLES[category.key] || {}
  const Icon = style.icon || BarChart3
  const rows = category.rows

  return (
    <>
      {rows.map((row, idx) => (
        <tr key={row.key} className={`border-b border-slate-100 ${style.tint || ''}`}>
          {idx === 0 && (
            <td
              rowSpan={rows.length}
              className={`sticky left-0 z-10 align-top px-4 py-1 border-r border-slate-200 ${style.tint || 'bg-white'} ${CATEGORY_LABEL_COL}`}
            >
              <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${style.badge}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-700 leading-tight">{category.label}</span>
              </div>
            </td>
          )}
          <td
            className={`sticky z-10 px-4 py-2.5 border-r border-slate-200 whitespace-nowrap ${style.tint || 'bg-white'} ${ROW_LABEL_COL} ${
              row.key === 'totalInterested' || row.key === 'totalInterestedPct'
                ? 'font-bold text-slate-900'
                : 'font-medium text-slate-600'
            }`}
          >
            {row.label}
          </td>
          {leadLists.map((name) => (
            <td key={name} className="px-4 py-1.5 text-right whitespace-nowrap">
              <CellValue row={row} value={row.values[name]} />
            </td>
          ))}
          <td className="px-4 py-1.5 text-right font-semibold text-slate-900 whitespace-nowrap">
            <CellValue row={row} value={row.grand_total} bold />
          </td>
        </tr>
      ))}
    </>
  )
}

function CellValue({ row, value, bold }) {
  if (row.isPercent) {
    const v = Number(value) || 0
    const highlight = v >= 5
    return (
      <span
        className={
          v === 0
            ? 'text-slate-400'
            : highlight
            ? 'font-bold text-emerald-600'
            : bold
            ? 'font-semibold text-blue-700'
            : 'text-blue-600'
        }
      >
        {formatPercent(v)}
      </span>
    )
  }

  const n = Number(value) || 0
  return <span className={n === 0 ? 'text-slate-300' : 'text-slate-700'}>{formatNumber(n)}</span>
}
