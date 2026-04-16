import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function MessageQueueDelayUI() {
  const [queueDepth, setQueueDepth] = useState<string>('1000');
  const [consumerRate, setConsumerRate] = useState<string>('100');
  const [processingTime, setProcessingTime] = useState<string>('5');
  const [networkLatency, setNetworkLatency] = useState<string>('2');
  const [serializationOverhead, setSerializationOverhead] = useState<string>('1');

  const depth = parseFloat(queueDepth) || 0;
  const rate = parseFloat(consumerRate) || 1;
  const proc = parseFloat(processingTime) || 0;
  const net = parseFloat(networkLatency) || 0;
  const serial = parseFloat(serializationOverhead) || 0;

  const queueWaitTime = (depth / rate) * 1000;
  const fixedDelays = proc + net + serial;
  const totalDelay = queueWaitTime + fixedDelays;

  const formatMs = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(2)} s`;
    return `${ms.toFixed(1)} ms`;
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Message Queue Delay</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Queue Depth (messages)"
          type="number"
          value={queueDepth}
          onChange={(e) => setQueueDepth(e.target.value)}
        />
        <TextField
          label="Consumer Throughput (msg/s)"
          type="number"
          value={consumerRate}
          onChange={(e) => setConsumerRate(e.target.value)}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Processing Time per Message (ms)"
          type="number"
          value={processingTime}
          onChange={(e) => setProcessingTime(e.target.value)}
          slotProps={{ htmlInput: { step: '0.1' } }}
        />
        <TextField
          label="Network Latency (ms)"
          type="number"
          value={networkLatency}
          onChange={(e) => setNetworkLatency(e.target.value)}
          slotProps={{ htmlInput: { step: '0.1' } }}
        />
        <TextField
          label="Serialization Overhead (ms)"
          type="number"
          value={serializationOverhead}
          onChange={(e) => setSerializationOverhead(e.target.value)}
          slotProps={{ htmlInput: { step: '0.1' } }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ flex: 1, bgcolor: 'grey.100', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">Queue Wait Time</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatMs(queueWaitTime)}</Typography>
        </Box>
        <Box sx={{ flex: 1, bgcolor: 'grey.100', p: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">Fixed Delays</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatMs(fixedDelays)}</Typography>
        </Box>
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Total Message Queue Delay</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{formatMs(totalDelay)}</Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'message-queue-delay-calculator',
  title: 'Message Queue Delay Calculator',
  shortTitle: 'Queue Delay',
  description: 'Calculate message queue delay with this free calculator. Enter queue depth, consumer rate, and latency to estimate end-to-end delay instantly — no sign-up',
  keywords: [
    'message queue delay calculator',
    'message queue latency calculator',
    'queue processing time estimator',
    'rabbitmq delay calculator',
    'kafka message delay',
    'queue depth latency',
    'end-to-end message latency',
    'message broker delay estimator',
  ],
  category: 'api',
  icon: 'Schedule',
  tagline: 'Enter your queue depth, consumer throughput, and per-message overheads to instantly calculate total end-to-end message delay. Works with RabbitMQ, Kafka, SQS, and any queue-based system.',
  lastUpdated: 'April 2026',
  intro: 'A message queue delay calculator helps you understand how long a message will wait before a consumer processes it. The dominant factor is almost always queue wait time — the backlog of messages ahead of yours divided by how fast your consumers can process them. A queue depth of 1,000 messages with 100 consumers/sec means a 10-second wait before your message is even picked up.\n\nEngineers use this tool when sizing consumer fleets before launch, diagnosing SLA breaches caused by queue backlogs, or modelling the impact of adding more consumer instances. It applies equally to RabbitMQ queues, Kafka consumer groups, AWS SQS, Azure Service Bus, and any other message broker where lag is measurable.\n\nBeyond queue wait time, three smaller delays compound on every message: the time your consumer spends executing business logic per message, the network round-trip between producer and broker, and the cost of serializing and deserializing the payload. JSON serialization alone can add 1–5 ms per message; switching to Protocol Buffers or MessagePack can recover most of that.\n\nUse the calculator above to model different consumer throughput scenarios. Doubling your consumer instances roughly halves your queue wait time — the most impactful lever in any backlog incident.',
  howItWorksTitle: 'How to Calculate Message Queue Delay',
  howItWorksImage: '/images/calculators/message-queue-delay-calculator-how-it-works.svg',
  howItWorks: '1. Enter the current queue depth — the number of messages ahead of yours waiting to be consumed.\n2. Set consumer throughput in messages per second. Find this in your broker\'s management UI (RabbitMQ ack rate, Kafka consumer group lag metrics).\n3. The calculator divides queue depth by consumer throughput and multiplies by 1,000 to get queue wait time in milliseconds.\n4. Enter per-message processing time — how long your consumer spends executing business logic after dequeuing.\n5. Enter network latency (producer→broker round-trip) and serialization overhead for your payload format.\n6. Total delay is the sum of queue wait time plus all fixed per-message delays.',
  formula: 'Total Delay (ms) = Queue Wait Time + Processing Time + Network Latency + Serialization Overhead\n\nQueue Wait Time (ms)  = (Queue Depth ÷ Consumer Throughput) × 1,000\nQueue Depth           — messages currently ahead in the queue\nConsumer Throughput   — messages consumed per second (msg/s)\nProcessing Time       — execution time per message in consumer (ms)\nNetwork Latency       — round-trip latency between producer and broker (ms)\nSerialization         — time to serialize/deserialize message payload (ms)',
  examplesTitle: 'Example Message Queue Delay Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — RabbitMQ with moderate backlog',
      body: 'Queue Depth:   500 msgs  ÷  50 msg/s  ×  1,000  =  10,000 ms  (queue wait)\nProcessing:     3 ms\nNetwork:        1 ms\nSerialization:  0.5 ms\n                                                    ──────────────────\nTotal Delay:  10,004.5 ms  (~10 seconds end-to-end)',
    },
    {
      title: 'Example 2 — Kafka high-throughput consumer group',
      body: 'Queue Depth:  10,000 msgs  ÷  5,000 msg/s  ×  1,000  =  2,000 ms  (queue wait)\nProcessing:     2 ms\nNetwork:        0.5 ms\nSerialization:  0.2 ms\n                                                    ──────────────────\nTotal Delay:  2,002.7 ms  (~2 seconds — fast at scale)',
    },
    {
      title: 'Example 3 — Background task queue (low-volume, slow consumers)',
      body: 'Queue Depth:   50 msgs  ÷  2 msg/s  ×  1,000  =  25,000 ms  (queue wait)\nProcessing:   500 ms  (heavy DB + API calls per task)\nNetwork:        5 ms\nSerialization:  2 ms\n                                                    ──────────────────\nTotal Delay:  25,507 ms  (~25.5 seconds — consumer throughput is the bottleneck)',
    },
  ],
  tipsTitle: 'Tips to Reduce Message Queue Delay',
  tips: [
    'Add more consumer instances to cut queue wait time proportionally — doubling consumers halves the wait. Use the <a href="/calculators/worker-queue-throughput-calculator">Worker Queue Throughput Calculator</a> to size your fleet before a launch.',
    'Monitor queue depth as your primary SLA metric. A safe max depth is: Consumer Throughput (msg/s) × Max Acceptable Delay (s). Set alerts at 80% of this threshold.',
    'Co-locate consumers with the broker in the same availability zone. Cross-AZ or cross-region network latency can add 5–50 ms per message — negligible at low volume but significant at scale.',
    'Switch from JSON to a binary serialization format (Protocol Buffers, MessagePack, Avro). Binary formats typically serialize 3–10× faster and produce smaller payloads, reducing both serialization overhead and network transfer time.',
    'Set consumer prefetch limits (e.g. <code>prefetch_count=1</code> in RabbitMQ) to prevent a slow consumer from holding a batch of messages without processing them, which inflates effective queue depth for other consumers.',
    'Track p99 queue depth, not average — burst traffic causes spikes that violate SLAs even when the mean looks healthy. Pair with the <a href="/calculators/latency-budget-calculator">Latency Budget Calculator</a> to allocate delay budgets across your pipeline.',
  ],
  faq: [
    {
      question: 'What causes message queue delay?',
      answer: 'Message queue delay is driven primarily by queue depth and consumer throughput. If 1,000 messages are queued and your consumer processes 100 per second, there is a 10-second wait before your message is even picked up. Network latency between producer and broker, serialization overhead, and per-message processing time add smaller but compounding amounts to the total end-to-end delay.',
    },
    {
      question: 'How do I reduce message queue delay?',
      answer: 'The most effective lever is increasing consumer throughput — add more consumer instances or optimise your message processing logic. After that, reduce queue depth by sizing your consumer fleet to match peak load. Co-locating consumers with brokers eliminates cross-AZ network RTTs. Switching from JSON to binary serialization (Protobuf, MessagePack) reduces serialization overhead by 3–10× per message.',
    },
    {
      question: 'What is a safe maximum queue depth?',
      answer: 'Safe max depth depends on your latency SLA: Consumer Throughput (msg/s) × Max Acceptable Delay (s). For a 5-second SLA with 100 consumers per second, safe max depth is 500 messages. Set alerting at 80% of this threshold. Always monitor p99 queue depth during traffic spikes rather than averages — burst traffic is what causes SLA violations.',
    },
    {
      question: 'How does this apply to Kafka vs RabbitMQ?',
      answer: 'The formula applies to both, though terminology differs. In Kafka, queue depth maps to consumer group lag (messages behind the latest offset), and consumer throughput is your consumer\'s poll rate in messages per second. In RabbitMQ, queue depth is the message count visible in the management UI and consumer throughput is the ack rate. Both metrics are available in broker dashboards and exportable to Prometheus.',
    },
    {
      question: 'What is the difference between queue delay and end-to-end message latency?',
      answer: 'Queue delay is the time from message publish to consumption start — dominated by queue wait time. End-to-end latency includes queue delay plus the full processing time after dequeue: database writes, downstream API calls, and any response publishing. This calculator measures queue delay. If your consumer triggers a chain of downstream operations, total latency can be orders of magnitude higher. Use the <a href="/calculators/latency-budget-calculator">Latency Budget Calculator</a> to model the full pipeline.',
    },
  ],
  relatedSlugs: ['worker-queue-throughput-calculator', 'latency-budget-calculator', 'retry-backoff-calculator'],
};

export const messageQueueDelayCalculator: CalculatorDefinition = { meta, Component: MessageQueueDelayUI };
