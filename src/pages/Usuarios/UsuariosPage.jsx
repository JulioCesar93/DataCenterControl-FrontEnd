import { Box, Card, CardContent, Typography, Avatar, Chip, Grid } from '@mui/material'
import { Lock } from '@mui/icons-material'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../contexts/AuthContext'

const MOCK_USERS = [
  { id: 1, nome: 'Admin DCIM',  email: 'admin@dcim.com', role: 'ADMIN',    ativo: true  },
  { id: 2, nome: 'Operador TI', email: 'op@dcim.com',    role: 'OPERADOR', ativo: true  },
  { id: 3, nome: 'Visualizador',email: 'vis@dcim.com',   role: 'VIEWER',   ativo: false },
]

const ROLE_COLORS = { ADMIN: 'error', OPERADOR: 'primary', VIEWER: 'default' }

export default function UsuariosPage() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 2 }}>
        <Lock sx={{ fontSize: 60, color: '#9AA0A6', opacity: 0.4 }} />
        <Typography variant="h6" sx={{ color: '#9AA0A6' }}>Acesso restrito</Typography>
        <Typography variant="body2" sx={{ color: '#9AA0A6' }}>Apenas administradores podem gerenciar usuários.</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader
        title="Usuários"
        subtitle="Gerenciamento de acesso ao sistema"
        breadcrumbs={['DCIM', 'Usuários']}
      />

      <Grid container spacing={2}>
        {MOCK_USERS.map((u) => (
          <Grid item xs={12} sm={6} md={4} key={u.id}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#1976D2', width: 44, height: 44, fontSize: 18 }}>
                  {u.nome[0]}
                </Avatar>
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Typography variant="subtitle2" noWrap>{u.nome}</Typography>
                  <Typography variant="caption" sx={{ color: '#9AA0A6' }}>{u.email}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, mt: 0.75 }}>
                    <Chip label={u.role} size="small" color={ROLE_COLORS[u.role] || 'default'} />
                    <Chip label={u.ativo ? 'Ativo' : 'Inativo'} size="small" color={u.ativo ? 'success' : 'default'} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="body2" sx={{ color: '#9AA0A6' }}>
            💡 A gestão completa de usuários (criação, edição, permissões e autenticação JWT) será integrada ao back-end Spring Boot.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
