import { useState } from 'react'
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Button, TextField, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Typography, Tooltip,
  MenuItem, Select, FormControl, InputLabel, TablePagination, Chip,
} from '@mui/material'
import { Add, Edit, Delete, Search, Computer } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { mockEquipamentos, mockClientes } from '../../utils/mockData'
import PageHeader from '../../components/common/PageHeader'
import StatusChip from '../../components/common/StatusChip'

const EMPTY = { hostname: '', serialTag: '', nucleos: '', statusEquipamento: 'ATIVO', clienteId: '', alturaU: 1 }

export default function EquipamentosPage() {
  const [rows, setRows]           = useState(mockEquipamentos)
  const [filter, setFilter]       = useState('')
  const [dialog, setDialog]       = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [delDialog, setDelDialog] = useState(null)
  const [page, setPage]           = useState(0)
  const { enqueueSnackbar }       = useSnackbar()

  const filtered = rows.filter(
    (r) =>
      r.hostname.toLowerCase().includes(filter.toLowerCase()) ||
      r.serialTag.toLowerCase().includes(filter.toLowerCase()) ||
      r.clienteNome?.toLowerCase().includes(filter.toLowerCase())
  )
  const paged = filtered.slice(page * 10, page * 10 + 10)

  const openCreate = () => { setEditing(null); setForm(EMPTY); setDialog(true) }
  const openEdit   = (row) => {
    setEditing(row)
    setForm({ hostname: row.hostname, serialTag: row.serialTag, nucleos: row.nucleos ?? '', statusEquipamento: row.statusEquipamento, clienteId: row.clienteId, alturaU: row.alturaU })
    setDialog(true)
  }

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSave = () => {
    if (!form.hostname || !form.serialTag || !form.clienteId) {
      enqueueSnackbar('Preencha os campos obrigatórios', { variant: 'warning' }); return
    }
    const cliente = mockClientes.find((c) => c.id === Number(form.clienteId))
    if (editing) {
      setRows((r) => r.map((x) => x.id === editing.id ? { ...x, ...form, clienteId: Number(form.clienteId), clienteNome: cliente?.nome } : x))
      enqueueSnackbar('Equipamento atualizado!', { variant: 'success' })
    } else {
      setRows((r) => [...r, { id: Date.now(), ...form, clienteId: Number(form.clienteId), clienteNome: cliente?.nome, nucleos: form.nucleos ? Number(form.nucleos) : null }])
      enqueueSnackbar('Equipamento criado!', { variant: 'success' })
    }
    setDialog(false)
  }

  const handleDelete = () => {
    setRows((r) => r.filter((x) => x.id !== delDialog.id))
    enqueueSnackbar('Equipamento excluído', { variant: 'info' })
    setDelDialog(null)
  }

  return (
    <Box>
      <PageHeader
        title="Equipamentos"
        subtitle={`${rows.length} equipamentos cadastrados`}
        breadcrumbs={['DCIM', 'Equipamentos']}
        action={
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            Novo Equipamento
          </Button>
        }
      />

      <Card>
        <Box sx={{ p: 2, borderBottom: '1px solid #2C2C2C' }}>
          <TextField
            placeholder="Buscar por hostname, serial ou cliente..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ width: 360 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#9AA0A6', fontSize: 18 }} /></InputAdornment>,
            }}
          />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Hostname</TableCell>
                <TableCell>Serial / Tag</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell align="center">Núcleos</TableCell>
                <TableCell align="center">U</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#9AA0A6' }}>
                    <Computer sx={{ fontSize: 40, mb: 1, display: 'block', mx: 'auto', opacity: 0.3 }} />
                    Nenhum equipamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#42A5F5' }}>
                      {row.hostname}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#9AA0A6' }}>
                      {row.serialTag}
                    </TableCell>
                    <TableCell>{row.clienteNome}</TableCell>
                    <TableCell align="center">
                      <Chip label={row.nucleos ?? '—'} size="small" sx={{ fontFamily: 'JetBrains Mono, monospace', bgcolor: '#252525' }} />
                    </TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'JetBrains Mono, monospace', color: '#9AA0A6' }}>{row.alturaU}U</TableCell>
                    <TableCell><StatusChip value={row.statusEquipamento} /></TableCell>
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
        <DialogTitle>{editing ? 'Editar Equipamento' : 'Novo Equipamento'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, pt: '16px !important' }}>
          <TextField label="Hostname *" value={form.hostname} onChange={f('hostname')} fullWidth />
          <TextField label="Serial / Tag *" value={form.serialTag} onChange={f('serialTag')} fullWidth />
          <TextField label="Núcleos" type="number" value={form.nucleos} onChange={f('nucleos')} fullWidth />
          <TextField label="Altura (U) *" type="number" value={form.alturaU} onChange={f('alturaU')} fullWidth inputProps={{ min: 1, max: 42 }} />
          <FormControl fullWidth>
            <InputLabel>Cliente *</InputLabel>
            <Select value={form.clienteId} onChange={f('clienteId')} label="Cliente *" size="small">
              {mockClientes.map((c) => <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={form.statusEquipamento} onChange={f('statusEquipamento')} label="Status" size="small">
              <MenuItem value="ATIVO">Ativo</MenuItem>
              <MenuItem value="INATIVO">Inativo</MenuItem>
              <MenuItem value="MANUTENCAO">Manutenção</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(delDialog)} onClose={() => setDelDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>Excluir <strong>{delDialog?.hostname}</strong>?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDelDialog(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
