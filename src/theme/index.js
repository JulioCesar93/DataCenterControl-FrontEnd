import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976D2',
      light: '#42A5F5',
      dark: '#0D47A1',
    },
    secondary: {
      main: '#00BCD4',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    success: { main: '#4CAF50' },
    warning: { main: '#FFC107' },
    error:   { main: '#F44336' },
    info:    { main: '#1976D2' },
    text: {
      primary: '#E8EAED',
      secondary: '#9AA0A6',
    },
    divider: '#2C2C2C',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle2: { fontWeight: 500, color: '#9AA0A6' },
    body2: { fontSize: '0.8125rem' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { background: '#121212' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #2C2C2C',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #2C2C2C',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          background: '#252525',
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#9AA0A6',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': { borderColor: '#2C2C2C' },
          '&:hover fieldset': { borderColor: '#1976D2' },
        },
      },
    },
  },
})

// Status colors for rack visualization
export const rackColors = {
  LIVRE:     { bg: '#1B5E20', border: '#4CAF50', text: '#A5D6A7', label: 'Livre'     },
  OCUPADO:   { bg: '#B71C1C', border: '#F44336', text: '#FFCDD2', label: 'Ocupado'   },
  RESERVADO: { bg: '#F57F17', border: '#FFC107', text: '#FFF9C4', label: 'Reservado' },
  MANUTENCAO:{ bg: '#0D47A1', border: '#1976D2', text: '#BBDEFB', label: 'Manutenção'},
}
