# AI Agent Context — calcengine.site

## What this project is
CalcEngine is a statically generated (Astro SSG) site of free engineering calculators targeting developer long-tail keywords. Each calculator is a schema-driven page with full SEO content — intro, how-it-works, formula, worked example, FAQ, and related links — plus an interactive React island for the actual calculation.

## Stack
- **Framework:** Astro 4 (static output, `output: 'static'`)
- **UI:** React 18 islands via `@astrojs/react`, MUI v9 + Emotion for calculator components
- **Styling:** Tailwind CSS v3 (Astro static pages), MUI theme (`src/app/theme-builder.ts`) for React islands
- **Language:** TypeScript
- **Package manager:** pnpm
- **SEO:** `@astrojs/sitemap`, JSON-LD structured data (`src/seo/jsonLd.ts`), build-time OG images via Satori + `@resvg/resvg-js`
- **Testing:** Vitest + Testing Library

## Project structure
```
src/
  calculators/
    definitions/    # One .tsx file per calculator (meta + React component)
    registry/       # getAllCalculators(), types.ts (CalculatorMeta, CalculatorDefinition)
  pages/
    index.astro             # Homepage (fully static)
    calculators/
      index.astro           # All-calculators list (static list + React search island)
      [slug].astro          # Individual calculator pages (getStaticPaths)
    og/
      [slug].png.ts         # Build-time OG images per calculator (Satori)
      home.png.ts           # OG image for homepage
    privacy.astro
    terms.astro
    404.astro
  layouts/
    BaseLayout.astro        # HTML shell, SEO head, FOUC prevention
    SiteNav.astro           # Static nav + DarkModeToggle island
    SiteFooter.astro
  components/
    CalculatorWidget.tsx    # React island wrapper for individual calculators
    SearchableListIsland.tsx # React island for search/filter on /calculators
    DarkModeToggle.tsx      # Minimal React island, no MUI
  app/
    ThemeContext.tsx         # MUI ThemeProvider (used inside React islands only)
    theme-builder.ts         # buildTheme(mode) shared function
  seo/
    jsonLd.ts               # JSON-LD schema builders
  og/
    OgTemplate.tsx          # Satori JSX template
    renderOg.ts             # Satori → resvg-js → PNG pipeline
  styles/
    global.css              # @tailwind directives
docs/
  prd.md                    # Product roadmap + SEO audit tracker
  Prompts.md                # Prompt history log
public/
  robots.txt
  favicon.ico
```

## How to run
```bash
pnpm dev        # Start Astro dev server
pnpm build      # Static build → dist/
pnpm preview    # Preview built output
pnpm test       # Run Vitest suite
```
Or via Makefile from parent directory: `make run`

## Golden page

**`/calculators/openai-cost-calculator`** is the canonical reference for all calculator pages.
Live URL: https://www.calcengine.site/calculators/openai-cost-calculator
Source:   `src/calculators/definitions/openai-cost.tsx`

Every new and existing calculator page must match this standard:

| Element | Requirement |
|---------|-------------|
| H1 + tagline | Short (1–2 sentences), above the fold, before the calculator |
| Calculator UI | Immediately below the tagline — always above the fold |
| `lastUpdated` | Shown below the calculator as a freshness signal |
| `intro` | 2–4 paragraphs of SEO prose, rendered **below** the calculator |
| `howItWorksTitle` | Keyword-rich H2, e.g. "How to Calculate X" |
| `howItWorksImage` | SVG flow diagram at `public/images/calculators/{slug}-how-it-works.svg` |
| `howItWorks` | Numbered steps (plain text, `\n`-separated) |
| Formula | Monospace block with variable definitions |
| `examples` array | 3 separate labelled blocks (not one text blob) |
| `pricingTable` | Include when the calculator involves costs/pricing |
| `tips` | 4–6 actionable bullets in a Tips section |
| FAQ | Exactly 5 items, 40–80 word answers, HTML links allowed in answers |
| Related cards | 3 `relatedSlugs` minimum |

When in doubt, open `src/calculators/definitions/openai-cost.tsx` and mirror its structure exactly.

## Key conventions
- **Adding a new calculator:** create one file in `src/calculators/definitions/`, export a `CalculatorDefinition` object with `meta` + `Component`. No routing changes needed — `getStaticPaths` picks it up automatically.
- **Import types only:** all TypeScript interfaces/types must use `import type` — value imports of type-only symbols cause Astro hydration errors at runtime.
- **MUI components must be `client:only="react"`** — Emotion CSS-in-JS is incompatible with Astro SSR. Never put MUI in a `.astro` file.
- **Dark mode:** persisted in `localStorage` key `calcengine-theme`, applied via `dark` class on `<html>`. Cross-island sync via `CustomEvent('calcengine-theme', { detail: 'light'|'dark' })`.
- **Static-first:** all content (breadcrumbs, H1, intro, FAQ, related links) is rendered as static Astro HTML. Only the interactive widget is a React island.
- **SEO content fields:** `intro`, `howItWorks`, `formula`, `examples[]`, `faq[]`, `tips[]` in `CalculatorMeta` must be substantive. Mirror the golden page structure.
- **DO NOT run** npm, pnpm, astro, vite, or any build/dev commands when editing calculator definitions. Edit source files only.

## Out of scope / don't touch
- (fill in as needed)

---
# CalcEngine — AI_AGENTS.md

## 🎯 Project Goal

Build a scalable, SEO-first platform of engineering calculators.

Primary objective:
- Rank for long-tail “calculator” keywords
- Generate organic traffic via many small tools
- Scale to 50–100+ calculators efficiently

---

## 🧠 Core Strategy

### Key principle:
> Volume + structure + internal linking = SEO growth

We win by:
- Shipping many calculator pages
- Targeting long-tail keywords
- Linking all pages together
- Using static HTML (Astro) for SEO

---

## 🏗️ Architecture Overview

- Framework: Astro (SSG)
- Interactive layer: React (islands)
- Content: Schema-driven (calculator registry)
- Routing: Static generation via `[slug].astro`

---

## 📦 Calculator System Design

Each calculator is defined via a schema:

- slug
- title
- description
- keywords
- category
- introHtml
- howItWorksHtml
- formulaHtml
- exampleHtml
- howToUseHtml
- faqHtml
- whyItMattersHtml
- related calculators
- component name

👉 Adding a new calculator should NOT require new routing or page files.

---

## 🤖 AI Agents

---

### 1. Idea Generator Agent

**Purpose:**
Find new calculator ideas with SEO potential

**Input:**
- niche (e.g. dev, API, performance)

**Output:**
- calculator name
- primary keyword
- search intent
- difficulty estimate

**Rules:**
- prioritize long-tail keywords
- avoid high competition terms
- focus on real dev pain

---

### 2. Content Generator Agent

**Purpose:**
Generate full SEO content for each calculator

**Output:**
- title
- meta description
- intro
- how it works
- formula
- example
- FAQ
- related calculators

**Rules:**
- 800–1200 words equivalent
- no fluff
- developer-friendly tone
- optimized for snippets

---

### 3. Code Generator Agent

**Purpose:**
Generate calculator logic

**Output:**
- React component (TSX)
- simple inputs + outputs
- no heavy dependencies

**Rules:**
- must be deterministic
- fast and lightweight
- handle invalid input gracefully

---

### 4. Registry Agent

**Purpose:**
Add new calculators to system

**Actions:**
- update `calculators.ts`
- register component
- add metadata
- link related calculators

**Rules:**
- no duplicate slugs
- ensure internal linking coverage

---

### 5. SEO Agent

**Purpose:**
Optimize pages for ranking

**Checks:**
- keyword in title
- meta description present
- H1 present
- intro length sufficient
- FAQ present
- internal links ≥ 3

---

### 6. Internal Linking Agent

**Purpose:**
Ensure SEO graph connectivity

**Rules:**
- each page links to 3–5 others
- prioritize related calculators
- maintain bidirectional linking when possible

---

### 7. Batch Content Agent

**Purpose:**
Scale content generation

**Input:**
- list of calculator titles

**Output:**
- full SEO content for all calculators

**Behavior:**
- runs in batch (not manual)
- outputs structured content for ingestion

---

### 8. Promotion Agent

**Purpose:**
Drive initial traffic + backlinks

**Channels:**
- Reddit (r/webdev, r/programming)
- Dev.to
- Hacker News

**Style:**
- “built a free tool”
- no spam
- focus on usefulness

---

## 📈 SEO Rules (Non-negotiable)

1. Each page must target:
   - “[keyword] calculator”
   - “how to calculate [keyword]”
   - “[keyword] formula”

2. Each page must include:
   - intro
   - tool
   - how it works
   - formula
   - example
   - FAQ
   - related links

3. URLs must be: /calculators/{slug}

---

## ⚡ Workflow

### Phase 1 (0–2 weeks)
- Launch 10 calculators
- Focus:
  - OpenAI cost
  - JSON size
  - rate limits
  - encoding

---

### Phase 2 (2–4 weeks)
- Expand to 25+ calculators
- Add supporting pages:
  - “how to calculate”
  - “formula explained”

---

### Phase 3 (1–2 months)
- Scale to 50–100 calculators
- Add:
  - programmatic variations
  - cloud cost tools
  - performance tools

---

## 🚀 Success Metrics

- Indexed pages (GSC)
- impressions
- clicks
- top 20 keyword rankings
- tool usage

---

## ⚠️ Constraints

- Do NOT overbuild UI
- Do NOT block on perfection
- Ship fast, iterate later
- Prioritize SEO over design

---

## 🏁 Definition of Done

A calculator is complete when:
- page is generated
- SEO content is added
- internal links exist
- route works
- page is indexed

---

## 🔥 Key Insight

> CalcEngine is not a tool.

> It is a **search engine surface area generator**

---

## 🧭 Long-Term Vision

- 100+ calculators
- multiple niches (dev, finance, auto)
- strong internal linking graph
- high organic traffic

👉 Become:
**“Omni for calculators”**

## SEO Prompt — Calculator Page Content

Use this prompt when generating content for a new calculator definition.

```
You are an SEO expert and technical writer.

Write a complete SEO-optimized page for a calculator tool.

INPUT:
- Calculator name: {{calculator_name}}
- Primary keyword: {{primary_keyword}}
- Secondary keywords: {{secondary_keywords}}
- What it calculates: {{description}}

GOAL:
Rank for:
1. "{{primary_keyword}} calculator"
2. "how to calculate {{primary_keyword}}"
3. "{{primary_keyword}} formula"

OUTPUT FORMAT:

1. Title:
- Must start with primary keyword
- Add "(Free + Accurate 2026)"

2. Meta description:
- 140–160 chars
- Include keyword naturally

3. H1:
- Same as title (or close)

4. Intro (150–250 words):
- Explain problem simply
- Include keyword early
- Mention calculator benefit

5. How it works:
- Step-by-step explanation
- Bullet points

6. Formula section:
- Show formula
- Explain variables simply

7. Example:
- Use real numbers
- Show step-by-step calculation

8. Calculator instructions:
- How to use this tool

9. FAQ (5 questions):
- Include long-tail keywords

10. Internal links section:
- Suggest 3 related calculators

STYLE:
- Simple, clear, developer-friendly
- Avoid fluff
- Use short paragraphs
- Use headings (H2/H3)

IMPORTANT:
- Optimize for featured snippets
- Keep content practical
- No generic filler
```

Map output to `CalculatorMeta` fields:
| Prompt output | `CalculatorMeta` field |
|---|---|
| Title | `title` |
| Meta description | `description` |
| Intro | `intro` |
| How it works | `howItWorks` |
| Formula | `formula` |
| Example | `example` |
| FAQ | `faq[]` |
| Related calculators | `relatedSlugs[]` |

---

## SEO Prompt — Full Cluster (Main + How-To + Formula Pages)

Use this prompt to generate a complete 3-page SEO cluster per calculator. Run once per new calculator added.

```
You are an expert SEO strategist and technical writer.

Your task is to fully optimize a calculator page and generate additional SEO pages to maximize organic traffic.

INPUT:
- Calculator name: {{calculator_name}}
- Primary keyword: {{primary_keyword}}
- Secondary keywords: {{secondary_keywords}}
- What it calculates: {{description}}

GOAL:
Create a complete SEO cluster:
1. Main calculator page
2. "How to calculate" page
3. "Formula explained" page

-----------------------------------
PART 1 — MAIN CALCULATOR PAGE
-----------------------------------

Generate:

1. SEO Title:
- Must start with primary keyword
- Add: "(Free + Accurate 2026)"

2. Meta Description:
- 140–160 characters
- Include primary keyword naturally

3. H1:
- Same or very close to title

4. Intro (150–250 words):
- Explain the problem simply
- Include keyword early
- Mention why the calculator is useful

5. How It Works:
- Step-by-step bullets
- Clear and concise

6. Formula Section:
- Show formula
- Explain each variable simply

7. Example:
- Real-world example
- Step-by-step calculation

8. How to Use This Calculator:
- Simple instructions

9. FAQ (5 questions):
- Include long-tail keywords
- Keep answers concise

10. Internal Links Section:
Suggest 3 related calculators (relevant to input)

-----------------------------------
PART 2 — "HOW TO CALCULATE" PAGE
-----------------------------------

Generate a full SEO article:

- Title: "How to Calculate {{calculator_name}}"
- Meta description
- 800–1200 words
- Include:
  - Step-by-step explanation
  - Formula
  - Example
  - Common mistakes
  - FAQ (5 questions)

IMPORTANT:
- Do NOT duplicate content from main page
- Write more educational and detailed

-----------------------------------
PART 3 — "FORMULA EXPLAINED" PAGE
-----------------------------------

Generate a full SEO article:

- Title: "{{calculator_name}} Formula Explained"
- Meta description
- 800–1200 words
- Include:
  - Deep explanation of formula
  - Variable breakdown
  - Variations of formula
  - Practical use cases
  - FAQ (5 questions)

IMPORTANT:
- Focus on clarity + technical depth
- Avoid repeating content from other sections

-----------------------------------
STYLE RULES
-----------------------------------

- Clear, concise, developer-friendly tone
- Avoid fluff and generic statements
- Use headings (H2/H3)
- Use short paragraphs
- Optimize for featured snippets
- Make content practical and actionable

-----------------------------------
OUTPUT FORMAT
-----------------------------------

Return output in 3 clearly separated sections:

1. MAIN PAGE
2. HOW TO CALCULATE PAGE
3. FORMULA PAGE

Each section must include:
- Title
- Meta description
- Structured content

-----------------------------------
IMPORTANT
-----------------------------------

- Content must be SEO-optimized but natural
- Prioritize clarity over verbosity
- Avoid repetition across sections
- Make it ready to paste into a website
```

Map cluster output to routes:
| Section | Route pattern | Purpose |
|---|---|---|
| Main page | `/calculators/{{slug}}` | Primary calculator page, maps to `CalculatorMeta` |
| How-to page | `/calculators/{{slug}}/how-to-calculate` | Educational long-form, targets "how to calculate X" |
| Formula page | `/calculators/{{slug}}/formula` | Technical depth, targets "X formula explained" |
