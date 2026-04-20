# PRD — calcengine.site

## Phase 1 — MVP Calculators (Live)
- [x] OpenAI Cost Calculator *(API / LLM)*
- [x] JSON Size Calculator *(Data)*
- [x] API Rate Limit Calculator *(Backend)*
- [x] Base64 Size Calculator *(Data)*

## Phase 2 — Calculator Expansion (50 tools)
- [x] JWT Size Calculator *(IoTSecurity)* ✅ 2026-04-14
- [x] UUID Collision Probability Calculator *(Backend)* ✅ 2026-04-14
- [x] Cron Expression Calculator *(Scheduling)* ✅ 2026-04-14
- [x] Cron Next Run Calculator *(Scheduling)* ✅ 2026-04-14
- [x] Latency Budget Calculator *(Performance)* ✅ 2026-04-14
- [x] Cache Hit Rate Calculator *(Performance)* ✅ 2026-04-14
- [x] QPS Calculator *(Backend)* ✅ 2026-04-14
- [x] Throughput Calculator *(Backend)* ✅ 2026-04-14
- [x] Concurrency Calculator *(Backend)* ✅ 2026-04-14
- [x] Bandwidth Cost Calculator *(Cloud)* ✅ 2026-04-14
- [x] Storage Cost Calculator *(Cloud)* ✅ 2026-04-14
- [x] Data Transfer Cost Calculator *(Cloud)* ✅ 2026-04-14
- [x] Payload Size Calculator *(API)* ✅ 2026-04-14
- [x] HTTP Request Size Calculator *(API)* ✅ 2026-04-14
- [x] Regex Performance Calculator *(Dev Tools)* ✅ 2026-04-14
- [x] SQL Query Cost Estimator *(Database)* ✅ 2026-04-14
- [x] Pagination Performance Calculator *(Database)* ✅ 2026-04-14
- [x] Index Size Calculator *(Database)* ✅ 2026-04-14
- [x] Thread Pool Size Calculator *(Backend)* ✅ 2026-04-14
- [x] Worker Queue Throughput Calculator *(Backend)* ✅ 2026-04-14
- [x] Retry Backoff Calculator *(Backend)* ✅ 2026-04-15
- [x] Timeout Calculator *(Backend)* ✅ 2026-04-15
- [x] API Response Time Estimator *(Performance)* ✅ 2026-04-15
- [x] Compression Ratio Calculator *(Data)* ✅ 2026-04-15
- [x] File Upload Time Calculator *(Network)* ✅ 2026-04-15
- [x] Download Speed Calculator *(Network)* ✅ 2026-04-15
- [x] TLS Handshake Time Estimator *(Network)* ✅ 2026-04-15
- [x] CDN Cost Calculator *(Cloud)* ✅ 2026-04-15
- [x] Lambda Cost Calculator *(Cloud)* ✅ 2026-04-15
- [x] Kubernetes Resource Calculator *(DevOps)* ✅ 2026-04-15
- [x] Pod Capacity Calculator *(DevOps)* ✅ 2026-04-15
- [x] CPU Usage Estimator *(Performance)* ✅ 2026-04-15
- [x] Memory Usage Calculator *(Performance)* ✅ 2026-04-15
- [x] Disk IOPS Calculator *(Storage)* ✅ 2026-04-15
- [x] RAID Capacity Calculator *(Storage)* ✅ 2026-04-15
- [x] Cache TTL Impact Calculator *(Performance)* ✅ 2026-04-15
- [x] Event Processing Rate Calculator *(Backend)* ✅ 2026-04-15
- [x] Message Queue Delay Calculator *(Backend)* ✅ 2026-04-15
- [x] Batch Processing Time Calculator *(Backend)* ✅ 2026-04-15
- [x] API Pagination Limit Calculator *(API)* ✅ 2026-04-15
- [x] Token Bucket Rate Limit Calculator *(Backend)* ✅ 2026-04-15
- [x] Leaky Bucket Rate Calculator *(Backend)* ✅ 2026-04-15
- [x] Hash Collision Probability Calculator *(IoTSecurity)* ✅ 2026-04-15
- [x] Encryption Overhead Calculator *(IoTSecurity)* ✅ 2026-04-15
- [x] Session Size Calculator *(Backend)* ✅ 2026-04-15
- [x] Log Storage Cost Calculator *(Cloud)* ✅ 2026-04-15
- [ ] Freshness Markers *(General)* — two distinct signals on every calculator page:
  1. **Code freshness** — "Last updated from git at" — derived at build time from `git log` on the definition file; injected into `dateModified` JSON-LD and shown in the UI
  2. **Data freshness** — "Data last verified" — manually set via `meta.dataUpdated` (e.g. pricing, formula accuracy, external references); shown separately in the UI so users know the underlying numbers are current

## Phase 3 — EU Cyber Resilience Act (CRA) Calculators

Target audience: embedded/IoT engineers, product managers, compliance teams shipping connected devices to the EU market.

- [ ] CRA Compliance Score Calculator *(IoTSecurity)* — inputs: OTA, encryption, auth, SBOM, logging → compliance score + missing items — "CRA compliance checklist"
- [ ] CVE Exposure Calculator *(IoTSecurity)* — inputs: library / RTOS / version list → CVE count + severity breakdown — "cve risk embedded firmware"
- [ ] Patch SLA Calculator *(IoTSecurity)* — inputs: vuln discovery date + severity → latest safe patch window per CRA deadlines — "vulnerability patch timeline cra"
- [ ] SBOM Coverage Calculator *(IoTSecurity)* — inputs: total components vs documented → % SBOM completeness + risk gaps — "sbom completeness tool"
- [ ] OTA Compliance Checker *(IoTSecurity)* — inputs: signed, rollback, encrypted flags → pass/fail vs CRA expectations — "ota firmware compliance"
- [ ] Device Lifecycle Compliance Calculator *(IoTSecurity)* — inputs: product launch date + support period → compliance status + EOL risk — "iot support lifecycle requirements eu"
- [ ] Firmware Risk Score Calculator *(IoTSecurity)* — inputs: open ports, services, default creds, update capability → attack surface score — "firmware risk assessment tool"
- [ ] Vulnerability Response Time Calculator *(IoTSecurity)* — inputs: detection → patch → disclosure timeline → compliance vs CRA obligations — "vulnerability response time requirements"
- [ ] Encryption Coverage Calculator *(IoTSecurity)* — inputs: % data encrypted at rest + in transit → compliance gap + recommendations — "iot encryption requirements eu"
- [ ] EU Device Compliance Quiz *(IoTSecurity)* — inputs: 10–15 yes/no questions → compliant / at-risk / non-compliant verdict — "is my iot device cra compliant"

## Data-Dependent Pages

Pages where hardcoded values (prices, specs, regulatory thresholds) go stale and will eventually need a scraper or ingestion pipeline to stay accurate.

### Pricing data (cloud/AI — changes frequently)

| Page | Data source | Staleness risk | Notes |
|---|---|---|---|
| `openai-cost-calculator` | [OpenAI pricing](https://openai.com/api/pricing) | High — changes without notice | GPT-4o, GPT-4o mini prices hardcoded |
| `lambda-cost-calculator` | [AWS Lambda pricing](https://aws.amazon.com/lambda/pricing/) | Medium | x86_64 + arm64 GB-s rates hardcoded |
| `cdn-cost-calculator` | [CloudFront](https://aws.amazon.com/cloudfront/pricing/), [Cloudflare](https://www.cloudflare.com/plans/) | Medium | Per-GB and per-10k-req rates hardcoded |
| `data-transfer-cost-calculator` | [AWS](https://aws.amazon.com/ec2/pricing/on-demand/), [GCP](https://cloud.google.com/vpc/network-pricing) egress pricing | Medium | Per-GB egress rates hardcoded |
| `storage-cost-calculator` | Cloud storage pricing (S3/GCS/Azure) | Low-medium | Per-GB-month rates hardcoded |
| `bandwidth-cost-calculator` | Cloud bandwidth pricing | Low-medium | Per-GB rates hardcoded |
| `log-storage-cost-calculator` | Cloud storage pricing | Low | Storage rates hardcoded |
| `sql-query-cost-estimator` | [BigQuery](https://cloud.google.com/bigquery/pricing), [Athena](https://aws.amazon.com/athena/pricing/) pricing | Low | Per-TB scan rates hardcoded |

### Regulatory data (CRA — changes as regulation matures)

| Page | Data source | Staleness risk | Notes |
|---|---|---|---|
| `cra-compliance-score-calculator` | [EU CRA text](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R2847) | Medium — regulation finalised but guidance evolving | Compliance criteria hardcoded |
| `patch-sla-calculator` | EU CRA Article 13 deadlines | Medium | Patch window thresholds hardcoded |
| `vulnerability-response-time-calculator` | EU CRA + ENISA guidance | Medium | Reporting timeline thresholds hardcoded |
| `ota-compliance-checker` | EU CRA Annex I requirements | Low-medium | Pass/fail criteria hardcoded |
| `device-lifecycle-compliance-calculator` | EU CRA support period requirements | Low | Min support period hardcoded |

### ⚠ All pricing/regulatory data is currently hardcoded inline in each `.tsx` definition file. No external JSON exists.

## Phase 4 — Externalize Pricing & Regulatory Data to JSON

Extract all hardcoded pricing tables and regulatory thresholds out of calculator definition files into versioned JSON files under `src/data/`. This decouples data updates from code changes and makes scrapers/ingesters trivial to wire up.

- [ ] Create `src/data/pricing/openai.json` and update `openai-cost.tsx` to import it *(General)*
- [ ] Create `src/data/pricing/aws-lambda.json` and update `lambda-cost-calculator.tsx` to import it *(General)*
- [ ] Create `src/data/pricing/cdn.json` and update `cdn-cost-calculator.tsx` to import it *(General)*
- [ ] Create `src/data/pricing/data-transfer.json` and update `data-transfer-cost-calculator.tsx` to import it *(General)*
- [ ] Create `src/data/pricing/storage.json` and update `storage-cost-calculator.tsx` to import it *(General)*
- [ ] Create `src/data/pricing/bandwidth.json` and update `bandwidth-cost-calculator.tsx` to import it *(General)*
- [ ] Create `src/data/pricing/log-storage.json` and update `log-storage-cost-calculator.tsx` to import it *(General)*
- [ ] Create `src/data/pricing/sql-query.json` and update `sql-query-cost-estimator.tsx` to import it *(General)*
- [ ] Create `src/data/regulatory/cra-thresholds.json` for CRA patch SLA, reporting deadlines, and compliance criteria — shared across all Phase 3 calculators *(General)*

Each JSON file should include a `lastVerified` ISO date field so the data freshness marker (Phase 2 — Freshness Markers) can read it directly.

### Ingestion pipeline candidates (priority order)

1. **OpenAI pricing** — highest churn, highest user impact; scrape `openai.com/api/pricing` → update definition
2. **AWS Lambda + CDN + egress pricing** — moderate churn; AWS pricing API available
3. **CRA patch/reporting deadlines** — monitor EUR-Lex for amendments

## SEO

### Audit Date
2026-04-13

### Strengths (preserve)
- Individual calculator pages — titles, descriptions, content, and heading structure are all excellent
- All pages have 400+ words with rich FAQ sections — no thin content
- Robots.txt and sitemap correctly configured (`@astrojs/sitemap`, `public/robots.txt`)
- Font loading optimised (preconnect + `display=swap`)
- `BreadcrumbList` JSON-LD is complete and correct on all detail pages
- Slugs are keyword-rich and consistent (e.g. `api-rate-limit-calculator`)
- ARIA labels used comprehensively throughout all pages
- OG images generated at build time via Satori (`/og/[slug].png`, `/og/home.png`)

---

### Issues by Severity

#### Critical

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| C1 | ~~**Meta description too short** — Homepage 119 chars, /calculators 99 chars (target 150–160)~~ | ~~`src/pages/index.astro:38`, `src/pages/calculators/index.astro:33`~~ | ~~Weak SERP snippets~~ | ✅ **Implemented 2026-04-13** |
| C2 | ~~**JSON-LD missing `image` fields** — `WebApplication` and `Organization` schemas have no image/logo URL~~ | ~~`src/seo/jsonLd.ts`~~ | ~~Rich results display no visuals~~ | ✅ **Implemented 2026-04-13** — `image` added to `WebApplication`, `logo` added to `Organization` |
| C3 | ~~**No Privacy Policy or Terms pages** — Legal requirement in GDPR/CCPA jurisdictions~~ | ~~—~~ | ~~Legal liability~~ | ✅ **Implemented 2026-04-13** — `/privacy`, `/terms` created; linked from footer |

#### High

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| H1 | ~~**`/calculators` links not crawlable** — All calculator `<a>` tags live inside `<SearchableListIsland client:only="react">`, so Googlebot sees no outbound links from the collection page~~ | ~~`src/pages/calculators/index.astro:49`~~ | ~~Calculator pages discovered only via homepage; collection page carries no link equity~~ | ✅ **Implemented 2026-04-13** — static `<ul>` rendered in Astro HTML; React island swaps in on mount |
| H2 | ~~**No About page** — No author or company credibility signals anywhere on the site~~ | ~~—~~ | ~~E-E-A-T penalty~~ | ✅ **Implemented 2026-04-13** — `/about` created; Vik Thomas / Lamill Web Systems; linked from footer |

#### Medium

| # | Issue | Location |
|---|-------|----------|
| M1 | **No category archive pages** — `/calculators/ai`, `/calculators/api`, etc. don't exist; category chips on homepage all link to `/calculators` | `src/pages/index.astro:100` |
| M2 | **Footer has zero links** — No Privacy, Terms, About, social, or internal navigation | `src/layouts/SiteFooter.astro` |
| M3 | **`WebSite` schema missing `SearchAction`** — Prevents Google sitelinks searchbox in SERPs | `src/pages/index.astro:19–25` |
| M4 | **`Organization` schema minimal** — Missing `logo` and `sameAs` (social media) | `src/seo/jsonLd.ts:48–57` |

#### Low

| # | Issue |
|---|-------|
| L1 | Homepage title has no action verb ("Calculate", "Try free") |
| L2 | No HTML sitemap page (XML sitemap exists — crawlers are fine) |
| L3 | `keywords` meta not passed on homepage or `/calculators` index (minor SEO value) |

---

### Metadata Status

| Page | Title | Title length | Description | Desc length | Canonical | OG image |
|------|-------|-------------|-------------|-------------|-----------|----------|
| `/` | CalcEngine — Engineering Calculators for Real Systems | 59 ✓ | ✓ Fixed | 176 ✓ | ✓ | ✓ |
| `/calculators` | All Free Engineering Calculators — API, Data & Performance Tools | 67 ✓ | ✓ Fixed | 186 ✓ | ✓ | ✓ |
| `/calculators/[slug]` | `{title} — CalcEngine` | ~68 ✓ | Action-oriented, keyword-rich | 150+ ✓ | ✓ | ✓ |
| `/404` | 404 — Page Not Found \| CalcEngine | 34 ✓ | Appropriate | 45 ✓ | — | — |

---

### JSON-LD Schema Coverage

| Schema | Pages | Status | Missing fields |
|--------|-------|--------|----------------|
| `FAQPage` | Calculator detail pages | ✓ Correct | `datePublished`, `dateModified` |
| `WebApplication` | All pages | ✓ Good | ~~**`image`**~~ ✅ fixed |
| `BreadcrumbList` | Calculator detail pages | ✓ Excellent | — |
| `Organization` | Homepage | ✓ Good | ~~**`logo`**~~ ✅ fixed · ~~`sameAs`~~ ✅ fixed |
| `CollectionPage` | `/calculators` | ✓ Good | — |
| `WebSite` | Homepage | ✓ Complete | ~~**`potentialAction` (SearchAction)**~~ ✅ fixed |

---

### Priority Fix Order

1. ~~**C1** — Expand homepage + `/calculators` meta descriptions to 150–160 chars~~ ✅ 2026-04-13
2. ~~**H1** — Add a static `<ul>` of calculator links alongside the React island on `/calculators`~~ ✅ 2026-04-13
3. ~~**C3** — Create `/privacy` and `/terms` pages; link from footer~~ ✅ 2026-04-13
4. ~~**C2** — Add `image`/`logo` to `WebApplication` and `Organization` JSON-LD using OG image URLs~~ ✅ 2026-04-13
5. ~~**H2** — Create `/about` page with company/founder credibility signals~~ ✅ 2026-04-13
6. ~~**M2** — Expand footer: link to Privacy, Terms, About, and key calculators~~ ✅ 2026-04-13 — About link added; footer complete
7. ~~**M3** — Add `SearchAction` to `WebSite` schema~~ ✅ 2026-04-19 — `buildWebSiteJsonLd()` with `potentialAction`; `?q=` param wired into search island; `sameAs` added to `Organization`; `dateModified` added to `WebApplication`
8. ~~**M1** — Create category archive pages (`/calculators/[category]`)~~ ✅ 2026-04-19 — `/calculators/ai`, `/api`, `/data`, `/performance`, `/encoding`, `/general`; shared `CategoryPageLayout.astro`; homepage category chips linked
