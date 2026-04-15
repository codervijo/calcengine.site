import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function CompressionRatioUI() {
  const [originalSize, setOriginalSize] = useState<string>('1024');
  const [compressedSize, setCompressedSize] = useState<string>('256');

  const orig = parseFloat(originalSize) || 0;
  const comp = parseFloat(compressedSize) || 0;

  const ratio = comp > 0 && orig > 0 ? orig / comp : 0;
  const savings = orig > 0 && comp >= 0 ? ((orig - comp) / orig) * 100 : 0;
  const saved = orig - comp;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Compression Ratio</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Original Size"
          type="number"
          value={originalSize}
          onChange={(e) => setOriginalSize(e.target.value)}
          helperText="Uncompressed file size (any unit)"
          fullWidth
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
        />
        <TextField
          label="Compressed Size"
          type="number"
          value={compressedSize}
          onChange={(e) => setCompressedSize(e.target.value)}
          helperText="Compressed file size (same unit)"
          fullWidth
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Compression Ratio</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>
          {ratio > 0 ? `${ratio.toFixed(2)}:1` : '—'}
        </Typography>
        <Stack direction="row" justifyContent="center" spacing={4} sx={{ mt: 1.5 }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Space Savings</Typography>
            <Typography variant="h5" component="p" sx={{ fontWeight: 600 }}>
              {savings > 0 ? `${savings.toFixed(1)}%` : '—'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Size Reduced By</Typography>
            <Typography variant="h5" component="p" sx={{ fontWeight: 600 }}>
              {saved > 0 ? saved.toLocaleString() : '—'}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'compression-ratio-calculator',
  title: 'Compression Ratio Calculator',
  shortTitle: 'Compression Ratio',
  description: 'Calculate compression ratio instantly — enter original and compressed file sizes to get the ratio, space savings percentage, and bytes saved. Works for any format',
  keywords: [
    'compression ratio calculator',
    'file compression ratio',
    'data compression calculator',
    'gzip compression ratio',
    'zip compression ratio',
    'space savings calculator',
    'compression efficiency calculator',
    'lossless compression ratio',
  ],
  category: 'data',
  icon: 'Compress',
  tagline: 'Enter your original and compressed file sizes to instantly calculate the compression ratio and space savings. Works with ZIP, gzip, Brotli, zstd, and any other format.',
  lastUpdated: 'April 2026',
  intro: 'The compression ratio calculator tells you exactly how effective a compression algorithm is by comparing original and compressed file sizes. Enter both sizes in the same unit — bytes, KB, MB, or GB — and you get the ratio, space savings percentage, and total size reduction.\n\nCompression ratio matters whenever storage cost or transfer time is on the line. DevOps engineers use it to evaluate gzip vs Brotli for web assets. Data engineers compare zstd vs Snappy for columnar storage. Backend teams measure payload compression before and after adding Content-Encoding: gzip to an API response.\n\nA ratio of 4:1 means the compressed file is four times smaller than the original — one quarter the storage space and one quarter the bandwidth cost. Typical ratios range from 1.5:1 for already-compressed media files to 10:1 or higher for repetitive text like logs or JSON.\n\nThis calculator works for any lossless or lossy format. For lossy compression (JPEG, MP3, H.264), the ratio reflects file-size reduction but not quality trade-offs — factor in quality settings separately.',
  howItWorksTitle: 'How to Calculate Compression Ratio',
  howItWorksImage: '/images/calculators/compression-ratio-calculator-how-it-works.svg',
  howItWorks: '1. Measure the original file size before compression — in bytes, KB, MB, or GB.\n2. Compress the file using your chosen algorithm (gzip, zstd, Brotli, etc.).\n3. Measure the compressed file size in the same unit.\n4. Divide the original size by the compressed size to get the compression ratio.\n5. Subtract the compressed size from the original and divide by the original to get space savings percentage.',
  formula: 'Compression Ratio  = Original Size ÷ Compressed Size\nSpace Savings (%)  = (Original Size − Compressed Size) ÷ Original Size × 100\nSize Reduced By    = Original Size − Compressed Size\n\nOriginal Size    — file size before compression (any consistent unit)\nCompressed Size  — file size after compression (same unit)\nRatio            — expressed as X:1; higher means better compression',
  examplesTitle: 'Example Compression Ratio Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — gzip on a JSON API response',
      body: 'Original:    48,320 bytes (47.2 KB uncompressed JSON)\nCompressed:   4,210 bytes (4.1 KB with gzip level 6)\n\nCompression Ratio  = 48,320 ÷ 4,210  = 11.48:1\nSpace Savings      = (48,320 − 4,210) ÷ 48,320 × 100  = 91.3%\nSize Reduced By    = 44,110 bytes saved per response',
    },
    {
      title: 'Example 2 — zstd on a CSV data export',
      body: 'Original:   512 MB (raw CSV log file)\nCompressed:  68 MB (zstd level 3)\n\nCompression Ratio  = 512 ÷ 68  = 7.53:1\nSpace Savings      = (512 − 68) ÷ 512 × 100  = 86.7%\nSize Reduced By    = 444 MB saved — cuts S3 storage bill by 86.7%',
    },
    {
      title: 'Example 3 — JPEG image (already lossy-compressed)',
      body: 'Original:   2,400 KB (raw PNG screenshot)\nCompressed:   180 KB (JPEG at 80% quality)\n\nCompression Ratio  = 2,400 ÷ 180  = 13.33:1\nSpace Savings      = (2,400 − 180) ÷ 2,400 × 100  = 92.5%\nSize Reduced By    = 2,220 KB — significant page-weight saving for web delivery',
    },
  ],
  tipsTitle: 'Tips to Maximise Compression Efficiency',
  tips: [
    'Match the algorithm to the data type: zstd and gzip excel on text and JSON; Snappy is faster but lower ratio for binary; Brotli delivers the best ratios for static web assets.',
    'Pre-sort or pre-group repetitive data before compressing — columnar storage formats like Parquet exploit sorted runs to achieve dramatically higher ratios on numeric data.',
    'Compress at the API gateway level with Content-Encoding: gzip or br rather than in application code — you get compression for free on all responses without touching business logic.',
    'Avoid double-compressing. Files already in ZIP, JPEG, MP4, or other compressed formats gain almost nothing from a second pass and waste CPU. Check the ratio first.',
    'For streaming pipelines, benchmark zstd level 1–3 vs gzip level 1 — zstd at level 1 typically beats gzip level 6 in both speed and ratio, cutting both latency and storage cost.',
    'Log actual compression ratios per content type in production. A sudden drop in ratio often signals a data format change — like a field switching from text to base64-encoded binary — that should be investigated.',
  ],
  faq: [
    {
      question: 'What is a good compression ratio?',
      answer: 'For plain text, JSON, and log files, a good ratio is 5:1 to 15:1. HTML and CSS typically compress to 3:1–8:1. Binary formats like databases reach 2:1–4:1. Already-compressed media (JPEG, MP4, ZIP) rarely exceeds 1.1:1. If you\'re seeing ratios below 1.5:1 on text data, inspect whether the data is already encoded in base64 or otherwise inflated.',
    },
    {
      question: 'Does compression ratio depend on file size?',
      answer: 'Yes — small files compress poorly because compression algorithms need enough repetition to build an efficient dictionary. A 1 KB JSON object may compress to 0.8:1 (no gain), while a 100 MB JSON dataset of similar structure can hit 8:1 or higher. For network payloads under ~1 KB, compression overhead often exceeds the savings.',
    },
    {
      question: 'How does compression ratio affect bandwidth cost?',
      answer: 'Directly — a 5:1 ratio cuts egress data volume by 80%, so a $100/month bandwidth bill drops to roughly $20. Cloud providers charge per GB transferred, so a higher compression ratio translates proportionally to lower bills. Use the <a href="/calculators/bandwidth-cost-calculator">Bandwidth Cost Calculator</a> to model the exact dollar impact for your traffic volume.',
    },
    {
      question: 'What is the difference between compression ratio and space savings?',
      answer: 'They measure the same thing differently. A 4:1 ratio means the file is 4× smaller. Space savings is (1 − 1/ratio) × 100 = 75%. A 2:1 ratio equals 50% savings; 10:1 equals 90% savings. Use ratio when comparing algorithms head-to-head; use percentage when explaining storage or bandwidth reduction to stakeholders.',
    },
    {
      question: 'Can I compare compression ratio across different algorithms?',
      answer: 'Yes — compress the same input file with each algorithm and plug both results into this calculator. Compare ratios directly. Also consider CPU cost: zstd at level 3 often beats gzip level 6 in ratio and runs 3–5× faster. For a full picture, pair ratio with decompression latency, especially for read-heavy workloads like serving static files or reading from object storage.',
    },
  ],
  relatedSlugs: ['json-size-calculator', 'payload-size-calculator', 'bandwidth-cost-calculator', 'storage-cost-calculator'],
};

export const compressionRatioCalculator: CalculatorDefinition = { meta, Component: CompressionRatioUI };
