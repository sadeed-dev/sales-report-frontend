import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import apiClient from '../lib/api/client'
import { getTokenExpiry } from '../lib/token'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    delete apiClient.defaults.headers.common['Authorization']
    setUser(null)
    setError(null)
  }, [])

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (getTokenExpiry(token) > Date.now()) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser({ token })
    } else {
      logout()
    }
    setLoading(false)
  }, [logout])

  // Detect deployments even when the user leaves a dashboard open without requests.
  useEffect(() => {
    if (!user?.token) return
    const controller = new AbortController()
    const validateSession = async () => {
      try {
        await axios.get(`${API_BASE_URL}/users/session`, {
          headers: { Authorization: `Bearer ${user.token}` },
          signal: controller.signal,
          timeout: 10000,
        })
      } catch (err) {
        if (err.response?.status === 401 && localStorage.getItem('token') === user.token) {
          logout()
        }
      }
    }

    validateSession()
    const interval = window.setInterval(validateSession, 60000)
    window.addEventListener('focus', validateSession)
    return () => {
      controller.abort()
      window.clearInterval(interval)
      window.removeEventListener('focus', validateSession)
    }
  }, [user?.token, API_BASE_URL, logout])

  // Expire open sessions, including tabs resumed after the computer sleeps.
  useEffect(() => {
    if (!user?.token) return

    const checkExpiry = () => {
      if (getTokenExpiry(user.token) <= Date.now()) {
        logout()
      }
    }
    const timer = window.setTimeout(checkExpiry, Math.max(0, getTokenExpiry(user.token) - Date.now()))
    window.addEventListener('focus', checkExpiry)
    document.addEventListener('visibilitychange', checkExpiry)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('focus', checkExpiry)
      document.removeEventListener('visibilitychange', checkExpiry)
    }
  }, [user?.token, logout])

  useEffect(() => {
    const clients = [axios, apiClient]
    const interceptors = clients.map(client => client.interceptors.response.use(
      response => response,
      err => {
        const token = localStorage.getItem('token')
        if (err.response?.status === 401 && token && err.config?.headers?.Authorization === `Bearer ${token}` && !err.config?.url?.endsWith('/users/login')) {
          logout()
        }
        return Promise.reject(err)
      },
    ))

    return () => clients.forEach((client, index) => client.interceptors.response.eject(interceptors[index]))
  }, [logout])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      })

      const { token, data } = response.data
      if (getTokenExpiry(token) <= Date.now()) {
        throw new Error('Your session has expired. Please login again.')
      }
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser({ ...data.user, token })
      return { success: true, data: data.user }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
