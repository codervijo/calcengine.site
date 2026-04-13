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
  title: 'JSON Size Calculator',
  shortTitle: 'JSON Size',
  description: 'Calculate the byte size and KB of any JSON string. Validates JSON syntax in real time.',
  keywords: ['json size', 'json bytes', 'json validator', 'payload size', 'json calculator'],
  category: 'data',
  icon: 'DataObject',
  intro: 'Paste any JSON and instantly see its size in bytes and kilobytes. Also validates whether the JSON is syntactically correct.',
  howItWorks: 'The calculator encodes your JSON string as UTF-8 and measures the resulting byte length. It also runs JSON.parse to validate syntax.',
  formula: 'Size (bytes) = UTF-8 encoded byte length of the JSON string\nSize (KB) = Size (bytes) / 1024',
  example: 'The JSON string {"hello":"world"} is 17 bytes, or about 0.017 KB.',
  faq: [
    { question: 'Does whitespace affect size?', answer: 'Yes. Spaces, tabs, and newlines all add bytes. Minified JSON is smaller than pretty-printed JSON.' },
    { question: 'What encoding is used?', answer: 'UTF-8, which is the standard for JSON. Multi-byte characters (emoji, CJK) use more bytes per character.' },
    { question: 'Can I check API payload sizes?', answer: 'Absolutely. Paste the JSON body you plan to send and see if it fits within API size limits.' },
  ],
  relatedSlugs: ['base64-size-calculator', 'openai-cost-calculator'],
};

export const jsonSizeCalculator: CalculatorDefinition = { meta, Component: JsonSizeUI };
