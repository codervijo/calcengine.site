import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function WorkerQueueThroughputUI() {
  const [workers, setWorkers] = useState<string>('10');
  const [taskDuration, setTaskDuration] = useState<string>('500');
  const [queueSize, setQueueSize] = useState<string>('10000');

  const w = parseFloat(workers) || 0;
  const d = parseFloat(taskDuration) || 0;
  const q = parseFloat(queueSize) || 0;

  const throughput = d > 0 ? (w * 1000) / d : 0;
  const drainTime = throughput > 0 ? q / throughput : 0;

  const formatDrainTime = (seconds: number): string => {
    if (seconds === 0) return '0 sec';
    if (seconds < 60) return `${seconds.toFixed(1)} sec`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
    return `${(seconds / 3600).toFixed(2)} hr`;
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Worker Queue Throughput</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Number of Workers"
          type="number"
          value={workers}
          onChange={(e) => setWorkers(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
        />
        <TextField
          label="Task Duration (ms)"
          type="number"
          value={taskDuration}
          onChange={(e) => setTaskDuration(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
        />
        <TextField
          label="Queue Size (tasks)"
          type="number"
          value={queueSize}
          onChange={(e) => setQueueSize(e.target.value)}
          slotProps={{ htmlInput: { min: 0, step: 100 } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Throughput</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{throughput.toFixed(2)} tasks/sec</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 1.5 }}>Queue Drain Time</Typography>
        <Typography variant="h4" component="p" sx={{ fontWeight: 600 }}>{formatDrainTime(drainTime)}</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'worker-queue-throughput-calculator',
  title: 'Worker Queue Throughput Calculator',
  shortTitle: 'Queue Throughput',
  description: 'Calculate worker queue throughput instantly — enter worker count, task duration, and queue size to see tasks/sec rate and queue drain time for any worker pool',
  keywords: [
    'worker queue throughput calculator',
    'job queue throughput',
    'queue drain time calculator',
    'worker pool throughput',
    'task queue processing rate',
    'queue size estimator',
    'concurrent worker throughput',
    'queue processing time estimator',
  ],
  category: 'api',
  icon: 'Speed',
  tagline: 'Enter your worker count, task duration, and queue size to instantly calculate throughput in tasks per second and queue drain time. Built for backend engineers sizing job queues, thread pools, and message brokers.',
  lastUpdated: 'April 2026',
  intro: 'This worker queue throughput calculator tells you exactly how many tasks your worker pool processes per second, and how long it will take to drain an existing backlog. Backend engineers use it when sizing Sidekiq, Celery, BullMQ, Kafka consumers, and custom worker processes — before deploying, not after a queue backs up in production.\n\nThroughput scales linearly with workers: if 10 workers each take 500 ms per task, the pool processes 20 tasks per second. Double the workers or halve the task duration and you double the throughput — until you hit a shared bottleneck like a database connection pool, a rate-limited API, or CPU contention.\n\nDrain time answers the other side of the equation: given a backlog of N tasks and a known throughput rate, how long until the queue empties? This is critical when a deploy causes a spike, a cron job drops 100,000 tasks at midnight, or a consumer group falls behind and you need to estimate recovery time before an SLA breach.\n\nCombine this calculator with a concurrency model when sizing your thread pool. If downstream dependencies are rate-limited, adding more workers past that limit creates contention without increasing throughput — use the API rate limit and concurrency calculators alongside this one.',
  howItWorksTitle: 'How to Calculate Worker Queue Throughput',
  howItWorksImage: '/images/calculators/worker-queue-throughput-calculator-how-it-works.svg',
  howItWorks: '1. Enter the number of concurrent workers — processes, threads, or goroutines that pull tasks from the queue simultaneously.\n2. Enter the average task duration in milliseconds — how long a single worker spends on one task from dequeue to completion.\n3. Enter the queue size — the total number of tasks currently waiting or expected to accumulate.\n4. The calculator divides workers by task duration (converted to seconds) to get throughput in tasks per second.\n5. It then divides queue size by throughput to give the drain time — how long until the queue reaches zero at current throughput.\n6. Adjust worker count or task duration to hit a target throughput or drain time that meets your SLA.',
  formula: 'Throughput (tasks/sec) = Workers / (Task Duration ms / 1000)\nDrain Time (sec)       = Queue Size / Throughput\n\nWorkers       — number of concurrent workers (processes, threads, goroutines)\nTask Duration — average time one worker spends on a single task, in milliseconds\nQueue Size    — total number of tasks to drain\nThroughput    — tasks processed per second across all workers\nDrain Time    — seconds until the queue reaches zero at current throughput',
  examplesTitle: 'Example Worker Queue Throughput Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Sidekiq job queue with 5 workers',
      body: 'Workers:       5\nTask Duration: 200 ms\nQueue Size:    3,000 jobs\n\nThroughput = 5 / (200 / 1000) = 5 / 0.2 = 25 jobs/sec\nDrain Time = 3,000 / 25 = 120 sec (2 minutes)',
    },
    {
      title: 'Example 2 — Celery task queue processing large payloads',
      body: 'Workers:       20\nTask Duration: 1,500 ms\nQueue Size:    50,000 tasks\n\nThroughput = 20 / (1500 / 1000) = 20 / 1.5 ≈ 13.3 tasks/sec\nDrain Time = 50,000 / 13.3 ≈ 3,759 sec (~62 minutes)',
    },
    {
      title: 'Example 3 — BullMQ queue recovering from overnight backlog',
      body: 'Workers:       50\nTask Duration: 100 ms\nQueue Size:    500,000 tasks\n\nThroughput = 50 / (100 / 1000) = 50 / 0.1 = 500 tasks/sec\nDrain Time = 500,000 / 500 = 1,000 sec (~16.7 minutes)',
    },
  ],
  tipsTitle: 'Tips to Improve Worker Queue Throughput',
  tips: [
    'Scale workers horizontally before optimising task duration — adding workers is usually cheaper than rewriting job logic, and throughput scales linearly with worker count until you hit a shared resource bottleneck.',
    'Profile your slowest tasks. A single 5-second task occupies a worker 25× longer than a 200 ms task. Move slow I/O-heavy tasks (e.g. external API calls) to a dedicated low-priority queue with fewer workers.',
    'Set a concurrency limit that matches your downstream resource. If each worker makes one database query, cap workers at the database connection pool size to avoid connection exhaustion and queueing inside the pool.',
    'Use the drain time formula to set your autoscaling trigger. If your target drain time is under 5 minutes, alert when queue size / current throughput exceeds 300 seconds — before it becomes a problem.',
    'Batch small tasks. If individual task duration is under 50 ms, queue overhead (serialisation, dequeue, ack) may dominate. Grouping 10–50 tasks per job can raise effective throughput by 2–5×.',
    'For <a href="/calculators/api-rate-limit-calculator">rate-limited downstream APIs</a>, cap worker count to stay within the API\'s requests-per-second limit — more workers will not help and will trigger 429 errors that further degrade throughput.',
  ],
  faq: [
    {
      question: 'What is worker queue throughput?',
      answer: 'Worker queue throughput is the number of tasks a pool of workers processes per second. It is determined by dividing the number of concurrent workers by the time each task takes to complete (in seconds). For example, 10 workers each completing a 500 ms task give a pool throughput of 20 tasks per second. Throughput scales linearly with workers until a shared resource becomes the bottleneck.',
    },
    {
      question: 'How do I calculate queue drain time?',
      answer: 'Divide the total number of tasks in the queue by the throughput in tasks per second. If your pool processes 25 tasks/sec and the queue contains 5,000 tasks, drain time is 5,000 ÷ 25 = 200 seconds. This assumes constant throughput with no new tasks arriving — adjust upward if producers continue adding tasks during the drain window.',
    },
    {
      question: 'Does adding more workers always increase throughput?',
      answer: 'Only up to the bottleneck. If all workers share a single database connection pool, a rate-limited API, or a CPU-bound resource, adding workers past that limit creates contention and can reduce effective throughput. Use the <a href="/calculators/concurrency-calculator">Concurrency Calculator</a> to model the interaction between concurrency, wait time, and throughput via Little\'s Law.',
    },
    {
      question: 'What task duration should I use in the calculator?',
      answer: 'Use the p95 (95th percentile) task duration from your monitoring, not the mean. Outlier tasks that take 10× longer than average will hold a worker thread and degrade effective throughput beyond what the mean predicts. If you do not have metrics yet, add timing instrumentation around your job handler before committing to a worker pool size.',
    },
    {
      question: 'How do I size a worker pool for a target drain time?',
      answer: 'Rearrange the formula: Workers = Queue Size / (Target Drain Time × Tasks per Second per Worker). To drain 10,000 tasks in under 5 minutes (300 s) with each task taking 500 ms, you need Workers = 10,000 / (300 × 2) = 16.7, so 17 workers minimum. Use this calculator to validate and tune the number before deploying to production.',
    },
  ],
  relatedSlugs: ['throughput-calculator', 'concurrency-calculator', 'api-rate-limit-calculator', 'qps-calculator'],
};

export const workerQueueThroughputCalculator: CalculatorDefinition = { meta, Component: WorkerQueueThroughputUI };
