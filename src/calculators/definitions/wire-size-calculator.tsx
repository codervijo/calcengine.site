import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';
import { NumberField, SelectField, CheckField, ResultCard, Notices, EmptyResult, check, fmtNum } from '../primitives';
import { sizeWire, defaultTempRating, voltageDrop, type Material, type Phase, type TempRating, type SizeRow } from '../logic/wire-size';
import conductors from '../../data/electrical/conductors.json';

const TABLE = conductors.sizes as SizeRow[];

function WireSizeUI() {
  const [amps, setAmps] = useState('20');
  const [continuous, setContinuous] = useState(false);
  const [volts, setVolts] = useState('120');
  const [phase, setPhase] = useState<Phase>('ac1');
  const [length, setLength] = useState('50');
  const [material, setMaterial] = useState<Material>('cu');
  const [temp, setTemp] = useState<'auto' | '60' | '75' | '90'>('auto');
  const [maxDrop, setMaxDrop] = useState('3');

  const a = check(amps, { min: 0, exclusiveMin: true });
  const v = check(volts, { min: 0, exclusiveMin: true });
  const l = check(length, { min: 0 });
  const d = check(maxDrop, { min: 0, exclusiveMin: true, max: 20 });
  const notices: { severity: 'info' | 'warning' | 'error'; text: string }[] = [];

  let result = null;
  if (a.value !== null && v.value !== null && l.value !== null && d.value !== null) {
    const designAmps = continuous ? a.value * 1.25 : a.value;
    const tempRating: TempRating = temp === 'auto' ? defaultTempRating(designAmps) : (Number(temp) as TempRating);
    const r = sizeWire({ amps: a.value, continuous, volts: v.value, phase, lengthFt: l.value, material, tempRating, maxDropPct: d.value }, TABLE);
    if (temp === '90') notices.push({ severity: 'warning', text: 'The 90°C column is normally only usable for ampacity adjustment and correction. Terminations on most equipment are rated 60°C or 75°C, and the conductor must not exceed that rating.' });
    if (!r.recommended) {
      notices.push({ severity: 'error', text: `No single conductor up to 500 kcmil meets both limits. Larger loads usually need parallel conductors or a different design — consult an electrician or engineer.` });
    } else {
      const rec = r.recommended;
      if (r.governedBy === 'voltage-drop') notices.push({ severity: 'info', text: `Voltage drop sets the size here: ${r.byAmpacity?.size} carries the current but would drop ${fmtNum(r.byAmpacity!.dropPct, 1)}% over ${fmtNum(l.value, 0)} ft.` });
      if (rec.ocpdMax !== undefined && designAmps > 0) notices.push({ severity: 'info', text: `${rec.size} ${material === 'cu' ? 'copper' : 'aluminum'} is limited to a ${rec.ocpdMax} A overcurrent device (NEC 240.4(D)).` });
      result = (
        <ResultCard
          label="Minimum wire size"
          value={`${rec.size} ${material === 'cu' ? 'Cu' : 'Al'}`}
          sub={`Sized by ${r.governedBy === 'ampacity' ? 'ampacity' : 'voltage drop'} · ${tempRating}°C column`}
          rows={[
            { label: continuous ? 'Design current (125% continuous)' : 'Design current', value: `${fmtNum(r.designAmps, 1)} A` },
            { label: `Smallest size for ampacity (${tempRating}°C)`, value: r.byAmpacity ? `${r.byAmpacity.size} (${r.byAmpacity.ampacity} A)` : 'over 500 kcmil' },
            { label: `Smallest size for ≤${fmtNum(d.value, 1)}% drop`, value: r.byVoltageDrop ? r.byVoltageDrop.size : 'over 500 kcmil' },
            { label: 'Recommended', value: rec.size, strong: true },
            { label: 'Ampacity of recommended size', value: `${rec.ampacity} A${rec.ocpdMax !== undefined ? ` (OCPD max ${rec.ocpdMax} A)` : ''}` },
            { label: 'Voltage drop at load current', value: `${fmtNum(rec.dropVolts, 2)} V (${fmtNum(rec.dropPct, 2)}%)`, strong: true },
            { label: 'Voltage at load', value: `${fmtNum(v.value - rec.dropVolts, 1)} V` },
          ]}
        />
      );
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate Wire Size</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <NumberField label="Load current" value={amps} onChange={setAmps} suffix="A" error={a.error} />
        <NumberField label="Circuit voltage" value={volts} onChange={setVolts} suffix="V" error={v.error} />
      </Stack>
      <CheckField label="Continuous load (runs 3 hours or more) — size for 125%" checked={continuous} onChange={setContinuous} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <NumberField label="One-way length" value={length} onChange={setLength} suffix="ft" error={l.error} helperText="Distance from panel to load" />
        <NumberField label="Max voltage drop" value={maxDrop} onChange={setMaxDrop} suffix="%" error={d.error} helperText="3% is a common branch-circuit target" />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <SelectField label="System" value={phase} onChange={setPhase} options={[{ value: 'ac1', label: 'Single-phase AC' }, { value: 'ac3', label: 'Three-phase AC' }, { value: 'dc', label: 'DC' }]} />
        <SelectField label="Conductor" value={material} onChange={setMaterial} options={[{ value: 'cu', label: 'Copper' }, { value: 'al', label: 'Aluminum' }]} />
      </Stack>
      <SelectField
        label="Temperature rating used"
        value={temp}
        onChange={setTemp}
        options={[
          { value: 'auto', label: 'Auto — 60°C up to 100 A, 75°C above (NEC 110.14(C) default)' },
          { value: '60', label: '60°C' },
          { value: '75', label: '75°C (equipment terminals listed for 75°C)' },
          { value: '90', label: '90°C (adjustment/correction only)' },
        ]}
      />
      {result ?? (notices.length === 0 && <EmptyResult />)}
      <Notices items={notices} />
    </Stack>
  );
}

const sz = (s: string) => TABLE.find((r) => r.size === s)!;
const drop = (phase: Phase, amps: number, size: string, mat: Material, ft: number) => voltageDrop(phase, amps, sz(size)[mat]!.ohmsPerKft, ft);
const ex1_12 = drop('ac1', 20, '12 AWG', 'cu', 40);
const ex2_12 = drop('ac1', 20, '12 AWG', 'cu', 100);
const ex2_8 = drop('ac1', 20, '8 AWG', 'cu', 100);
const ex2_10 = drop('ac1', 20, '10 AWG', 'cu', 100);
const ex3_6 = drop('ac1', 40, '6 AWG', 'cu', 30);

const meta: CalculatorMeta = {
  slug: 'wire-size-calculator',
  title: 'Wire Size Calculator',
  h1: 'Wire Size Calculator — Ampacity and Voltage Drop',
  shortTitle: 'Wire Size',
  description: 'Wire size calculator using NEC Table 310.16 ampacity and Chapter 9 voltage drop: minimum AWG/kcmil for copper or aluminum by amps, voltage, distance and phase.',
  keywords: ['wire size calculator', 'wire gauge calculator', 'what size wire do i need', 'voltage drop calculator', 'awg ampacity chart', 'wire size for 50 amp'],
  category: 'electrical',
  icon: 'Cable',
  tagline: 'Find the minimum copper or aluminum conductor for a load, checking both ampacity (NEC Table 310.16) and voltage drop over your run length.',
  lastUpdated: 'October 2026',
  suppressBoilerplate: true,
  intro: `A wire has to pass two checks. It must carry the current without overheating — its <strong>ampacity</strong>. And it must deliver enough voltage at the far end — its <strong>voltage drop</strong>. On short runs, ampacity usually decides the size. On long runs, voltage drop often forces a larger wire than ampacity alone would need.\n\nThis wire size calculator runs both checks. Ampacity comes from NEC Table 310.16 (copper and aluminum, 60/75/90°C columns, 30°C ambient, no more than three current-carrying conductors). It applies the NEC 240.4(D) limits on 14, 12 and 10 AWG. Voltage drop uses the DC resistance values in NEC Chapter 9, Table 8, for the round trip. The recommendation is the larger of the two sizes.\n\nThe temperature column matters. Under NEC 110.14(C), circuits of 100 A or less (or 14–1 AWG conductors) are limited to the 60°C column unless the equipment terminals are listed for 75°C. Larger circuits default to 75°C. The calculator follows that default unless you choose otherwise.`,
  howItWorksTitle: 'How to Calculate Wire Size',
  howItWorks: '1. Start with the load current. For continuous loads (3 hours or more), multiply by 1.25.\n2. Pick the temperature column your terminations allow: usually 60°C up to 100 A, 75°C above.\n3. Find the smallest conductor in NEC Table 310.16 whose ampacity covers the design current. For 14–10 AWG, also respect the 240.4(D) overcurrent limits.\n4. Calculate voltage drop at the load current: 2 × I × R × L ÷ 1000 for single-phase/DC, or √3 × I × R × L ÷ 1000 for three-phase.\n5. If the drop exceeds your limit (3% is a common target), step up in size until it doesn\'t. Use the larger of the two results.',
  formula: 'Design current   I_d = I × 1.25 (continuous) or I\nAmpacity check   Table 310.16 ampacity(size, material, °C) ≥ I_d\n                 and, for 14–10 AWG, 240.4(D) limit ≥ I_d\n\nVoltage drop     VD = k × I × R × L ÷ 1000\n                 k = 2 (single-phase, DC) or √3 (three-phase)\n                 R = Ω per 1,000 ft (Chapter 9 Table 8, 75°C)\n                 L = one-way length (ft)\nVD %             = VD ÷ V × 100 ≤ limit\n\nRecommended size = larger of (ampacity size, voltage-drop size)',
  examplesTitle: 'Wire Size Examples',
  example: '',
  examples: [
    { title: 'Example 1 — 20 A, 120 V, 40 ft, copper', body: `Ampacity (60°C): 12 AWG = 20 A ✓ (240.4(D) limit 20 A)\nDrop on 12 AWG: 2 × 20 × ${sz('12 AWG').cu!.ohmsPerKft} × 40 ÷ 1000 = ${ex1_12.toFixed(2)} V = ${(ex1_12 / 120 * 100).toFixed(1)}% ✓\nResult: 12 AWG copper` },
    { title: 'Example 2 — Same 20 A circuit, 100 ft run', body: `12 AWG drop: ${ex2_12.toFixed(2)} V = ${(ex2_12 / 120 * 100).toFixed(1)}% ✗\n10 AWG drop: ${ex2_10.toFixed(2)} V = ${(ex2_10 / 120 * 100).toFixed(1)}% ✗\n 8 AWG drop: ${ex2_8.toFixed(2)} V = ${(ex2_8 / 120 * 100).toFixed(1)}% ${ex2_8 / 120 * 100 <= 3 ? '✓' : '✗'}\nResult: voltage drop governs → ${ex2_8 / 120 * 100 <= 3 ? '8 AWG' : '6 AWG'} copper` },
    { title: 'Example 3 — 40 A continuous load (EV charger), 240 V, 30 ft, copper, 75°C terminals', body: `Design current: 40 × 1.25 = 50 A\nAmpacity (75°C): 8 AWG = 50 A ✓\nDrop on 8 AWG: 2 × 40 × ${sz('8 AWG').cu!.ohmsPerKft} × 30 ÷ 1000 = ${drop('ac1', 40, '8 AWG', 'cu', 30).toFixed(2)} V = ${(drop('ac1', 40, '8 AWG', 'cu', 30) / 240 * 100).toFixed(2)}% ✓\nResult: 8 AWG copper — if the charger and breaker terminals are listed for 75°C\n(At 60°C the answer would be 6 AWG: ${sz('6 AWG').cu!.a60} A, drop ${(ex3_6 / 240 * 100).toFixed(2)}%)` },
  ],
  referenceTables: [
    {
      title: 'Ampacity and Resistance Table (NEC 310.16 and Chapter 9 Table 8)',
      columns: ['Size', 'Cu 60°C', 'Cu 75°C', 'Cu 90°C', 'Al 60°C', 'Al 75°C', 'Al 90°C', 'Cu Ω/kft', 'Al Ω/kft'],
      rows: TABLE.map((r) => [
        r.size,
        `${r.cu!.a60}${r.cu!.ocpdMax ? '*' : ''}`, `${r.cu!.a75}${r.cu!.ocpdMax ? '*' : ''}`, `${r.cu!.a90}${r.cu!.ocpdMax ? '*' : ''}`,
        r.al ? `${r.al.a60}${r.al.ocpdMax ? '*' : ''}` : '—', r.al ? `${r.al.a75}${r.al.ocpdMax ? '*' : ''}` : '—', r.al ? `${r.al.a90}${r.al.ocpdMax ? '*' : ''}` : '—',
        `${r.cu!.ohmsPerKft}`, r.al ? `${r.al.ohmsPerKft}` : '—',
      ]),
      note: 'Ampacity in amps, 30°C ambient, ≤3 current-carrying conductors. * Overcurrent protection limited by NEC 240.4(D): 14 Cu 15 A, 12 Cu 20 A, 10 Cu 30 A, 12 Al 15 A, 10 Al 25 A. Resistance: DC, 75°C, stranded, ohms per 1,000 ft.',
    },
  ],
  tipsTitle: 'Wire Sizing Notes',
  tips: [
    'Check the temperature rating printed on the breaker and the equipment terminals. It, not the wire\'s insulation rating, usually sets the usable ampacity column.',
    'Long runs to outbuildings, wells and EV chargers are where voltage drop bites. Check the run length before buying wire.',
    'More than three current-carrying conductors in one raceway, or hot locations such as attics and rooftops, need adjustment factors this calculator does not apply. The wire must then be larger.',
    'Need the current first? Convert watts, kW or horsepower with the <a href="/calculators/amp-calculator">amp calculator</a>.',
  ],
  methodology: {
    verified: conductors.lastVerified,
    disclaimer: '<strong>Planning aid only — not a substitute for the electrical code or an electrician.</strong> Conductor sizing depends on the code edition and local amendments where you are, the installation method, ambient temperature, conductor bundling, termination ratings and the equipment manufacturer\'s instructions. Have electrical work designed, checked and inspected by a qualified person.',
    assumptions: [
      `Ampacity: ${conductors.ampacityBasis}`,
      'Only one ampacity correction is applied: the 125% factor for continuous loads. No ambient-temperature correction (30°C/86°F is assumed) and no adjustment for more than three current-carrying conductors.',
      'Temperature column "Auto" follows the NEC 110.14(C) default: 60°C for circuits of 100 A or less, 75°C above. Choose 75°C only if every termination is listed for it.',
      'NEC 240.4(D) small-conductor limits are applied as a maximum current for 14, 12 and 10 AWG.',
      `Voltage drop: ${conductors.resistanceBasis} Calculated at the actual load current, as a round trip (×2) for single-phase and DC, ×√3 for balanced three-phase. AC reactance is ignored, which slightly understates drop on large conductors.`,
      'Voltage drop limits such as 3% are design recommendations (NEC informational notes), not mandatory code requirements in most jurisdictions.',
    ],
    exclusions: [
      'Ambient temperature correction and conductor-bundling adjustment factors (NEC 310.15)',
      'Motor, HVAC, welder, EV-specific, service and feeder rules that change the required size (e.g. NEC Articles 430, 440, 625)',
      'Parallel conductors, cable types with lower ratings (e.g. NM cable is limited to the 60°C column), and underground/direct-burial specifics',
      'Equipment grounding conductor sizing, conduit fill, and box fill',
      'Local amendments and code editions other than the one cited',
    ],
    sources: conductors.sources,
  },
  faq: [
    {
      question: 'What size wire do I need for 20 amps?',
      answer: 'For a typical 20 A branch circuit, 12 AWG copper is the minimum: its 60°C ampacity is 20 A, and NEC 240.4(D) limits it to a 20 A breaker. On runs longer than about 50 ft at 120 V, voltage drop may call for 10 AWG. Enter your length above to check.',
    },
    {
      question: 'What size wire for a 50 amp circuit?',
      answer: 'In copper, 8 AWG has a 50 A rating in the 75°C column, so it works when the breaker and equipment terminals are listed for 75°C. Otherwise use the 60°C column, where 6 AWG (55 A) is needed. Aluminum needs larger sizes. Long runs may need a larger size still for voltage drop.',
    },
    {
      question: 'Is aluminum wire safe to use?',
      answer: 'Modern aluminum conductors (AA-8000 series alloys) are widely used for feeders and services, sized larger than copper for the same current. They must be used with terminals rated for aluminum (marked AL or CU/AL) and installed per the manufacturer\'s torque and anti-oxidant instructions.',
    },
  ],
  relatedSlugs: ['amp-calculator', 'energy-cost-calculator'],
};

export const wireSizeCalculator: CalculatorDefinition = { meta, Component: WireSizeUI };
