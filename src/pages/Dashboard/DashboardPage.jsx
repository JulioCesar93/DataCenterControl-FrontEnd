import { Box, Card, CardContent, Typography, LinearProgress, Grid, Chip } from '@mui/material'
import {
  Business, Computer, LocationOn, ConfirmationNumber, TrendingUp, Warning,
} from '@mui/icons-material'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { mockDashboard } from '../../utils/mockData'
import PageHeader from '../../components/common/PageHeader'

const STAT_CARDS = [
  { label: 'Clientes',     value: mockDashboard.clientes,     icon: <Business />,     color: '#1976D2', bg: 'rgba(25,118,210,0.12)'  },
  { label: 'Equipamentos', value: mockDashboard.equipamentos, icon: <Computer />,     color: '#00BCD4', bg: 'rgba(0,188,212,0.12)'    },
  { label: 'Locações',     value: mockDashboard.locacoes,     icon: <LocationOn />,   color: '#4CAF50', bg: 'rgba(76,175,80,0.12)'    },
  { label: 'Tickets',      value: mockDashboard.tickets,      icon: <ConfirmationNumber />, color: '#FFC107', bg: 'rgba(255,193,7,0.12)' },
]

const PIE_COLORS = ['#F44336', '#1976D2', '#FFC107']

const TooltipCustom = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <Box sx={{ background: '#252525', border: '1px solid #2C2C2C', borderRadius: 1.5, p: 1.5 }}>
      <Typography variant="caption" sx={{ color: '#9AA0A6' }}>{label}</Typography>
      {payload.map((p) => (
        <Box key={p.name} sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: p.fill, mt: '2px' }} />
          <Typography variant="caption" sx={{ color: '#E8EAED' }}>{p.name}: <strong>{p.value}</strong></Typography>
        </Box>
      ))}
    </Box>
  )
}

export default function DashboardPage() {
  const occ = mockDashboard.ocupacaoPct

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral da infraestrutura"
        breadcrumbs={['DCIM', 'Dashboard']}
        action={
          <Chip
            icon={<Warning sx={{ fontSize: 14 }} />}
            label={`${mockDashboard.ticketsAbertos} tickets abertos`}
            color="warning"
            size="small"
          />
        }
      />

      {/* ── Stat cards ──────────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {STAT_CARDS.map((c) => (
          <Grid item xs={12} sm={6} lg={3} key={c.label}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#9AA0A6', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                      {c.label}
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#E8EAED', mt: 0.5, fontFamily: 'JetBrains Mono, monospace' }}>
                      {c.value.toLocaleString('pt-BR')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 44, height: 44, borderRadius: 2,
                      bgcolor: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: c.color,
                    }}
                  >
                    {c.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Occupancy + charts ──────────────────────────────────────────────── */}
      <Grid container spacing={2}>
        {/* Rack occupancy bar */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6">Ocupação por Bastidor</Typography>
                <Chip icon={<TrendingUp sx={{ fontSize: 14 }} />} label={`${occ}% geral`} color="primary" size="small" />
              </Box>

              {/* Global bar */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#9AA0A6' }}>Ocupação Total</Typography>
                  <Typography variant="caption" sx={{ color: '#E8EAED', fontWeight: 600 }}>{occ}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={occ}
                  sx={{
                    height: 10, borderRadius: 5,
                    bgcolor: '#2C2C2C',
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, #1976D2 0%, ${occ > 85 ? '#F44336' : occ > 70 ? '#FFC107' : '#4CAF50'} 100%)`,
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockDashboard.ocupacaoData} barSize={16} barGap={2}>
                  <XAxis dataKey="bastidor" tick={{ fill: '#9AA0A6', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9AA0A6', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TooltipCustom />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#9AA0A6' }} />
                  <Bar dataKey="ocupados"  fill="#F44336" name="Ocupados"  radius={[3,3,0,0]} />
                  <Bar dataKey="reservados" fill="#FFC107" name="Reservados" radius={[3,3,0,0]} />
                  <Bar dataKey="livres"    fill="#4CAF50" name="Livres"    radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Tickets pie */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 2.5 }}>Tickets por Tipo</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={mockDashboard.ticketsPorTipo}
                    dataKey="total"
                    nameKey="tipo"
                    cx="50%" cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {mockDashboard.ticketsPorTipo.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<TooltipCustom />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#9AA0A6' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
