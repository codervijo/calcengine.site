# AI Agent Context — calcengine

## What this project is
<1-2 sentence description — infer from README.md, package.json, go.mod, or directory name>

## Stack
<infer from files: language, frameworks, key dependencies>

## Project structure
<list top-level directories and their purpose>

## How to run
<infer from Makefile, package.json scripts, or README>

## Key conventions
- <any patterns you notice in the code>

## Out of scope / don't touch
- <leave blank for user to fill>

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
