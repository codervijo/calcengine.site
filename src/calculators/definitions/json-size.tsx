import { useState } from 'react';
import { TextField, Typography, Stack, Box, Alert } from '@mui/material';
import { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function JsonSizeUI() {
  const [json, setJson] = useState<string>('{"hello": "world"}');
  const [error, setError] = useState<string>('');

  let bytes = 0;
  let valid = true;
  try {
    JSON.parse(json);
    bytes = new Blob([json]).size;
    if (error) setError('');
  } catch {
    valid = false;
  }

  const kb = bytes / 1024;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Paste Your JSON</Typography>
      <TextField
        label="JSON Input"
        multiline
        minRows={5}
        maxRows={15}
        value={json}
        onChange={(e) => { setJson(e.target.value); setError(''); }}
      />
      {!valid && json.trim().length > 0 && (
        <Alert severity="warning">Invalid JSON — please check your syntax.</Alert>
      )}
      {valid && (
        <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
          <Stack direction="row" spacing={4} sx={{ justifyContent: 'center' }}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>Bytes</Typography>
              <Typography variant="h3" component="p" sx={{ fontWeight: 700 }}>{bytes.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>KB</Typography>
              <Typography variant="h3" component="p" sx={{ fontWeight: 700 }}>{kb.toFixed(2)}</Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'json-size-calculator',
  title: 'JSON Size Calculator — Check Payload Bytes & KB (Free 2026)',
  shortTitle: 'JSON Size',
  description: 'Instantly calculate the byte size and KB of any JSON string. Validates syntax in real time. Essential for API payload optimization and size limit checks.',
  keywords: ['json size calculator', 'json payload size', 'json byte size', 'check json size online', 'api payload size checker', 'json kb calculator', 'json minify size'],
  category: 'data',
  icon: 'DataObject',
  intro: 'JSON payload size matters more than most developers realize. AWS API Gateway rejects payloads over 10 MB. Lambda has a 6 MB synchronous invocation limit. Mobile networks degrade when responses exceed a few KB. Knowing your JSON size before you deploy can prevent silent failures in production.\n\nThis JSON size calculator shows the exact byte count and kilobyte size of any JSON string, using the same UTF-8 encoding your browser and server will use. Paste your payload and get an instant result — no backend, no guessing.\n\nIt also validates JSON syntax on the fly, so malformed payloads are caught before they reach your API.\n\nUse it to verify a payload fits within an API\'s size limit, compare minified vs. pretty-printed JSON sizes, check whether a cached response is worth compressing, or debug unexpected 413 Payload Too Large errors.',
  howItWorks: '1. Paste your JSON into the input field.\n2. The calculator runs JSON.parse to validate syntax — invalid JSON is flagged immediately.\n3. It encodes the string as UTF-8 using the Blob API, which mirrors how browsers and servers measure payload size.\n4. Size is displayed in bytes and kilobytes.',
  formula: 'Size (bytes) = UTF-8 encoded byte length of the JSON string\nSize (KB)    = Size (bytes) ÷ 1,024\n\nEncoding rules:\n- ASCII characters (a-z, 0-9, brackets, quotes) = 1 byte each\n- Latin accented characters (é, ñ) = 2 bytes each\n- CJK characters and emoji = 2–4 bytes each',
  example: 'Input: {"user":"alice","role":"admin","active":true}\nBytes: 50 (all ASCII, 1 byte per character)\nKB: 50 ÷ 1,024 = 0.049 KB\n\nMinified vs. pretty-printed comparison:\nPretty:    {"user": "alice", "role": "admin"} → 39 bytes\nMinified:  {"user":"alice","role":"admin"}    → 33 bytes\nSavings:   6 bytes (15%) just by removing whitespace',
  faq: [
    { question: 'Does whitespace affect JSON size?', answer: 'Yes. Every space, tab, and newline adds bytes. Pretty-printed JSON is typically 15–30% larger than minified JSON. Strip whitespace for production API payloads.' },
    { question: 'What encoding does this calculator use?', answer: 'UTF-8, which is the JSON standard per RFC 8259. Most APIs and browsers default to UTF-8. The Blob API used here mirrors real-world browser behavior exactly.' },
    { question: 'Why do emoji make JSON larger?', answer: 'Each emoji is 2–4 bytes in UTF-8 vs. 1 byte for ASCII. A string with 100 emoji can be 300–400 bytes instead of 100.' },
    { question: 'What are common API JSON size limits?', answer: 'AWS API Gateway: 10 MB. AWS Lambda sync invocation: 6 MB. Cloudflare Workers: 100 MB request body. Most REST APIs recommend keeping responses under 1 MB for performance.' },
    { question: 'How do I reduce JSON payload size?', answer: 'Minify (remove whitespace), shorten key names, remove null fields, and apply GZIP compression — which typically reduces JSON by 60–80%. Base64-encode binary data only when necessary.' },
  ],
  relatedSlugs: ['base64-size-calculator', 'openai-cost-calculator'],
};

export const jsonSizeCalculator: CalculatorDefinition = { meta, Component: JsonSizeUI };
