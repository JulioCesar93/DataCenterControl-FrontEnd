import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, Divider, IconButton, Tooltip, Avatar, Menu,
  MenuItem, Chip,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Business as ClientesIcon,
  Computer as EquipamentosIcon,
  LocationOn as LocIcon,
  ConfirmationNumber as TicketIcon,
  People as UsersIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
  AccountCircle,
  FiberManualRecord as DotIcon,
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

const DRAWER_OPEN  = 240
const DRAWER_CLOSE = 64

const NAV_ITEMS = [
  { label: 'Dashboard',    icon: <DashboardIcon />,     path: '/'              },
  { label: 'Clientes',     icon: <ClientesIcon />,      path: '/clientes'      },
  { label: 'Equipamentos', icon: <EquipamentosIcon />,  path: '/equipamentos'  },
  { label: 'Localizações', icon: <LocIcon />,           path: '/localizacoes'  },
  { label: 'Tickets',      icon: <TicketIcon />,        path: '/tickets'       },
  { label: 'Usuários',     icon: <UsersIcon />,         path: '/usuarios'      },
]

export default function Sidebar({ children }) {
  const [open, setOpen]       = useState(true)
  const [anchor, setAnchor]   = useState(null)
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const drawerWidth = open ? DRAWER_OPEN : DRAWER_CLOSE

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#121212' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: 'width 0.2s ease',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            overflow: 'hidden',
            transition: 'width 0.2s ease',
            background: '#1E1E1E',
            borderRight: '1px solid #2C2C2C',
          },
        }}
      >
        {/* Logo */}
        <Toolbar
          sx={{
            px: 2,
            minHeight: '64px !important',
            justifyContent: open ? 'space-between' : 'center',
            borderBottom: '1px solid #2C2C2C',
          }}
        >
          {open && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 30, height: 30, borderRadius: 1,
                  background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'JetBrains Mono',
                }}
              >DC</Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#E8EAED', fontWeight: 700, lineHeight: 1 }}>
                  DCIM
                </Typography>
                <Typography variant="caption" sx={{ color: '#9AA0A6', fontSize: '0.65rem' }}>
                  Data Center Mgmt
                </Typography>
              </Box>
            </Box>
          )}
          <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: '#9AA0A6' }}>
            {open ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        </Toolbar>

        {/* Nav */}
        <List sx={{ px: 1, pt: 1, flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={!open ? item.label : ''} placement="right">
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      minHeight: 42,
                      px: open ? 1.5 : 1.25,
                      justifyContent: open ? 'flex-start' : 'center',
                      background: active ? 'rgba(25,118,210,0.15)' : 'transparent',
                      borderLeft: active ? '3px solid #1976D2' : '3px solid transparent',
                      '&:hover': { background: 'rgba(25,118,210,0.08)' },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: open ? 36 : 0,
                        color: active ? '#1976D2' : '#9AA0A6',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: active ? 600 : 400,
                          color: active ? '#E8EAED' : '#9AA0A6',
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
          })}
        </List>

        <Divider sx={{ borderColor: '#2C2C2C' }} />

        {/* User */}
        <Box sx={{ p: 1 }}>
          <ListItemButton
            onClick={(e) => setAnchor(e.currentTarget)}
            sx={{ borderRadius: 2, px: open ? 1.5 : 1.25, justifyContent: open ? 'flex-start' : 'center' }}
          >
            <Avatar
              sx={{ width: 30, height: 30, bgcolor: '#1976D2', fontSize: 13, mr: open ? 1.5 : 0 }}
            >
              {user?.nome?.[0] || 'U'}
            </Avatar>
            {open && (
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 500, color: '#E8EAED' }}>
                  {user?.nome}
                </Typography>
                <Chip
                  label={user?.role}
                  size="small"
                  sx={{ height: 16, fontSize: '0.6rem', bgcolor: 'rgba(25,118,210,0.2)', color: '#42A5F5' }}
                />
              </Box>
            )}
          </ListItemButton>
        </Box>

        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <MenuItem onClick={() => { setAnchor(null); logout() }}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Sair
          </MenuItem>
        </Menu>
      </Drawer>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <Box component="main" sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
        {children}
      </Box>
    </Box>
  )
}
