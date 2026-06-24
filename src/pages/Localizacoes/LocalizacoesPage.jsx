import { useState } from 'react'
import {
  Box, Card, CardContent, Typography, Select, MenuItem, FormControl,
  InputLabel, Grid, Chip, Tooltip, Paper,
} from '@mui/material'
import { gerarRack, mockLocalizacoes } from '../../utils/mockData'
import PageHeader from '../../components/common/PageHeader'
import { rackColors } from '../../theme'

const BASTIDORES = ['R01', 'R02', 'R03', 'R04']

function RackSlot({ slot, onClick }) {
  const cfg = rackColors[slot.status] || rackColors.LIVRE
  const isOccupied = slot.status !== 'LIVRE'

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="caption" display="block" sx={{ fontWeight: 600 }}>U{slot.u} — {cfg.label}</Typography>
          {slot.hostname && <Typography variant="caption" display="block">{slot.hostname}</Typography>}
          {slot.serialTag && <Typography variant="caption" display="block" sx={{ color: '#9AA0A6' }}>{slot.serialTag}</Typography>}
        </Box>
      }
      placement="right"
      arrow
    >
      <Box
        onClick={() => onClick(slot)}
        sx={{
          height: 24,
          borderRadius: 0.5,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          display: 'flex',
          alignItems: 'center',
          px: 1,
          cursor: 'pointer',
          transition: 'all 0.12s ease',
          '&:hover': { filter: 'brightness(1.3)' },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.65rem',
            color: '#9AA0A6',
            minWidth: 28,
            flexShrink: 0,
          }}
        >
          U{String(slot.u).padStart(2, '0')}
        </Typography>
        <Box sx={{ flex: 1, mx: 0.5, height: 8, bgcolor: cfg.border, opacity: 0.3, borderRadius: 1 }} />
        {slot.hostname && (
          <Typography
            variant="caption"
            noWrap
            sx={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              color: cfg.text,
              fontWeight: 600,
              maxWidth: 110,
            }}
          >
            {slot.hostname}
          </Typography>
        )}
      </Box>
    </Tooltip>
  )
}

export default function LocalizacoesPage() {
  const [bastidor, setBastidor] = useState('R01')
  const [selected, setSelected] = useState(null)
  const rack = gerarRack(bastidor)

  const summary = {
    LIVRE:     rack.filter((s) => s.status === 'LIVRE').length,
    OCUPADO:   rack.filter((s) => s.status === 'OCUPADO').length,
    RESERVADO: rack.filter((s) => s.status === 'RESERVADO').length,
  }
  const ocupacaoPct = Math.round((summary.OCUPADO / rack.length) * 100)

  return (
    <Box>
      <PageHeader
        title="Localizações"
        subtitle="Visualização de racks e posições"
        breadcrumbs={['DCIM', 'Localizações']}
      />

      <Grid container spacing={2}>
        {/* ── Rack selector ─────────────────────────────────────────────────── */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Bastidor</InputLabel>
                <Select value={bastidor} onChange={(e) => { setBastidor(e.target.value); setSelected(null) }} label="Bastidor">
                  {BASTIDORES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {Object.entries(rackColors).map(([key, cfg]) => (
                  <Chip
                    key={key}
                    label={`${cfg.label}: ${summary[key] ?? 0}`}
                    size="small"
                    sx={{ bgcolor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, fontWeight: 500 }}
                  />
                ))}
                <Chip label={`Ocupação: ${ocupacaoPct}%`} size="small" color="primary" sx={{ fontWeight: 600 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Rack visualization ────────────────────────────────────────────── */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                RACK — {bastidor} &nbsp;
                <Typography component="span" variant="caption" sx={{ color: '#9AA0A6' }}>42U</Typography>
              </Typography>

              {/* Rack frame */}
              <Paper
                elevation={0}
                sx={{
                  background: '#141414',
                  border: '2px solid #333',
                  borderRadius: 2,
                  p: 1.5,
                  position: 'relative',
                }}
              >
                {/* Top panel */}
                <Box sx={{ height: 8, bgcolor: '#252525', borderRadius: 1, mb: 1, border: '1px solid #333' }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {rack.map((slot) => (
                    <RackSlot key={slot.u} slot={slot} onClick={setSelected} />
                  ))}
                </Box>

                {/* Bottom panel */}
                <Box sx={{ height: 8, bgcolor: '#252525', borderRadius: 1, mt: 1, border: '1px solid #333' }} />

                {/* Side rails decoration */}
                <Box sx={{ position: 'absolute', left: 4, top: 12, bottom: 12, width: 4, bgcolor: '#252525', borderRadius: 1 }} />
                <Box sx={{ position: 'absolute', right: 4, top: 12, bottom: 12, width: 4, bgcolor: '#252525', borderRadius: 1 }} />
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Detail panel ──────────────────────────────────────────────────── */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selected ? `Posição U${selected.u}` : 'Detalhes da Posição'}
              </Typography>

              {!selected ? (
                <Box sx={{ textAlign: 'center', py: 6, color: '#9AA0A6' }}>
                  <Typography variant="body2">Clique em uma posição no rack para ver detalhes</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    { label: 'Bastidor', value: bastidor },
                    { label: 'Posição', value: `U${selected.u}` },
                    { label: 'Status', value: rackColors[selected.status]?.label || selected.status },
                    { label: 'Hostname', value: selected.hostname || '—' },
                    { label: 'Serial / Tag', value: selected.serialTag || '—' },
                    { label: 'Altura', value: selected.uSize ? `${selected.uSize}U` : '1U' },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #2C2C2C' }}>
                      <Typography variant="body2" sx={{ color: '#9AA0A6' }}>{label}</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontFamily: ['Hostname', 'Serial / Tag', 'Posição', 'Bastidor'].includes(label)
                            ? 'JetBrains Mono, monospace' : 'inherit',
                          color: selected.hostname && label === 'Hostname' ? '#42A5F5' : '#E8EAED',
                        }}
                      >
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Legend ────────────────────────────────────────────────────────── */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', py: '10px !important', flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ color: '#9AA0A6', mr: 1 }}>Legenda:</Typography>
              {Object.values(rackColors).map((cfg) => (
                <Box key={cfg.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: cfg.bg, border: `1px solid ${cfg.border}` }} />
                  <Typography variant="caption" sx={{ color: '#9AA0A6' }}>{cfg.label}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
