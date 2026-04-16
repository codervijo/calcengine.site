import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function BatchProcessingTimeUI() {
  const [totalItems, setTotalItems] = useState<string>('10000');
  const [ratePerWorker, setRatePerWorker] = useState<string>('50');
  const [workers, setWorkers] = useState<string>('4');
  const [setupTime, setSetupTime] = useState<string>('5');

  const items = parseFloat(totalItems) || 0;
  const rate = parseFloat(ratePerWorker) || 0;
  const w = Math.max(parseInt(workers) || 1, 1);
  const setup = parseFloat(setupTime) || 0;

  const processingSeconds = rate > 0 ? items / (rate * w) : 0;
  const totalSeconds = processingSeconds + setup;
  const effectiveThroughput = rate * w;

  const formatTime = (sec: number): string => {
    if (sec === 0) return '0 s';
    if (sec < 60) return `${sec.toFixed(2)} s`;
    if (sec < 3600) return `${(sec / 60).toFixed(2)} min`;
    return `${(sec / 3600).toFixed(2)} hr`;
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Batch Processing Time</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Total Items"
          type="number"
          value={totalItems}
          onChange={(e) => setTotalItems(e.target.value)}
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          label="Items / Second per Worker"
          type="number"
          value={ratePerWorker}
          onChange={(e) => setRatePerWorker(e.target.value)}
          slotProps={{ htmlInput: { min: 0.001, step: '0.1' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Number of Workers"
          type="number"
          value={workers}
          onChange={(e) => setWorkers(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: '1' } }}
        />
        <TextField
          label="Setup Time (seconds)"
          type="number"
          value={setupTime}
          onChange={(e) => setSetupTime(e.target.value)}
          slotProps={{ htmlInput: { min: 0, step: '0.1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Batch Processing Time</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{formatTime(totalSeconds)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
          Processing: {formatTime(processingSeconds)} + Setup: {formatTime(setup)} · Effective throughput: {effectiveThroughput.toFixed(0)} items/s
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'batch-processing-time-calculator',
  title: 'Batch Processing Time Calculator',
  shortTitle: 'Batch Processing Time',
  description: 'Batch processing time calculator: given item count, processing rate, and workers, calculate total job duration instantly in seconds, minutes, or hours',
  keywords: [
    'batch processing time calculator',
    'batch job duration estimator',
    'parallel worker time calculator',
    'data pipeline time estimate',
    'etl processing time calculator',
    'batch throughput calculator',
    'worker pool completion time',
    'job runtime estimator',
  ],
  category: 'api',
  icon: 'AccessTime',
  tagline: 'Enter your item count, processing rate, and number of workers to instantly estimate total batch job duration. Works for data pipelines, ETL jobs, API batches, and any parallel workload.',
  lastUpdated: 'April 2026',
  intro: 'The batch processing time calculator helps engineers and data teams estimate how long a job will take before committing compute resources. Whether you\'re running a data pipeline, ETL workflow, API ingestion job, or machine learning batch inference, the formula is the same: total items divided by throughput across all workers, plus any fixed setup overhead.\n\nBatch time estimation matters most at scale. A job that processes 1 million records at 50 items per second per worker with 4 workers takes 5,000 seconds — roughly 83 minutes. Add a 30-second initialization step and total duration becomes 5,030 seconds. Getting this right before you run saves wasted cloud compute and missed SLA windows.\n\nThis calculator is useful when sizing worker pools for Kubernetes batch jobs, Apache Spark tasks, Celery workers, or AWS Batch. It also applies to OpenAI Batch API jobs, database migration scripts, image resizing pipelines, and any workload where items are processed at a known rate per worker thread.\n\nOnce you know the total duration, pair this result with the Worker Queue Throughput Calculator to verify your message queue can feed workers fast enough, and with the Thread Pool Size Calculator to size thread pools within each worker process.',
  howItWorksTitle: 'How to Calculate Batch Processing Time',
  howItWorksImage: '/images/calculators/batch-processing-time-calculator-how-it-works.svg',
  howItWorks: '1. Enter the total number of items your job needs to process — rows, records, files, API requests, or any discrete unit.\n2. Set the processing rate: how many items a single worker handles per second under production load.\n3. Enter the number of parallel workers — threads, pods, Lambda functions, or machines running concurrently.\n4. Add any fixed setup time in seconds: container cold start, DB connection pool creation, model loading, etc.\n5. Read the total duration: processing time = (Items ÷ (Rate × Workers)), plus setup time.\n6. Adjust the worker count up or down to hit a target completion window.',
  formula: 'Total Time = (Total Items ÷ (Rate × Workers)) + Setup Time\n\nTotal Items  — number of records, files, or requests to process\nRate         — items processed per second per worker (measure on a sample)\nWorkers      — number of parallel workers running concurrently\nSetup Time   — fixed overhead before processing begins (seconds)\nTotal Time   — end-to-end wall-clock duration in seconds',
  examplesTitle: 'Example Batch Processing Time Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Data pipeline: 1,000,000 rows, 4 workers',
      body: 'Total Items:  1,000,000\nRate:              50 items/s per worker\nWorkers:            4\nSetup Time:        30 s\n\nEffective throughput: 50 × 4    =    200 items/s\nProcessing:  1,000,000 ÷ 200   =  5,000 s\nTotal:          5,000 + 30     =  5,030 s  ≈  83.8 minutes',
    },
    {
      title: 'Example 2 — Image resize batch: 50,000 images, 8 workers',
      body: 'Total Items:     50,000\nRate:               5 items/s per worker\nWorkers:            8\nSetup Time:        20 s\n\nEffective throughput: 5 × 8     =     40 items/s\nProcessing:   50,000 ÷ 40      =  1,250 s\nTotal:         1,250 + 20      =  1,270 s  ≈  21.2 minutes',
    },
    {
      title: 'Example 3 — API ingestion: 200,000 requests, 20 workers',
      body: 'Total Items:    200,000\nRate:              10 items/s per worker\nWorkers:           20\nSetup Time:         5 s\n\nEffective throughput: 10 × 20   =    200 items/s\nProcessing:  200,000 ÷ 200     =  1,000 s\nTotal:         1,000 + 5       =  1,005 s  ≈  16.75 minutes',
    },
  ],
  tipsTitle: 'Tips to Reduce Batch Processing Time',
  tips: [
    'Scale workers horizontally before optimising per-item throughput — doubling workers halves duration; doubling per-item rate also halves it, but horizontal scaling is usually cheaper in cloud environments.',
    'Measure your actual items-per-second rate under production load using a small sample batch before extrapolating. Disk I/O and network latency cause real rates to differ significantly from theoretical maximums.',
    'Minimise setup time by reusing connections and pre-loading shared resources. Container warm-up, DB connection pool creation, and model loading can each add tens of seconds of fixed overhead to every batch run.',
    'For cloud batch jobs (AWS Batch, Kubernetes Jobs), use this calculator\'s output to hit a target completion window, then validate with a dry-run on 1% of your dataset before committing full compute.',
    'Use the <a href="/calculators/worker-queue-throughput-calculator">Worker Queue Throughput Calculator</a> alongside this tool to verify your message queue can feed workers fast enough to sustain the target rate.',
    'If processing time dominates setup time, focus optimisation there. If setup time is more than 10% of total time, consider batching small jobs into fewer larger runs to amortise the fixed cost.',
  ],
  faq: [
    {
      question: 'How do I calculate batch processing time?',
      answer: 'Batch processing time equals total items divided by the product of your per-worker rate and worker count, plus fixed setup time. The formula is: Total Time = (Items ÷ (Rate × Workers)) + Setup Time. For example, 100,000 items at 25 items/s with 4 workers gives 1,000 s of processing. Add 10 s setup and the total is 1,010 seconds, just under 17 minutes.',
    },
    {
      question: 'What is a realistic processing rate for batch jobs?',
      answer: 'Processing rate depends on workload type. CPU-bound tasks (image resizing, JSON transformation) typically run at 10–200 items/second per worker. I/O-bound tasks (database reads, external API calls) range from 1–50 items/second depending on latency. Measure on a 1,000-item sample in production conditions — theoretical rates are often 2–5× higher than sustained real-world throughput due to resource contention.',
    },
    {
      question: 'How many workers do I need to complete a batch in under 1 hour?',
      answer: 'Rearrange the formula: Workers ≥ Items ÷ (Rate × Target Seconds). To process 1 million items in 3,600 seconds at 50 items/s per worker, you need at least 1,000,000 ÷ (50 × 3,600) ≈ 5.6, so 6 workers minimum. Use the <a href="/calculators/thread-pool-size-calculator">Thread Pool Size Calculator</a> to determine thread pools within each worker process for I/O-bound workloads.',
    },
    {
      question: 'Does this formula work for distributed systems like Spark or Flink?',
      answer: 'Yes, as a rough estimate. Set workers to the number of executor cores and rate to the per-core throughput observed in profiling. In practice, distributed overhead — shuffle operations, network transfer, garbage collection, and data skew — reduces real throughput by 20–50% versus the ideal calculation. Apply a 1.3–1.5× headroom multiplier to your estimated completion time when planning SLAs.',
    },
    {
      question: 'How does setup time affect batch duration at different scales?',
      answer: 'Setup time is a fixed cost that amortises across all items. At 100,000 items it is usually negligible; at 100 items it can dominate total duration. If you split one large batch into many small jobs, setup time multiplies by the number of jobs. The <a href="/calculators/event-processing-rate-calculator">Event Processing Rate Calculator</a> helps when your items are continuous stream events rather than finite batched records.',
    },
  ],
  relatedSlugs: ['event-processing-rate-calculator', 'worker-queue-throughput-calculator', 'thread-pool-size-calculator', 'message-queue-delay-calculator'],
};

export const batchProcessingTimeCalculator: CalculatorDefinition = { meta, Component: BatchProcessingTimeUI };
