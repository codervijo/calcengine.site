# PRD — calcengine.site

## Phase 1 — MVP Calculators (Live)
- [x] OpenAI Cost Calculator *(API / LLM)*
- [x] JSON Size Calculator *(Data)*
- [x] API Rate Limit Calculator *(Backend)*
- [x] Base64 Size Calculator *(Data)*

## Phase 2 — Calculator Expansion (50 tools)
- [x] JWT Size Calculator *(Security)* ✅ 2026-04-14
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
- [ ] Pagination Performance Calculator *(Database)*
- [ ] Index Size Calculator *(Database)*
- [ ] Thread Pool Size Calculator *(Backend)*
- [ ] Worker Queue Throughput Calculator *(Backend)*
- [ ] Retry Backoff Calculator *(Backend)*
- [ ] Timeout Calculator *(Backend)*
- [ ] API Response Time Estimator *(Performance)*
- [ ] Compression Ratio Calculator *(Data)*
- [ ] File Upload Time Calculator *(Network)*
- [ ] Download Speed Calculator *(Network)*
- [ ] TLS Handshake Time Estimator *(Network)*
- [ ] CDN Cost Calculator *(Cloud)*
- [ ] Lambda Cost Calculator *(Cloud)*
- [ ] Kubernetes Resource Calculator *(DevOps)*
- [ ] Pod Capacity Calculator *(DevOps)*
- [ ] CPU Usage Estimator *(Performance)*
- [ ] Memory Usage Calculator *(Performance)*
- [ ] Disk IOPS Calculator *(Storage)*
- [ ] RAID Capacity Calculator *(Storage)*
- [ ] Cache TTL Impact Calculator *(Performance)*
- [ ] Event Processing Rate Calculator *(Backend)*
- [ ] Message Queue Delay Calculator *(Backend)*
- [ ] Batch Processing Time Calculator *(Backend)*
- [ ] API Pagination Limit Calculator *(API)*
- [ ] Token Bucket Rate Limit Calculator *(Backend)*
- [ ] Leaky Bucket Rate Calculator *(Backend)*
- [ ] Hash Collision Probability Calculator *(Security)*
- [ ] Encryption Overhead Calculator *(Security)*
- [ ] Session Size Calculator *(Backend)*
- [ ] Log Storage Cost Calculator *(Cloud)*

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
| `Organization` | Homepage | ✓ Good | ~~**`logo`**~~ ✅ fixed · `sameAs` (pending) |
| `CollectionPage` | `/calculators` | ✓ Good | — |
| `WebSite` | Homepage | Basic | **`potentialAction` (SearchAction)** |

---

### Priority Fix Order

1. ~~**C1** — Expand homepage + `/calculators` meta descriptions to 150–160 chars~~ ✅ 2026-04-13
2. ~~**H1** — Add a static `<ul>` of calculator links alongside the React island on `/calculators`~~ ✅ 2026-04-13
3. ~~**C3** — Create `/privacy` and `/terms` pages; link from footer~~ ✅ 2026-04-13
4. ~~**C2** — Add `image`/`logo` to `WebApplication` and `Organization` JSON-LD using OG image URLs~~ ✅ 2026-04-13
5. ~~**H2** — Create `/about` page with company/founder credibility signals~~ ✅ 2026-04-13
6. ~~**M2** — Expand footer: link to Privacy, Terms, About, and key calculators~~ ✅ 2026-04-13 — About link added; footer complete
7. **M3** — Add `SearchAction` to `WebSite` schema
8. **M1** — Create category archive pages (`/calculators/[category]`) — largest effort
