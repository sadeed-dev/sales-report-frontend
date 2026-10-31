import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, BarChart3, Settings, LogOut, ChevronDown, Menu, X, Phone, Layers, ListChecks, Trophy, PhoneIncoming } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const reportItems = [
  { label: 'VI Call Logs', icon: Phone, href: '/vi' },
  { label: 'Combined Call Logs', icon: Layers, href: '/combined' },
  { label: 'Agent Wise Disposition', icon: ListChecks, href: '/disposition' },
  { label: 'Lead List Performance', icon: Trophy, href: '/lead-lists' },
  { label: 'Campaign Wise Disposition', icon: BarChart3, href: '/campaigns' },
  { label: 'Website Inbound Calls', icon: PhoneIncoming, href: '/inbound-calls' },
]

export default function Sidebar({ isOpen, setIsOpen }) {
  const [expandedReports, setExpandedReports] = useState(true)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const isReportsActive = reportItems.some((item) => item.href === pathname)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="sidebar-mobile-toggle lg:hidden" aria-label="Open navigation" aria-expanded={isOpen} aria-controls="main-sidebar">
        <Menu size={20} />
      </button>
      {isOpen && <button type="button" aria-label="Close navigation overlay" onClick={() => setIsOpen(false)} className="lg:hidden fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm" />}
      <aside id="main-sidebar" className={`app-sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark"><BarChart3 size={22} /></div>
          <div className="flex-1"><p className="text-sm font-semibold tracking-tight text-white">Sales Analytics</p><p className="mt-1 text-xs text-slate-400">Sales Manager</p></div>
          <button type="button" onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 p-1" aria-label="Close navigation"><X size={20} /></button>
        </div>
        <nav aria-label="Main navigation" className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-6">
          <p className="sidebar-section-label">Workspace</p>
          <button type="button" className="sidebar-link"><LayoutDashboard size={18} /><span>Dashboard</span></button>
          <button type="button" className="sidebar-link"><Users size={18} /><span>Teams Performance</span></button>
          <button type="button" onClick={() => setExpandedReports(!expandedReports)} aria-expanded={expandedReports} aria-controls="report-navigation" className={`sidebar-link ${isReportsActive ? 'sidebar-parent-active' : ''}`}>
            <FileText size={18} /><span className="flex-1 text-left">Reports</span><ChevronDown size={15} className={`transition-transform ${expandedReports ? 'rotate-180' : ''}`} />
          </button>
          {expandedReports && (
            <div id="report-navigation" className="sidebar-report-list">
              {reportItems.map(({ label, icon: Icon, href }) => (
                <Link key={href} to={href} onClick={() => setIsOpen(false)} aria-current={pathname === href ? 'page' : undefined} className={`sidebar-report-link ${pathname === href ? 'sidebar-report-active' : ''}`}>
                  <Icon size={16} strokeWidth={1.7} /><span>{label}</span>
                </Link>
              ))}
            </div>
          )}
          <Link to="/users" onClick={() => setIsOpen(false)} aria-current={pathname === '/users' ? 'page' : undefined} className={`sidebar-link ${pathname === '/users' ? 'sidebar-parent-active' : ''}`}><Users size={18} /><span>Users</span></Link>
          <button type="button" className="sidebar-link"><BarChart3 size={18} /><span>Analytics</span></button>
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="sidebar-link"><Settings size={18} /><span>Settings</span></button>
          <button type="button" onClick={handleLogout} className="sidebar-link sidebar-logout"><LogOut size={18} /><span>Logout</span></button>
        </div>
      </aside>
    </>
  )
}
