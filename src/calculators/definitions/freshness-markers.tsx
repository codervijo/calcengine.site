import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function FreshnessMarkersUI() {
  const [daysSinceUpdate, setDaysSinceUpdate] = useState<string>('30');
  const [halfLife, setHalfLife] = useState<string>('180');
  const [daysSincePublication, setDaysSincePublication] = useState<string>('365');
  const [updates, setUpdates] = useState<string>('5');

  const d = parseFloat(daysSinceUpdate) || 0;
  const h = parseFloat(halfLife) || 1;
  const age = parseFloat(daysSincePublication) || 0;
  const n = Math.max(1, parseFloat(updates) || 1);

  const score = Math.max(0, Math.min(100, 100 * Math.pow(2, -d / h)));
  const updateFrequencyDays = age / n;

  const label =
    score >= 80 ? 'Very Fresh' :
    score >= 60 ? 'Fresh' :
    score >= 40 ? 'Aging' :
    score >= 20 ? 'Stale' :
    'Outdated';

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Freshness Score</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Days Since Last Update"
          type="number"
          value={daysSinceUpdate}
          onChange={(e) => setDaysSinceUpdate(e.target.value)}
          slotProps={{ htmlInput: { min: 0 } }}
          fullWidth
        />
        <TextField
          label="Content Half-Life (days)"
          type="number"
          value={halfLife}
          onChange={(e) => setHalfLife(e.target.value)}
          helperText="News≈1 · Blog≈30 · Docs≈180 · Evergreen≈365"
          slotProps={{ htmlInput: { min: 1 } }}
          fullWidth
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Days Since Publication"
          type="number"
          value={daysSincePublication}
          onChange={(e) => setDaysSincePublication(e.target.value)}
          slotProps={{ htmlInput: { min: 0 } }}
          fullWidth
        />
        <TextField
          label="Number of Updates"
          type="number"
          value={updates}
          onChange={(e) => setUpdates(e.target.value)}
          slotProps={{ htmlInput: { min: 1 } }}
          fullWidth
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Freshness Score — {label}</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{score.toFixed(1)} / 100</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
          Avg update every {updateFrequencyDays.toFixed(0)} days
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'freshness-markers',
  title: 'Freshness Markers Calculator',
  shortTitle: 'Freshness Score',
  description: 'Calculate freshness markers for any content type. Enter days since update and half-life to get a 0–100 freshness score and update frequency signal',
  keywords: [
    'freshness markers',
    'content freshness score',
    'freshness score calculator',
    'content freshness calculator',
    'seo freshness signal',
    'content decay rate',
    'freshness half-life',
    'update frequency calculator',
  ],
  category: 'general',
  icon: 'Update',
  tagline: 'Enter how long ago your content was updated and its half-life to get an instant freshness score. Use the result to prioritise which pages need a refresh.',
  lastUpdated: 'April 2026',
  intro: 'Freshness markers are signals that tell search engines and readers how current a piece of content is. Every page decays at a different rate — a news article is stale within hours while an evergreen tutorial stays relevant for years. This freshness markers calculator quantifies that decay so you can act on it.\n\nThe score runs from 0 to 100 using exponential decay: a page updated today scores 100, and by the time one full half-life has passed the score drops to 50. The half-life is configurable — set it to 30 days for a typical blog post, 180 days for documentation, or 1 day for news content. The calculator also shows your average update frequency, which is a key editorial health metric.\n\nContent teams, SEO analysts, and developers maintaining documentation sites use freshness scoring to build automated audit pipelines. Instead of reviewing every page manually, you can rank pages by score and focus effort on the most decayed content first.',
  howItWorksTitle: 'How to Calculate Freshness Markers',
  howItWorksImage: '/images/calculators/freshness-markers-how-it-works.svg',
  howItWorks: '1. Enter the number of days since the page was last meaningfully updated.\n2. Set the half-life for your content type — the number of days after which freshness drops to 50.\n3. Enter total content age (days since first publication) and how many updates have been made.\n4. The calculator applies exponential decay: Score = 100 × 2^(−daysSinceUpdate ÷ halfLife).\n5. Read the score label (Very Fresh → Outdated) and the average update frequency to plan your next refresh.',
  formula: 'Freshness Score = 100 × 2^(−d ÷ h)   [0–100]\n\nd  — days since last meaningful update\nh  — content half-life in days\n       News ≈ 1 · Blog ≈ 30 · Docs ≈ 180 · Evergreen ≈ 365\n\nUpdate Frequency = days since publication ÷ number of updates\n\nScore labels: ≥80 Very Fresh · ≥60 Fresh · ≥40 Aging · ≥20 Stale · <20 Outdated',
  examplesTitle: 'Example Freshness Marker Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Blog post updated last month',
      body: 'Days since update: 30  ·  Half-life: 30 days (blog)\nScore = 100 × 2^(−30 ÷ 30) = 100 × 2^(−1) = 50.0\n────────────────────────────────────────────────\nResult: 50.0 / 100 — Aging\nRecommendation: refresh within the next 2 weeks to recover to Fresh territory',
    },
    {
      title: 'Example 2 — Documentation page, 90 days since update',
      body: 'Days since update: 90  ·  Half-life: 180 days (docs)\nScore = 100 × 2^(−90 ÷ 180) = 100 × 2^(−0.5) ≈ 70.7\nDays since publication: 540  ·  Updates: 6\nUpdate frequency = 540 ÷ 6 = 90 days\n────────────────────────────────────────────────\nResult: 70.7 / 100 — Fresh  ·  Avg update every 90 days\nRecommendation: on track; schedule next review in ~90 days',
    },
    {
      title: 'Example 3 — News article, 3 days old',
      body: 'Days since update: 3  ·  Half-life: 1 day (news)\nScore = 100 × 2^(−3 ÷ 1) = 100 × 0.125 = 12.5\n────────────────────────────────────────────────\nResult: 12.5 / 100 — Outdated\nRecommendation: archive or add a "this article is from X date" notice',
    },
  ],
  tipsTitle: 'Tips for Managing Content Freshness',
  tips: [
    'Set half-life per content type, not per site. A pricing page decays faster than a conceptual overview — treat them differently in your audit pipeline.',
    'Schedule refreshes before scores drop below 40. Recrawl rates and user trust both fall sharply once content is perceived as stale.',
    'A "last reviewed" date signal (even with no edits) resets the clock for readers, but does not fool search engines — make at least one substantive change per refresh.',
    'Automate scoring. Export your sitemap, calculate freshness scores in a spreadsheet or script, and sort ascending to build a ready-made refresh backlog.',
    'Use update frequency alongside score. A high-frequency page that hasn\'t been updated lately is a stronger anomaly than a page that rarely gets touched.',
    'For documentation, pair freshness tracking with version pinning — mark pages as valid for a specific product version so decay signals stay meaningful as the product evolves.',
  ],
  faq: [
    {
      question: 'What are freshness markers in SEO?',
      answer: 'Freshness markers are signals that search engines use to determine how current a page is. They include the last-modified HTTP header, structured data dateModified fields, in-page date stamps, and the recency of inbound links. Google\'s QDF (Query Deserves Freshness) algorithm boosts recently updated pages for time-sensitive queries. This calculator quantifies freshness as a 0–100 score using exponential decay, giving you an actionable number rather than a vague label.',
    },
    {
      question: 'What half-life should I use for my content type?',
      answer: 'News and trending articles decay in 1–3 days. Blog posts and marketing pages typically use a 30–60 day half-life. Technical documentation suits 90–180 days. Evergreen reference content (glossaries, tutorials) can use 365 days or more. When in doubt, set the half-life to how often you\'d ideally review that content — if you aim to refresh a page quarterly, set it to 90 days.',
    },
    {
      question: 'How does the exponential decay formula work?',
      answer: 'The formula Score = 100 × 2^(−d ÷ h) means the score halves every h days. After one half-life the score is 50, after two it is 25, after three it is 12.5. This mirrors how relevance actually decays — fast at first, then slower. Unlike a linear model, exponential decay avoids the cliff where a page goes from 1 to 0 overnight, making scores more meaningful for scheduling.',
    },
    {
      question: 'Does updating a page always reset the freshness score to 100?',
      answer: 'In this calculator, yes — days since update resets to 0 on a meaningful edit, sending the score back to 100. In practice, search engines also weigh the significance of the change. Adding a paragraph and updating a date carries more weight than changing a comma. For your internal scoring pipeline, define a minimum edit threshold (e.g. >50 words changed) before resetting the clock.',
    },
    {
      question: 'How do I use freshness scores in an automated content audit?',
      answer: 'Export your sitemap URLs and pair each with its last-modified date. Calculate days since update for each URL, apply your per-content-type half-life, and sort by score ascending. Pages below 40 go into an urgent refresh queue; pages between 40 and 60 go into the next sprint. Run the calculation monthly and track score trends over time to catch systematic decay before it affects rankings. Use the <a href="/calculators/cron-next-run-calculator">Cron Next Run Calculator</a> to schedule automated audit jobs.',
    },
  ],
  relatedSlugs: ['cache-ttl-impact-calculator', 'cron-next-run-calculator', 'cache-hit-rate-calculator'],
};

export const freshnessMarkersCalculator: CalculatorDefinition = { meta, Component: FreshnessMarkersUI };
