import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function FirmwareRiskScoreUI() {
  const [criticalCVEs, setCriticalCVEs] = useState<string>('3');
  const [daysSincePatch, setDaysSincePatch] = useState<string>('180');
  const [sbomCoverage, setSbomCoverage] = useState<string>('60');
  const [internetFacing, setInternetFacing] = useState<string>('40');

  const cves = Math.max(parseFloat(criticalCVEs) || 0, 0);
  const patchDays = Math.max(parseFloat(daysSincePatch) || 0, 0);
  const sbom = Math.min(Math.max(parseFloat(sbomCoverage) || 0, 0), 100);
  const exposure = Math.min(Math.max(parseFloat(internetFacing) || 0, 0), 100);

  const cveScore = Math.min(cves * 5, 40);
  const patchScore = Math.min((patchDays / 365) * 30, 30);
  const sbomScore = ((100 - sbom) / 100) * 20;
  const exposureScore = (exposure / 100) * 10;
  const total = Math.round(cveScore + patchScore + sbomScore + exposureScore);

  const level =
    total <= 25 ? 'Low' : total <= 50 ? 'Medium' : total <= 75 ? 'High' : 'Critical';

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Firmware Risk Score</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Critical CVEs"
          type="number"
          value={criticalCVEs}
          onChange={(e) => setCriticalCVEs(e.target.value)}
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          label="Days Since Last Patch"
          type="number"
          value={daysSincePatch}
          onChange={(e) => setDaysSincePatch(e.target.value)}
          slotProps={{ htmlInput: { min: 0 } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="SBOM Coverage (%)"
          type="number"
          value={sbomCoverage}
          onChange={(e) => setSbomCoverage(e.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 100 } }}
        />
        <TextField
          label="Internet-Facing Devices (%)"
          type="number"
          value={internetFacing}
          onChange={(e) => setInternetFacing(e.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 100 } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Firmware Risk Score</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{total} / 100</Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>Risk Level: {level}</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'firmware-risk-score-calculator',
  title: 'Firmware Risk Score Calculator',
  shortTitle: 'Firmware Risk',
  description: 'Calculate firmware risk score for IoT and embedded devices. Enter CVE count, patch age, SBOM coverage, and exposure to get an instant 0–100 risk rating.',
  keywords: [
    'firmware risk score calculator',
    'firmware vulnerability score',
    'iot firmware risk assessment',
    'embedded device security score',
    'firmware patch risk calculator',
    'sbom risk score',
    'iot security risk calculator',
    'firmware compliance risk',
  ],
  category: 'general',
  icon: 'Security',
  tagline: 'Quantify firmware security risk across your device fleet in seconds. Enter CVE count, patch lag, SBOM coverage, and internet exposure to get a scored risk rating from 0 to 100.',
  lastUpdated: 'April 2026',
  intro: 'The firmware risk score calculator helps security engineers, product security teams, and IoT architects quantify how exposed a firmware build is to exploitation. It combines four independently measurable signals — unpatched CVEs, patch staleness, SBOM completeness, and network exposure — into a single 0–100 score with a Low / Medium / High / Critical label.\n\nFirmware security is notoriously hard to track because vulnerabilities span layers: bootloader, kernel, third-party libraries, and application code. Without a composite score, teams end up with spreadsheets that disagree on priority. A standardised score makes it possible to compare risk across product lines, communicate urgency to management, and gate release pipelines.\n\nThis calculator is especially useful during pre-release security reviews, after a CVE advisory, or when establishing a baseline before a CRA or IEC 62443 audit. Use the score alongside your SBOM coverage and patch SLA metrics for a complete picture.',
  howItWorksTitle: 'How the Firmware Risk Score Calculator Works',
  howItWorksImage: '/images/calculators/firmware-risk-score-calculator-how-it-works.svg',
  howItWorks: '1. Enter the number of critical CVEs affecting the firmware build (each adds up to 5 points, capped at 40).\n2. Enter how many days have passed since the last firmware patch — older builds score higher (capped at 30 points).\n3. Enter your SBOM coverage percentage — the lower the coverage, the more unknown dependencies raise the score (up to 20 points).\n4. Enter the percentage of devices in the fleet that are internet-facing — direct exposure adds up to 10 points.\n5. The four sub-scores sum to a total risk score from 0 to 100, mapped to Low (≤25), Medium (26–50), High (51–75), or Critical (76–100).',
  formula: 'Risk Score = CVE Score + Patch Score + SBOM Score + Exposure Score\n\nCVE Score      = min(Critical CVEs × 5,  40)\nPatch Score    = min(Days Since Patch / 365 × 30, 30)\nSBOM Score     = (100 − SBOM Coverage %) / 100 × 20\nExposure Score = Internet-Facing % / 100 × 10\n\nRisk Level:\n  0–25  → Low\n  26–50 → Medium\n  51–75 → High\n  76–100 → Critical',
  examplesTitle: 'Example Firmware Risk Score Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Well-maintained industrial gateway',
      body: 'Critical CVEs:    1  →  1 × 5        =  5.0  pts\nDays since patch: 30  →  30/365 × 30 =  2.5  pts\nSBOM coverage:   90%  →  10/100 × 20 =  2.0  pts\nInternet-facing: 10%  →  10/100 × 10 =  1.0  pts\n                                         ──────────\nRisk Score: 11   →   Risk Level: Low',
    },
    {
      title: 'Example 2 — Neglected consumer IoT camera',
      body: 'Critical CVEs:    4  →  4 × 5        = 20.0  pts\nDays since patch: 365 →  365/365 × 30 = 30.0  pts\nSBOM coverage:   40%  →  60/100 × 20 = 12.0  pts\nInternet-facing: 80%  →  80/100 × 10 =  8.0  pts\n                                         ──────────\nRisk Score: 70   →   Risk Level: High',
    },
    {
      title: 'Example 3 — Critical infrastructure controller post-advisory',
      body: 'Critical CVEs:   10  →  min(50, 40)  = 40.0  pts  (capped)\nDays since patch: 700 →  min(57.5, 30) = 30.0  pts  (capped)\nSBOM coverage:   20%  →  80/100 × 20 = 16.0  pts\nInternet-facing: 50%  →  50/100 × 10 =  5.0  pts\n                                         ──────────\nRisk Score: 91   →   Risk Level: Critical',
    },
  ],
  tipsTitle: 'Tips to Reduce Firmware Risk Score',
  tips: [
    'Patch within 30 days of a critical CVE advisory — patch staleness is the fastest-moving variable in the score and compounds exponentially with exposure.',
    'Aim for ≥90% SBOM coverage before release. Use tools like Syft, SPDX, or CycloneDX to auto-generate SBOMs from build artifacts and catch unknown dependencies early.',
    'Segment internet-facing devices behind a VPN or device management gateway to reduce direct exposure. Cutting internet-facing percentage from 80% to 20% saves 6 points alone.',
    'Use the <a href="/calculators/cve-exposure-calculator">CVE Exposure Calculator</a> to prioritise which vulnerabilities to patch first based on CVSS score and affected device count.',
    'Track patch SLA compliance with the <a href="/calculators/patch-sla-calculator">Patch SLA Calculator</a> — late patches are the single biggest driver of high risk scores across fleets.',
    'Automate OTA update delivery so patch lag never exceeds 90 days. Check your OTA readiness with the <a href="/calculators/ota-compliance-checker">OTA Compliance Checker</a>.',
  ],
  faq: [
    {
      question: 'What is a firmware risk score?',
      answer: 'A firmware risk score is a composite 0–100 number that summarises how exposed a firmware build is to exploitation. It combines unpatched vulnerability count, patch staleness, SBOM completeness, and network exposure. Teams use it to prioritise remediation, communicate risk to stakeholders, and gate releases against a defined threshold before shipping.',
    },
    {
      question: 'How many critical CVEs make firmware high risk?',
      answer: 'In this model, 8 or more critical CVEs alone push the CVE sub-score to its cap of 40 points. Combined with even moderate patch lag and partial SBOM coverage, 3–5 critical CVEs can produce a High (51–75) score. Patch critical CVEs within 30 days to keep the CVE sub-score below 15 points.',
    },
    {
      question: 'Why does SBOM coverage affect risk score?',
      answer: 'An incomplete SBOM means unknown third-party dependencies that may carry untracked CVEs. If you cannot list what is in the firmware, you cannot know what is vulnerable. Low SBOM coverage is a proxy for blind spots: a build with 40% coverage may have 60% of its components completely unaudited, making the actual CVE count unknowable.',
    },
    {
      question: 'What is a good firmware risk score for shipping a product?',
      answer: 'A score of 25 or below (Low) is the target for consumer and industrial products before release. Many CRA and IEC 62443 frameworks implicitly require this: no known critical unpatched CVEs, firmware updated within 90 days, SBOM coverage above 85%, and internet-facing exposure minimised or proxied.',
    },
    {
      question: 'How does internet-facing percentage affect firmware risk?',
      answer: 'Devices directly reachable from the internet have a vastly larger attack surface than LAN-only or air-gapped devices. Even a firmware build with zero critical CVEs today becomes riskier as new vulnerabilities are discovered if the device is publicly accessible. Use network segmentation, VPNs, or reverse proxies to reduce this sub-score component.',
    },
  ],
  relatedSlugs: [
    'cve-exposure-calculator',
    'patch-sla-calculator',
    'sbom-coverage-calculator',
    'ota-compliance-checker',
  ],
};

export const firmwareRiskScoreCalculator: CalculatorDefinition = { meta, Component: FirmwareRiskScoreUI };
