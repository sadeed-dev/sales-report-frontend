'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Search,
  RefreshCcw,
  Users,
  CalendarDays,
  MapPin,
  Clock,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  Mail,
  Phone,
  Inbox,
  AlertCircle,
  X,
} from 'lucide-react'
import reportAPI from '@/lib/api/reports'



const TABS = [
  { id: 'employees', label: 'Employee Directory', icon: Users },
  { id: 'attendance', label: 'Attendance Logs', icon: CalendarDays },
]

const today = new Date().toISOString().slice(0, 10)
// const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  // .toISOString()
  // .slice(0, 10)

function cleanString(value) {
  return String(value || '').toLowerCase()
}

function getInitials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

const AVATAR_TONES = [
  'bg-blue-100 text-blue-700',
  'bg-cyan-100 text-cyan-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-indigo-100 text-indigo-700',
]

function getAvatarTone(seed) {
  const str = String(seed || '')
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length]
}

function Avatar({ name }) {
  return (
    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarTone(name)}`}>
      {getInitials(name)}
    </div>
  )
}

function Chip({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}

function StatCard({ label, value, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: { chip: 'bg-blue-500', bg: 'from-blue-50/80 to-white' },
    violet: { chip: 'bg-violet-500', bg: 'from-violet-50/80 to-white' },
    emerald: { chip: 'bg-emerald-500', bg: 'from-emerald-50/80 to-white' },
    amber: { chip: 'bg-amber-500', bg: 'from-amber-50/80 to-white' },
  }
  const t = tones[tone] || tones.blue
  return (
    <div className={`metric-card relative overflow-hidden bg-gradient-to-br ${t.bg}`}>
      <div className="relative flex items-center gap-4">
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${t.chip} shadow-lg shadow-black/10`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-0.5 truncate text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

function SkeletonTable({ columns }) {
  return (
    <div className="animate-pulse">
      <div className="grid gap-4 border-b border-slate-100 px-6 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-3 w-3/4 rounded-full bg-slate-200" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, row) => (
        <div key={row} className="grid gap-4 border-b border-slate-50 px-6 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, col) => (
            <div key={col} className="h-3.5 rounded-full bg-slate-100" style={{ width: col === 0 ? '85%' : '55%' }} />
          ))}
        </div>
      ))}
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <Inbox className="h-6 w-6 text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  )
}

function Pagination({ currentPage, totalPages, onChange, label }) {
  function getPages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = []
    const delta = 1
    const left = Math.max(2, currentPage - delta)
    const right = Math.min(totalPages - 1, currentPage + delta)
    pages.push(1)
    if (left > 2) pages.push('ellipsis-left')
    for (let page = left; page <= right; page += 1) pages.push(page)
    if (right < totalPages - 1) pages.push('ellipsis-right')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Prev
        </button>
        <div className="flex items-center gap-1">
          {getPages().map((page, index) =>
            typeof page !== 'number' ? (
              <span key={`${page}-${index}`} className="inline-flex h-8 items-center px-1 text-xs text-slate-400">
                &hellip;
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onChange(page)}
                className={`h-8 min-w-[32px] rounded-lg px-2 text-xs font-semibold transition ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
        <button
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default  function UsersModule() {
  const [activeTab, setActiveTab] = useState('employees')
  const [searchText, setSearchText] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [fromDate, setFromDate] = useState(today)
  const [toDate, setToDate] = useState(today)
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentEmployeePage, setCurrentEmployeePage] = useState(1)
  const [currentAttendancePage, setCurrentAttendancePage] = useState(1)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportMenuRef = useRef(null)

  const [exporting, setExporting] = useState(false)
  const [exportingAbsentUsers, setExportingAbsentUsers] = useState(false)
  const [exportingAbsentUsersBranchwise, setExportingAbsentUsersBranchwise] = useState(false)
  const [exportingAbsentUsersDepartmentwise, setExportingAbsentUsersDepartmentwise] = useState(false)

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const branchOptions = useMemo(() => {
    const values = new Set()
    if (activeTab === 'attendance') {
      attendance.forEach((row) => {
        if (row.Branch_Name) values.add(row.Branch_Name)
      })
    } else {
      employees.forEach((row) => {
        if (row.branch) values.add(row.branch)
      })
    }
    return ['all', ...Array.from(values).sort((a, b) => a.localeCompare(b))]
  }, [activeTab, attendance, employees])

  const filteredEmployees = useMemo(() => {
    const filtered = employees
      .filter((row) => {
        const matchesBranch = branchFilter === 'all' || row.branch === branchFilter
        if (!matchesBranch) return false

        const query = searchText.trim().toLowerCase()
        if (!query) return true

        return [
          row.name,
          row.show_name,
          row.work_email,
          row.job_position,
          row.department,
          row.branch,
          row.user_id,
        ]
          .map(cleanString)
          .some((value) => value.includes(query))
      })
    setCurrentEmployeePage(1)
    return filtered
  }, [employees, branchFilter, searchText])

  const paginatedEmployees = useMemo(() => {
    const start = (currentEmployeePage - 1) * ITEMS_PER_PAGE
    return filteredEmployees.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredEmployees, currentEmployeePage])

  const totalEmployeePages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE)

  const filteredAttendance = useMemo(() => {
    const filtered = attendance
      .filter((row) => {
        const matchesBranch = branchFilter === 'all' || row.Branch_Name === branchFilter
        if (!matchesBranch) return false

        const query = searchText.trim().toLowerCase()
        if (!query) return true

        return [
          row.EmpName,
          row.EmpCode,
          row.Branch_Name,
          row.Dept_Name,
          row.PunchDate,
          row.PunchDateFormatted,
        ]
          .map(cleanString)
          .some((value) => value.includes(query))
      })
    setCurrentAttendancePage(1)
    return filtered
  }, [attendance, branchFilter, searchText])

  const paginatedAttendance = useMemo(() => {
    const start = (currentAttendancePage - 1) * ITEMS_PER_PAGE
    return filteredAttendance.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAttendance, currentAttendancePage])

  const totalAttendancePages = Math.ceil(filteredAttendance.length / ITEMS_PER_PAGE)

  const employeeMetrics = useMemo(() => {
    return {
      totalEmployees: filteredEmployees.length,
      branches: new Set(filteredEmployees.map((row) => row.branch || 'Unknown')).size,
      emails: filteredEmployees.filter((row) => row.work_email).length,
    }
  }, [filteredEmployees])

  const attendanceMetrics = useMemo(() => {
    const totalRecords = filteredAttendance.length
    const totalMinutes = filteredAttendance.reduce(
      (sum, row) => sum + (row.TotalMinutes || 0),
      0
    )
    const uniqueEmployees = new Set(filteredAttendance.map((row) => row.EmpCode || row.EmpName || 'unknown')).size
    return {
      totalRecords,
      uniqueEmployees,
      averageHours: totalRecords ? (totalMinutes / totalRecords / 60).toFixed(2) : '0.00',
    }
  }, [filteredAttendance])

  async function loadEmployees() {
    setLoading(true)
    setError(null)
    try {
      const response = await reportAPI.getEmployees({ format: 'json' })
      setEmployees(response.data?.employees || [])
    } catch (err) {
      setError('Unable to fetch employee records. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function loadAttendance() {
    setLoading(true)
    setError(null)
    try {
      const response = await reportAPI.getAttendance({ from: fromDate, to: toDate, format: 'json' })
      setAttendance(response.data?.attendance || [])
    } catch (err) {
      setError('Unable to fetch attendance logs. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  async function exportLateArrivalImages() {
    setExporting(true)
    setError(null)
    try {
      const response = await reportAPI.getLateArrivalImages({ from: fromDate, to: toDate })

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/zip' })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `late-users-${fromDate}-to-${toDate}.zip`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Unable to export late arrival images. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  async function exportAbsentUsersAllBranches() {
    setExportingAbsentUsers(true)
    setError(null)
    try {
      const response = await reportAPI.getAbsentUsersImages({ from: fromDate, to: toDate })

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/zip' })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `absent-users-all-branches-${fromDate}-to-${toDate}.zip`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Unable to export absent users images. Please try again.')
    } finally {
      setExportingAbsentUsers(false)
    }
  }

  async function exportAbsentUsersBranchwise() {
    setExportingAbsentUsersBranchwise(true)
    setError(null)
    try {
      const response = await reportAPI.getAbsentUsersBranchwiseImages({ from: fromDate, to: toDate })

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/zip' })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `absent-users-branchwise-${fromDate}-to-${toDate}.zip`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Unable to export branch-wise absent users images. Please try again.')
    } finally {
      setExportingAbsentUsersBranchwise(false)
    }
  }

  async function exportAbsentUsersDepartmentwise() {
    setExportingAbsentUsersDepartmentwise(true)
    setError(null)
    try {
      const response = await reportAPI.getAbsentUsersDepartmentwiseImages({ from: fromDate, to: toDate })

      const blob = new Blob([response.data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `absent-users-departmentwise-${fromDate}-to-${toDate}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Unable to export department-wise absent users images. Please try again.')
    } finally {
      setExportingAbsentUsersDepartmentwise(false)
    }
  }


  function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            const escaped = String(value || '').replace(/"/g, '""')
            return `"${escaped}"`
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  function exportToExcel(data, filename) {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    const headers = Object.keys(data[0])
    const rows = data.map((row) => headers.map((header) => row[header] || ''))

    let htmlContent = '<table border="1"><tr>'
    headers.forEach((header) => {
      htmlContent += `<th>${header}</th>`
    })
    htmlContent += '</tr>'

    rows.forEach((row) => {
      htmlContent += '<tr>'
      row.forEach((cell) => {
        htmlContent += `<td>${cell}</td>`
      })
      htmlContent += '</tr>'
    })
    htmlContent += '</table>'

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  useEffect(() => {
    if (activeTab === 'employees') {
      loadEmployees()
    } else {
      loadAttendance()
    }
  }, [activeTab, fromDate, toDate])

  const bulkExportOptions = [
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

  const isBulkExporting = exporting || exportingAbsentUsers || exportingAbsentUsersBranchwise || exportingAbsentUsersDepartmentwise

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/50" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="flex items-start gap-4">
            <div className="hidden h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25 sm:flex">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                User Center
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Employee Directory &amp; Attendance</h1>
             
            </div>
          </div>

          <div className="inline-flex items-center gap-1 self-start rounded-2xl bg-slate-100/80 p-1.5 lg:self-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-md shadow-slate-900/5'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : ''}`} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {activeTab === 'employees' ? (
          <>
            <StatCard label="Total Employees" value={employeeMetrics.totalEmployees} icon={Users} tone="blue" />
            <StatCard label="Branches Covered" value={employeeMetrics.branches} icon={MapPin} tone="violet" />
            <StatCard label="With Work Email" value={employeeMetrics.emails} icon={Mail} tone="emerald" />
          </>
        ) : (
          <>
            <StatCard label="Total Records" value={attendanceMetrics.totalRecords} icon={FileText} tone="blue" />
            <StatCard label="Unique Employees" value={attendanceMetrics.uniqueEmployees} icon={Users} tone="violet" />
            <StatCard label="Avg Hours / Day" value={attendanceMetrics.averageHours} icon={Clock} tone="amber" />
          </>
        )}
      </div>

      {/* Toolbar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-1 flex-wrap items-end gap-3">
            {/* Search */}
            <label className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Search
              </span>
              <div className="flex w-[280px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/15">
                <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <input
                  type="search"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder={
                    activeTab === "employees"
                      ? "Name, email, branch..."
                      : "Employee, code..."
                  }
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                {searchText && (
                  <button
                    onClick={() => setSearchText('')}
                    className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </label>

            {/* Branch */}
            <label className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Branch
              </span>
              <div className="relative w-[190px]">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={branchFilter}
                  onChange={(event) => setBranchFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-8 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/15"
                >
                  {branchOptions.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch === "all" ? "All branches" : branch}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </label>

            {/* Date Filters */}
            {activeTab === "attendance" && (
              <>
                <label className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    From
                  </span>
                  <input
                    type="date"
                    value={fromDate}
                    max={toDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    className="w-[155px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/15"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    To
                  </span>
                  <input
                    type="date"
                    value={toDate}
                    min={fromDate}
                    onChange={(event) => setToDate(event.target.value)}
                    className="w-[155px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/15"
                  />
                </label>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {activeTab === 'attendance' && (
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu((open) => !open)}
                  disabled={isBulkExporting}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  {isBulkExporting ? 'Exporting…' : 'Bulk Exports'}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
                    <div className="border-b border-slate-100 px-4 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Image Packs</p>
                    </div>
                    {bulkExportOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.key}
                          onClick={() => {
                            option.onClick()
                            setShowExportMenu(false)
                          }}
                          disabled={option.loading}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${option.tone}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-slate-800">
                              {option.loading ? 'Preparing…' : option.label}
                            </span>
                            <span className="block truncate text-xs text-slate-400">{option.description}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                if (activeTab === "employees") {
                  exportToExcel(
                    filteredEmployees,
                    `employees_${new Date().toISOString().slice(0, 10)}.xls`
                  );
                } else {
                  exportToExcel(
                    filteredAttendance,
                    `attendance_${new Date().toISOString().slice(0, 10)}.xls`
                  );
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:shadow-lg hover:shadow-blue-500/30"
            >
              <Download className="h-3.5 w-3.5" />
              Excel
            </button>

            <button
              onClick={() => {
                if (activeTab === "employees") {
                  loadEmployees();
                } else {
                  loadAttendance();
                }
              }}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        {error ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
              <AlertCircle className="h-6 w-6 text-rose-500" />
            </div>
            <p className="text-sm font-medium text-rose-600">{error}</p>
            <button
              onClick={activeTab === 'employees' ? loadEmployees : loadAttendance}
              className="mt-1 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        ) : activeTab === 'employees' ? (
          loading ? (
            <SkeletonTable columns={6} />
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50/90 backdrop-blur">
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Employee</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Branch</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginatedEmployees.length ? (
                      paginatedEmployees.map((row, index) => (
                        <tr key={`${row.user_id}-${index}`} className="transition-colors hover:bg-slate-50/70">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <Avatar name={row.name || row.show_name} />
                              <span className="font-semibold text-slate-900">{row.name || row.show_name || '—'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-slate-600">{row.job_position || '—'}</td>
                          <td className="px-6 py-3.5">
                            <div className="flex flex-col gap-1 text-xs">
                              {row.work_email ? (
                                <span className="inline-flex items-center gap-1.5 text-slate-600">
                                  <Mail className="h-3 w-3 flex-shrink-0 text-slate-400" />
                                  <span className="truncate max-w-[180px]">{row.work_email}</span>
                                </span>
                              ) : null}
                              {(row.work_mobile || row.work_phone) ? (
                                <span className="inline-flex items-center gap-1.5 text-slate-600">
                                  <Phone className="h-3 w-3 flex-shrink-0 text-slate-400" />
                                  {row.work_mobile || row.work_phone}
                                </span>
                              ) : null}
                              {!row.work_email && !row.work_mobile && !row.work_phone && (
                                <span className="text-slate-400">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            {row.branch ? (
                              <Chip className="bg-blue-50 text-blue-700">{row.branch}</Chip>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-3.5">
                            {row.department ? (
                              <Chip className="bg-violet-50 text-violet-700">{row.department}</Chip>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <EmptyState message="No employee records found for the selected filters." />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredEmployees.length > 0 && (
                <Pagination
                  currentPage={currentEmployeePage}
                  totalPages={totalEmployeePages}
                  onChange={setCurrentEmployeePage}
                  label={`Showing ${(currentEmployeePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentEmployeePage * ITEMS_PER_PAGE, filteredEmployees.length)} of ${filteredEmployees.length} employees`}
                />
              )}
            </div>
          )
        ) : loading ? (
          <SkeletonTable columns={8} />
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur">
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Employee</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Emp Code</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Branch</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Department</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Punch Date</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Check In</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Check Out</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedAttendance.length ? (
                    paginatedAttendance.map((row, index) => (
                      <tr key={`${row.EmpCode}-${index}`} className="transition-colors hover:bg-slate-50/70">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={row.EmpName} />
                            <span className="font-semibold text-slate-900">{row.EmpName || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                            {row.EmpCode || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          {row.Branch_Name ? (
                            <Chip className="bg-blue-50 text-blue-700">{row.Branch_Name}</Chip>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5">
                          {row.Dept_Name ? (
                            <Chip className="bg-violet-50 text-violet-700">{row.Dept_Name}</Chip>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-slate-600">{row.PunchDateFormatted || row.PunchDate || '—'}</td>
                        <td className="px-6 py-3.5">
                          {row.CheckInTime ? (
                            <Chip className="bg-emerald-50 text-emerald-700">{row.CheckInTime}</Chip>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5">
                          {row.CheckOutTime ? (
                            <Chip className="bg-slate-100 text-slate-700">{row.CheckOutTime}</Chip>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 font-semibold text-slate-900">{row.TotalHours || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <EmptyState message="No attendance logs found for the selected filters." />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredAttendance.length > 0 && (
              <Pagination
                currentPage={currentAttendancePage}
                totalPages={totalAttendancePages}
                onChange={setCurrentAttendancePage}
                label={`Showing ${(currentAttendancePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentAttendancePage * ITEMS_PER_PAGE, filteredAttendance.length)} of ${filteredAttendance.length} records`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
