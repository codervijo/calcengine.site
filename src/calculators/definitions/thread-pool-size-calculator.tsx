import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function ThreadPoolSizeUI() {
  const [cpuCores, setCpuCores] = useState<string>('8');
  const [cpuUtilization, setCpuUtilization] = useState<string>('80');
  const [waitTime, setWaitTime] = useState<string>('200');
  const [computeTime, setComputeTime] = useState<string>('20');

  const cores = parseFloat(cpuCores) || 0;
  const utilization = parseFloat(cpuUtilization) || 0;
  const wait = parseFloat(waitTime) || 0;
  const compute = parseFloat(computeTime) || 1;

  // Brian Goetz formula: N = Ncpu × Ucpu × (1 + W/C)
  const poolSize = cores * (utilization / 100) * (1 + wait / compute);
  const poolSizeRounded = Math.ceil(poolSize);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Thread Pool Size</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="CPU Cores"
          type="number"
          value={cpuCores}
          onChange={(e) => setCpuCores(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
        />
        <TextField
          label="Target CPU Utilization (%)"
          type="number"
          value={cpuUtilization}
          onChange={(e) => setCpuUtilization(e.target.value)}
          slotProps={{ htmlInput: { min: '1', max: '100', step: '1' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Wait Time / I/O Time (ms)"
          type="number"
          value={waitTime}
          onChange={(e) => setWaitTime(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
        />
        <TextField
          label="Compute Time (ms)"
          type="number"
          value={computeTime}
          onChange={(e) => setComputeTime(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Recommended Thread Pool Size</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{poolSizeRounded} threads</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          {cores} cores × {utilization}% × (1 + {wait}ms / {compute}ms) = {poolSize.toFixed(2)} → {poolSizeRounded}
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'thread-pool-size-calculator',
  title: 'Thread Pool Size Calculator',
  shortTitle: 'Thread Pool Size',
  description: 'Calculate the optimal thread pool size for your application using CPU cores, utilization target, and I/O wait time. Based on the Brian Goetz formula.',
  keywords: [
    'thread pool size calculator',
    'optimal thread pool size',
    'thread pool sizing formula',
    'java thread pool calculator',
    'concurrency thread calculator',
    'io bound thread pool size',
    'cpu bound thread pool size',
    'brian goetz thread pool formula',
  ],
  category: 'api',
  icon: 'Memory',
  tagline: 'Enter your CPU count, utilization target, and I/O wait ratio to get the recommended thread pool size. Built on the Brian Goetz formula used in Java Concurrency in Practice.',
  lastUpdated: 'April 2026',
  intro: 'The thread pool size calculator helps you find the optimal number of threads for your application using the well-established Brian Goetz formula from Java Concurrency in Practice. Choosing the wrong pool size is one of the most common performance mistakes in concurrent systems — too few threads and you leave CPU cycles idle during I/O waits; too many and you pay for context-switching overhead that hurts throughput.\n\nThe formula accounts for the key variable most developers ignore: the ratio of wait time to compute time. An I/O-bound service that spends most of its time waiting on database queries or HTTP responses can safely run far more threads than its CPU count suggests. A CPU-bound workload like image processing or cryptography should stay close to the number of physical cores.\n\nThis calculator is useful for sizing thread pools in Java (Executors, Spring, Tomcat), Go goroutine worker pools, Node.js cluster workers, Python ThreadPoolExecutor, and any system where you control concurrency limits. It is equally applicable to connection pools for databases and HTTP clients.\n\nInput your server\'s CPU count, the fraction of CPU you want to target (leave headroom for the OS and other processes), and the average wait-to-compute ratio for your workload. The result is the minimum pool size needed to hit your utilization target — round up and add a small buffer for production deployments.',
  howItWorksTitle: 'How to Calculate Thread Pool Size',
  howItWorksImage: '/images/calculators/thread-pool-size-calculator-how-it-works.svg',
  howItWorks: '1. Count available CPU cores on your server (logical cores, including hyperthreads).\n2. Set a target CPU utilization — typically 70–80% to leave headroom for GC, OS tasks, and traffic spikes.\n3. Profile a representative request to measure average I/O wait time (database, network, disk) and pure compute time.\n4. Divide wait time by compute time to get the blocking coefficient.\n5. Apply the formula: Pool Size = CPU Cores × Utilization × (1 + Wait / Compute).\n6. Ceil the result and add 10–20% buffer for production deployments.',
  formula: 'Pool Size = CPU Cores × (CPU Utilization / 100) × (1 + Wait Time / Compute Time)\n\nCPU Cores        — logical cores available to the process\nCPU Utilization  — fraction of CPU to target (e.g. 80 for 80%)\nWait Time        — average time per request spent blocked on I/O (ms)\nCompute Time     — average time per request spent on CPU work (ms)\n\nSource: Brian Goetz, Java Concurrency in Practice (2006)',
  examplesTitle: 'Example Thread Pool Size Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — I/O-bound REST API (typical web service)',
      body: 'CPU Cores:    8\nUtilization:  80%\nWait Time:    200 ms  (DB query + network)\nCompute Time:  20 ms  (JSON serialisation)\n\nPool Size = 8 × 0.80 × (1 + 200 / 20)\n          = 8 × 0.80 × 11\n          = 70.4  →  71 threads',
    },
    {
      title: 'Example 2 — CPU-bound image processing service',
      body: 'CPU Cores:   16\nUtilization:  70%\nWait Time:    10 ms  (minimal I/O)\nCompute Time: 90 ms  (resize + encode)\n\nPool Size = 16 × 0.70 × (1 + 10 / 90)\n          = 16 × 0.70 × 1.11\n          = 12.4  →  13 threads',
    },
    {
      title: 'Example 3 — Mixed workload (microservice with DB + cache)',
      body: 'CPU Cores:    4\nUtilization:  75%\nWait Time:   120 ms  (DB 80 ms + Redis 40 ms)\nCompute Time:  30 ms  (business logic)\n\nPool Size = 4 × 0.75 × (1 + 120 / 30)\n          = 4 × 0.75 × 5\n          = 15 threads',
    },
  ],
  tipsTitle: 'Tips for Sizing Thread Pools in Production',
  tips: [
    'Profile before you size. Measure actual wait time and compute time under realistic load — synthetic benchmarks often underestimate I/O latency, leading to under-sized pools.',
    'Leave CPU headroom. Target 70–80% utilisation, not 100%. The remaining 20–30% absorbs GC pauses, traffic bursts, and OS scheduling without causing latency spikes.',
    'Size connection pools to match your thread pool. If you have 70 threads hitting a database, your DB connection pool must be at least 70 — otherwise threads will queue waiting for a connection.',
    'Use the <a href="/calculators/concurrency-calculator">Concurrency Calculator</a> alongside this tool to verify your pool can sustain your target QPS without queuing.',
    'Monitor queue depth, not just thread count. A healthy pool has near-zero queue depth at steady state. Growing queues signal the pool is too small or upstream services are slowing down.',
    'Re-measure after major changes. Adding caching, switching databases, or changing frameworks all shifts the wait/compute ratio significantly — recalculate after each architectural change.',
  ],
  faq: [
    {
      question: 'What is the Brian Goetz thread pool formula?',
      answer: 'The Brian Goetz formula from Java Concurrency in Practice states: Thread Pool Size = CPU Cores × Target CPU Utilization × (1 + Wait Time / Compute Time). It accounts for the blocking coefficient — the ratio of I/O wait to CPU work — which determines how many threads can usefully run without leaving cores idle. It is the most widely cited practical formula for thread pool sizing.',
    },
    {
      question: 'How many threads should I use for an I/O-bound service?',
      answer: 'For a typical I/O-bound service where requests spend 90% of their time waiting on databases or network calls, the pool size should be much larger than CPU count — often 10–20× more. Use this calculator with your actual wait and compute measurements. A common starting point for web services on an 8-core machine is 50–100 threads, tuned down from profiling data.',
    },
    {
      question: 'How many threads should I use for a CPU-bound service?',
      answer: 'For CPU-bound work — image processing, cryptography, data compression — keep the pool close to the number of logical CPU cores, typically cores × 0.75 to cores × 1.0. Adding more threads than cores causes context-switching overhead that reduces throughput. Leave at least 20% CPU headroom for the OS, GC, and other processes running on the same machine.',
    },
    {
      question: 'What is the difference between a thread pool and a connection pool?',
      answer: 'A thread pool limits concurrent execution units in your application. A connection pool limits simultaneous connections to an external resource like a database. They are separate resources but must be sized together — if your thread pool has 70 threads all making DB calls, your connection pool must also be at least 70 or threads will block waiting for a free connection, negating the benefit of a larger thread pool.',
    },
    {
      question: 'Does this formula work for Go, Python, or Node.js?',
      answer: 'Yes, for any system where you control a worker count or pool size. In Go, apply it to goroutine worker pools backed by a semaphore. In Python, use it for ThreadPoolExecutor or Celery worker counts. Node.js is single-threaded for JS but uses a libuv thread pool for I/O — set UV_THREADPOOL_SIZE using this formula. The math is language-agnostic; only the wait/compute ratio matters.',
    },
  ],
  relatedSlugs: ['concurrency-calculator', 'qps-calculator', 'latency-budget-calculator'],
};

export const threadPoolSizeCalculator: CalculatorDefinition = { meta, Component: ThreadPoolSizeUI };
