'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, RefreshCcw, Users, CalendarDays, MapPin, Clock, FileText, Download, ChevronLeft, ChevronRight } from 'lucide-react'
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

  const [exporting, setExporting] = useState(false)
  const [exportingAbsentUsers, setExportingAbsentUsers] = useState(false)
  const [exportingAbsentUsersBranchwise, setExportingAbsentUsersBranchwise] = useState(false)

  const ITEMS_PER_PAGE = 10

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

  function getPaginationPages(currentPage, totalPages) {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages = []
    const delta = 1
    const left = Math.max(2, currentPage - delta)
    const right = Math.min(totalPages - 1, currentPage + delta)

    pages.push(1)
    if (left > 2) pages.push('ellipsis')

    for (let page = left; page <= right; page += 1) {
      pages.push(page)
    }

    if (right < totalPages - 1) pages.push('ellipsis')
    pages.push(totalPages)

    return pages
  }

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

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-900/5 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-600 font-semibold">User Center</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Employee Directory & Attendance</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              View live employee profiles and attendance logs with smart filtering, branch segmentation, and quick refresh.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id )}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
  {/* Filters Section */}
  <div className="grid gap-3 lg:grid-cols-[1fr_auto] items-end">
    
    {/* Left Filters */}
    <div className="flex flex-wrap items-end gap-3">
      
      {/* Search */}
      <label className="space-y-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Search
        </span>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 w-[280px]">
          <Search className="h-4 w-4 text-slate-400" />
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
        </div>
      </label>

      {/* Branch */}
      <label className="space-y-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Branch
        </span>
        <select
          value={branchFilter}
          onChange={(event) => setBranchFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none w-[180px]"
        >
          {branchOptions.map((branch) => (
            <option key={branch} value={branch}>
              {branch === "all" ? "All branches" : branch}
            </option>
          ))}
        </select>
      </label>

      {/* Date Filters */}
      {activeTab === "attendance" && (
        <>
          <label className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              From
            </span>
            <input
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none w-[150px]"
            />
          </label>

          <label className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              To
            </span>
            <input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(event) => setToDate(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none w-[150px]"
            />
          </label>
        </>
      )}
    </div>

    {/* Right Actions */}
    <div className="flex flex-wrap items-center justify-end gap-2">
  {activeTab === 'attendance' && (
  <>
  <button
    onClick={exportLateArrivalImages}
    disabled={exporting}
    className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Download className="h-3 w-3" />
    {exporting ? '...' : 'late arrivals'}
  </button>

  <button
    onClick={exportAbsentUsersAllBranches}
    disabled={exportingAbsentUsers}
    className="inline-flex items-center gap-1 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Download className="h-3 w-3" />
    {exportingAbsentUsers ? '...' : 'absent users'}
  </button>

  <button
    onClick={exportAbsentUsersBranchwise}
    disabled={exportingAbsentUsersBranchwise}
    className="inline-flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Download className="h-3 w-3" />
    {exportingAbsentUsersBranchwise ? '...' : 'absent (branch)'}
  </button>
  </>
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
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
      >
        <Download className="h-4 w-4" />
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
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
      >
        <RefreshCcw className="h-4 w-4" />
        Refresh
      </button>
    </div>

   
  </div>

  {/* Compact Metrics */}
  <div className="flex gap-3 pt-2 border-t border-slate-100 w-fit">
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
      <FileText className="h-4 w-4 text-slate-600" />
      <div>
        <p className="text-[10px] text-slate-500">
          {activeTab === "employees" ? "Employees" : "Records"}
        </p>
        <p className="text-sm font-bold text-slate-900">
          {activeTab === "employees"
            ? employeeMetrics.totalEmployees
            : attendanceMetrics.totalRecords}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
      <MapPin className="h-4 w-4 text-blue-600" />
      <div>
        <p className="text-[10px] text-blue-600">
          {activeTab === "employees" ? "Branches" : "Employees"}
        </p>
        <p className="text-sm font-bold text-blue-900">
          {activeTab === "employees"
            ? employeeMetrics.branches
            : attendanceMetrics.uniqueEmployees}
        </p>
      </div>
    </div>
  </div>
</div>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center text-slate-500">Loading data…</div>
            ) : error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
            ) : activeTab === 'employees' ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Name</th>
                        <th className="px-4 py-3 text-left font-medium">Role</th>
                        <th className="px-4 py-3 text-left font-medium">Email</th>
                        <th className="px-4 py-3 text-left font-medium">Branch</th>
                        <th className="px-4 py-3 text-left font-medium">Department</th>
                        <th className="px-4 py-3 text-left font-medium">Work Mobile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {paginatedEmployees.length ? (
                        paginatedEmployees.map((row, index) => (
                          <tr key={`${row.user_id}-${index}`} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-4 font-semibold text-slate-900">{row.name || row.show_name || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.job_position || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.work_email || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.branch || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.department || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.work_mobile || row.work_phone || '—'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                            No employee records found for the selected filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {filteredEmployees.length > 0 && (
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-600">
                      Showing {(currentEmployeePage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentEmployeePage * ITEMS_PER_PAGE, filteredEmployees.length)} of {filteredEmployees.length} employees
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentEmployeePage(Math.max(1, currentEmployeePage - 1))}
                        disabled={currentEmployeePage === 1}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {getPaginationPages(currentEmployeePage, totalEmployeePages).map((page, index) =>
                          page === 'ellipsis' ? (
                            <span key={`ellipsis-${index}`} className="inline-flex h-8 items-center px-2 text-sm text-slate-400">
                              …
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => setCurrentEmployeePage(page)}
                              className={`h-8 min-w-[32px] rounded-lg px-2 text-sm font-medium transition ${
                                currentEmployeePage === page
                                  ? 'bg-blue-500 text-white'
                                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}
                      </div>
                      <button
                        onClick={() => setCurrentEmployeePage(Math.min(totalEmployeePages, currentEmployeePage + 1))}
                        disabled={currentEmployeePage === totalEmployeePages}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Employee</th>
                        <th className="px-4 py-3 text-left font-medium">Emp Code</th>
                        <th className="px-4 py-3 text-left font-medium">Branch</th>
                        <th className="px-4 py-3 text-left font-medium">Department</th>
                        <th className="px-4 py-3 text-left font-medium">Punch Date</th>
                        <th className="px-4 py-3 text-left font-medium">Check In</th>
                        <th className="px-4 py-3 text-left font-medium">Check Out</th>
                        <th className="px-4 py-3 text-left font-medium">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {paginatedAttendance.length ? (
                        paginatedAttendance.map((row, index) => (
                          <tr key={`${row.EmpCode}-${index}`} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-4 font-semibold text-slate-900">{row.EmpName || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.EmpCode || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.Branch_Name || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.Dept_Name || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.PunchDateFormatted || row.PunchDate || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.CheckInTime || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.CheckOutTime || '—'}</td>
                            <td className="px-4 py-4 text-slate-600">{row.TotalHours || '—'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                            No attendance logs found for the selected filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {filteredAttendance.length > 0 && (
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-600">
                      Showing {(currentAttendancePage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentAttendancePage * ITEMS_PER_PAGE, filteredAttendance.length)} of {filteredAttendance.length} records
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentAttendancePage(Math.max(1, currentAttendancePage - 1))}
                        disabled={currentAttendancePage === 1}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {getPaginationPages(currentAttendancePage, totalAttendancePages).map((page, index) =>
                          page === 'ellipsis' ? (
                            <span key={`ellipsis-${index}`} className="inline-flex h-8 items-center px-2 text-sm text-slate-400">
                              …
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => setCurrentAttendancePage(page)}
                              className={`h-8 min-w-[32px] rounded-lg px-2 text-sm font-medium transition ${
                                currentAttendancePage === page
                                  ? 'bg-blue-500 text-white'
                                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}
                      </div>
                      <button
                        onClick={() => setCurrentAttendancePage(Math.min(totalAttendancePages, currentAttendancePage + 1))}
                        disabled={currentAttendancePage === totalAttendancePages}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
