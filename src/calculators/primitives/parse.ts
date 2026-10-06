/**
 * Input parsing. Calculator state is kept as strings (what the user typed);
 * these convert to numbers and report why a value is unusable.
 */

/** Parses a user-typed number. Returns null for empty or non-numeric input. Accepts "1,234.5", "$20", "30%". */
export function num(s: string): number | null {
  const t = s.replace(/[,$%]/g, '').trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export type FieldCheck = { value: number | null; error: string | null };

/** Parse + range-check in one step. `min`/`max` are inclusive unless `exclusiveMin`. */
export function check(
  s: string,
  opts: { min?: number; max?: number; exclusiveMin?: boolean; required?: boolean; label?: string } = {},
): FieldCheck {
  const { min, max, exclusiveMin = false, required = true } = opts;
  const v = num(s);
  if (v === null) return { value: null, error: required ? 'Enter a number' : null };
  if (min !== undefined && (exclusiveMin ? v <= min : v < min)) {
    return { value: null, error: exclusiveMin ? `Must be greater than ${min}` : `Must be at least ${min}` };
  }
  if (max !== undefined && v > max) return { value: null, error: `Must be at most ${max}` };
  return { value: v, error: null };
}
