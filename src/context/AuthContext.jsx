import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import { api, setOnUnauthorized } from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'auth_token'

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload)
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)
  const [user, setUser] = useState(null)
  const logoutTimerRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthenticated = !!token

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current)
      logoutTimerRef.current = null
    }
  }

  const scheduleAutoLogout = (jwt) => {
    clearLogoutTimer()
    const payload = decodeJwt(jwt)
    if (payload?.exp) {
      const msUntilExp = payload.exp * 1000 - Date.now()
      if (msUntilExp > 0) {
        logoutTimerRef.current = setTimeout(() => {
          toast.error('Sessão expirada. Faça login novamente.')
          logout()
        }, msUntilExp)
      }
    }
  }

  useEffect(() => {
    // Setup global 401 handler
    setOnUnauthorized(() => {
      toast.error('Não autorizado ou token expirado.')
      logout()
    })
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
      scheduleAutoLogout(token)
      const payload = decodeJwt(token)
      if (payload) setUser({ id: payload.sub, email: payload.email, name: payload.name })
    } else {
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
      clearLogoutTimer()
    }
  }, [token])

  useEffect(() => {
    // If token exists but already expired, logout immediately
    if (token) {
      const payload = decodeJwt(token)
      if (payload?.exp && payload.exp * 1000 <= Date.now()) {
        toast.error('Sessão expirada. Faça login novamente.')
        logout()
      }
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password })
    if (res?.token) {
      setToken(res.token)
      toast.success('Login realizado!')
      navigate('/dashboard')
    } else {
      throw new Error('Resposta inválida do servidor')
    }
  }

  const register = async (name, email, password) => {
    await api.post('/register', { name, email, password })
    toast.success('Cadastro realizado! Faça login.')
    navigate('/login')
  }

  const logout = () => {
    setToken(null)
    // preserve from which page user was logged out
    if (location.pathname !== '/login') navigate('/login')
  }

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
  }), [token, user, isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
