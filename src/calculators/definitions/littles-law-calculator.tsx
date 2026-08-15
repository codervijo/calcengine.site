import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function ConcurrencyUI() {
  const [rps, setRps] = useState<string>('100');
  const [latencyMs, setLatencyMs] = useState<string>('200');
  const [safetyFactor, setSafetyFactor] = useState<string>('1.5');

  const r = parseFloat(rps) || 0;
  const l = parseFloat(latencyMs) || 0;
  const s = parseFloat(safetyFactor) || 1;

  const baseConcurrency = r * (l / 1000);
  const safeConcurrency = Math.ceil(baseConcurrency * s);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Required Concurrency</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Requests per Second (RPS)"
          type="number"
          value={rps}
          onChange={(e) => setRps(e.target.value)}
        />
        <TextField
          label="Average Response Time (ms)"
          type="number"
          value={latencyMs}
          onChange={(e) => setLatencyMs(e.target.value)}
        />
        <TextField
          label="Safety Factor"
          type="number"
          value={safetyFactor}
          onChange={(e) => setSafetyFactor(e.target.value)}
          slotProps={{ htmlInput: { step: '0.1', min: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Required Concurrent Connections</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{safeConcurrency}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          Base: {baseConcurrency.toFixed(1)} × {s}× safety factor = {safeConcurrency}
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'littles-law-calculator',
  // Title serves the SERP (the template appends " — CalcEngine"); h1 serves the reader.
  title: "Little's Law Calculator: L = λW Explained",
  h1: "Little's Law, and the one condition that makes it true",
  shortTitle: "Little's Law",
  description:
    "Little's Law is L = λW. What each term means, why it holds for any stable queue whatever the distributions, and the saturated case where it quietly lies.",
  // Intentionally empty: <meta name="keywords"> has had no ranking value for
  // well over a decade and reads as a low-quality signal. The template only
  // emits the tag when this array is non-empty.
  keywords: [],
  category: 'api',
  icon: 'AccountTree',
  layout: 'explanation-first',
  suppressBoilerplate: true,
  tagline:
    'L = λW relates how many things are inside a system to how fast they arrive and how long they stay. This page explains what that means, why it holds so widely, and where applying it gives a confident wrong answer.',
  lastUpdated: 'August 2026',

  directAnswer:
    "Little's Law states that L = λW: the average number of items in a system equals the average arrival rate multiplied by the average time each item spends there. For a service that means concurrency = arrival rate × latency — 200 requests per second that each take 150 ms means 30 requests are in flight at any moment. It holds for any system in a stable state, whatever the arrival pattern, the service time distribution, the number of servers, or the order work is taken in, which is why the same equation sizes connection pools, thread pools and job queues. The one thing it requires is stability: if work arrives faster than it leaves, W has no settled value and the equation is describing a backlog rather than a design.",

  explainer: [
    {
      heading: 'What L, λ and W actually refer to',
      body: `The law is three long-run averages and nothing else:

— <strong>L</strong> — the average number of items <em>in the system</em>. Not the queue length on its own: it counts everything inside the boundary you drew, both the items waiting and the items being worked on.

— <strong>λ</strong> (lambda) — the average <em>arrival</em> rate, in items per unit of time. In a stable system arrivals and departures balance, so this is also the throughput. That equivalence is exactly what breaks under overload, which is the trap covered further down.

— <strong>W</strong> — the average time an item spends in the system, measured from crossing the boundary inward to crossing it outward. It is residence time: waiting plus service, not service alone.

The word doing the most work in all three definitions is <strong>system</strong>, and it means whatever boundary you choose to draw. The law then holds separately for every boundary you could have drawn, which is the part worth internalising:

— Draw it around the whole service and you get <code>L = λW</code> — requests in flight.
— Draw it around the waiting line only and you get <code>Lq = λWq</code> — items queued, from average wait.
— Draw it around the servers only and you get <code>Ls = λS</code> — the average number of servers kept busy, from average service time.

All three are the same law. Choosing the boundary deliberately, rather than by accident, is most of the skill in applying it.

One mechanical warning before any of that: the units of λ and W must agree. Requests per <em>second</em> multiplied by a latency in <em>milliseconds</em> is the most common arithmetic error here, and because it overestimates by a factor of 1,000 it produces a pool that is merely wasteful rather than broken — so it tends to survive review.`,
    },
    {
      heading: 'Why it holds regardless of how requests arrive or how long they take',
      body: `Little's Law is usually introduced as a result from queueing theory, which leaves the impression that it comes with the assumptions queueing theory usually carries — Poisson arrivals, exponentially distributed service times, first-in-first-out order, a single server. It needs none of them. This generality is the whole reason the law is useful on real systems, and it is the part most explanations skip.

It does not depend on:

— the arrival process (bursty, periodic, adversarial, correlated — it does not matter)
— the service time distribution (or whether service times have a finite variance at all)
— the number of servers, or whether that number changes over time
— the queue discipline: FIFO, LIFO, priority, random, or preemption
— whether items are handled one at a time or in batches

The reason is that it is not really a probabilistic statement — it is an accounting identity about area. Picture the number of items in the system plotted against time: a staircase that steps up on every arrival and down on every departure. Over a long interval <code>T</code>, the area under that staircase has units of item-seconds, and it can be totalled two different ways. Sweep it vertically and you get the time-average count multiplied by <code>T</code>, which is <code>L × T</code>. Sweep it horizontally and you get the sum of how long each item was present, which is the number of arrivals multiplied by their average residence time, or <code>(λT) × W</code>. Both describe the same area, so <code>L × T = λT × W</code>, and dividing by <code>T</code> leaves <code>L = λW</code>.

Nothing in that argument mentions a distribution, because nothing in it needs one.

The practical consequence is that you never have to characterise your traffic before applying it. You do not need to know whether your arrivals are Poisson, and on a real production service you never will. You need three averages and a system that is keeping up. What you <em>do</em> need is for those averages to exist at all — which is the precondition below, and the only one there is.`,
    },
    {
      heading: 'The stability precondition, and what you get when you break it',
      body: `Formally, the law requires the long-run averages to converge. Operationally that means one thing: <strong>the system has to be able to keep up</strong>. Departures must match arrivals over the long run, and nothing inside the boundary may grow without bound.

There is a concrete version of that check. If work arrives at rate λ and takes S on average to serve, then <code>λS</code> is the offered load — the average number of servers it would keep busy. With <code>c</code> servers, stability requires:

<code>λ × S &lt; c</code>

At <code>λS = c</code> the system is exactly saturated. Utilisation is 1, and the queue grows without limit even though the arithmetic looks balanced. Real systems need meaningful headroom below that line, because variability alone produces queueing long before utilisation reaches 1 — with any variation in arrivals or service times, waiting time climbs steeply as utilisation approaches 100%, and the last few percent of capacity cost far more latency than the first.

What makes violating this dangerous is that <strong>the formula does not fail loudly</strong>. It returns a number, and the number looks like every other number it returns:

— <strong>W stops being a property of your service.</strong> Under sustained overload it becomes a function of how long the overload has been running. Measure it, wait an hour, measure again, and you get two different values — both correctly measured, neither a constant to design against.

— <strong>λ stops tracking demand.</strong> If you measure λ as completed throughput, it flattens at your capacity ceiling no matter how much load is offered. The measurement is now telling you what your system can do, not what is being asked of it, and those separated the moment you saturated.

— <strong>L is still true, and still useless.</strong> Computed from those two, it is a correct statement about the past: that many items really were inside the system. It is a description of your backlog. It is not a specification for anything.

So the sequence is: check <code>λS &lt; c</code> first, measure W at low to moderate load rather than during an incident, and use the offered arrival rate rather than the achieved throughput. Get those three right and the law is exact. Get them wrong and it is confidently, quietly incorrect — see the third worked example below.`,
    },
  ],

  calculatorHeading: 'Size a pool from arrival rate and residence time',
  calculatorIntro:
    'The most common application is the first boundary: given how fast requests arrive and how long each one takes, how many are in flight at once? Enter your rate and average latency — the safety factor adds headroom above the theoretical minimum, which you want for the utilisation reasons above.',

  intro: '',

  howItWorksTitle: "How to Calculate Little's Law",
  howItWorksImage: '/images/calculators/littles-law-calculator-how-it-works.svg',
  howItWorks:
    "1. Decide where the system boundary is. Whole service, waiting line only, or servers only — the law applies to each, but they give different answers to different questions.\n2. Measure λ, the arrival rate, at that boundary. Use offered load; achieved throughput only equals it while the system is keeping up.\n3. Measure W, the average time an item spends inside that boundary. Use a median or mean under representative load, not a tail percentile and not a number recorded during an incident.\n4. Put both into the same units. Seconds and per-second, or milliseconds and per-millisecond — never mixed.\n5. Multiply: L = λ × W. That is the average number of items inside the boundary.\n6. Check stability before trusting it: offered load λ × S must be comfortably below your server count c. If it is not, the inputs are describing a backlog and the output means nothing for sizing.",
  formula:
    "L = λ × W\n\nL — average number of items in the system\nλ — average arrival rate, items per unit time\nW — average time an item spends in the system (wait + service)\n\nSame law, different boundaries:\n\nLq = λ × Wq    items waiting, from average wait time\nLs = λ × S     servers kept busy, from average service time\n\nApplied to a service:\n\nConcurrency      = RPS × (Avg Latency ms ÷ 1000)\nSafe Concurrency = ⌈Concurrency × Safety Factor⌉\n\nStability precondition:\n\nλ × S < c      where c is the number of servers\n⌈ ⌉            ceiling — round up to the next integer",

  examplesTitle: "Worked Examples of Little's Law",
  example: '',
  examples: [
    {
      title: 'Example 1 — Sizing a connection pool from RPS and latency',
      body: `Boundary: the whole request path. λ = 200 requests/second, W = 150 ms.

Put the units right first:
  W = 150 ms = 0.15 s

  L = λW = 200 × 0.15 = 30 requests in flight

Thirty is the theoretical floor. A pool smaller than 30 is the
bottleneck by construction — requests will wait for a connection no
matter how fast the database is.

With a 1.5× safety factor:
  ⌈30 × 1.5⌉ = 45

Set the pool maximum to 45.`,
    },
    {
      title: 'Example 2 — Deriving queue depth from arrival rate and service time',
      body: `Boundary: a job queue with 60 workers. λ = 40 jobs/second,
average service time S = 1.2 s.

Servers kept busy (boundary drawn around the workers):
  Ls = λS = 40 × 1.2 = 48

So 48 of the 60 workers are occupied on average — 80% utilisation.

Stability check:
  λS < c  ->  48 < 60   stable, with headroom

Now the waiting line. If the measured average wait before a worker
picks a job up is Wq = 0.25 s:
  Lq = λWq = 40 × 0.25 = 10 jobs waiting on average

Three numbers, one law, three boundaries. Note that the queue depth
came from a measured wait — Little's Law converts between depth and
wait, it does not predict either one from service time alone.`,
    },
    {
      title: 'Example 3 — The failure case: a saturated service',
      body: `A service is overloaded. You measure it and get throughput
500 rps, average latency 2,000 ms.

  L = 500 × 2.0 = 1,000

The arithmetic is right. One thousand requests really are inside the
system. As a pool size it is wrong twice over:

  - 500 rps is not the arrival rate. It is the ceiling — all the
    service can complete. Demand is higher, and this measurement
    cannot tell you by how much.

  - 2,000 ms is not what the work costs. It is mostly time spent
    queueing behind the backlog. Unsaturated, the same request
    might take 80 ms.

Size the pool at 1,000 and the queue simply moves inside the pool.
Throughput does not improve; memory use does, and each request now
waits in a different place.

Re-measure once the overload clears:
  500 × 0.08 = 40

The real problem was capacity, not pool size. Nothing in the first
calculation looked wrong, which is exactly why this one is worth
recognising by shape.`,
    },
  ],

  tipsTitle: "Applying Little's Law Without Fooling Yourself",
  tips: [
    'Check units before anything else. Requests per second multiplied by a latency in milliseconds overestimates by 1,000×, and because the result is an oversized pool rather than a broken one, it fails quietly and can sit in a config file for years.',
    'Use a median or mean for W, never p99. W is defined as an average; feeding in a tail percentile sizes the system as though every request were the worst request, which is both incorrect and expensive.',
    'Say out loud where the boundary is before you compute. A request that hits your API, then your database, then returns can be three different systems, and they have three different correct answers.',
    'Verify λS < c before trusting any output. Close to saturation the averages stop converging, and every number you compute describes a passing moment rather than a design you can build on.',
    'Recompute after any latency change. Halving W halves the concurrency you need, but nothing forces a review, so pools sized against retired latency figures stay oversized indefinitely.',
    'Remember the law is descriptive, not causal. Raising L does not raise λ — throughput is set by demand and capacity, and adding concurrency beyond what the equation calls for moves waiting around rather than removing it.',
  ],

  faq: [
    {
      question: "Does Little's Law require Poisson arrivals or exponential service times?",
      answer:
        "No, and this is the most common misconception about it. It holds for any arrival pattern and any service time distribution, for any number of servers, and under any queue discipline. It is an accounting identity about time-averages rather than a probabilistic result. The only requirement is that the system is stable enough for those averages to converge.",
    },
    {
      question: 'Should I use average or p99 latency as W?',
      answer:
        "Average. W is defined as the mean residence time, so substituting p99 is not a conservative version of the calculation — it is a different calculation that answers no question. If you want headroom, compute L from the mean and apply an explicit safety factor, which keeps the arithmetic honest and the padding visible.",
    },
    {
      question: 'Why does increasing my pool size not increase throughput?',
      answer:
        "Because L = λW is descriptive, not causal. Throughput is set by demand and by capacity; concurrency is a consequence of both, not a lever on either. If the bottleneck is downstream, raising L just means more requests waiting in a bigger pool, and W rises to match. Check whether you are saturated before adding concurrency — see the <a href=\"/calculators/throughput-calculator\">throughput ceiling of your pipeline</a>.",
    },
    {
      question: "What is the difference between L = λW and Lq = λWq?",
      answer:
        "Only the boundary. L and W cover the whole system, so W includes both waiting and service. Lq and Wq cover the waiting line alone, so Wq excludes service time. The relationship is W = Wq + S, and consequently L = Lq + λS. Pick the boundary that matches the question you are asking, then stay inside it.",
    },
    {
      question: "How do I know whether my system is stable enough for Little's Law to apply?",
      answer:
        "Compare offered load to capacity: λ × S must be below your server count, with headroom. Practically, watch whether the queue depth returns to a baseline or trends upward over hours, and whether measured latency is stable across repeated samples. A latency figure that keeps climbing means you are measuring a backlog. Pair this with a <a href=\"/calculators/latency-budget-calculator\">latency budget for the whole call path</a>.",
    },
  ],

  relatedSlugs: [
    'qps-calculator',
    'throughput-calculator',
    'latency-budget-calculator',
    'thread-pool-size-calculator',
  ],
};

export const littlesLawCalculator: CalculatorDefinition = { meta, Component: ConcurrencyUI };
