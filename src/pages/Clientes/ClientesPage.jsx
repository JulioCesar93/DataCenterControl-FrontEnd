import { useState } from 'react'
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Button, TextField, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Typography, Tooltip,
  TablePagination,
} from '@mui/material'
import {
  Add, Edit, Delete, Search, Business,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { mockClientes } from '../../utils/mockData'
import PageHeader from '../../components/common/PageHeader'

const EMPTY = { nome: '', cnpj: '' }

function formatCNPJ(v) {
  return v
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18)
}

export default function ClientesPage() {
  const [rows, setRows]         = useState(mockClientes)
  const [filter, setFilter]     = useState('')
  const [dialog, setDialog]     = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [delDialog, setDelDialog] = useState(null)
  const [page, setPage]         = useState(0)
  const { enqueueSnackbar }     = useSnackbar()

  const filtered = rows.filter(
    (r) =>
      r.nome.toLowerCase().includes(filter.toLowerCase()) ||
      r.cnpj.includes(filter)
  )
  const paged = filtered.slice(page * 10, page * 10 + 10)

  const openCreate = () => { setEditing(null); setForm(EMPTY); setDialog(true) }
  const openEdit   = (row) => { setEditing(row); setForm({ nome: row.nome, cnpj: row.cnpj }); setDialog(true) }

  const handleSave = () => {
    if (!form.nome.trim() || !form.cnpj.trim()) {
      enqueueSnackbar('Preencha todos os campos', { variant: 'warning' }); return
    }
    if (editing) {
      setRows((r) => r.map((x) => x.id === editing.id ? { ...x, ...form } : x))
      enqueueSnackbar('Cliente atualizado!', { variant: 'success' })
    } else {
      setRows((r) => [...r, { id: Date.now(), ...form }])
      enqueueSnackbar('Cliente criado!', { variant: 'success' })
    }
    setDialog(false)
  }

  const handleDelete = () => {
    setRows((r) => r.filter((x) => x.id !== delDialog.id))
    enqueueSnackbar('Cliente excluído', { variant: 'info' })
    setDelDialog(null)
  }

  return (
    <Box>
      <PageHeader
        title="Clientes"
        subtitle={`${rows.length} clientes cadastrados`}
        breadcrumbs={['DCIM', 'Clientes']}
        action={
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            Novo Cliente
          </Button>
        }
      />

      <Card>
        <Box sx={{ p: 2, borderBottom: '1px solid #2C2C2C' }}>
          <TextField
            placeholder="Buscar por nome ou CNPJ..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ width: 320 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#9AA0A6', fontSize: 18 }} /></InputAdornment>,
            }}
          />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>CNPJ</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#9AA0A6' }}>
                    <Business sx={{ fontSize: 40, mb: 1, display: 'block', mx: 'auto', opacity: 0.3 }} />
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#9AA0A6' }}>
                      #{row.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{row.nome}</TableCell>
                    <TableCell sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8125rem' }}>{row.cnpj}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => openEdit(row)} sx={{ color: '#1976D2' }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" onClick={() => setDelDialog(row)} sx={{ color: '#F44336' }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
          onPageChange={(_, p) => setPage(p)}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
          sx={{ borderTop: '1px solid #2C2C2C', color: '#9AA0A6' }}
        />
      </Card>

      {/* ── Create / Edit dialog ─────────────────────────────────────────────── */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Nome da empresa"
            value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            fullWidth required
          />
          <TextField
            label="CNPJ"
            value={form.cnpj}
            onChange={(e) => setForm((f) => ({ ...f, cnpj: formatCNPJ(e.target.value) }))}
            fullWidth required
            inputProps={{ maxLength: 18 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* ── Confirm delete ───────────────────────────────────────────────────── */}
      <Dialog open={Boolean(delDialog)} onClose={() => setDelDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Excluir o cliente <strong>{delDialog?.nome}</strong>? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDelDialog(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
