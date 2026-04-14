import type { ComponentType } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CalculatorMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  category: CalculatorCategory;
  icon: string; // MUI icon name hint
  intro: string;
  howItWorks: string;
  formula: string;
  example: string;
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
