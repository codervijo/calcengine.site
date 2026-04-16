import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function LogStorageCostUI() {
  const [dailyVolume, setDailyVolume] = useState<string>('10');
  const [retentionDays, setRetentionDays] = useState<string>('30');
  const [compressionRatio, setCompressionRatio] = useState<string>('5');
  const [pricePerGB, setPricePerGB] = useState<string>('0.023');

  const vol = parseFloat(dailyVolume) || 0;
  const ret = parseFloat(retentionDays) || 0;
  const comp = Math.max(parseFloat(compressionRatio) || 1, 0.01);
  const price = parseFloat(pricePerGB) || 0;

  const rawStorageGB = vol * ret;
  const compressedGB = rawStorageGB / comp;
  const monthlyCost = compressedGB * price;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Log Storage Cost</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Daily Log Volume (GB/day)"
          type="number"
          value={dailyVolume}
          onChange={(e) => setDailyVolume(e.target.value)}
          slotProps={{ htmlInput: { step: '0.1', min: '0' } }}
        />
        <TextField
          label="Retention Period (days)"
          type="number"
          value={retentionDays}
          onChange={(e) => setRetentionDays(e.target.value)}
          slotProps={{ htmlInput: { step: '1', min: '1' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Compression Ratio (e.g. 5 for 5:1)"
          type="number"
          value={compressionRatio}
          onChange={(e) => setCompressionRatio(e.target.value)}
          slotProps={{ htmlInput: { step: '0.5', min: '1' } }}
        />
        <TextField
          label="Storage Price ($/GB/month)"
          type="number"
          value={pricePerGB}
          onChange={(e) => setPricePerGB(e.target.value)}
          slotProps={{ htmlInput: { step: '0.001', min: '0' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">Raw Storage</Typography>
          <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>{rawStorageGB.toFixed(1)} GB</Typography>
        </Box>
        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">Compressed Storage</Typography>
          <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>{compressedGB.toFixed(1)} GB</Typography>
        </Box>
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated Monthly Storage Cost</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>${monthlyCost.toFixed(2)}</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'log-storage-cost-calculator',
  title: 'Log Storage Cost Calculator',
  shortTitle: 'Log Storage Cost',
  description: 'Calculate log storage cost by daily volume, retention, and compression ratio. Estimate monthly spend for S3, GCS, or any object storage — no sign-up needed.',
  keywords: [
    'log storage cost calculator',
    'log retention cost estimator',
    'logging storage pricing',
    'elasticsearch log storage cost',
    'cloudwatch logs cost calculator',
    's3 log storage cost',
    'log management cost estimator',
    'observability storage budget',
  ],
  category: 'performance',
  icon: 'Storage',
  tagline: 'Enter your daily log volume, retention window, and compression ratio to get an instant monthly storage cost estimate. Works with S3, GCS, Azure Blob, Elasticsearch, and any GB-priced store.',
  lastUpdated: 'April 2026',
  intro: 'The log storage cost calculator helps you model the real price of retaining application logs before your bill arrives. Log data compounds quickly — a modest 10 GB/day pipeline becomes 300 GB of raw storage after 30 days, and most teams run multiple services at far higher volumes.\n\nWho uses this? Platform engineers sizing object storage for a centralised log aggregation pipeline, SREs deciding whether a 90-day retention policy is affordable, and FinOps practitioners auditing why the observability budget keeps ballooning. Plugging in your actual numbers takes 30 seconds and often surfaces surprising savings opportunities.\n\nCompression is the single biggest lever in this formula. Structured JSON logs typically compress 5:1 to 10:1 with gzip or zstd, meaning a 300 GB raw footprint can shrink to 30–60 GB. The calculator lets you model both the raw and compressed size side by side so the impact is immediately visible.\n\nStorage pricing varies by provider and tier: AWS S3 Standard charges ~$0.023/GB/month, S3 Infrequent Access ~$0.0125/GB/month, and GCS Nearline ~$0.010/GB/month. Use the price field to compare tiers or providers without leaving the page.',
  howItWorksTitle: 'How to Calculate Log Storage Cost',
  howItWorksImage: '/images/calculators/log-storage-cost-calculator-how-it-works.svg',
  howItWorks: '1. Measure your daily ingestion volume in GB. Check your log shipper metrics, S3 PUT bytes, or CloudWatch Logs ingestion stats.\n2. Set the retention period — how many days of logs you need to keep online for search or compliance.\n3. Multiply: Raw Storage (GB) = Daily Volume × Retention Days.\n4. Divide raw storage by your compression ratio to get the on-disk footprint. Structured JSON typically compresses 5:1 to 10:1 with gzip.\n5. Multiply compressed storage by your provider\'s per-GB/month price to get the monthly cost.',
  formula: 'Monthly Cost = (Daily Volume × Retention Days ÷ Compression Ratio) × $/GB/month\n\nDaily Volume     — uncompressed log bytes ingested per day (GB)\nRetention Days   — how long logs are kept (e.g. 30, 90, 365)\nCompression Ratio — gzip/zstd ratio; use 5 for typical JSON logs, 10 for verbose text\n$/GB/month       — storage unit price (S3 Standard ≈ $0.023, GCS Nearline ≈ $0.010)',
  examplesTitle: 'Example Log Storage Cost Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Small SaaS app on S3 Standard (30-day retention)',
      body: 'Daily volume:   5 GB/day  ×  30 days  =  150 GB raw\nCompression:    150 GB  ÷  5:1  =  30 GB on disk\nStorage price:  30 GB  ×  $0.023/GB/mo  =  $0.69/month\n────────────────────────────────────────────────────\nAnnual cost:  ~$8.28   (negligible — retention is the right concern here)',
    },
    {
      title: 'Example 2 — High-traffic microservices on S3 Standard (90-day retention)',
      body: 'Daily volume:   50 GB/day  ×  90 days  =  4,500 GB raw\nCompression:    4,500 GB  ÷  8:1  =  562.5 GB on disk\nStorage price:  562.5 GB  ×  $0.023/GB/mo  =  $12.94/month\n────────────────────────────────────────────────────\nSwitch to S3 IA ($0.0125): $7.03/month  →  saves ~$70/year',
    },
    {
      title: 'Example 3 — Enterprise compliance logging on GCS Nearline (365-day retention)',
      body: 'Daily volume:   200 GB/day  ×  365 days  =  73,000 GB raw\nCompression:    73,000 GB  ÷  6:1  =  12,167 GB on disk\nStorage price:  12,167 GB  ×  $0.010/GB/mo  =  $121.67/month\n────────────────────────────────────────────────────\nAnnual cost:  ~$1,460   (segment cold vs. hot logs to cut this further)',
    },
  ],
  tipsTitle: 'Tips to Reduce Log Storage Cost',
  tips: [
    'Use S3 Intelligent-Tiering or lifecycle rules to move logs older than 30 days to Infrequent Access automatically — typically cuts storage cost by 45% with no code changes.',
    'Apply structured logging (JSON) from day one. Structured logs compress 5–10× better than plaintext stack traces, and they also enable cheaper columnar storage formats like Parquet if you archive to a data lake.',
    'Sample debug and trace logs aggressively in production — keep 1–5% of TRACE-level events rather than 100%. ERROR and WARN logs should remain at 100% to preserve signal for incident investigation.',
    'Benchmark your compression ratio with real production logs before budgeting. Run <code>gzip -9 sample.log && ls -lh sample.log.gz</code> to get an accurate figure instead of guessing.',
    'Set per-service retention policies rather than a blanket window. Auth and payment logs may need 1 year for compliance; ephemeral worker logs rarely need more than 7 days.',
    'Archive cold logs to Glacier or GCS Archive ($0.004/GB/month) for compliance retention — it is 6× cheaper than Nearline and still meets most regulatory retrieval SLAs.',
  ],
  faq: [
    {
      question: 'How do I measure my current daily log volume?',
      answer: 'Check your log shipper dashboard (Fluentd, Logstash, Vector) for bytes-out per day. In AWS, open CloudWatch Logs → Log Groups and sum the "Stored bytes" delta over 24 hours. In S3, enable Storage Lens and filter on PUT request bytes. Most observability platforms (Datadog, Grafana Cloud) also show ingestion volume on the billing page.',
    },
    {
      question: 'What compression ratio should I use for JSON application logs?',
      answer: 'Structured JSON logs typically achieve 5:1 to 10:1 compression with gzip (level 6) or zstd. Verbose logs with long stack traces compress closer to 10:1. Short, dense logs with many unique IDs compress closer to 3:1. Run <code>gzip -9</code> on a representative 100 MB sample and measure the output size for the most accurate ratio for your workload.',
    },
    {
      question: 'How much does CloudWatch Logs storage cost vs S3?',
      answer: 'CloudWatch Logs charges $0.03/GB/month for storage — about 30% more than S3 Standard ($0.023/GB/month). For high-volume or long-retention workloads, exporting logs to S3 via a subscription filter can significantly reduce costs. Use the <a href="/calculators/storage-cost-calculator">Storage Cost Calculator</a> to compare tier pricing before committing to a pipeline.',
    },
    {
      question: 'Is it worth using a columnar format like Parquet for log archival?',
      answer: 'Yes, if you query archived logs with Athena, BigQuery, or Spark. Parquet with Snappy compression typically achieves 15:1 to 30:1 reduction on structured logs, and columnar scans read far less data per query. The trade-off is a conversion pipeline. For logs you only need to grep occasionally, compressed JSON on S3 IA is simpler and nearly as cheap.',
    },
    {
      question: 'How do retention policies affect compliance requirements?',
      answer: 'Compliance frameworks vary: PCI-DSS requires 12 months online and 3 years total; SOC 2 typically requires 1 year; GDPR may require deletion after a defined period. Separate compliance-relevant logs (auth, payment, admin actions) from noisy application logs and apply different retention tiers. See the <a href="/calculators/data-transfer-cost-calculator">Data Transfer Cost Calculator</a> to model restore costs when retrieving archived logs.',
    },
  ],
  relatedSlugs: ['storage-cost-calculator', 'bandwidth-cost-calculator', 'data-transfer-cost-calculator'],
};

export const logStorageCostCalculator: CalculatorDefinition = { meta, Component: LogStorageCostUI };
