import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function OpenAICostUI() {
  const [inputTokens, setInputTokens] = useState<string>('1000');
  const [outputTokens, setOutputTokens] = useState<string>('500');
  const [inputPrice, setInputPrice] = useState<string>('3.00');
  const [outputPrice, setOutputPrice] = useState<string>('15.00');

  const iT = parseFloat(inputTokens) || 0;
  const oT = parseFloat(outputTokens) || 0;
  const iP = parseFloat(inputPrice) || 0;
  const oP = parseFloat(outputPrice) || 0;

  const cost = (iT / 1_000_000) * iP + (oT / 1_000_000) * oP;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate API Cost</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Input Tokens" type="number" value={inputTokens} onChange={(e) => setInputTokens(e.target.value)} />
        <TextField label="Output Tokens" type="number" value={outputTokens} onChange={(e) => setOutputTokens(e.target.value)} />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Input Price (per 1M tokens)" type="number" value={inputPrice} onChange={(e) => setInputPrice(e.target.value)} slotProps={{ htmlInput: { step: '0.01' } }} />
        <TextField label="Output Price (per 1M tokens)" type="number" value={outputPrice} onChange={(e) => setOutputPrice(e.target.value)} slotProps={{ htmlInput: { step: '0.01' } }} />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated Total Cost</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>${cost.toFixed(6)}</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'openai-cost-calculator',
  title: 'OpenAI API Cost Calculator',
  shortTitle: 'OpenAI Cost',
  description: 'Estimate the cost of OpenAI API calls based on token usage and pricing per million tokens.',
  keywords: ['openai', 'api cost', 'token calculator', 'gpt cost', 'llm pricing'],
  category: 'ai',
  icon: 'AttachMoney',
  intro: 'Quickly estimate how much an OpenAI API call will cost based on input/output tokens and model pricing. Works for GPT-4o, GPT-4, GPT-3.5, and any model with per-million-token pricing.',
  howItWorks: 'Enter the number of input and output tokens for your API call, along with the per-million-token price for each. The calculator multiplies the token count by the unit price to give you an estimated cost.',
  formula: 'Total Cost = (Input Tokens / 1,000,000) × Input Price + (Output Tokens / 1,000,000) × Output Price',
  example: 'If you send 2,000 input tokens at $3.00/1M and receive 1,000 output tokens at $15.00/1M:\n\nInput cost = (2000 / 1,000,000) × 3.00 = $0.006\nOutput cost = (1000 / 1,000,000) × 15.00 = $0.015\nTotal = $0.021',
  faq: [
    { question: 'What are tokens?', answer: 'Tokens are chunks of text that language models process. A token is roughly 4 characters in English, or about ¾ of a word.' },
    { question: 'Where do I find token pricing?', answer: 'OpenAI publishes pricing on their website. Prices vary by model — GPT-4o is cheaper than GPT-4, for example.' },
    { question: 'Does this include fine-tuning costs?', answer: 'No. This calculator covers inference (API call) costs only. Fine-tuning has separate per-token training costs.' },
    { question: 'Can I use this for other LLM providers?', answer: 'Yes! Any provider that charges per million tokens (Anthropic, Cohere, etc.) works with this formula.' },
  ],
  relatedSlugs: ['json-size-calculator', 'api-rate-limit-calculator'],
};

export const openaiCostCalculator: CalculatorDefinition = { meta, Component: OpenAICostUI };
