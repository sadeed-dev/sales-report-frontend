'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface DashboardLayoutProps {
  sidebar: React.ReactNode
  // header: React.ReactNode
  children: React.ReactNode
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className="hidden lg:block">
        {sidebar}
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-900 hover:bg-slate-50 transition-colors shadow-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed left-0 top-0 z-45 lg:hidden">
          {sidebar}
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {headers}
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
