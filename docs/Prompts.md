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

Follow this spec exactly:

### meta fields

- `slug` — kebab-case, ends in `-calculator` (e.g. `retry-backoff-calculator`)
- `title` — format: `{Primary Keyword Title Case} — Free Online Tool {YEAR}` (50–65 chars)
- `shortTitle` — 2–4 words for nav/breadcrumbs
- `description` — **150–160 chars**, action-oriented, includes primary keyword in first 11 words, no trailing punctuation
- `keywords` — 6–8 long-tail variants, lowercase, include the primary keyword first
- `intro` — 3–4 paragraphs, ~200 words. First sentence must contain the primary keyword. Explain the problem the calculator solves, who uses it, and when. No headings — plain prose.
- `howItWorks` — numbered list, 4–6 steps, plain text with `\n` separators
- `formula` — monospace-friendly plain text block defining each variable on its own line
- `example` — one concrete worked example with real numbers, step by step
- `faq` — exactly 5 `{ question, answer }` items. Each answer 40–80 words. Questions should be what a developer would actually Google.
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
