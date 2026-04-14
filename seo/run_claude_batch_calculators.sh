#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/run_claude_batch_calculators.sh /path/to/repo calculators.json
#
# calculators.json format:
# [
#   {
#     "route": "/calculators/openai-cost-calculator",
#     "keyword": "OpenAI cost calculator",
#     "title": "OpenAI Cost Calculator",
#     "variants": ["OpenAI pricing calculator", "GPT API cost", "token cost calculator"],
#     "freshness_note": "Last updated: April 2026"
#   }
# ]

REPO_DIR="${1:-.}"
INPUT_JSON="${2:-calculators.json}"
MODEL="${MODEL:-claude-sonnet-4-20250514}"

if ! command -v claude >/dev/null 2>&1; then
  echo "Error: claude CLI not found in PATH"
  exit 1
fi

if [ ! -d "$REPO_DIR" ]; then
  echo "Error: repo dir not found: $REPO_DIR"
  exit 1
fi

if [ ! -f "$INPUT_JSON" ]; then
  echo "Error: input json not found: $INPUT_JSON"
  exit 1
fi

cd "$REPO_DIR"

python3 - <<'PY' "$INPUT_JSON" | while IFS= read -r item_b64; do
import sys, json, base64
path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)
for item in data:
    print(base64.b64encode(json.dumps(item).encode()).decode())
PY
  ITEM_JSON="$(python3 - <<'PY' "$item_b64"
import sys, base64
print(base64.b64decode(sys.argv[1]).decode())
PY
)"

  ROUTE="$(python3 - <<'PY' "$ITEM_JSON"
import sys, json
print(json.loads(sys.argv[1])["route"])
PY
)"
  TITLE="$(python3 - <<'PY' "$ITEM_JSON"
import sys, json
print(json.loads(sys.argv[1])["title"])
PY
)"
  KEYWORD="$(python3 - <<'PY' "$ITEM_JSON"
import sys, json
print(json.loads(sys.argv[1])["keyword"])
PY
)"
  FRESHNESS="$(python3 - <<'PY' "$ITEM_JSON"
import sys, json
print(json.loads(sys.argv[1]).get("freshness_note", ""))
PY
)"
  VARIANTS="$(python3 - <<'PY' "$ITEM_JSON"
import sys, json
print(", ".join(json.loads(sys.argv[1]).get("variants", [])))
PY
)"

  echo "Processing $ROUTE"

  PROMPT="$(cat <<EOF
You are working inside the CalcEngine Astro codebase.

Task:
Update or create the page backing this route:
$ROUTE

Page intent:
This is a calculator app page, not a blog post.
The calculator UI must remain above the fold and untouched.
Users must see the input UI immediately.
SEO content should appear below the calculator.

Page requirements:
- H1 must be exactly: $TITLE
- Add a 1-2 sentence intro above the calculator
- Add freshness note below calculator if relevant:
  $FRESHNESS
- Add these H2 sections below the calculator:
  1. How to calculate the result
  2. Pricing / formula / model breakdown
  3. Example calculations
  4. Tips to reduce cost or improve usage
  5. FAQ
- Keep content concise and helpful
- Add internal links if matching routes already exist
- Use H1 -> H2 structure
- No heavy JS, no new dependencies
- Preserve Astro conventions and existing styles
- Do not break imports or shared components

SEO targeting:
- Primary keyword: $KEYWORD
- Natural variants: $VARIANTS

Quality bar:
- calculator first
- SEO second
- no fluff
- production-ready edits only

Implementation:
- Find the real source file for $ROUTE
- Edit that source directly
- If generated from a shared template/schema, make the minimal correct change there
- Print a short summary of files changed at the end

Make the edits now.
EOF
)"

  claude \
    --model "$MODEL" \
    --dangerously-skip-permissions \
    -p "$PROMPT"

done

echo "Batch complete."