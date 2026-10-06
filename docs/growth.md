# Growth Log — calcengine.site

> **What this file is for:** an honest, append-only log of growth experiments
> on this site — what was tried, what was measured, what happened. The data
> source is GSC; this file narrates *why*. Future-you (or future-Claude)
> reads this when deciding what to try next, both on this site and on
> related sister sites.

## How to use this (workflow — re-read this when you forget)

**Add an entry whenever you do something growth-relevant.** That includes:
shipping new content, structural SEO changes (sitemap, schema, redirects,
internal linking), tech changes that affect crawl/indexing, marketing
pushes, backlink campaigns. *Not* every code commit — just things you'd
want to point at when GSC numbers move (or fail to).

**Each entry is a hypothesis you can be wrong about.** Commit to a
measurable KPI and an observation window before acting — otherwise "did
this work?" is just a feeling.

### Lifecycle of one entry

1. **Day of action** — append a new dated H2 with `Status: active`, the
   hypothesis, the KPI you'll watch, current baseline numbers, what you
   did, and the date to review (default: today + 28 days, matching GSC's
   reporting window).
2. **Review day** — pull current GSC numbers, compute delta vs baseline.
   Fill in **Result** and **Learning**. Set **Status** to `shipped` (worked,
   keep going), `failed` (didn't pay off, abandon), or extend the review
   another window if results are ambiguous.
3. **Never rewrite older entries.** Wrong hypotheses are the most valuable
   data — they tell you what NOT to repeat on the next site. Append, don't
   edit.

### Where to get the numbers

```bash
cd ~/work/projects/sites/portfolio && make run ARGS="gsc sync"
```

Then read the row for `calcengine.site`. Or pull from
https://search.google.com/search-console directly.

### Format

```
## YYYY-MM-DD — <one-line hypothesis or action>
- **Status:** active | testing | shipped | failed | abandoned
- **KPI:** <what GSC metric / query / page>
- **Baseline:** <numbers at start>
- **Action:** <what was done; 1-2 lines>
- **Result:** <numbers after window; "TBD — review YYYY-MM-DD" until then>
- **Learning:** <why it worked / didn't; what to try next; "TBD" until reviewed>
```

---

## 2026-05-09 — site scaffolded; growth log started
- **Status:** active
- **KPI:** any GSC traffic — clicks, impressions, indexed-page count
- **Baseline:** 0 clicks / 0 impressions (just deployed)
- **Action:** project scaffolded via `portfolio new bootstrap`; first deploy
  pending. After deploy: verify in GSC as `sc-domain:calcengine.site` and submit
  the sitemap.
- **Result:** TBD — review 2026-06-06
- **Learning:** TBD

## 2026-10-05 — demand-first pivot: 10 high-demand calculators (Experiment 1)
- **Status:** active
- **KPI:** indexed count (URL Inspection), 28d impressions/clicks site-wide and for the 10 new URLs, queries per new URL
- **Baseline:** 69 sitemap URLs, 1 indexed (68 "URL is unknown to Google"); 28d 12 imp / 0 clicks / pos 19.8 (2026-09-05→10-02); prior 28d 48 imp. Snapshot `seo/snapshots/2026-10-05.json`
- **Action:** PRD v2 — 10 calculators chosen by Ahrefs demand (markup, PayPal/Stripe/Etsy fees, commission, food cost, weighted average, wire size, amp, energy cost) + Business/Electrical/Developer hubs + homepage repositioning. Etsy fee calculator held back (rates unverified on the live site). 69 → 81 sitemap URLs, none removed. Full thesis + checkpoints: `docs/seo-experiments.md`
- **Result:** TBD — day-14 discovery check, day-30 comparison, day-60–90 decision (dates from deploy day)
- **Learning:** TBD
