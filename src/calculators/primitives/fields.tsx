import type { ReactNode } from 'react';
import { TextField, InputAdornment, MenuItem, FormControlLabel, Checkbox, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  /** Leading adornment, e.g. "$". */
  prefix?: string;
  /** Trailing adornment / unit, e.g. "%", "V", "ft". */
  suffix?: string;
  error?: string | null;
  helperText?: ReactNode;
  step?: string;
}

/** Numeric text input with unit adornments and inline validation message. */
export function NumberField({ label, value, onChange, prefix, suffix, error, helperText, step = 'any' }: NumberFieldProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={Boolean(error)}
      helperText={error || helperText}
      slotProps={{
        htmlInput: { inputMode: 'decimal', step },
        input: {
          startAdornment: prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : undefined,
          endAdornment: suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : undefined,
        },
      }}
    />
  );
}

export const MoneyField = (p: Omit<NumberFieldProps, 'prefix'>) => <NumberField prefix="$" step="0.01" {...p} />;
export const PercentField = (p: Omit<NumberFieldProps, 'suffix'>) => <NumberField suffix="%" {...p} />;

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  onChange: (v: NoInfer<T>) => void;
  options: { value: NoInfer<T>; label: string }[];
  helperText?: ReactNode;
}

export function SelectField<T extends string>({ label, value, onChange, options, helperText }: SelectFieldProps<T>) {
  return (
    <TextField select label={label} value={value} onChange={(e) => onChange(e.target.value as T)} helperText={helperText}>
      {options.map((o) => (
        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
      ))}
    </TextField>
  );
}

export function CheckField({ label, checked, onChange }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return <FormControlLabel control={<Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)} />} label={label} />;
}

/** Segmented control for calculator modes ("fee from amount" vs "amount to receive"). */
export function ModeToggle<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: NoInfer<T>) => void; options: { value: NoInfer<T>; label: string }[]; label: string }) {
  return (
    <div>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>{label}</Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={value}
        onChange={(_, v) => { if (v) onChange(v as T); }}
        aria-label={label}
        sx={{ flexWrap: 'wrap' }}
      >
        {options.map((o) => (
          <ToggleButton key={o.value} value={o.value} sx={{ textTransform: 'none' }}>{o.label}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
