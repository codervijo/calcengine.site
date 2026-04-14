import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function DataTransferCostUI() {
  const [dataGB, setDataGB] = useState<string>('100');
  const [pricePerGB, setPricePerGB] = useState<string>('0.09');
  const [freeTierGB, setFreeTierGB] = useState<string>('0');

  const volume = parseFloat(dataGB) || 0;
  const price = parseFloat(pricePerGB) || 0;
  const free = parseFloat(freeTierGB) || 0;

  const billableGB = Math.max(0, volume - free);
  const totalCost = billableGB * price;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Data Transfer Cost</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Data Volume (GB)"
          type="number"
          value={dataGB}
          onChange={(e) => setDataGB(e.target.value)}
          slotProps={{ htmlInput: { step: '1', min: '0' } }}
        />
        <TextField
          label="Price per GB ($)"
          type="number"
          value={pricePerGB}
          onChange={(e) => setPricePerGB(e.target.value)}
          slotProps={{ htmlInput: { step: '0.001', min: '0' } }}
        />
        <TextField
          label="Free Tier (GB)"
          type="number"
          value={freeTierGB}
          onChange={(e) => setFreeTierGB(e.target.value)}
          slotProps={{ htmlInput: { step: '1', min: '0' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          Billable: {billableGB.toFixed(2)} GB
        </Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>${totalCost.toFixed(4)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75 }}>Total Transfer Cost</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'data-transfer-cost-calculator',
  title: 'Data Transfer Cost Calculator',
  shortTitle: 'Transfer Cost',
  description: 'Calculate data transfer cost by provider with this free data transfer cost calculator. Enter volume, price per GB, and free tier to get instant egress estimates.',
  keywords: [
    'data transfer cost calculator',
    'egress cost calculator',
    'cloud data transfer pricing',
    'aws data transfer cost',
    'gcp egress cost',
    'bandwidth egress calculator',
    'cloud storage egress fees',
    'data transfer pricing estimator',
  ],
  category: 'performance',
  icon: 'CloudUpload',
  tagline: 'Estimate your cloud egress bill in seconds — enter your data volume, per-GB rate, and free tier allowance. Works for AWS, GCP, Azure, and any provider that charges per GB.',
  lastUpdated: 'April 2026',
  intro: 'A data transfer cost calculator helps engineers and architects predict the egress bill before it arrives. Cloud providers charge for data leaving their network (egress), and those costs add up fast — a single application serving 10 TB/month at $0.09/GB runs a $900 line item that rarely appears in initial budget estimates.\n\nThis calculator is built for backend engineers, DevOps teams, and cloud architects who need a quick sanity-check on transfer spend. Enter your monthly data volume in gigabytes, the provider\'s per-GB egress rate, and any free tier allowance — you\'ll see the billable volume and total cost instantly.\n\nEgress rates vary significantly across providers and tiers. AWS and Azure both charge $0.09/GB for the first 10 TB/month from most regions, dropping to $0.085/GB and lower at higher volumes. Google Cloud charges $0.08/GB for the first 1–10 TB. Traffic that stays within the same region or crosses from cloud to on-premises via a committed interconnect may be cheaper or free.\n\nUse this alongside the Bandwidth Cost Calculator when you need to separate sustained throughput costs from per-transfer billing — some providers charge on both dimensions depending on service tier.',
  howItWorksTitle: 'How to Calculate Data Transfer Cost',
  howItWorksImage: '/images/calculators/data-transfer-cost-calculator-how-it-works.svg',
  howItWorks: '1. Find your provider\'s egress rate per GB — check the networking or data transfer section of their pricing page.\n2. Identify your free tier: AWS offers 100 GB/month free from EC2, GCP offers 1 GB/month free.\n3. Enter your estimated monthly data volume in GB.\n4. The calculator subtracts the free tier from your total volume to get billable GB.\n5. Billable GB is multiplied by your per-GB rate to produce the total monthly transfer cost.',
  formula: 'Billable GB  = max(0, Data Volume GB − Free Tier GB)\nTotal Cost   = Billable GB × Price per GB\n\nData Volume GB — total egress in a billing period (gigabytes)\nFree Tier GB   — provider-supplied free allowance (e.g. 100 GB on AWS)\nPrice per GB   — egress rate in USD, e.g. $0.09 for AWS us-east-1',
  examplesTitle: 'Example Data Transfer Cost Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Small SaaS on AWS (us-east-1)',
      body: 'Volume:  500 GB/month\nFree:    100 GB  (AWS EC2 free tier)\nBillable: 400 GB  ×  $0.09/GB\n                    ─────────────\nMonthly cost: $36.00   →   $432.00/year',
    },
    {
      title: 'Example 2 — Video streaming on Google Cloud (10 TB/month)',
      body: 'Volume:  10,000 GB/month\nFree:    1 GB  (GCP free tier)\nBillable: 9,999 GB  ×  $0.08/GB\n                    ─────────────\nMonthly cost: $799.92   →   ~$9,599/year',
    },
    {
      title: 'Example 3 — Enterprise CDN offload via Azure (50 TB/month)',
      body: 'Volume:  51,200 GB/month\nFree:    5 GB\nBillable: 51,195 GB\n  First 10,240 GB  ×  $0.0875/GB  =  $896.00\n  Next 40,955 GB   ×  $0.0830/GB  =  $3,399.27\n                    ─────────────\nMonthly cost: $4,295.27',
    },
  ],
  pricingTableTitle: 'Cloud Egress Pricing by Provider (Outbound to Internet)',
  pricingTable: [
    { model: 'AWS (us-east-1)', inputPer1M: '100 GB free/mo', outputPer1M: '$0.09/GB (first 10 TB)', notes: 'Drops to $0.085 at 10–50 TB' },
    { model: 'Google Cloud',    inputPer1M: '1 GB free/mo',   outputPer1M: '$0.08/GB (first 10 TB)', notes: 'Drops to $0.06 at 10–150 TB' },
    { model: 'Azure',           inputPer1M: '5 GB free/mo',   outputPer1M: '$0.0875/GB (first 10 TB)', notes: 'Drops to $0.083 at 10–50 TB' },
    { model: 'Cloudflare R2',   inputPer1M: 'Unlimited free', outputPer1M: '$0.00/GB egress',        notes: 'Zero egress fees — great CDN alternative' },
    { model: 'Backblaze B2',    inputPer1M: '3× storage free',outputPer1M: '$0.01/GB',               notes: 'Cheapest standard egress' },
    { model: 'DigitalOcean',    inputPer1M: '1 TB free/mo',   outputPer1M: '$0.01/GB after free',    notes: 'Generous free tier for small apps' },
  ],
  tipsTitle: 'Tips to Reduce Data Transfer Costs',
  tips: [
    'Use a CDN (Cloudflare, CloudFront, Fastly) to serve static assets. CDN egress is often 5–10× cheaper than origin egress, and Cloudflare\'s free tier has zero egress fees.',
    'Keep traffic within the same cloud region or zone. Intra-region traffic between availability zones is free or near-zero on most providers — cross-region or internet egress is where costs spike.',
    'Enable compression (gzip/Brotli) at the edge. Compressed responses reduce transfer volume by 60–80% for JSON and HTML payloads, cutting billable GB proportionally.',
    'Consider Cloudflare R2 or Backblaze B2 for object storage with heavy download traffic. Both charge $0.00–$0.01/GB egress vs $0.09/GB on AWS S3.',
    'Use <a href="/calculators/bandwidth-cost-calculator">Bandwidth Cost Calculator</a> alongside this tool when your provider charges on both sustained throughput (Mbps) and per-GB transfer.',
    'Audit your logging and monitoring pipelines. Sending logs from EC2 to a third-party service crosses the internet and incurs egress fees — shipping to CloudWatch first is free within the region.',
  ],
  faq: [
    {
      question: 'What is egress cost in cloud pricing?',
      answer: 'Egress cost is the fee a cloud provider charges for data leaving their network — typically to the internet or to a different region. Ingress (data coming in) is almost always free. Egress is where bills accumulate for applications that serve files, stream media, or push data to external APIs. Most providers charge per GB transferred, with rates decreasing at higher volume tiers.',
    },
    {
      question: 'Why is AWS data transfer so expensive?',
      answer: 'AWS charges $0.09/GB for the first 10 TB/month of egress from most regions, which adds up quickly at scale. The cost covers network infrastructure and peering agreements. Mitigations include using CloudFront CDN (cheaper egress rate), keeping traffic intra-region (free), or migrating object storage to zero-egress providers like Cloudflare R2 for read-heavy workloads.',
    },
    {
      question: 'How do I calculate GB from my application traffic?',
      answer: 'Multiply your average response size in KB by monthly request volume, then divide by 1,048,576 to convert to GB. For example, 10 million requests at 50 KB each = 500,000,000 KB ÷ 1,048,576 ≈ 476 GB. Check your load balancer or CDN dashboard for actual bytes transferred — AWS CloudWatch, GCP Cloud Monitoring, and Azure Monitor all expose this metric directly.',
    },
    {
      question: 'Does data transfer cost apply to database queries?',
      answer: 'Yes, if the database and application server are in different regions or availability zones. Intra-AZ traffic within the same region is typically free on AWS and GCP. Cross-AZ traffic within a region is $0.01/GB on AWS. Cross-region database replication or queries from an external application server both incur standard egress rates — architect your VPC to keep hot data paths within the same AZ.',
    },
    {
      question: 'Is there a free tier for data transfer on AWS or GCP?',
      answer: 'AWS offers 100 GB/month free egress from EC2 and 1 TB/month free from CloudFront. Google Cloud provides 1 GB/month free internet egress and free traffic to certain Google services. Azure gives 5 GB/month free. All three providers also offer free intra-region traffic between their services. Use the <a href="/calculators/storage-cost-calculator">Storage Cost Calculator</a> to pair transfer costs with object storage fees.',
    },
  ],
  relatedSlugs: ['bandwidth-cost-calculator', 'storage-cost-calculator', 'api-rate-limit-calculator'],
};

export const dataTransferCostCalculator: CalculatorDefinition = { meta, Component: DataTransferCostUI };
