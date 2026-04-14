import { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '../app/ThemeContext';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode, toggle } = useThemeMode();

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <IconButton component="a" href="/" edge="start" sx={{ mr: 1, color: 'primary.main' }}>
            <CalculateIcon />
          </IconButton>
          <Typography variant="h6" component="a" href="/" sx={{ fontWeight: 700, textDecoration: 'none', color: 'text.primary', flexGrow: 1, fontSize: { xs: '1rem', sm: '1.15rem' } }}>
            CalcEngine
          </Typography>
          <IconButton onClick={toggle} sx={{ mr: 0.5, color: 'text.secondary' }} aria-label="Toggle dark mode">
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Button component="a" href="/calculators" size={isMobile ? 'small' : 'medium'} sx={{ fontWeight: 600 }}>
            All Calculators
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box component="footer" sx={{ py: 4, px: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} CalcEngine — Free engineering calculators for developers.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
