import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function KubernetesResourceUI() {
  const [replicas, setReplicas] = useState<string>('3');
  const [cpuRequest, setCpuRequest] = useState<string>('250');
  const [memRequest, setMemRequest] = useState<string>('512');
  const [cpuLimit, setCpuLimit] = useState<string>('500');
  const [memLimit, setMemLimit] = useState<string>('1024');

  const pods = parseFloat(replicas) || 0;
  const cpuReq = parseFloat(cpuRequest) || 0;
  const memReq = parseFloat(memRequest) || 0;
  const cpuLim = parseFloat(cpuLimit) || 0;
  const memLim = parseFloat(memLimit) || 0;

  const totalCpuReq = pods * cpuReq;
  const totalMemReq = pods * memReq;
  const totalCpuLim = pods * cpuLim;
  const totalMemLim = pods * memLim;

  const formatCpu = (m: number) =>
    m >= 1000 ? `${(m / 1000).toFixed(2)} cores` : `${m} m`;

  const formatMem = (mib: number) =>
    mib >= 1024 ? `${(mib / 1024).toFixed(2)} GiB` : `${mib} MiB`;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Kubernetes Resource Requirements</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Replicas (pods)"
          type="number"
          value={replicas}
          onChange={(e) => setReplicas(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
        />
        <TextField
          label="CPU Request per Pod (millicores)"
          type="number"
          value={cpuRequest}
          onChange={(e) => setCpuRequest(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
        />
        <TextField
          label="Memory Request per Pod (MiB)"
          type="number"
          value={memRequest}
          onChange={(e) => setMemRequest(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="CPU Limit per Pod (millicores)"
          type="number"
          value={cpuLimit}
          onChange={(e) => setCpuLimit(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
        />
        <TextField
          label="Memory Limit per Pod (MiB)"
          type="number"
          value={memLimit}
          onChange={(e) => setMemLimit(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Total CPU Requests</Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>{formatCpu(totalCpuReq)}</Typography>
            {totalCpuLim > 0 && (
              <Typography variant="body2" sx={{ opacity: 0.7 }}>limit: {formatCpu(totalCpuLim)}</Typography>
            )}
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Memory Requests</Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>{formatMem(totalMemReq)}</Typography>
            {totalMemLim > 0 && (
              <Typography variant="body2" sx={{ opacity: 0.7 }}>limit: {formatMem(totalMemLim)}</Typography>
            )}
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'kubernetes-resource-calculator',
  title: 'Kubernetes Resource Calculator',
  shortTitle: 'K8s Resources',
  description: 'Calculate Kubernetes resource requests and limits across pods. Enter replicas, CPU millicores, and memory MiB to plan cluster capacity and avoid OOMKill or throttling.',
  keywords: [
    'kubernetes resource calculator',
    'k8s resource calculator',
    'kubernetes cpu memory calculator',
    'pod resource request limit calculator',
    'kubernetes capacity planning',
    'kubernetes millicores calculator',
    'k8s cluster sizing',
    'kubernetes memory request calculator',
  ],
  category: 'general',
  icon: 'Storage',
  tagline: 'Enter your replica count, CPU requests, and memory requests to instantly see total cluster resource consumption. Includes CPU and memory limits so you can right-size nodes before deploying.',
  lastUpdated: 'April 2026',
  intro: 'The Kubernetes resource calculator helps platform engineers and DevOps teams plan cluster capacity before rolling out workloads. Kubernetes schedules pods based on resource requests — the guaranteed CPU and memory each container needs — and enforces hard caps via resource limits. Getting these numbers wrong leads to OOMKilled pods, CPU throttling, or nodes that can never be fully packed.\n\nThis calculator multiplies per-pod resource requests and limits by the number of replicas to give you the total footprint of a deployment. Use it when sizing a new node pool, estimating the cost of scaling a service horizontally, or auditing whether your current requests match actual consumption.\n\nFor services that scale dynamically via a Horizontal Pod Autoscaler (HPA), run the calculator at both your minimum and maximum replica counts to bracket the range. The difference tells you how much headroom your nodes need to absorb a surge without evicting lower-priority workloads.\n\nThe formulas here apply equally to Deployments, StatefulSets, DaemonSets (where replicas equals your node count), and ReplicaSets. All units follow the Kubernetes convention: CPU in millicores (1 core = 1000m) and memory in mebibytes (1 GiB = 1024 MiB).',
  howItWorksTitle: 'How the Kubernetes Resource Calculator Works',
  howItWorksImage: '/images/calculators/kubernetes-resource-calculator-how-it-works.svg',
  howItWorks: '1. Set your replica count — the number of pods Kubernetes will schedule for the Deployment or StatefulSet.\n2. Enter the CPU request per pod in millicores (e.g. 250m = 0.25 cores). This is what Kubernetes uses to place the pod on a node.\n3. Enter the memory request per pod in MiB (e.g. 512 MiB). Kubernetes guarantees this RAM is available before scheduling.\n4. Optionally enter CPU and memory limits — the hard caps beyond which the container is throttled (CPU) or killed (memory).\n5. The calculator multiplies each value by the replica count and converts to human-readable units (cores / GiB) when the totals are large enough.',
  formula: 'Total CPU Requests  = Replicas × CPU Request per Pod (millicores)\nTotal Memory Requests = Replicas × Memory Request per Pod (MiB)\nTotal CPU Limits    = Replicas × CPU Limit per Pod (millicores)\nTotal Memory Limits = Replicas × Memory Limit per Pod (MiB)\n\nReplicas            — number of pods scheduled by the controller\nCPU Request per Pod — guaranteed CPU in millicores (1 core = 1000m)\nMemory Request/Pod  — guaranteed RAM in MiB (1 GiB = 1024 MiB)\nCPU Limit           — hard throttle ceiling per pod (millicores)\nMemory Limit        — hard kill ceiling per pod (MiB)',
  examplesTitle: 'Example Kubernetes Resource Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Small web API (3 replicas)',
      body: 'CPU Request: 250m per pod  ×  3 replicas  =  750m  (0.75 cores)\nCPU Limit:   500m per pod  ×  3 replicas  =  1500m (1.50 cores)\nMemory Req:  512 MiB/pod   ×  3 replicas  =  1536 MiB (1.50 GiB)\nMemory Limit: 1024 MiB/pod ×  3 replicas  =  3072 MiB (3.00 GiB)\n\n→ A 4-core / 8 GiB node can fit 5 replicas before requests fill the node.',
    },
    {
      title: 'Example 2 — Java microservice scaled to 10 replicas',
      body: 'CPU Request: 500m per pod  × 10 replicas  =  5000m (5.00 cores)\nCPU Limit:  1000m per pod  × 10 replicas  = 10000m (10.00 cores)\nMemory Req: 2048 MiB/pod   × 10 replicas  = 20480 MiB (20.00 GiB)\nMemory Limit: 4096 MiB/pod × 10 replicas  = 40960 MiB (40.00 GiB)\n\n→ Plan at least 3 × 8-core nodes to satisfy requests with headroom for the OS.',
    },
    {
      title: 'Example 3 — DaemonSet on a 20-node cluster',
      body: 'Replicas = 20 (one pod per node, set replicas = node count)\nCPU Request: 100m per pod  × 20 nodes  =  2000m (2.00 cores)\nMemory Req:  128 MiB/pod   × 20 nodes  =  2560 MiB (2.50 GiB)\n\n→ Each node reserves 100m CPU and 128 MiB just for the DaemonSet agent before any workload pods are scheduled.',
    },
  ],
  tipsTitle: 'Tips for Right-Sizing Kubernetes Resources',
  tips: [
    'Start with VPA (Vertical Pod Autoscaler) in recommendation mode — it watches actual CPU and memory usage and suggests right-sized requests without changing anything, so you have real data to plug into this calculator.',
    'Never set CPU requests to 0. Kubernetes will schedule the pod on any node and it will compete unrestricted with other workloads, causing unpredictable latency spikes under load.',
    'Set memory requests equal to memory limits for critical services. This gives the pod a Guaranteed QoS class — Kubernetes evicts BestEffort and Burstable pods first under node memory pressure.',
    'For JVM workloads, set -XX:MaxRAMPercentage=75 and make your memory limit ~33% higher than the JVM heap to leave room for off-heap allocations and avoid OOMKill surprises.',
    'Use Limit Ranges at the namespace level to enforce minimum and maximum resource values so misconfigured pods never land on a node without sensible bounds.',
    'When planning node pool size, account for ~10–15% of node capacity consumed by Kubernetes system components (kubelet, kube-proxy, CNI). A 4-core node effectively has ~3.5 cores available for workloads.',
  ],
  faq: [
    {
      question: 'What is the difference between a Kubernetes resource request and a limit?',
      answer: 'A request is the guaranteed minimum — Kubernetes only schedules a pod on a node that has at least that much free. A limit is the hard ceiling. If a container exceeds its CPU limit it is throttled; if it exceeds its memory limit, the kernel kills it (OOMKill). Setting limits higher than requests gives pods room to burst without affecting scheduling guarantees.',
    },
    {
      question: 'How many millicores is 1 CPU core in Kubernetes?',
      answer: '1 CPU core equals 1000 millicores (1000m). So 250m is one quarter of a core, 500m is half a core, and 2000m equals 2 full cores. Millicores map directly to Linux CPU shares and CFS quota, so 500m on a 2.5 GHz node does not mean 1.25 GHz — it means 50% of one logical CPU over any given 100ms scheduling period.',
    },
    {
      question: 'What happens if I do not set resource requests in Kubernetes?',
      answer: 'Pods without requests get a BestEffort QoS class. Kubernetes will schedule them anywhere and evict them first when a node runs low on memory. They can also starve other workloads by consuming unbounded CPU. Always set explicit requests for production workloads to ensure predictable scheduling and eviction priority.',
    },
    {
      question: 'How do I estimate the right CPU and memory request for a new service?',
      answer: 'Run the service under realistic load and observe peak CPU and memory usage via kubectl top pods or your metrics stack (Prometheus/Grafana). Set requests at roughly the p50 (median) observed usage and limits at p99 plus a safety buffer of 25–50%. For memory, set limits conservatively — an OOMKill restarts the pod, while a slightly oversized request only costs scheduling efficiency.',
    },
    {
      question: 'How many pods can fit on a node using this calculator?',
      answer: 'Divide the allocatable node CPU (node capacity minus system reserved) by the CPU request per pod for CPU-bound limits, and do the same for memory. The binding constraint is whichever resource fills first. For example, a node with 3.5 allocatable cores and a pod CPU request of 250m can fit at most 14 pods on CPU, so if memory allows more, CPU is the bottleneck.',
    },
  ],
  relatedSlugs: ['lambda-cost-calculator', 'concurrency-calculator', 'thread-pool-size-calculator'],
};

export const kubernetesResourceCalculator: CalculatorDefinition = { meta, Component: KubernetesResourceUI };
