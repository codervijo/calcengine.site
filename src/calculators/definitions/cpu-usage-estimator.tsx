import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function CpuUsageEstimatorUI() {
  const [rps, setRps] = useState<string>('100');
  const [cpuMs, setCpuMs] = useState<string>('5');
  const [cores, setCores] = useState<string>('4');

  const r = parseFloat(rps) || 0;
  const c = parseFloat(cpuMs) || 0;
  const n = parseFloat(cores) || 1;

  const usagePct = (r * c) / (n * 1000) * 100;
  const display = usagePct > 999 ? usagePct.toFixed(0) : usagePct.toFixed(2);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Estimate CPU Usage</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Requests per Second (RPS)"
          type="number"
          value={rps}
          onChange={(e) => setRps(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
        />
        <TextField
          label="CPU Time per Request (ms)"
          type="number"
          value={cpuMs}
          onChange={(e) => setCpuMs(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '0.1' } }}
        />
        <TextField
          label="CPU Cores"
          type="number"
          value={cores}
          onChange={(e) => setCores(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated CPU Usage</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{display}%</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          across {cores || 1} core{parseFloat(cores) !== 1 ? 's' : ''}
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'cpu-usage-estimator',
  title: 'CPU Usage Estimator',
  shortTitle: 'CPU Usage',
  description: 'Estimate CPU usage percentage from requests per second, CPU time per request, and core count. Free cpu usage estimator for backend capacity planning.',
  keywords: [
    'cpu usage estimator',
    'cpu utilization calculator',
    'cpu capacity planning',
    'requests per second cpu',
    'server cpu usage calculator',
    'cpu load estimator',
    'backend cpu usage',
    'cpu cores calculator',
  ],
  category: 'performance',
  icon: 'Speed',
  tagline: 'Enter your request rate, per-request CPU time, and core count to instantly estimate CPU utilization. Useful for capacity planning, auto-scaling thresholds, and load-test analysis.',
  lastUpdated: 'April 2026',
  intro: 'A cpu usage estimator tells you what fraction of your server\'s processing capacity a given workload will consume, before you deploy it or a traffic spike hits. The core idea is simple: multiply how many requests arrive each second by how long each one burns the CPU, then divide by the total CPU time your server can deliver per second across all cores.\n\nBackend engineers use this calculation when sizing EC2 instances, setting Kubernetes resource requests, or deciding whether a new endpoint can share a pod with an existing service. Getting it wrong in either direction costs money (over-provisioned) or causes outages (under-provisioned).\n\nThe CPU time per request value comes from profiling or APM data — look for the mean CPU duration in tools like Datadog, Pyroscope, or the AWS CloudWatch contributor insights. If you only have wall-clock latency, subtract I/O wait time (network, DB queries) to isolate true CPU burn.\n\nThis estimator works for any language and runtime: Node.js, Python, Go, JVM, or native. For I/O-bound services where threads block, pair this with the <a href="/calculators/concurrency-calculator">Concurrency Calculator</a> to understand thread-pool headroom alongside CPU headroom.',
  howItWorksTitle: 'How the CPU Usage Estimator Calculates Utilization',
  howItWorksImage: '/images/calculators/cpu-usage-estimator-how-it-works.svg',
  howItWorks: '1. Measure or estimate the average CPU time your service spends per request in milliseconds — use profiling data, APM traces, or a load test.\n2. Know your request arrival rate in requests per second (RPS) — from logs, an APM dashboard, or projected growth.\n3. Enter the number of logical CPU cores available to the process (vCPUs on cloud instances count as cores).\n4. The calculator multiplies RPS × CPU ms to get total CPU work per second, then divides by cores × 1000 ms to get the fraction of capacity consumed.\n5. The result is the estimated CPU utilization as a percentage. Targets above 70–80% warrant adding cores or optimising the hot path.',
  formula: 'CPU Usage (%) = (RPS × CPU ms per request) / (Cores × 1000) × 100\n\nRPS              — requests arriving per second\nCPU ms/request   — average CPU time consumed per request (milliseconds)\nCores            — number of logical CPU cores available\n1000             — milliseconds per second (normalisation constant)',
  examplesTitle: 'Example CPU Usage Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Node.js API at moderate load',
      body: 'RPS: 100   ×   CPU ms: 5 ms   =   500 ms/s of CPU work\nCores: 4   →   capacity = 4 × 1,000 = 4,000 ms/s\nCPU Usage = 500 / 4,000 × 100 = 12.5%\n— Well within safe limits; plenty of headroom for traffic spikes.',
    },
    {
      title: 'Example 2 — Python Flask service approaching saturation',
      body: 'RPS: 80   ×   CPU ms: 45 ms   =   3,600 ms/s of CPU work\nCores: 4   →   capacity = 4,000 ms/s\nCPU Usage = 3,600 / 4,000 × 100 = 90%\n— Dangerously high. Add 2 more cores or reduce CPU ms to ~22 ms to stay below 70%.',
    },
    {
      title: 'Example 3 — Go microservice on a 16-core instance',
      body: 'RPS: 5,000   ×   CPU ms: 0.8 ms   =   4,000 ms/s of CPU work\nCores: 16   →   capacity = 16,000 ms/s\nCPU Usage = 4,000 / 16,000 × 100 = 25%\n— Efficient. Could right-size to an 8-core instance (50% usage) and halve the compute bill.',
    },
  ],
  tipsTitle: 'Tips for Accurate CPU Capacity Planning',
  tips: [
    'Profile under realistic load, not idle. CPU time per request measured during a load test is far more accurate than a single ad-hoc call — cold JIT, caches, and GC pauses all affect the number.',
    'Target 60–70% steady-state utilisation to absorb traffic spikes without service degradation. At 80%+ even small bursts cause latency tail blowout.',
    'On Kubernetes, set <code>resources.requests.cpu</code> to your estimated steady-state usage and <code>resources.limits.cpu</code> to your spike ceiling. Mismatched values are the #1 cause of unexpected throttling.',
    'Separate CPU time from wall-clock time. A request that takes 200 ms end-to-end may only burn 8 ms of CPU — the rest is network or DB wait. Use the CPU-only number in this estimator.',
    'Use the <a href="/calculators/thread-pool-size-calculator">Thread Pool Size Calculator</a> alongside this tool if your service spawns threads per request — CPU saturation and thread exhaustion are independent failure modes.',
    'Re-estimate after every major dependency upgrade, framework version bump, or query plan change. CPU profiles drift significantly across releases.',
  ],
  faq: [
    {
      question: 'What is a safe CPU usage percentage for a production server?',
      answer: 'Keep steady-state CPU below 60–70% to leave room for traffic spikes, GC pauses, and background jobs. At 80%+ average utilisation, any burst can saturate the CPU and cause latency to spike or requests to queue. Cloud auto-scaling typically triggers at 70–75% to allow new instances to provision before saturation.',
    },
    {
      question: 'How do I measure CPU time per request for my service?',
      answer: 'Use APM tools like Datadog, New Relic, or Pyroscope to get per-request CPU flame graphs. For a quick estimate, run a load test with a CPU profiler attached and divide total CPU time by total requests processed. Subtract I/O wait time — you want CPU burn only, not wall-clock latency, which includes network and database round trips.',
    },
    {
      question: 'Does this formula work for multi-threaded or async services?',
      answer: 'Yes for CPU-bound work. Async and non-blocking I/O reduce thread count but do not change how many CPU cycles are consumed per request. Enter the actual CPU ms burned per request from profiling data. For services where requests block threads waiting on I/O, also check the <a href="/calculators/concurrency-calculator">Concurrency Calculator</a> to size your thread pool correctly alongside CPU.',
    },
    {
      question: 'How many vCPUs does a cloud instance actually give me?',
      answer: 'On AWS, GCP, and Azure, one vCPU equals one hyperthread on a physical core — roughly half a physical core\'s compute. For CPU-intensive workloads, physical core count matters; for typical web services, vCPU count is the right number to enter here. Check your instance\'s advertised vCPU count in the cloud provider\'s instance type documentation.',
    },
    {
      question: 'What if my CPU usage estimate exceeds 100%?',
      answer: 'It means the workload exceeds your available CPU capacity. Requests will queue, latency will increase, and eventually timeouts will cascade into errors. Fix it by adding CPU cores (scale out or up), reducing CPU time per request via code optimisation or caching, or shedding load with rate limiting. Use the <a href="/calculators/qps-calculator">QPS Calculator</a> to find the maximum safe request rate for your current core count.',
    },
  ],
  relatedSlugs: ['qps-calculator', 'thread-pool-size-calculator', 'concurrency-calculator', 'latency-budget-calculator'],
};

export const cpuUsageEstimatorCalculator: CalculatorDefinition = { meta, Component: CpuUsageEstimatorUI };
