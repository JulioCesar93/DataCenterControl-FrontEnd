import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, TextField, Button, Typography, InputAdornment,
  IconButton, Alert, CircularProgress, Divider,
} from '@mui/material'
import { Visibility, VisibilityOff, Lock, Email } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail]       = useState('admin@dcim.com')
  const [password, setPassword] = useState('admin123')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const { login, loading }      = useAuth()
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(email, password)
    if (result.ok) navigate('/')
    else setError(result.message)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 60% 40%, rgba(25,118,210,0.12) 0%, #121212 70%)',
        p: 2,
      }}
    >
      {/* Grid lines decoration */}
      <Box
        sx={{
          position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.03,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <Card
        sx={{
          width: '100%', maxWidth: 400,
          p: 4,
          background: '#1E1E1E',
          position: 'relative',
          boxShadow: '0 0 60px rgba(25,118,210,0.15)',
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 2,
              background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 800, color: '#fff',
              fontFamily: 'JetBrains Mono, monospace',
              mx: 'auto', mb: 2,
              boxShadow: '0 4px 20px rgba(25,118,210,0.4)',
            }}
          >DC</Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#E8EAED' }}>
            DCIM
          </Typography>
          <Typography variant="body2" sx={{ color: '#9AA0A6', mt: 0.5 }}>
            Data Center Infrastructure Management
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, borderColor: '#2C2C2C' }} />

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {error && (
            <Alert severity="error" sx={{ fontSize: '0.8125rem' }}>
              {error}
            </Alert>
          )}

          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#9AA0A6', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Senha"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#9AA0A6', fontSize: 18 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ mt: 1, py: 1.25, fontSize: '0.9375rem' }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Entrar'}
          </Button>
        </Box>

        <Box
          sx={{
            mt: 3, p: 1.5, borderRadius: 1.5,
            background: 'rgba(25,118,210,0.08)', border: '1px solid rgba(25,118,210,0.2)',
          }}
        >
          <Typography variant="caption" sx={{ color: '#9AA0A6', display: 'block', mb: 0.25 }}>
            🔧 Credenciais de desenvolvimento
          </Typography>
          <Typography variant="caption" sx={{ color: '#9AA0A6', fontFamily: 'JetBrains Mono, monospace' }}>
            admin@dcim.com / admin123
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}
