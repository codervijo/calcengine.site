import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function FileUploadTimeUI() {
  const [fileSizeMB, setFileSizeMB] = useState<string>('100');
  const [speedMbps, setSpeedMbps] = useState<string>('50');
  const [overheadPct, setOverheadPct] = useState<string>('10');

  const size = parseFloat(fileSizeMB) || 0;
  const speed = parseFloat(speedMbps) || 0;
  const overhead = parseFloat(overheadPct) || 0;

  // (file size in MB × 8 Mbits/MB) ÷ upload speed (Mbps) × overhead factor
  const timeSeconds = speed > 0 ? (size * 8) / speed * (1 + overhead / 100) : 0;

  const formatTime = (secs: number): string => {
    if (secs <= 0) return '0 seconds';
    if (secs < 60) return `${secs.toFixed(1)} seconds`;
    if (secs < 3600) return `${(secs / 60).toFixed(1)} minutes`;
    return `${(secs / 3600).toFixed(2)} hours`;
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Upload Time</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="File Size (MB)"
          type="number"
          value={fileSizeMB}
          onChange={(e) => setFileSizeMB(e.target.value)}
          slotProps={{ htmlInput: { step: '1', min: '0' } }}
        />
        <TextField
          label="Upload Speed (Mbps)"
          type="number"
          value={speedMbps}
          onChange={(e) => setSpeedMbps(e.target.value)}
          slotProps={{ htmlInput: { step: '0.1', min: '0' } }}
        />
        <TextField
          label="Protocol Overhead (%)"
          type="number"
          value={overheadPct}
          onChange={(e) => setOverheadPct(e.target.value)}
          slotProps={{ htmlInput: { step: '1', min: '0', max: '100' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated Upload Time</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{formatTime(timeSeconds)}</Typography>
        {timeSeconds > 0 && (
          <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>{timeSeconds.toFixed(1)}s total</Typography>
        )}
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'file-upload-time-calculator',
  title: 'File Upload Time Calculator',
  shortTitle: 'Upload Time',
  description: 'Use this file upload time calculator to estimate how long any upload takes — enter file size and connection speed for an instant result, no sign-up needed.',
  keywords: [
    'file upload time calculator',
    'how long to upload a file',
    'upload speed calculator',
    'file transfer time calculator',
    'upload time estimator',
    'upload speed mbps calculator',
    'large file upload time',
    'network upload time calculator',
  ],
  category: 'performance',
  icon: 'CloudUpload',
  tagline: 'Enter your file size and upload speed to instantly estimate how long your upload will take. Accounts for real-world protocol overhead so results match what you see in practice.',
  lastUpdated: 'April 2026',
  intro: 'The file upload time calculator tells you exactly how long a transfer will take before you start it — no surprises mid-session. Knowing the upload duration upfront helps you schedule large transfers outside business hours, set realistic expectations for clients receiving files, and diagnose whether a slow upload is a network problem or simply the expected time for that file size.\n\nDevelopers use this tool when sizing timeout values for file-upload API endpoints, planning S3 or GCS put-object operations, and estimating CI artifact push times. DevOps engineers reach for it when capacity-planning storage pipelines and validating that upload SLAs are achievable on the available bandwidth.\n\nThe underlying formula is straightforward: convert the file size from bytes to bits, divide by the upload speed in bits per second, and add a protocol overhead factor to account for TCP/IP framing, TLS handshake bytes, and HTTP multipart boundaries. Typical real-world overhead runs 5–15%; the default of 10% is a safe conservative estimate for most HTTPS uploads.\n\nIf you are uploading many files in parallel, each stream shares the same uplink. In that scenario, divide your total bandwidth by the number of concurrent streams before entering the per-stream speed here. Use the <a href="/calculators/throughput-calculator">Throughput Calculator</a> to model concurrent transfer capacity.',
  howItWorksTitle: 'How to Calculate File Upload Time',
  howItWorksImage: '/images/calculators/file-upload-time-calculator-how-it-works.svg',
  howItWorks: '1. Enter your file size in megabytes (MB). Convert from GB by multiplying by 1,024, or from KB by dividing by 1,024.\n2. Enter your upload speed in Mbps. Run a speed test to get your real upload speed — advertised speeds are often theoretical maximums.\n3. Set the protocol overhead percentage. Leave it at 10% for standard HTTPS uploads; raise it to 15% for TLS-heavy or highly fragmented transfers.\n4. The calculator converts file size to megabits (×8), divides by upload speed (Mbps), and multiplies by the overhead factor.\n5. The result is displayed in the most readable unit — seconds for small files, minutes for medium files, and hours for large transfers.',
  formula: 'Upload Time (s) = (File Size (MB) × 8) ÷ Upload Speed (Mbps) × (1 + Overhead ÷ 100)\n\nFile Size     — file size in megabytes (MB); 1 GB = 1,024 MB\nUpload Speed  — upload throughput in megabits per second (Mbps)\nOverhead      — protocol overhead percentage (TCP/TLS/HTTP headers, typically 5–15%)\n× 8           — converts megabytes to megabits (1 byte = 8 bits)',
  examplesTitle: 'Example File Upload Time Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Photo gallery backup on home broadband',
      body: 'File size:     100 MB  ×  8  =  800 Mbits\nUpload speed:  25 Mbps\nOverhead:      10%\n\nTime = 800 ÷ 25 × 1.10  =  35.2 seconds',
    },
    {
      title: 'Example 2 — 2 GB video upload on office fibre (100 Mbps uplink)',
      body: 'File size:   2,048 MB  ×  8  =  16,384 Mbits\nUpload speed:  100 Mbps\nOverhead:       10%\n\nTime = 16,384 ÷ 100 × 1.10  =  180.2 seconds  →  3.0 minutes',
    },
    {
      title: 'Example 3 — 500 MB dataset on a 5 Mbps mobile hotspot',
      body: 'File size:     500 MB  ×  8  =  4,000 Mbits\nUpload speed:  5 Mbps\nOverhead:      15%  (higher for mobile network variability)\n\nTime = 4,000 ÷ 5 × 1.15  =  920 seconds  →  15.3 minutes',
    },
  ],
  tipsTitle: 'Tips to Speed Up File Uploads',
  tips: [
    'Compress files before uploading. Reducing a 500 MB archive to 300 MB with gzip or zstd cuts upload time by 40%. Use the <a href="/calculators/compression-ratio-calculator">Compression Ratio Calculator</a> to estimate savings before compressing.',
    'Use chunked / multipart uploads for files over 100 MB. Libraries like tus or the AWS S3 multipart API resume interrupted uploads and can saturate your bandwidth more effectively than a single TCP stream.',
    'Upload during off-peak hours. Home and office broadband is often 20–50% faster at night or weekends when contention on the local loop is lower.',
    'Close other bandwidth-heavy applications before starting a large upload. A background video call or OS update can silently cap your available uplink to a fraction of its rated speed.',
    'Pick a storage region close to your physical location. Uploading to a data center in the same country typically yields 10–30% better throughput than uploading across continents due to fewer TCP retransmits.',
    'For server-to-server transfers, use iperf3 to measure true available bandwidth rather than relying on a consumer speed test — ISP speed tests route to optimised endpoints that may not reflect your route to the target server.',
  ],
  faq: [
    {
      question: 'Why is my actual upload slower than the calculator shows?',
      answer: 'Speed tests measure peak short-burst throughput; sustained large-file uploads are typically 10–30% slower due to TCP congestion control, buffer bloat, and ISP throttling. Other devices sharing the connection, Wi-Fi interference, and VPN encryption overhead all reduce real throughput. Set the overhead slider to 20–25% for a more conservative estimate that matches real-world results.',
    },
    {
      question: 'What protocol overhead percentage should I use?',
      answer: 'Use 5–10% for direct TCP transfers (rsync, SCP, plain HTTP). Use 10–15% for HTTPS with TLS 1.3. Use 15–20% for chunked multipart uploads or transfers over a VPN. Mobile LTE/5G connections can add another 5% due to radio framing. The default of 10% is a safe starting point for most standard HTTPS uploads to cloud storage.',
    },
    {
      question: 'How do I find my actual upload speed in Mbps?',
      answer: 'Run a speed test at fast.com or speedtest.net and read the upload result. For server-side transfers, iperf3 gives a more accurate sustained throughput figure. Note that speed test results reflect your connection to a nearby test node — transfers to distant servers may be 20–40% slower. Always use the upload number, not download, as they differ significantly on most residential connections.',
    },
    {
      question: 'Does compressing the file reduce upload time?',
      answer: 'Yes — if the file is compressible (text, JSON, CSV, uncompressed video). A 10:1 compression ratio on a 1 GB log archive saves 900 MB of upload data, reducing time proportionally. Already-compressed formats like JPEG, MP4, and ZIP gain little from re-compression. Use the <a href="/calculators/compression-ratio-calculator">Compression Ratio Calculator</a> to estimate the savings for your specific file type.',
    },
    {
      question: 'What is the difference between Mbps and MBps?',
      answer: 'Mbps (megabits per second) is how ISPs and speed tests report bandwidth. MBps (megabytes per second) is how operating systems and file managers report transfer speed. There are 8 bits in a byte, so a 100 Mbps connection delivers roughly 12.5 MBps of file data. This calculator uses Mbps — divide your OS-reported speed by 0.125 to convert MBps to Mbps if needed.',
    },
  ],
  relatedSlugs: ['compression-ratio-calculator', 'throughput-calculator', 'bandwidth-cost-calculator'],
};

export const fileUploadTimeCalculator: CalculatorDefinition = { meta, Component: FileUploadTimeUI };
