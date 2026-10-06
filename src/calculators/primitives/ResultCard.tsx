import type { ReactNode } from 'react';
import { Box, Typography, Stack, Alert } from '@mui/material';

export interface ResultRow {
  label: string;
  value: string;
  /** Bold the row — for the second-most important number. */
  strong?: boolean;
}

interface ResultCardProps {
  label: string;
  value: string;
  /** Short line under the headline number. */
  sub?: ReactNode;
  rows?: ResultRow[];
}

/** Headline result in the brand blue box, with a breakdown table under it. */
export function ResultCard({ label, value, sub, rows }: ResultCardProps) {
  return (
    <Box sx={{ borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider' }} aria-live="polite">
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>{label}</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>{value}</Typography>
        {sub && <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>{sub}</Typography>}
      </Box>
      {rows && rows.length > 0 && (
        <Stack component="dl" sx={{ m: 0, px: 2, py: 1 }}>
          {rows.map((r) => (
            <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75, borderBottom: 1, borderColor: 'divider', '&:last-of-type': { borderBottom: 0 } }}>
              <Typography component="dt" variant="body2" color="text.secondary">{r.label}</Typography>
              <Typography component="dd" variant="body2" sx={{ m: 0, fontWeight: r.strong ? 700 : 500, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.value}</Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

/** Edge-case / validity messages shown under the result. */
export function Notices({ items }: { items: { severity: 'info' | 'warning' | 'error'; text: string }[] }) {
  if (items.length === 0) return null;
  return (
    <Stack spacing={1}>
      {items.map((n) => <Alert key={n.text} severity={n.severity} variant="outlined">{n.text}</Alert>)}
    </Stack>
  );
}

/** Placeholder shown in place of a result while inputs are invalid. */
export function EmptyResult({ text = 'Enter valid values above to see the result.' }: { text?: string }) {
  return (
    <Box sx={{ border: 1, borderStyle: 'dashed', borderColor: 'divider', borderRadius: 2, p: 3, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">{text}</Typography>
    </Box>
  );
}
