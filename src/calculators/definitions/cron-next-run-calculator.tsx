import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function parseCronField(field: string, min: number, max: number): number[] {
  const values = new Set<number>();
  for (const part of field.split(',')) {
    if (part === '*') {
      for (let i = min; i <= max; i++) values.add(i);
    } else if (part.includes('/')) {
      const slash = part.indexOf('/');
      const range = part.slice(0, slash);
      const step = parseInt(part.slice(slash + 1), 10);
      if (isNaN(step) || step <= 0) continue;
      let start = min;
      let end = max;
      if (range !== '*') {
        if (range.includes('-')) {
          const dash = range.indexOf('-');
          start = parseInt(range.slice(0, dash), 10);
          end = parseInt(range.slice(dash + 1), 10);
        } else {
          start = parseInt(range, 10);
        }
      }
      for (let i = start; i <= end && i <= max; i += step) values.add(i);
    } else if (part.includes('-')) {
      const dash = part.indexOf('-');
      const a = parseInt(part.slice(0, dash), 10);
      const b = parseInt(part.slice(dash + 1), 10);
      for (let i = a; i <= b; i++) values.add(i);
    } else {
      const v = parseInt(part, 10);
      if (!isNaN(v)) values.add(v);
    }
  }
  return [...values].filter((v) => v >= min && v <= max).sort((a, b) => a - b);
}

function getNextRuns(expr: string, from: Date, count: number): Date[] | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  const [minF, hrF, domF, monF, dowF] = parts;
  const minuteSet = new Set(parseCronField(minF, 0, 59));
  const hourSet = new Set(parseCronField(hrF, 0, 23));
  const domSet = new Set(parseCronField(domF, 1, 31));
  const monthSet = new Set(parseCronField(monF, 1, 12));
  const rawDow = parseCronField(dowF, 0, 7);
  const dowSet = new Set(rawDow.map((d) => (d === 7 ? 0 : d)));
  if (!minuteSet.size || !hourSet.size || !domSet.size || !monthSet.size || !dowSet.size) return null;
  const results: Date[] = [];
  const cur = new Date(from);
  cur.setSeconds(0, 0);
  cur.setMinutes(cur.getMinutes() + 1);
  for (let i = 0; i < 527040 && results.length < count; i++) {
    if (
      monthSet.has(cur.getMonth() + 1) &&
      domSet.has(cur.getDate()) &&
      dowSet.has(cur.getDay()) &&
      hourSet.has(cur.getHours()) &&
      minuteSet.has(cur.getMinutes())
    )
      results.push(new Date(cur));
    cur.setMinutes(cur.getMinutes() + 1);
  }
  return results;
}

function fmtDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${days[d.getDay()]} ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function CronNextRunUI() {
  const [cronExpr, setCronExpr] = useState<string>('*/5 * * * *');
  const [startTime, setStartTime] = useState<string>(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });
  const [count, setCount] = useState<string>('5');

  const from = startTime ? new Date(startTime) : new Date();
  const n = Math.min(Math.max(parseInt(count) || 5, 1), 10);
  const runs = cronExpr.trim() ? getNextRuns(cronExpr, from, n) : null;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">
        Calculate Next Cron Run
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Cron Expression"
          value={cronExpr}
          onChange={(e) => setCronExpr(e.target.value)}
          placeholder="*/5 * * * *"
          sx={{ flex: 2 }}
        />
        <TextField
          label="Next Runs to Show"
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          slotProps={{ htmlInput: { min: 1, max: 10 } }}
          sx={{ flex: 1 }}
        />
      </Stack>
      <TextField
        label="Start From"
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        fullWidth
      />
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2 }}>
        <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
          Next Scheduled Run Times
        </Typography>
        {!runs ? (
          <Typography sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
            Invalid expression — format: min hr dom mon dow (e.g. */5 * * * *)
          </Typography>
        ) : runs.length === 0 ? (
          <Typography sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
            No matching runs found in the next year
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {runs.map((d, i) => (
              <Typography
                key={i}
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: i === 0 ? 700 : 400,
                  fontSize: i === 0 ? '1.15rem' : '0.95rem',
                  opacity: i === 0 ? 1 : 0.85,
                }}
              >
                {i === 0 ? '▶ ' : `${i + 1}. `}
                {fmtDate(d)}
              </Typography>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'cron-next-run-calculator',
  title: 'Cron Next Run Calculator',
  shortTitle: 'Cron Next Run',
  description: 'Calculate the next run times for any cron expression instantly. Enter your cron schedule and start time to see exactly when your job will execute next',
  keywords: [
    'cron next run calculator',
    'cron expression calculator',
    'cron job next run time',
    'cron schedule calculator',
    'next cron execution time',
    'crontab calculator',
    'cron expression tester',
    'kubernetes cronjob schedule calculator',
  ],
  category: 'api',
  icon: 'Schedule',
  tagline:
    'Instantly calculate the next run times for any cron expression. Paste your schedule, set a start time, and see exactly when your cron job will fire.',
  lastUpdated: 'April 2026',
  intro:
    'A cron next run calculator helps developers and DevOps engineers predict when scheduled jobs will execute without deploying code or waiting for the event to fire. Cron expressions follow a five-field syntax covering minute, hour, day-of-month, month, and day-of-week — and small mistakes can shift execution by hours, days, or weeks.\n\nEngineers typically reach for a cron next run tool when debugging a silent job failure (the schedule is technically valid but fires at an unexpected time), planning maintenance windows (verifying that batch jobs won\'t overlap), or writing infrastructure-as-code (confirming a Kubernetes CronJob or AWS EventBridge schedule runs at the right frequency before deploying).\n\nThis calculator supports the standard five-field POSIX cron syntax used by Linux crontab, GitHub Actions scheduled workflows, Kubernetes CronJobs, AWS EventBridge Scheduler, and GCP Cloud Scheduler. Step values (*/5), ranges (1-5), lists (1,3,5), and wildcards (*) are all supported. Results are shown in your browser\'s local timezone using your device clock.',
  howItWorksTitle: 'How to Calculate the Next Cron Job Run Time',
  howItWorksImage: '/images/calculators/cron-next-run-calculator-how-it-works.svg',
  howItWorks:
    '1. Enter your five-field cron expression in the format: minute hour day-of-month month day-of-week.\n2. Set the start time — defaults to now, but shift it forward to inspect future scheduling windows.\n3. Set how many next runs you want to see (1–10).\n4. The calculator steps forward minute by minute from your start time, checking whether each timestamp matches all five fields.\n5. The first N matching timestamps are displayed in chronological order, with the nearest run highlighted.',
  formula:
    'Next Run = first datetime ≥ Start + 1 min where all 5 fields match\n\nField 1 — Minute    (0–59):  when in the hour to fire\nField 2 — Hour      (0–23):  which hour(s) of the day\nField 3 — Day-Month (1–31):  which day(s) of the month\nField 4 — Month     (1–12):  which month(s) of the year\nField 5 — Day-Week  (0–6):   day of the week (0 = Sunday)\n\nSpecial syntax:\n  *      every value in the field\'s range\n  */n    every n-th value (step)\n  a-b    inclusive range\n  a,b,c  explicit comma-separated list',
  examplesTitle: 'Example Cron Next Run Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Every 5 minutes (*/5 * * * *)',
      body: 'Expression:  */5 * * * *\nStart time:  2026-04-14 14:00\n\nNext runs:\n  ▶  Tue 2026-04-14 14:05\n     Tue 2026-04-14 14:10\n     Tue 2026-04-14 14:15\n     Tue 2026-04-14 14:20\n     Tue 2026-04-14 14:25\n\nThe minute field */5 expands to 0,5,10,15,20,25,30,35,40,45,50,55.',
    },
    {
      title: 'Example 2 — Weekdays at 9:00 AM (0 9 * * 1-5)',
      body: 'Expression:  0 9 * * 1-5\nStart time:  2026-04-14 08:50 (Tuesday)\n\nNext runs:\n  ▶  Tue 2026-04-14 09:00\n     Wed 2026-04-15 09:00\n     Thu 2026-04-16 09:00\n     Fri 2026-04-17 09:00\n     Mon 2026-04-20 09:00\n\nDay-of-week 1-5 expands to Monday through Friday, skipping Saturday (6) and Sunday (0).',
    },
    {
      title: 'Example 3 — Monthly job on the 1st at 2:30 AM (30 2 1 * *)',
      body: 'Expression:  30 2 1 * *\nStart time:  2026-04-02 00:00\n\nNext runs:\n  ▶  Fri 2026-05-01 02:30\n     Mon 2026-06-01 02:30\n     Wed 2026-07-01 02:30\n\nThe dom field "1" fires only on the 1st of each month. The calculator jumps ~30 days between matches, confirming the schedule is truly monthly.',
    },
  ],
  tipsTitle: 'Tips for Writing Better Cron Expressions',
  tips: [
    'Always verify a new expression in this calculator before deploying. `0 8 * * 1-5` (weekdays at 8am) vs `0 8 1-5 * *` (first 5 days of month at 8am) are easy to confuse.',
    'Stagger workers with offsets to spread load: use `1-59/5`, `2-59/5`, `3-59/5`, etc. instead of `*/5` when running multiple concurrent cron workers.',
    'Kubernetes CronJobs, GitHub Actions, and AWS EventBridge all run in UTC. Set this calculator\'s start time to your UTC equivalent to verify behavior from the server\'s perspective.',
    'Avoid `* * * * *` (every minute) for jobs that can exceed 60 seconds. Concurrent instances pile up silently. Use a queue with a single consumer instead.',
    'For quarterly jobs, use a list in the month field: `0 4 1 1,4,7,10 *` fires at 4am on the 1st of January, April, July, and October. Enter it above to see all four dates at once.',
    'Use named weekday ranges (`1-5` for Mon–Fri) instead of day-of-month values for business-day schedules — it handles month-boundary edge cases automatically.',
  ],
  faq: [
    {
      question: 'What is a cron expression?',
      answer:
        'A cron expression is a five-field string that specifies when a scheduled job should run. Each field controls a unit of time: minute (0–59), hour (0–23), day of month (1–31), month (1–12), and day of week (0–6, where 0 is Sunday). Fields support wildcards (<code>*</code>), step values (<code>*/5</code>), ranges (<code>1-5</code>), and lists (<code>1,3,5</code>) to express complex recurring schedules in a compact format.',
    },
    {
      question: 'How do I run a cron job every 5 minutes?',
      answer:
        'Use <code>*/5 * * * *</code>. The <code>*/5</code> in the minute field means "every 5th minute starting from 0": 0, 5, 10, 15 … 55. For every 10 minutes use <code>*/10 * * * *</code>, for every 15 minutes use <code>*/15 * * * *</code>, and for every 30 minutes use <code>*/30 * * * *</code>. Enter any of these in the calculator above to confirm the exact next fire times.',
    },
    {
      question: 'What does */ mean in a cron expression?',
      answer:
        'The <code>*/n</code> syntax means "every n-th value" across the field\'s full range. In the minute field (0–59), <code>*/5</code> expands to 0, 5, 10 … 55. In the hour field (0–23), <code>*/6</code> means midnight, 6am, noon, and 6pm. You can also scope it: <code>10-50/10</code> steps from 10 to 50 in increments of 10, yielding 10, 20, 30, 40, 50.',
    },
    {
      question: 'Why is my cron job not running when I expect?',
      answer:
        'The most common cause is a day-of-month / day-of-week conflict. Most cron implementations (Linux crontab, Kubernetes) apply OR logic: the job fires if <em>either</em> the day-of-month <em>or</em> day-of-week matches. Another frequent issue is timezone: cron runs in the server\'s local timezone, which may differ from UTC. Use this calculator with the server\'s local time as the start to debug unexpected firing patterns.',
    },
    {
      question: 'What is the minimum cron interval?',
      answer:
        'One minute — standard cron has minute-level granularity and cannot schedule jobs more often than once per minute. For sub-minute scheduling, use an event loop, a message queue consumer, or a platform-specific mechanism (e.g., a tight loop inside a Kubernetes Job container). Use <code>* * * * *</code> if you need to run every single minute. For rate-limit and throughput planning alongside your schedule, see the <a href="/calculators/api-rate-limit-calculator">API Rate Limit Calculator</a>.',
    },
  ],
  relatedSlugs: ['api-rate-limit-calculator', 'json-size-calculator', 'openai-cost-calculator'],
};

export const cronNextRunCalculator: CalculatorDefinition = { meta, Component: CronNextRunUI };
