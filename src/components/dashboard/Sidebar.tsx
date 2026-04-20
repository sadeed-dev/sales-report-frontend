// 'use client'

// import Link from 'next/link'
// import { LayoutDashboard, BarChart3, FileText, Users, Settings, LogOut } from 'lucide-react'
// import { cn } from '@/lib/utils'

// interface SidebarProps {
//   activeMenu?: string
// }

// export function Sidebar({ activeMenu = 'dashboard' }: SidebarProps) {
//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
//     { id: 'teams', label: 'Teams Performance', icon: Users, href: '/teams' },
//     { id: 'users', label: 'Users', icon: Users, href: '/users' },
//     { id: 'reports', label: 'Reports', icon: FileText, href: '/reports' },
//     { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
//   ]

//   return (
//     <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800/50 h-screen flex flex-col fixed left-0 top-0 z-50">
//       {/* Logo Section */}
//       <div className="p-6 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-transparent">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
//             <span className="text-white font-bold text-sm">VI</span>
//           </div>
//           <div className="flex-1">
//             <h1 className="font-bold text-white text-sm leading-tight">VI Analytics</h1>
//             <p className="text-xs text-slate-400">Sales Manager</p>
//           </div>
//         </div>
//       </div>

//       {/* Menu Section */}
//       <nav className="flex-1 p-4 space-y-1">
//         <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
//           Navigation
//         </p>
//         {menuItems.map((item) => {
//           const Icon = item.icon
//           const isActive = activeMenu === item.id
//           return (
//             <Link
//               key={item.id}
//               href={item.href}
//               className={cn(
//                 'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden',
//                 isActive
//                   ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
//                   : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
//               )}
//             >
//               <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
//               <span>{item.label}</span>
//               {isActive && (
//                 <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Footer */}
//       <div className="p-4 space-y-2 border-t border-slate-800/50">
//         <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all group">
//           <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
//           <span className="text-sm font-semibold">Settings</span>
//         </button>
//         <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-900/10 transition-all">
//           <LogOut className="w-5 h-5" />
//           <span className="text-sm font-semibold">Logout</span>
//         </button>
//       </div>
//     </div>
//   )
// }
