import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function CRAComplianceScoreUI() {
  const [secureDesign, setSecureDesign] = useState<string>('2');
  const [vulnHandling, setVulnHandling] = useState<string>('2');
  const [documentation, setDocumentation] = useState<string>('2');
  const [updatePolicy, setUpdatePolicy] = useState<string>('2');
  const [incidentReporting, setIncidentReporting] = useState<string>('2');

  const clamp = (v: number) => Math.min(4, Math.max(0, Math.round(v) || 0));

  const d1 = clamp(parseFloat(secureDesign));
  const d2 = clamp(parseFloat(vulnHandling));
  const d3 = clamp(parseFloat(documentation));
  const d4 = clamp(parseFloat(updatePolicy));
  const d5 = clamp(parseFloat(incidentReporting));

  const score = ((d1 + d2 + d3 + d4 + d5) / 20) * 100;

  const tier =
    score >= 90
      ? 'Fully Compliant'
      : score >= 70
      ? 'Substantially Compliant'
      : score >= 40
      ? 'Partially Compliant'
      : 'Non-Compliant';

  const fieldProps = { type: 'number', slotProps: { htmlInput: { min: 0, max: 4, step: 1 } } };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate CRA Compliance Score</Typography>
      <Typography variant="body2" color="text.secondary">
        Rate each domain 0–4: 0 = not implemented · 1 = ad-hoc · 2 = developing · 3 = defined · 4 = optimised
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Secure by Design (0–4)"
          value={secureDesign}
          onChange={(e) => setSecureDesign(e.target.value)}
          {...fieldProps}
          fullWidth
        />
        <TextField
          label="Vulnerability Handling (0–4)"
          value={vulnHandling}
          onChange={(e) => setVulnHandling(e.target.value)}
          {...fieldProps}
          fullWidth
        />
        <TextField
          label="Documentation & SBOM (0–4)"
          value={documentation}
          onChange={(e) => setDocumentation(e.target.value)}
          {...fieldProps}
          fullWidth
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Update & Patch Policy (0–4)"
          value={updatePolicy}
          onChange={(e) => setUpdatePolicy(e.target.value)}
          {...fieldProps}
          fullWidth
        />
        <TextField
          label="Incident Reporting (0–4)"
          value={incidentReporting}
          onChange={(e) => setIncidentReporting(e.target.value)}
          {...fieldProps}
          fullWidth
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>CRA Compliance Score</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{score.toFixed(0)}%</Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>{tier}</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'cra-compliance-score-calculator',
  title: 'CRA Compliance Score Calculator',
  shortTitle: 'CRA Score',
  description: 'Calculate your CRA compliance score across 5 cybersecurity domains. Assess EU Cyber Resilience Act readiness for products with digital elements — free, instant',
  keywords: [
    'cra compliance score calculator',
    'eu cyber resilience act compliance',
    'cra readiness assessment',
    'cyber resilience act score',
    'product cybersecurity compliance',
    'cra maturity score',
    'digital product security assessment',
    'eu cra checker',
  ],
  category: 'general',
  icon: 'Security',
  tagline: 'Score your product\'s EU Cyber Resilience Act compliance across five mandatory domains in under a minute. Built for software vendors, manufacturers, and security leads preparing for CRA enforcement.',
  lastUpdated: 'April 2026',
  intro: 'The CRA compliance score calculator helps you quantify where your product stands against the EU Cyber Resilience Act\'s five essential cybersecurity domains. The CRA (Regulation EU 2024/2847) applies to all manufacturers placing products with digital elements on the EU market, with obligations covering design, vulnerability management, documentation, patching, and incident reporting.\n\nAssessing compliance manually across these domains is time-consuming. This calculator uses a structured 0–4 maturity scale per domain — the same tiered model used in ISO 27001 gap analyses and NIST CSF assessments — to produce a single percentage score and a plain-language compliance tier.\n\nSoftware vendors shipping SaaS-adjacent hardware, IoT device makers, industrial control system suppliers, and enterprise software companies all fall within CRA scope. Use this tool early in your compliance programme to identify the weakest domains and prioritise remediation effort before audit.\n\nThe CRA distinguishes between "important" and "critical" products, which face third-party audits. For default class products, self-assessment is permitted. Either way, a documented gap analysis — which this score supports — is a requirement, not optional.',
  howItWorksTitle: 'How to Calculate Your CRA Compliance Score',
  howItWorksImage: '/images/calculators/cra-compliance-score-calculator-how-it-works.svg',
  howItWorks: '1. Rate your product\'s Secure by Design posture (0–4): covers threat modelling, minimal attack surface, and security testing in the SDL.\n2. Rate Vulnerability Handling (0–4): covers CVE tracking, coordinated disclosure policy, and remediation SLAs.\n3. Rate Documentation & SBOM (0–4): covers technical documentation, CE declaration, and a published Software Bill of Materials.\n4. Rate Update & Patch Policy (0–4): covers the update delivery mechanism, patch signing, and support lifetime commitment.\n5. Rate Incident Reporting (0–4): covers your ability to report actively exploited vulnerabilities to ENISA within 24 hours as required by Article 14.\n6. The calculator sums all five domain scores, divides by 20, and multiplies by 100 to produce a 0–100% score with a compliance tier.',
  formula: 'CRA Score = (D1 + D2 + D3 + D4 + D5) / 20 × 100\n\nD1 — Secure by Design         (0–4)\nD2 — Vulnerability Handling   (0–4)\nD3 — Documentation & SBOM     (0–4)\nD4 — Update & Patch Policy    (0–4)\nD5 — Incident Reporting       (0–4)\n\nTier thresholds:\n  90–100%  →  Fully Compliant\n  70–89%   →  Substantially Compliant\n  40–69%   →  Partially Compliant\n   0–39%   →  Non-Compliant',
  examplesTitle: 'Example CRA Compliance Score Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Mature IoT firmware vendor (high compliance)',
      body: 'Secure by Design:       4 / 4  (threat model in SDL, pentest every release)\nVulnerability Handling: 4 / 4  (CVE programme, 30-day patch SLA)\nDocumentation & SBOM:   3 / 4  (SBOM published, CE docs in progress)\nUpdate & Patch Policy:  4 / 4  (OTA signed updates, 10-year support)\nIncident Reporting:     3 / 4  (ENISA process drafted, not yet tested)\n                       ─────────────────────────────────────────────\nTotal: (4+4+3+4+3) / 20 × 100 = 18/20 × 100 = 90%  →  Fully Compliant',
    },
    {
      title: 'Example 2 — Early-stage SaaS-connected hardware startup',
      body: 'Secure by Design:       2 / 4  (basic SAST, no threat model)\nVulnerability Handling: 1 / 4  (ad-hoc, no public disclosure policy)\nDocumentation & SBOM:   1 / 4  (minimal docs, no SBOM)\nUpdate & Patch Policy:  2 / 4  (manual OTA, support period undefined)\nIncident Reporting:     1 / 4  (no formal process)\n                       ─────────────────────────────────────────────\nTotal: (2+1+1+2+1) / 20 × 100 = 7/20 × 100 = 35%  →  Non-Compliant',
    },
    {
      title: 'Example 3 — Mid-market industrial control system supplier',
      body: 'Secure by Design:       3 / 4  (threat model exists, DAST planned)\nVulnerability Handling: 3 / 4  (VDP live, 90-day SLA)\nDocumentation & SBOM:   2 / 4  (internal SBOM only)\nUpdate & Patch Policy:  3 / 4  (signed patches, 5-year support)\nIncident Reporting:     2 / 4  (internal runbook, no ENISA test)\n                       ─────────────────────────────────────────────\nTotal: (3+3+2+3+2) / 20 × 100 = 13/20 × 100 = 65%  →  Partially Compliant',
    },
  ],
  tipsTitle: 'Tips to Improve Your CRA Compliance Score',
  tips: [
    'Start with SBOM generation — it unblocks both the Documentation and Vulnerability Handling domains simultaneously. Tools like Syft or Trivy can produce a CycloneDX SBOM from your container images in minutes.',
    'Publish a Vulnerability Disclosure Policy (VDP) at security.txt before anything else. It costs nothing, scores you at least a 1 in Vulnerability Handling, and signals good faith to regulators.',
    'Map your existing ISO 27001 or SOC 2 controls to CRA requirements. Most mature vendors are 60–70% of the way there without knowing it — a gap analysis often reveals fewer gaps than feared.',
    'Prioritise the Incident Reporting domain early. The CRA requires reporting actively exploited vulnerabilities to ENISA within 24 hours (Article 14). Running a tabletop exercise is low-cost and moves you from 1 to 3 quickly.',
    'Commit to a defined end-of-life support period in your product documentation. The CRA requires manufacturers to specify and honour a minimum support lifetime — a written policy alone moves Update & Patch Policy from 1 to 2.',
    'For "important" class products, engage a notified body early. Third-party audit timelines in Europe are long — starting 12 months before your target enforcement date is not too early.',
  ],
  faq: [
    {
      question: 'What is the EU Cyber Resilience Act and who does it apply to?',
      answer: 'The EU Cyber Resilience Act (Regulation EU 2024/2847) sets mandatory cybersecurity requirements for all products with digital elements placed on the EU market. It applies to hardware and software manufacturers, including IoT device makers, industrial control system vendors, and software companies with network-connected products. Purely B2B SaaS with no physical component may be out of scope, but most embedded and connected products are covered.',
    },
    {
      question: 'What score do I need to be CRA compliant?',
      answer: 'The CRA does not publish a numeric threshold — compliance is determined by meeting all essential requirements in Annex I. This calculator uses a 90%+ "Fully Compliant" tier as a proxy for having substantially implemented all five domains. Scores below 70% indicate significant gaps that a notified body or market surveillance authority would likely flag during assessment. Treat 90% as the target, not the floor.',
    },
    {
      question: 'What is a Software Bill of Materials (SBOM) and is it required by the CRA?',
      answer: 'An SBOM is a machine-readable inventory of all software components and dependencies in your product, including open-source libraries and transitive dependencies. The CRA requires manufacturers to identify and document components that could introduce vulnerabilities (Annex I, Part I, §2). While the CRA does not mandate a specific SBOM format, CycloneDX and SPDX are the de facto standards accepted by EU regulators and supply chain auditors.',
    },
    {
      question: 'When does the CRA come into force?',
      answer: 'The CRA entered into force on 10 December 2024. The main obligations for manufacturers apply from 11 December 2027. However, vulnerability and incident reporting obligations under Article 14 apply from 11 September 2026 — so compliance cannot wait until 2027. Manufacturers of "important" and "critical" class products should begin gap assessments and notified body engagement in 2025 to meet these staggered deadlines.',
    },
    {
      question: 'How is this score different from a formal CRA conformity assessment?',
      answer: 'This calculator is a self-assessment tool for gap identification and internal reporting — it is not a substitute for a formal CRA conformity assessment. Default class products can self-certify using EU harmonised standards (EN 18031 series). Important and critical class products require a notified body audit. Use this score to prioritise your remediation roadmap and enter formal assessment with a documented baseline.',
    },
  ],
  relatedSlugs: ['encryption-overhead-calculator', 'hash-collision-probability-calculator', 'tls-handshake-time-estimator', 'log-storage-cost-calculator'],
};

export const craComplianceScoreCalculator: CalculatorDefinition = { meta, Component: CRAComplianceScoreUI };
