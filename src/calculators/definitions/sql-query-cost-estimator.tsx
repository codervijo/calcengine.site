import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function SqlQueryCostEstimatorUI() {
  const [dataScanned, setDataScanned] = useState<string>('100');
  const [pricePerTB, setPricePerTB] = useState<string>('5.00');
  const [queryCount, setQueryCount] = useState<string>('1000');

  const gb = parseFloat(dataScanned) || 0;
  const price = parseFloat(pricePerTB) || 0;
  const count = parseFloat(queryCount) || 0;

  const tbScanned = gb / 1024;
  const costPerQuery = tbScanned * price;
  const totalCost = costPerQuery * count;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Estimate SQL Query Cost</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Data Scanned per Query (GB)" type="number" value={dataScanned} onChange={(e) => setDataScanned(e.target.value)} />
        <TextField label="Price per TB Scanned ($)" type="number" value={pricePerTB} onChange={(e) => setPricePerTB(e.target.value)} slotProps={{ htmlInput: { step: '0.01' } }} />
        <TextField label="Number of Queries" type="number" value={queryCount} onChange={(e) => setQueryCount(e.target.value)} />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated Total Cost</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>${totalCost.toFixed(4)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
          ${costPerQuery.toFixed(6)} per query · {tbScanned.toFixed(6)} TB scanned
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'sql-query-cost-estimator',
  title: 'SQL Query Cost Estimator',
  shortTitle: 'SQL Query Cost',
  description: 'Estimate SQL query costs on BigQuery, Athena, or Redshift Spectrum. Enter data scanned and query volume to instantly project your monthly database spend.',
  keywords: ['sql query cost estimator', 'bigquery cost calculator', 'athena query cost', 'redshift spectrum cost', 'data scan cost calculator', 'cloud sql cost estimator', 'per tb query pricing'],
  category: 'data',
  icon: 'Storage',
  tagline: 'Enter the data scanned per query and your service\'s per-TB price to get an instant cost estimate. Works with BigQuery, Athena, Redshift Spectrum, and any per-TB-scan billing model.',
  lastUpdated: 'April 2026',
  intro: 'The SQL Query Cost Estimator helps data engineers, analysts, and FinOps teams forecast database spend before it appears on their cloud bill. Services like BigQuery, Amazon Athena, and Redshift Spectrum charge per terabyte of data scanned — meaning a single unoptimized query can cost hundreds of dollars at scale.\n\nThe per-TB model makes costs highly variable: a query scanning 10 GB costs roughly $0.05 on BigQuery, while the same logical query running against an unpartitioned 10 TB table costs $50. Understanding this relationship is essential for any team running analytical workloads on cloud data warehouses.\n\nUse this calculator before promoting queries to production, when designing table schemas, or when auditing monthly BigQuery or Athena invoices. It works for any service using per-TB scan pricing — plug in your provider\'s rate and the formula is identical across platforms.\n\nFor recurring workloads, multiply cost per query by your expected daily query volume to project monthly spend. Partitioning, clustering, and columnar formats like Parquet typically reduce data scanned by 50–99%, making them the highest-leverage cost optimisations available.',
  howItWorksTitle: 'How to Use the SQL Query Cost Estimator',
  howItWorksImage: '/images/calculators/sql-query-cost-estimator-how-it-works.svg',
  howItWorks: '1. Find your cloud SQL service\'s per-TB scan price — BigQuery on-demand and Athena both charge $5.00/TB; Redshift Spectrum charges $5.00/TB for external queries.\n2. Run a representative sample query and note the bytes processed shown in the query details panel, INFORMATION_SCHEMA.JOBS, or the Athena query history.\n3. Convert bytes to gigabytes: divide by 1,073,741,824 (or read the GB figure directly from the console).\n4. Enter the GB scanned per query and the price per TB into the calculator above.\n5. Enter the number of queries you run per day, week, or month to project total cost.\n6. The calculator applies (GB ÷ 1,024) × $/TB × query count — adjust inputs to model optimisation scenarios like partitioning or column pruning.',
  formula: 'Total Cost = (Data Scanned GB ÷ 1,024) × Price per TB × Query Count\n\nData Scanned  — volume of data read per query, in gigabytes (GB)\nPrice per TB  — cost per terabyte scanned (e.g. $5.00 for BigQuery on-demand)\nQuery Count   — number of queries in the projection window\n\nCost per Query = (Data Scanned GB ÷ 1,024) × Price per TB\nTotal Cost     = Cost per Query × Query Count',
  examplesTitle: 'Example SQL Query Cost Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — BigQuery dashboard query (daily run)',
      body: 'Data scanned:  100 GB  ÷ 1,024 = 0.097656 TB\nPrice:         0.097656 TB × $5.00/TB = $0.488281 per query\nQuery count:   30 runs/day × 30 days  = 900 queries/month\n                                        ─────────────────────\nMonthly cost:  $0.488281 × 900        = $439.45/month',
    },
    {
      title: 'Example 2 — Athena log analysis on unpartitioned table (before optimisation)',
      body: 'Data scanned:  500 GB  ÷ 1,024 = 0.488281 TB\nPrice:         0.488281 TB × $5.00/TB = $2.441406 per query\nQuery count:   100 queries/day × 30 days = 3,000 queries/month\n                                        ─────────────────────\nMonthly cost:  $2.441406 × 3,000      = $7,324.22/month',
    },
    {
      title: 'Example 3 — Same Athena query after adding date partitions (99% reduction)',
      body: 'Data scanned:  5 GB    ÷ 1,024 = 0.004883 TB\nPrice:         0.004883 TB × $5.00/TB = $0.024414 per query\nQuery count:   3,000 queries/month (unchanged)\n                                        ─────────────────────\nMonthly cost:  $0.024414 × 3,000      = $73.24/month   (vs $7,324 before — 100× cheaper)',
    },
  ],
  pricingTableTitle: 'SQL Query Pricing by Cloud Service',
  pricingTable: [
    { model: 'BigQuery (on-demand)',    inputPer1M: '$5.00/TB',  outputPer1M: '—', notes: 'First 1 TB/month free' },
    { model: 'Amazon Athena',          inputPer1M: '$5.00/TB',  outputPer1M: '—', notes: 'Min 10 MB charge per query' },
    { model: 'Redshift Spectrum',      inputPer1M: '$5.00/TB',  outputPer1M: '—', notes: 'External table queries only' },
    { model: 'Azure Synapse Serverless', inputPer1M: '$5.00/TB', outputPer1M: '—', notes: 'Per TB of data processed' },
    { model: 'BigQuery (flat-rate)',   inputPer1M: 'Fixed',     outputPer1M: '—', notes: 'Slot-based, not per-TB' },
    { model: 'Snowflake',             inputPer1M: 'Compute',    outputPer1M: '—', notes: 'Credit-based, not per-scan' },
  ],
  tipsTitle: 'Tips to Reduce SQL Query Scan Costs',
  tips: [
    'Partition your tables by date or a high-cardinality filter column. A date-partitioned BigQuery table lets a query scanning one day\'s data skip the remaining 364 days — reducing scanned bytes and cost by up to 99%.',
    'Use column pruning: SELECT only the columns you need. BigQuery and Athena use columnar storage (Capacitor / Parquet), so selecting 3 of 50 columns scans roughly 6% of the table data.',
    'Convert raw CSV or JSON tables to Parquet or ORC. Columnar compression typically reduces data size by 5–10×, cutting scan costs by the same factor with no query changes.',
    'Cache results for repeated queries. BigQuery caches identical query results for 24 hours at no charge — structure dashboards to re-use cached results rather than re-scanning on every page load.',
    'Set per-query or per-user byte budgets. BigQuery supports <code>maximumBytesBilled</code> on queries and project-level quotas to prevent runaway scans from surprise bills.',
    'Use the <code>INFORMATION_SCHEMA.JOBS</code> view (BigQuery) or Athena query history to identify your top-10 most expensive queries by bytes scanned — these are the highest-priority optimisation targets.',
  ],
  faq: [
    {
      question: 'How does BigQuery charge for SQL queries?',
      answer: 'BigQuery on-demand billing charges $5.00 per terabyte of data scanned by each query. The first 1 TB per month is free. Charges are based on bytes read from disk, not rows returned — so a SELECT * on a large table is far more expensive than a narrow column query on the same table. Use the query validator to preview bytes before running.',
    },
    {
      question: 'Does this SQL query cost estimator work for Amazon Athena?',
      answer: 'Yes. Athena charges $5.00 per TB of data scanned, with a minimum of 10 MB per query. Enter $5.00 as the price per TB and the calculator produces accurate cost projections. Athena scans the underlying S3 files directly, so using columnar formats like Parquet and Snappy compression dramatically reduces both scan volume and cost.',
    },
    {
      question: 'How do I find out how many GB my BigQuery query scans?',
      answer: 'Run the query with the dry-run flag enabled (tick "Estimate bytes processed" in the console, or set <code>dryRun: true</code> in the API) to get the byte count without executing the query. After execution, check the "Bytes processed" field in the query details panel or query <code>INFORMATION_SCHEMA.JOBS</code> for the <code>total_bytes_billed</code> column.',
    },
    {
      question: 'What is the cheapest way to run analytical SQL queries in the cloud?',
      answer: 'Partition and cluster your tables, use columnar file formats (Parquet/ORC), and select only needed columns. For BigQuery, the flat-rate pricing model becomes cheaper than on-demand once your team exceeds roughly 1,000 GB scanned per day. Athena costs can be cut by up to 87% by converting CSV to Parquet. Use the <a href="/calculators/storage-cost-calculator">Storage Cost Calculator</a> to estimate storage savings alongside query savings.',
    },
    {
      question: 'How does partitioning reduce SQL query costs?',
      answer: 'Partitioning physically organises table data into separate storage segments — typically by date. When a query filters on the partition column (e.g. <code>WHERE date = \'2026-04-14\'</code>), the engine reads only that partition and skips the rest. A table with 3 years of daily data has 1,095 partitions; a single-day query scans 1/1,095th of the total data, reducing cost by over 99%.',
    },
  ],
  relatedSlugs: ['storage-cost-calculator', 'data-transfer-cost-calculator', 'payload-size-calculator'],
};

export const sqlQueryCostEstimatorCalculator: CalculatorDefinition = { meta, Component: SqlQueryCostEstimatorUI };
