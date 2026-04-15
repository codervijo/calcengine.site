import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function DiskIOPSUI() {
  const [seekTime, setSeekTime] = useState<string>('8');
  const [rpm, setRpm] = useState<string>('7200');
  const [blockSize, setBlockSize] = useState<string>('4');
  const [transferRate, setTransferRate] = useState<string>('100');

  const seek = parseFloat(seekTime) || 0;
  const rpmVal = parseFloat(rpm) || 0;
  const block = parseFloat(blockSize) || 0;
  const rate = parseFloat(transferRate) || 0;

  const rotLatency = rpmVal > 0 ? (60000 / rpmVal) / 2 : 0;
  const transferTime = rate > 0 && block > 0 ? (block / 1024 / rate) * 1000 : 0;
  const ioTime = seek + rotLatency + transferTime;
  const iops = ioTime > 0 ? Math.round(1000 / ioTime) : 0;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Disk IOPS</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Seek Time (ms)"
          type="number"
          value={seekTime}
          onChange={(e) => setSeekTime(e.target.value)}
          slotProps={{ htmlInput: { step: '0.1', min: '0' } }}
          helperText="HDD ~8 ms · SSD ~0.1 ms"
        />
        <TextField
          label="Disk RPM"
          type="number"
          value={rpm}
          onChange={(e) => setRpm(e.target.value)}
          slotProps={{ htmlInput: { step: '100', min: '0' } }}
          helperText="5400 / 7200 / 10k / 15k · 0 for SSD"
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Block Size (KB)"
          type="number"
          value={blockSize}
          onChange={(e) => setBlockSize(e.target.value)}
          slotProps={{ htmlInput: { step: '1', min: '1' } }}
          helperText="4 KB for databases · 64–512 KB for streaming"
        />
        <TextField
          label="Transfer Rate (MB/s)"
          type="number"
          value={transferRate}
          onChange={(e) => setTransferRate(e.target.value)}
          slotProps={{ htmlInput: { step: '1', min: '1' } }}
          helperText="From drive spec sheet or benchmark"
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated IOPS</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{iops.toLocaleString()}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
          Rot. latency: {rotLatency.toFixed(2)} ms · Transfer: {transferTime.toFixed(3)} ms · IO time: {ioTime.toFixed(2)} ms
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'disk-iops-calculator',
  title: 'Disk IOPS Calculator',
  shortTitle: 'Disk IOPS',
  description: 'Calculate disk IOPS from seek time, RPM, block size, and transfer rate. Instantly estimate HDD and SSD storage performance — no sign-up required.',
  keywords: [
    'disk iops calculator',
    'hdd iops calculator',
    'ssd iops calculator',
    'storage iops estimator',
    'disk performance calculator',
    'iops per second calculator',
    'rotational latency calculator',
    'disk throughput estimator',
  ],
  category: 'general',
  icon: 'Storage',
  tagline: 'Calculate disk IOPS from seek time, RPM, block size, and transfer rate. Works for HDDs, SSDs, and NVMe drives — enter your drive specs and get an instant result.',
  lastUpdated: 'April 2026',
  intro: 'A disk IOPS calculator helps you estimate how many input/output operations per second your storage can sustain before becoming a bottleneck. IOPS is the single most important metric for random-access workloads — databases, virtual machines, and transaction logs all depend on it. Knowing your drive\'s IOPS ceiling lets you right-size storage before deploying to production.\n\nStorage engineers, DBAs, and DevOps teams use this calculation to compare drive tiers, validate cloud storage choices, and size RAID arrays. Hard drives are limited by mechanical movement — seek time and rotational latency dominate IO time — while SSDs eliminate rotation entirely, pushing IOPS into the tens of thousands. NVMe drives remove the SATA bottleneck too, with IOPS exceeding one million on high-end models.\n\nThe formula above calculates maximum theoretical IOPS for random 4K reads. Real-world IOPS will vary with queue depth, filesystem overhead, and mixed read/write ratios, but this figure gives you a useful upper bound for capacity planning and drive comparisons.\n\nTo model the cost of storing data on cloud storage tiers alongside this performance estimate, use the Storage Cost Calculator.',
  howItWorksTitle: 'How to Calculate Disk IOPS',
  howItWorksImage: '/images/calculators/disk-iops-calculator-how-it-works.svg',
  howItWorks: '1. Enter seek time — the time in milliseconds for the disk head to move to the correct track. Typical HDDs: 8–12 ms. SSDs: 0.05–0.1 ms.\n2. Enter disk RPM — used to derive rotational latency. Common values: 5400, 7200, 10000, 15000. Enter 0 for SSDs (no rotation).\n3. Enter block size in KB — the granularity of each IO operation. Use 4 KB for database workloads, 64–512 KB for large sequential reads.\n4. Enter transfer rate in MB/s — your drive\'s sequential transfer speed, found on the spec sheet or measured with a benchmark tool.\n5. The calculator derives: Rotational Latency = (60,000 / RPM) / 2; Transfer Time = (Block KB / 1024) / Rate × 1000; IO Time = Seek + Rot. Latency + Transfer Time; IOPS = 1000 / IO Time.',
  formula: 'IOPS = 1000 / IO Time\n\nIO Time (ms)            = Seek Time + Rotational Latency + Transfer Time\nRotational Latency (ms) = (60,000 / RPM) / 2\nTransfer Time (ms)      = (Block Size KB / 1024) / Transfer Rate MB/s × 1000\n\nSeek Time       — time to position the read/write head over the correct track (ms)\nRotational Latency — average time to wait for the sector to rotate under the head (ms)\nTransfer Time   — time to read the data block once positioned (ms)\nIO Time         — total elapsed time per IO operation (ms)\nIOPS            — maximum random IO operations per second',
  examplesTitle: 'Example Disk IOPS Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — 7200 RPM HDD (typical desktop / NAS drive)',
      body: 'Seek Time:         8.00 ms\nRot. Latency:      60,000 / 7200 / 2  =  4.17 ms\nTransfer Time:     (4 KB / 1024) / 100 MB/s × 1000  =  0.039 ms\n                                                         ──────────────\nIO Time:           8.00 + 4.17 + 0.039  =  12.21 ms\nIOPS:              1000 / 12.21  ≈  82 IOPS',
    },
    {
      title: 'Example 2 — Consumer SATA SSD (e.g. Samsung 870 EVO)',
      body: 'Seek Time:         0.10 ms\nRot. Latency:      0 ms  (no rotating platter)\nTransfer Time:     (4 KB / 1024) / 550 MB/s × 1000  =  0.007 ms\n                                                         ──────────────\nIO Time:           0.10 + 0 + 0.007  =  0.107 ms\nIOPS:              1000 / 0.107  ≈  9,346 IOPS',
    },
    {
      title: 'Example 3 — 15,000 RPM Enterprise SAS Drive',
      body: 'Seek Time:         3.50 ms\nRot. Latency:      60,000 / 15,000 / 2  =  2.00 ms\nTransfer Time:     (4 KB / 1024) / 200 MB/s × 1000  =  0.020 ms\n                                                         ──────────────\nIO Time:           3.50 + 2.00 + 0.020  =  5.52 ms\nIOPS:              1000 / 5.52  ≈  181 IOPS',
    },
  ],
  tipsTitle: 'Tips to Maximise Disk IOPS',
  tips: [
    'Use SSDs for any random-access workload. A mid-range SATA SSD delivers 50–100× more IOPS than a 7200 RPM HDD at the same cost per GB in 2025.',
    'Prefer NVMe over SATA for latency-sensitive workloads. NVMe eliminates the SATA controller bottleneck, pushing random IOPS above 500k on consumer drives and beyond 1M on enterprise NVMe.',
    'Keep block size at 4 KB for databases (PostgreSQL, MySQL, MongoDB). Larger blocks increase transfer time per IO and reduce effective random IOPS at the application level.',
    'RAID-0 striping multiplies IOPS linearly — two identical drives in a stripe set roughly double IOPS. RAID-10 gives you the same benefit with redundancy. RAID-5/6 can hurt random write IOPS due to parity overhead.',
    'Monitor IO queue depth. HDDs saturate at queue depth 1–4; enterprise SSDs sustain high IOPS up to queue depth 32+. If your application issues bursts of parallel IOs, check that the queue is deep enough to keep the drive busy.',
    'For cloud VMs, provisioned IOPS storage (AWS io2, GCP Extreme PD) lets you dial in the exact IOPS you calculated and avoid noisy-neighbour throttling on gp2/pd-balanced tiers.',
  ],
  faq: [
    {
      question: 'What is IOPS and why does it matter?',
      answer: 'IOPS (Input/Output Operations Per Second) measures how many individual read or write operations a storage device completes each second. It matters because latency-sensitive workloads — databases, virtual machine disks, transaction logs — issue thousands of small random IOs per second. If IOPS is too low, queries queue up and application latency spikes regardless of CPU or memory headroom.',
    },
    {
      question: 'How many IOPS does a 7200 RPM HDD deliver?',
      answer: 'A typical 7200 RPM HDD delivers 80–120 IOPS for random 4K reads, constrained by ~8 ms seek time and ~4.2 ms rotational latency. This is the dominant bottleneck for database workloads running on spinning disks. Sequential throughput is much higher — 100–200 MB/s — but sequential IOPS still caps around 80 at 4 KB block size due to the same head-movement overhead.',
    },
    {
      question: 'How many IOPS does an NVMe SSD achieve?',
      answer: 'Consumer NVMe SSDs (PCIe 4.0) reach 500,000–1,000,000 random 4K read IOPS. Enterprise NVMe drives (Optane, PCIe 5.0) exceed 1.5M IOPS. The formula here gives a theoretical ceiling; real-world IOPS depends on queue depth, write mix, and firmware behaviour. For detailed storage sizing, pair this with the <a href="/calculators/storage-cost-calculator">Storage Cost Calculator</a> to budget cloud alternatives.',
    },
    {
      question: 'What is the difference between sequential and random IOPS?',
      answer: 'Random IOPS measures operations on scattered disk locations — this is the worst case for HDDs because the head must physically move between tracks. Sequential IOPS measures operations on contiguous data, eliminating seek time. SSDs have negligible difference between sequential and random at small block sizes. The formula on this page models random IOPS, which is the relevant metric for most application workloads.',
    },
    {
      question: 'How do I measure actual IOPS on Linux?',
      answer: 'Use <code>fio</code> — the standard storage benchmark: <code>fio --name=randread --ioengine=libaio --rw=randread --bs=4k --numjobs=4 --iodepth=32 --runtime=30 --filename=/dev/sdb</code>. For a quick live view of current IOPS, run <code>iostat -x 1</code> and read the <code>r/s</code> and <code>w/s</code> columns. Always benchmark at the block size your application actually uses for an accurate comparison.',
    },
  ],
  relatedSlugs: ['storage-cost-calculator', 'throughput-calculator', 'memory-usage-calculator'],
};

export const diskIOPSCalculator: CalculatorDefinition = { meta, Component: DiskIOPSUI };
