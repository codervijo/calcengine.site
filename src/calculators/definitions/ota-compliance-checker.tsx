import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function OtaComplianceCheckerUI() {
  const [totalDevices, setTotalDevices] = useState<string>('10000');
  const [updatedDevices, setUpdatedDevices] = useState<string>('8500');
  const [targetCompliance, setTargetCompliance] = useState<string>('95');
  const [daysSinceRelease, setDaysSinceRelease] = useState<string>('14');

  const total = parseFloat(totalDevices) || 0;
  const updated = parseFloat(updatedDevices) || 0;
  const target = parseFloat(targetCompliance) || 0;
  const days = parseFloat(daysSinceRelease) || 0;

  const complianceRate = total > 0 ? (updated / total) * 100 : 0;
  const gap = Math.max(0, target - complianceRate);
  const devicesNeeded = Math.ceil((target / 100) * total) - updated;
  const dailyRate = days > 0 ? updated / days : 0;
  const daysToTarget = dailyRate > 0 && devicesNeeded > 0 ? Math.ceil(devicesNeeded / dailyRate) : 0;
  const isMet = complianceRate >= target;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Check OTA Update Compliance</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Total Devices in Fleet"
          type="number"
          value={totalDevices}
          onChange={(e) => setTotalDevices(e.target.value)}
          slotProps={{ htmlInput: { min: '1' } }}
        />
        <TextField
          label="Devices Updated"
          type="number"
          value={updatedDevices}
          onChange={(e) => setUpdatedDevices(e.target.value)}
          slotProps={{ htmlInput: { min: '0' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Target Compliance (%)"
          type="number"
          value={targetCompliance}
          onChange={(e) => setTargetCompliance(e.target.value)}
          slotProps={{ htmlInput: { min: '0', max: '100', step: '1' } }}
        />
        <TextField
          label="Days Since Update Released"
          type="number"
          value={daysSinceRelease}
          onChange={(e) => setDaysSinceRelease(e.target.value)}
          slotProps={{ htmlInput: { min: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Current Compliance Rate</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{complianceRate.toFixed(1)}%</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
          {isMet
            ? `✓ Target met — ${complianceRate.toFixed(1)}% ≥ ${target}%`
            : `Gap: ${gap.toFixed(1)}% — ${devicesNeeded > 0 ? devicesNeeded.toLocaleString() + ' more devices needed' : 'target already met'}${daysToTarget > 0 ? ` (~${daysToTarget} days at current rate)` : ''}`}
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'ota-compliance-checker',
  title: 'OTA Compliance Checker',
  shortTitle: 'OTA Compliance',
  description: 'Check OTA compliance rates across your device fleet. Enter fleet size, updated devices, and target to see your compliance gap and time-to-target estimate.',
  keywords: [
    'ota compliance checker',
    'over the air update compliance',
    'device fleet compliance rate',
    'ota update coverage calculator',
    'firmware update compliance tracker',
    'iot ota compliance',
    'device update compliance percentage',
    'ota rollout compliance tool',
  ],
  category: 'general',
  icon: 'Security',
  tagline: 'Enter your fleet size and update counts to instantly check OTA compliance against your target. See your compliance gap and how long it will take to close it at your current rollout rate.',
  lastUpdated: 'April 2026',
  intro: 'The OTA compliance checker helps device and platform engineers measure how effectively over-the-air updates are reaching their fleets. Compliance rate — the percentage of devices running the latest approved firmware or software — is a key metric in regulated industries (automotive, medical devices, industrial IoT) and increasingly required by frameworks like the EU Cyber Resilience Act.\n\nThis calculator takes four inputs: total fleet size, number of already-updated devices, your compliance target, and days since the update was released. It outputs your current compliance rate, the gap to your target, how many additional devices need to update, and an estimated days-to-target based on your current daily adoption rate.\n\nOTA compliance tracking matters beyond regulatory checkboxes. Unpatched devices are exposed to known CVEs, and a large compliance gap signals that your update delivery pipeline — staging rings, rollout throttling, device connectivity — may need tuning. Use this checker before and after releases to quantify progress and report to stakeholders.\n\nFor teams managing complex update pipelines, pair this calculator with patch SLA tracking and SBOM coverage analysis to get a complete picture of your fleet\'s security posture.',
  howItWorksTitle: 'How to Calculate OTA Compliance Rate',
  howItWorksImage: '/images/calculators/ota-compliance-checker-how-it-works.svg',
  howItWorks: '1. Count your total active devices in the fleet — include all devices that should be receiving the update, excluding decommissioned units.\n2. Count devices that have confirmed receipt and application of the target firmware version — pull this from your device management platform.\n3. Set your compliance target — regulatory frameworks often require 95–99%, internal SLAs vary by risk tier.\n4. Enter days since the update was released to calculate your daily adoption rate.\n5. The calculator divides updated devices by total fleet to get compliance rate, then computes gap to target and estimated days to close it at the current adoption rate.',
  formula: 'Compliance Rate (%) = (Updated Devices ÷ Total Devices) × 100\n\nCompliance Gap (%) = Target (%) − Compliance Rate (%)\n\nDevices Still Needed = ⌈(Target% ÷ 100) × Total⌉ − Updated\n\nDaily Adoption Rate = Updated Devices ÷ Days Since Release\n\nDays to Target = ⌈Devices Still Needed ÷ Daily Adoption Rate⌉\n\nUpdated Devices  — devices confirmed running the target firmware/version\nTotal Devices    — total active devices in the fleet\nTarget (%)       — compliance threshold (e.g. 95% per regulatory SLA)\nDays Since Release — calendar days since the update was made available',
  examplesTitle: 'Example OTA Compliance Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — IoT fleet, behind target',
      body: 'Fleet: 10,000 devices   Updated: 8,500   Target: 95%   Days: 14\n\nCompliance Rate = (8,500 ÷ 10,000) × 100 = 85.0%\nGap            = 95% − 85% = 10%\nDevices Needed = ⌈(0.95 × 10,000)⌉ − 8,500 = 9,500 − 8,500 = 1,000\nDaily Rate     = 8,500 ÷ 14 = 607 devices/day\nDays to Target = ⌈1,000 ÷ 607⌉ = 2 days',
    },
    {
      title: 'Example 2 — Automotive ECU rollout, slow adoption',
      body: 'Fleet: 50,000 vehicles   Updated: 30,000   Target: 98%   Days: 30\n\nCompliance Rate = (30,000 ÷ 50,000) × 100 = 60.0%\nGap            = 98% − 60% = 38%\nDevices Needed = ⌈(0.98 × 50,000)⌉ − 30,000 = 49,000 − 30,000 = 19,000\nDaily Rate     = 30,000 ÷ 30 = 1,000 vehicles/day\nDays to Target = ⌈19,000 ÷ 1,000⌉ = 19 more days',
    },
    {
      title: 'Example 3 — SaaS agent fleet, target met',
      body: 'Fleet: 2,500 agents   Updated: 2,450   Target: 95%   Days: 7\n\nCompliance Rate = (2,450 ÷ 2,500) × 100 = 98.0%\nGap            = 98% − 95% = 0% (target already exceeded)\nDevices Needed = 0 (2,450 > required 2,375)\n✓ Compliant — 3% buffer above 95% target',
    },
  ],
  tipsTitle: 'Tips to Improve OTA Compliance Rates',
  tips: [
    'Use staged rollouts with automatic pause on error spikes — push to 1% of fleet first, monitor for 24 h, then expand. This catches bad updates before they widen the non-compliant gap.',
    'Track "update acknowledgment" separately from "update applied" — devices that download but fail to apply inflate your progress metrics and mask real compliance gaps.',
    'Set per-segment compliance targets, not just fleet-wide. A 95% overall rate may hide a critical segment (e.g. safety-critical ECUs) sitting at 70%.',
    'Monitor device connectivity before releases. Devices offline at rollout time skew your daily adoption rate downward — compensate by extending your measurement window.',
    'Automate compliance reporting: pull daily updated-device counts from your device management API, feed them into this formula, and alert when the gap exceeds your SLA threshold.',
    'Cross-reference your OTA compliance rate with your <a href="/calculators/patch-sla-calculator">Patch SLA Calculator</a> to confirm that the update pipeline is meeting its delivery commitments, not just its coverage targets.',
  ],
  faq: [
    {
      question: 'What is OTA compliance rate and why does it matter?',
      answer: 'OTA compliance rate is the percentage of devices in your fleet running the latest approved firmware or software version. It matters because unupdated devices remain exposed to known vulnerabilities. Regulatory frameworks like the EU Cyber Resilience Act and UNECE WP.29 (automotive) require manufacturers to demonstrate that security updates reach a high percentage of deployed devices within defined timeframes.',
    },
    {
      question: 'What compliance target should I set for OTA updates?',
      answer: 'Most regulatory frameworks and enterprise SLAs target 95–99% for critical security patches. Critical infrastructure and medical devices often mandate 99%+. Internal tooling and low-risk consumer IoT may accept 90%. The right target depends on your risk tier, CVE severity, and any contractual or regulatory obligations. Use the <a href="/calculators/cra-compliance-score-calculator">CRA Compliance Score Calculator</a> to score your overall posture.',
    },
    {
      question: 'How do I measure how many devices have actually applied an OTA update?',
      answer: 'Pull confirmed-applied counts from your device management platform (AWS IoT Jobs, Azure IoT Hub, Mender, Balena, or a custom telemetry pipeline). Distinguish between "update downloaded," "update applied," and "device rebooted into new version" — only the last state constitutes a fully compliant device. Acknowledgment without application is a common source of inflated compliance metrics.',
    },
    {
      question: 'Why is my OTA adoption rate slower than expected?',
      answer: 'Common causes: devices offline or on metered connections at rollout time, staged rollout throttling that caps daily throughput, failed updates that require manual intervention, or devices excluded from the rollout ring. Check your device management platform\'s failed-job logs first, then examine connectivity patterns. Pair with the <a href="/calculators/patch-sla-calculator">Patch SLA Calculator</a> to see if delivery timelines are within SLA.',
    },
    {
      question: 'Can I use this calculator for software agent fleets, not just embedded devices?',
      answer: 'Yes — the formula applies to any fleet where individual units must be updated: IoT sensors, automotive ECUs, Kubernetes node agents, desktop software, or cloud VM agents. "Updated devices" simply means units confirmed running the target version. The compliance gap and days-to-target estimates are equally valid for software rollouts as for firmware updates. For SaaS update pipelines, SBOM coverage is also worth tracking — see the <a href="/calculators/sbom-coverage-calculator">SBOM Coverage Calculator</a>.',
    },
  ],
  relatedSlugs: ['cra-compliance-score-calculator', 'patch-sla-calculator', 'sbom-coverage-calculator'],
};

export const otaComplianceCheckerCalculator: CalculatorDefinition = { meta, Component: OtaComplianceCheckerUI };
