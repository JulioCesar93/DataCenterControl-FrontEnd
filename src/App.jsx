import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { theme } from './theme'
import { AuthProvider, useAuth } from './contexts/AuthContext'

import LoginPage         from './pages/Login/LoginPage'
import Sidebar           from './components/layout/Sidebar'
import DashboardPage     from './pages/Dashboard/DashboardPage'
import ClientesPage      from './pages/Clientes/ClientesPage'
import EquipamentosPage  from './pages/Equipamentos/EquipamentosPage'
import LocalizacoesPage  from './pages/Localizacoes/LocalizacoesPage'
import TicketsPage       from './pages/Tickets/TicketsPage'
import UsuariosPage      from './pages/Usuarios/UsuariosPage'

function AppRoutes() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Sidebar>
      <Routes>
        <Route path="/"              element={<DashboardPage />}    />
        <Route path="/clientes"      element={<ClientesPage />}     />
        <Route path="/equipamentos"  element={<EquipamentosPage />} />
        <Route path="/localizacoes"  element={<LocalizacoesPage />} />
        <Route path="/tickets"       element={<TicketsPage />}      />
        <Route path="/usuarios"      element={<UsuariosPage />}     />
        <Route path="*"              element={<Navigate to="/" />}  />
      </Routes>
    </Sidebar>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3000}
      >
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  )
}
