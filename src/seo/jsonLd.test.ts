import { describe, expect, it } from 'vitest';
import { buildFaqJsonLd, htmlToPlainText } from './jsonLd';

describe('htmlToPlainText', () => {
  it('strips tags but keeps their text', () => {
    expect(htmlToPlainText('Use <code>curl --write-out "%{time_total}"</code> for quick checks.')).toBe(
      'Use curl --write-out "%{time_total}" for quick checks.',
    );
    expect(htmlToPlainText('See the <a href="/calculators/qps-calculator">QPS calculator</a>.')).toBe(
      'See the QPS calculator.',
    );
  });

  it('decodes entities, with &amp; last', () => {
    expect(htmlToPlainText('a &lt; b &gt; c &amp; d')).toBe('a < b > c & d');
    expect(htmlToPlainText('&amp;lt;')).toBe('&lt;');
  });

  it('collapses whitespace', () => {
    expect(htmlToPlainText('  one\n  two  ')).toBe('one two');
  });
});

describe('buildFaqJsonLd', () => {
  it('emits plain-text answers', () => {
    const ld = buildFaqJsonLd([{ question: 'Q?', answer: 'Run <code>*/5 * * * *</code>.' }]);
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe('Run */5 * * * *.');
  });
});
