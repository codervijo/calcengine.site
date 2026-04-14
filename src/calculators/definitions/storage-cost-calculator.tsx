import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function StorageCostUI() {
  const [storageGB, setStorageGB] = useState<string>('100');
  const [pricePerGB, setPricePerGB] = useState<string>('0.023');
  const [months, setMonths] = useState<string>('12');

  const gb = parseFloat(storageGB) || 0;
  const price = parseFloat(pricePerGB) || 0;
  const mo = parseFloat(months) || 0;

  const monthlyCost = gb * price;
  const totalCost = monthlyCost * mo;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Storage Cost</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Storage Size (GB)"
          type="number"
          value={storageGB}
          onChange={(e) => setStorageGB(e.target.value)}
          slotProps={{ htmlInput: { step: '1', min: '0' } }}
        />
        <TextField
          label="Price per GB / Month ($)"
          type="number"
          value={pricePerGB}
          onChange={(e) => setPricePerGB(e.target.value)}
          slotProps={{ htmlInput: { step: '0.001', min: '0' } }}
        />
        <TextField
          label="Duration (months)"
          type="number"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          slotProps={{ htmlInput: { step: '1', min: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Monthly Cost</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>${monthlyCost.toFixed(2)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
          Total Cost over {mo} month{mo !== 1 ? 's' : ''}
        </Typography>
        <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>${totalCost.toFixed(2)}</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'storage-cost-calculator',
  title: 'Storage Cost Calculator',
  shortTitle: 'Storage Cost',
  description: 'Use this storage cost calculator to estimate monthly and total cloud storage spend. Enter data size, price per GB, and duration for an instant result.',
  keywords: [
    'storage cost calculator',
    'cloud storage cost calculator',
    'aws s3 storage cost',
    'storage price per gb calculator',
    'monthly storage cost estimator',
    'object storage pricing calculator',
    'cloud storage pricing comparison',
    'data storage cost estimator',
  ],
  category: 'performance',
  icon: 'Storage',
  tagline: 'Estimate your monthly and total cloud or on-prem storage bill in seconds. Enter your data volume, price per GB, and how many months you need.',
  lastUpdated: 'April 2026',
  intro: 'A storage cost calculator helps you turn raw data volume and per-GB pricing into concrete dollar figures before you commit to a storage tier or architecture decision. Whether you\'re sizing an AWS S3 bucket, Azure Blob container, Google Cloud Storage bucket, or on-premises SAN, the underlying arithmetic is always the same: gigabytes × price per GB per month × duration.\n\nEngineers and architects use this calculator when evaluating storage tiers, negotiating cloud contracts, or building a cost model for a new data pipeline. Knowing that 10 TB at the standard S3 rate costs roughly $230/month — and $2,760/year — makes the decision to adopt Intelligent-Tiering or move cold data to Glacier concrete rather than theoretical.\n\nStorage costs compound silently. A dataset that seems cheap at launch can become a significant line item once it grows and once egress, retrieval, and replication fees are added. Use this calculator alongside actual pricing pages to build a full picture before signing off on a design.\n\nThe formula works for any storage product priced per GB per month: AWS S3, Azure Blob, Google Cloud Storage, Cloudflare R2, Backblaze B2, and on-premises estimates based on amortised hardware cost.',
  howItWorksTitle: 'How to Calculate Storage Cost',
  howItWorksImage: '/images/calculators/storage-cost-calculator-how-it-works.svg',
  howItWorks: '1. Determine your data volume in gigabytes (GB). Convert TB → GB by multiplying by 1,024.\n2. Find the storage price per GB per month for your chosen tier on the provider\'s pricing page.\n3. Decide your retention period in months (e.g. 12 months = 1 year).\n4. Multiply storage (GB) by price per GB to get monthly cost.\n5. Multiply monthly cost by duration in months to get total cost.\n6. Add egress, retrieval, and replication fees separately — they are not included in the per-GB storage rate.',
  formula: 'Monthly Cost = Storage (GB) × Price per GB per Month\nTotal Cost   = Monthly Cost × Duration (months)\n\nStorage (GB)           — size of your dataset in gigabytes (1 TB = 1,024 GB)\nPrice per GB per Month — the storage rate charged by your provider per GB\nDuration (months)      — how many months the data will be retained\n\nNote: egress, PUT/GET request fees, and replication are billed separately.',
  examplesTitle: 'Example Storage Cost Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — AWS S3 Standard (100 GB for 1 year)',
      body: 'Storage:  100 GB  ×  $0.023 / GB / month  =  $2.30 / month\nDuration: 12 months\n                                               ─────────────\nTotal: $2.30 × 12  =  $27.60 / year\n\nAt 1 TB (1,024 GB): $23.55 / month  →  $282.62 / year',
    },
    {
      title: 'Example 2 — Backblaze B2 (5 TB cold data archive, 24 months)',
      body: 'Storage:  5,120 GB  ×  $0.006 / GB / month  =  $30.72 / month\nDuration: 24 months\n                                                  ─────────────\nTotal: $30.72 × 24  =  $737.28 over 2 years\n\nVs. AWS S3 Standard at same volume: $117.76/month  →  $2,826.24 over 2 years\nSavings with B2: ~$2,089 over 2 years (74% cheaper)',
    },
    {
      title: 'Example 3 — On-premises SSD (500 GB NVMe, amortised over 36 months)',
      body: 'Hardware cost: $300 for 500 GB SSD\nAmortised price per GB per month: $300 ÷ 500 GB ÷ 36 months  =  $0.0167 / GB / month\n\nMonthly cost equivalent: 500 GB × $0.0167  =  $8.33 / month\nTotal over 3 years: $300 (hardware cost, no ongoing fee)\n\nCloud equivalent (AWS S3 Standard): $11.52 / month  →  $414.72 over 36 months\nOn-prem saves: ~$115 over 3 years before power and maintenance',
    },
  ],
  tipsTitle: 'Tips to Reduce Storage Costs',
  tips: [
    'Use lifecycle policies to automatically move data to cheaper tiers. On AWS, S3 Intelligent-Tiering moves infrequently accessed objects to lower-cost storage with no retrieval fee — it pays for itself above ~128 KB object sizes.',
    'Compress before storing. Gzip or Zstandard compression typically achieves 3–10× size reduction on text, JSON, and log data, cutting your storage bill by the same factor.',
    'Delete what you don\'t need. Orphaned snapshots, old build artefacts, and superseded backups are common sources of silent storage bloat. Audit monthly with cost explorer or storage lens.',
    'Watch egress fees — they are often larger than storage fees. Storing 1 TB on S3 costs ~$23/month; retrieving it all costs ~$92 in outbound data transfer. Design for read locality.',
    'Consider Cloudflare R2 or Backblaze B2 for large static assets. Both offer zero egress fees and per-GB rates 3–4× cheaper than AWS S3 Standard for most workloads.',
    'For backups, compare S3 Glacier Instant Retrieval ($0.004/GB/mo) vs Glacier Deep Archive ($0.00099/GB/mo) — Deep Archive costs 23× less than Standard but has 12-hour retrieval time.',
  ],
  faq: [
    {
      question: 'How much does 1 TB of cloud storage cost per month?',
      answer: '1 TB equals 1,024 GB. At AWS S3 Standard pricing of $0.023/GB/month, that is approximately $23.55/month. Azure Blob Hot tier runs about $18.43/month for 1 TB, and Google Cloud Storage Standard costs roughly $20.48/month. Backblaze B2 is the cheapest major option at ~$6.14/month for 1 TB with zero egress fees.',
    },
    {
      question: 'What is the cheapest cloud storage for large datasets?',
      answer: 'Backblaze B2 ($0.006/GB/month) and Cloudflare R2 ($0.015/GB/month with zero egress) are the most cost-effective for large datasets. AWS S3 Glacier Deep Archive ($0.00099/GB/month) is cheaper still but only suitable for cold archival data with 12-hour retrieval SLA. For warm data with frequent reads, Cloudflare R2 wins on total cost once egress is factored in.',
    },
    {
      question: 'How do I convert TB to GB for this calculator?',
      answer: 'Multiply terabytes by 1,024 to get gigabytes. 1 TB = 1,024 GB, 5 TB = 5,120 GB, 10 TB = 10,240 GB. Storage providers bill at the GB level, so always convert before estimating. Note that storage vendors sometimes use decimal TB (1 TB = 1,000 GB) while operating systems report binary GiB — this 2.4% difference can cause billing surprises.',
    },
    {
      question: 'Does this calculator include egress or request fees?',
      answer: 'No — this calculator covers the storage fee only (GB stored × rate × time). Egress (outbound data transfer), PUT/GET/LIST request fees, and cross-region replication are all billed separately by cloud providers. For a complete cost model, add those estimates on top. Egress fees on AWS can easily exceed the storage fee itself for read-heavy workloads.',
    },
    {
      question: 'How do I estimate storage costs for a growing dataset?',
      answer: 'Calculate the average size over the retention period. If your dataset grows from 100 GB to 300 GB over 12 months, the average is roughly 200 GB/month. Multiply that average by your per-GB rate and by 12. For more precision, project growth month by month and sum the costs. This calculator handles a fixed size — use a spreadsheet for growth projections.',
    },
  ],
  relatedSlugs: ['bandwidth-cost-calculator', 'throughput-calculator', 'openai-cost-calculator'],
};

export const storageCostCalculator: CalculatorDefinition = { meta, Component: StorageCostUI };
