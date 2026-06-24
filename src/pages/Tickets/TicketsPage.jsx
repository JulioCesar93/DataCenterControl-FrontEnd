import { useState } from 'react'
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Button, TextField, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Typography, Tooltip,
  MenuItem, Select, FormControl, InputLabel, TablePagination,
} from '@mui/material'
import { Add, Edit, Delete, Search, ConfirmationNumber } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { mockTickets } from '../../utils/mockData'
import PageHeader from '../../components/common/PageHeader'
import StatusChip from '../../components/common/StatusChip'

const EMPTY = {
  clienteAfetado: '', equipamentoTicket: '', localizacao: '',
  tipo: 'INCIDENTE', descricao: '', rdm: '', osControl: '',
}

const formatDate = (d) =>
  d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—'

export default function TicketsPage() {
  const [rows, setRows]           = useState(mockTickets)
  const [filter, setFilter]       = useState('')
  const [dialog, setDialog]       = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [delDialog, setDelDialog] = useState(null)
  const [page, setPage]           = useState(0)
  const { enqueueSnackbar }       = useSnackbar()

  const filtered = rows.filter(
    (r) =>
      r.clienteAfetado.toLowerCase().includes(filter.toLowerCase()) ||
      r.equipamentoTicket.toLowerCase().includes(filter.toLowerCase()) ||
      r.tipo.toLowerCase().includes(filter.toLowerCase())
  )
  const paged = filtered.slice(page * 10, page * 10 + 10)

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  const openCreate = () => { setEditing(null); setForm(EMPTY); setDialog(true) }
  const openEdit   = (row) => {
    setEditing(row)
    setForm({ clienteAfetado: row.clienteAfetado, equipamentoTicket: row.equipamentoTicket, localizacao: row.localizacao, tipo: row.tipo, descricao: row.descricao ?? '', rdm: row.rdm ?? '', osControl: row.osControl ?? '' })
    setDialog(true)
  }

  const handleSave = () => {
    if (!form.clienteAfetado || !form.tipo) {
      enqueueSnackbar('Preencha os campos obrigatórios', { variant: 'warning' }); return
    }
    if (editing) {
      setRows((r) => r.map((x) => x.id === editing.id ? { ...x, ...form } : x))
      enqueueSnackbar('Ticket atualizado!', { variant: 'success' })
    } else {
      setRows((r) => [...r, { id: Date.now(), ...form, dataAbertura: new Date().toISOString(), dataFechamento: null, act: null, evl: null }])
      enqueueSnackbar('Ticket aberto!', { variant: 'success' })
    }
    setDialog(false)
  }

  const handleDelete = () => {
    setRows((r) => r.filter((x) => x.id !== delDialog.id))
    enqueueSnackbar('Ticket excluído', { variant: 'info' })
    setDelDialog(null)
  }

  return (
    <Box>
      <PageHeader
        title="Tickets"
        subtitle={`${rows.length} ordens de serviço`}
        breadcrumbs={['DCIM', 'Tickets']}
        action={
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            Abrir Ticket
          </Button>
        }
      />

      <Card>
        <Box sx={{ p: 2, borderBottom: '1px solid #2C2C2C' }}>
          <TextField
            placeholder="Buscar por cliente, equipamento ou tipo..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ width: 380 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#9AA0A6', fontSize: 18 }} /></InputAdornment>,
            }}
          />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>OS</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Equipamento</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Abertura</TableCell>
                <TableCell>Fechamento</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#9AA0A6' }}>
                    <ConfirmationNumber sx={{ fontSize: 40, mb: 1, display: 'block', mx: 'auto', opacity: 0.3 }} />
                    Nenhum ticket encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#9AA0A6' }}>
                      #{row.osControl || row.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{row.clienteAfetado}</TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8125rem', color: '#42A5F5' }}>
                      {row.equipamentoTicket}
                    </TableCell>
                    <TableCell><StatusChip value={row.tipo} /></TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#9AA0A6' }}>{formatDate(row.dataAbertura)}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: row.dataFechamento ? '#4CAF50' : '#9AA0A6' }}>
                      {formatDate(row.dataFechamento)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => openEdit(row)} sx={{ color: '#1976D2' }}><Edit fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" onClick={() => setDelDialog(row)} sx={{ color: '#F44336' }}><Delete fontSize="small" /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div" count={filtered.length} page={page} rowsPerPage={10} rowsPerPageOptions={[10]}
          onPageChange={(_, p) => setPage(p)}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
          sx={{ borderTop: '1px solid #2C2C2C', color: '#9AA0A6' }}
        />
      </Card>

      {/* ── Dialog ──────────────────────────────────────────────────────────── */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar Ticket' : 'Abrir Ticket'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, pt: '16px !important' }}>
          <TextField label="Cliente afetado *" value={form.clienteAfetado} onChange={f('clienteAfetado')} fullWidth />
          <TextField label="Equipamento" value={form.equipamentoTicket} onChange={f('equipamentoTicket')} fullWidth />
          <TextField label="Localização" value={form.localizacao} onChange={f('localizacao')} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Tipo *</InputLabel>
            <Select value={form.tipo} onChange={f('tipo')} label="Tipo *" size="small">
              <MenuItem value="INCIDENTE">Incidente</MenuItem>
              <MenuItem value="MUDANCA">Mudança</MenuItem>
              <MenuItem value="PROBLEMA">Problema</MenuItem>
              <MenuItem value="MANUTENCAO">Manutenção</MenuItem>
            </Select>
          </FormControl>
          <TextField label="OS Control" value={form.osControl} onChange={f('osControl')} fullWidth />
          <TextField label="RDM" value={form.rdm} onChange={f('rdm')} fullWidth />
          <TextField label="Descrição" value={form.descricao} onChange={f('descricao')} fullWidth multiline rows={3} sx={{ gridColumn: '1 / -1' }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(delDialog)} onClose={() => setDelDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>Excluir o ticket de <strong>{delDialog?.clienteAfetado}</strong>?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDelDialog(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
