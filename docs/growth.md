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

## 2026-10-31 — day-14 review: discovery still broken; low authority ruled out as the sole cause
- **Status:** testing
- **KPI:** URL Inspection state of the 12 new v2 URLs; whole-site indexed count; 28d impressions
- **Baseline:** 2026-10-05 entry above (1/69 indexed; 12 imp / 0 clicks 28d)
- **Action:** none on the site. Day-14 capture (late): full URL Inspection on all 81 sitemap URLs → `seo/snapshots/2026-10-31.json`. Keyword research + SERP checks via treg (PRD v2.F).
- **Result:** GSC re-fetched the sitemap 2026-10-26 and crawled the homepage the same day, yet **1/81 indexed, 80 "URL is unknown to Google", 0/12 new v2 URLs discovered**. 28d (10-01→10-28): 9 imp, 0 clicks, pos 28.3. Ahrefs DR **1.4**.
- **Learning:**
  - **Low domain authority is not the whole explanation.** The first post-mortem blamed the near-zero DR. But SERP checks on 2026-10-31 found **DR 0 sites on page 1** for the same kind of calculator queries: xtraw.com, cinderblockcalculator.net, lumabasket.com (cinder block calculator), jampos.app (gross profit margin), rentreport.io (prorated rent). Ahrefs free DR. Other small rankers: topsoilcalconline.com DR 9, loadoptimizer.ai DR 10, lotsite.ai DR 12. New, low-authority tool sites do get crawled and ranked, so calcengine's 0-of-80 discovery is anomalous, not normal for a young domain.
  - **Operator hypothesis: v1 was built without checking search volume, and that caused the low impressions.** Two parts:
    - *Demand side (supported):* v1 developer calculators were picked without SV research. Later Ahrefs checks put them at ~0–30 US searches a month. Even fully indexed, they could not have produced meaningful impressions. v1's thesis fails on demand regardless of indexing.
    - *Discovery side (open):* the observed ~12 impressions came almost entirely from the homepage, because 68/69 pages were never discovered at all. A possible link (unproven): Google's crawl demand favours URLs it predicts people want, so a site whose first 58 deep pages target near-zero-demand queries may have been given low crawl priority site-wide. If so, the no-SV choice in v1 caused the discovery failure too, not just weak rankings.
  - **How to tell:** v2's 9 pages target 800–17,000 SV. If they get discovered by day 30–60 while the v1 pages stay unknown, that supports "low demand → low crawl priority". If v2 pages also stay unknown, the cause is site-level (domain/TLD reputation, quality classification, or technical) and demand selection alone won't fix it.
  - **Ruled out (2026-10-31, live checks):** robots.txt blocking, noindex (meta or header), redirect chains (www/http → apex 308), client-only links (16 `/calculators/*` links are plain `<a href>` in server HTML), Googlebot user-agent blocking (200).
  - Process lesson for sister sites: **check SV before building, and check indexing within 2 weeks of the first deploy.** v1 shipped 58 pages in 2026-04 and indexing wasn't measured until 2026-10-05.
- **Next review:** Day 30, 2026-11-04.

## 2026-10-31 — IndexNow submission of unsubmitted sitemap URLs
- **Status:** active
- **KPI:** Bing discovery/indexing of calcengine.site URLs (Bing Webmaster Tools). Not a Google KPI: Google does not consume IndexNow.
- **Baseline:** not captured. No Bing Webmaster data has been pulled for this site yet. Google: 1/81 indexed (see the day-14 entry above).
- **Action:** `lamill project fix calcengine.site --rule CHECK_154 --apply` submitted 14 sitemap URLs that CHECK_154 flagged as never submitted (the tool didn't print which ones). Key file `/cf72530eed2cae85a7c3215d92affcbf.txt` verified live and matching before submission. CHECK_154 now passes.
- **Result:** TBD — review 2026-11-28. Needs a Bing baseline first; without one, any Bing number is uninterpretable.
- **Learning:** TBD. Side benefit if it works: Bing indexing a page Google ignores would point to a Google-specific cause (site-level classification) rather than a technical one.
