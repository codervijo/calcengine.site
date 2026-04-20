import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function PatchSlaUI() {
  const [discoveryDate, setDiscoveryDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [severity, setSeverity] = useState<string>('high');

  const slaMap: Record<string, number> = { critical: 1, high: 7, medium: 30, low: 90 };
  const slaDays = slaMap[severity] ?? 7;

  const discoveryMs = discoveryDate ? new Date(discoveryDate).getTime() : NaN;
  const deadlineMs = discoveryMs + slaDays * 86400000;
  const daysRemaining = isNaN(deadlineMs) ? NaN : Math.ceil((deadlineMs - Date.now()) / 86400000);

  const deadlineStr = isNaN(deadlineMs)
    ? '—'
    : new Date(deadlineMs).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const status = isNaN(daysRemaining)
    ? '—'
    : daysRemaining < 0
    ? 'BREACHED'
    : daysRemaining <= 2
    ? 'AT RISK'
    : 'ON TRACK';

  const remainingLabel = isNaN(daysRemaining)
    ? 'Enter a discovery date'
    : daysRemaining < 0
    ? `Breached ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''} ago`
    : daysRemaining === 0
    ? 'Due today'
    : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Patch SLA Deadline</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Discovery Date"
          type="date"
          value={discoveryDate}
          onChange={(e) => setDiscoveryDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />
        <TextField
          select
          label="Severity Level"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          SelectProps={{ native: true }}
          fullWidth
        >
          <option value="critical">Critical — 1 day SLA</option>
          <option value="high">High — 7 day SLA</option>
          <option value="medium">Medium — 30 day SLA</option>
          <option value="low">Low — 90 day SLA</option>
        </TextField>
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>SLA Deadline · {slaDays}-day window</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{deadlineStr}</Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
          {remainingLabel} · <strong>{status}</strong>
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'patch-sla-calculator',
  title: 'Patch SLA Calculator',
  shortTitle: 'Patch SLA',
  description: 'Use the patch SLA calculator to find CVE fix deadlines by severity. Enter discovery date to get due date, days remaining, and SLA breach status instantly',
  keywords: [
    'patch sla calculator',
    'vulnerability patch deadline calculator',
    'cve remediation sla',
    'patch management sla calculator',
    'vulnerability sla tracker',
    'cvss severity patch timeline',
    'security patch due date calculator',
    'breach sla compliance calculator',
  ],
  category: 'general',
  icon: 'Security',
  tagline: 'Enter a CVE discovery date and severity level to instantly calculate your patch deadline, days remaining, and SLA compliance status. No sign-up required.',
  lastUpdated: 'April 2026',
  intro: 'A patch SLA calculator helps engineering and security teams determine exactly when a vulnerability must be remediated — no guesswork, no mental arithmetic. Feed in a CVE discovery date and severity level, and you get a hard deadline with a status flag showing whether you are on track, at risk, or already in breach.\n\nPatch SLA failures are one of the most common audit findings in SOC 2, ISO 27001, and PCI DSS reviews. Most organisations operate with four severity tiers: Critical (24 hours), High (7 days), Medium (30 days), and Low (90 days). These thresholds come from CVSS scoring, but many teams apply additional overrides for internet-facing assets or vulnerabilities with known active exploits.\n\nThis calculator targets security engineers, DevSecOps leads, and vulnerability management teams who need to quickly triage whether an outstanding CVE is at risk of breaching its SLA. It is also useful for compliance teams preparing for audits — run through a batch of CVE discovery dates and severities to identify which remediation tickets are overdue.\n\nThe formula is straightforward: deadline equals discovery date plus SLA days. Days remaining equals deadline minus today. The status flag — ON TRACK, AT RISK, or BREACHED — gives you an instant compliance read that you can paste directly into a ticket, incident report, or audit evidence pack.',
  howItWorksTitle: 'How to Calculate Patch SLA Deadlines by Severity',
  howItWorksImage: '/images/calculators/patch-sla-calculator-how-it-works.svg',
  howItWorks: '1. Select the severity level of the vulnerability: Critical, High, Medium, or Low.\n2. Enter the discovery date — when your team first identified or received the CVE alert.\n3. The calculator maps severity to the standard SLA window: Critical = 1 day, High = 7 days, Medium = 30 days, Low = 90 days.\n4. The deadline is computed as discovery date + SLA days.\n5. Days remaining = deadline − today. A negative number means the SLA is already breached.\n6. The status indicator (ON TRACK / AT RISK / BREACHED) gives you an instant compliance read for triage or reporting.',
  formula: 'Deadline       = Discovery Date + SLA Days\nDays Remaining = Deadline − Today\n\nSLA Days by Severity:\n  Critical → 1 day   (CVSS ≥ 9.0 or known active exploit)\n  High     → 7 days  (CVSS 7.0–8.9)\n  Medium   → 30 days (CVSS 4.0–6.9)\n  Low      → 90 days (CVSS < 4.0)\n\nStatus:\n  BREACHED  if Days Remaining < 0\n  AT RISK   if Days Remaining ≤ 2\n  ON TRACK  if Days Remaining > 2',
  examplesTitle: 'Example Patch SLA Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Critical CVE requiring same-day patch',
      body: 'Discovery Date: 2026-04-18 (yesterday)   Severity: Critical\nSLA Days:       1 day\nDeadline:       2026-04-19 (today)\nDays Remaining: 0  →  Status: AT RISK\n─────────────────────────────────────\nEmergency patch required today. Pre-stage rollback before deploying.',
    },
    {
      title: 'Example 2 — High severity CVE with time to schedule',
      body: 'Discovery Date: 2026-04-16 (3 days ago)   Severity: High\nSLA Days:       7 days\nDeadline:       2026-04-23\nDays Remaining: 4  →  Status: ON TRACK\n─────────────────────────────────────\nSchedule fix for the next change window by April 23.',
    },
    {
      title: 'Example 3 — Medium CVE with breached SLA',
      body: 'Discovery Date: 2026-03-10 (40 days ago)  Severity: Medium\nSLA Days:       30 days\nDeadline:       2026-04-09\nDays Remaining: -10  →  Status: BREACHED\n─────────────────────────────────────\nOverdue by 10 days. Escalate to risk owner and file a formal exception.',
    },
  ],
  tipsTitle: 'Tips for Patch SLA Compliance',
  tips: [
    'Treat Critical CVEs as zero-tolerance: a 1-day window means the fix must be tested and deployed the same day the alert lands. Pre-stage rollback plans before patching production.',
    'Use the discovery date consistently — never mix the scan date, CVE publish date, and alert-received date across tickets. Inconsistent baselines inflate your apparent compliance rate and hide real risk during audits.',
    'Automate SLA breach alerts at 48 hours before a Critical or High deadline. Teams need lead time to schedule emergency change windows — a midnight alert guarantees a scramble.',
    'Track Mean Time to Remediate (MTTR) by severity tier. If MTTR for High consistently exceeds the 7-day SLA, your bottleneck is usually change approval, not patching effort — fix the process, not just the tickets.',
    'Batch Medium and Low CVEs into monthly and quarterly patch cycles to reduce change-management overhead while still hitting your SLA windows. This also smooths out patching load for ops teams.',
    'For internet-facing assets, apply a one-tier severity bump: treat High as Critical and schedule a 1-day window. Exploit probability for exposed assets is significantly higher than the CVSS score alone suggests.',
  ],
  faq: [
    {
      question: 'What is a patch SLA?',
      answer: 'A patch SLA (Service Level Agreement) defines the maximum time allowed to remediate a vulnerability after discovery. Most organisations align to severity tiers: Critical fixes within 24 hours, High within 7 days, Medium within 30 days, and Low within 90 days. These thresholds are common in frameworks like NIST CSF, ISO 27001, and many regulatory compliance standards including SOC 2 and PCI DSS.',
    },
    {
      question: 'What date counts as the discovery date for patch SLA purposes?',
      answer: 'The discovery date is when your organisation first became aware of the vulnerability — typically when a CVE is published, when a scanner first flags it in your environment, or when you receive a vendor advisory. Some teams use the scan date; others use the CVE publish date. Whichever you choose, apply it consistently across all assets for accurate SLA compliance tracking and audit evidence.',
    },
    {
      question: 'What happens when a patch SLA is breached?',
      answer: 'A breached SLA means the remediation window has expired without a fix being applied. Most security programs require escalation to a senior stakeholder, a formal risk acceptance or exception with a revised target date, and documentation for audit purposes. Tracking breach rate as a KPI helps identify systemic issues — such as slow change approval processes, missing scanner coverage, or under-resourced patching teams.',
    },
    {
      question: 'Can I use custom SLA thresholds instead of the standard ones?',
      answer: 'The calculator uses the most common industry-standard thresholds: Critical = 1 day, High = 7 days, Medium = 30 days, Low = 90 days, aligned with NIST CSF and typical enterprise policy. For custom thresholds, apply the formula manually: add your organisation\'s SLA days to the discovery date, then subtract today\'s date to get days remaining and compare against your internal policy.',
    },
    {
      question: 'How does CVSS score map to severity for patch SLA?',
      answer: 'The standard mapping used by most vulnerability management programs is: Critical for CVSS 9.0–10.0 (or any known active exploit), High for 7.0–8.9, Medium for 4.0–6.9, and Low for 0.1–3.9. Many organisations override score-based severity when a vulnerability has a public proof-of-concept or affects an internet-facing system, bumping it to Critical regardless of CVSS score to shrink the remediation window.',
    },
  ],
  relatedSlugs: ['cve-exposure-calculator', 'cra-compliance-score-calculator', 'freshness-markers'],
};

export const patchSlaCalculator: CalculatorDefinition = { meta, Component: PatchSlaUI };
