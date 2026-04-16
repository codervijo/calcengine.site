import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function HashCollisionProbabilityUI() {
  const [numItems, setNumItems] = useState<string>('10000');
  const [hashBits, setHashBits] = useState<string>('32');

  const n = parseFloat(numItems) || 0;
  const bits = parseFloat(hashBits) || 32;

  // Hash space: H = 2^bits
  const H = Math.pow(2, bits);
  // Birthday problem: P = 1 - e^(-n(n-1)/(2H))
  const exponent = (n * (n - 1)) / (2 * H);
  const probability = 1 - Math.exp(-exponent);
  const probabilityPercent = probability * 100;

  const probDisplay =
    probability > 0.9999
      ? '>99.99%'
      : probabilityPercent < 1e-7
        ? (probabilityPercent).toExponential(3) + '%'
        : probabilityPercent.toFixed(6) + '%';

  const hashSpaceDisplay = H < 1e15 ? H.toLocaleString() : H.toExponential(3);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Collision Probability</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Number of Items"
          type="number"
          value={numItems}
          onChange={(e) => setNumItems(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          fullWidth
        />
        <TextField
          label="Hash Size (bits)"
          type="number"
          value={hashBits}
          onChange={(e) => setHashBits(e.target.value)}
          slotProps={{ htmlInput: { min: 1, max: 512, step: 1 } }}
          fullWidth
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Collision Probability</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{probDisplay}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
          Hash space: 2<sup>{Math.round(bits)}</sup> = {hashSpaceDisplay} possible values
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'hash-collision-probability-calculator',
  title: 'Hash Collision Probability Calculator',
  shortTitle: 'Hash Collision',
  description: 'Calculate hash collision probability for any hash function size. Enter item count and bit width to estimate birthday problem collision risk instantly.',
  keywords: [
    'hash collision probability calculator',
    'birthday problem hash calculator',
    'hash collision risk estimator',
    'sha256 collision probability',
    'crc32 collision calculator',
    'hash table collision chance',
    'birthday paradox calculator',
    'hash function bit size collision',
  ],
  category: 'encoding',
  icon: 'Tag',
  tagline: 'Enter the number of items and your hash function\'s bit size to instantly calculate the probability of at least one collision. Covers CRC32, SHA-256, and any fixed-width hash.',
  lastUpdated: 'April 2026',
  intro: 'A hash collision probability calculator tells you how likely it is that two items in your dataset will share the same hash value — a risk that compounds faster than most engineers expect. The math is the same as the birthday paradox: in a group of just 23 people, there\'s a greater-than-even chance two share a birthday. Hash functions face the same statistical pressure.\n\nThis tool is useful for anyone picking a hash function for a cache key, a distributed shard key, a URL fingerprint, or a deduplication lookup. The collision rate depends on exactly two things: the number of items you\'re hashing and the output width of your hash function in bits. Plugging those in gives you the exact probability before you commit to a design.\n\nDevelopers often underestimate how quickly a 32-bit hash exhausts its collision budget. CRC32 reaches a 50% collision probability at around 77,000 items — well within the scale of a busy web service\'s session store or URL cache. A 64-bit hash pushes that threshold to roughly 5 billion items, and SHA-256 (256-bit) is astronomically safe for any practical dataset.\n\nUse this calculator alongside your load and capacity planning. If your hash function choice turns out to be too narrow, pair this result with the compression ratio or payload size calculators to model the cost of widening your keys.',
  howItWorksTitle: 'How to Calculate Hash Collision Probability',
  howItWorksImage: '/images/calculators/hash-collision-probability-calculator-how-it-works.svg',
  howItWorks: '1. Select your hash function\'s output size in bits — for example, 32 for CRC32, 64 for FNV-64 or xxHash64, 128 for MurmurHash3, or 256 for SHA-256.\n2. Enter the number of items you plan to hash: rows in a table, cache keys, session IDs, or URLs.\n3. The calculator computes the hash space H = 2^bits — the total count of distinct hash values your function can produce.\n4. It applies the birthday problem formula: P = 1 − e^(−n(n−1) ÷ (2H)).\n5. The result is the probability that at least one pair of items collides — i.e., two different inputs produce an identical hash output.',
  formula: 'P(collision) = 1 − e^(−n(n−1) / (2H))\n\nn    — number of items hashed\nH    — hash space size: H = 2^bits\nbits — hash function output width (e.g. 32, 64, 128, 256)\ne    — Euler\'s number (≈ 2.71828)\n\nApproximation for large H (n << H):\n  P ≈ n² / (2H)',
  examplesTitle: 'Example Hash Collision Probability Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — CRC32 (32-bit) at the 50% collision point',
      body: 'n = 77,163 items    H = 2^32 = 4,294,967,296\nexponent = 77,163 × 77,162 ÷ (2 × 4,294,967,296)\n         = 5,953,628,406 ÷ 8,589,934,592\n         ≈ 0.6931\nP = 1 − e^(−0.6931) ≈ 50.0%\n→ With just 77 k items, a CRC32-keyed cache has a coin-flip chance of a collision.',
    },
    {
      title: 'Example 2 — FNV-64 (64-bit) with 1 million items',
      body: 'n = 1,000,000 items    H = 2^64 ≈ 1.844 × 10^19\nexponent = (1 × 10^6)² ÷ (2 × 1.844 × 10^19)\n         = 1 × 10^12 ÷ 3.689 × 10^19\n         ≈ 2.71 × 10^−8\nP ≈ 2.71 × 10^−8 ≈ 0.0000027%\n→ A 64-bit hash with a million keys is effectively collision-free in practice.',
    },
    {
      title: 'Example 3 — SHA-256 (256-bit) with 1 trillion items',
      body: 'n = 1 × 10^12 items    H = 2^256 ≈ 1.158 × 10^77\nexponent = (1 × 10^12)² ÷ (2 × 1.158 × 10^77)\n         = 1 × 10^24 ÷ 2.316 × 10^77\n         ≈ 4.32 × 10^−54\nP ≈ 4.32 × 10^−54 (astronomically close to zero)\n→ SHA-256 is collision-resistant for all practical dataset sizes — including planetary-scale systems.',
    },
  ],
  tipsTitle: 'Tips for Choosing a Hash Function and Managing Collision Risk',
  tips: [
    'Use a 64-bit hash (xxHash64, SipHash, FNV-64) for all hash-table and cache-key use cases — collision probability stays below 1 in 10 billion for datasets under a billion items.',
    'Avoid CRC32 as a uniqueness key. It saturates quickly: collision probability hits 1% at ~9,300 items and 50% at ~77,000 items. CRC32 is a checksum, not a unique fingerprint.',
    'For deduplication or content addressing (storing files, blobs, or commits), use SHA-256 or BLAKE3. Their 256-bit output makes accidental collisions mathematically negligible even at petabyte scale.',
    'The birthday paradox bites harder than intuition suggests. A 50% collision threshold for a b-bit hash is roughly √(2^b × ln 2) — far fewer items than 2^b.',
    'In hash tables with chaining, collisions slow lookups but don\'t lose data. In caches or sets that use hashes as unique keys, a collision silently returns the wrong value — treat collision probability as a correctness risk, not just a performance risk.',
    'If you\'re hashing user-controlled input (e.g. HTTP request routing, map keys in a service), use a keyed hash like SipHash to prevent hash-flooding DoS attacks — collision resistance alone is not sufficient.',
  ],
  faq: [
    {
      question: 'What is a hash collision?',
      answer: 'A hash collision occurs when two different inputs produce the same hash output. Because hash functions map arbitrarily large inputs to a fixed-size output (e.g. 32 bits = ~4.3 billion values), collisions are mathematically inevitable as item counts grow. The birthday problem formula quantifies exactly how likely a collision is given your dataset size and hash width.',
    },
    {
      question: 'How does the birthday problem apply to hash functions?',
      answer: 'The birthday paradox shows that in a group of 23 people, there\'s a >50% chance two share a birthday — far fewer than the 366 days in a year. Hash functions face identical math: a 32-bit hash has 4.3 billion possible values, yet just 77,163 items give a 50% collision probability. This calculator applies the exact birthday problem formula: P = 1 − e^(−n(n−1)÷(2H)).',
    },
    {
      question: 'When is a 32-bit hash safe to use?',
      answer: 'A 32-bit hash keeps collision probability below 1% for datasets of up to ~9,300 items and below 0.1% for up to ~2,900 items. Beyond those thresholds, use a 64-bit hash. CRC32 is appropriate for integrity checks (detecting accidental corruption), but should not be used as a unique key for anything larger than a small in-memory lookup table.',
    },
    {
      question: 'Which hash function should I use in production?',
      answer: 'For non-cryptographic use cases — hash tables, cache keys, sharding, bloom filters — use xxHash64, SipHash-2-4, or MurmurHash3 (128-bit). They are fast, well-distributed, and collision-resistant at practical scales. For cryptographic integrity or content addressing where security guarantees matter, use SHA-256 or BLAKE3. Never use MD5 or SHA-1 for security-sensitive applications.',
    },
    {
      question: 'Does lower collision probability mean a better hash function?',
      answer: 'Not entirely. Collision probability depends on output bit width and item count, not hash quality. A good hash function also distributes values uniformly across the output space. A poor-quality hash can cluster values into a small region — causing frequent bucket collisions in a hash table even without a formal birthday-problem collision. For critical applications, validate distribution with a chi-squared test in addition to checking collision probability.',
    },
  ],
  relatedSlugs: ['base64-size-calculator', 'compression-ratio-calculator', 'json-size-calculator'],
};

export const hashCollisionProbabilityCalculator: CalculatorDefinition = { meta, Component: HashCollisionProbabilityUI };
