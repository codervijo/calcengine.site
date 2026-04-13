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
