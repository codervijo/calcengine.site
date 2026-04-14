import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function Base64SizeUI() {
  const [originalBytes, setOriginalBytes] = useState<string>('1024');

  const orig = parseFloat(originalBytes) || 0;
  const encoded = Math.ceil(orig / 3) * 4;
  const increase = orig > 0 ? ((encoded - orig) / orig) * 100 : 0;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Estimate Base64 Size</Typography>
      <TextField label="Original Size (bytes)" type="number" value={originalBytes} onChange={(e) => setOriginalBytes(e.target.value)} />
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={4} sx={{ justifyContent: 'center', textAlign: 'center' }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Encoded Size</Typography>
            <Typography variant="h3" component="p" sx={{ fontWeight: 700 }}>{encoded.toLocaleString()} B</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Increase</Typography>
            <Typography variant="h3" component="p" sx={{ fontWeight: 700 }}>{increase.toFixed(1)}%</Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'base64-size-calculator',
  title: 'Base64 Size Calculator — Estimate Encoded Size & Overhead (Free 2026)',
  shortTitle: 'Base64 Size',
  description: 'Calculate Base64 encoded size from original bytes. See the exact output size and ~33% overhead — instant results for API payloads, images, and JWT tokens.',
  keywords: ['base64 size calculator', 'base64 encoding overhead', 'base64 size increase', 'base64 33 percent larger', 'base64 encoded byte size', 'image base64 size estimator', 'jwt token size calculator'],
  category: 'encoding',
  icon: 'Code',
  intro: 'Base64 encoding is everywhere — images embedded in JSON responses, binary files sent over email, JWT tokens, OAuth credentials in HTTP headers. But every time you Base64-encode data, it gets bigger. Predictably bigger: the encoded output is always approximately 33% larger than the original.\n\nThis Base64 size calculator estimates the exact encoded size from your original byte count. Enter your original file or payload size in bytes and you\'ll immediately see the encoded size and the exact percentage overhead.\n\nThis matters when you\'re deciding whether to inline an image as Base64 in a JSON API response, checking whether a JWT will exceed a cookie size limit, or calculating whether an email attachment will breach a server\'s maximum size.\n\nUse it to plan payload budgets for size-limited APIs, compare the trade-off between Base64 embedding vs. a URL reference, or verify a JWT or cookie won\'t hit browser limits.',
  howItWorks: '1. Enter the original size of your data in bytes. (Use the JSON Size Calculator for JSON payloads, or check file properties for files.)\n2. The calculator applies the Base64 formula: every 3 input bytes become 4 output characters.\n3. Padding is accounted for — if the byte count isn\'t divisible by 3, one or two \'=\' characters are appended.\n4. Encoded size (bytes) and the percentage increase are shown instantly.',
  formula: 'Encoded Size (bytes) = ⌈Original Bytes ÷ 3⌉ × 4\nPercentage Increase  = ((Encoded − Original) ÷ Original) × 100\n\nWhy: Base64 maps every 3 bytes → 4 ASCII characters (6 bits × 4 chars = 24 bits = 3 bytes).\nThe ceiling ⌈⌉ handles padding for inputs not divisible by 3.',
  example: 'Example 1 — Small image (5,000 bytes):\nEncoded  = ⌈5,000 ÷ 3⌉ × 4 = 1,667 × 4 = 6,668 bytes\nOverhead = (6,668 − 5,000) ÷ 5,000 × 100 = 33.4%\n\nExample 2 — 1 MB file (1,048,576 bytes):\nEncoded  = ⌈1,048,576 ÷ 3⌉ × 4 = 349,526 × 4 = 1,398,104 bytes ≈ 1.33 MB\nOverhead = 33.3%\n\nThe ~33% overhead is consistent regardless of file size.',
  faq: [
    { question: 'Why does Base64 always increase size by ~33%?', answer: 'Base64 encodes 3 bytes as 4 characters, creating a fixed 4:3 ratio. One extra character per 3 bytes equals exactly 33.3% overhead, every time.' },
    { question: 'Does Base64 compress data?', answer: 'No. Base64 is an encoding format, not a compression algorithm — it increases size. Apply GZIP or Brotli compression before Base64-encoding if size is a concern.' },
    { question: 'What is the maximum safe Base64 size for a browser cookie?', answer: 'Most browsers allow 4,096 bytes per cookie. A 3,000-byte JWT encodes to ~4,000 bytes in Base64, leaving very little headroom before hitting the limit.' },
    { question: 'When should I use a URL instead of Base64 for images?', answer: 'For images over ~10 KB, a URL reference is almost always better. Base64-inlined images block HTML parsing, inflate page weight, and cannot be cached separately by the browser.' },
    { question: 'Does Base64url (used in JWTs) change the encoded size?', answer: 'No. Base64url uses the same 4:3 ratio but replaces \'+\' with \'-\' and \'/\' with \'_\', and omits padding. The byte count is identical to standard Base64.' },
  ],
  relatedSlugs: ['json-size-calculator', 'api-rate-limit-calculator'],
};

export const base64SizeCalculator: CalculatorDefinition = { meta, Component: Base64SizeUI };
