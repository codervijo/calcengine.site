import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function DeviceLifecycleComplianceUI() {
  const [totalDevices, setTotalDevices] = useState<string>('5000');
  const [eolDevices, setEolDevices] = useState<string>('750');
  const [nearEolDevices, setNearEolDevices] = useState<string>('300');
  const [complianceTarget, setComplianceTarget] = useState<string>('95');

  const total = parseFloat(totalDevices) || 0;
  const eol = parseFloat(eolDevices) || 0;
  const nearEol = parseFloat(nearEolDevices) || 0;
  const target = parseFloat(complianceTarget) || 0;

  const inSupport = Math.max(0, total - eol);
  const complianceRate = total > 0 ? (inSupport / total) * 100 : 0;
  const atRisk = eol + nearEol;
  const gap = Math.max(0, target - complianceRate);
  const isMet = complianceRate >= target;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Device Lifecycle Compliance</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Total Devices in Fleet"
          type="number"
          value={totalDevices}
          onChange={(e) => setTotalDevices(e.target.value)}
          slotProps={{ htmlInput: { min: '1' } }}
        />
        <TextField
          label="EOL Devices (past end-of-life)"
          type="number"
          value={eolDevices}
          onChange={(e) => setEolDevices(e.target.value)}
          slotProps={{ htmlInput: { min: '0' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Near-EOL Devices (within warning window)"
          type="number"
          value={nearEolDevices}
          onChange={(e) => setNearEolDevices(e.target.value)}
          slotProps={{ htmlInput: { min: '0' } }}
        />
        <TextField
          label="Compliance Target (%)"
          type="number"
          value={complianceTarget}
          onChange={(e) => setComplianceTarget(e.target.value)}
          slotProps={{ htmlInput: { min: '0', max: '100', step: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Lifecycle Compliance Rate</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{complianceRate.toFixed(1)}%</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
          {isMet
            ? `✓ Target met — ${complianceRate.toFixed(1)}% ≥ ${target}% | At-risk: ${atRisk.toLocaleString()} devices (${total > 0 ? ((atRisk / total) * 100).toFixed(1) : 0}%)`
            : `Gap: ${gap.toFixed(1)}% — ${Math.ceil((gap / 100) * total).toLocaleString()} devices must be refreshed | At-risk: ${atRisk.toLocaleString()} devices`}
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'device-lifecycle-compliance-calculator',
  title: 'Device Lifecycle Compliance Calculator',
  shortTitle: 'Device Lifecycle',
  description: 'Track device lifecycle compliance across your fleet. Enter EOL device counts and targets to measure your compliance rate and at-risk exposure instantly',
  keywords: [
    'device lifecycle compliance calculator',
    'device end of life compliance tracker',
    'hardware lifecycle management calculator',
    'eol device compliance rate',
    'device refresh compliance',
    'it asset lifecycle compliance',
    'device fleet lifecycle status',
    'hardware end of life tracking',
  ],
  category: 'general',
  icon: 'DevicesOther',
  tagline: 'Enter your fleet size, EOL device counts, and compliance target to instantly measure your device lifecycle compliance rate. See your at-risk exposure and how many devices need refresh.',
  lastUpdated: 'April 2026',
  intro: 'The device lifecycle compliance calculator helps IT and security teams measure how much of their fleet remains within vendor-supported lifecycle. Compliance rate — the percentage of devices still receiving security patches — is a critical metric for enterprise security posture and is required by frameworks including CIS Controls, NIST SP 800-53, and the EU Cyber Resilience Act.\n\nThis calculator takes four inputs: total fleet size, EOL device count (past end-of-life date), near-EOL device count (within your warning window), and your compliance target. It outputs your current in-support rate, compliance gap, and total at-risk device count — giving you the numbers you need for executive reporting, audit evidence, and refresh budget justification.\n\nDevices past their vendor end-of-life date receive no security patches. A single unpatched EOL firewall or endpoint on a critical network segment can expose your organisation to known CVEs that cannot be remediated without hardware refresh. Lifecycle compliance tracking forces these risks into visibility before they become incidents.\n\nFor teams managing regulated fleets, pair this calculator with patch SLA tracking and CRA compliance scoring to build a complete picture of your device security posture. Near-EOL devices show your upcoming refresh workload — use them to drive procurement cycles well before devices fall out of support.',
  howItWorksTitle: 'How to Calculate Device Lifecycle Compliance',
  howItWorksImage: '/images/calculators/device-lifecycle-compliance-calculator-how-it-works.svg',
  howItWorks: '1. Count all active managed devices in your fleet — include endpoints, servers, network hardware, and IoT devices that should be within supported lifecycle.\n2. Count devices at or past their vendor end-of-life date — these receive no further security patches and directly reduce your compliance rate.\n3. Count devices within your near-EOL warning window (typically 90–180 days from EOL) — these are still compliant today but signal upcoming refresh work.\n4. Set your compliance target — most security frameworks require 95%+ of devices to remain within supported lifecycle.\n5. The calculator computes in-support rate ((Total − EOL) ÷ Total × 100), your gap to target, and at-risk device count (EOL + near-EOL).',
  formula: 'Compliance Rate (%) = ((Total Devices − EOL Devices) ÷ Total Devices) × 100\n\nEOL Exposure (%)      = (EOL Devices ÷ Total Devices) × 100\n\nNear-EOL Exposure (%) = (Near-EOL Devices ÷ Total Devices) × 100\n\nAt-Risk Devices       = EOL Devices + Near-EOL Devices\n\nCompliance Gap (%)    = Target (%) − Compliance Rate (%)\n\nTotal Devices    — all active managed devices in the fleet\nEOL Devices      — devices past vendor end-of-life, receiving no patches\nNear-EOL Devices — devices within warning window of EOL (e.g. 90 days)\nTarget (%)       — minimum in-support rate required by policy or regulation',
  examplesTitle: 'Example Device Lifecycle Compliance Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Enterprise laptop fleet, behind target',
      body: 'Fleet: 5,000 laptops   EOL: 750   Near-EOL: 300   Target: 95%\n\nIn-Support      = 5,000 − 750 = 4,250\nCompliance Rate = (4,250 ÷ 5,000) × 100 = 85.0%\nGap             = 95% − 85% = 10% → 500 more devices must be refreshed\nAt-Risk         = 750 + 300 = 1,050 devices (21% of fleet)',
    },
    {
      title: 'Example 2 — Network switch estate, target exactly met',
      body: 'Fleet: 1,200 switches   EOL: 48   Near-EOL: 120   Target: 96%\n\nIn-Support      = 1,200 − 48 = 1,152\nCompliance Rate = (1,152 ÷ 1,200) × 100 = 96.0%\nGap             = 96% − 96% = 0% (target exactly met)\nAt-Risk         = 48 + 120 = 168 switches (14% entering EOL within 90 days)',
    },
    {
      title: 'Example 3 — IoT sensor fleet, well above target',
      body: 'Fleet: 20,000 sensors   EOL: 200   Near-EOL: 400   Target: 90%\n\nIn-Support      = 20,000 − 200 = 19,800\nCompliance Rate = (19,800 ÷ 20,000) × 100 = 99.0%\n✓ Compliant — 9% buffer above 90% target\nAt-Risk         = 200 + 400 = 600 sensors (3% — low risk)',
    },
  ],
  tipsTitle: 'Tips to Improve Device Lifecycle Compliance',
  tips: [
    'Track EOL dates in a CMDB or IT asset management tool — spreadsheets drift. Export device counts to this calculator quarterly to catch emerging compliance gaps before audits.',
    'Set a near-EOL warning window of 90–180 days. Near-EOL devices in this calculator represent procurement lead time, not just risk — start refresh cycles before the EOL date, not after.',
    'Prioritise EOL devices in your highest-risk network zones first. A single EOL firewall on a critical segment carries far more risk than 100 EOL printers on an isolated VLAN.',
    'Map EOL status to CVE exposure. Devices past EOL won\'t receive patches for new CVEs — cross-reference with the <a href="/calculators/cve-exposure-calculator">CVE Exposure Calculator</a> to quantify your unpatched risk surface.',
    'Automate vendor EOL data feeds. Cisco, Microsoft, and Dell publish machine-readable EOL calendars — integrate them into your CMDB so compliance tracking doesn\'t rely on manual updates.',
    'Include cloud instance types and managed runtimes in lifecycle tracking. AWS, Azure, and GCP regularly deprecate instance families — they follow the same EOL compliance logic as physical hardware.',
  ],
  faq: [
    {
      question: 'What is device lifecycle compliance?',
      answer: 'Device lifecycle compliance measures the percentage of devices in your fleet that remain within vendor-supported lifecycle — meaning the vendor still releases security patches. Devices past their end-of-life date receive no patches, making them a direct security liability. Most enterprise security policies and frameworks like CIS Controls and NIST SP 800-53 require tracking and remediating EOL devices within defined timeframes. Use the <a href="/calculators/cra-compliance-score-calculator">CRA Compliance Score Calculator</a> to roll this into a broader posture score.',
    },
    {
      question: 'How do I find the EOL date for my devices?',
      answer: 'Most vendors publish end-of-life notices on dedicated lifecycle pages: Microsoft Lifecycle Policy, Cisco End-of-Life and End-of-Sale Notices, Red Hat Life Cycle, and Dell EOSL pages. For network hardware, check vendor product lifecycle databases. Centralise these dates in your CMDB and set alerts 180 days before EOL to allow procurement lead time and refresh planning. Many IT asset management tools (ServiceNow, Lansweeper) can ingest vendor EOL feeds automatically.',
    },
    {
      question: 'What compliance target should I set for device lifecycle?',
      answer: 'Most security frameworks target 95–100% for critical infrastructure. CIS Controls Level 2 and NIST 800-53 both require systems to remain within supported lifecycle. For endpoints, 95% is a common enterprise floor; for network devices, 99%+ is typical. Near-EOL devices count as "at risk" — factor them into your planning horizon, not just your current compliance rate. The right target also depends on device risk tier: internet-facing systems warrant stricter thresholds than isolated internal hardware.',
    },
    {
      question: 'What is the difference between EOL and near-EOL devices in this calculator?',
      answer: 'EOL (end-of-life) devices have already passed their vendor support date — they receive no security patches and directly reduce your compliance rate in this calculator. Near-EOL devices are still supported but within your warning window (typically 90–180 days from EOL). They do not reduce your current compliance rate but reveal future exposure. Tracking them separately helps you distinguish compliance failures you must fix today from refresh work you must plan for next quarter.',
    },
    {
      question: 'How does device lifecycle compliance relate to patch compliance?',
      answer: 'Device lifecycle compliance and patch compliance are related but distinct. Patch compliance measures whether in-support devices have received the latest patches. Lifecycle compliance measures whether those devices are still eligible to receive patches at all. An EOL device can have 100% of its last patches applied and still be a liability — no new patches will ever ship for it. Both metrics are necessary for a complete security posture. See the <a href="/calculators/patch-sla-calculator">Patch SLA Calculator</a> for the patch side of this picture.',
    },
  ],
  relatedSlugs: ['cra-compliance-score-calculator', 'patch-sla-calculator', 'cve-exposure-calculator'],
};

export const deviceLifecycleComplianceCalculator: CalculatorDefinition = { meta, Component: DeviceLifecycleComplianceUI };
