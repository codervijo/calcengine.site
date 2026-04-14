# Prompt History

<!-- Append new prompts at the bottom, newest last. Format:
## YYYY-MM-DD
> <prompt text>
-->

## 2026-04-13 — New Calculator Definition Prompt

Use this prompt when adding a new calculator to CalcEngine.

---

Create a new CalcEngine calculator definition file at `src/calculators/definitions/{slug}.tsx`.

**Calculator:** {NAME}
**Category:** {CATEGORY} — one of: `ai` | `api` | `data` | `performance` | `encoding` | `general`
**Primary keyword:** {KEYWORD} (e.g. `retry backoff calculator`)

### Layout rule — tool first

This is a calculator app, not a blog post. The calculator UI must appear above the fold.
Users must see inputs immediately. SEO content goes **below** the calculator, never before it.

The page layout is:
1. H1 + category chip + `tagline` (1-2 sentences) — above the fold
2. Calculator UI
3. `lastUpdated` freshness signal
4. `intro` — below-fold context prose
5. How It Works → Formula → Examples → Pricing Table (if relevant) → Tips → FAQ → Related

### meta fields

- `slug` — kebab-case, ends in `-calculator` (e.g. `retry-backoff-calculator`)
- `title` — format: `{Primary Keyword Title Case}` — clean, no year suffix needed (H1 text, 40–60 chars)
- `shortTitle` — 2–4 words for nav/breadcrumbs
- `description` — **150–160 chars**, action-oriented, includes primary keyword in first 11 words, no trailing punctuation (used for `<meta description>` and OG — not shown on page)
- `keywords` — 6–8 long-tail variants, lowercase, primary keyword first
- `tagline` — **1-2 sentences only**, shown above the calculator. State what the tool does and who it's for. No fluffy marketing copy.
- `lastUpdated` — month + year string, e.g. `"April 2026"`. Always include for freshness.
- `intro` — 2–4 paragraphs shown **below** the calculator. First sentence must contain the primary keyword. Explain the problem, who uses it, when to use it. Plain prose, no headings.
- `howItWorksTitle` — override for the How It Works H2, e.g. `"How to Calculate Retry Backoff"`. Should contain the primary keyword.
- `howItWorksImage` — **include whenever possible**. Path to an SVG diagram at `public/images/calculators/{slug}-how-it-works.svg`. The diagram should illustrate the calculation flow visually (inputs → formula → output). Use transparent background so it works in both light and dark mode. Render nodes in `#eff6ff` / `#bfdbfe`, result node in `#1565c0` white text, connector lines in `#94a3b8`. Always include `role="img"` and `aria-label` on the `<svg>`.
- `howItWorks` — numbered list, 4–6 steps, plain text with `\n` separators
- `formula` — monospace-friendly plain text block, each variable defined on its own line
- `examplesTitle` — override for the Examples H2, e.g. `"Example Retry Backoff Calculations"`
- `example` — 2–3 concrete worked examples with real numbers, step by step, `\n`-separated
- `pricingTable` (optional) — include when the calculator involves cost/pricing. Array of `{ model, inputPer1M, outputPer1M, notes? }` (adapt field names to domain)
- `pricingTableTitle` (optional) — H2 for the pricing table section
- `tips` — 4–6 actionable bullet strings. Each tip should save the user time or money.
- `tipsTitle` — H2 for the tips section, e.g. `"Tips to Reduce Retry Overhead"`
- `faq` — exactly 5 `{ question, answer }` items. Each answer 40–80 words. Questions should match developer search intent (what would they Google?).
- `relatedSlugs` — 2–3 slugs of existing calculators from the registry

### Component

- Functional React component, named `{Name}UI`
- All state via `useState<string>` (parse to float/int for math)
- Use MUI only: `TextField`, `Stack`, `Box`, `Typography` — no extra imports
- Result shown in a blue `Box` (`bgcolor: 'primary.main'`, `color: 'primary.contrastText'`)
- Responsive layout: `Stack direction={{ xs: 'column', sm: 'row' }}`
- No `useEffect`, no fetch, no side effects — pure in-browser calculation

### Export

```ts
export const {camelCaseName}Calculator: CalculatorDefinition = { meta, Component: {Name}UI };
```

After creating the file, register the export in `src/calculators/registry/index.ts`.

### SEO rules checklist

- [ ] `tagline` is ≤2 sentences and above the fold
- [ ] `intro` is below the fold (in the meta field, not rendered above the calculator)
- [ ] `title` contains the primary keyword
- [ ] `description` is 150–160 chars
- [ ] `howItWorksTitle` contains the primary keyword
- [ ] `example` has at least 2 concrete scenarios with real numbers
- [ ] `faq` has exactly 5 items with 40–80 word answers
- [ ] `lastUpdated` is set
- [ ] `relatedSlugs` has at least 2 entries
