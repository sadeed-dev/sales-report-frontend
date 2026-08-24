import { forwardRef } from 'react'
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Users,
  Phone,
  Timer,
  Target,
  PhoneCall,
  PhoneForwarded,
  Ban,
  Star,
  Clock,
  MessageSquare,
  ThumbsDown,
  PhoneMissed,
  AlertCircle,
  Mic,
  XCircle,
  Info,
} from 'lucide-react'
import { formatNumber, formatPercent } from '../../lib/reportFormat'

// Natural disposition order (mirrors the source SQL's sort_no), flattened out
// of the on-screen dashboard's icon-grouped categories into one continuous
// table — this is what gets captured for the "Download Report" image.
const FLAT_ROW_KEY_ORDER = [
  'busy',
  'callback',
  'dnd',
  'interested',
  'sec300Plus',
  'languageIssue',
  'notInterested',
  'notPickup',
  'undisposed',
  'voicemail',
  'wrongNumber',
]

const COLOR_MAP = {
  emerald: { icon: 'text-emerald-600', label: 'text-emerald-700', bg: 'bg-emerald-50', value: 'text-emerald-700' },
  blue: { icon: 'text-blue-600', label: 'text-blue-700', bg: 'bg-blue-50', value: 'text-blue-700' },
  purple: { icon: 'text-purple-600', label: 'text-purple-700', bg: 'bg-purple-50', value: 'text-purple-700' },
  orange: { icon: 'text-orange-500', label: 'text-orange-600', bg: 'bg-orange-200', value: 'text-orange-900' },
  sky: { icon: 'text-sky-600', label: 'text-sky-700', bg: 'bg-sky-200', value: 'text-sky-900' },
  red: { icon: 'text-red-500', label: 'text-red-600', bg: 'bg-red-50', value: 'text-red-600' },
}

// key -> icon + accent color + whether the whole row gets tinted (the two
// "positive" rows) or just the icon/label (everything else). `boldTotal`
// marks the rows whose Grand Total column also picks up the accent color.
const ROW_META = {
  busy: { icon: PhoneCall, color: 'emerald' },
  callback: { icon: PhoneForwarded, color: 'blue' },
  dnd: { icon: Ban, color: 'purple' },
  interested: { icon: Star, color: 'orange', highlightRow: true, boldTotal: true },
  sec300Plus: { icon: Clock, color: 'sky', highlightRow: true, boldTotal: true },
  languageIssue: { icon: MessageSquare, color: 'blue' },
  notInterested: { icon: ThumbsDown, color: 'red', boldTotal: true },
  notPickup: { icon: PhoneMissed, color: 'purple' },
  undisposed: { icon: AlertCircle, color: 'orange' },
  voicemail: { icon: Mic, color: 'emerald' },
  wrongNumber: { icon: XCircle, color: 'red' },
}


const NAVY = 'bg-[#1e3a6b]'

function buildFlatRows(categories) {
  const byKey = new Map()
  ;(categories || []).forEach((cat) => cat.rows.forEach((row) => byKey.set(row.key, row)))

  const rows = FLAT_ROW_KEY_ORDER.map((key) => byKey.get(key)).filter(Boolean)
  const totalInterested = byKey.get('totalInterested')
  const totalInterestedPct = byKey.get('totalInterestedPct')

  return { rows, totalInterested, totalInterestedPct }
}


function formatSnapshotDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T00:00:00`)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatGeneratedAt(isoStr) {
  const d = isoStr ? new Date(isoStr) : new Date()
  if (isNaN(d.getTime())) return ''
  const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timePart = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${datePart} · ${timePart}`
}

// Deliberately plain CSS: solid colors, no gradients/backdrop-filter/sticky.
// This node is rendered off-screen purely so html-to-image can snapshot it
// reliably — fancy effects are the most common cause of DOM-to-image
// captures coming out blank or wrong.
const LeadListDispositionExportTable = forwardRef(function LeadListDispositionExportTable(
  { report, meta },
  ref
) {
  if (!report) return <div ref={ref} />

  const leadLists = report.lead_lists || []
  const { rows, totalInterested, totalInterestedPct } = buildFlatRows(report.categories)
  const grandTotalRow = report.grand_total_row

  const totalCalls = report.summary?.total_calls || 0
  const interested = report.summary?.interested || 0
  const sec300Plus = report.summary?.sec_300_plus || 0
  const totalInterestedCount = report.summary?.total_interested || 0
  const conversionRate = report.summary?.overall_conversion_pct || 0

  const snapshotLabel = formatSnapshotDate(meta?.to_date)
  const generatedLabel = formatGeneratedAt(meta?.generated_at)

  return (
    <div
      ref={ref}
      style={{
        width: 'max-content',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      className="bg-white p-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-10 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 whitespace-nowrap">
              Lead List Performance &amp; Disposition Report
            </div>
            <div className="text-sm text-slate-500 mt-0.5 whitespace-nowrap">
              Track and analyze lead performance across different dispositions
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 whitespace-nowrap">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-semibold text-slate-800">{snapshotLabel}</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <StatCard icon={Phone} label="Total Calls" value={formatNumber(totalCalls)} />
        <StatCard icon={Users} label="Interested" value={formatNumber(interested)} />
        <StatCard icon={Timer} label="300 Sec+" value={formatNumber(sec300Plus)} />
        <StatCard icon={Target} label="Total Interested" value={formatNumber(totalInterestedCount)} />
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 flex flex-col justify-center">
          <span className="text-[11px] font-semibold tracking-wide text-blue-700 uppercase">Overall Conversion</span>
          <span className="mt-1 text-2xl font-bold text-blue-700">{formatPercent(conversionRate)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <table className="border-collapse" style={{ borderSpacing: 0 }}>
          <thead>
            <tr>
              <th className={`${NAVY} text-white text-left text-xs font-semibold uppercase tracking-wide px-2 py-3 border border-[#2c4e85] whitespace-nowrap`}>
                Disposition
              </th>
              {leadLists.map((name) => (
                <th
                  key={name}
                  className={`${NAVY} text-white text-center text-xs font-bold uppercase tracking-wide px-2 py-3 border border-[#2c4e85] whitespace-nowrap`}
                >
                  {name}
                </th>
              ))}
              <th className={`${NAVY} text-white text-center text-xs font-semibold uppercase tracking-wide px-2 py-3 border border-[#2c4e85] whitespace-nowrap`}>
                Grand Total
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const meta = ROW_META[row.key] || {}
              const Icon = meta.icon || Info
              const palette = COLOR_MAP[meta.color] || COLOR_MAP.blue
              const isHighlight = !!meta.highlightRow

              const rowBg = isHighlight ? palette.bg : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
              const valueColor = isHighlight ? palette.value : 'text-slate-700'
              const totalColor = meta.boldTotal ? palette.value : 'text-slate-900'
              const labelWeight = isHighlight ? 'font-extrabold' : 'font-semibold'
              const valueWeight = isHighlight ? 'font-extrabold' : 'font-semibold'
              const totalWeight = isHighlight ? 'font-extrabold' : 'font-bold'

              return (
                <tr key={row.key} className={rowBg}>
                  <td className="px-2 py-3 border border-slate-200 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Icon className={`h-4 w-4 shrink-0 ${palette.icon}`} />
                      <span className={`text-sm ${labelWeight} whitespace-nowrap ${palette.label}`}>{row.label}</span>
                    </div>
                  </td>
                  {leadLists.map((name) => (
                    <td
                      key={name}
                      className={`px-2 py-3 text-center text-sm ${valueWeight} border border-slate-200 whitespace-nowrap ${valueColor}`}
                    >
                      {formatNumber(row.values[name])}
                    </td>
                  ))}
                  <td className={`px-2 py-3 text-center text-sm ${totalWeight} border border-slate-200 whitespace-nowrap ${totalColor}`}>
                    {formatNumber(row.grand_total)}
                  </td>
                </tr>
              )
            })}

            {grandTotalRow && (
              <tr className="bg-indigo-900">
                <td className="px-2 py-3 text-sm font-bold text-white border border-indigo-700 whitespace-nowrap">
                  Grand Total
                </td>
                {leadLists.map((name) => (
                  <td
                    key={name}
                    className="px-2 py-3 text-center text-sm font-bold text-white border border-indigo-700 whitespace-nowrap"
                  >
                    {formatNumber(grandTotalRow.values[name])}
                  </td>
                ))}
                <td className="px-2 py-3 text-center text-sm font-bold text-white border border-indigo-700 whitespace-nowrap">
                  {formatNumber(grandTotalRow.grand_total)}
                </td>
              </tr>
            )}

            {totalInterested && (
              <tr className={NAVY}>
                <td className="px-2 py-3 text-sm font-bold text-white border border-[#2c4e85] whitespace-nowrap">
                  Total Interested
                </td>
                {leadLists.map((name) => (
                  <td
                    key={name}
                    className="px-2 py-3 text-center text-sm font-bold text-white border border-[#2c4e85] whitespace-nowrap"
                  >
                    {formatNumber(totalInterested.values[name])}
                  </td>
                ))}
                <td className="px-2 py-3 text-center text-sm font-bold text-white border border-[#2c4e85] whitespace-nowrap">
                  {formatNumber(totalInterested.grand_total)}
                </td>
              </tr>
            )}

            {totalInterestedPct && (
              <tr className={NAVY}>
                <td className="px-2 py-3 text-sm font-bold text-white border border-[#2c4e85] whitespace-nowrap">
                  Total Interested %
                </td>
                {leadLists.map((name) => (
                  <td
                    key={name}
                    className="px-2 py-3 text-center text-sm font-bold text-white border border-[#2c4e85] whitespace-nowrap"
                  >
                    {formatPercent(totalInterestedPct.values[name])}
                  </td>
                ))}
                <td className="px-2 py-3 text-center text-sm font-bold text-orange-400 border border-[#2c4e85] whitespace-nowrap">
                  {formatPercent(totalInterestedPct.grand_total)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      {/* <div className="flex items-center justify-center gap-3 mt-3 pt-3 px-1 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
          <Info className="h-3.5 w-3.5" />
          Connected, Interested and Total Interested % are calculated based on total calls for each lead list.
        </div>
        <span className="text-slate-300">·</span>
        <div className="text-xs text-slate-400 whitespace-nowrap">Snapshot generated on {generatedLabel}</div>
      </div> */}
    </div>
  )
})

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 whitespace-nowrap">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <div className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{label}</div>
        <div className="text-2xl font-bold text-slate-900 mt-0.5">{value}</div>
      </div>
    </div>
  )
}

export default LeadListDispositionExportTable
