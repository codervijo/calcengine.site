import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import { CalculatorDefinition, CalculatorMeta } from '../registry/types';

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
  title: 'Base64 Size Calculator',
  shortTitle: 'Base64 Size',
  description: 'Estimate the encoded size of data after Base64 encoding, plus the percentage size increase.',
  keywords: ['base64', 'encoding size', 'base64 calculator', 'data encoding', 'size increase'],
  category: 'encoding',
  icon: 'Code',
  intro: 'Enter the original size of your data in bytes to see how large it will be after Base64 encoding. Base64 encoding always increases size by approximately 33%.',
  howItWorks: 'Base64 encoding represents every 3 bytes of input as 4 ASCII characters. The calculator applies this ratio to estimate the output size.',
  formula: 'Encoded Size = ⌈Original Bytes / 3⌉ × 4\nPercentage Increase = ((Encoded − Original) / Original) × 100',
  example: 'For a 1,024-byte file:\nEncoded = ⌈1024 / 3⌉ × 4 = 342 × 4 = 1,368 bytes\nIncrease = (1368 − 1024) / 1024 × 100 ≈ 33.6%',
  faq: [
    { question: 'Why does Base64 increase size?', answer: 'Base64 maps 3 bytes to 4 characters, using only 64 safe ASCII characters. This 4:3 ratio causes a ~33% size increase.' },
    { question: 'Does padding affect the size?', answer: 'Yes. If the input length isn\'t a multiple of 3, Base64 adds 1-2 "=" padding characters. The formula accounts for this.' },
    { question: 'When is Base64 used?', answer: 'Common uses include embedding images in HTML/CSS, encoding binary data in JSON or XML, and email attachments (MIME).' },
  ],
  relatedSlugs: ['json-size-calculator', 'api-rate-limit-calculator'],
};

export const base64SizeCalculator: CalculatorDefinition = { meta, Component: Base64SizeUI };
