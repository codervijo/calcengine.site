import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function MemoryUsageUI() {
  const [items, setItems] = useState<string>('1000000');
  const [bytesPerItem, setBytesPerItem] = useState<string>('256');
  const [overheadPct, setOverheadPct] = useState<string>('20');
  const [replicas, setReplicas] = useState<string>('3');

  const n = parseFloat(items) || 0;
  const b = parseFloat(bytesPerItem) || 0;
  const o = parseFloat(overheadPct) || 0;
  const r = parseFloat(replicas) || 1;

  const rawBytes = n * b;
  const withOverhead = rawBytes * (1 + o / 100);
  const totalBytes = withOverhead * r;

  function formatBytes(bytes: number): string {
    if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(2)} GB`;
    if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(2)} MB`;
    if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(2)} KB`;
    return `${bytes.toFixed(0)} B`;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Memory Usage</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Number of Items"
          type="number"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          slotProps={{ htmlInput: { min: '0' } }}
        />
        <TextField
          label="Bytes per Item"
          type="number"
          value={bytesPerItem}
          onChange={(e) => setBytesPerItem(e.target.value)}
          slotProps={{ htmlInput: { min: '0' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Overhead % (GC / headers / padding)"
          type="number"
          value={overheadPct}
          onChange={(e) => setOverheadPct(e.target.value)}
          slotProps={{ htmlInput: { min: '0', max: '200', step: '1' } }}
        />
        <TextField
          label="Replicas"
          type="number"
          value={replicas}
          onChange={(e) => setReplicas(e.target.value)}
          slotProps={{ htmlInput: { min: '1', step: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Memory Required</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{formatBytes(totalBytes)}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
          Raw: {formatBytes(rawBytes)} &nbsp;·&nbsp; With overhead: {formatBytes(withOverhead)} &nbsp;·&nbsp; ×{r} replicas
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'memory-usage-calculator',
  title: 'Memory Usage Calculator',
  shortTitle: 'Memory Usage',
  description: 'Calculate memory usage for any dataset or data structure. Enter item count, bytes per item, overhead %, and replicas to get total RAM requirements instantly.',
  keywords: [
    'memory usage calculator',
    'ram usage calculator',
    'memory footprint estimator',
    'heap size calculator',
    'object memory size calculator',
    'in-memory cache size calculator',
    'data structure memory calculator',
    'gc overhead memory estimator',
  ],
  category: 'performance',
  icon: 'Memory',
  tagline: 'Estimate the total RAM required for any dataset or in-memory data structure. Accounts for per-item size, runtime overhead, and replica count.',
  lastUpdated: 'April 2026',
  intro: 'A memory usage calculator helps engineers size in-memory caches, databases, and application heaps before provisioning infrastructure. Whether you\'re loading millions of records into Redis, sizing a JVM heap, or planning a distributed cache across three replicas, the formula is the same: items × bytes per item × overhead factor × replicas.\n\nRuntime overhead is the most commonly forgotten variable. A Java object carries a 16-byte header before any fields; a Go struct may be padded for alignment; a Redis key adds metadata beyond the raw string length. Typical values range from 10–25% for native runtimes to 50–100% for managed runtimes with GC pressure.\n\nThis calculator is useful for backend engineers capacity-planning a new service, SREs estimating node memory requirements, and architects deciding between in-process and out-of-process caches. Plug in your numbers, adjust the overhead slider until it matches your profiler output, then multiply by your replication factor to get the true cluster footprint.',
  howItWorksTitle: 'How to Calculate Memory Usage',
  howItWorksImage: '/images/calculators/memory-usage-calculator-how-it-works.svg',
  howItWorks: '1. Count the number of items you need to hold in memory — rows, objects, cache entries, or events.\n2. Measure or estimate the size of one item in bytes. Use a profiler, sizeof(), or a byte-counting tool for accuracy.\n3. Set the overhead percentage to account for runtime metadata: object headers, GC bookkeeping, memory alignment padding, and hash-table load factors.\n4. Enter the number of replicas if the data will be held in multiple nodes or processes simultaneously.\n5. The calculator multiplies: Items × Bytes/Item × (1 + Overhead%) × Replicas to give total RAM.',
  formula: 'Total Memory = Items × Bytes per Item × (1 + Overhead / 100) × Replicas\n\nItems          — number of objects, rows, or cache entries\nBytes per Item — raw serialised size of one item in bytes\nOverhead %     — runtime tax: GC metadata, object headers, alignment padding\n                 (typical: 15–25% Go/Rust, 20–50% JVM, 30–100% scripting runtimes)\nReplicas       — copies held simultaneously (e.g. 3 for a 3-node Redis cluster)',
  examplesTitle: 'Example Memory Usage Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Redis cache: 5 M session objects',
      body: 'Items:       5,000,000\nBytes/item:  512 bytes  (session token + metadata)\nOverhead:    30%        (Redis per-key overhead ~100–200 B absorbed here)\nReplicas:    3\n\nRaw:         5,000,000 × 512 B          =   2,441 MB  (~2.4 GB)\nWith overhead: 2,441 MB × 1.30          =   3,173 MB  (~3.1 GB per node)\nTotal cluster: 3,173 MB × 3             =   9,519 MB  (~9.3 GB)',
    },
    {
      title: 'Example 2 — JVM heap: 10 M domain objects',
      body: 'Items:       10,000,000\nBytes/item:  128 bytes  (16-byte header + ~7 fields × ~16 bytes avg)\nOverhead:    40%        (GC bookkeeping, compressed oops, fragmentation)\nReplicas:    1\n\nRaw:         10,000,000 × 128 B         =   1,221 MB  (~1.2 GB)\nWith overhead: 1,221 MB × 1.40          =   1,709 MB  (~1.7 GB)\n→ Set -Xmx to at least 2 GB with headroom for GC spikes.',
    },
    {
      title: 'Example 3 — In-process Go cache: 1 M structs',
      body: 'Items:       1,000,000\nBytes/item:  64 bytes   (4 × int64 + 1 × string header)\nOverhead:    15%        (map bucket overhead, alignment padding)\nReplicas:    2          (two app pods each holding full dataset)\n\nRaw:         1,000,000 × 64 B           =     61 MB\nWith overhead: 61 MB × 1.15             =     70 MB per pod\nTotal:         70 MB × 2               =    140 MB across fleet',
    },
  ],
  tipsTitle: 'Tips to Reduce Memory Usage',
  tips: [
    'Profile before estimating. Use a heap dump (JVM), pprof (Go), or <code>valgrind --tool=massif</code> (C/C++) to get the actual bytes-per-object, not a theoretical struct size.',
    'Choose compact types. Replacing a <code>string</code> UUID with a 16-byte <code>[]byte</code> UUID cuts 40+ bytes of header overhead per object in most runtimes.',
    'Set cache eviction policies. LRU or TTL-based eviction bounds memory growth. Without it, in-memory caches grow until the process is OOM-killed.',
    'Pool objects when possible. Object pools (sync.Pool in Go, commons-pool in Java) reuse allocations and cut GC overhead from 30–50% down to under 10%.',
    'Use columnar layouts for large datasets. Column-oriented storage (Apache Arrow, DuckDB) compresses repeated values and halves memory versus row-oriented records.',
    'Benchmark your replica overhead separately. If your replicas share a read-only memory-mapped file, actual RAM usage may be much lower than the naive Items × Replicas estimate.',
  ],
  faq: [
    {
      question: 'How do I find the exact size of an object in my language?',
      answer: 'In Go use <code>unsafe.Sizeof()</code> or the <code>pprof</code> heap profile. In Java, use Java Object Layout (JOL) or a heap dump analyzed with Eclipse MAT. In Python, use <code>sys.getsizeof()</code> but note it only measures the top-level object. In C/C++ use <code>sizeof()</code>. For Redis, run <code>OBJECT ENCODING key</code> and <code>OBJECT IDLETIME key</code> alongside <code>DEBUG OBJECT key</code>.',
    },
    {
      question: 'What overhead percentage should I use for the JVM?',
      answer: 'Start with 30–50% for typical JVM workloads. A Java object carries a 16-byte header on most JVMs. Collections like HashMap add ~48 bytes per entry beyond the raw key and value. With G1GC or ZGC, add another 5–10% for GC metadata regions. Profile with JOL or a heap dump to validate — the right number varies by object graph complexity.',
    },
    {
      question: 'How much overhead does Redis add per key?',
      answer: 'Redis adds roughly 50–100 bytes of overhead per key for the dictionary entry, linked-list pointers, LRU clock, and expiry metadata. Small string values stored as embstr cost less than values stored as raw strings. For integers in the range 0–9999, Redis uses a shared object pool with zero extra allocation. Use <code>MEMORY USAGE key</code> on Redis 4+ to measure actual consumption for a specific key.',
    },
    {
      question: 'Why does my measured memory usage differ from this calculator?',
      answer: 'Three common causes: (1) your "bytes per item" estimate is too low — remember object headers, padding, and pointer widths; (2) your runtime allocates memory in pages or arenas, so actual RSS is rounded up to the nearest allocator block; (3) virtual memory (VSZ) is being confused with resident set size (RSS). Always compare against RSS, not VSZ. Adjust the overhead percentage until the calculator output matches your profiler.',
    },
    {
      question: 'How do I calculate memory for a hash map vs a plain array?',
      answer: 'An array of N items costs roughly N × bytes-per-item with minimal overhead. A hash map adds a backing array sized at N ÷ load-factor (typically 0.75), plus per-entry metadata. For a Java HashMap of N entries, expect ~(N ÷ 0.75) × 48 bytes for the table alone, on top of key and value sizes. Use the <a href="/calculators/index-size-calculator">Index Size Calculator</a> to model index memory separately.',
    },
  ],
  relatedSlugs: ['cpu-usage-estimator', 'pod-capacity-calculator', 'thread-pool-size-calculator', 'kubernetes-resource-calculator'],
};

export const memoryUsageCalculator: CalculatorDefinition = { meta, Component: MemoryUsageUI };
