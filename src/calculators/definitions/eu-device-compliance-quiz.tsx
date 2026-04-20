import { useState } from 'react';
import { Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

const QUESTIONS: { id: string; label: string; regulation: string }[] = [
  { id: 'q1', label: 'Is your device CE marked?', regulation: 'CE Marking / Radio Equipment Directive (RED)' },
  { id: 'q2', label: 'Do you have a documented vulnerability disclosure policy?', regulation: 'CRA Article 13 — mandatory public disclosure process' },
  { id: 'q3', label: 'Does your device include a Software Bill of Materials (SBOM)?', regulation: 'CRA Article 13(3) — software component inventory' },
  { id: 'q4', label: 'Are critical security patches released within 24 hours of CVE disclosure?', regulation: 'CRA Annex I — timely security update requirement' },
  { id: 'q5', label: 'Does your device use encrypted communications (TLS 1.2+ or DTLS)?', regulation: 'CRA Annex I — security-by-design, data in transit' },
  { id: 'q6', label: 'Do you follow a documented secure development lifecycle (SDLC)?', regulation: 'CRA Article 13 — secure development process' },
];

function EuDeviceComplianceQuizUI() {
  const [q1, setQ1] = useState<string>('');
  const [q2, setQ2] = useState<string>('');
  const [q3, setQ3] = useState<string>('');
  const [q4, setQ4] = useState<string>('');
  const [q5, setQ5] = useState<string>('');
  const [q6, setQ6] = useState<string>('');

  const answers: Record<string, string> = { q1, q2, q3, q4, q5, q6 };
  const setters: Record<string, (v: string) => void> = {
    q1: setQ1, q2: setQ2, q3: setQ3, q4: setQ4, q5: setQ5, q6: setQ6,
  };

  const answered = Object.values(answers).filter((v) => v !== '').length;
  const yesCount = Object.values(answers).filter((v) => v === 'yes').length;
  const score = answered === QUESTIONS.length ? Math.round((yesCount / QUESTIONS.length) * 100) : 0;

  const resultLabel =
    answered < QUESTIONS.length
      ? `${answered} of ${QUESTIONS.length} questions answered`
      : score >= 84
      ? 'High Readiness'
      : score >= 50
      ? 'Partial Readiness — gaps to address'
      : 'Low Readiness — action required';

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">EU Device Compliance Quiz</Typography>
      {QUESTIONS.map((q) => (
        <Box key={q.id}>
          <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500 }}>{q.label}</Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>{q.regulation}</Typography>
          <Stack direction="row" spacing={1}>
            {(['yes', 'no'] as const).map((option) => (
              <Box
                key={option}
                onClick={() => setters[q.id](option)}
                sx={{
                  px: 3, py: 0.75, borderRadius: 1, cursor: 'pointer',
                  border: '1.5px solid',
                  borderColor: answers[q.id] === option ? 'primary.main' : 'divider',
                  bgcolor: answers[q.id] === option ? 'primary.main' : 'background.paper',
                  color: answers[q.id] === option ? 'primary.contrastText' : 'text.primary',
                  fontWeight: 600, fontSize: '0.875rem', userSelect: 'none',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                }}
              >
                {option}
              </Box>
            ))}
          </Stack>
        </Box>
      ))}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Compliance Readiness Score</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>
          {answered === QUESTIONS.length ? `${score}%` : `${answered} / ${QUESTIONS.length}`}
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5, opacity: 0.9 }}>{resultLabel}</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'eu-device-compliance-quiz',
  title: 'EU Device Compliance Quiz',
  shortTitle: 'EU Compliance Quiz',
  description: 'Use this EU device compliance quiz to check whether your IoT or connected device meets Cyber Resilience Act, RED, and CE marking requirements — no sign-up',
  keywords: [
    'eu device compliance quiz',
    'eu cyber resilience act compliance checker',
    'iot device eu compliance',
    'ce marking compliance quiz',
    'cra compliance checklist',
    'eu product compliance test',
    'connected device eu regulations quiz',
  ],
  category: 'general',
  icon: 'FactCheck',
  tagline: 'Answer 6 yes/no questions and instantly see your EU device compliance readiness score. Covers CE marking, Cyber Resilience Act (CRA), and the key security controls required for EU market entry.',
  lastUpdated: 'April 2026',
  intro: 'The EU device compliance quiz helps hardware manufacturers, IoT engineers, and product managers quickly assess whether a connected device meets the core requirements of EU regulations — including the Cyber Resilience Act (CRA), Radio Equipment Directive (RED), and CE marking obligations — before committing to costly conformity assessments.\n\nThe EU Cyber Resilience Act entered into force on 11 December 2024 and sets mandatory cybersecurity requirements for all products with digital elements sold in the European Union. It applies to any manufacturer targeting EU consumers, regardless of where the company is headquartered. Non-compliance risks fines of up to €15 million or 2.5% of global annual turnover, plus market withdrawal orders.\n\nThis quiz evaluates six core control areas that regulators and notified bodies consistently examine: CE marking status, vulnerability disclosure policy, software bill of materials (SBOM), patch timeliness, encrypted communications, and a documented secure development lifecycle. The scoring model is deliberately binary — each control either exists or it does not — reflecting how auditors assess initial compliance readiness.\n\nUse the quiz result to identify which gaps to close before formal conformity assessment. A score below 50% signals that foundational work is needed. A score above 83% suggests the device is well-positioned for a smooth conformity assessment process.',
  howItWorksTitle: 'How the EU Device Compliance Quiz Scores Your Device',
  howItWorksImage: '/images/calculators/eu-device-compliance-quiz-how-it-works.svg',
  howItWorks: '1. Answer each of the 6 yes/no questions covering the core EU compliance control areas.\n2. Each question maps to a specific EU regulation: CE Marking/RED, CRA Article 13, CRA Article 13(3), or CRA Annex I.\n3. Your score is calculated as (number of "Yes" answers ÷ 6) × 100.\n4. A score of 84%+ signals High Readiness; 50–83% indicates Partial Readiness with addressable gaps.\n5. Review the regulation reference shown under each question to identify which EU law mandates that control.\n6. Use the result to prioritise remediation before submitting your device for formal conformity assessment.',
  formula: 'Compliance Score = (Controls Passed / Total Controls) × 100\n\nControls assessed (6 total, each weighted equally):\n  CE Marking           — required for EU market access (all device categories)\n  Vulnerability Policy — CRA Article 13: public vulnerability disclosure process\n  SBOM                 — CRA Article 13(3): software component inventory\n  Patch Timeliness     — CRA Annex I: critical CVEs patched within 24 hours\n  Encrypted Comms      — CRA Annex I: security-by-design, data in transit\n  Secure SDLC          — CRA Article 13: documented development security process\n\nScore Tiers:\n  ≥ 84% (5–6 controls)  → High Readiness\n  50–83% (3–4 controls) → Partial Readiness — gaps to address\n  < 50% (0–2 controls)  → Low Readiness — remediation required before EU market entry',
  examplesTitle: 'Example EU Device Compliance Quiz Results',
  example: '',
  examples: [
    {
      title: 'Example 1 — Well-prepared IoT manufacturer (6 / 6)',
      body: 'CE Marking:           Yes → required for EU market ✓\nVulnerability Policy: Yes → CRA Art. 13 satisfied ✓\nSBOM:                 Yes → CRA Art. 13(3) satisfied ✓\nPatch Timeliness:     Yes → CRA Annex I satisfied ✓\nEncrypted Comms:      Yes → CRA Annex I satisfied ✓\nSecure SDLC:          Yes → CRA Art. 13 satisfied ✓\n──────────────────────────────────────────\nScore: (6 / 6) × 100 = 100%  →  High Readiness',
    },
    {
      title: 'Example 2 — Mid-tier device maker with SBOM and patching gaps (4 / 6)',
      body: 'CE Marking:           Yes ✓\nVulnerability Policy: Yes ✓\nSBOM:                 No  ← gap (CRA Art. 13(3))\nPatch Timeliness:     No  ← gap (CRA Annex I)\nEncrypted Comms:      Yes ✓\nSecure SDLC:          Yes ✓\n──────────────────────────────────────────\nScore: (4 / 6) × 100 = 67%  →  Partial Readiness\nPriority actions: implement SBOM generation in CI/CD and formalise 24-hour patch SLA',
    },
    {
      title: 'Example 3 — Entry-level connected device, non-compliant (2 / 6)',
      body: 'CE Marking:           Yes ✓\nVulnerability Policy: No  ← gap (CRA Art. 13)\nSBOM:                 No  ← gap (CRA Art. 13(3))\nPatch Timeliness:     No  ← gap (CRA Annex I)\nEncrypted Comms:      No  ← gap (CRA Annex I)\nSecure SDLC:          Yes ✓\n──────────────────────────────────────────\nScore: (2 / 6) × 100 = 33%  →  Low Readiness\n4 critical gaps must be closed before EU market entry; formal assessment will fail',
    },
  ],
  tipsTitle: 'Tips to Pass the EU Device Compliance Quiz',
  tips: [
    'Start with CE marking — without it, your device cannot legally enter the EU market regardless of your CRA readiness score.',
    'Draft your vulnerability disclosure policy before starting conformity assessment — regulators treat its absence as a critical blocker. A public security.txt file and a dedicated security@ inbox is a minimal viable starting point.',
    'Generate your SBOM during the build process using tools like <a href="https://cyclonedx.org" target="_blank" rel="noopener">CycloneDX</a> or SPDX so the inventory stays current with every firmware release automatically.',
    'Set your patch release SLA to 24 hours for critical CVEs — document this SLA in your vulnerability response policy so auditors can verify it. Use the <a href="/calculators/vulnerability-response-time-calculator">Vulnerability Response Time Calculator</a> to model your response window.',
    'Mandate TLS 1.2+ for all device-to-cloud and device-to-app communications — plaintext protocols are a direct CRA Annex I violation and one of the most common audit failures.',
    'Document your SDLC in a Security Development Process policy; a concise one-page document referencing threat modelling, code review, and penetration testing cadences is sufficient to satisfy CRA Article 13.',
  ],
  faq: [
    {
      question: 'What is the EU Cyber Resilience Act and who does it apply to?',
      answer: 'The Cyber Resilience Act (CRA) is an EU regulation mandating cybersecurity requirements for all "products with digital elements" — connected devices, software, and IoT products sold in the EU. It applies to any manufacturer targeting EU consumers, regardless of where the company is based. The CRA entered into force in December 2024 with a 36-month transition period ending in late 2027.',
    },
    {
      question: 'What happens if my device fails this EU device compliance quiz?',
      answer: 'A low score indicates compliance gaps that must be resolved before lawful EU market entry. Missing CE marking blocks legal sales entirely. Missing CRA controls — such as an SBOM, vulnerability policy, or patch process — can trigger fines up to €15 million or 2.5% of global annual revenue, plus mandatory market withdrawal. Use the quiz result to prioritise remediation with your engineering and legal teams before conformity assessment.',
    },
    {
      question: 'Is CE marking alone enough for full EU device compliance?',
      answer: 'No. CE marking covers electromagnetic compatibility and safety under directives like RED and the Low Voltage Directive, but not cybersecurity. The CRA adds mandatory security requirements on top of CE marking obligations. From late 2027, all connected devices sold in the EU need both CE marking and CRA conformity. Use the <a href="/calculators/cra-compliance-score-calculator">CRA Compliance Score Calculator</a> to measure your CRA-specific readiness in more depth.',
    },
    {
      question: 'What is a Software Bill of Materials (SBOM) and why does the EU require it?',
      answer: 'An SBOM is an inventory of all software components, libraries, and dependencies in your device firmware. CRA Article 13(3) requires manufacturers to produce and maintain an SBOM. It enables rapid impact assessment when a new CVE is disclosed — you can immediately check whether your product is affected. Tools like CycloneDX and SPDX generate SBOMs from your build pipeline automatically at low cost.',
    },
    {
      question: 'By when must EU devices comply with the Cyber Resilience Act?',
      answer: 'The CRA entered into force on 11 December 2024. Manufacturers have a 36-month transition period, meaning full compliance is required by December 2027. Vulnerability and incident reporting obligations apply from December 2026. Devices placed on the EU market after these deadlines without CRA compliance risk market withdrawal and penalties. Use the <a href="/calculators/device-lifecycle-compliance-calculator">Device Lifecycle Compliance Calculator</a> to plan your compliance timeline.',
    },
  ],
  relatedSlugs: ['cra-compliance-score-calculator', 'ota-compliance-checker', 'device-lifecycle-compliance-calculator'],
};

export const euDeviceComplianceQuizCalculator: CalculatorDefinition = { meta, Component: EuDeviceComplianceQuizUI };
