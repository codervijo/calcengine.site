import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function SbomCoverageUI() {
  const [totalComponents, setTotalComponents] = useState<string>('100');
  const [sbomDocumented, setSbomDocumented] = useState<string>('85');
  const [completeMetadata, setCompleteMetadata] = useState<string>('61');
  const [vexAssessed, setVexAssessed] = useState<string>('51');

  const total = parseFloat(totalComponents) || 0;
  const documented = parseFloat(sbomDocumented) || 0;
  const metadata = parseFloat(completeMetadata) || 0;
  const vex = parseFloat(vexAssessed) || 0;

  const componentCoverage = total > 0 ? (documented / total) * 100 : 0;
  const metadataCompleteness = documented > 0 ? (metadata / documented) * 100 : 0;
  const vexCoverage = documented > 0 ? (vex / documented) * 100 : 0;
  const sbomScore = componentCoverage * 0.60 + metadataCompleteness * 0.25 + vexCoverage * 0.15;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate SBOM Coverage Score</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Total Known Components" type="number" value={totalComponents} onChange={(e) => setTotalComponents(e.target.value)} />
        <TextField label="Documented in SBOM" type="number" value={sbomDocumented} onChange={(e) => setSbomDocumented(e.target.value)} />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="With Complete Metadata" type="number" value={completeMetadata} onChange={(e) => setCompleteMetadata(e.target.value)} slotProps={{ htmlInput: { min: '0' } }} helperText="License, version, and hash" />
        <TextField label="With VEX Assessment" type="number" value={vexAssessed} onChange={(e) => setVexAssessed(e.target.value)} slotProps={{ htmlInput: { min: '0' } }} helperText="Vulnerability status documented" />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ flex: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">Component Coverage</Typography>
          <Typography variant="h5">{componentCoverage.toFixed(1)}%</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">Metadata Completeness</Typography>
          <Typography variant="h5">{metadataCompleteness.toFixed(1)}%</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">VEX Coverage</Typography>
          <Typography variant="h5">{vexCoverage.toFixed(1)}%</Typography>
        </Box>
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Overall SBOM Score</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{sbomScore.toFixed(1)}%</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'sbom-coverage-calculator',
  title: 'SBOM Coverage Calculator',
  shortTitle: 'SBOM Coverage',
  description: 'SBOM coverage calculator: score your software bill of materials completeness — track component documentation, metadata quality, and VEX coverage in one place',
  keywords: [
    'sbom coverage calculator',
    'software bill of materials coverage',
    'sbom completeness score',
    'sbom metadata quality checker',
    'vex coverage calculator',
    'sbom compliance scoring',
    'sbom quality tool',
    'software supply chain sbom score',
  ],
  category: 'general',
  icon: 'Security',
  tagline: 'Enter your component counts to get a weighted SBOM coverage score in seconds. Built for security engineers, compliance teams, and DevSecOps pipelines.',
  lastUpdated: 'April 2026',
  intro: 'The SBOM coverage calculator measures how complete your software bill of materials is across three dimensions: component documentation, metadata quality, and vulnerability assessment coverage. Security teams use it to quantify SBOM gaps before an audit, compliance review, or customer due diligence request.\n\nA high component coverage score means you have captured most of your supply chain, but it does not tell the full story. Entries without license, version, and hash data are functionally useless during an incident — that is why metadata completeness is weighted into the score. VEX (Vulnerability Exploitability eXchange) coverage shows what fraction of your SBOM entries have an explicit vulnerability status, a requirement under CRA, NTIA, and NIST SSDF frameworks.\n\nThe weighted score (60% component coverage, 25% metadata completeness, 15% VEX coverage) reflects industry prioritisation: getting components into the SBOM is the hardest step and drives the most value. Use the breakdown to identify your biggest gap and target tooling investment accordingly.\n\nMost organisations start below 60% on their first SBOM audit. Scores above 80% are considered strong for complex polyglot codebases. Perfect 100% coverage is rare but achievable with automated SBOM generation integrated into CI/CD.',
  howItWorksTitle: 'How to Calculate SBOM Coverage Score',
  howItWorksImage: '/images/calculators/sbom-coverage-calculator-how-it-works.svg',
  howItWorks: '1. Count your total known components — all direct and transitive dependencies across all repos and container images in scope.\n2. Count how many of those components appear in your SBOM. This is your component coverage numerator.\n3. Of the documented components, count those with complete metadata: a known license, pinned version, and cryptographic hash.\n4. Of the documented components, count those with a VEX statement — either known-not-affected, fixed, or under-investigation status.\n5. The calculator applies the weighted formula: Coverage (60%) + Metadata (25%) + VEX (15%) to produce your overall SBOM score.',
  formula: 'Component Coverage    = (SBOM Documented ÷ Total Components) × 100\nMetadata Completeness = (Complete Metadata ÷ SBOM Documented) × 100\nVEX Coverage          = (VEX Assessed ÷ SBOM Documented) × 100\n\nSBOM Score = (Component Coverage × 0.60)\n           + (Metadata Completeness × 0.25)\n           + (VEX Coverage × 0.15)\n\nSBOM Documented   — components captured in your SBOM out of all known components\nComplete Metadata — SBOM entries with license, pinned version, and cryptographic hash\nVEX Assessed      — SBOM entries with an explicit vulnerability exploitability statement\nSBOM Score        — weighted quality score from 0–100',
  examplesTitle: 'Example SBOM Coverage Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Mid-size SaaS product, first SBOM audit',
      body: 'Total components: 200   SBOM documented: 160   Complete metadata: 120   VEX assessed: 80\n\nComponent Coverage    = 160 ÷ 200 × 100 = 80.0%\nMetadata Completeness = 120 ÷ 160 × 100 = 75.0%\nVEX Coverage          =  80 ÷ 160 × 100 = 50.0%\n\nSBOM Score = (80.0 × 0.60) + (75.0 × 0.25) + (50.0 × 0.15)\n           = 48.0 + 18.75 + 7.5 = 74.3%',
    },
    {
      title: 'Example 2 — Mature DevSecOps pipeline with automated SBOM generation',
      body: 'Total components: 500   SBOM documented: 490   Complete metadata: 460   VEX assessed: 420\n\nComponent Coverage    = 490 ÷ 500 × 100 = 98.0%\nMetadata Completeness = 460 ÷ 490 × 100 = 93.9%\nVEX Coverage          = 420 ÷ 490 × 100 = 85.7%\n\nSBOM Score = (98.0 × 0.60) + (93.9 × 0.25) + (85.7 × 0.15)\n           = 58.8 + 23.5 + 12.9 = 95.1%',
    },
    {
      title: 'Example 3 — Legacy monolith, partial inventory',
      body: 'Total components: 350   SBOM documented: 175   Complete metadata: 105   VEX assessed: 35\n\nComponent Coverage    = 175 ÷ 350 × 100 = 50.0%\nMetadata Completeness = 105 ÷ 175 × 100 = 60.0%\nVEX Coverage          =  35 ÷ 175 × 100 = 20.0%\n\nSBOM Score = (50.0 × 0.60) + (60.0 × 0.25) + (20.0 × 0.15)\n           = 30.0 + 15.0 + 3.0 = 48.0%\nAction: prioritise automated dependency scanning to close the 50% component gap first.',
    },
  ],
  tipsTitle: 'Tips to Improve Your SBOM Coverage Score',
  tips: [
    'Automate SBOM generation in CI/CD with tools like Syft, Trivy, or CycloneDX generators — manual inventories degrade within weeks as dependencies update.',
    'Use package manager lock files (package-lock.json, Cargo.lock, Gemfile.lock) as the authoritative source; they capture exact versions and transitive deps automatically.',
    'Prioritise metadata completeness for direct dependencies first — they account for the most risk and are easiest to audit. Transitive deps can follow in a second pass.',
    'Automate VEX generation with tools like OpenVEX or Grype to attach exploitability statements at build time, not post-deployment.',
    'Run SBOM diff on every PR to catch new dependencies before they land in main — early detection keeps coverage high without manual triage.',
    'Target 80%+ component coverage before investing heavily in VEX tooling — component coverage is the highest-weight factor and prerequisite for meaningful vulnerability tracking.',
  ],
  faq: [
    {
      question: 'What is a good SBOM coverage score?',
      answer: 'Scores above 80% are considered strong for complex, polyglot codebases. Most organisations score between 50–70% on their first automated audit. Scores above 90% typically require CI/CD-integrated SBOM generation with automated VEX tooling. Regulated sectors (medical devices, critical infrastructure) should target 90%+ to satisfy CRA and NTIA minimum element requirements.',
    },
    {
      question: 'What does SBOM coverage measure exactly?',
      answer: 'SBOM coverage measures how completely your software bill of materials documents your actual supply chain. It has three dimensions: what fraction of known components are listed (component coverage), how many listed components have full metadata — license, version, hash — and how many have a vulnerability exploitability statement (VEX). This calculator combines all three into a single weighted score.',
    },
    {
      question: 'Why is component coverage weighted more than metadata and VEX?',
      answer: 'You cannot improve metadata or VEX data for components you have not documented yet — component coverage is the prerequisite for everything else, which is why it carries 60% of the score. Metadata completeness gets 25% because license and version data is required by most regulatory frameworks. VEX gets 15% — valuable but typically the last thing organisations automate. If you use the <a href="/calculators/cve-exposure-calculator">CVE Exposure Calculator</a>, good VEX coverage is needed for accurate results.',
    },
    {
      question: 'How do I count total known components for my SBOM?',
      answer: 'Run a dependency scanner (Syft, Trivy, OWASP Dependency-Check) across all source repos, container images, and build artefacts. The union of unique package identifiers — name, version, and ecosystem — is your total. Include both direct and transitive dependencies; transitive deps account for 80%+ of real-world vulnerability exposure. Cross-check against your <a href="/calculators/patch-sla-calculator">Patch SLA Calculator</a> to prioritise remediation of documented CVEs.',
    },
    {
      question: 'What is VEX and why does it matter for SBOM coverage?',
      answer: 'VEX (Vulnerability Exploitability eXchange) is a structured statement that says whether a known vulnerability actually affects your product. Without VEX, every CVE scanner match is a false positive until manually triaged. Adding VEX statements to your SBOM turns it from a static inventory into an active risk document. CISA, NTIA, and the EU Cyber Resilience Act all reference VEX as a key SBOM quality enhancement.',
    },
  ],
  relatedSlugs: ['cve-exposure-calculator', 'patch-sla-calculator', 'cra-compliance-score-calculator'],
};

export const sbomCoverageCalculator: CalculatorDefinition = { meta, Component: SbomCoverageUI };
