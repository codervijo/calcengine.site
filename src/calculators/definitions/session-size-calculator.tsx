import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function SessionSizeUI() {
  const [systemTokens, setSystemTokens] = useState<string>('500');
  const [turns, setTurns] = useState<string>('10');
  const [userTokens, setUserTokens] = useState<string>('150');
  const [assistantTokens, setAssistantTokens] = useState<string>('300');
  const [contextWindow, setContextWindow] = useState<string>('128000');

  const sT = parseFloat(systemTokens) || 0;
  const n = parseFloat(turns) || 0;
  const uT = parseFloat(userTokens) || 0;
  const aT = parseFloat(assistantTokens) || 0;
  const cW = parseFloat(contextWindow) || 128000;

  const totalTokens = sT + n * (uT + aT);
  const usagePct = cW > 0 ? Math.min((totalTokens / cW) * 100, 100) : 0;
  const turnsBeforeOverflow = cW > 0 && (uT + aT) > 0
    ? Math.max(0, Math.floor((cW - sT) / (uT + aT)))
    : Infinity;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Session Size</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="System Prompt Tokens"
          type="number"
          value={systemTokens}
          onChange={(e) => setSystemTokens(e.target.value)}
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          label="Number of Turns"
          type="number"
          value={turns}
          onChange={(e) => setTurns(e.target.value)}
          slotProps={{ htmlInput: { min: 0 } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Avg User Message Tokens"
          type="number"
          value={userTokens}
          onChange={(e) => setUserTokens(e.target.value)}
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <TextField
          label="Avg Assistant Message Tokens"
          type="number"
          value={assistantTokens}
          onChange={(e) => setAssistantTokens(e.target.value)}
          slotProps={{ htmlInput: { min: 0 } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Context Window Size (tokens)"
          type="number"
          value={contextWindow}
          onChange={(e) => setContextWindow(e.target.value)}
          slotProps={{ htmlInput: { min: 1 } }}
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Session Tokens</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{totalTokens.toLocaleString()}</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 1.5 }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Context Window Used</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>{usagePct.toFixed(1)}%</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Max Turns Before Overflow</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {turnsBeforeOverflow === Infinity ? '∞' : turnsBeforeOverflow.toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'session-size-calculator',
  title: 'Session Size Calculator',
  shortTitle: 'Session Size',
  description: 'Calculate session size in tokens for LLM API calls. Enter system prompt, turn count, and message lengths to find context window usage and overflow limits.',
  keywords: [
    'session size calculator',
    'llm session token calculator',
    'chat session token count',
    'context window usage calculator',
    'api session size estimator',
    'conversation token calculator',
    'session overflow calculator',
    'gpt session length calculator',
  ],
  category: 'api',
  icon: 'DataUsage',
  tagline: 'Estimate the total token size of an LLM API session and see how much of your context window it consumes. Built for developers sizing chat sessions, agents, and multi-turn API calls.',
  lastUpdated: 'April 2026',
  intro: 'A session size calculator helps you measure the cumulative token footprint of a multi-turn LLM conversation before it hits the context window limit. Because most chat APIs send the full conversation history on every request, token counts grow linearly with each turn — making early estimation critical for long-running sessions.\n\nDevelopers building chatbots, AI agents, and assistants need to know when a session will overflow the model\'s context window. Overflows cause silent truncation (the model forgets earlier messages), unexpected API errors, or forced session resets that break user experience. This calculator shows you exactly how many turns a session can sustain before that happens.\n\nSession token budgets vary widely by use case. A simple Q&A bot with a short system prompt and terse messages can run hundreds of turns. A complex agent with a large tool manifest and verbose reasoning steps may exhaust a 128k context window in fewer than 20 turns. Use this tool to design the right strategy — truncation, summarisation, or model selection — before you hit production limits.\n\nThe formula applies to any provider using context-window billing: OpenAI GPT-4o (128k), Anthropic Claude 3.5 (200k), Google Gemini 1.5 Pro (1M), and others. Plug in that model\'s context window size and your typical message lengths to get an accurate capacity estimate.',
  howItWorksTitle: 'How to Calculate Session Size in Tokens',
  howItWorksImage: '/images/calculators/session-size-calculator-how-it-works.svg',
  howItWorks: '1. Count your system prompt tokens — the fixed overhead present on every API call in the session.\n2. Estimate the average user message length in tokens for your use case (short questions vs. long document pastes).\n3. Estimate the average assistant response length in tokens.\n4. Enter the number of conversation turns you want to support.\n5. The calculator sums all tokens: system prompt + (turns × (user tokens + assistant tokens)).\n6. Compare the total against your model\'s context window to see usage percentage and turns before overflow.',
  formula: 'Total Session Tokens = System Prompt Tokens\n                      + Turns × (Avg User Tokens + Avg Assistant Tokens)\n\nContext Window Usage (%) = (Total Session Tokens ÷ Context Window Size) × 100\n\nMax Turns Before Overflow = floor((Context Window Size − System Prompt Tokens)\n                                   ÷ (Avg User Tokens + Avg Assistant Tokens))\n\nSystem Prompt Tokens  — fixed token count sent on every call (instructions, tools)\nTurns                 — number of user+assistant message pairs in the session\nAvg User Tokens       — mean token count of each user message\nAvg Assistant Tokens  — mean token count of each assistant response\nContext Window Size   — model\'s maximum context in tokens (e.g. 128,000 for GPT-4o)',
  examplesTitle: 'Example Session Size Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — Customer support chatbot (GPT-4o, 128k context)',
      body: 'System prompt:       500 tokens\nTurns:                10\nAvg user message:    150 tokens\nAvg assistant reply: 300 tokens\n\nTotal = 500 + 10 × (150 + 300)\n      = 500 + 4,500\n      = 5,000 tokens\n\nContext usage: 5,000 ÷ 128,000 = 3.9%\nMax turns before overflow: floor((128,000 − 500) ÷ 450) = 283 turns',
    },
    {
      title: 'Example 2 — AI coding agent with large tool manifest (GPT-4o, 128k context)',
      body: 'System prompt:     8,000 tokens  (tools + instructions)\nTurns:                20\nAvg user message:    800 tokens  (code pastes)\nAvg assistant reply: 1,200 tokens (patches + explanations)\n\nTotal = 8,000 + 20 × (800 + 1,200)\n      = 8,000 + 40,000\n      = 48,000 tokens\n\nContext usage: 48,000 ÷ 128,000 = 37.5%\nMax turns before overflow: floor((128,000 − 8,000) ÷ 2,000) = 60 turns',
    },
    {
      title: 'Example 3 — Long-running research agent (Claude 3.5, 200k context)',
      body: 'System prompt:     3,000 tokens\nTurns:               100\nAvg user message:    500 tokens\nAvg assistant reply: 1,500 tokens\n\nTotal = 3,000 + 100 × (500 + 1,500)\n      = 3,000 + 200,000\n      = 203,000 tokens  ← OVERFLOW\n\nContext usage: 203,000 ÷ 200,000 = 101.5%  ← exceeds limit\nMax turns before overflow: floor((200,000 − 3,000) ÷ 2,000) = 98 turns\nAction: reduce to 98 turns or apply rolling summarisation at turn 80',
    },
  ],
  tipsTitle: 'Tips to Manage Session Token Size',
  tips: [
    'Summarise mid-session. When the session reaches 70–80% of the context window, replace the oldest N turns with a compressed summary. This preserves continuity without truncating the system prompt or recent context.',
    'Audit your system prompt regularly. A bloated system prompt costs tokens on every single call. Trim instructions that repeat themselves, remove unused tool definitions, and store long reference material out of the prompt (e.g. via RAG retrieval).',
    'Choose the right context window for the job. If your sessions routinely exceed 50k tokens, evaluate Claude 3.5 (200k) or Gemini 1.5 Pro (1M) before paying for repeated context refills with a smaller-window model.',
    'Use streaming and early stopping. If assistant responses are verbose, stream the output and stop generation once you have the needed information — shorter actual responses reduce the token growth rate per turn.',
    'Track tokens in the API response. Every major LLM API returns a <code>usage</code> field with exact input and output counts. Log these per turn to measure real session growth rather than estimating.',
    'Apply per-user session limits. Set a hard limit (e.g. 50 turns or 80% context usage) in your application layer and prompt the user to start a new session. This prevents surprise overflow errors and controls per-session cost. Use the <a href="/calculators/openai-cost-calculator">OpenAI Cost Calculator</a> to model the cost impact.',
  ],
  faq: [
    {
      question: 'What happens when a session exceeds the context window?',
      answer: 'The API returns an error or silently truncates the oldest messages depending on the provider and SDK. Truncation is dangerous because the model loses access to earlier context — instructions, user preferences, or prior decisions — without warning. Design your application to detect near-overflow conditions and apply summarisation or session reset before the limit is reached.',
    },
    {
      question: 'Does the context window reset between API calls in the same session?',
      answer: 'No. Most LLM APIs are stateless — your client sends the full conversation history on every request. The context window is consumed by the total tokens sent per call, not per session. As the conversation grows, each subsequent call is larger and more expensive. Session management is entirely the responsibility of the calling application, not the API.',
    },
    {
      question: 'How do I count tokens in a system prompt or message?',
      answer: 'For OpenAI models, use the tiktoken Python library or js-tiktoken npm package to count tokens locally before the call. For Anthropic models, the <code>anthropic.messages.count_tokens</code> method returns an exact count. You can also read the <code>usage.input_tokens</code> field in any API response to see what was charged for a given call.',
    },
    {
      question: 'What is a typical system prompt token count?',
      answer: 'Simple chatbots use 200–500 tokens. Production assistants with persona instructions, safety rules, and formatting guidance typically run 1,000–3,000 tokens. AI agents that include tool/function definitions can easily reach 5,000–15,000 tokens. The larger your system prompt, the fewer turns the session can hold. Budget it as a fixed overhead on every call.',
    },
    {
      question: 'How do I handle sessions that need to run indefinitely?',
      answer: 'Use a rolling context window strategy: keep the system prompt and the last N turns intact, and replace older turns with an LLM-generated summary. Tools like LangChain\'s <code>ConversationSummaryBufferMemory</code> or a custom summarisation step automate this. Pair this calculator with the <a href="/calculators/openai-cost-calculator">OpenAI Cost Calculator</a> to estimate the added cost of periodic summarisation calls.',
    },
  ],
  relatedSlugs: ['openai-cost-calculator', 'payload-size-calculator', 'api-pagination-limit-calculator', 'http-request-size-calculator'],
};

export const sessionSizeCalculator: CalculatorDefinition = { meta, Component: SessionSizeUI };
