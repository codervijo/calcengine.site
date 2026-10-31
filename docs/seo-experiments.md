# SEO Experiments — calcengine.site

> **What this file is for:** the durable record of CalcEngine's SEO
> experiments: what we changed, why, what Google saw before the change,
> and whether it worked. Written so that an agent or human picking this
> up months later can reconstruct the reasoning without the chat history.
>
> **Rules:**
> - Append, never rewrite. Wrong hypotheses are the most valuable entries.
> - Raw data lives in `seo/snapshots/YYYY-MM-DD.json` (one file per
>   capture, never overwritten). This file narrates; the snapshots are
>   the evidence.
> - Every number states its source: **GSC API** (captured by us),
>   **operator-supplied** (from portfolio tooling / Ahrefs, as given), or
>   **inferred** (derived, with the derivation shown).
> - `docs/growth.md` is the short per-action growth log; this file holds
>   the experiment-level thesis and evaluation.

---

## Experiment 0 — Developer Calculator Thesis (CLOSED 2026-10-05)

**Period:** 2026-04-13 (Astro SSG launch) → 2026-10-05.
**PRD scope:** v1 (v1.B–v1.E).

### Thesis

> A broad collection of calculators aimed primarily at software
> engineers/developers could create a scalable SEO surface.

The site grew to **69 indexable/sitemap pages**: 58 calculator pages
(OpenAI cost, JSON/Base64 size, rate limits, latency, Kubernetes,
cloud cost, EU CRA compliance, …), 6 category hubs, and 5 site pages.

### Observed results

**Operator-supplied (portfolio tooling, around 2026-10-05), 28-day window:**

| Metric | Value |
|---|---:|
| Pages | 69 |
| Impressions (28d) | 12 |
| Clicks (28d) | 0 |
| Average position | 19.8 |
| Δ impressions vs ≈2026-09-05 | −35 |
| Last crawl (portfolio tooling) | 2026-09-18 |
| Site last updated | 2026-08-14 |

The prior comparison period therefore had **~47 impressions**. This is
*inferred from the portfolio ΔImp value, not a directly captured GSC
snapshot.*

**GSC API, captured by us on 2026-10-05** (`seo/snapshots/2026-10-05.json`):

| Window | Impressions | Clicks | CTR | Avg position |
|---|---:|---:|---:|---:|
| 2026-09-05 → 2026-10-02 (28d) | 12 | 0 | 0% | 19.8 |
| 2026-08-08 → 2026-09-04 (prior 28d) | 48 | 0 | 0% | 52.1 |

The directly measured prior window (48) agrees closely with the
inferred ~47. The two figures come from different capture methods
and possibly slightly different windows, so we treat them as two
separate measurements and do not merge them.

Top queries, 90d: `calcengine` (15 imp), `calc engine` (6),
`calculator api` (6), `api calculator` (2), `calculate api` (2), plus
single impressions for `api calculation`, `api calculator online`,
`how to calculate api`. **Every impression in 90 days landed on the
homepage.** No calculator page received a single impression.

### Critical finding: Google never discovered the calculator pages

URL Inspection on all 69 sitemap URLs (2026-10-05):

| Coverage state | URLs |
|---|---:|
| Submitted and indexed | **1** (the homepage) |
| URL is unknown to Google | **68** |

GSC last downloaded the sitemap on **2026-06-19**.

So the GSC result of Experiment 0 is mainly a **discovery/indexing
failure**, not a measurement of how calculator pages perform in search.
68 pages that Google has never seen cannot rank, whatever the demand
behind them.

Likely contributors (not yet diagnosed, hypotheses only):

- The canonical host moved www → apex on 2026-06-12 (`876aa9f`), and
  the sitemap was last fetched one week later.
- A young domain with near-zero external links, which means a low
  crawl budget.
- The homepage linked to only 4 calculators; most were reachable only
  from `/calculators` and the category hubs, which are themselves
  undiscovered.

### Keyword validation that rejected the thesis (operator-supplied, Ahrefs)

The demand argument stands independently of the indexing failure.
Ahrefs research into developer calculators showed very weak demand:

| Keyword | US SV | KD |
|---|---:|---:|
| claude api cost calculator | ~30 | — |
| api cost calculator | ~30 | ~33 |
| gemini api cost calculator | ~20 | — |
| chatgpt api cost calculator | ~20 | ~39 |
| server capacity calculator | ~20 | — |
| json byte size calculator | ~10 | — |
| base64 size calculator | ~0–10 | — |
| requests per second calculator | ~0–10 | — |
| kubernetes cpu calculator | ~0–10 | — |
| concurrency calculator | ~0–10 | — |
| kubernetes resource calculator | ~0–10 | — |
| api rate limit calculator | ~0–10 | — |
| base64 overhead calculator | ~0–10 | — |
| gzip compression calculator | ~0–10 | — |
| kubernetes memory calculator | ~0–10 | — |
| docker memory calculator | insufficient Ahrefs demand | — |
| requests per minute calculator | insufficient Ahrefs demand | — |

### Conclusion

> **Natural combinatorial page surface does not imply natural search
> demand.**

The developer-calculator thesis scaled well technically. But search
demand was too weak to justify scaling it toward 1,000+ pages:
~69 technically legitimate pages produced tens of monthly impressions
and effectively no organic clicks.

**Caveat:** because 68/69 pages were never discovered, Experiment 0 did
not fully test demand in the SERPs. The Ahrefs data is what rejects
the thesis. The GSC data mainly shows that the site also has a
discovery problem. Experiment 1 has to clear that discovery problem
before it can tell us anything about demand (see its preconditions).

---

## Experiment 1 — Demand-First Broad Calculator Pivot (ACTIVE from 2026-10-05)

**Start date:** 2026-10-05.
**PRD scope:** v2 (v2.A–v2.G).
**Baseline:** `seo/snapshots/2026-10-05.json`, captured *before* any v2
change was deployed.

### Hypothesis

> If CalcEngine builds genuinely useful calculators around keywords with
> demonstrated search demand and relatively weak SERPs/KD, Google will
> discover/rank substantially more of the site than under the
> developer-calculator strategy.

Process change:

- Before: `idea → calculator → hope people search`
- Now: `search demand → SERP validation → calculator → measure`

### Portfolio-level question being tested

> Can AI-assisted development let us scale from ~100-page sites toward
> 1,000+ pages safely by first identifying a repeatable,
> search-demand-validated page primitive?

Experiment 0 showed that **69 technically legitimate pages can still
produce almost no SEO value when the underlying query demand is weak.**
Experiment 1 tests whether choosing calculators by demand first fixes
that. **The goal is not page count.** It is a validated page type
worth repeating.

### Demand research (operator-supplied, Ahrefs, US)

| Keyword | US SV | KD | In Phase 1? |
|---|---:|---:|:-:|
| markup calculator | 17,000 | 6 | ✓ |
| PayPal fee calculator | 13,000 | 0 | ✓ |
| weighted average calculator | 10,000 | 0 | ✓ |
| shipping calculator | 10,000 | 0 | — |
| wire size calculator | 7,000 | 6 | ✓ |
| tile calculator | 5,600 | 8 | — |
| commission calculator | 5,200 | 0 | ✓ |
| deck calculator | 4,100 | 5 | — |
| fence calculator | 3,700 | 4 | — |
| amp calculator | 2,900 | 2 | ✓ |
| flooring calculator | 2,500 | 8 | — |
| food cost calculator | 2,100 | 5 | ✓ |
| Etsy fee calculator | 2,000 | 6 | ✓ |
| Stripe fee calculator | 1,800 | 0 | ✓ |
| energy cost calculator | 800 | 5 | ✓ |
| battery calculator | 700 | 8 | — |
| catering calculator | 500 | 8 | — |

SERP inspection (operator) suggested several of these queries rank
smaller, specialised calculator sites rather than being locked up by
large incumbents.

**Phase 1 = deliberately a 10-page validation batch.** Rows marked "—"
are not built. Nothing beyond these 10 pages gets built until the
checkpoints below say SCALE.

### What changed (filled in at deploy, see PRD v2.B–v2.E)

New URLs introduced:

- `/calculators/paypal-fee-calculator`
- `/calculators/stripe-fee-calculator`
- `/calculators/commission-calculator`
- `/calculators/markup-calculator`
- `/calculators/food-cost-calculator`
- `/calculators/weighted-average-calculator`
- `/calculators/wire-size-calculator`
- `/calculators/amp-calculator`
- `/calculators/energy-cost-calculator`
- `/calculators/business` (Business & Seller hub)
- `/calculators/electrical` (Electrical & Energy hub)
- `/calculators/developer` (Developer hub, which groups the existing developer sub-hubs)

**Held back:** `/calculators/etsy-fee-calculator`. It is built but not
published, because Etsy's rates could not be verified on the live site
(etsy.com returns 403 to automated fetches). The operator decided on
2026-10-05 not to hold the deploy for it. **Phase 1 is therefore a 9-calculator
batch.** If Etsy ships later, give it its own day 0 in the checkpoint
log.

Existing URLs: all 69 kept. None removed, none redirected.

Sitemap after the change: **81 URLs** (69 + 9 calculators + 3 hubs),
verified from a local production build on 2026-10-05.

Other changes that may affect discovery of the *old* pages too (so
don't credit them only to demand):

- The homepage now links to every non-developer calculator, the three
  vertical hubs, and 4 developer calculators (before: 4 calculators).
- The new `/calculators/developer` hub links to all 58 developer pages,
  and every page footer links to every hub.
- Breadcrumbs gained a category level (calculator → hub).

Deployment date: **2026-10-05** (push to `main`; Vercel auto-deploys).
Deployment git SHA: the v2 commit on `main` (see the checkpoint log entry).

### Preconditions (checked before judging the hypothesis)

Because of Experiment 0's discovery failure, Experiment 1 is only
interpretable once Google has actually *seen* the new pages:

1. GSC has re-downloaded the sitemap after deploy.
2. URL Inspection shows the 9 new calculator URLs as at least "Discovered" or
   "Crawled", not "URL is unknown to Google".

If these fail at ~14 days, the result is "**discovery still broken**",
not "demand-first failed". Fix discovery and restart the clock.

### Success criteria and checkpoints (defined before deployment)

Day 0 = **2026-10-05** (v2 production deploy). Day 14 = 2026-10-19 ·
Day 30 = 2026-11-04 · Day 60 = 2026-12-04 · Day 90 = 2027-01-03.

**~Day 14: crawl / index / first impressions.** Do not judge rankings yet.

- Sitemap re-fetched by GSC (date).
- URL Inspection state for each of the 9 new calculator URLs: unknown /
  discovered / crawled / indexed.
- Count of new URLs with ≥1 impression.
- Queries matched per new URL (are they the intended head terms or
  close variants?).
- Indexed count, whole site (baseline: 1).

**~Day 30: compare to baseline.**

- Indexed new pages (n/9).
- Impressions 28d, site-wide and for the 9 new pages (baseline: 12).
- Clicks 28d (baseline: 0).
- Average position, site-wide and per new page (baseline: 19.8).
- Queries per new page and impressions per new page.
- Developer pages: did indexing of the old pages improve as a side
  effect (via new hubs and homepage links)?

**~Day 60–90: decide.**

- **SCALE:** build the next 50–100 validated calculators. Requires most
  of the 9 to be indexed and earning impressions on their target
  queries, with a clear trend up. If the trend is ambiguous, extend
  the window rather than scale.
- **ITERATE:** improve the page primitive (content, UX, linking,
  speed) before scaling. Use this when pages are indexed but rank
  poorly or match off-target queries.
- **STOP / PIVOT:** if high-demand calculators also fail to get
  meaningful discovery after the preconditions are met.

Do **not** generate hundreds of pages before there is Phase 1 evidence.

### Checkpoint log

*(Append dated entries below. Each one points to its
`seo/snapshots/YYYY-MM-DD.json`.)*

#### 2026-10-05 — baseline (pre-deploy)

- Snapshot: `seo/snapshots/2026-10-05.json`
- Indexable pages: 69 (live sitemap: 69 URLs)
- Indexed (URL Inspection): **1 / 69**
- GSC 28d (2026-09-05 → 2026-10-02): 12 impressions, 0 clicks, 0% CTR,
  avg position 19.8
- GSC prior 28d (2026-08-08 → 2026-09-04): 48 impressions, 0 clicks,
  avg position 52.1
- Top queries 28d: `calcengine` 5, `calc engine` 1, `calculate api` 1,
  `calculator api` 1
- Top pages 28d: `/` (all 12 impressions)
- Git SHA at capture: `3949dd89fafd142489305e8e48add5271768fd78`

#### 2026-10-05 — v2 deployed (day 0)

- Pushed to `main` (Vercel auto-deploy): `1da5617ff30e822c0d9f6b5514846244ffdef3a5`
- Live sitemap target: 81 URLs (69 existing + 9 calculators + 3 hubs)
- Etsy fee calculator held back (rates unverified on the live site)
- Next: day 14 on 2026-10-19 (discovery check)
- Sitemap force-resubmitted to GSC via `lamill settings gsc submit-sitemap --force`
  at 2026-10-06T00:25Z (UTC); GSC shows it pending, last download still 2026-06-19.
  Day-14 check: confirm `lastDownloaded` moved past this date.

#### 2026-10-05 — session close

State at close:

- Live: 81 sitemap URLs (69 existing + 9 calculators + 3 hubs), verified
  200 on every new URL; Etsy page 404 (held back).
- GSC: sitemap resubmitted and pending; Google has not re-downloaded it yet.
  Per-URL "Request indexing" for the 12 new URLs is a manual GSC step for the operator.
- Tests at deploy: unit 73/73, SEO suite 12/12, production build 81 URLs.
- Not yet done: real-browser use of the 9 calculators (operator validation);
  Etsy rate confirmation.

Open items carried forward:

1. **Day 14 — 2026-10-19:** discovery check (preconditions above). Capture
   `seo/snapshots/2026-10-19.json`.
2. **Day 30 — 2026-11-04:** baseline comparison.
3. **Day 60 — 2026-12-04 / Day 90 — 2027-01-03:** SCALE / ITERATE / STOP.
4. Etsy: confirm live rates → re-register → separate day 0.

#### 2026-10-31 — day 14 checkpoint (captured late, day 26)

Due 2026-10-19; missed, captured 2026-10-31. Source: **GSC API**, full
URL Inspection on all 81 live sitemap URLs.

- Snapshot: `seo/snapshots/2026-10-31.json`
- Git SHA at capture: `0248f97f88f1ced059aa635c6e4c524ebc71582d` (no code
  change since the v2 deploy `1da5617`; later commits are docs only)
- Live sitemap: 81 URLs; all 12 new v2 URLs present
- **Precondition 1 — sitemap re-fetched: PASS.** GSC `lastDownloaded`
  2026-10-26T18:39Z (was 2026-06-19). The homepage was crawled the same
  day (2026-10-26T23:22Z).
- **Precondition 2 — new URLs discovered: FAIL.** URL Inspection:

  | Scope | Indexed | URL is unknown to Google |
  |---|---:|---:|
  | Whole site (81) | 1 (homepage) | 80 |
  | New v2 URLs (9 calculators + 3 hubs) | 0 | 12 |

- GSC 28d (2026-10-01 → 2026-10-28): 9 impressions, 0 clicks, avg
  position 28.3. Prior 28d (2026-09-03 → 2026-09-30): 14 impressions,
  0 clicks, pos 20.2. (These windows differ from the baseline's
  2026-09-05 → 10-02 = 12; do not diff them directly.)
- Pages since deploy (2026-10-05 → 10-28): only `/` (5 impressions).
  No new URL has an impression. Only query reported:
  `api calc` → `/` (3 impressions, pos 79.7); the rest are anonymized.
- External signal (Ahrefs, 2026-10-31): Domain Rating **1.4**.

**Verdict: discovery still broken.** Not "demand failed". Per the
preconditions rule, Experiment 1 cannot be judged yet. Google read the
sitemap and crawled the homepage, but five days later it had not
discovered any sitemap URL, including the pages the homepage links to.

Post-mortem reading (hypotheses, not diagnosed):

1. **Crawl priority / no external links** (DR 1.4). Google fetches
   the sitemap and the homepage but has never put a deeper URL in its
   crawl queue over ~6.5 months. **Weakened the same day:** the v2.F
   SERP checks below found DR 0 sites on page 1 for several calculator
   queries, so low authority alone does not explain it. Still
   unexplained. Remaining hypotheses (none tested): domain/TLD-level
   reputation (`.site`), a site-level quality classification after the
   58-page templated batch in 2026-04, or normal lag after the
   2026-10-26 sitemap fetch. Homepage links are plain `<a href>` in
   server HTML (16 `/calculators/*` links), no noindex anywhere, and a
   Googlebot user agent gets 200.
2. **Pages built ahead of indexing.** 106 of 126 commits landed in
   2026-04; indexing was first measured 2026-10-05. Adding more pages
   could not help while discovery was broken.
3. **Experiment 0 demand** was also near zero (Ahrefs, above), so v1
   would not have produced traffic even if indexed.
4. **The sitemap went unread 2026-06-19 → 2026-10-26.** Possibly linked
   to the www → apex move (2026-06-12); unproven.
5. **No promotion or backlink work** was ever done (the "Promotion
   Agent" in `AI_AGENTS.md` never ran).
6. Five days between sitemap fetch and inspection may still be normal
   lag. Day 30 (2026-11-04) shows whether the URLs move to Discovered.

Live-site technical checks (2026-10-31) found no blocker: www/http 308
→ apex, robots.txt allows `/`, valid sitemap index, self-canonicals,
JSON-LD present, about 1,100 words of server-rendered HTML on
`/calculators/markup-calculator`.

Tooling note: `portfolio project check` reported missing `og:image` /
JSON-LD / short meta description on the homepage; all are present
live (stale check). `portfolio project seo` labels the site "🟢 healthy
— earning traffic" at 9 impressions / 0 clicks. Both are misleading for
this site.

Next: Day 30 on 2026-11-04. If the URLs are still unknown, fix
discovery before restarting the experiment clock.

### Keyword research — PRD v2.F (2026-10-31)

Research only. Nothing here gets built until discovery is fixed and v2.G
returns SCALE. Source: **treg**, captured 2026-10-31 (call IDs below). Cost
about $1.13 in total.

Method:

1. Serpstat phrase-match on `calculator`, US (calls `df4ab680…`,
   `36a1b57a…`). Rejected: volumes are bucketed and padded with
   misspellings, and its difficulty scores are not credible ("mortgage
   calculator" = 2).
2. DataForSEO Labs keyword suggestions for `calculator`, US, volume
   1,000–30,000, KD ≤ 20, synonyms collapsed (call `47b11ed8…`):
   6,894 matches; the top 1,000 were clustered by intent and curated.
3. Google SERP top 10 for 8 candidates (treg routed SERP, crawl4ai),
   with Ahrefs free DR for the small sites that rank.

Caveats on the numbers:

- DataForSEO gives every synonym in a cluster the same volume (e.g.
  `asphalt` and `bitumen calculator` are both 27,100). Treat it as one
  intent's volume and never sum across variants.
- KD is backlink-based. It does not account for Google's own inline
  calculator, AI Overviews, or the discovery problem above.
- Sanity check vs the operator's Ahrefs figures: markup 18,100 / KD 4
  (Ahrefs 17,000 / 6), weighted average 9,900 / KD 2–6 (Ahrefs
  10,000 / 0). Consistent.

Shortlist (volume = DataForSEO US monthly; KD = DataForSEO):

| Keyword | Vol | KD | Vertical | SERP (2026-10-31) |
|---|---:|---:|---|---|
| asphalt calculator | 27,100 | 0 | Construction | Paving firms, Omni #7, shiftflow.app (DR 36) #10 |
| topsoil calculator | 18,100 | 0 | Construction | Small sites on p1: topsoilcalconline.com (DR 9), everydaybudd.com (DR 5), lotsite.ai (DR 12) |
| cinder block calculator | 9,900 | 0 | Construction | P1 mostly tool sites at DR 0–17 (xtraw.com 0, cinderblockcalculator.net 0, lumabasket.com 0) |
| stair stringer calculator | 12,100 | 11 | Construction | SERP fetch returned 1 row; re-check |
| conduit fill calculator | 18,100 | 4 | Electrical | Manufacturers (Southwire, Encore) + conduit-fill-calculator.com (DR 23). Needs NEC Chapter 9 tables; accuracy and licensing check first |
| gross profit margin calculator | 12,100 | 11 | Business & Seller | SaaS tool pages; jampos.app (DR 0) #8. Pairs with Markup |
| prorated rent calculator | 18,100 | 2 | Business & Seller | Landlord SaaS; rentreport.io (DR 0) #9 |
| freight class calculator | 14,800 | 0 | Business & Seller | Logistics firms + loadoptimizer.ai (DR 10) |

Unchecked candidates (volume / KD; SERP not yet inspected):

- Construction: drywall 14,800 / 15 · pool volume 22,200 / 0–7 ·
  sand 9,900 / 0 · sod 9,900 / 2 · paver 9,900 / 12 · recessed lighting
  8,100 / 0 · deck 12,100 / 0–12 · tile 12,100 / 7 · fence 9,900 / 0
  (deck, tile and fence were already on the deferred Ahrefs list).
- Electrical: volt amps 27,100 / 5. Overlaps the Amp calculator; may
  be a variant of it, not a new page.
- Math (the hub needs one more page): decimal to fraction 27,100 / 0 ·
  long division 27,100 / 13 · system of equations 27,100 / 4–9 ·
  mean / median 22,200 / 2–5. Likely competing with Google's inline
  calculator, Symbolab and Mathway; SERP check first.

Excluded on purpose: state paycheck and tax calculators (YMYL, tax tables
per state), medical dosing and clinical scores (YMYL), brand or product
queries (TI-84, Ramsey, NFCU, USAA), game calculators, and plain unit
conversions (assumed answered inline by Google; not checked).

Observation: these soft SERPs are crowded with recently built tool sites
on `.ai` / `.app` / `.co` domains, some at DR 0, and they rank. That
supports the demand thesis, and it makes calcengine's 0-of-80
discovery more anomalous (see Day 14 hypothesis 1).
