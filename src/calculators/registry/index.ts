import type { CalculatorDefinition } from './types';
import { openaiCostCalculator } from '../definitions/openai-cost';
import { jsonSizeCalculator } from '../definitions/json-size';
import { apiRateLimitCalculator } from '../definitions/api-rate-limit';
import { base64SizeCalculator } from '../definitions/base64-size';
import { cronNextRunCalculator } from '../definitions/cron-next-run-calculator';

const calculators: CalculatorDefinition[] = [
  openaiCostCalculator,
  jsonSizeCalculator,
  apiRateLimitCalculator,
  base64SizeCalculator,
  cronNextRunCalculator,
];

export function getAllCalculators(): CalculatorDefinition[] {
  return calculators;
}

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return calculators.find((c) => c.meta.slug === slug);
}

export function getCalculatorsByCategory(category: string): CalculatorDefinition[] {
  return calculators.filter((c) => c.meta.category === category);
}

export function getRelatedCalculators(slugs: string[]): CalculatorDefinition[] {
  return calculators.filter((c) => slugs.includes(c.meta.slug));
}

export function getCategories(): string[] {
  return [...new Set(calculators.map((c) => c.meta.category))];
}
