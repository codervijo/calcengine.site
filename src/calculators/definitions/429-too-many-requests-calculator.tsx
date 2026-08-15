import { useState } from 'react';
import { TextField, Typography, Stack, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

type TimeUnit = 'seconds' | 'minutes' | 'hours';

function ApiRateLimitUI() {
  const [rps, setRps] = useState<string>('100');
  const [duration, setDuration] = useState<string>('60');
  const [unit, setUnit] = useState<TimeUnit>('seconds');

  const r = parseFloat(rps) || 0;
  const d = parseFloat(duration) || 0;

  const multiplier: Record<TimeUnit, number> = { seconds: 1, minutes: 60, hours: 3600 };
  const totalSeconds = d * multiplier[unit];
  const totalRequests = r * totalSeconds;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Total Requests</Typography>
      <TextField label="Requests per Second" type="number" value={rps} onChange={(e) => setRps(e.target.value)} />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <TextField label="Duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <ToggleButtonGroup value={unit} exclusive onChange={(_, v) => v && setUnit(v)} size="small">
          <ToggleButton value="seconds">Sec</ToggleButton>
          <ToggleButton value="minutes">Min</ToggleButton>
          <ToggleButton value="hours">Hr</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Allowed Requests</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{totalRequests.toLocaleString()}</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: '429-too-many-requests-calculator',
  // Title serves the SERP (the template appends " — CalcEngine"); h1 serves the reader.
  title: '429 Too Many Requests: Causes and Fixes',
  h1: "Why you're getting a 429 Too Many Requests error",
  shortTitle: '429 Too Many Requests',
  description:
    'What a 429 actually means, how to read Retry-After in both of its forms, and why a client can hit one while apparently still under the rate limit.',
  // Intentionally empty: <meta name="keywords"> has had no ranking value for
  // well over a decade and reads as a low-quality signal. The template only
  // emits the tag when this array is non-empty.
  keywords: [],
  category: 'api',
  icon: 'Speed',
  layout: 'explanation-first',
  suppressBoilerplate: true,
  tagline:
    'A 429 is the server telling you to slow down, not that your request was malformed. This page explains what it means, how to read the headers that come with it, and what to do next.',
  lastUpdated: 'August 2026',

  directAnswer:
    "A 429 means the server has decided you have sent too many requests in some window and is refusing this one. It is rate limiting, not a fault in the request itself — the same request will usually succeed once you wait. The response may carry a Retry-After header saying when to try again, given either as a number of seconds or as an absolute date. You can also get a 429 while apparently under the published limit, because the specification lets every server decide for itself what it counts and who it counts it against.",

  explainer: [
    {
      heading: 'What the server is actually counting',
      body: `A 429 is defined in <a href="https://www.rfc-editor.org/rfc/rfc6585.html#section-4" rel="noopener">RFC 6585 §4</a>, and the definition is deliberately thin: it says the status code "indicates that the user has sent too many requests in a given amount of time", and then explicitly declines to say more. In its own words, the specification "does not define how the origin server identifies the user, nor how it counts requests."

That single sentence is the reason 429s are confusing in practice. Every part of the accounting is left to the server:

— <strong>Who you are.</strong> The counter may be keyed on your API key, your account, your OAuth client, your session cookie, or just your source IP. Two of your services sharing one key share one budget. Two of your users behind one corporate NAT may share one budget too.

— <strong>What counts as a request.</strong> The limit may be applied per endpoint, across the whole API, or shared among several servers. A read and a write may cost different amounts against the same budget.

— <strong>What "a given amount of time" means.</strong> Fixed windows, sliding windows, and token buckets all produce different refusals from the same nominal "100 per minute", and the server does not have to tell you which it uses.

One thing the specification is firm about: responses with a 429 <strong>must not be stored by a cache</strong>. If you are seeing a 429 served repeatedly and instantly, with no variation, suspect an intermediary that is misbehaving rather than the origin.`,
    },
    {
      heading: 'Retry-After comes in two forms, and you must handle both',
      body: `Most client code that handles Retry-After handles half of it. The field is defined in <a href="https://www.rfc-editor.org/rfc/rfc9110.html#section-10.2.3" rel="noopener">RFC 9110 §10.2.3</a> with this grammar:

<code>Retry-After = delay-seconds / HTTP-date</code>

Both forms are legal and you will meet both in the wild.

<strong>Delay-seconds</strong> is a non-negative integer count of seconds to wait:

<code>Retry-After: 120</code>

<strong>HTTP-date</strong> is an absolute timestamp. The format required for generating it is IMF-fixdate (<a href="https://www.rfc-editor.org/rfc/rfc9110.html#section-5.6.7" rel="noopener">RFC 9110 §5.6.7</a>), which always ends in GMT:

<code>Retry-After: Sun, 06 Nov 1994 08:49:37 GMT</code>

Two things routinely go wrong here. The first is parsing: code that does <code>parseInt(retryAfter)</code> on a date string gets <code>NaN</code>, and code that treats <code>NaN</code> as zero retries immediately — which on most APIs extends the penalty rather than ending it. Branch on whether the value is all digits before deciding which parser to use.

The second is clock skew. An absolute date is only as good as your machine's clock, and a client running a few minutes fast will retry early every time. The 429 response also carries a <code>Date</code> header holding the server's own view of now; compute the wait as the difference between the Retry-After date and that Date header, not against your local clock. Note also that recipients are expected to accept two obsolete date formats (rfc850-date and asctime-date) even though senders should no longer produce them, so a strict parser can still fail on a compliant-enough server.`,
    },
    {
      heading: 'X-RateLimit-Reset and the headers that are not standard',
      body: `Alongside Retry-After you will often see a family of headers describing the budget itself — typically <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, and <code>X-RateLimit-Reset</code>. These are conventions, not a standard. Nothing defines their units, so they differ between providers, and this is where integrations quietly break.

<code>X-RateLimit-Reset</code> is the worst offender because it has at least three readings in common use:

— a Unix timestamp in seconds, meaning "the window resets at this absolute moment"
— a number of seconds remaining until the window resets
— a Unix timestamp in milliseconds

The values look similar enough that the wrong reading survives testing. A ten-digit number is almost certainly a Unix timestamp in seconds; a small number like <code>59</code> is almost certainly a duration. Rather than infer, check the provider's documentation once and pin the interpretation in your client — and prefer Retry-After when the response gives you both, since its units are actually specified.

There is an IETF effort to standardise this area, <a href="https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/" rel="noopener">draft-ietf-httpapi-ratelimit-headers</a>, which defines <code>RateLimit</code> and <code>RateLimit-Policy</code> fields to replace the ad-hoc <code>X-RateLimit-*</code> set. It is an active Internet-Draft and has not been published as an RFC, so treat any <code>RateLimit-*</code> headers you receive today as provider-specific until that changes.`,
    },
    {
      heading: 'Why you can get a 429 while apparently under the limit',
      body: `This is the case that sends people to search engines, and it is almost never a bug in the server. Common causes, roughly in order of how often they turn out to be the answer:

— <strong>The counter is not yours alone.</strong> If the limit is keyed on IP, everything sharing your egress address shares your budget: other pods on the node, a NAT gateway, a CI runner pool, colleagues in the same office. Your service's own request rate can be well under the limit while the address's rate is not.

— <strong>Burst versus sustained.</strong> A token bucket that permits 100 requests per second will still refuse 100 requests fired in the same 10 milliseconds if its burst capacity is smaller. Your average is fine; your instantaneous rate is not.

— <strong>Fixed-window edges.</strong> With a fixed window, a burst at the end of one window and another at the start of the next are both legal individually, but they land within a few seconds of each other. Any sliding-window or per-second limit layered on top will reject the second burst.

— <strong>More than one limit applies.</strong> Providers commonly enforce several simultaneously — per second, per minute, per day, plus a concurrency cap on in-flight requests. Staying under the per-second rate says nothing about the daily quota, and a concurrency cap can refuse you at a very low request rate if your requests are slow and overlapping.

— <strong>Your retries are counted too.</strong> Requests that fail and are retried usually count against the budget. A retry storm after a blip can exhaust a limit that your steady-state traffic never approaches — which is why retries need backoff and jitter rather than a fixed delay.

— <strong>The refusal came from somewhere else.</strong> A CDN, WAF, API gateway, or load balancer in front of the origin can issue its own 429 under its own policy, and its limits are usually neither documented alongside the API's nor reported in the API's own headers.

— <strong>Distributed counters settle late.</strong> When a limit is enforced across several nodes sharing state, the count each node sees can briefly lag reality, so the effective limit near a boundary is fuzzier than the published number.

The practical diagnostic: log the full response headers of the 429 itself, not just the status. The combination of which rate-limit headers are present, what <code>Retry-After</code> says, and whether a <code>Via</code>, <code>Server</code>, or CDN header names an intermediary will usually identify which of the above you are looking at within one incident.`,
    },
  ],

  calculatorHeading: 'Work out the request budget for a window',
  calculatorIntro:
    'Once you know which limit applies to you, the next question is usually arithmetic: how many requests does a published rate actually buy over a given stretch of time? Enter the rate and the window to size a batch job, a sync, or a polling interval against it.',

  intro: '',

  howItWorksTitle: 'How to Calculate a Request Budget from a Rate Limit',
  howItWorksImage: '/images/calculators/429-too-many-requests-calculator-how-it-works.svg',
  howItWorks:
    '1. Enter your rate limit in requests per second (RPS). If your API publishes a per-minute or per-hour limit, divide by 60 or 3,600 to convert.\n2. Enter the length of the window you care about.\n3. Select the unit: seconds, minutes, or hours.\n4. The calculator converts the window to seconds and multiplies by your RPS to give the total requests the limit allows across it.\n5. Treat the result as a ceiling, not a target — it assumes one limit, evenly paced requests, and no retries.',

  formula:
    'Total Requests = Requests per Second (RPS) × Duration in Seconds\n\nDuration conversions:\n- Minutes → multiply by 60\n- Hours   → multiply by 3,600\n\nUseful conversions:\n- 100 req/min = 100 ÷ 60 ≈ 1.67 RPS\n- 1,000 req/hr = 1,000 ÷ 3,600 ≈ 0.28 RPS\n\nThis is the sustained-rate ceiling only. It does not model burst capacity,\nconcurrency caps, or a second limit applied over a longer period.',

  examplesTitle: 'Worked Examples',
  example: '',
  examples: [
    {
      title: 'Example 1 — Sizing an hourly sync against a 50 RPS limit',
      body: 'RPS: 50   Window: 1 hour = 3,600 seconds\nBudget = 50 × 3,600 = 180,000 requests\n\nThe job needs 200,000 records at one request each:\n200,000 ÷ 180,000 = 1.11 hours — it does not fit in the window.\nOptions: spread it over two hours, batch several records per request,\nor move to a tier with a higher limit.',
    },
    {
      title: 'Example 2 — Reading a Retry-After you were given',
      body: 'Response:\n  HTTP/1.1 429 Too Many Requests\n  Date: Sun, 06 Nov 1994 08:49:07 GMT\n  Retry-After: Sun, 06 Nov 1994 08:49:37 GMT\n\nWait = Retry-After − Date = 30 seconds.\n\nComputed against the server Date header, the answer is 30 seconds on any\nmachine. Computed against a local clock running 5 minutes fast, the same\nresponse yields a negative wait and the client retries instantly.',
    },
    {
      title: 'Example 3 — The failure case: under budget, still refused',
      body: 'Limit: 100 RPS   Window: 60 s   Budget = 100 × 60 = 6,000 requests\nSent: 4,000 requests in the minute — comfortably under budget.\nResult: several hundred 429s.\n\nThe 4,000 were sent as four bursts of 1,000 in under a second each. The\nsustained rate was 67 RPS; the instantaneous rate was ~1,000 RPS against a\nbucket whose burst capacity was 200. The arithmetic above was never wrong —\nit answers a different question than the one the server was asking.',
    },
  ],

  tipsTitle: 'Handling 429s in Client Code',
  tips: [
    'Branch on the format of Retry-After before parsing it. If the value is all digits it is a count of seconds; otherwise it is an HTTP date. Treating a date as an integer yields NaN, and a NaN wait usually becomes an immediate retry.',
    'Compute absolute waits against the response Date header rather than the local clock, so a skewed client does not retry early on every 429.',
    'Add jitter to backoff delays. Without it, every client throttled by the same incident retries at the same instant and reproduces the burst that caused it.',
    'Cap the number of retries and surface the failure. Retrying a 429 indefinitely converts a rate-limit problem into an outage that is harder to diagnose.',
    'Log the full headers of the 429 response, including Via and Server. Whether the refusal came from the origin or an intermediary changes which limit you need to fix.',
    'Throttle on the way out rather than reacting on the way back. A token bucket in your client keeps you under the limit without needing the server to refuse you first.',
  ],

  faq: [
    {
      question: 'Does a 429 mean I have been banned?',
      answer:
        'Usually not. A 429 is a temporary refusal and the same request typically succeeds after the wait. A ban is more often a 403. That said, some APIs lengthen the penalty when clients retry before the Retry-After deadline, so an ignored 429 can turn into a longer lockout.',
    },
    {
      question: 'What should I do if there is no Retry-After header?',
      answer:
        'The header is optional — RFC 6585 says a 429 <em>may</em> include it. With no Retry-After and no rate-limit headers, fall back to exponential backoff with jitter: wait a second, then two, then four, up to a sensible cap, and stop after a fixed number of attempts rather than retrying forever.',
    },
    {
      question: 'Is X-RateLimit-Reset a timestamp or a countdown?',
      answer:
        'It depends on the provider — the header is not standardised and both readings are in common use, along with milliseconds. A ten-digit value is almost certainly a Unix timestamp in seconds; a small value is almost certainly seconds remaining. Check the documentation once, and prefer Retry-After when both are present.',
    },
    {
      question: 'Why do I get 429s in my browser rather than from an API?',
      answer:
        'The same mechanism applies to ordinary web traffic. A site, its CDN, or its WAF can rate-limit by IP, so repeated reloads, a shared office or VPN address, or an extension polling in the background can trip it. Waiting is the fix; the site owner controls the threshold.',
    },
    {
      question: 'Can I avoid 429s by spreading requests across several API keys?',
      answer:
        'Sometimes, but check the terms first — many providers treat it as circumvention and key on the account rather than the key, so the limit does not actually change. Where a provider does allow it, the caveat is that limits keyed on IP are unaffected by adding keys.',
    },
  ],

  relatedSlugs: [
    'retry-backoff-calculator',
    'token-bucket-rate-limit-calculator',
    'timeout-calculator',
    'qps-calculator',
  ],
};

export const tooManyRequestsCalculator: CalculatorDefinition = { meta, Component: ApiRateLimitUI };
