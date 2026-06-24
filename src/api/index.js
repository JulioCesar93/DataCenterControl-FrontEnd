import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: inject JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dcim_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 ─────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dcim_token')
      localStorage.removeItem('dcim_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ── Endpoints ─────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: ()          => api.post('/auth/logout'),
  me:     ()          => api.get('/auth/me'),
}

export const clientesAPI = {
  listar:  (params) => api.get('/clientes', { params }),
  buscar:  (id)     => api.get(`/clientes/${id}`),
  criar:   (data)   => api.post('/clientes', data),
  atualizar:(id, data) => api.put(`/clientes/${id}`, data),
  excluir: (id)     => api.delete(`/clientes/${id}`),
}

export const equipamentosAPI = {
  listar:  (params) => api.get('/equipamentos', { params }),
  buscar:  (id)     => api.get(`/equipamentos/${id}`),
  criar:   (data)   => api.post('/equipamentos', data),
  atualizar:(id, data) => api.put(`/equipamentos/${id}`, data),
  excluir: (id)     => api.delete(`/equipamentos/${id}`),
}

export const localizacoesAPI = {
  listar:  (params) => api.get('/localizacoes', { params }),
  buscar:  (id)     => api.get(`/localizacoes/${id}`),
  criar:   (data)   => api.post('/localizacoes', data),
  atualizar:(id, data) => api.put(`/localizacoes/${id}`, data),
  excluir: (id)     => api.delete(`/localizacoes/${id}`),
  rack:    (bastidor) => api.get(`/localizacoes/rack/${bastidor}`),
}

export const ticketsAPI = {
  listar:  (params) => api.get('/tickets', { params }),
  buscar:  (id)     => api.get(`/tickets/${id}`),
  criar:   (data)   => api.post('/tickets', data),
  atualizar:(id, data) => api.put(`/tickets/${id}`, data),
  excluir: (id)     => api.delete(`/tickets/${id}`),
}

export const dashboardAPI = {
  resumo: () => api.get('/dashboard/resumo'),
  ocupacao: () => api.get('/dashboard/ocupacao'),
}
