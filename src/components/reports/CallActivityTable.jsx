import { useState } from 'react'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

const columns = [
  ['Date', 'date'], ['Employee', 'employee_name'], ['Branch', 'branch'],
  ['Department', 'department'], ['Designation', 'designation'], ['Arrival time', 'arrival_time'],
  ['Dialshree calls', 'dialshree_calls'], ['VI calls', 'vi_calls'], ['Total calls', 'total_calls'],
  ['First call time', 'first_call_time'], ['Idle time', 'time_difference_seconds'],
]

function formatCell(row, key) {
  const value = row[key]
  if (value == null || value === '') return '-'
  if (key !== 'time_difference_seconds') return value
  const seconds = Math.abs(Number(value))
  const pad = (number) => String(number).padStart(2, '0')
  return `${value < 0 ? '-' : ''}${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`
}

export default function CallActivityTable({ rows, isLoading, error, warning }) {
  const [sort, setSort] = useState({ key: 'date', direction: 'asc' })
  if (isLoading) return <div role="status" className="flex items-center justify-center gap-3 p-10 text-sm text-slate-500"><Loader2 size={20} className="animate-spin" />Loading call activity report...</div>
  if (error) return <p role="alert" className="p-6 text-sm text-rose-600">Unable to load call activity report: {error.response?.data?.message || error.message}</p>
  const sorted = [...rows].sort((a, b) => {
    const left = a[sort.key]
    const right = b[sort.key]
    const result = typeof left === 'number' && typeof right === 'number' ? left - right : String(left ?? '').localeCompare(String(right ?? ''))
    return sort.direction === 'asc' ? result : -result
  })
  return (
    <>
      {warning && <p role="status" className="border-b border-amber-100 bg-amber-50 px-6 py-4 text-xs leading-relaxed text-amber-800">{warning}</p>}
      <div className="report-results-heading"><div className="flex items-center gap-2"><h3>Call activity results</h3><span className="report-count">{rows.length} records</span></div><p>Times shown in IST</p></div>
      <div className="report-table-scroll" role="region" aria-label="Call activity report data" tabIndex={0}>
        <table className="report-data-table">
          <thead><tr><th scope="col">S.R.</th>{columns.map(([label, key]) => <th key={key} scope="col" aria-sort={sort.key === key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}><button type="button" className="flex items-center gap-2 text-left" onClick={() => setSort({ key, direction: sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc' })}>{label}{sort.key === key && (sort.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button></th>)}</tr></thead>
          <tbody>{sorted.length ? sorted.map((row, index) => <tr key={`${row.date}-${row.branch}-${row.employee_code}-${index}`} className="odd:bg-white even:bg-slate-50/50 hover:bg-blue-50/30"><td>{index + 1}</td>{columns.map(([, key]) => <td key={key} className={key === 'time_difference_seconds' ? 'whitespace-nowrap text-rose-700' : key === 'employee_name' || key === 'total_calls' ? 'font-semibold text-slate-900' : 'text-slate-600'}>{formatCell(row, key)}</td>)}</tr>) : <tr><td colSpan={12} className="py-12 text-center text-slate-500">No call activity found for these dates and branch.</td></tr>}</tbody>
        </table>
      </div>
      <div className="report-table-footer"><span>{rows.length} records shown</span><span>{rows.reduce((sum, row) => sum + Number(row.total_calls || 0), 0)} total calls</span></div>
    </>
  )
}
