import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart3, CalendarDays, Download, Loader2, Phone, Star, Timer, Target, Users, TrendingUp, PhoneCall, PhoneForwarded, Ban, MessageSquare, ThumbsDown, PhoneMissed, Mic, XCircle, AlertCircle, Briefcase, Layers } from 'lucide-react'
import reportAPI from '../../lib/api/reports'
import { formatNumber, formatPercent } from '../../lib/reportFormat'
import { renderReportPng } from '../../lib/reportImage'

const rowIcons = { busy: PhoneCall, callback: PhoneForwarded, dnd: Ban, existingClient: Briefcase, interested: Star, sec300Plus: Timer, languageIssue: MessageSquare, notInterested: ThumbsDown, notPickup: PhoneMissed, voicemail: Mic, wrongNumber: XCircle, undisposed: AlertCircle, other: Layers, totalAgents: Users }
const rowLabelColors = { busy: 'text-emerald-700', callback: 'text-blue-700', dnd: 'text-violet-700', existingClient: 'text-indigo-700', languageIssue: 'text-blue-700', notInterested: 'text-rose-600', notPickup: 'text-violet-700', voicemail: 'text-emerald-700', wrongNumber: 'text-rose-600', undisposed: 'text-orange-600', other: 'text-slate-600', totalAgents: 'text-slate-600' }
const cellValue = (row, value) => row.isPercent ? formatPercent(value) : formatNumber(value)
const displayDate = value => new Date(`${value}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
const DISPOSITION_COLUMN_WIDTH = 140
const CAMPAIGN_COLUMN_WIDTH = 104
const TOTAL_COLUMN_WIDTH = 110

function Metric({ icon: Icon, label, value, tone }) {
  const valueColor = tone.split(' ').find(token => token.startsWith('text-'))
  return <div className="campaign-metric">
    <span className={`campaign-metric-icon ${tone}`}><Icon size={23} strokeWidth={1.8} /></span>
    <div className="min-w-0"><p className="campaign-metric-label">{label}</p><p className={`campaign-metric-value ${valueColor}`}>{value}</p></div>
  </div>
}

export function CampaignDispositionSnapshot({ report, meta, exportMode = false }) {
  const { rows, summary } = report
  const campaigns = report.campaigns.filter(campaign => campaign.name.trim().toLowerCase() !== 'startupflora_in')
  const dateLabel = meta.from_date === meta.to_date ? displayDate(meta.to_date) : `${displayDate(meta.from_date)} – ${displayDate(meta.to_date)}`
  return <div className={`campaign-report-sheet ${exportMode ? 'bg-white py-4' : 'space-y-6'}`}>
    <div className={`flex flex-wrap items-center justify-between gap-4 ${exportMode ? 'mb-5' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><BarChart3 size={27} strokeWidth={1.8} /></span>
        <div><h2 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">Campaign Performance &amp; Disposition Report</h2><p className="mt-1.5 text-xs font-medium text-slate-400">{campaigns.length} active campaigns</p></div>
      </div>
      <span className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"><CalendarDays size={18} className="text-blue-500" />{dateLabel}</span>
    </div>
    <div className={`grid gap-3 ${exportMode ? 'grid-cols-6 mb-5' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6'}`}>
      <Metric icon={Phone} label="Total calls" value={formatNumber(summary.total_calls)} tone="bg-violet-50 text-violet-600" />
      <Metric icon={Star} label="Interested" value={formatNumber(summary.interested)} tone="bg-emerald-50 text-emerald-600" />
      <Metric icon={Timer} label="300 Sec+" value={formatNumber(summary.sec_300_plus)} tone="bg-orange-50 text-orange-600" />
      <Metric icon={Target} label="Total interested" value={formatNumber(summary.total_interested)} tone="bg-amber-50 text-amber-600" />
      <Metric icon={TrendingUp} label="Conversion" value={formatPercent(summary.overall_conversion_pct)} tone="bg-teal-50 text-teal-600" />
      <Metric icon={Users} label="Unique agents" value={formatNumber(summary.total_agents)} tone="bg-blue-50 text-blue-600" />
    </div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className={exportMode ? '' : 'overflow-x-auto'} role={exportMode ? undefined : 'region'} aria-label="Campaign disposition results" tabIndex={exportMode ? undefined : 0}>
        <table className="campaign-disposition-table w-full border-separate border-spacing-0 text-sm tabular-nums" style={{ minWidth: DISPOSITION_COLUMN_WIDTH + campaigns.length * CAMPAIGN_COLUMN_WIDTH + TOTAL_COLUMN_WIDTH, tableLayout: 'fixed' }}>
          <colgroup><col style={{ width: DISPOSITION_COLUMN_WIDTH }} />{campaigns.map(c => <col key={c.key} />)}<col style={{ width: TOTAL_COLUMN_WIDTH }} /></colgroup>
          <thead><tr>
            <th scope="col" className={`${exportMode ? '' : 'sticky left-0 z-20'} border-b border-r border-[#344f7c] bg-[#1e3a6b] pl-2 pr-0 py-[2px] text-left text-[11px] font-bold uppercase leading-6 tracking-wider text-white`}>Disposition</th>
            {campaigns.map(campaign => <th scope="col" key={campaign.key} className="border-b border-r border-[#344f7c] bg-[#1e3a6b] px-0 py-[2px] text-center text-[11px] font-bold uppercase leading-6 tracking-wide text-white"><span className="block break-words">{campaign.name}</span></th>)}
            <th scope="col" className="border-b border-[#344f7c] bg-[#172f59] px-0 py-[2px] text-center text-[11px] font-bold uppercase leading-6 tracking-wider text-white">Grand total</th>
          </tr></thead>
          <tbody>{rows.map((row, index) => {
            const Icon = rowIcons[row.key]
            const dark = ['grandTotal', 'totalInterested', 'totalInterestedPct'].includes(row.key)
            const background = row.key === 'grandTotal' ? 'bg-teal-800' : row.key === 'totalInterestedPct' || row.key === 'totalInterested' ? 'bg-[#1e3a6b]' : row.key === 'interested' ? 'bg-[#087f6c]' : row.key === 'sec300Plus' ? 'bg-[#ffe0a3]' : row.key === 'totalAgents' ? 'bg-slate-100' : index % 2 ? 'bg-slate-50' : 'bg-white'
            const color = dark || row.key === 'interested' ? 'text-white' : row.key === 'sec300Plus' ? 'text-[#783b0b]' : 'text-slate-700'
            const border = dark ? 'border-white/15' : row.key === 'interested' ? 'border-[#ffffff24]' : row.key === 'sec300Plus' ? 'border-[#eab95e]' : 'border-slate-200/80'
            const bold = dark || ['interested', 'sec300Plus', 'totalInterested', 'totalAgents'].includes(row.key)
            return <tr key={row.key} className={`${background} ${color}`}>
              <th scope="row" className={`${exportMode ? '' : 'sticky left-0 z-10'} ${background} ${border} ${rowLabelColors[row.key] || ''} border-b border-r pl-2 pr-0 py-0 text-left text-xs font-bold leading-7`}><span className="flex items-center gap-2">{Icon && <Icon size={16} strokeWidth={1.8} className="shrink-0" />}{row.label}</span></th>
              {campaigns.map(campaign => <td key={campaign.key} className={`${border} border-b border-r p-0 text-center text-xs leading-7 ${bold ? 'font-bold' : 'font-semibold'}`}>{cellValue(row, row.values[campaign.key])}</td>)}
              <td className={`${border} ${row.key === 'totalInterestedPct' ? 'text-orange-300' : row.key === 'notInterested' || row.key === 'wrongNumber' ? 'text-rose-600' : ''} border-b p-0 text-center text-xs font-bold leading-7`}>{cellValue(row, row.grand_total)}</td>
            </tr>
          })}</tbody>
        </table>
      </div>
    </div>
  </div>
}

export default function CampaignDispositionReport() {
  const [today] = useState(() => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10))
  const [fromDate, setFromDate] = useState(today)
  const [toDate, setToDate] = useState(today)
  const [params, setParams] = useState({ from_date: today, to_date: today })
  const [filterError, setFilterError] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const exportRef = useRef(null)
  const query = useQuery({ queryKey: ['campaign-disposition-report', params], queryFn: () => reportAPI.getCampaignDispositionReport(params), retry: false })
  const responseReport = query.data?.data
  const report = responseReport ? {
    ...responseReport,
    campaigns: responseReport.campaigns.filter(campaign => campaign.name.trim().toLowerCase() !== 'startupflora_in'),
  } : undefined
  const meta = query.data?.meta
  const hasData = !!report?.campaigns?.length

  const applyFilters = (event) => {
    event.preventDefault()
    if (!fromDate || !toDate || fromDate > toDate) return setFilterError('Choose a valid date range.')
    if ((Date.parse(toDate) - Date.parse(fromDate)) / 86400000 > 30) return setFilterError('Choose at most 31 days per report.')
    setFilterError('')
    setParams({ from_date: fromDate, to_date: toDate })
  }
  const download = async () => {
    if (!exportRef.current || isExporting || query.isFetching) return
    setIsExporting(true)
    setExportError('')
    try {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const url = URL.createObjectURL(await renderReportPng(exportRef.current, { minWidth: 2560, minHeight: 1440 }))
      const link = document.createElement('a')
      link.href = url
      link.download = `campaign-wise-disposition-${meta.from_date}-to-${meta.to_date}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setExportError('Could not create the report image. Please try again.')
    } finally { setIsExporting(false) }
  }

  return <main className="report-page space-y-6">
    <div className="report-page-heading"><p className="report-eyebrow">Reports / Campaign performance</p><h1>Campaign Wise Disposition</h1><p>A clear view of campaign calls, outcomes, and conversion.</p></div>
    <div className="report-panel">
      <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-4 p-5">
        <div className="report-field"><label htmlFor="campaign-from">From date</label><input id="campaign-from" type="date" required value={fromDate} max={toDate || today} onChange={event => setFromDate(event.target.value)} /></div>
        <div className="report-field"><label htmlFor="campaign-to">To date</label><input id="campaign-to" type="date" required value={toDate} min={fromDate} max={today} onChange={event => setToDate(event.target.value)} /></div>
        <button className="report-button report-button-primary" type="submit" disabled={query.isFetching}>Apply filters</button>
        {query.isFetching && <span role="status" className="flex items-center gap-2 self-center text-xs text-slate-500"><Loader2 size={16} className="animate-spin" />Updating report...</span>}
        <button type="button" onClick={download} disabled={!hasData || isExporting || query.isFetching} className="report-button report-button-secondary ml-auto">{isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}{isExporting ? 'Preparing image...' : 'Download image report'}</button>
      </form>
      {(filterError || exportError) && <p role="alert" className="px-5 pb-4 text-sm text-rose-600">{filterError || exportError}</p>}
    </div>
    {query.isLoading ? <div role="status" className="report-panel p-12 text-center text-sm text-slate-500">Loading campaign disposition report...</div> : query.error ? <div role="alert" className="report-panel p-8 text-sm text-rose-600">{query.error.response?.data?.message || query.error.message}<button onClick={() => query.refetch()} className="ml-3 font-semibold underline">Retry</button></div> : !hasData ? <div className="report-panel p-12 text-center"><BarChart3 className="mx-auto mb-3 text-slate-300" size={30} /><h2 className="font-semibold text-slate-700">No campaign activity found</h2><p className="mt-2 text-sm text-slate-500">Try a different date range to view campaign dispositions.</p></div> : <>
      <CampaignDispositionSnapshot report={report} meta={meta} />
      <div aria-hidden="true" style={{ position: 'fixed', left: '-100000px', top: 0, pointerEvents: 'none' }}><div ref={exportRef} style={{ width: Math.max(960, DISPOSITION_COLUMN_WIDTH + report.campaigns.length * CAMPAIGN_COLUMN_WIDTH + TOTAL_COLUMN_WIDTH + 2) }}><CampaignDispositionSnapshot report={report} meta={meta} exportMode /></div></div>
    </>}
  </main>
}
