import { createTheme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

export function buildTheme(mode: ThemeMode) {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#1565c0', light: '#42a5f5', dark: '#0d47a1' },
            secondary: { main: '#455a64' },
            background: { default: '#fafafa', paper: '#ffffff' },
            text: { primary: '#1a1a2e', secondary: '#546e7a' },
          }
        : {
            primary: { main: '#42a5f5', light: '#80d6ff', dark: '#1565c0' },
            secondary: { main: '#90a4ae' },
            background: { default: '#0a0a0a', paper: '#141414' },
            text: { primary: '#e8eaed', secondary: '#9aa0a6' },
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2.25rem', lineHeight: 1.2 },
      h2: { fontWeight: 600, fontSize: '1.75rem', lineHeight: 1.3 },
      h3: { fontWeight: 600, fontSize: '1.35rem', lineHeight: 1.4 },
      h4: { fontWeight: 600, fontSize: '1.15rem', lineHeight: 1.4 },
      body1: { fontSize: '1rem', lineHeight: 1.7 },
      body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === 'light'
                ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)'
                : '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
          },
        },
      },
      MuiTextField: { defaultProps: { variant: 'outlined', size: 'medium', fullWidth: true } },
    },
  });
}
