import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { buildTheme } from '../../app/theme-builder';
import { getCalculatorBySlug } from '../registry';

const V2 = [
  'paypal-fee-calculator', 'stripe-fee-calculator', 'markup-calculator', 'commission-calculator',
  'food-cost-calculator', 'weighted-average-calculator', 'wire-size-calculator', 'amp-calculator', 'energy-cost-calculator',
];

function mount(slug: string) {
  const { Component } = getCalculatorBySlug(slug)!;
  return render(<ThemeProvider theme={buildTheme('light')}><Component /></ThemeProvider>);
}

describe('v2 calculators render with defaults and show a result', () => {
  it.each(V2)('%s', (slug) => {
    mount(slug);
    // Every calculator renders its result card (aria-live) for the default inputs.
    expect(document.querySelector('[aria-live="polite"]'), 'result card').not.toBeNull();
    // Clearing every text input must not crash; it should fall back to a message instead.
    for (const input of screen.queryAllByRole('textbox')) fireEvent.change(input, { target: { value: '' } });
    expect(document.body.textContent?.length).toBeGreaterThan(0);
    cleanup();
  });
});

describe('default-input results', () => {
  const text = () => document.body.textContent ?? '';
  it('PayPal: $100 Checkout → $3.98 fee', () => { mount('paypal-fee-calculator'); expect(text()).toContain('$3.98'); expect(text()).toContain('$96.02'); cleanup(); });
  it('Stripe: $100 card → $3.20 fee', () => { mount('stripe-fee-calculator'); expect(text()).toContain('$3.20'); cleanup(); });
  it('Markup: $40 at 50% → $60', () => { mount('markup-calculator'); expect(text()).toContain('$60.00'); cleanup(); });
  it('Weighted average: 92/78/85 at 20/30/50 → 84.3', () => { mount('weighted-average-calculator'); expect(text()).toContain('84.3'); cleanup(); });
  it('Wire size: 20 A 120 V 50 ft Cu → 10 AWG', () => { mount('wire-size-calculator'); expect(text()).toContain('10 AWG Cu'); cleanup(); });
  it('Amp: 1800 W 120 V → 15 A', () => { mount('amp-calculator'); expect(text()).toContain('15 A'); cleanup(); });
});
