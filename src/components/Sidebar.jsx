import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, BarChart3, Settings, LogOut, ChevronDown, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ isOpen, setIsOpen }) {
  const [expandedReports, setExpandedReports] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { id: 'teams', label: 'Teams Performance', icon: Users, href: '#' },
    { id: 'reports', label: 'Reports', icon: FileText, href: '#', hasSubmenu: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '#' },
    { id: 'users', label: 'Users', icon: Users, href: '/users' },
  ]

  const reportSubItems = [
    { id: 'tata', label: 'Tata Call Logs', icon: '📊', href: '/tata' },
    { id: 'vi', label: 'VI Call Logs', icon: '📱', href: '/vi' },
    { id: 'combined', label: 'Combined Call Logs', icon: '📈', href: '/combined' },
    { id: 'disposition', label: 'Agent Wise Disposition', icon: '👥', href: '/disposition' },
  ]

  const isReportsActive = ['/tata', '/vi', '/combined', '/disposition'].includes(location.pathname)
  const activeMenu = location.pathname === '/users' ? 'users' : isReportsActive ? 'reports' : null

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 inline-flex items-center justify-center rounded-lg bg-slate-900 text-white p-2 shadow-lg"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/50"
        />
      )}

      <div className={`w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800/50 h-screen flex flex-col fixed left-0 top-0 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-sm">VI</span>
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-white text-sm leading-tight">VI Analytics</h1>
            <p className="text-xs text-slate-400">Sales Manager</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="lg:hidden text-slate-300 hover:text-white"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
          Navigation
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeMenu === item.id
          const ItemComponent = item.href && item.href !== '#' ? Link : 'button'
          const itemProps = item.href && item.href !== '#'
            ? { to: item.href, onClick: () => setIsOpen(false) }
            : { onClick: () => item.hasSubmenu && setExpandedReports(!expandedReports) }
          return (
            <div key={item.id}>
              <ItemComponent
                {...itemProps}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
                {item.hasSubmenu && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedReports ? 'rotate-180' : ''}`} />
                )}
              </ItemComponent>

              {/* Report Sub-items */}
              {item.hasSubmenu && expandedReports && (
                <div className="ml-4 mt-1 space-y-1 border-l border-slate-700/30 pl-3">
                  {reportSubItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.href}
                      onClick={() => setIsOpen(false)}
                      className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 block ${
                        location.pathname === subItem.href
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <span>{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-2 border-t border-slate-800/50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all group">
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm font-semibold">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-900/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
    </>
  )
}
