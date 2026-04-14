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
