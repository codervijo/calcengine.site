import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function DownloadSpeedUI() {
  const [fileSize, setFileSize] = useState<string>('1024');
  const [speed, setSpeed] = useState<string>('100');

  const fileSizeMB = parseFloat(fileSize) || 0;
  const speedMbps = parseFloat(speed) || 0;

  const totalSeconds = speedMbps > 0 ? (fileSizeMB * 8) / speedMbps : 0;

  function formatTime(seconds: number): string {
    if (seconds <= 0) return '—';
    if (seconds < 1) return `${(seconds * 1000).toFixed(0)} ms`;
    if (seconds < 60) return `${seconds.toFixed(1)} sec`;
    if (seconds < 3600) {
      const m = Math.floor(seconds / 60);
      const s = Math.round(seconds % 60);
      return `${m} min ${s} sec`;
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    return `${h} hr ${m} min`;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Download Time</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="File Size (MB)"
          type="number"
          value={fileSize}
          onChange={(e) => setFileSize(e.target.value)}
          helperText="Enter size in MB — 1 GB = 1024 MB"
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
          fullWidth
        />
        <TextField
          label="Download Speed (Mbps)"
          type="number"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          helperText="Megabits per second — check fast.com"
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
          fullWidth
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated Download Time</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{formatTime(totalSeconds)}</Typography>
        {totalSeconds > 0 && (
          <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
            {(fileSizeMB * 8).toFixed(0)} Megabits ÷ {speedMbps} Mbps
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'download-speed-calculator',
  title: 'Download Speed Calculator',
  shortTitle: 'Download Speed',
  description: 'Download speed calculator — enter file size (MB) and connection speed (Mbps) to estimate exact download time. Works for any file type or network speed',
  keywords: [
    'download speed calculator',
    'download time calculator',
    'file download time estimator',
    'internet speed download calculator',
    'mbps download time calculator',
    'how long to download file',
    'network speed to download time',
  ],
  category: 'performance',
  icon: 'Speed',
  tagline: 'Enter your file size and connection speed to instantly calculate how long a download will take. Works for any file type — software, video, backups, or datasets.',
  lastUpdated: 'April 2026',
  intro: 'The download speed calculator converts file size and connection speed into a precise download time estimate — no guesswork required. Whether you\'re planning a large software deployment, estimating how long a video export will take to transfer, or sizing a backup window, this tool gives you an answer in seconds.\n\nMost confusion stems from the MB vs Mb distinction. File sizes are measured in Megabytes (MB); internet speeds are measured in Megabits per second (Mbps). Because one byte equals eight bits, a 100 Mbps connection can only transfer 12.5 MB per second — not 100 MB. This calculator handles the conversion automatically.\n\nDevelopers and DevOps teams use it to size CI/CD artifact downloads, pre-warm CDN edge caches, and set realistic timeout budgets for large file transfers. Network engineers use it during capacity planning to validate whether a link has enough headroom for peak transfer loads.\n\nFor real-world accuracy, use your measured speed (not the advertised plan rate) from a tool like fast.com or speedtest.net. Overhead from TCP, TLS handshakes, and protocol headers typically reduces effective throughput by 5–15% on a good connection.',
  howItWorksTitle: 'How to Calculate Download Time from Speed',
  howItWorksImage: '/images/calculators/download-speed-calculator-how-it-works.svg',
  howItWorks: '1. Measure your actual download speed in Megabits per second (Mbps) using fast.com or speedtest.net.\n2. Find the file size in Megabytes (MB). Convert GB to MB by multiplying by 1024.\n3. Convert the file size to Megabits: File Size MB × 8.\n4. Divide total Megabits by your speed in Mbps to get seconds.\n5. The calculator formats the result into milliseconds, seconds, minutes, or hours automatically.',
  formula: 'Download Time (s) = (File Size in MB × 8) ÷ Speed in Mbps\n\nFile Size (MB)  — size of the file in Megabytes (1 GB = 1024 MB)\nSpeed (Mbps)    — connection speed in Megabits per second\n× 8             — converts Megabytes to Megabits (1 byte = 8 bits)\n\nExample: 1024 MB file at 100 Mbps\n  = (1024 × 8) ÷ 100 = 8192 ÷ 100 = 81.9 seconds',
  examplesTitle: 'Example Download Time Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — 1 GB software package on standard broadband (100 Mbps)',
      body: 'File Size:  1024 MB  ×  8  =  8,192 Megabits\nSpeed:      100 Mbps\n                                  ─────────────\nTime = 8,192 ÷ 100 = 81.9 seconds  →  ~1 min 22 sec',
    },
    {
      title: 'Example 2 — 4 GB Docker image on gigabit fibre (1000 Mbps)',
      body: 'File Size:  4096 MB  ×  8  =  32,768 Megabits\nSpeed:      1000 Mbps\n                                   ─────────────\nTime = 32,768 ÷ 1000 = 32.8 seconds',
    },
    {
      title: 'Example 3 — 500 MB dataset on slow office Wi-Fi (10 Mbps)',
      body: 'File Size:   500 MB  ×  8  =  4,000 Megabits\nSpeed:        10 Mbps\n                                  ─────────────\nTime = 4,000 ÷ 10 = 400 seconds  →  6 min 40 sec',
    },
  ],
  tipsTitle: 'Tips to Speed Up File Downloads',
  tips: [
    'Always test your actual speed at fast.com before estimating — advertised plan speeds are maximums, not guarantees. Real-world throughput is typically 60–85% of the plan rate.',
    'Use parallel chunk downloads for large files. Tools like aria2c and download managers split a file into segments fetched simultaneously, saturating your connection more efficiently than a single TCP stream.',
    'For server-to-server transfers (e.g., S3 to EC2), stay in the same region. Cross-region bandwidth is slower and incurs egress costs. Use the <a href="/calculators/bandwidth-cost-calculator">Bandwidth Cost Calculator</a> to estimate charges.',
    'Compress files before transfer. A 2:1 compression ratio halves your download time for text-heavy payloads like JSON, logs, or source archives. Use the <a href="/calculators/compression-ratio-calculator">Compression Ratio Calculator</a> to model savings.',
    'Schedule large downloads during off-peak hours (late night). Shared connections — office Wi-Fi, ISP networks — experience less congestion and can reach closer to peak speed.',
    'Set realistic timeouts in your application. If a 500 MB download takes 400 seconds on a 10 Mbps link, a 30-second HTTP timeout will always fail. Use the <a href="/calculators/timeout-calculator">Timeout Calculator</a> to size your timeout budgets.',
  ],
  faq: [
    {
      question: 'Why is my actual download slower than the calculator predicts?',
      answer: 'The formula assumes you have exclusive use of your full connection. In practice, TCP overhead, TLS negotiation, Wi-Fi interference, server upload limits, and shared network congestion reduce effective throughput. Expect 60–85% of your advertised speed on a good day. Enter your measured speed from fast.com rather than your plan speed for accurate results.',
    },
    {
      question: 'What is the difference between Mbps and MBps?',
      answer: 'Mbps (lowercase b) is Megabits per second — the unit ISPs and speed tests use. MBps (uppercase B) is Megabytes per second — the unit file sizes use. There are 8 bits in a byte, so 100 Mbps equals 12.5 MBps. This is the single most common source of confusion when estimating download times.',
    },
    {
      question: 'How do I convert GB to MB for this calculator?',
      answer: 'Multiply gigabytes by 1024 to get megabytes (binary, used by operating systems) or by 1000 (decimal, used by storage manufacturers). For most practical purposes, 1 GB ≈ 1024 MB. A 4 GB file is 4096 MB. Storage manufacturers use 1 GB = 1000 MB, which is why a "500 GB" drive shows as ~465 GB in Windows.',
    },
    {
      question: 'How do I calculate download time for a file in GB?',
      answer: 'Convert GB to MB first by multiplying by 1024, then enter that value as the file size. For example, a 10 GB file is 10 240 MB. At 50 Mbps: (10240 × 8) ÷ 50 = 1638 seconds, roughly 27 minutes. The calculator accepts any MB value, so the conversion step is all that\'s needed.',
    },
    {
      question: 'Does network latency affect download time for large files?',
      answer: 'For large files, throughput (Mbps) dominates — latency is a one-time handshake cost measured in milliseconds and becomes negligible over a long transfer. Latency matters most for small files and request-heavy workloads. A 1 GB file over a 200ms latency link takes almost the same time as over a 5ms link if the bandwidth is identical.',
    },
  ],
  relatedSlugs: ['file-upload-time-calculator', 'bandwidth-cost-calculator', 'throughput-calculator'],
};

export const downloadSpeedCalculator: CalculatorDefinition = { meta, Component: DownloadSpeedUI };
