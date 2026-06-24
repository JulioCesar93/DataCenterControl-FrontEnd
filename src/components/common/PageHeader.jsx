import { Box, Typography, Breadcrumbs, Link } from '@mui/material'

export default function PageHeader({ title, subtitle, breadcrumbs = [], action }) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 0.5 }}>
          {breadcrumbs.map((b, i) =>
            i < breadcrumbs.length - 1 ? (
              <Link key={b} underline="hover" color="inherit" href="#" sx={{ fontSize: '0.75rem', color: '#9AA0A6' }}>
                {b}
              </Link>
            ) : (
              <Typography key={b} sx={{ fontSize: '0.75rem', color: '#E8EAED' }}>
                {b}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#E8EAED', mb: 0.25 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#9AA0A6' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
    </Box>
  )
}
