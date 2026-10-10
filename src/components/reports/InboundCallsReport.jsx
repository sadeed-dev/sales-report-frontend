import { useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import {
  CalendarDays,
  Check,
  Download,
  Loader2,
  Phone,
  PhoneMissed,
  RefreshCw,
  Users,
} from 'lucide-react'
import reportAPI from '../../lib/api/reports'

const IVR_TYPES = ['Complaint Number', 'Enquiry Number']

function dateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDefaultDateRange() {
  const to = new Date()
  to.setDate(to.getDate() - 1)
  const from = new Date(to)
  from.setDate(from.getDate() - 1)
  return { from: dateString(from), to: dateString(to) }
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatCallTime(value) {
  if (!value) return '—'
  const date = new Date(String(value).replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function renderAgentDetail(value) {
  if (!value) return '—'
  const separatorIndex = value.lastIndexOf(' - ')
  if (separatorIndex === -1) return value

  return (
    <>
      {value.slice(0, separatorIndex)}
      <span className="ml-1 inline-block rounded-md bg-[#f9eded] px-1.5 py-0.5 text-xs font-medium text-[#a34456]">{` - ${value.slice(separatorIndex + 3)}`}</span>
    </>
  )
}

function MetricCard({ icon: Icon, label, value, accent, surface, valueColor }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border p-4 text-left shadow-[0_6px_20px_-12px_rgba(15,23,42,0.18)] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg md:p-5 ${surface}`}>
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-2xl ${accent}`}>
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold leading-tight tracking-tight tabular-nums md:text-4xl ${valueColor}`}>{value}</p>
    </div>
  )
}

export default function InboundCallsReport() {
  const initialRange = useMemo(getDefaultDateRange, [])
  const [fromDate, setFromDate] = useState(initialRange.from)
  const [toDate, setToDate] = useState(initialRange.to)
  const [appliedRange, setAppliedRange] = useState(initialRange)
  const [summaryRows, setSummaryRows] = useState([])
  const [missedRows, setMissedRows] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const reportRef = useRef(null)

  useEffect(() => {
    let isCurrent = true
    setIsLoading(true)
    setError('')
    setSummaryRows([])
    setMissedRows([])

    Promise.all([
      reportAPI.getInboundCallSummary({
        from_date: appliedRange.from,
        to_date: appliedRange.to,
      }),
      reportAPI.getInboundMissedCalls({
        from_date: appliedRange.from,
        to_date: appliedRange.to,
      }),
    ])
      .then(([summaryResponse, missedResponse]) => {
        if (!isCurrent) return
        setSummaryRows(summaryResponse.data?.summary || [])
        setMissedRows(missedResponse.data?.missed_calls || [])
      })
      .catch((requestError) => {
        if (!isCurrent) return
        setError(requestError.response?.data?.message || requestError.message || 'Unable to load inbound call reports.')
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [appliedRange])

  const summary = IVR_TYPES.map((type) => {
    const row = summaryRows.find((item) => item.ivr_type === type)
    return {
      ivr_type: type,
      total_unique_customers: Number(row?.total_unique_customers) || 0,
      answered: Number(row?.answered) || 0,
      missed: Number(row?.missed) || 0,
    }
  })
  const totals = summary.reduce(
    (result, row) => ({
      total: result.total + row.total_unique_customers,
      answered: result.answered + row.answered,
      missed: result.missed + row.missed,
    }),
    { total: 0, answered: 0, missed: 0 }
  )
  const answeredRate = totals.total ? Math.round((totals.answered / totals.total) * 100) : 0
  const missedRate = totals.total ? Math.round((totals.missed / totals.total) * 100) : 0
  const hasReportData = totals.total > 0 || missedRows.length > 0

  const applyFilters = () => {
    if (!fromDate || !toDate) {
      setError('Choose both a start date and an end date.')
      return
    }
    if (fromDate > toDate) {
      setError('Start date must be on or before the end date.')
      return
    }
    setAppliedRange({ from: fromDate, to: toDate })
  }

  const downloadReport = async () => {
    if (!reportRef.current || isExporting) return
    setIsExporting(true)
    let exportContainer
    try {
      // Render a full-width copy so viewport scrollbars never enter the PNG.
      const exportReport = reportRef.current.cloneNode(true)
      const generatedTime = exportReport.querySelector('[data-generated-time]')
      if (generatedTime) {
        generatedTime.textContent = new Date().toLocaleString('en-IN', {
          dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata',
        })
      }
      exportContainer = document.createElement('div')
      exportContainer.setAttribute('aria-hidden', 'true')
      Object.assign(exportContainer.style, {
        position: 'fixed',
        left: '-100000px',
        top: '0',
        width: '1240px',
        pointerEvents: 'none',
      })
      Object.assign(exportReport.style, {
        width: '100%',
        maxWidth: 'none',
        height: 'auto',
        maxHeight: 'none',
      })
      exportReport.querySelectorAll('.overflow-x-auto').forEach((wrapper) => {
        Object.assign(wrapper.style, {
          overflow: 'visible',
          height: 'auto',
          maxHeight: 'none',
        })
        wrapper.scrollLeft = 0
        wrapper.scrollTop = 0
      })
      exportContainer.appendChild(exportReport)
      document.body.appendChild(exportContainer)
      await document.fonts.ready
      // Allow wider table content to fit without clipping any agent columns.
      const extraWidth = Math.max(0, ...Array.from(
        exportReport.querySelectorAll('.overflow-x-auto'),
        (wrapper) => wrapper.scrollWidth - wrapper.clientWidth
      ))
      exportContainer.style.width = `${1240 + extraWidth}px`
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const image = await toPng(exportReport, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = `website-inbound-report-${appliedRange.from}-to-${appliedRange.to}.png`
      link.href = image
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (exportError) {
      console.error('Inbound call report image export failed:', exportError)
      window.alert('Could not create the PNG report. Please try again.')
    } finally {
      exportContainer?.remove()
      setIsExporting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1240px] space-y-4">
      <header className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#1e3a6d] via-[#284b8a] to-[#0f766e] px-5 py-4 text-center shadow-[0_24px_60px_-30px_rgba(30,41,99,0.75)] md:px-8 md:py-5">
        <div className="pointer-events-none absolute -right-12 -top-32 h-80 w-80 rounded-full border border-cyan-100/10" />
        <div className="pointer-events-none absolute -left-16 -bottom-48 h-96 w-96 rounded-full border border-violet-100/10" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-2.5">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
              <Phone className="h-3.5 w-3.5" />
              Website · Inbound intelligence
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Inbound Call Performance</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2 backdrop-blur-sm">
            <CalendarDays className="h-4 w-4 text-cyan-200" />
            <div className="text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">Reporting period</p>
              <p className="text-xs font-semibold text-white">
                {formatDate(appliedRange.from)} – {formatDate(appliedRange.to)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="flex flex-wrap items-end justify-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 p-2.5 shadow-[0_12px_32px_-26px_rgba(15,23,42,0.55)]">
        <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
          From date
          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(event) => setFromDate(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
          To date
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(event) => setToDate(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </label>
        <button
          type="button"
          onClick={applyFilters}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#206052] to-[#287566] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/15 transition hover:from-[#184c42] hover:to-[#206052] disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Apply filters
        </button>
        <button
          type="button"
          onClick={downloadReport}
          disabled={isLoading || isExporting || !hasReportData}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#142c38] to-[#24505a] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-950/20 transition hover:from-[#1b3c49] hover:to-[#2c606b] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isExporting ? 'Creating PNG…' : 'Download PNG'}
        </button>
      </section>

      {error && (
        <div role="alert" className="mx-auto max-w-2xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-slate-500 shadow-sm">
          <Loader2 className="mr-3 h-6 w-6 animate-spin text-blue-600" />
          Loading inbound call reports…
        </div>
      ) : (
        <section
          ref={reportRef}
          className="space-y-4 rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-[#f8faff] via-white to-[#f0fdfa] p-4 shadow-[0_24px_70px_-48px_rgba(20,44,56,0.4)] md:space-y-5 md:p-6"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a6d] via-[#284b8a] to-[#0f766e] px-3 py-3 md:px-5">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4">
              <div className="justify-self-start rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-100">Reporting period</p>
                <p className="mt-0.5 text-xs font-bold text-amber-200 sm:text-sm">
                  {formatDate(appliedRange.from)} – {formatDate(appliedRange.to)}
                </p>
              </div>
              <h2 className="rounded-full border border-cyan-100/25 bg-white/15 px-3 py-2 text-center text-xs font-semibold tracking-tight text-white shadow-sm md:px-5 md:text-base">
                Website inbound calls
              </h2>
              <div className="justify-self-end rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-100">Generated</p>
                <p data-generated-time className="mt-0.5 text-xs font-semibold text-white sm:text-sm">
                  {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricCard icon={Users} label="Unique customers" value={totals.total.toLocaleString()} accent="bg-violet-100 text-violet-600" surface="border-violet-200 bg-gradient-to-br from-white to-violet-50" valueColor="text-violet-700" />
            <MetricCard icon={Check} label={`Answered · ${answeredRate}%`} value={totals.answered.toLocaleString()} accent="bg-emerald-100 text-emerald-600" surface="border-emerald-200 bg-gradient-to-br from-white to-emerald-50" valueColor="text-emerald-700" />
            <MetricCard icon={PhoneMissed} label={`Missed customers · ${missedRate}%`} value={totals.missed.toLocaleString()} accent="bg-rose-100 text-rose-600" surface="border-rose-200 bg-gradient-to-br from-white to-rose-50" valueColor="text-rose-700" />
            <MetricCard icon={Phone} label="Missed call attempts" value={missedRows.length.toLocaleString()} accent="bg-amber-100 text-amber-600" surface="border-amber-200 bg-gradient-to-br from-white to-amber-50" valueColor="text-amber-700" />
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-slate-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-white px-4 py-3.5 text-center md:px-5">
              <h3 className="whitespace-nowrap text-sm font-bold text-slate-900">Daily call summary</h3>
              <span className="hidden text-slate-300 sm:inline">·</span>
              <p className="text-xs text-slate-500">Unique callers by website inbound number</p>
              <span className="inline-flex rounded-full bg-[#dcece7] px-3 py-1 text-xs font-semibold text-[#286452]">
                {summary.length} inbound numbers
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-center">
                <thead>
                  <tr className="bg-[#1e3a6d] text-[10px] uppercase tracking-[0.1em] text-white">
                    <th className="px-4 py-3.5 font-semibold">Inbound number</th>
                  <th className="px-4 py-3.5 font-semibold">Unique customers</th>
                  <th className="px-4 py-3.5 font-semibold">Answered</th>
                  <th className="px-4 py-3.5 font-semibold">Missed</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((row, index) => (
                    <tr key={row.ivr_type} className={`border-b border-slate-100 last:border-0 ${index % 2 ? 'bg-[#f4f7fc]' : 'bg-white'}`}>
                      <td className="px-4 py-3.5 text-sm font-semibold text-slate-800">{row.ivr_type}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-slate-800">{row.total_unique_customers.toLocaleString()}</td>
                      <td className="border-x border-emerald-100 bg-emerald-50 px-4 py-3.5 text-sm font-bold text-emerald-700">{row.answered.toLocaleString()}</td>
                      <td className="bg-rose-50 px-4 py-3.5 text-sm font-bold text-rose-700">{row.missed.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#0f766e]">
                    <td className="px-4 py-3.5 text-sm font-bold text-white">Total</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-white">{totals.total.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-white">{totals.answered.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-white">{totals.missed.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {totals.total === 0 && (
              <p className="px-5 py-4 text-center text-sm text-slate-500">No inbound calls were found for this date range.</p>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-slate-100 bg-gradient-to-r from-orange-50 via-rose-50 to-white px-4 py-3.5 text-center md:px-5">
              <h3 className="whitespace-nowrap text-sm font-bold text-slate-900">Missed call follow-up</h3>
              <span className="hidden text-slate-300 sm:inline">·</span>
              <p className="text-xs text-slate-500">Customer calls not answered by the assigned agents</p>
              <span className="inline-flex rounded-full bg-[#f5e3e6] px-3 py-1 text-xs font-semibold text-[#a34456]">
                {missedRows.length.toLocaleString()} missed calls
              </span>
            </div>
            {missedRows.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-5 py-8 text-center md:px-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">No missed calls in this period</p>
                  <p className="mt-0.5 text-xs text-slate-500">All call activity for the selected period is accounted for above.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-center">
                  <thead>
                    <tr className="bg-[#1e3a6d] text-[10px] uppercase tracking-[0.1em] text-white">
                      <th className="px-4 py-3.5 font-semibold">Call time</th>
                      <th className="px-4 py-3.5 font-semibold">Customer number</th>
                      <th className="px-4 py-3.5 font-semibold">Inbound number</th>
                      <th className="px-4 py-3.5 font-semibold">Agent 1</th>
                      <th className="px-4 py-3.5 font-semibold">Agent 2</th>
                      <th className="px-4 py-3.5 font-semibold">Agent 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {missedRows.map((row, index) => (
                      <tr key={row.unique_id} className={`border-b border-slate-100 last:border-0 ${index % 2 ? 'bg-[#f4f7fc]' : 'bg-white'}`}>
                        <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-slate-700">{formatCallTime(row.call_time)}</td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-sm font-bold text-slate-900">{row.customer_number || '—'}</td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-700">{row.ivr_type}</td>
                        {[row.agent_1, row.agent_2, row.agent_3].map((agent, agentIndex) => (
                          <td key={`${row.unique_id}-agent-${agentIndex}`} className="px-4 py-3.5 text-sm text-slate-600">
                            {renderAgentDetail(agent)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        
        </section>
      )}
    </div>
  )
}
