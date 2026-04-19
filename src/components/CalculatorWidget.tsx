import { useState, useEffect, useRef } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { buildTheme } from '../app/theme-builder';
import { getCalculatorBySlug } from '../calculators/registry';
import { trackCalculatorViewed, trackCalculatorUsed } from '../analytics/ga';

const THEME_KEY = 'calcengine-theme';

export default function CalculatorWidget({ slug }: { slug: string }) {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; }
    catch { return 'light'; }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const usedFired = useRef(false);

  const calc = getCalculatorBySlug(slug);

  useEffect(() => {
    const handler = (e: Event) => setMode((e as CustomEvent<'light' | 'dark'>).detail);
    window.addEventListener('calcengine-theme', handler);
    return () => window.removeEventListener('calcengine-theme', handler);
  }, []);

  // calculator_viewed — fires once on mount
  useEffect(() => {
    if (!calc) return;
    trackCalculatorViewed({
      calculator_slug: calc.meta.slug,
      calculator_name: calc.meta.title,
    });
  }, []);

  // calculator_used — fires once on first input interaction
  useEffect(() => {
    if (!calc || !containerRef.current) return;
    const container = containerRef.current;

    function onFirstInput() {
      if (usedFired.current) return;
      usedFired.current = true;
      trackCalculatorUsed({
        calculator_slug: calc!.meta.slug,
        calculator_name: calc!.meta.title,
      });
    }

    container.addEventListener('input', onFirstInput);
    container.addEventListener('change', onFirstInput);
    return () => {
      container.removeEventListener('input', onFirstInput);
      container.removeEventListener('change', onFirstInput);
    };
  }, []);

  if (!calc) return null;

  const { Component } = calc;
  const theme = buildTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div ref={containerRef}>
        <Component />
      </div>
    </ThemeProvider>
  );
}
