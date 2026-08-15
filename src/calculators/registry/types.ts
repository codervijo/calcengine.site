import type { ComponentType } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PricingRow {
  model: string;
  inputPer1M: string;
  outputPer1M: string;
  notes?: string;
}

export interface CalculatorMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  category: CalculatorCategory;
  icon: string; // MUI icon name hint
  /** 1-2 sentences shown above the calculator. Falls back to description if absent. */
  tagline?: string;
  /**
   * Page section order.
   * - 'calculator-first' (default) — tool above the fold, SEO prose below. The
   *   golden-page standard; every page not explicitly opted out uses this.
   * - 'explanation-first' — the explanation leads and the calculator sits after
   *   it. For pages targeting a problem/error query rather than the tool itself,
   *   where the searcher wants an answer before a form.
   */
  layout?: 'calculator-first' | 'explanation-first';
  /**
   * Self-contained 2-4 sentence answer rendered directly under the H1.
   * `layout: 'explanation-first'` only. Written so a reader who reads nothing
   * else has their question answered — this is the featured-snippet target.
   */
  directAnswer?: string;
  /**
   * The substance of the page, rendered before the calculator.
   * `layout: 'explanation-first'` only. Replaces `intro` in that mode.
   */
  explainer?: Array<{ heading: string; body: string }>;
  /** H2 introducing the calculator in `explanation-first` mode. */
  calculatorHeading?: string;
  /** One sentence stating which question the calculator answers. */
  calculatorIntro?: string;
  /**
   * Drop the cross-site trust sentence and the generic "Notes" list. Both are
   * identical on every page, which reads as a template fingerprint; pages that
   * state their own caveats inline should opt out.
   */
  suppressBoilerplate?: boolean;
  /** Override for the H1. Defaults to `title`. Lets the H1 serve the reader while `title` serves the SERP. */
  h1?: string;
  /** Shown as a freshness signal below the calculator, e.g. "April 2026" */
  lastUpdated?: string;
  intro: string;
  /** Override for the "How It Works" H2 heading */
  howItWorksTitle?: string;
  /** Path to a diagram image shown below the How It Works heading, e.g. "/images/calculators/slug-how-it-works.svg" */
  howItWorksImage?: string;
  howItWorks: string;
  formula: string;
  /** Override for the "Worked Example" H2 heading */
  examplesTitle?: string;
  example: string;
  /** Structured examples rendered as separate labelled blocks. Takes precedence over `example`. */
  examples?: Array<{ title: string; body: string }>;
  /** Optional pricing/reference table rendered between example and tips */
  pricingTable?: PricingRow[];
  /** Override for the pricing table H2 heading */
  pricingTableTitle?: string;
  /** Bullet list rendered as a tips section before FAQ */
  tips?: string[];
  /** Override for the tips H2 heading */
  tipsTitle?: string;
  faq: FAQItem[];
  relatedSlugs: string[];
}

export type CalculatorCategory = 'ai' | 'api' | 'data' | 'performance' | 'encoding' | 'general';

export const CATEGORY_LABELS: Record<CalculatorCategory, string> = {
  ai: 'AI & ML',
  api: 'API & Backend',
  data: 'Data & Formats',
  performance: 'Performance',
  encoding: 'Encoding',
  general: 'General',
};

export interface CalculatorDefinition {
  meta: CalculatorMeta;
  Component: ComponentType;
}
