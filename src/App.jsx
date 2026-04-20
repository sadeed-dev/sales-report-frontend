import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TataPage from './pages/TataPage'
import VIPage from './pages/VIPage'
import CombinedPage from './pages/CombinedPage'
import DispositionPage from './pages/DispositionPage'
import { QueryProvider } from './components/dashboard/providers/QueryProvider'
import UsersModule from './pages/users/user'

export default function App() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <QueryProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
          <Sidebar isOpen={mobileSidebarOpen} setIsOpen={setMobileSidebarOpen} />
          
          <div className="lg:ml-64">
            {/* <Header /> */}
            <div className="pt-16 lg:pt-0">
              <Routes>
                <Route path="/" element={<Navigate to="/tata" replace />} />
                <Route path="/tata" element={<TataPage />} />
                <Route path="/vi" element={<VIPage />} />
                <Route path="/combined" element={<CombinedPage />} />
                <Route path="/disposition" element={<DispositionPage />} />
                <Route path="/users" element={<UsersModule />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </QueryProvider>
  )
}
