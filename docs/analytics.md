# Google Analytics Setup — CalcEngine

## Where the code lives

| File | What it does |
|---|---|
| `src/layouts/BaseLayout.astro` | Loads the GA4 script on every page |
| `src/analytics/ga.ts` | Thin event-tracking helpers (`trackCalculatorViewed`, `trackCalculatorUsed`) |
| `src/components/CalculatorWidget.tsx` | Fires the two events per calculator |

Every public page uses `BaseLayout`, so GA loads site-wide from one place.

---

## Config you must set

Copy `.env.example` to `.env` and fill in your Measurement ID:

```
PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Where to find it:**
GA4 → Admin → Data Streams → your web stream → Measurement ID (starts with `G-`).

> Do NOT use the numeric Stream ID. It must start with `G-`.

For production on Netlify: set `PUBLIC_GA_ID` as an environment variable in the Netlify dashboard (Site settings → Environment variables). The `.env` file is gitignored and not used in CI.

---

## Events tracked

| Event | When it fires | Key parameters |
|---|---|---|
| `calculator_viewed` | Calculator widget mounts (page load) | `calculator_slug`, `calculator_name`, `page_path` |
| `calculator_used` | User first changes any input | `calculator_slug`, `calculator_name`, `page_path` |

Both events fail silently if GA hasn't loaded (e.g. ad blocker).

---

## How to verify in browser devtools

### 1. Check GA loaded

Open DevTools → Console. On `localhost` you should see:

```
[GA] Debug mode on. Run gaDebug() to inspect dataLayer.
```

### 2. Inspect the dataLayer

```js
gaDebug()       // prints last 20 dataLayer entries as a table
window.dataLayer  // full array
```

After loading a calculator page you should see entries for:
- `gtag('js', ...)` — initialization
- `gtag('config', 'G-...')` — pageview
- `calculator_viewed` event

After changing an input:
- `calculator_used` event

### 3. Check the network tab

Filter requests by `google-analytics` or `gtag`. You should see hits to:
```
https://www.google-analytics.com/g/collect?...
```

---

## How to verify in GA Realtime

1. Open GA4 → Reports → Realtime
2. Load any calculator page on the live site
3. You should see an active user appear within ~30 seconds
4. Under "Event count by event name" look for `calculator_viewed`
5. Interact with a calculator input → `calculator_used` should appear

---

## How to verify custom events

GA4 → Reports → Realtime → scroll to "Event count by event name".

To see parameters:
GA4 → Configure → Events → click `calculator_viewed` → view event parameters.

Note: custom event parameters only appear in GA reports after you register them as custom dimensions:
GA4 → Admin → Custom definitions → Custom dimensions → Add `calculator_slug`, `calculator_name`.

---

## Common mistakes

**Using the stream ID instead of the Measurement ID**
The numeric stream ID (e.g. `1234567890`) is NOT the Measurement ID.
Use the `G-XXXXXXXXXX` format from the Data Stream details page.

**Script not in shared layout**
All pages use `BaseLayout.astro` — the script is there once. Don't add it to individual pages.

**Events firing before GA loads**
`ga.ts` checks `typeof window.gtag === 'function'` before calling it. If GA hasn't loaded yet (slow network, ad blocker), the event is silently dropped. This is intentional — no queuing, no retries.

**`PUBLIC_GA_ID` not set at build time**
Astro bakes env vars into the static build. If the var is missing at `pnpm build` time, no GA script is emitted. Set the var before building, not just at runtime.
