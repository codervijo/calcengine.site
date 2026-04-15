import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function PodCapacityUI() {
  const [nodeCpu, setNodeCpu] = useState<string>('4');
  const [nodeMemory, setNodeMemory] = useState<string>('16384');
  const [podCpu, setPodCpu] = useState<string>('250');
  const [podMemory, setPodMemory] = useState<string>('512');

  const nodeCpuMilli = (parseFloat(nodeCpu) || 0) * 1000;
  const nodeMemMib = parseFloat(nodeMemory) || 0;
  const podCpuMilli = parseFloat(podCpu) || 1;
  const podMemMib = parseFloat(podMemory) || 1;

  const podsByCpu = nodeCpuMilli > 0 && podCpuMilli > 0 ? Math.floor(nodeCpuMilli / podCpuMilli) : 0;
  const podsByMemory = nodeMemMib > 0 && podMemMib > 0 ? Math.floor(nodeMemMib / podMemMib) : 0;
  const maxPods = Math.min(podsByCpu, podsByMemory);
  const bottleneck = podsByCpu <= podsByMemory ? 'CPU' : 'Memory';

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Pod Capacity</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Node CPU (cores)"
          type="number"
          value={nodeCpu}
          onChange={(e) => setNodeCpu(e.target.value)}
          slotProps={{ htmlInput: { step: '0.5', min: '0' } }}
          helperText="e.g. 4 for a 4-core node"
        />
        <TextField
          label="Node Memory (MiB)"
          type="number"
          value={nodeMemory}
          onChange={(e) => setNodeMemory(e.target.value)}
          slotProps={{ htmlInput: { step: '256', min: '0' } }}
          helperText="e.g. 16384 for 16 GiB"
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Pod CPU Request (millicores)"
          type="number"
          value={podCpu}
          onChange={(e) => setPodCpu(e.target.value)}
          slotProps={{ htmlInput: { step: '50', min: '1' } }}
          helperText="e.g. 250 = 0.25 cores"
        />
        <TextField
          label="Pod Memory Request (MiB)"
          type="number"
          value={podMemory}
          onChange={(e) => setPodMemory(e.target.value)}
          slotProps={{ htmlInput: { step: '64', min: '1' } }}
          helperText="e.g. 512 = 512 MiB"
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ flex: 1, bgcolor: '#eff6ff', border: '1.5px solid #bfdbfe', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#1e40af' }}>Pods by CPU</Typography>
          <Typography variant="h4" component="p" sx={{ fontWeight: 700, color: '#1e40af' }}>{podsByCpu}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#eff6ff', border: '1.5px solid #bfdbfe', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#1e40af' }}>Pods by Memory</Typography>
          <Typography variant="h4" component="p" sx={{ fontWeight: 700, color: '#1e40af' }}>{podsByMemory}</Typography>
        </Box>
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Max Pods per Node (bottleneck: {bottleneck})</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{maxPods}</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'pod-capacity-calculator',
  title: 'Pod Capacity Calculator',
  shortTitle: 'Pod Capacity',
  description: 'Calculate how many pods fit on a Kubernetes node using CPU and memory requests. Instantly find your scheduling bottleneck — no cluster access required.',
  keywords: [
    'pod capacity calculator',
    'kubernetes pod capacity',
    'pods per node calculator',
    'kubernetes node capacity',
    'pod scheduling calculator',
    'kubernetes resource calculator',
    'container capacity planner',
  ],
  category: 'general',
  icon: 'Memory',
  tagline: 'Enter your node size and pod resource requests to instantly see how many pods fit — and which resource is your scheduling bottleneck.',
  lastUpdated: 'April 2026',
  intro: 'The pod capacity calculator tells you exactly how many Kubernetes pods can be scheduled onto a single node given its CPU and memory. Kubernetes uses resource requests — not limits — for scheduling decisions, so a node with 4 cores can only fit pods whose CPU requests sum to ≤4 cores, regardless of actual utilisation.\n\nPlatform engineers use this calculation when sizing node pools, choosing instance types, or debugging why pods are stuck in Pending state. The answer is always a min() of two independent constraints: how many pods fit by CPU and how many fit by memory. Whichever number is smaller is your bottleneck.\n\nNote that Kubernetes reserves some capacity for system components (kubelet, kube-proxy, OS daemons). For production clusters, subtract roughly 100–300 millicores and 512–1024 MiB from the raw node capacity before entering values above. Allocatable capacity can be checked with <code>kubectl describe node</code> under the Allocatable section.\n\nThis calculator is intentionally simple: it models a single node with uniform pods. For mixed workloads, repeat the calculation per pod type and sum across your node pool.',
  howItWorksTitle: 'How to Calculate Pod Capacity per Node',
  howItWorksImage: '/images/calculators/pod-capacity-calculator-how-it-works.svg',
  howItWorks: '1. Find your node\'s allocatable CPU and memory — use `kubectl describe node` and read the Allocatable section, not Capacity.\n2. Note your pod\'s CPU request in millicores (e.g. 250m = 0.25 cores) and memory request in MiB.\n3. Divide allocatable CPU (in millicores) by pod CPU request. Take the floor. This is the max pods by CPU.\n4. Divide allocatable memory (in MiB) by pod memory request. Take the floor. This is the max pods by memory.\n5. The actual max pods is the minimum of the two. The resource that produces the smaller number is your scheduling bottleneck.',
  formula: 'Pods by CPU    = floor(Node CPU (millicores) ÷ Pod CPU Request (millicores))\nPods by Memory = floor(Node Memory (MiB) ÷ Pod Memory Request (MiB))\nMax Pods       = min(Pods by CPU, Pods by Memory)\n\nNode CPU       — allocatable CPU in millicores (1 core = 1000m)\nNode Memory    — allocatable memory in MiB (1 GiB = 1024 MiB)\nPod CPU Request   — Kubernetes resource.requests.cpu, in millicores\nPod Memory Request — Kubernetes resource.requests.memory, in MiB',
  examplesTitle: 'Example Pod Capacity Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Standard web service on a 4-core / 16 GiB node',
      body: 'Node: 4 cores (4000m) CPU, 16 GiB (16384 MiB) memory\nPod requests: 250m CPU, 512 MiB memory\n\nPods by CPU    = floor(4000 ÷ 250) = 16\nPods by Memory = floor(16384 ÷ 512) = 32\nMax Pods = min(16, 32) = 16  ← CPU is the bottleneck',
    },
    {
      title: 'Example 2 — Memory-heavy ML inference pod on an 8-core / 32 GiB node',
      body: 'Node: 8 cores (8000m) CPU, 32 GiB (32768 MiB) memory\nPod requests: 500m CPU, 6144 MiB (6 GiB) memory\n\nPods by CPU    = floor(8000 ÷ 500) = 16\nPods by Memory = floor(32768 ÷ 6144) = 5\nMax Pods = min(16, 5) = 5  ← Memory is the bottleneck',
    },
    {
      title: 'Example 3 — Microservice on a t3.medium (2 vCPU / 4 GiB) node with system overhead',
      body: 'Raw node: 2 cores (2000m), 4 GiB (4096 MiB)\nAfter system reservation (~200m CPU, 512 MiB): 1800m CPU, 3584 MiB\nPod requests: 100m CPU, 128 MiB memory\n\nPods by CPU    = floor(1800 ÷ 100) = 18\nPods by Memory = floor(3584 ÷ 128) = 28\nMax Pods = min(18, 28) = 18  ← CPU is the bottleneck',
    },
  ],
  tipsTitle: 'Tips to Maximise Kubernetes Node Utilisation',
  tips: [
    'Always use <code>kubectl describe node</code> to get Allocatable CPU and memory, not raw Capacity — kubelet reserves resources for system processes and the difference can be significant.',
    'Right-size pod requests to match actual p95 usage, not peak. Oversized requests leave unused capacity on the node while starving the scheduler of headroom.',
    'If CPU is your bottleneck, consider CPU-optimised instance types (e.g. AWS c6i, GCP c2) over general-purpose ones for your compute-bound pods.',
    'If memory is your bottleneck, reduce JVM heap sizes, enable Go\'s GOMEMLIMIT, or use slim base images. Even a 64 MiB reduction per pod adds up across a node.',
    'Use pod topology spread constraints and pod disruption budgets together to ensure capacity is spread across nodes — not packed onto one until it hits the limit.',
    'Vertical Pod Autoscaler (VPA) can observe actual usage and recommend tighter requests automatically, reclaiming wasted capacity without manual tuning.',
  ],
  faq: [
    {
      question: 'What is the difference between pod CPU requests and limits in Kubernetes?',
      answer: 'Requests are what the scheduler uses to place pods — a pod with a 250m CPU request will only be placed on a node with 250m of unallocated CPU. Limits are a runtime cap that throttles the container if it exceeds the value. Scheduling decisions are based entirely on requests, so this calculator uses requests. Setting limits much higher than requests is called overcommitting.',
    },
    {
      question: 'Why does my node show fewer allocatable pods than this calculator?',
      answer: 'Kubernetes applies two layers of reservation on top of resource requests. First, kube-reserved and system-reserved subtract CPU and memory for kubelet and OS daemons. Second, there is a hard per-node pod limit (default 110 in kubeadm, configurable via --max-pods). Run <code>kubectl describe node</code> and check the Allocatable section and the "pods" line to see both constraints for your specific node.',
    },
    {
      question: 'How do I find my pod\'s current CPU and memory requests?',
      answer: 'Run <code>kubectl get pod &lt;name&gt; -o jsonpath=\'{.spec.containers[*].resources}\'</code> to see requests and limits for all containers in the pod. If requests are unset, the pod has no guaranteed scheduling resources and will be placed anywhere — which also means it can be evicted first under memory pressure.',
    },
    {
      question: 'Does the Kubernetes pod limit of 110 pods per node override resource capacity?',
      answer: 'Yes. Kubernetes enforces a maximum pod count per node (default 110, but configurable with --max-pods on the kubelet). Even if your resources allow more pods, the scheduler will not exceed that limit. Managed Kubernetes services like EKS, GKE, and AKS each have their own per-node pod limits based on CNI plugin and instance type — check your provider\'s documentation.',
    },
    {
      question: 'How many nodes do I need to run N pods?',
      answer: 'Divide the total number of pods by the max pods per node from this calculator, then round up: nodes = ceil(N ÷ max_pods_per_node). Add at least one extra node for rolling updates and disruption budget headroom. For production, plan for N+1 or N+2 nodes so that losing one node does not breach your pod availability targets.',
    },
  ],
  relatedSlugs: ['kubernetes-resource-calculator', 'thread-pool-size-calculator', 'concurrency-calculator'],
};

export const podCapacityCalculator: CalculatorDefinition = { meta, Component: PodCapacityUI };
