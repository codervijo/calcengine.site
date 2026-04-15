import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function TlsHandshakeTimeEstimatorUI() {
  const [rtt, setRtt] = useState<string>('50');
  const [multiplier, setMultiplier] = useState<string>('1');
  const [certOverhead, setCertOverhead] = useState<string>('0');

  const rttVal = parseFloat(rtt) || 0;
  const multVal = parseFloat(multiplier) || 1;
  const certVal = parseFloat(certOverhead) || 0;

  const handshakeRtt = rttVal * multVal;
  const total = handshakeRtt + certVal;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Estimate TLS Handshake Time</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Base RTT (ms)"
          type="number"
          value={rtt}
          onChange={(e) => setRtt(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
          helperText="Network round-trip time to server"
        />
        <TextField
          label="TLS RTT Multiplier"
          type="number"
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '0.5' } }}
          helperText="1 = TLS 1.3, 2 = TLS 1.2, 0 = 0-RTT resumption"
        />
        <TextField
          label="Certificate Overhead (ms)"
          type="number"
          value={certOverhead}
          onChange={(e) => setCertOverhead(e.target.value)}
          slotProps={{ htmlInput: { min: '0', step: '1' } }}
          helperText="OCSP/CRL validation if not stapled (0 if stapled)"
        />
      </Stack>
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated TLS Handshake Time</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{total.toFixed(1)} ms</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
          Handshake RTT: {handshakeRtt.toFixed(1)} ms &nbsp;+&nbsp; Cert Overhead: {certVal.toFixed(1)} ms
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'tls-handshake-time-estimator',
  title: 'TLS Handshake Time Estimator',
  shortTitle: 'TLS Handshake',
  description: 'Calculate TLS handshake time for TLS 1.2 and TLS 1.3 by entering your network RTT and certificate validation overhead. Optimize HTTPS latency before shipping.',
  keywords: [
    'tls handshake time estimator',
    'tls handshake latency calculator',
    'tls 1.2 vs tls 1.3 handshake',
    'https connection time calculator',
    'ssl handshake time',
    'tls rtt calculator',
    'ocsp overhead calculator',
    'tls performance estimator',
  ],
  category: 'performance',
  icon: 'Lock',
  tagline: 'Enter your network RTT and TLS version to instantly estimate HTTPS handshake overhead. Works for TLS 1.2, TLS 1.3, and 0-RTT session resumption.',
  lastUpdated: 'April 2026',
  intro: 'The TLS handshake time estimator calculates how long your HTTPS connection setup takes before a single byte of application data is transferred. TLS 1.2 requires two full round trips to negotiate cipher suites, exchange certificates, and confirm keys — meaning a 100 ms RTT server adds 200 ms of pure handshake overhead to every new connection. TLS 1.3 cuts this to one RTT, and 0-RTT session resumption eliminates the handshake RTT cost entirely for returning clients.\n\nThis matters most for APIs serving mobile clients over high-latency networks, microservices making many short-lived connections, and CDN origins receiving frequent cold connections. A single poorly tuned TLS configuration can add hundreds of milliseconds to your perceived latency without touching a line of application code.\n\nUse this calculator before and after infrastructure changes to quantify the improvement. Plug in your measured RTT (from ping or traceroute), choose your TLS version multiplier, and add any OCSP validation overhead if you are not using OCSP stapling. The result is the raw handshake cost that stacks on top of your DNS lookup and TCP connection time.\n\nThe formula applies equally to nginx, Caddy, AWS ALB, Cloudflare, and any TLS-terminating proxy — the math is protocol-level, not implementation-specific.',
  howItWorksTitle: 'How to Estimate TLS Handshake Time',
  howItWorksImage: '/images/calculators/tls-handshake-time-estimator-how-it-works.svg',
  howItWorks: '1. Measure your base RTT to the server using ping, traceroute, or browser DevTools network waterfall.\n2. Identify your TLS version: TLS 1.3 costs 1 × RTT, TLS 1.2 costs 2 × RTT, 0-RTT session resumption costs 0 × RTT.\n3. Check whether OCSP stapling is enabled on your server. If not, add 50–150 ms for OCSP responder round trip.\n4. Enter RTT, multiplier, and certificate overhead into the calculator above.\n5. The result is your baseline TLS handshake overhead — the time before any application data flows.',
  formula: 'TLS Handshake Time = (RTT × TLS Multiplier) + Certificate Overhead\n\nRTT                  — base network round-trip time in milliseconds\nTLS Multiplier       — 2 for TLS 1.2 · 1 for TLS 1.3 · 0 for 0-RTT resumption\nCertificate Overhead — OCSP/CRL validation delay in ms (0 if OCSP stapling is enabled)',
  examplesTitle: 'Example TLS Handshake Time Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — TLS 1.3 with OCSP stapling (optimal)',
      body: 'RTT: 30 ms  ×  TLS 1.3 multiplier (1)  =  30 ms handshake RTT\nCert overhead: 0 ms (OCSP stapling enabled)\n                                                ─────────────────────\nTotal TLS handshake time: 30 ms\n→ Best-case scenario: modern TLS version + stapling eliminates cert overhead.',
    },
    {
      title: 'Example 2 — TLS 1.2 without OCSP stapling (common default)',
      body: 'RTT: 50 ms  ×  TLS 1.2 multiplier (2)  =  100 ms handshake RTT\nCert overhead: 100 ms (OCSP round trip to CA responder)\n                                                ─────────────────────\nTotal TLS handshake time: 200 ms\n→ Upgrade to TLS 1.3 + stapling to cut this to ~50 ms.',
    },
    {
      title: 'Example 3 — TLS 1.2 cross-region API (high-latency path)',
      body: 'RTT: 150 ms  ×  TLS 1.2 multiplier (2)  =  300 ms handshake RTT\nCert overhead: 80 ms (partial OCSP caching)\n                                                ─────────────────────\nTotal TLS handshake time: 380 ms\n→ Migrate to TLS 1.3 to save 150 ms; enable session tickets to allow 0-RTT resumption on subsequent calls.',
    },
  ],
  tipsTitle: 'Tips to Reduce TLS Handshake Time',
  tips: [
    'Enable TLS 1.3 on your server. It cuts handshake RTTs from 2 to 1, saving one full network round trip on every new connection — often 30–200 ms depending on geography.',
    'Enable OCSP stapling. Without it, the client must separately contact the CA\'s OCSP responder to validate your certificate, adding 50–150 ms to every handshake.',
    'Use TLS session tickets or session IDs to allow 0-RTT resumption for returning clients, bypassing the handshake entirely on repeat visits.',
    'Terminate TLS close to your users. Move TLS termination to a CDN edge or regional PoP to reduce base RTT — the biggest lever on handshake time is raw network distance.',
    'Prefer ECDSA certificates over RSA. ECDSA keys are smaller, reducing the certificate payload transmitted during the handshake and cutting parsing overhead.',
    'Use HTTP/2 or HTTP/3 (QUIC). Both multiplex requests over a single TLS connection, amortizing handshake cost across many requests rather than paying it per call.',
  ],
  faq: [
    {
      question: 'What is a TLS handshake and why does it add latency?',
      answer: 'A TLS handshake is the negotiation phase between client and server that establishes an encrypted connection before any application data is sent. It involves agreeing on a cipher suite, exchanging public keys, and verifying the server certificate. Each step requires at least one network round trip, so high-RTT connections pay a proportionally larger latency tax on every new HTTPS session.',
    },
    {
      question: 'How many round trips does TLS 1.2 vs TLS 1.3 require?',
      answer: 'TLS 1.2 requires two full round trips (2 × RTT) before the connection is ready. TLS 1.3 redesigned the handshake to require only one round trip (1 × RTT). TLS 1.3 also supports 0-RTT session resumption for returning clients, where cached session data allows data to be sent immediately — though 0-RTT has replay-attack caveats for non-idempotent requests.',
    },
    {
      question: 'What is OCSP stapling and how does it affect handshake time?',
      answer: 'OCSP (Online Certificate Status Protocol) lets clients verify your certificate has not been revoked. Without stapling, the client must make a separate HTTP request to the CA\'s OCSP responder mid-handshake, adding 50–150 ms. With OCSP stapling, your server fetches and caches the OCSP response and bundles it into the handshake, so the client gets revocation proof with zero extra round trips. Enable it via your web server config — it\'s supported by nginx, Apache, and Caddy.',
    },
    {
      question: 'How do I measure actual TLS handshake time in production?',
      answer: 'Use <code>curl -w "%{time_connect} %{time_appconnect}"</code> to see TCP connect and TLS handshake times separately. Browser DevTools Network tab shows "SSL" timing in the connection waterfall. For ongoing monitoring, server-side metrics from nginx (<code>$ssl_handshake_time</code>) or OpenTelemetry TLS instrumentation give per-request data. Subtract TCP connect time from TLS connect time to isolate the handshake cost.',
    },
    {
      question: 'Does TLS handshake time matter for keep-alive connections?',
      answer: 'No — TLS handshake cost is paid only once per connection. With HTTP/1.1 keep-alive, HTTP/2, or HTTP/3, subsequent requests reuse the established TLS session with zero handshake overhead. Handshake time matters most for short-lived connections (mobile clients, microservice calls without connection pooling, CLI tools) where each request opens a fresh connection. Enable connection pooling or persistent connections to amortize the cost.',
    },
  ],
  relatedSlugs: ['latency-budget-calculator', 'api-response-time-estimator', 'timeout-calculator'],
};

export const tlsHandshakeTimeEstimatorCalculator: CalculatorDefinition = { meta, Component: TlsHandshakeTimeEstimatorUI };
