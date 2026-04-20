import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import TataPage from './pages/TataPage'
import VIPage from './pages/VIPage'
import CombinedPage from './pages/CombinedPage'
import DispositionPage from './pages/DispositionPage'
import { QueryProvider } from './components/dashboard/providers/QueryProvider'
import UsersModule from './pages/users/user'

function AppContent() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mx-auto mb-4 animate-pulse"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {user && <Sidebar isOpen={mobileSidebarOpen} setIsOpen={setMobileSidebarOpen} />}
      
      <div className={user ? 'lg:ml-64' : ''}>
        <div className={user ? 'pt-16 lg:pt-0' : ''}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={user ? <Navigate to="/tata" replace /> : <Navigate to="/login" replace />} />
            <Route
              path="/tata"
              element={
                <ProtectedRoute>
                  <TataPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vi"
              element={
                <ProtectedRoute>
                  <VIPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/combined"
              element={
                <ProtectedRoute>
                  <CombinedPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/disposition"
              element={
                <ProtectedRoute>
                  <DispositionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersModule />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </QueryProvider>
  )
}
