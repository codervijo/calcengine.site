import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { buildTheme } from '../app/theme-builder';
import { getCalculatorBySlug } from '../calculators/registry';

const THEME_KEY = 'calcengine-theme';

export default function CalculatorWidget({ slug }: { slug: string }) {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; }
    catch { return 'light'; }
  });

  useEffect(() => {
    const handler = (e: Event) => setMode((e as CustomEvent<'light' | 'dark'>).detail);
    window.addEventListener('calcengine-theme', handler);
    return () => window.removeEventListener('calcengine-theme', handler);
  }, []);

  const calc = getCalculatorBySlug(slug);
  if (!calc) return null;

  const { Component } = calc;
  const theme = buildTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component />
    </ThemeProvider>
  );
}
