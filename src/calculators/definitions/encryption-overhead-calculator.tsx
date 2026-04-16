import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function EncryptionOverheadUI() {
  const [plaintextSize, setPlaintextSize] = useState<string>('4096');
  const [algorithm, setAlgorithm] = useState<string>('aes256gcm');
  const [throughputMBs, setThroughputMBs] = useState<string>('2500');

  const overheadBytesMap: Record<string, number> = {
    aes128gcm: 28,
    aes256gcm: 28,
    aes256cbc: 32,
    chacha20: 28,
  };

  const defaultThroughputMap: Record<string, string> = {
    aes128gcm: '3500',
    aes256gcm: '2500',
    aes256cbc: '2000',
    chacha20: '1500',
  };

  const handleAlgoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const algo = e.target.value;
    setAlgorithm(algo);
    setThroughputMBs(defaultThroughputMap[algo] ?? '2500');
  };

  const plainBytes = parseFloat(plaintextSize) || 0;
  const overhead = overheadBytesMap[algorithm] ?? 28;
  const tp = parseFloat(throughputMBs) || 1;

  const ciphertextBytes = plainBytes + overhead;
  const overheadPct = plainBytes > 0 ? (overhead / plainBytes) * 100 : 0;
  const encryptionTimeMs = (plainBytes / (tp * 1024 * 1024)) * 1000;

  const timeDisplay =
    encryptionTimeMs === 0
      ? '0 ms'
      : encryptionTimeMs < 0.0001
        ? encryptionTimeMs.toExponential(2) + ' ms'
        : encryptionTimeMs < 1
          ? encryptionTimeMs.toFixed(4) + ' ms'
          : encryptionTimeMs.toFixed(2) + ' ms';

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Encryption Overhead</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Plaintext Size (bytes)"
          type="number"
          value={plaintextSize}
          onChange={(e) => setPlaintextSize(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          fullWidth
        />
        <TextField
          select
          label="Algorithm"
          value={algorithm}
          onChange={handleAlgoChange}
          SelectProps={{ native: true }}
          fullWidth
        >
          <option value="aes128gcm">AES-128-GCM (28 B overhead)</option>
          <option value="aes256gcm">AES-256-GCM (28 B overhead)</option>
          <option value="aes256cbc">AES-256-CBC (32 B overhead)</option>
          <option value="chacha20">ChaCha20-Poly1305 (28 B overhead)</option>
        </TextField>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="CPU Throughput (MB/s)"
          type="number"
          value={throughputMBs}
          onChange={(e) => setThroughputMBs(e.target.value)}
          slotProps={{ htmlInput: { min: 0.1, step: 100 } }}
          fullWidth
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
          <Stack alignItems="center">
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Ciphertext Size</Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
              {ciphertextBytes.toLocaleString()} B
            </Typography>
          </Stack>
          <Stack alignItems="center">
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Size Overhead</Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
              +{overhead} B ({overheadPct.toFixed(2)}%)
            </Typography>
          </Stack>
          <Stack alignItems="center">
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Encryption Time</Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
              {timeDisplay}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'encryption-overhead-calculator',
  title: 'Encryption Overhead Calculator',
  shortTitle: 'Encryption Overhead',
  description: 'Encryption overhead calculator: measure AES-256-GCM, AES-128-GCM, AES-256-CBC, and ChaCha20 ciphertext size, overhead bytes, and encryption time in ms',
  keywords: [
    'encryption overhead calculator',
    'aes encryption overhead',
    'aes-256-gcm overhead bytes',
    'chacha20 encryption size overhead',
    'ciphertext size calculator',
    'encryption latency estimator',
    'aes cbc vs gcm overhead',
    'symmetric encryption performance',
  ],
  category: 'encoding',
  icon: 'Lock',
  tagline: 'Enter your plaintext size and algorithm to instantly see ciphertext size, overhead bytes, and encryption time. Works for AES-128-GCM, AES-256-GCM, AES-256-CBC, and ChaCha20-Poly1305.',
  lastUpdated: 'April 2026',
  intro: 'The encryption overhead calculator helps you estimate the exact byte overhead and latency cost of encrypting data with common symmetric algorithms. Developers working on secure APIs, file storage, and messaging systems need to know how much larger their ciphertext will be and how long encryption will take at production throughput.\n\nEvery authenticated encryption scheme adds fixed metadata to each message: an initialization vector (or nonce) to ensure ciphertext uniqueness, plus an authentication tag to detect tampering. For AES-GCM and ChaCha20-Poly1305, this overhead is a constant 28 bytes per operation, regardless of plaintext size. AES-CBC uses a 16-byte IV and PKCS7 padding (up to 16 bytes), totalling 32 bytes of overhead per message.\n\nSize overhead matters most for small payloads. Encrypting a 64-byte IoT sensor reading with AES-256-GCM adds 44% to the message size. Encrypting a 10 MB video chunk adds just 0.0003%. Encryption time scales linearly with data size and inversely with CPU throughput — servers with AES-NI hardware acceleration (all modern x86/ARM chips) encrypt gigabytes per second, making latency negligible for most workloads.\n\nThis calculator is useful when sizing storage quotas for encrypted blobs, estimating TLS record padding, evaluating algorithm choices for constrained devices, and modelling the throughput impact of end-to-end encryption in messaging or file sync pipelines.',
  howItWorksTitle: 'How to Calculate Encryption Overhead',
  howItWorksImage: '/images/calculators/encryption-overhead-calculator-how-it-works.svg',
  howItWorks: '1. Choose your encryption algorithm — AES-128-GCM, AES-256-GCM, AES-256-CBC, or ChaCha20-Poly1305. Each has a fixed per-operation overhead in bytes.\n2. Enter your plaintext size in bytes. This is the length of the data before encryption.\n3. Enter your CPU throughput in MB/s. The default pre-fills based on the algorithm: AES-NI-accelerated AES-256-GCM typically runs at 2,000–3,000 MB/s; ChaCha20 at ~1,500 MB/s.\n4. The calculator adds the algorithm\'s fixed overhead (IV + auth tag) to your plaintext size to get the ciphertext size.\n5. Overhead percentage = overhead bytes ÷ plaintext bytes × 100.\n6. Encryption time (ms) = plaintext bytes ÷ (throughput × 1,048,576) × 1,000.',
  formula: 'Ciphertext Size  = Plaintext Size + Overhead Bytes\nOverhead %       = (Overhead Bytes ÷ Plaintext Size) × 100\nEncryption Time  = (Plaintext Size ÷ (Throughput × 1,048,576)) × 1,000\n\nPlaintext Size   — bytes before encryption\nOverhead Bytes   — AES-GCM / ChaCha20: 28 B (12B IV + 16B tag)\n                   AES-CBC: 32 B (16B IV + up to 16B PKCS7 padding)\nThroughput       — CPU encryption rate in MB/s (AES-NI: 2,000–4,000)\nEncryption Time  — result in milliseconds',
  examplesTitle: 'Example Encryption Overhead Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — 4 KB API payload with AES-256-GCM',
      body: 'Plaintext:     4,096 bytes\nAlgorithm:     AES-256-GCM — 12B nonce + 16B auth tag = 28 B overhead\nCiphertext:    4,096 + 28 = 4,124 bytes\nOverhead %:    28 ÷ 4,096 × 100 = 0.68%\nAt 2,500 MB/s: 4,096 ÷ (2,500 × 1,048,576) × 1,000 = 0.0016 ms\n─────────────────────────────────────────────────────\nConclusion: negligible size and time overhead for typical API payloads.',
    },
    {
      title: 'Example 2 — 128-byte IoT sensor reading with ChaCha20-Poly1305',
      body: 'Plaintext:     128 bytes\nAlgorithm:     ChaCha20-Poly1305 — 12B nonce + 16B tag = 28 B overhead\nCiphertext:    128 + 28 = 156 bytes\nOverhead %:    28 ÷ 128 × 100 = 21.88%\nAt 1,500 MB/s: 128 ÷ (1,500 × 1,048,576) × 1,000 = 0.000081 ms\n─────────────────────────────────────────────────────\nConclusion: size overhead is significant for tiny payloads — consider batching messages.',
    },
    {
      title: 'Example 3 — 10 MB video chunk with AES-256-CBC',
      body: 'Plaintext:     10,485,760 bytes (10 MB)\nAlgorithm:     AES-256-CBC — 16B IV + 16B PKCS7 padding = 32 B overhead\nCiphertext:    10,485,760 + 32 = 10,485,792 bytes\nOverhead %:    32 ÷ 10,485,760 × 100 = 0.0003%\nAt 2,000 MB/s: 10,485,760 ÷ (2,000 × 1,048,576) × 1,000 = 5.00 ms\n─────────────────────────────────────────────────────\nConclusion: size overhead is negligible for large payloads; encryption time is measurable.',
    },
  ],
  tipsTitle: 'Tips to Minimise Encryption Overhead',
  tips: [
    'Prefer AES-256-GCM or ChaCha20-Poly1305 (AEAD modes) over AES-CBC — they authenticate and encrypt in one pass, eliminating the need for a separate HMAC and saving both bytes and CPU cycles.',
    'Batch small messages before encrypting — for payloads under 100 bytes, the 28-byte overhead adds 28%+ to message size. Aggregating 10 messages into one reduces per-message overhead by 10×.',
    'Verify AES-NI is enabled on your server — run <code>openssl speed -evp aes-256-gcm</code> to benchmark actual throughput. AES-NI delivers 2,000–4,000 MB/s; software-only AES is ~10× slower.',
    'Reuse nonces carefully — AES-GCM nonces must be unique per key, not random, to avoid catastrophic security failures. Use a counter-based nonce scheme for high-throughput systems.',
    'For TLS connections, encryption overhead per record is small, but the handshake is the dominant cost. Use the <a href="/calculators/tls-handshake-time-estimator">TLS Handshake Time Estimator</a> to model initial connection latency separately.',
    'On ARM devices without AES-NI (many IoT chips), ChaCha20-Poly1305 is 2–5× faster than AES-GCM in software — it was designed for exactly this use case and has the same 28-byte overhead.',
  ],
  faq: [
    {
      question: 'How many bytes does AES-256-GCM add to each message?',
      answer: 'AES-256-GCM adds exactly 28 bytes per encryption operation: a 12-byte initialization vector (nonce) and a 16-byte GCM authentication tag. This overhead is constant regardless of plaintext size. For a 1 KB message the overhead is 2.7%; for a 1 MB file it is 0.003%. AES-128-GCM has identical overhead.',
    },
    {
      question: 'What is the difference between AES-GCM and AES-CBC overhead?',
      answer: 'AES-GCM adds 28 bytes (12B nonce + 16B tag) with no padding, and provides authentication built in. AES-CBC adds 16–32 bytes: a 16-byte IV plus PKCS7 padding of 1–16 bytes. CBC provides no authentication, so you must add a separate HMAC (typically 32 bytes), making the total CBC overhead 48–64 bytes per message — nearly double GCM.',
    },
    {
      question: 'How do I measure actual encryption throughput on my server?',
      answer: 'Run <code>openssl speed -evp aes-256-gcm</code> on your target machine for AES-GCM throughput, or <code>openssl speed -evp chacha20-poly1305</code> for ChaCha20. Results vary by CPU generation: Intel Ice Lake with AES-NI typically achieves 3,000–5,000 MB/s for AES-256-GCM. Always benchmark on production hardware since cloud VM performance varies significantly.',
    },
    {
      question: 'When should I use ChaCha20-Poly1305 instead of AES-256-GCM?',
      answer: 'Use ChaCha20-Poly1305 on devices without hardware AES acceleration — most mobile phones, IoT sensors, and older ARM chips. On these platforms ChaCha20 is 2–5× faster than software AES. On servers with AES-NI, AES-256-GCM is typically faster. Both algorithms have the same 28-byte overhead per operation and equivalent security strength.',
    },
    {
      question: 'Does encryption overhead affect TLS performance significantly?',
      answer: 'TLS record encryption adds 28–29 bytes per record, which is negligible for 16 KB records (0.2% overhead). The dominant TLS overhead is the handshake, not bulk encryption. For latency-sensitive applications, the key metric is handshake time — model it with the <a href="/calculators/tls-handshake-time-estimator">TLS Handshake Time Estimator</a>. After the handshake, bulk encryption is typically limited by network bandwidth, not CPU.',
    },
  ],
  relatedSlugs: ['tls-handshake-time-estimator', 'compression-ratio-calculator', 'base64-size-calculator'],
};

export const encryptionOverheadCalculator: CalculatorDefinition = { meta, Component: EncryptionOverheadUI };
