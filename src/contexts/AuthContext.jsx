import { createContext, useContext, useState, useCallback } from 'react'
import { authAPI } from '../api'

const AuthContext = createContext(null)

// ── Mock users (remover quando o back-end estiver pronto) ─────────────────────
const MOCK_USERS = [
  { id: 1, nome: 'Admin DCIM',  email: 'admin@dcim.com',  role: 'ADMIN',    token: 'mock-jwt-admin-token'    },
  { id: 2, nome: 'Operador TI', email: 'op@dcim.com',     role: 'OPERADOR', token: 'mock-jwt-operador-token' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dcim_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      // ── Tenta o back-end real primeiro ──────────────────────────────────────
      // const { data } = await authAPI.login({ email, password })
      // const userData = { ...data.user, token: data.token }

      // ── Fallback: mock enquanto o back-end não está disponível ───────────────
      await new Promise((r) => setTimeout(r, 800)) // simula latência de rede
      const found = MOCK_USERS.find(
        (u) => u.email === email && password === 'admin123'
      )
      if (!found) throw new Error('Credenciais inválidas')
      const userData = { ...found }

      localStorage.setItem('dcim_token', userData.token)
      localStorage.setItem('dcim_user', JSON.stringify(userData))
      setUser(userData)
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('dcim_token')
    localStorage.removeItem('dcim_user')
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
