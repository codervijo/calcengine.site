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
  title: 'OpenAI Cost Calculator',
  shortTitle: 'OpenAI Cost',
  description: 'Calculate the exact cost of OpenAI API calls by model. Enter input and output tokens to estimate GPT-4o, o1, and GPT-3.5 pricing instantly — no sign-up required.',
  keywords: ['openai cost calculator', 'openai pricing calculator', 'gpt api cost', 'token cost calculator', 'llm api pricing', 'gpt-4o cost', 'chatgpt api cost estimator'],
  category: 'ai',
  icon: 'AttachMoney',
  tagline: 'Enter your token counts and model pricing to get an instant cost breakdown. Works with GPT-4o, o1, GPT-3.5, and any per-token LLM provider.',
  lastUpdated: 'April 2026',
  intro: 'OpenAI bills API usage per token — separately for input (your prompt) and output (the model\'s response). Input and output rates differ per model, and costs compound fast at production scale.\n\nThis calculator gives you the exact dollar amount for a single call or a projected batch. Use it to compare model costs before committing, budget a high-volume workflow, or sanity-check a surprisingly large bill.\n\nThe formula works for any provider using per-million-token billing — Anthropic Claude, Google Gemini, Cohere, Mistral — just plug in that model\'s rates.',
  howItWorksTitle: 'How to Calculate OpenAI API Cost',
  howItWorksImage: '/images/calculators/openai-cost-how-it-works.svg',
  howItWorks: '1. Find your model\'s input and output price per 1M tokens on the OpenAI pricing page.\n2. Count your prompt tokens — system message + user message combined. Use tiktoken or the API\'s usage field.\n3. Count your output tokens — the length of the model\'s response.\n4. Plug both counts and both prices into the calculator above.\n5. Multiply out: (input tokens ÷ 1,000,000) × input price + (output tokens ÷ 1,000,000) × output price.',
  formula: 'Total Cost = (Input Tokens ÷ 1,000,000) × Input Price\n           + (Output Tokens ÷ 1,000,000) × Output Price\n\nInput Tokens  — tokens in your prompt (system + user message)\nOutput Tokens — tokens in the model\'s response\nInput Price   — cost per 1M input tokens (e.g. $2.50 for GPT-4o)\nOutput Price  — cost per 1M output tokens (e.g. $10.00 for GPT-4o)',
  examplesTitle: 'Example Cost Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — GPT-4o chat call',
      body: 'Input:  2,000 tokens  ×  $2.50 / 1M  =  $0.005000\nOutput:   800 tokens  × $10.00 / 1M  =  $0.008000\n                                        ─────────────\nTotal per call: $0.013000   →   $13.00 per 1,000 calls',
    },
    {
      title: 'Example 2 — GPT-4o mini at scale (high-volume classification)',
      body: 'Input:  1,500 tokens  ×  $0.15 / 1M  =  $0.000225\nOutput:   500 tokens  ×  $0.60 / 1M  =  $0.000300\n                                        ─────────────\nTotal per call: $0.000525   →   $0.525 per 1,000 calls   →   ~$15.75 / month at 30k calls/day',
    },
    {
      title: 'Example 3 — o1 reasoning task (use sparingly)',
      body: 'Input:  5,000 tokens  × $15.00 / 1M  =  $0.075000\nOutput: 3,000 tokens  × $60.00 / 1M  =  $0.180000\n                                        ─────────────\nTotal per call: $0.255000   →   $255.00 per 1,000 calls',
    },
  ],
  pricingTableTitle: 'OpenAI Pricing by Model',
  pricingTable: [
    { model: 'GPT-4o',        inputPer1M: '$2.50',  outputPer1M: '$10.00', notes: 'Best quality/cost balance' },
    { model: 'GPT-4o mini',   inputPer1M: '$0.15',  outputPer1M: '$0.60',  notes: 'Best for high-volume tasks' },
    { model: 'o1',            inputPer1M: '$15.00', outputPer1M: '$60.00', notes: 'Extended reasoning' },
    { model: 'o1 mini',       inputPer1M: '$3.00',  outputPer1M: '$12.00', notes: 'Faster reasoning tasks' },
    { model: 'o3 mini',       inputPer1M: '$1.10',  outputPer1M: '$4.40',  notes: 'Efficient reasoning' },
    { model: 'GPT-4 Turbo',   inputPer1M: '$10.00', outputPer1M: '$30.00', notes: 'Legacy, use GPT-4o instead' },
    { model: 'GPT-3.5 Turbo', inputPer1M: '$0.50',  outputPer1M: '$1.50',  notes: 'Simple tasks only' },
  ],
  tipsTitle: 'Tips to Reduce OpenAI API Cost',
  tips: [
    'Use GPT-4o mini for classification, extraction, and summarisation tasks — it costs 17× less than GPT-4o with comparable accuracy on structured outputs.',
    'Cache your system prompt. Prompt caching (available on GPT-4o and o1) charges cached input at a 50% discount after the first call.',
    'Trim your prompts. Every unnecessary sentence in a system message multiplies across every call. Audit and cut regularly.',
    'Batch non-urgent requests with the Batch API — OpenAI charges 50% less for async batch jobs with a 24-hour turnaround.',
    'Stream responses and stop early. If you only need the first part of a long generation, streaming lets you cancel before the full output token count runs up.',
    'Log and monitor token usage via the API response\'s usage field. Set up alerts when daily spend exceeds a threshold in the OpenAI usage dashboard.',
  ],
  faq: [
    {
      question: 'How many tokens is 1,000 words?',
      answer: 'Approximately 1,300–1,500 tokens. OpenAI estimates roughly 750 words per 1,000 tokens for English prose. Code and structured JSON typically tokenise more efficiently. Use the tiktoken library or js-tiktoken for an exact count before making API calls.',
    },
    {
      question: 'Why is output more expensive than input?',
      answer: 'Generating tokens requires significantly more GPU compute than reading them. Most models charge 3–5× more for output. GPT-4o is $2.50/1M input vs $10.00/1M output. Design prompts that produce concise, structured responses to keep output costs down.',
    },
    {
      question: 'Does this calculator work for Claude, Gemini, or other LLMs?',
      answer: 'Yes — any provider using per-million-token billing works with this formula. Enter that model\'s input and output price and the result is accurate. Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro, and Mistral all use the same billing structure. If you\'re hitting provider rate limits alongside cost concerns, use the <a href="/calculators/api-rate-limit-calculator">API Rate Limit Calculator</a> to model your throughput.',
    },
    {
      question: 'What is the cheapest OpenAI model for production use?',
      answer: 'GPT-4o mini is the most cost-effective option for most production workloads — classification, extraction, summarisation, and structured output generation. It runs at $0.15/1M input and $0.60/1M output, roughly 17× cheaper than GPT-4o.',
    },
    {
      question: 'How do I count tokens before making an API call?',
      answer: 'Use OpenAI\'s tiktoken Python library or the js-tiktoken npm package. Both let you tokenise a prompt string locally and get an exact count before sending the request. You can also check the usage field in the API response after each call to audit actual consumption. To estimate how large your JSON request payload will be in bytes before sending, try the <a href="/calculators/json-size-calculator">JSON Size Calculator</a>.',
    },
    {
      question: 'How much does OpenAI charge per 1,000 tokens?',
      answer: 'GPT-4o costs $0.0025 per 1,000 input tokens and $0.01 per 1,000 output tokens. GPT-4o mini costs $0.00015 per 1,000 input tokens and $0.0006 per 1,000 output tokens. To get the per-thousand rate for any model, divide the per-million price by 1,000 — the pricing table above lists all current models.',
    },
  ],
  relatedSlugs: ['api-rate-limit-calculator', 'json-size-calculator', 'base64-size-calculator'],
};

export const openaiCostCalculator: CalculatorDefinition = { meta, Component: OpenAICostUI };
