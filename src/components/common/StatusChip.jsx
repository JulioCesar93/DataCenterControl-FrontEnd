import { Chip } from '@mui/material'

const STATUS_MAP = {
  // Equipamento
  ATIVO:       { label: 'Ativo',        color: 'success' },
  INATIVO:     { label: 'Inativo',      color: 'default' },
  MANUTENCAO:  { label: 'Manutenção',   color: 'info'    },
  // Localização
  LIVRE:       { label: 'Livre',        color: 'success' },
  OCUPADO:     { label: 'Ocupado',      color: 'error'   },
  RESERVADO:   { label: 'Reservado',    color: 'warning' },
  // Ticket
  ABERTO:      { label: 'Aberto',       color: 'error'   },
  EM_ANDAMENTO:{ label: 'Em andamento', color: 'warning' },
  FECHADO:     { label: 'Fechado',      color: 'success' },
  // Tipo
  INCIDENTE:   { label: 'Incidente',    color: 'error'   },
  MUDANCA:     { label: 'Mudança',      color: 'info'    },
  PROBLEMA:    { label: 'Problema',     color: 'warning' },
}

export default function StatusChip({ value, size = 'small' }) {
  const cfg = STATUS_MAP[value] || { label: value, color: 'default' }
  return <Chip label={cfg.label} color={cfg.color} size={size} sx={{ fontWeight: 500 }} />
}
