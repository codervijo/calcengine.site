import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function LambdaCostUI() {
  const [memoryMb, setMemoryMb] = useState<string>('512');
  const [durationMs, setDurationMs] = useState<string>('200');
  const [invocations, setInvocations] = useState<string>('1000000');
  const [pricePerGbSecond, setPricePerGbSecond] = useState<string>('0.0000166667');
  const [pricePerMReq, setPricePerMReq] = useState<string>('0.20');

  const mem = parseFloat(memoryMb) || 0;
  const dur = parseFloat(durationMs) || 0;
  const inv = parseFloat(invocations) || 0;
  const gbSecRate = parseFloat(pricePerGbSecond) || 0;
  const reqRate = parseFloat(pricePerMReq) || 0;

  const gbSeconds = (mem / 1024) * (dur / 1000) * inv;
  const executionCost = gbSeconds * gbSecRate;
  const requestCost = (inv / 1_000_000) * reqRate;
  const totalCost = executionCost + requestCost;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Lambda Cost</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Memory (MB)" type="number" value={memoryMb} onChange={(e) => setMemoryMb(e.target.value)} slotProps={{ htmlInput: { step: '64', min: '128' } }} />
        <TextField label="Duration (ms)" type="number" value={durationMs} onChange={(e) => setDurationMs(e.target.value)} slotProps={{ htmlInput: { step: '1', min: '1' } }} />
        <TextField label="Monthly Invocations" type="number" value={invocations} onChange={(e) => setInvocations(e.target.value)} slotProps={{ htmlInput: { step: '1000', min: '0' } }} />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Price per GB-second ($)" type="number" value={pricePerGbSecond} onChange={(e) => setPricePerGbSecond(e.target.value)} slotProps={{ htmlInput: { step: '0.0000000001' } }} />
        <TextField label="Price per 1M Requests ($)" type="number" value={pricePerMReq} onChange={(e) => setPricePerMReq(e.target.value)} slotProps={{ htmlInput: { step: '0.01' } }} />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated Monthly Cost</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>${totalCost.toFixed(4)}</Typography>
        <Stack direction="row" justifyContent="center" spacing={4} sx={{ mt: 1, opacity: 0.85 }}>
          <Typography variant="body2">Compute: ${executionCost.toFixed(4)}</Typography>
          <Typography variant="body2">Requests: ${requestCost.toFixed(4)}</Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'lambda-cost-calculator',
  title: 'Lambda Cost Calculator',
  shortTitle: 'Lambda Cost',
  description: 'Calculate AWS Lambda monthly costs by memory, duration, and invocations. Estimate execution and request charges instantly — no sign-up required.',
  keywords: ['lambda cost calculator', 'aws lambda pricing calculator', 'lambda cost estimator', 'serverless cost calculator', 'aws lambda monthly cost', 'lambda gb-second calculator', 'lambda invocation cost'],
  category: 'performance',
  icon: 'AttachMoney',
  tagline: 'Enter your Lambda function\'s memory, average duration, and monthly invocation count to get an instant cost breakdown. Works with AWS Lambda and any provider using GB-second billing.',
  lastUpdated: 'April 2026',
  intro: 'The lambda cost calculator helps you estimate AWS Lambda charges before they appear on your bill. Lambda pricing has two components: a compute charge based on GB-seconds (memory × duration) and a flat per-request charge — and both compound quickly at scale.\n\nEngineers commonly underestimate Lambda costs because the GB-second unit is unintuitive. A 1 GB function running for 1 second costs $0.0000166667 in compute. Run it a million times and that\'s $16.67 — plus $0.20 in request charges. Double the memory allocation and costs double too, even if execution time halves.\n\nThis calculator is useful when right-sizing memory, comparing cold-start trade-offs, budgeting a new event-driven architecture, or auditing an unexpectedly large cloud bill. It applies equally to AWS Lambda, Google Cloud Functions, and Azure Functions — just substitute the provider\'s GB-second and per-request rates.\n\nThe AWS free tier covers 400,000 GB-seconds and 1 million requests per month. Adjust the rates to $0 to see your effective cost within the free tier window.',
  howItWorksTitle: 'How to Calculate Lambda Cost',
  howItWorksImage: '/images/calculators/lambda-cost-calculator-how-it-works.svg',
  howItWorks: '1. Measure or estimate your function\'s average execution duration in milliseconds using CloudWatch Logs or the Lambda console.\n2. Note your configured memory allocation in MB — this also determines CPU proportionally.\n3. Find your monthly invocation count from CloudWatch metrics or an APM tool.\n4. Compute GB-seconds: (memory MB ÷ 1024) × (duration ms ÷ 1000) × invocations.\n5. Multiply GB-seconds by the per-GB-second rate ($0.0000166667 for AWS) to get execution cost.\n6. Add request cost: (invocations ÷ 1,000,000) × $0.20 for the total monthly charge.',
  formula: 'GB-Seconds     = (Memory MB ÷ 1,024) × (Duration ms ÷ 1,000) × Invocations\nExecution Cost = GB-Seconds × Price per GB-second\nRequest Cost   = (Invocations ÷ 1,000,000) × Price per 1M requests\nTotal Cost     = Execution Cost + Request Cost\n\nMemory MB            — configured function memory (128–10,240 MB)\nDuration ms          — average measured execution time in milliseconds\nInvocations          — total monthly function invocations\nPrice per GB-second  — $0.0000166667 for AWS Lambda (us-east-1)\nPrice per 1M requests — $0.20 for AWS Lambda',
  examplesTitle: 'Example Lambda Cost Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Lightweight API handler (512 MB, 50 ms)',
      body: 'Memory:    512 MB  →  0.5 GB\nDuration:   50 ms  →  0.050 s\nInvocations: 5,000,000 / month\n\nGB-seconds:  0.5 × 0.050 × 5,000,000  =  125,000\nExecution:   125,000 × $0.0000166667  =  $2.0833\nRequests:    5 × $0.20               =  $1.00\n                                        ─────────────\nTotal: $3.08 / month',
    },
    {
      title: 'Example 2 — Image processing job (1024 MB, 800 ms)',
      body: 'Memory:   1,024 MB  →  1.0 GB\nDuration:   800 ms  →  0.800 s\nInvocations: 500,000 / month\n\nGB-seconds:  1.0 × 0.800 × 500,000  =  400,000\nExecution:   400,000 × $0.0000166667  =  $6.6667\nRequests:    0.5 × $0.20             =  $0.10\n                                        ─────────────\nTotal: $6.77 / month',
    },
    {
      title: 'Example 3 — ML inference function (3008 MB, 2000 ms)',
      body: 'Memory:   3,008 MB  →  2.9375 GB\nDuration: 2,000 ms  →  2.000 s\nInvocations: 100,000 / month\n\nGB-seconds:  2.9375 × 2.000 × 100,000  =  587,500\nExecution:   587,500 × $0.0000166667   =  $9.7917\nRequests:    0.1 × $0.20               =  $0.02\n                                        ─────────────\nTotal: $9.81 / month',
    },
  ],
  pricingTableTitle: 'AWS Lambda Pricing Reference',
  pricingTable: [
    { model: 'x86_64 Compute',       inputPer1M: '$0.0000166667 / GB-s', outputPer1M: '—',     notes: 'Standard architecture (us-east-1)' },
    { model: 'arm64 Compute (Graviton)', inputPer1M: '$0.0000133334 / GB-s', outputPer1M: '—', notes: '20% cheaper, same performance tier' },
    { model: 'Requests',             inputPer1M: '$0.20 / 1M req',       outputPer1M: '—',     notes: 'Applied to all invocations' },
    { model: 'Free Tier (monthly)',   inputPer1M: '400,000 GB-s',         outputPer1M: '—',     notes: '+ 1M requests, does not expire' },
    { model: 'Provisioned Concurrency', inputPer1M: '$0.0000097222 / GB-s', outputPer1M: '—',  notes: 'Eliminates cold starts; charged while allocated' },
  ],
  tipsTitle: 'Tips to Reduce Lambda Costs',
  tips: [
    'Switch to arm64 (Graviton2) architecture — it costs 20% less per GB-second with comparable throughput. A one-line change in your function configuration.',
    'Right-size memory with AWS Lambda Power Tuning. The open-source Step Functions workflow runs your function at every memory tier and returns the cost-optimal setting automatically.',
    'Reduce duration by warming up SDK clients and DB connections outside the handler. Connections initialised in the module scope persist across warm invocations and avoid re-initialisation cost.',
    'Use the AWS Free Tier: 400,000 GB-seconds and 1 million requests per month never expire. For low-traffic functions, you may never pay anything at all.',
    'Batch SQS, SNS, and Kinesis triggers to process multiple records per invocation instead of one. Fewer invocations means lower request charges at the same throughput.',
    'Set reserved concurrency limits to cap runaway costs if a bug causes an unexpected invocation spike. Pair with CloudWatch billing alarms for early warning.',
  ],
  faq: [
    {
      question: 'How is AWS Lambda cost calculated?',
      answer: 'Lambda charges on two dimensions: compute (GB-seconds) and requests. Compute cost equals (memory in GB) × (duration in seconds) × (invocation count) × $0.0000166667. Request cost is (invocations ÷ 1,000,000) × $0.20. Add both together for your monthly bill. The free tier covers 400,000 GB-seconds and 1 million requests monthly and never expires.',
    },
    {
      question: 'Does increasing Lambda memory always increase cost?',
      answer: 'Not necessarily. More memory also means more CPU, which can shorten execution time proportionally or better. If doubling memory halves execution time, the GB-second product stays flat and cost is unchanged. Tools like AWS Lambda Power Tuning find the memory setting where cost is minimised — often a higher memory tier than you\'d expect. Use the <a href="/calculators/lambda-cost-calculator">Lambda Cost Calculator</a> to model different configurations.',
    },
    {
      question: 'What is a GB-second in Lambda pricing?',
      answer: 'A GB-second is the unit of compute: 1 GB of memory allocated for 1 second of execution. A 512 MB function running for 2 seconds consumes 1 GB-second (0.5 GB × 2 s). AWS charges $0.0000166667 per GB-second. Graviton (arm64) functions cost $0.0000133334 per GB-second — 20% less for the same workload.',
    },
    {
      question: 'How do I reduce Lambda cold start latency without raising cost?',
      answer: 'Move SDK client and database connection initialisation outside your handler function into the module scope. These objects persist across warm invocations at no extra charge. For latency-critical endpoints, provisioned concurrency eliminates cold starts entirely but adds a continuous allocation charge — weigh that against the latency requirement using the pricing table above.',
    },
    {
      question: 'Does this calculator work for Google Cloud Functions or Azure Functions?',
      answer: 'Yes — both use GB-second billing with a per-invocation charge. For Google Cloud Functions (2nd gen), substitute $0.00002400 per GB-second and $0.40 per million requests. For Azure Functions Consumption plan, use $0.000016 per GB-second and $0.20 per million executions. Plug those rates into the fields above and the result is accurate for your provider.',
    },
  ],
  relatedSlugs: ['cdn-cost-calculator', 'bandwidth-cost-calculator', 'storage-cost-calculator'],
};

export const lambdaCostCalculator: CalculatorDefinition = { meta, Component: LambdaCostUI };
