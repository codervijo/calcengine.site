# CLAUDE.md — calcengine.site

Per-project orientation for Claude. Read this first when picking up
work on this site. Index of conventions, deferred decisions, and
non-features that aren't obvious from the code or git history.

## Project

<1-2 sentence description — fill in: what does this site do, who is
the user, what is the stack (calcengine.site runs on the sites/* workspace
shared infra: Vite or Astro + pnpm + Cloudflare Pages, with Makefile
forwarding to the central builder).>

## Commands

```bash
# Build / dev (forwards to the parent Makefile)
make deps           # install deps via the central builder
make dev            # local dev server
make build          # production build → dist/

# Test (per-stack — adjust as needed)
make test           # if a test suite is wired in

# Deploy
git push            # Vercel auto-builds on push to main
```

## Conventions

  - Build path: this project's `Makefile` → `../Makefile` (parent
    workspace) → `~/work/projects/builder/` (central builder).
  - Stack: pnpm-only. No `package-lock.json` / `bun.lockb` / `yarn.lock`.
  - Deploy: **Vercel** (confirmed from live response headers:
    `server: Vercel` / `x-vercel-id`; matches `[deploy] platform = "vercel"`
    in `lamill.toml`). Auto-builds on push to `main`.
  - Redirects live in `vercel.json` → `redirects[]`. Not `_redirects`,
    not `netlify.toml` — those are Netlify/Cloudflare formats and are
    inert here. A stale `netlify.toml` was removed 2026-08-14.
  - URL form: no trailing slash. Declared in two places that must stay
    in agreement — `trailingSlash: 'never'` (`astro.config.mjs`, what
    Astro emits) and `"trailingSlash": false` (`vercel.json`, what the
    host enforces at request time). Write redirect `source` values
    without a trailing slash to match.

## Heading hygiene

**Before adding any section, subsection, or heading to a Markdown
file, output the file's current heading outline first:**

```bash
grep -nE '^#+ ' path/to/file.md
```

Then confirm — in the chat — that the planned new heading's:

1. **Depth** (`#`, `##`, `###`, …) is the intended depth, not
   accidentally one level too shallow.
2. **Label** doesn't collide with existing headings — no duplicate
   `## 1. <title>`, no `### N.X` subsection labels that look like
   `vN.X` phase identifiers.

Only after that confirmation, write.

Applies especially to long-lived docs: `docs/prd.md`, `AI_AGENTS.md`,
`docs/architecture.md`, `docs/CLAUDE.md`.

**Why:** structural drift is invisible in any single editing session
— it only becomes obvious in the aggregate, by which time the doc is
hard to fix. The pre-edit outline ritual catches collisions and depth
mistakes at the point of writing, not at quarterly cleanup time.

## Deferred decisions

<Things deliberately *not* shipped. Append entries with rationale so
future Claude sessions don't re-propose them.>
