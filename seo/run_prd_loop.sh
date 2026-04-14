#!/usr/bin/env bash
# Usage:
#   ./seo/run_prd_loop.sh [repo-dir]
#   MODEL=claude-opus-4-6 WAIT=300 ./seo/run_prd_loop.sh
#
# Reads docs/prd.md, implements the next unchecked Phase 2 calculator,
# commits locally, waits 10 minutes, then loops.
# Never pushes. Does not run npm/pnpm/build commands.

set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────────────
REPO_DIR="${1:-.}"
MODEL="${MODEL:-claude-sonnet-4-6}"
WAIT_SECONDS="${WAIT:-600}"

# ── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ── Helpers ──────────────────────────────────────────────────────────────────
die() { echo -e "\n${RED}✗ ERROR: $*${NC}" >&2; exit 1; }

banner() {
  echo -e "\n${BOLD}${CYAN}━━━ $* ━━━${NC}"
}

# ── Preflight ────────────────────────────────────────────────────────────────
[[ -d "$REPO_DIR" ]]                    || die "Repo dir not found: $REPO_DIR"
command -v claude >/dev/null 2>&1       || die "claude CLI not found in PATH"
command -v python3 >/dev/null 2>&1      || die "python3 not found in PATH"
[[ -f "$REPO_DIR/docs/prd.md" ]]        || die "docs/prd.md not found in $REPO_DIR"
[[ -f "$REPO_DIR/docs/Prompts.md" ]]    || die "docs/Prompts.md not found in $REPO_DIR"

cd "$REPO_DIR"

# ── Category mapping: PRD label → CalculatorCategory type ────────────────────
map_category() {
  case "$1" in
    Security)     echo "encoding"    ;;
    Backend)      echo "api"         ;;
    Scheduling)   echo "api"         ;;
    Performance)  echo "performance" ;;
    Cloud)        echo "performance" ;;
    Data)         echo "data"        ;;
    Network)      echo "performance" ;;
    DevOps)       echo "general"     ;;
    Database)     echo "data"        ;;
    "Dev Tools")  echo "general"     ;;
    API)          echo "api"         ;;
    *)            echo "general"     ;;
  esac
}

# ── Get next unchecked Phase 2 item ─────────────────────────────────────────
get_next_unchecked() {
  awk '/^## Phase 2/{p=1} /^## / && !/^## Phase 2/{p=0} p' docs/prd.md \
    | grep '^\- \[ \]' \
    | head -1 \
    || true
}

# ── 10-minute wait, press Enter to skip ─────────────────────────────────────
wait_or_skip() {
  local total=$WAIT_SECONDS
  local i=$total
  echo ""
  echo -e "  ${YELLOW}Next run in ${total}s — press Enter to continue early${NC}"
  while [[ $i -gt 0 ]]; do
    printf "\r  ${DIM}⏱  %3ds remaining${NC} " "$i"
    if read -r -t 1 2>/dev/null; then
      printf "\r%-55s\n" ""
      echo -e "  ${CYAN}↩ Skipped wait.${NC}"
      return
    fi
    i=$((i - 1))
  done
  printf "\n"
}

# ── Read canonical prompt template (everything after first --- in Prompts.md) ─
PROMPT_TEMPLATE=$(awk 'f; /^---$/{f=1}' docs/Prompts.md)

[[ -n "$PROMPT_TEMPLATE" ]] || die "Could not extract prompt from docs/Prompts.md (no --- separator found)"

# ── Main loop ────────────────────────────────────────────────────────────────
echo -e "\n${BOLD}CalcEngine PRD Loop${NC}"
echo -e "  Model : ${MODEL}"
echo -e "  Repo  : $(pwd)"
echo -e "  Wait  : ${WAIT_SECONDS}s between runs"

RUN=0

while true; do

  LINE=$(get_next_unchecked)

  if [[ -z "$LINE" ]]; then
    echo -e "\n${GREEN}${BOLD}✓ All Phase 2 calculators implemented. Done.${NC}\n"
    exit 0
  fi

  # Parse PRD line: "- [ ] JWT Size Calculator *(Security)*"
  NAME=$(echo "$LINE" | sed 's/^- \[ \] //' | sed 's/ \*(.*//')
  PRD_CATEGORY=$(echo "$LINE" | sed 's/.*\*(\(.*\))\*.*/\1/')
  CATEGORY=$(map_category "$PRD_CATEGORY")
  SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
  KEYWORD=$(echo "$NAME" | tr '[:upper:]' '[:lower:]')

  RUN=$((RUN + 1))
  banner "Run ${RUN}: ${NAME}"
  echo -e "  Slug     : ${SLUG}"
  echo -e "  Category : ${CATEGORY}  ${DIM}(PRD: ${PRD_CATEGORY})${NC}"
  echo -e "  Keyword  : ${KEYWORD}"
  echo ""

  # ── Build prompt ────────────────────────────────────────────────────────────
  PROMPT="${PROMPT_TEMPLATE}

---

Implement this specific calculator now using the spec above.

Calculator:      ${NAME}
Category:        ${CATEGORY}
Primary keyword: ${KEYWORD}
Slug:            ${SLUG}

GOLDEN PAGE — mirror this exactly:
  Live:   https://www.calcengine.site/calculators/openai-cost-calculator
  Source: src/calculators/definitions/openai-cost.tsx

Before writing any code, READ src/calculators/definitions/openai-cost.tsx.
Your output must mirror its structure field-for-field:
  - tagline          — 1-2 sentences shown above the calculator (above the fold)
  - lastUpdated      — set to current month and year (e.g. April 2026)
  - howItWorksTitle  — keyword-rich H2, e.g. How to Calculate ${NAME}
  - howItWorksImage  — path to the SVG you will create (see Files below)
  - intro            — 2-4 paragraphs rendered BELOW the calculator
  - formula          — monospace block with variable definitions
  - examplesTitle    — heading for the examples section
  - examples         — array of exactly 3 objects { title, body }, NOT a single text blob
  - tipsTitle        — heading for the tips section
  - tips             — array of 4-6 actionable bullet strings (HTML links allowed)
  - faq              — exactly 5 items { question, answer }, answers 40-80 words, HTML links allowed
  - relatedSlugs     — at least 3 slugs of existing calculators

HARD CONSTRAINTS — this script runs from the host machine, not inside a container:
- Do NOT run npm, pnpm, yarn, bun, or any package manager command
- Do NOT run astro, vite, tsc, or any build / dev-server command
- Do NOT run git commands
- Do NOT modify package.json, pnpm-lock.yaml, or any lockfile
- Do NOT modify docs/prd.md
- Do NOT modify or rewrite any already-implemented calculator definition
- Edit source files only — write code, do not execute it

Files to create or modify:
  src/calculators/definitions/${SLUG}.tsx           ← new definition (create)
  src/calculators/registry/index.ts                  ← add import + push to array
  public/images/calculators/${SLUG}-how-it-works.svg ← flow diagram SVG (create)

The SVG must:
  - Use a transparent background
  - Follow the same visual style as public/images/calculators/openai-cost-how-it-works.svg
  - Include role=\"img\" and aria-label on the <svg> element
  - Show the calculation flow: inputs → formula → output

After writing the files, print a one-line summary of what was created."

  # ── Run Claude ──────────────────────────────────────────────────────────────
  echo -e "${DIM}Running claude…${NC}\n"

  if claude \
    --model "$MODEL" \
    --dangerously-skip-permissions \
    -p "$PROMPT"; then

    echo ""

    # ── Mark PRD done ─────────────────────────────────────────────────────────
    DATE=$(date '+%Y-%m-%d')
    export _PRD_LINE="$LINE"
    export _PRD_DATE="$DATE"
    python3 - <<'PY'
import os
line = os.environ['_PRD_LINE']
date = os.environ['_PRD_DATE']
with open('docs/prd.md', 'r') as f:
    content = f.read()
new_line = line.replace('- [ ] ', '- [x] ', 1) + f' ✅ {date}'
content = content.replace(line, new_line, 1)
with open('docs/prd.md', 'w') as f:
    f.write(content)
PY

    # ── Commit ────────────────────────────────────────────────────────────────
    git add "src/calculators/definitions/${SLUG}.tsx" 2>/dev/null || true
    git add "src/calculators/registry/index.ts"       2>/dev/null || true
    git add "docs/prd.md"                             2>/dev/null || true
    if [[ -f "public/images/calculators/${SLUG}-how-it-works.svg" ]]; then
      git add "public/images/calculators/${SLUG}-how-it-works.svg"
    fi

    git commit -m "feat: implement ${NAME} calculator

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>" \
      || echo -e "${YELLOW}⚠ Nothing new to commit (files may already be staged).${NC}"

    echo -e "\n${GREEN}${BOLD}✓ ${NAME} committed.${NC}"

  else
    EXIT_CODE=$?
    echo ""
    echo -e "${RED}┌────────────────────────────────────────────────────┐${NC}"
    echo -e "${RED}│  FAILED: ${NAME}${NC}"
    echo -e "${RED}│  claude exited with code ${EXIT_CODE}${NC}"
    echo -e "${RED}│  Inspect the output above, fix the issue, re-run.${NC}"
    echo -e "${RED}└────────────────────────────────────────────────────┘${NC}"
    exit "$EXIT_CODE"
  fi

  # ── Check if anything left ────────────────────────────────────────────────
  NEXT=$(get_next_unchecked)
  if [[ -z "$NEXT" ]]; then
    echo -e "\n${GREEN}${BOLD}✓ All Phase 2 calculators implemented. Done.${NC}\n"
    exit 0
  fi

  wait_or_skip

done
