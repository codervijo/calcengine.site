import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function EncryptionCoverageUI() {
  const [totalAssets, setTotalAssets] = useState<string>('50');
  const [encryptedAtRest, setEncryptedAtRest] = useState<string>('40');
  const [encryptedInTransit, setEncryptedInTransit] = useState<string>('45');

  const total = parseFloat(totalAssets) || 0;
  const atRest = parseFloat(encryptedAtRest) || 0;
  const inTransit = parseFloat(encryptedInTransit) || 0;

  const atRestPct = total > 0 ? Math.min((atRest / total) * 100, 100) : 0;
  const inTransitPct = total > 0 ? Math.min((inTransit / total) * 100, 100) : 0;
  const overallPct = total > 0 ? Math.min(((atRest + inTransit) / (total * 2)) * 100, 100) : 0;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Encryption Coverage</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Total Assets / Endpoints"
          type="number"
          value={totalAssets}
          onChange={(e) => setTotalAssets(e.target.value)}
          slotProps={{ htmlInput: { min: '0' } }}
        />
        <TextField
          label="Encrypted at Rest"
          type="number"
          value={encryptedAtRest}
          onChange={(e) => setEncryptedAtRest(e.target.value)}
          slotProps={{ htmlInput: { min: '0' } }}
        />
        <TextField
          label="Encrypted in Transit"
          type="number"
          value={encryptedInTransit}
          onChange={(e) => setEncryptedInTransit(e.target.value)}
          slotProps={{ htmlInput: { min: '0' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Overall Encryption Coverage</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{overallPct.toFixed(1)}%</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" spacing={4} sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>At Rest: {atRestPct.toFixed(1)}%</Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>In Transit: {inTransitPct.toFixed(1)}%</Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'encryption-coverage-calculator',
  title: 'Encryption Coverage Calculator',
  shortTitle: 'Encryption Coverage',
  description: 'Calculate encryption coverage across your data assets with this encryption coverage calculator. Measure at-rest and in-transit protection gaps instantly — no sign-up needed.',
  keywords: [
    'encryption coverage calculator',
    'data encryption coverage',
    'at rest encryption percentage',
    'in transit encryption calculator',
    'encryption gap analysis',
    'data security coverage',
    'encryption compliance calculator',
    'asset encryption audit tool',
  ],
  category: 'general',
  icon: 'Lock',
  tagline: 'Enter your total assets and how many are encrypted at rest and in transit to get an instant coverage score. Ideal for security audits, compliance reviews, and gap analysis.',
  lastUpdated: 'April 2026',
  intro: 'An encryption coverage calculator gives security teams a fast, quantified view of how much of their data estate is protected. Without a coverage number, "most of our data is encrypted" is just a guess — regulators, auditors, and incident responders need a percentage.\n\nThis tool covers both dimensions that matter: encryption at rest (data stored on disk, in databases, in object storage) and encryption in transit (data moving over networks, APIs, and service meshes). Multiply across your total asset count and you get separate scores for each dimension plus a combined overall coverage metric.\n\nUse this calculator when preparing for a SOC 2, ISO 27001, or CRA audit, during a security posture review, or after a new system is added to your inventory. It also helps prioritise remediation: if at-rest coverage is 95% but in-transit is 60%, you know exactly where to focus next.\n\nThe formula works for any unit — databases, microservices, S3 buckets, IoT endpoints, or on-prem servers. Define "asset" consistently across your inventory and the resulting percentage is comparable over time.',
  howItWorksTitle: 'How to Calculate Encryption Coverage',
  howItWorksImage: '/images/calculators/encryption-coverage-calculator-how-it-works.svg',
  howItWorks: '1. Count your total data assets — databases, services, storage buckets, or endpoints.\n2. Count how many assets have encryption at rest enabled (AES-256, LUKS, cloud-managed KMS, etc.).\n3. Count how many assets encrypt data in transit (TLS 1.2+, mTLS, HTTPS).\n4. Divide each encrypted count by the total to get at-rest and in-transit coverage percentages.\n5. Average the two percentages to get your overall encryption coverage score.',
  formula: 'At-Rest Coverage (%)    = (Encrypted at Rest   ÷ Total Assets) × 100\nIn-Transit Coverage (%) = (Encrypted in Transit ÷ Total Assets) × 100\nOverall Coverage (%)    = (At-Rest Coverage + In-Transit Coverage) ÷ 2\n\nTotal Assets        — number of systems, services, or data stores in scope\nEncrypted at Rest   — assets with storage-layer encryption enabled\nEncrypted in Transit — assets communicating over encrypted channels (TLS/mTLS)',
  examplesTitle: 'Example Encryption Coverage Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Mid-size SaaS (50 assets)',
      body: 'Total assets: 50\nEncrypted at rest: 40   →  40 ÷ 50 × 100  =  80.0%\nEncrypted in transit: 45 → 45 ÷ 50 × 100  =  90.0%\n                                              ─────────────\nOverall coverage: (80.0 + 90.0) ÷ 2  =  85.0%\nGap: 10 assets not encrypted at rest → prioritise storage remediation.',
    },
    {
      title: 'Example 2 — IoT fleet (200 devices)',
      body: 'Total devices: 200\nEncrypted at rest (secure element): 120  →  60.0%\nEncrypted in transit (TLS):         160  →  80.0%\n                                          ─────────────\nOverall coverage: (60.0 + 80.0) ÷ 2  =  70.0%\n80 devices lack at-rest encryption — flag for firmware update before CRA audit.',
    },
    {
      title: 'Example 3 — Enterprise microservices (120 services)',
      body: 'Total services: 120\nEncrypted at rest (KMS-managed): 114  →  95.0%\nEncrypted in transit (mTLS mesh):  108  →  90.0%\n                                          ─────────────\nOverall coverage: (95.0 + 90.0) ÷ 2  =  92.5%\nRemaining 6 at-rest gaps are legacy batch jobs — schedule migration to meet 100% target.',
    },
  ],
  tipsTitle: 'Tips to Improve Encryption Coverage',
  tips: [
    'Use your cloud provider\'s default encryption settings — AWS S3, GCP Cloud Storage, and Azure Blob all support server-side encryption with a single toggle. Enable it at the account level so new buckets are encrypted automatically.',
    'Enforce TLS 1.2 minimum at the load balancer or API gateway rather than per-service. One policy change can close in-transit gaps across dozens of services simultaneously.',
    'Scan for encryption gaps with infrastructure-as-code tools: tfsec, Checkov, or AWS Config rules flag unencrypted resources before they reach production.',
    'Rotate encryption keys on a schedule. Coverage percentage measures whether encryption is <em>present</em>, not whether keys are <em>fresh</em>. Key rotation is a separate control that also affects your compliance posture.',
    'Include encryption status in your asset inventory (CMDB or SBOM). Without a machine-readable record, recalculating coverage each quarter becomes manual and error-prone.',
    'For IoT and embedded devices, check whether secure boot and encrypted storage are enabled at the firmware level — hardware encryption is often available but disabled by default.',
  ],
  faq: [
    {
      question: 'What counts as "encryption at rest"?',
      answer: 'Any storage-layer encryption that protects data when it is not being processed counts: AES-256 disk encryption (LUKS, BitLocker), database transparent data encryption (TDE), object-storage server-side encryption (SSE-S3, SSE-KMS), and hardware secure elements. Application-level encryption (encrypting before writing) also qualifies. The key test: if the physical media is stolen, is the data unreadable without the key?',
    },
    {
      question: 'What counts as "encryption in transit"?',
      answer: 'Any channel-level encryption that protects data while it moves between systems: TLS 1.2 or 1.3 for HTTP/gRPC/database connections, mTLS for service-to-service communication, IPsec or WireGuard for network tunnels, and SSH for remote access. Unencrypted HTTP, plain-text database connections, or legacy protocols like FTP are gaps. For IoT, DTLS over UDP or MQTT with TLS counts.',
    },
    {
      question: 'What encryption coverage percentage do compliance frameworks require?',
      answer: 'Most frameworks — SOC 2 Type II, ISO 27001, PCI DSS, and the EU Cyber Resilience Act — require 100% encryption of data classified as sensitive or confidential. In practice, auditors accept documented exceptions with compensating controls. Aim for 100% on your sensitive-data assets first, then extend to all assets. A coverage below 80% will typically generate audit findings.',
    },
    {
      question: 'How is overall coverage calculated from at-rest and in-transit scores?',
      answer: 'Overall coverage is the simple average of at-rest and in-transit percentages: (at-rest % + in-transit %) ÷ 2. This gives equal weight to both dimensions. If your threat model treats one as higher risk — for example, in-transit is more exposed in a public-cloud environment — you can weight the average accordingly. Most compliance frameworks evaluate each dimension separately rather than using a combined score.',
    },
    {
      question: 'How often should I recalculate encryption coverage?',
      answer: 'Recalculate after any infrastructure change that adds, removes, or modifies assets: new service deployments, cloud account changes, IoT firmware updates, and database migrations. At minimum, run a full audit quarterly and before each compliance review. Automating the scan with IaC linters or CSPM tools (AWS Security Hub, Wiz, Orca) lets you track coverage continuously rather than as a point-in-time snapshot.',
    },
  ],
  relatedSlugs: [
    'encryption-overhead-calculator',
    'cra-compliance-score-calculator',
    'hash-collision-probability-calculator',
    'sbom-coverage-calculator',
  ],
};

export const encryptionCoverageCalculator: CalculatorDefinition = { meta, Component: EncryptionCoverageUI };
