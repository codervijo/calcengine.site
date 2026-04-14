#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/run_claude_seo_pages.sh /path/to/repo
#
# Optional:
#   MODEL="claude-sonnet-4-20250514" ./scripts/run_claude_seo_pages.sh /path/to/repo

REPO_DIR="${1:-.}"
MODEL="${MODEL:-claude-sonnet-4-20250514}"

if ! command -v claude >/dev/null 2>&1; then
  echo "Error: claude CLI not found in PATH"
  exit 1
fi

if [ ! -d "$REPO_DIR" ]; then
  echo "Error: repo dir not found: $REPO_DIR"
  exit 1
fi

cd "$REPO_DIR"

PROMPT_FILE="$(mktemp)"
trap 'rm -f "$PROMPT_FILE"' EXIT

cat > "$PROMPT_FILE" <<'EOF'
You are working inside the CalcEngine Astro codebase.

Your job is to make production-ready code edits directly in this repo.

Goals:
1. Update all reusable prompt files, prompt templates, scaffold prompts, generator prompts, and SEO/page-generation instructions in the repo so future calculator pages follow the rules below.
2. Then update the page for:
   /calculators/openai-cost-calculator
3. Keep calculator UX tool-first and preserve existing Astro conventions.

Core UX/SEO rule:
This is a calculator app page, not a blog post.
The calculator UI must stay above the fold.
Users should see the inputs immediately.
SEO content must be below the calculator, not before it.

Global rules to apply to prompt files and generation templates:
- Tool-first layout
- H1 + very short intro above calculator
- Calculator component remains untouched
- SEO content below calculator
- No long wall of text before the tool
- Keep pages fast and lightweight
- Favor concise, snippet-friendly writing
- Favor H1 -> H2 structure
- Use internal links where relevant
- Add freshness text where appropriate for time-sensitive calculators
- Do not turn calculator pages into generic blog articles
- Do not add heavy JS or dependencies just for SEO content

For the OpenAI cost calculator page, make these exact improvements:
- Keep calculator UI where it is if already above the fold
- Ensure H1 is exactly: OpenAI Cost Calculator
- Add a 1-2 sentence intro above the calculator
- Add a freshness note below the calculator:
  Last updated: April 2026
- Add these sections below the calculator:
  1. How to calculate OpenAI API cost
  2. OpenAI pricing by model
  3. Example cost calculations
  4. Tips to reduce OpenAI API cost
  5. FAQ
- Include a simple static pricing table
- Include 3 concise example scenarios
- Include 5 short SEO-friendly FAQs
- Add internal links to related calculators or guides if routes already exist
- Keep wording concise and developer-friendly
- Keep output production-ready

Content guidance for the OpenAI page:
- Primary keyword: OpenAI cost calculator
- Natural variants:
  - OpenAI pricing calculator
  - GPT API cost
  - token cost calculator
- “How to calculate OpenAI API cost”: about 150-250 words
- “OpenAI pricing by model”: static HTML table
- “Example cost calculations”: 3 concise examples
- “Tips to reduce OpenAI API cost”: 4-6 bullets
- “FAQ”: 5 short answers
- Do not write fluff
- Do not add large content blocks above the calculator

Implementation instructions:
- Search the repo for prompt files, prompt templates, generator configs, scaffolds, and page-generation instructions related to calculators or SEO page generation
- Update them in place
- Then locate the Astro page/component/template used by /calculators/openai-cost-calculator and modify it directly
- Preserve imports, styling patterns, shared components, and layout conventions
- Do not break the app
- If there are multiple ways the route is built, inspect the real route source before editing
- Prefer minimal edits over broad rewrites

At the end:
- Print a short summary of files changed
- Print any follow-up recommendations only if truly necessary

Now inspect the repo, make the edits directly, and stop when the repo is in a clean, production-ready state.
EOF

echo "Running Claude in: $REPO_DIR"
echo "Model: $MODEL"

claude \
  --model "$MODEL" \
  --dangerously-skip-permissions \
  -p "$(cat "$PROMPT_FILE")"

echo
echo "Done."
echo "Suggested next commands:"
echo "  git diff --stat"
echo "  git diff"