import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getAllCalculators, getHubVerticals, getHubForCategory, DEVELOPER_SUBHUBS } from './index';
import { VERTICALS, CATEGORY_VERTICAL, type Vertical } from './types';

const calcs = getAllCalculators();
const slugs = calcs.map((c) => c.meta.slug);
const PAGES = path.resolve(__dirname, '../../pages/calculators');

// v2 (Experiment 1) pages — held to the stricter quality bar.
const V2 = [
  'paypal-fee-calculator', 'stripe-fee-calculator', 'markup-calculator', 'commission-calculator',
  'food-cost-calculator', 'weighted-average-calculator', 'wire-size-calculator', 'amp-calculator', 'energy-cost-calculator',
];
// Pages whose output depends on external rates/tables — must cite sources and a verified date.
const NEEDS_SOURCES = ['paypal-fee-calculator', 'stripe-fee-calculator', 'wire-size-calculator', 'energy-cost-calculator'];
const NEEDS_DISCLAIMER = ['wire-size-calculator', 'amp-calculator'];

describe('registry invariants', () => {
  it('slugs are unique', () => {
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('no calculator slug collides with a hub page', () => {
    const hubKeys = [...Object.keys(VERTICALS), ...DEVELOPER_SUBHUBS, 'index'];
    expect(slugs.filter((s) => hubKeys.includes(s))).toEqual([]);
  });

  it('every relatedSlug resolves and is not self', () => {
    for (const c of calcs) {
      for (const r of c.meta.relatedSlugs) {
        expect(slugs, `${c.meta.slug} → ${r}`).toContain(r);
        expect(r).not.toBe(c.meta.slug);
      }
    }
  });

  it('a hub page file exists exactly for verticals that qualify', () => {
    for (const v of Object.keys(VERTICALS) as Vertical[]) {
      const exists = fs.existsSync(path.join(PAGES, `${v}.astro`));
      expect(exists, `hub file for ${v}`).toBe(getHubVerticals().includes(v));
    }
  });

  it('every developer sub-hub page still exists (URLs preserved)', () => {
    for (const c of DEVELOPER_SUBHUBS) expect(fs.existsSync(path.join(PAGES, `${c}.astro`))).toBe(true);
  });

  it('every category maps to a vertical', () => {
    for (const c of calcs) expect(CATEGORY_VERTICAL[c.meta.category]).toBeDefined();
  });

  it('held-back pages stay unregistered and unlinked', () => {
    // Etsy: rates not yet confirmed on the live site. Re-add to the registry once verified.
    expect(slugs).not.toContain('etsy-fee-calculator');
    for (const c of calcs) expect(c.meta.relatedSlugs).not.toContain('etsy-fee-calculator');
  });

  it('the experiment page set is all present', () => {
    for (const s of V2) expect(slugs).toContain(s);
  });
});

describe('v2 page quality bar', () => {
  const v2 = calcs.filter((c) => V2.includes(c.meta.slug));

  it.each(v2.map((c) => [c.meta.slug, c.meta]))('%s: metadata', (_slug, m) => {
    expect(m.description.length, 'description length').toBeGreaterThanOrEqual(120);
    expect(m.description.length, 'description length').toBeLessThanOrEqual(170);
    expect(`${m.title} — CalcEngine`.length, 'title length').toBeLessThanOrEqual(65);
    expect(m.tagline).toBeTruthy();
    expect(m.examples?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(m.formula.length).toBeGreaterThan(40);
    expect(m.relatedSlugs.length).toBeGreaterThanOrEqual(2);
    expect(m.faq.length).toBeLessThanOrEqual(5);
  });

  it('pages with external rates cite sources and a verified date', () => {
    for (const s of NEEDS_SOURCES) {
      const m = calcs.find((c) => c.meta.slug === s)!.meta;
      expect(m.methodology?.sources?.length, s).toBeGreaterThan(0);
      expect(m.methodology?.verified, s).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('electrical pages carry a safety disclaimer', () => {
    for (const s of NEEDS_DISCLAIMER) {
      expect(calcs.find((c) => c.meta.slug === s)!.meta.methodology?.disclaimer, s).toBeTruthy();
    }
  });

  it('every v2 page has a hub for its breadcrumb or is linked from the homepage', () => {
    const home = fs.readFileSync(path.resolve(__dirname, '../../pages/index.astro'), 'utf8');
    for (const c of v2) {
      const hub = getHubForCategory(c.meta.category);
      // Homepage lists every non-developer calculator by vertical; hubless verticals still get linked there.
      expect(hub !== null || home.includes('getCalculatorsByVertical'), c.meta.slug).toBe(true);
    }
  });
});
