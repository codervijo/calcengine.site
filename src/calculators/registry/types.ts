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

/** A citable source behind a rate, table, or formula. */
export interface SourceRef {
  label: string;
  url: string;
}

/**
 * How a calculator gets its answer and where its numbers come from. Rendered as
 * a crawlable "Assumptions, Sources & Limitations" section. Required in spirit
 * for any calculator whose output depends on external rules or rates (fees,
 * electrical code tables, utility prices).
 */
export interface Methodology {
  /** Section H2. Defaults to "Assumptions, Sources & Limitations". */
  title?: string;
  assumptions: string[];
  /** Things the calculator deliberately does not model. */
  exclusions?: string[];
  sources?: SourceRef[];
  /** ISO date the rates/tables were last checked against `sources`. Shown near the calculator. */
  verified?: string;
  /** Safety / professional-judgment notice, shown prominently. */
  disclaimer?: string;
}

/** Generic crawlable reference table (rate schedules, code tables, conversions). */
export interface ReferenceTable {
  title: string;
  columns: string[];
  rows: string[][];
  note?: string;
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
  /** Rate schedules / code tables rendered as static HTML tables. */
  referenceTables?: ReferenceTable[];
  methodology?: Methodology;
  /** FAQ is rendered (and FAQPage JSON-LD emitted) only when non-empty. */
  faq: FAQItem[];
  relatedSlugs: string[];
}

/**
 * Categories are the finest grouping. The six developer categories predate the
 * v2 pivot and keep their hub URLs (/calculators/ai, /api, …); the v2 categories
 * share their key with their vertical.
 */
export type CalculatorCategory =
  | 'ai' | 'api' | 'data' | 'performance' | 'encoding' | 'general'
  | 'business' | 'math' | 'construction' | 'electrical';

export const CATEGORY_LABELS: Record<CalculatorCategory, string> = {
  ai: 'AI & ML',
  api: 'API & Backend',
  data: 'Data & Formats',
  performance: 'Performance',
  encoding: 'Encoding',
  general: 'General',
  business: 'Business & Seller',
  math: 'Math',
  construction: 'Construction',
  electrical: 'Electrical & Energy',
};

/** Top-level verticals — the site's information architecture. */
export type Vertical = 'business' | 'math' | 'construction' | 'electrical' | 'developer';

export const CATEGORY_VERTICAL: Record<CalculatorCategory, Vertical> = {
  ai: 'developer',
  api: 'developer',
  data: 'developer',
  performance: 'developer',
  encoding: 'developer',
  general: 'developer',
  business: 'business',
  math: 'math',
  construction: 'construction',
  electrical: 'electrical',
};

export interface VerticalInfo {
  label: string;
  /** One line for homepage / footer cards. */
  blurb: string;
  /** Hub page <title>. */
  hubTitle: string;
  /** Hub page meta description. */
  hubDescription: string;
  /** Hub page intro paragraph (crawlable). */
  hubIntro: string;
}

/** Display order is the key order. */
export const VERTICALS: Record<Vertical, VerticalInfo> = {
  business: {
    label: 'Business & Seller',
    blurb: 'Payment fees, pricing, markup, commission and food cost.',
    hubTitle: 'Business & Seller Calculators — Fees, Markup, Commission | CalcEngine',
    hubDescription: 'Free business calculators for sellers: PayPal and Stripe fees, markup and margin, sales commission, and restaurant food cost. Rates cited and dated.',
    hubIntro: 'Calculators for people who sell things: what a payment processor or marketplace will actually take from a sale, how to price from cost, and how much a commission plan pays. Fee calculators state the exact rate schedule they assume and the date it was last checked.',
  },
  math: {
    label: 'Math',
    blurb: 'Averages, percentages and everyday math.',
    hubTitle: 'Math Calculators | CalcEngine',
    hubDescription: 'Free math calculators with formulas and worked examples.',
    hubIntro: 'Math calculators that show the formula and the working, not just the answer.',
  },
  construction: {
    label: 'Construction',
    blurb: 'Materials and quantities for building projects.',
    hubTitle: 'Construction Calculators | CalcEngine',
    hubDescription: 'Free construction calculators for materials and quantities.',
    hubIntro: 'Construction calculators for estimating materials and quantities.',
  },
  electrical: {
    label: 'Electrical & Energy',
    blurb: 'Wire size, amps, watts and electricity cost.',
    hubTitle: 'Electrical & Energy Calculators — Wire Size, Amps, Energy Cost | CalcEngine',
    hubDescription: 'Free electrical calculators: wire size by ampacity and voltage drop, amps from watts for DC, single- and three-phase, and appliance electricity cost.',
    hubIntro: 'Electrical and energy calculators that show their assumptions, units and code tables. They are planning aids: they do not replace the electrical code that applies where you are, the equipment manufacturer\'s instructions, or a licensed electrician.',
  },
  developer: {
    label: 'Developer',
    blurb: 'API cost, payload size, performance and cloud tools for engineers.',
    hubTitle: 'Developer Calculators — API, Performance, Cloud Cost | CalcEngine',
    hubDescription: 'Free developer calculators for API costs, rate limits, payload and encoding sizes, latency, throughput, cloud cost, Kubernetes and EU CRA compliance.',
    hubIntro: 'Engineering calculators for software developers, grouped by area: AI and API cost, backend and rate limits, data formats and encoding, performance, infrastructure, and EU Cyber Resilience Act compliance.',
  },
};

/** A vertical hub is only generated once it has this many calculators (no thin hubs). */
export const MIN_HUB_SIZE = 2;

export interface CalculatorDefinition {
  meta: CalculatorMeta;
  Component: ComponentType;
}
