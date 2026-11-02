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
- [ ] `howItWorksImage` SVG created at `public/images/calculators/{slug}-how-it-works.svg` and referenced in meta

## 2026-10-05 — Demand-first pivot (PRD v2 / Experiment 1)

Session outcome: PRD v2.A–v2.E shipped (commits `1da5617`, `fb36022`);
9 calculators + 3 hubs live; Etsy held back. Experiment record:
`docs/seo-experiments.md`.

### Prompt 1 — pivot brief (verbatim headings, condensed body)

> Work in the existing `calcengine.site` repository.
>
> **Objective:** Pivot CalcEngine from its narrow developer/technical
> calculator strategy toward a broader high-demand calculator engine,
> preserving existing useful/indexed URLs. This is an SEO experiment —
> treat experiment logging and observability as first-class deliverables.
> Inspect the existing implementation first; do not blindly rewrite.
>
> **Document the experiment history BEFORE changing anything** —
> `docs/seo-experiments.md`. Experiment 0 — Developer Calculator Thesis:
> ~69 pages; 28d GSC around 2026-10-05: 69 pages, 12 impressions, 0 clicks,
> avg position 19.8, Δimp −35 vs ≈2026-09-05, last crawl 2026-09-18, site
> updated 2026-08-14. Mark the ~47 prior-period figure as "inferred from the
> portfolio ΔImp value, not a directly captured GSC snapshot". Ahrefs
> validation of developer keywords (claude api cost calculator ~30 … docker /
> requests-per-minute calculators insufficient demand). Conclusion: "Natural
> combinatorial page surface does not imply natural search demand."
>
> **Experiment 1 — Demand-First Broad Calculator Pivot**, start 2026-10-05.
> Hypothesis: demand-validated, weak-KD calculators → substantially more
> discovery/ranking. `search demand → SERP validation → calculator → measure`.
> Ahrefs table: markup 17,000/6 · PayPal fee 13,000/0 · weighted average
> 10,000/0 · shipping 10,000/0 · wire size 7,000/6 · tile 5,600/8 ·
> commission 5,200/0 · deck 4,100/5 · fence 3,700/4 · amp 2,900/2 · flooring
> 2,500/8 · food cost 2,100/5 · Etsy fee 2,000/6 · Stripe fee 1,800/0 · energy
> cost 800/5 · battery 700/8 · catering 500/8.
>
> **Phase 1 pages (10-page validation batch):** PayPal Fee, Commission,
> Stripe Fee, Markup, Etsy Fee, Weighted Average, Wire Size, Amp, Food Cost,
> Energy Cost. Do not build the rest yet.
>
> **Quality bar:** genuinely useful product pages — defaults, multiple
> inputs, secondary outputs, formulas, units, assumptions, worked examples,
> edge cases, related calculators, FAQ only where useful, methodology/sources
> where rules or rates are external; crawlable HTML; no keyword stuffing.
> **Fee calculators:** rates separate from UI; state schedule, jurisdiction,
> last-verified date, exclusions; transparent assumptions over false
> precision. **Electrical:** expose assumptions/units/method; never imply it
> replaces code, manufacturer requirements or professional judgment —
> accuracy > SEO.
>
> **Architecture:** categories Business & Seller, Math, Construction,
> Electrical & Energy, Developer (keep Developer; don't destroy URLs).
> **Internal linking:** PayPal↔Stripe↔Etsy; Markup↔Commission↔Food Cost;
> Wire Size↔Amp↔Energy Cost; Weighted Average→math; crawlable hubs; no
> orphans. **Homepage:** general calculation engine; no "thousands of
> calculators" claims. **SEO fundamentals** per page; avoid unnecessary
> schema and near-duplicates. **Build for scale** with reusable primitives,
> but no generic DSL.
>
> **Observability:** durable 2026-10-05 pre-deploy baseline (pages, sitemap
> count, indexed count, 28d impressions/clicks/CTR/position, top queries and
> pages, git SHA, start date, new URLs) — e.g. `seo/snapshots/2026-10-05.json`;
> never overwrite snapshots. **Success checkpoints:** ~14d crawl/index/first
> impressions (don't judge rankings); ~30d compare to baseline; ~60–90d
> SCALE / ITERATE / STOP. Don't generate hundreds of pages before Phase 1
> evidence. Portfolio question: can AI-assisted development scale ~100-page
> sites toward 1,000+ pages by first finding a repeatable,
> search-demand-validated page primitive?
>
> **Final deliverable:** implement Phase 1 completely, then report baseline,
> log location, architecture, preserved/changed pages, the 10 URLs,
> methodology, SEO/internal-link/sitemap changes, test/build/lint results,
> deployment-ready page count, diff summary, checkpoint metrics. No Phase 2.

### Operator decisions during the session

- PRD slot: **option A** — new tier v2 (v2.A planning … v2.F measurement).
- "Etsy verification shouldn't hold the whole deployment hostage. Verify/fix
  that calculator quickly or temporarily exclude just Etsy, then ship the
  other 81 pages." → Etsy unregistered (etsy.com 403s automated fetch); 81
  pages shipped.
- "add notices in ai_agents to check on measurements on days 14,20,60-90"
  → checkpoint table at the top of `AI_AGENTS.md` (read as day 14 / 30 /
  60 / 90).
- "resubmit using lamill tool" → `lamill settings gsc submit-sitemap --site
  calcengine.site --force`.

## 2026-10-31 → 2026-11-02 — Day-14 post-mortem, keyword research, maintenance

Session outcome: day-14 checkpoint recorded (`0ac5a78`); PRD v2.F keyword
research (research only, no build); IndexNow submission (`2aa05dc`);
lovable-tagger removed (`eb6686f`); Astro 4 → 5 (`e2f65d2`); plain-text FAQ
JSON-LD for CHECK_095 (`1733a64`); growth log updated.

### Operator prompts (condensed)

- "this seems to be a dead project. why? do a post mortem" → v1 failed on
  demand (~0–30 SV); discovery broken (80/81 URLs unknown to Google).
- "can we double down on pages with demand? use tregs skills to find such
  keywords" → PRD slot: research only, now (v2.F). DataForSEO Labs via treg;
  Serpstat rejected (bucketed volumes).
- "add new found tools to PRD first" → candidate backlog in `docs/prd.md` v2.F.
- Growth log: DR-0 sites rank on page 1; operator hypothesis "v1 was done
  without checking SV, and that might be reason for low impressions".
- "submit sitemap urls to indexnow"; then "ignore bing" (no Bing baselines).
- "remove lovable-tagger", "upgrade astro to v5",
  "fix the FAQ answers missing from HTML".

### Open at session close

- Day 30 checkpoint **2026-11-04**: new GSC snapshot → `seo/snapshots/`,
  update `docs/seo-experiments.md`, `docs/growth.md`, PRD v2.G row.
- v2.F: SERP-check the 12 unchecked candidates.
- CHECK_095's last 3 failures are a checker bug in
  `portfolio/src/portfolio/checks/seo/check_095_live_faq_answers_in_html.py`
  (space before punctuation after `</code>`); not fixed (separate repo).
