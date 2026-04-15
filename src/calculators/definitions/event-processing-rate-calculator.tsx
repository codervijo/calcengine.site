import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function EventProcessingRateUI() {
  const [totalEvents, setTotalEvents] = useState<string>('1000000');
  const [processingTimeMs, setProcessingTimeMs] = useState<string>('5');
  const [workers, setWorkers] = useState<string>('10');

  const events = parseFloat(totalEvents) || 0;
  const ptMs = parseFloat(processingTimeMs) || 1;
  const w = parseFloat(workers) || 1;

  const throughputEPS = w * (1000 / ptMs);
  const totalTimeSec = events > 0 && throughputEPS > 0 ? events / throughputEPS : 0;

  const formatThroughput = (eps: number): string => {
    if (eps >= 1_000_000) return `${(eps / 1_000_000).toFixed(2)}M ev/s`;
    if (eps >= 1_000) return `${(eps / 1_000).toFixed(2)}K ev/s`;
    return `${eps.toFixed(2)} ev/s`;
  };

  const formatTime = (sec: number): string => {
    if (sec <= 0) return '—';
    if (sec < 60) return `${sec.toFixed(2)} sec`;
    if (sec < 3600) return `${(sec / 60).toFixed(2)} min`;
    if (sec < 86400) return `${(sec / 3600).toFixed(2)} hr`;
    return `${(sec / 86400).toFixed(2)} days`;
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Event Processing Rate</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Total Events"
          type="number"
          value={totalEvents}
          onChange={(e) => setTotalEvents(e.target.value)}
          slotProps={{ htmlInput: { min: '1' } }}
        />
        <TextField
          label="Processing Time per Event (ms)"
          type="number"
          value={processingTimeMs}
          onChange={(e) => setProcessingTimeMs(e.target.value)}
          slotProps={{ htmlInput: { step: '0.1', min: '0.01' } }}
        />
        <TextField
          label="Number of Workers"
          type="number"
          value={workers}
          onChange={(e) => setWorkers(e.target.value)}
          slotProps={{ htmlInput: { min: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Throughput</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{formatThroughput(throughputEPS)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
          Time to drain {Number(totalEvents || 0).toLocaleString()} events: {formatTime(totalTimeSec)}
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'event-processing-rate-calculator',
  title: 'Event Processing Rate Calculator',
  shortTitle: 'Event Rate',
  description: 'Calculate the event processing rate for your pipeline. Enter worker count, per-event latency, and total events to get throughput and queue drain time instantly',
  keywords: [
    'event processing rate calculator',
    'events per second calculator',
    'kafka consumer throughput calculator',
    'queue drain time calculator',
    'worker pool throughput calculator',
    'sqs consumer rate calculator',
    'event stream throughput estimator',
    'consumer lag calculator',
  ],
  category: 'api',
  icon: 'Speed',
  tagline: 'Enter your worker count, per-event processing time, and total event volume to calculate pipeline throughput and queue drain time. Works with Kafka, SQS, RabbitMQ, and any worker pool.',
  lastUpdated: 'April 2026',
  intro: 'The event processing rate calculator helps you size consumer pools, predict queue drain times, and avoid backlog build-up in event-driven architectures. Whether you\'re using Kafka, RabbitMQ, AWS SQS, or a custom worker pool, the same core formula applies: multiply your worker count by each worker\'s per-second capacity to get total throughput in events per second.\n\nThis tool is used by backend engineers, data engineers, and SREs designing or troubleshooting stream processing pipelines. Enter the number of workers, how long each event takes to process, and your total event volume to instantly see throughput and the time needed to drain the queue.\n\nCommon scenarios include right-sizing a Kafka consumer group before a traffic spike, estimating how long a nightly batch will take to complete, and calculating the minimum number of Lambda concurrency slots needed to keep pace with an SQS queue.\n\nIf your throughput approaches your ingestion rate, even brief spikes will cause backlog accumulation. Use this calculator to maintain 20–30% headroom so your pipeline can absorb bursts without falling behind.',
  howItWorksTitle: 'How to Calculate Event Processing Rate',
  howItWorksImage: '/images/calculators/event-processing-rate-calculator-how-it-works.svg',
  howItWorks: '1. Enter the number of parallel workers — Kafka consumers, Lambda concurrency slots, thread pool size, or goroutines.\n2. Enter the average processing time per event in milliseconds, including all I/O, computation, and acknowledgement latency.\n3. Enter the total number of events to process, or use throughput alone to evaluate steady-state capacity.\n4. The calculator computes throughput: workers × (1000 ÷ processing_time_ms) = events per second.\n5. It then divides total events by throughput to show you the estimated queue drain time.',
  formula: 'Throughput (ev/s) = Workers × (1000 ÷ Processing Time ms)\n\nQueue Drain Time  = Total Events ÷ Throughput (ev/s)\n\nWorkers           — parallel consumers, threads, Lambda invocations, or goroutines\nProcessing Time   — average wall-clock time per event (ms), including I/O and ack latency\nTotal Events      — total queue depth or batch size to drain',
  examplesTitle: 'Example Event Processing Rate Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Kafka consumer group draining 1M events',
      body: 'Workers: 10 consumers  |  Processing time: 5 ms/event\n\nThroughput = 10 × (1000 ÷ 5) = 2,000 ev/s\n\nDrain time = 1,000,000 ÷ 2,000 = 500 sec  →  8.3 minutes',
    },
    {
      title: 'Example 2 — SQS + Lambda draining 500K events',
      body: 'Workers: 50 (Lambda concurrency)  |  Processing time: 200 ms/event\n\nThroughput = 50 × (1000 ÷ 200) = 250 ev/s\n\nDrain time = 500,000 ÷ 250 = 2,000 sec  →  33.3 minutes',
    },
    {
      title: 'Example 3 — Redis stream consumer pool with 10M events',
      body: 'Workers: 4 consumers  |  Processing time: 2 ms/event\n\nThroughput = 4 × (1000 ÷ 2) = 2,000 ev/s\n\nDrain time = 10,000,000 ÷ 2,000 = 5,000 sec  →  83.3 minutes',
    },
  ],
  tipsTitle: 'Tips to Maximise Event Processing Throughput',
  tips: [
    'Keep utilisation below 80% — when ingestion rate approaches throughput capacity, any traffic spike causes backlog accumulation that takes hours to recover.',
    'Measure actual processing time end-to-end including network round trips, DB writes, and ack latency — not just CPU time. I/O typically dominates.',
    'Scale workers horizontally rather than vertically. Doubling workers doubles throughput linearly; reducing processing time by half achieves the same.',
    'For Kafka, ensure partition count ≥ worker count — Kafka limits effective parallelism to the number of partitions, regardless of how many consumers you add.',
    'Use the <a href="/calculators/worker-queue-throughput-calculator">Worker Queue Throughput Calculator</a> to model backlog growth when ingestion rate exceeds your current throughput.',
    'Monitor consumer lag (Kafka) or queue depth (SQS) as your primary SLI — set an alert when lag exceeds your acceptable drain time budget.',
  ],
  faq: [
    {
      question: 'How do I calculate events per second for a worker pool?',
      answer: 'Multiply your worker count by each worker\'s per-second capacity: throughput = workers × (1000 ÷ processing_time_ms). If 10 workers each spend 5ms per event, each handles 200 ev/s, giving 2,000 ev/s total. This formula applies to Kafka consumers, SQS Lambda functions, thread pools, and goroutine pools alike.',
    },
    {
      question: 'How many Kafka consumers do I need to hit my throughput target?',
      answer: 'Divide your required throughput (ev/s) by each consumer\'s capacity (1000 ÷ processing_time_ms). If each consumer handles 5ms per event (200 ev/s each) and you need 10,000 ev/s, you need 50 consumers. Remember Kafka caps effective parallelism at partition count — set partitions ≥ consumers, or throughput will be limited by the partition ceiling.',
    },
    {
      question: 'What is a good per-event processing time target?',
      answer: 'For real-time pipelines, aim for under 10ms per event including I/O. For near-real-time analytics or alerting, 10–100ms is acceptable. For batch jobs, 100ms–1s is fine. The key constraint is that throughput × processing_time_ms ÷ 1000 = workers — any slower and you need more workers to reach your rate target.',
    },
    {
      question: 'How do I calculate queue drain time?',
      answer: 'Divide the total number of events in the queue by your throughput in events per second. If you have 5 million events and throughput is 1,000 ev/s, drain time is 5,000 seconds (about 83 minutes). Use this to plan maintenance windows, estimate batch job completion times, and set SLA-based consumer counts. Check the <a href="/calculators/throughput-calculator">Throughput Calculator</a> for related scenarios.',
    },
    {
      question: 'Why does my consumer lag keep growing even with enough workers?',
      answer: 'Consumer lag grows when ingestion rate exceeds processing throughput. Common causes: insufficient workers, slow downstream I/O such as DB writes or API calls, GC pauses inflating per-event latency, or larger event payloads increasing deserialization time. Use this calculator to verify your worker count matches your required throughput, then add 20–30% headroom for traffic bursts.',
    },
  ],
  relatedSlugs: ['throughput-calculator', 'worker-queue-throughput-calculator', 'concurrency-calculator', 'qps-calculator'],
};

export const eventProcessingRateCalculator: CalculatorDefinition = { meta, Component: EventProcessingRateUI };
