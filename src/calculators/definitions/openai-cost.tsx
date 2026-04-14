import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

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
  title: 'OpenAI API Cost Calculator (Free + Accurate 2026)',
  shortTitle: 'OpenAI Cost',
  description: 'Calculate the exact cost of OpenAI API calls by model. Enter input and output tokens to estimate GPT-4o, GPT-4, and GPT-3.5 pricing instantly.',
  keywords: ['openai api cost calculator', 'gpt token cost', 'llm api pricing', 'chatgpt api cost', 'openai cost estimator', 'gpt-4o pricing calculator', 'token pricing calculator'],
  category: 'ai',
  icon: 'AttachMoney',
  intro: 'OpenAI API cost is hard to predict at scale — especially when input and output tokens are billed separately at different rates. A single GPT-4o call might cost fractions of a cent, but at thousands of calls per day that adds up fast.\n\nThis OpenAI API cost calculator gives you the exact dollar amount before your bill arrives. Enter your input token count, output token count, and the per-million-token price for your model to get an instant cost breakdown.\n\nThe formula works for every OpenAI model — GPT-4o, GPT-4, GPT-3.5-turbo — and any LLM provider that uses per-million-token billing, including Anthropic Claude, Google Gemini, and Cohere Command.\n\nUse it to compare model costs before committing to one, budget for high-volume production workflows, estimate monthly spend from a single representative API call, or sanity-check a surprisingly large API bill.',
  howItWorks: '1. Enter your input token count — tokens in your prompt (system message + user message combined).\n2. Enter your output token count — tokens in the model\'s response.\n3. Set the input price per 1M tokens for your model (check your provider\'s pricing page).\n4. Set the output price per 1M tokens — output is billed higher than input on most models.\n5. The calculator multiplies each token count by its unit price and sums the two costs.',
  formula: 'Total Cost = (Input Tokens ÷ 1,000,000) × Input Price\n           + (Output Tokens ÷ 1,000,000) × Output Price\n\nInput Tokens  — number of tokens in your prompt\nOutput Tokens — number of tokens in the model\'s response\nInput Price   — cost per 1 million input tokens (e.g. $2.50 for GPT-4o)\nOutput Price  — cost per 1 million output tokens (e.g. $10.00 for GPT-4o)',
  example: 'Scenario: GPT-4o call with 5,000 input tokens and 1,500 output tokens\nPrices: $2.50 / 1M input, $10.00 / 1M output\n\nInput cost  = (5,000 ÷ 1,000,000) × $2.50  = $0.01250\nOutput cost = (1,500 ÷ 1,000,000) × $10.00 = $0.01500\nTotal cost  = $0.02750 per call\n\nAt 1,000 calls/day: $0.0275 × 1,000 = $27.50/day → ~$840/month',
  faq: [
    { question: 'How many tokens is 1,000 words?', answer: 'Approximately 1,300–1,500 tokens. OpenAI estimates ~750 words per 1,000 tokens, but code and structured data tokenize differently. Use the tiktoken library for an exact count.' },
    { question: 'Why is output more expensive than input?', answer: 'Generating tokens requires more compute than reading them. Most models charge 3–5× more for output tokens. GPT-4o charges $2.50/1M input vs $10.00/1M output.' },
    { question: 'What is the cheapest OpenAI model for production?', answer: 'GPT-4o mini is typically the most cost-effective for tasks that don\'t require full GPT-4-level reasoning. It runs at a fraction of GPT-4o\'s cost.' },
    { question: 'Does this calculator work for Claude or Gemini?', answer: 'Yes. Any model using per-million-token billing works with this formula. Enter that model\'s input and output prices and the result is accurate.' },
    { question: 'How do I estimate tokens before making an API call?', answer: 'Use OpenAI\'s tiktoken Python library or the js-tiktoken npm package to count tokens from your prompt string before sending the request.' },
  ],
  relatedSlugs: ['api-rate-limit-calculator', 'json-size-calculator'],
};

export const openaiCostCalculator: CalculatorDefinition = { meta, Component: OpenAICostUI };
