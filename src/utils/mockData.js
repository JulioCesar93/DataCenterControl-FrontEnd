// ── Dados mockados para desenvolvimento ──────────────────────────────────────
// Substitua as chamadas por API real quando o back-end estiver disponível

export const mockClientes = [
  { id: 1, nome: 'Banco Nacional S.A.', cnpj: '11.222.333/0001-44' },
  { id: 2, nome: 'TelecomBR Ltda.', cnpj: '22.333.444/0001-55' },
  { id: 3, nome: 'SegurPrev S.A.', cnpj: '33.444.555/0001-66' },
  { id: 4, nome: 'LogisTech ME', cnpj: '44.555.666/0001-77' },
  { id: 5, nome: 'CloudSystems Ltda.', cnpj: '55.666.777/0001-88' },
]

export const mockEquipamentos = [
  { id: 1, hostname: 'srv-prod-01', serialTag: 'SN001', nucleos: 32, statusEquipamento: 'ATIVO',   clienteId: 1, clienteNome: 'Banco Nacional S.A.', alturaU: 2, dataAtivacao: '2023-01-15' },
  { id: 2, hostname: 'fw-borda-01', serialTag: 'SN002', nucleos: 8,  statusEquipamento: 'ATIVO',   clienteId: 1, clienteNome: 'Banco Nacional S.A.', alturaU: 1, dataAtivacao: '2023-02-10' },
  { id: 3, hostname: 'sw-core-01',  serialTag: 'SN003', nucleos: null,statusEquipamento: 'ATIVO',  clienteId: 2, clienteNome: 'TelecomBR Ltda.',     alturaU: 1, dataAtivacao: '2023-03-05' },
  { id: 4, hostname: 'srv-bkp-01',  serialTag: 'SN004', nucleos: 16, statusEquipamento: 'INATIVO', clienteId: 3, clienteNome: 'SegurPrev S.A.',       alturaU: 2, dataAtivacao: '2022-11-20' },
  { id: 5, hostname: 'nas-01',      serialTag: 'SN005', nucleos: 4,  statusEquipamento: 'ATIVO',   clienteId: 4, clienteNome: 'LogisTech ME',          alturaU: 4, dataAtivacao: '2023-06-01' },
]

export const mockLocalizacoes = [
  { id: 1, ordemLoc: 'LOC-001', dataCenter: 'DC-SP1', local: 'Sala A', sala: 'A1', fila: 'F1', bastidor: 'R01', nivel: 40, statusLocal: 'OCUPADO',   uSize: 2, equipamentoId: 1 },
  { id: 2, ordemLoc: 'LOC-002', dataCenter: 'DC-SP1', local: 'Sala A', sala: 'A1', fila: 'F1', bastidor: 'R01', nivel: 39, statusLocal: 'OCUPADO',   uSize: 1, equipamentoId: 2 },
  { id: 3, ordemLoc: 'LOC-003', dataCenter: 'DC-SP1', local: 'Sala A', sala: 'A1', fila: 'F1', bastidor: 'R01', nivel: 38, statusLocal: 'RESERVADO', uSize: 1, equipamentoId: null },
  { id: 4, ordemLoc: 'LOC-004', dataCenter: 'DC-SP1', local: 'Sala A', sala: 'A2', fila: 'F1', bastidor: 'R02', nivel: 42, statusLocal: 'LIVRE',     uSize: 1, equipamentoId: null },
  { id: 5, ordemLoc: 'LOC-005', dataCenter: 'DC-SP1', local: 'Sala A', sala: 'A2', fila: 'F1', bastidor: 'R02', nivel: 41, statusLocal: 'OCUPADO',   uSize: 4, equipamentoId: 5 },
]

export const mockTickets = [
  { id: 1, clienteAfetado: 'Banco Nacional S.A.', equipamentoTicket: 'srv-prod-01', localizacao: 'R01-U40', tipo: 'INCIDENTE',  dataAbertura: '2024-06-01T10:00:00', dataFechamento: null,                  rdm: null,     descricao: 'Servidor sem resposta após atualização', osControl: 'OS-001', act: null,  evl: null  },
  { id: 2, clienteAfetado: 'TelecomBR Ltda.',     equipamentoTicket: 'sw-core-01',  localizacao: 'R01-U39', tipo: 'MUDANCA',    dataAbertura: '2024-06-02T14:00:00', dataFechamento: '2024-06-02T16:30:00', rdm: 'RDM-042', descricao: 'Troca de módulo de expansão',            osControl: 'OS-002', act: 'ACT1', evl: 'OK'  },
  { id: 3, clienteAfetado: 'SegurPrev S.A.',       equipamentoTicket: 'srv-bkp-01',  localizacao: 'R02-U41', tipo: 'MANUTENCAO', dataAbertura: '2024-06-03T09:00:00', dataFechamento: null,                  rdm: 'RDM-043', descricao: 'Manutenção preventiva trimestral',       osControl: 'OS-003', act: null,  evl: null  },
]

export const mockDashboard = {
  clientes:    5,
  equipamentos: 380,
  locacoes:    72,
  tickets:     12,
  ticketsAbertos: 8,
  ocupacaoPct: 75,
  ocupacaoData: [
    { bastidor: 'R01', total: 42, ocupados: 36, livres: 4, reservados: 2 },
    { bastidor: 'R02', total: 42, ocupados: 28, livres: 10, reservados: 4 },
    { bastidor: 'R03', total: 42, ocupados: 42, livres: 0, reservados: 0 },
    { bastidor: 'R04', total: 42, ocupados: 15, livres: 27, reservados: 0 },
  ],
  ticketsPorTipo: [
    { tipo: 'Incidente', total: 5 },
    { tipo: 'Mudança',   total: 4 },
    { tipo: 'Manutenção',total: 3 },
  ],
}

// ── Rack completo (R01, 42U) ──────────────────────────────────────────────────
export function gerarRack(bastidor = 'R01') {
  const rack = []
  for (let u = 42; u >= 1; u--) {
    const loc = mockLocalizacoes.find(
      (l) => l.bastidor === bastidor && l.nivel === u
    )
    const equip = loc?.equipamentoId
      ? mockEquipamentos.find((e) => e.id === loc.equipamentoId)
      : null

    rack.push({
      u,
      status: loc?.statusLocal || 'LIVRE',
      hostname: equip?.hostname || null,
      serialTag: equip?.serialTag || null,
      uSize: loc?.uSize || 1,
    })
  }
  return rack
}
