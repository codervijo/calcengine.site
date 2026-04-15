import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function RegexPerformanceUI() {
  const [pattern, setPattern] = useState<string>('^([a-z0-9]+\\.)+[a-z]{2,}$');
  const [inputLength, setInputLength] = useState<string>('100');
  const [executions, setExecutions] = useState<string>('10000');

  // Strip character classes so their contents don't affect quantifier counts
  const stripped = pattern.replace(/\[[^\]]*\]/g, '[x]');

  // Count quantifiers and alternations outside character classes
  const quantifiers = (stripped.match(/[*+?]|\{[0-9]+,?[0-9]*\}/g) || []).length;
  const alternations = (stripped.match(/\|/g) || []).length;

  // Detect nested quantifiers — the primary ReDoS trigger: (something+)+ or (x{n,m})+
  const hasNestedQuantifiers = /\([^()]*(?:[*+?]|\{[0-9]+,?[0-9]*\})[^()]*\)(?:[*+?]|\{[0-9]+,?[0-9]*\})/.test(stripped);

  // Complexity classification → exponent used in step estimate
  let complexityExponent = 1;
  let complexityClass = 'O(n)';
  if (hasNestedQuantifiers) {
    complexityExponent = 3;
    complexityClass = 'O(n³) — ReDoS Risk';
  } else if (quantifiers >= 3 && alternations >= 2) {
    complexityExponent = 2;
    complexityClass = 'O(n²)';
  } else if (quantifiers >= 3 || alternations >= 1) {
    complexityExponent = 1.5;
    complexityClass = 'O(n log n)';
  }

  const n = parseFloat(inputLength) || 0;
  const execs = parseFloat(executions) || 0;

  // Estimated steps and wall-clock time (modern regex engines ~100M steps/sec)
  const estimatedSteps = Math.pow(n, complexityExponent);
  const STEPS_PER_SEC = 100_000_000;
  const timePerExecMs = (estimatedSteps / STEPS_PER_SEC) * 1000;
  const totalTimeMs = timePerExecMs * execs;

  // Performance rating
  let rating = 'Excellent';
  if (hasNestedQuantifiers && n > 20) {
    rating = 'Critical';
  } else if (timePerExecMs > 10) {
    rating = 'Poor';
  } else if (timePerExecMs > 1) {
    rating = 'Fair';
  } else if (timePerExecMs > 0.01) {
    rating = 'Good';
  }

  const formatTime = (ms: number): string => {
    if (ms < 0.001) return `${(ms * 1_000_000).toFixed(2)} ns`;
    if (ms < 1) return `${ms.toFixed(3)} ms`;
    if (ms < 1000) return `${ms.toFixed(1)} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  };

  const formatSteps = (steps: number): string =>
    steps < 1e6
      ? steps.toLocaleString('en', { maximumFractionDigits: 0 })
      : steps.toExponential(2);

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Analyze Regex Performance</Typography>
      <TextField
        label="Regex Pattern"
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
        fullWidth
        placeholder="e.g. ^[a-z]+$"
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Input String Length (chars)"
          type="number"
          value={inputLength}
          onChange={(e) => setInputLength(e.target.value)}
          slotProps={{ htmlInput: { min: '1' } }}
        />
        <TextField
          label="Number of Executions"
          type="number"
          value={executions}
          onChange={(e) => setExecutions(e.target.value)}
          slotProps={{ htmlInput: { min: '1' } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Performance Rating</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{rating}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          {complexityClass} · ~{formatSteps(estimatedSteps)} steps · {formatTime(timePerExecMs)}/exec · {formatTime(totalTimeMs)} total
        </Typography>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">Quantifiers Found</Typography>
          <Typography variant="h5" fontWeight={700}>{quantifiers}</Typography>
        </Box>
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">Alternations (|)</Typography>
          <Typography variant="h5" fontWeight={700}>{alternations}</Typography>
        </Box>
        <Box sx={{ bgcolor: hasNestedQuantifiers ? 'error.light' : 'grey.50', p: 2, borderRadius: 1, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">Nested Quantifiers</Typography>
          <Typography variant="h5" fontWeight={700} color={hasNestedQuantifiers ? 'error.main' : 'inherit'}>
            {hasNestedQuantifiers ? 'Yes — ReDoS' : 'No'}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'regex-performance-calculator',
  title: 'Regex Performance Calculator',
  shortTitle: 'Regex Performance',
  description: 'Regex performance calculator — analyze any pattern for ReDoS risk, O(n) to O(n3) time complexity, and estimated execution time per run in milliseconds.',
  keywords: [
    'regex performance calculator',
    'regex complexity analyzer',
    'redos vulnerability checker',
    'regex backtracking calculator',
    'regex time complexity',
    'catastrophic backtracking detector',
    'regex optimization tool',
    'regex efficiency estimator',
  ],
  category: 'general',
  icon: 'Speed',
  tagline: 'Paste any regex pattern to instantly estimate its time complexity, detect catastrophic backtracking (ReDoS), and calculate execution time at your target scale.',
  lastUpdated: 'April 2026',
  intro: 'A regex performance calculator helps developers catch slow patterns before they reach production. Most regex engines use backtracking — when a pattern fails to match, the engine reverses and tries alternative paths. For simple patterns this is harmless, but certain constructions like nested quantifiers (e.g. (a+)+) can cause the match time to grow exponentially with input length, a class of vulnerability known as ReDoS (Regular Expression Denial of Service).\n\nThis calculator analyses your pattern for quantifier count, alternation branches, and nested quantifier structures. It classifies the result as O(n), O(n log n), O(n²), or O(n³) and converts that to an estimated wall-clock time using a 100 million steps-per-second baseline — a reasonable figure for V8, PCRE2, and most production-grade engines running on modern hardware.\n\nThe tool is useful for backend engineers validating user-supplied input patterns, security reviewers auditing APIs that accept regex strings, and frontend developers who need to understand why a particular form validation hangs the browser tab on long inputs. Enter your pattern and a realistic input length — worst-case strings are usually close to the pattern length — then adjust executions to model throughput.\n\nNote that this is an analytical estimate, not a benchmark. Actual performance depends on the specific engine, JIT compilation, input distribution, and early-exit optimisations. Use the results as a relative signal: O(n) patterns are safe, O(n²) patterns warrant review, and O(n³) patterns with nested quantifiers should be rewritten before deployment.',
  howItWorksTitle: 'How the Regex Performance Calculator Works',
  howItWorksImage: '/images/calculators/regex-performance-calculator-how-it-works.svg',
  howItWorks: '1. Enter your regex pattern — the calculator strips character classes and counts quantifiers (* + ? {n,m}) and alternation operators (|) in the remaining structure.\n2. It checks for nested quantifiers: a group containing a quantifier that is itself followed by a quantifier, e.g. (a+)+ or ([a-z]{2,})*.\n3. The complexity class is determined: O(n) for simple patterns, O(n log n) for many quantifiers or alternations, O(n²) for combined alternation and quantifiers, O(n³) for nested quantifiers.\n4. Estimated steps = string length raised to the complexity exponent (1, 1.5, 2, or 3).\n5. Estimated time per execution = steps ÷ 100,000,000 × 1,000 ms.\n6. A performance rating (Excellent / Good / Fair / Poor / Critical) is assigned based on the time per execution.',
  formula: 'Estimated Steps = String Length ^ Complexity Exponent\n\nComplexity Exponent:\n  No nested quantifiers, ≤ 2 quants, 0 alternations  → 1    (O(n))\n  ≥ 3 quantifiers OR ≥ 1 alternation                 → 1.5  (O(n log n))\n  ≥ 3 quantifiers AND ≥ 2 alternations               → 2    (O(n²))\n  Nested quantifier detected                          → 3    (O(n³) — ReDoS)\n\nEstimated Time (ms) = (Estimated Steps ÷ 100,000,000) × 1,000\n\nTotal Time (ms) = Time per Execution × Number of Executions\n\nString Length         — characters in the input string to match\nComplexity Exponent   — derived from pattern structure above\n100,000,000           — baseline regex steps per second (modern engine estimate)',
  examplesTitle: 'Example Regex Performance Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Simple email domain validator (O(n))',
      body: 'Pattern:    ^[a-z0-9]+\\.[a-z]{2,6}$\nQuantifiers: 2   Alternations: 0   Nested: No\nComplexity: O(n)   Exponent: 1\n\nString length: 50 chars\nEstimated steps: 50 ^ 1 = 50\nTime per exec:  50 ÷ 100,000,000 × 1,000 = 0.0005 ms\nRating: Excellent\n\n→ Safe for any production workload.',
    },
    {
      title: 'Example 2 — URL validator with multiple quantifiers (O(n log n))',
      body: 'Pattern:    ^https?://([a-z0-9-]+\\.)+[a-z]{2,}(/[^\\s]*)?$\nQuantifiers: 4   Alternations: 0   Nested: No\nComplexity: O(n log n)   Exponent: 1.5\n\nString length: 200 chars\nEstimated steps: 200 ^ 1.5 ≈ 2,828\nTime per exec:  2,828 ÷ 100,000,000 × 1,000 ≈ 0.028 ms\nRating: Good\n\n→ Acceptable. At 10,000 executions/sec total time ≈ 283 ms.',
    },
    {
      title: 'Example 3 — Catastrophic backtracking pattern (O(n³) ReDoS)',
      body: 'Pattern:    ^(([a-z]+)*)+$\nQuantifiers: 3   Alternations: 0   Nested: Yes\nComplexity: O(n³)   Exponent: 3\n\nString length: 30 chars (e.g. "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!")\nEstimated steps: 30 ^ 3 = 27,000\nTime per exec:  27,000 ÷ 100,000,000 × 1,000 = 0.27 ms\n\nString length: 50 chars\nEstimated steps: 50 ^ 3 = 125,000   →   1.25 ms\n\nString length: 100 chars\nEstimated steps: 100 ^ 3 = 1,000,000   →   10 ms — Poor\n\n→ Rewrite to atomic group or possessive quantifier to eliminate backtracking.',
    },
  ],
  tipsTitle: 'Tips to Improve Regex Performance',
  tips: [
    'Anchor your patterns. Adding ^ and $ eliminates backtracking by preventing the engine from searching for the pattern at every position in the string.',
    'Avoid nested quantifiers entirely. Patterns like (a+)+ or (x*y*)+ are the primary source of catastrophic backtracking. Flatten them to a single non-nested quantifier.',
    'Prefer non-capturing groups (?:...) over capturing groups (...) when you do not need the captured value — they skip the overhead of storing match offsets.',
    'Use character classes instead of alternation for single characters. [aeiou] is faster than (a|e|i|o|u) because it avoids branching.',
    'Test against worst-case inputs, not just happy-path strings. A valid email address will match quickly; a 200-character string of repeated characters designed to maximise backtracking will not.',
    'In Node.js and browser environments, consider using a linear-time regex engine such as <a href="https://github.com/google/re2" rel="noopener">RE2</a> via the <code>re2</code> npm package for user-supplied patterns — it guarantees O(n) matching at the cost of some PCRE features.',
  ],
  faq: [
    {
      question: 'What is catastrophic backtracking and how do I detect it?',
      answer: 'Catastrophic backtracking occurs when a regex engine exhausts exponential numbers of paths trying to find a match. It is triggered by nested quantifiers like (a+)+ applied to a long non-matching string. This calculator detects the pattern structurally by checking whether a group containing a quantifier is itself followed by another quantifier — the hallmark of a ReDoS-vulnerable pattern.',
    },
    {
      question: 'How accurate is the estimated execution time?',
      answer: 'The estimate is analytical, not benchmarked. It uses a 100M steps/sec baseline which is typical for V8 or PCRE2 on modern hardware. The actual number varies with JIT compilation, input distribution, early exit, and engine version. Use it as a relative signal: if two patterns differ by 100× in estimated time, the faster one is genuinely safer regardless of the absolute figure.',
    },
    {
      question: 'What does O(n²) mean for a regex pattern?',
      answer: 'O(n²) means the number of operations the engine performs grows as the square of the input length. A 100-character input requires ~10,000 steps; a 1,000-character input requires ~1,000,000 steps. For API endpoints accepting user input this is a real concern — an attacker can craft a long string to force high CPU usage. Aim for O(n) patterns in any security-sensitive context. Pair with the <a href="/calculators/latency-budget-calculator">Latency Budget Calculator</a> to see the impact on your response time budget.',
    },
    {
      question: 'Does JavaScript\'s RegExp use backtracking?',
      answer: 'Yes. The V8 JavaScript engine uses a backtracking NFA-based implementation for RegExp. This makes it vulnerable to ReDoS by design. Node.js 16+ added experimental support for linear-time matching via the Irregexp engine in some cases, but the general case remains backtracking. Always validate patterns structurally before using them against untrusted input.',
    },
    {
      question: 'How do I fix a pattern flagged as O(n²) or O(n³)?',
      answer: 'First, look for nested quantifiers and flatten them — replace (a+)+ with a+ and reconsider your matching intent. Second, add anchors (^ and $) to prevent engine-level linear scanning. Third, split complex alternation into separate simpler patterns tested in sequence. If you need full PCRE features on untrusted input, switch to the RE2 engine which guarantees linear time but does not support backreferences.',
    },
  ],
  relatedSlugs: ['latency-budget-calculator', 'cache-hit-rate-calculator', 'throughput-calculator'],
};

export const regexPerformanceCalculator: CalculatorDefinition = { meta, Component: RegexPerformanceUI };
