# CalcEngine

Free engineering calculators for developers — API costs, token pricing, JSON sizing, Base64 encoding, backend performance, and more.

Live at: **https://calcengine.dev**

## What it is

A statically generated (Astro SSG) collection of engineering calculators, each with full SEO content (intro, formula, worked example, FAQ) and an interactive React island for the actual calculation. Built to rank for developer long-tail keywords.

## Running locally

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # Static build → dist/
pnpm preview    # Preview built output
```

## Adding a calculator

1. Create `src/calculators/definitions/my-calculator.tsx`
2. Export a `CalculatorDefinition` with `meta` (slug, title, description, keywords, intro, faq, …) and a React `Component`
3. No routing changes needed — the page is auto-generated at `/calculators/{slug}`

See `AI_AGENT.md` for full conventions and architecture notes.
