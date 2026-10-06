import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';
import { NumberField, SelectField, ModeToggle, ResultCard, Notices, EmptyResult, check, fmtNum } from '../primitives';
import { ampsFromWatts, wattsFromAmps, ampsFromVA, vaFromAmps, inputWattsFromHp, WATTS_PER_HP, type System } from '../logic/electrical';

type Mode = 'to-amps' | 'to-watts';
type Unit = 'W' | 'kW' | 'kVA' | 'HP';

const SYSTEMS: { value: System; label: string }[] = [
  { value: 'ac1', label: 'AC single-phase' },
  { value: 'ac3', label: 'AC three-phase (line-to-line voltage)' },
  { value: 'dc', label: 'DC' },
];

function AmpUI() {
  const [mode, setMode] = useState<Mode>('to-amps');
  const [system, setSystem] = useState<System>('ac1');
  const [unit, setUnit] = useState<Unit>('W');
  const [power, setPower] = useState('1800');
  const [amps, setAmps] = useState('15');
  const [volts, setVolts] = useState('120');
  const [pf, setPf] = useState('1');
  const [eff, setEff] = useState('100');

  const ac = system !== 'dc';
  const v = check(volts, { min: 0, exclusiveMin: true });
  const p = check(power, { min: 0 });
  const a = check(amps, { min: 0 });
  const pfc = check(pf, { min: 0, exclusiveMin: true, max: 1 });
  const ef = check(eff, { min: 0, exclusiveMin: true, max: 100 });
  const usesPf = ac && unit !== 'kVA';
  const notices: { severity: 'info' | 'warning' | 'error'; text: string }[] = [];
  if (unit === 'kVA' && system === 'dc') notices.push({ severity: 'error', text: 'kVA (apparent power) applies to AC only. Choose W or kW for DC.' });

  let result = null;
  const ready = v.value !== null && (!usesPf || pfc.value !== null) && (unit !== 'HP' || ef.value !== null) && !(unit === 'kVA' && system === 'dc');
  if (ready && mode === 'to-amps' && p.value !== null) {
    const pfv = usesPf ? pfc.value! : 1;
    let watts = 0;
    let current: number;
    if (unit === 'kVA') current = ampsFromVA(system, p.value * 1000, v.value!);
    else {
      watts = unit === 'W' ? p.value : unit === 'kW' ? p.value * 1000 : inputWattsFromHp(p.value, ef.value!);
      current = ampsFromWatts(system, watts, v.value!, pfv);
    }
    const va = vaFromAmps(system, current, v.value!);
    result = (
      <ResultCard
        label="Current"
        value={`${fmtNum(current, 2)} A`}
        sub={`${SYSTEMS.find((s) => s.value === system)!.label}, ${fmtNum(v.value!, 1)} V`}
        rows={[
          ...(unit === 'HP' ? [{ label: `Electrical input power (${fmtNum(p.value, 2)} HP × ${WATTS_PER_HP} W ÷ ${fmtNum(ef.value!, 1)}%)`, value: `${fmtNum(watts, 0)} W` }] : []),
          ...(unit !== 'kVA' ? [{ label: 'Real power', value: `${fmtNum(watts, 1)} W` }] : []),
          ...(ac ? [{ label: 'Apparent power', value: `${fmtNum(va / 1000, 3)} kVA` }] : []),
          { label: 'Current', value: `${fmtNum(current, 3)} A`, strong: true },
        ]}
      />
    );
  }
  if (ready && mode === 'to-watts' && a.value !== null) {
    const pfv = ac ? (pfc.value ?? 1) : 1;
    const watts = wattsFromAmps(system, a.value, v.value!, pfv);
    result = (
      <ResultCard
        label="Real power"
        value={`${fmtNum(watts, 1)} W`}
        sub={`${fmtNum(watts / 1000, 3)} kW`}
        rows={[
          { label: 'Real power', value: `${fmtNum(watts / 1000, 3)} kW`, strong: true },
          ...(ac ? [{ label: 'Apparent power', value: `${fmtNum(vaFromAmps(system, a.value, v.value!) / 1000, 3)} kVA` }] : []),
          { label: `Equivalent mechanical output at 100% efficiency`, value: `${fmtNum(watts / WATTS_PER_HP, 2)} HP` },
        ]}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Convert Watts, kW, kVA or HP to Amps</Typography>
      <ModeToggle label="Calculate" value={mode} onChange={setMode} options={[{ value: 'to-amps', label: 'Amps from power' }, { value: 'to-watts', label: 'Watts from amps' }]} />
      <SelectField label="System" value={system} onChange={setSystem} options={SYSTEMS} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {mode === 'to-amps' ? (
          <>
            <NumberField label="Power" value={power} onChange={setPower} error={p.error} />
            <SelectField label="Unit" value={unit} onChange={setUnit} options={[{ value: 'W', label: 'Watts (W)' }, { value: 'kW', label: 'Kilowatts (kW)' }, { value: 'kVA', label: 'kVA (apparent)' }, { value: 'HP', label: 'Horsepower (motor output)' }]} />
          </>
        ) : (
          <NumberField label="Current" value={amps} onChange={setAmps} suffix="A" error={a.error} />
        )}
        <NumberField label={system === 'ac3' ? 'Voltage (line-to-line)' : 'Voltage'} value={volts} onChange={setVolts} suffix="V" error={v.error} />
      </Stack>
      {ac && (mode === 'to-watts' || unit !== 'kVA') && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <NumberField label="Power factor" value={pf} onChange={setPf} error={pfc.error} helperText="1 for resistive loads (heaters); use the nameplate value for motors" />
          {mode === 'to-amps' && unit === 'HP' && <NumberField label="Motor efficiency" value={eff} onChange={setEff} suffix="%" error={ef.error} helperText="From the motor nameplate" />}
        </Stack>
      )}
      {!ac && mode === 'to-amps' && unit === 'HP' && <NumberField label="Motor efficiency" value={eff} onChange={setEff} suffix="%" error={ef.error} helperText="From the motor nameplate" />}
      {result ?? (notices.length === 0 && <EmptyResult />)}
      <Notices items={notices} />
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'amp-calculator',
  title: 'Amp Calculator',
  h1: 'Amp Calculator — Watts, kW, kVA and HP to Amps',
  shortTitle: 'Amps',
  description: 'Amp calculator: convert watts, kW, kVA or horsepower to amps (or amps to watts) for DC, single-phase and three-phase AC, with power factor, efficiency and formulas.',
  keywords: ['amp calculator', 'watts to amps', 'amps to watts', 'kva to amps', 'hp to amps', 'three phase amps calculator', 'how many amps'],
  category: 'electrical',
  icon: 'ElectricBolt',
  tagline: 'Convert watts, kilowatts, kVA or motor horsepower to amps — or amps back to watts — for DC, single-phase and three-phase circuits.',
  lastUpdated: 'October 2026',
  suppressBoilerplate: true,
  intro: `Current (amps), voltage (volts) and power (watts) are linked: for a DC circuit, watts = volts × amps. This amp calculator applies that relationship for DC, single-phase AC and three-phase AC. It includes power factor for AC loads and efficiency for motors.\n\nFor AC, <strong>power factor</strong> matters. A resistive load such as a heater or incandescent bulb has a power factor of 1, so amps = watts ÷ volts. Motors, compressors and many electronic power supplies draw more current than their watt rating suggests. Their power factor is below 1, so divide by it as well. Three-phase circuits spread the load across three conductors, which brings in a factor of √3 (about 1.732) when you use the line-to-line voltage.\n\nIf you know apparent power in kVA (common on transformers and generators), power factor doesn't apply: current = VA ÷ volts (÷ √3 for three-phase). For a motor rated in horsepower, the calculator converts output HP to the electrical input power using the efficiency you enter.`,
  howItWorksTitle: 'How to Convert Watts to Amps',
  howItWorks: '1. Choose the system: DC, single-phase AC, or three-phase AC. For three-phase, use the line-to-line voltage (e.g. 208, 480).\n2. Convert the power to watts: kW × 1,000; HP × 746 ÷ efficiency for a motor\'s electrical input.\n3. DC: amps = watts ÷ volts.\n4. Single-phase AC: amps = watts ÷ (volts × power factor).\n5. Three-phase AC: amps = watts ÷ (√3 × volts × power factor). For kVA, skip the power factor: amps = VA ÷ (√3 × volts).',
  formula: 'DC:            I = P ÷ V\nSingle-phase:  I = P ÷ (V × PF)\nThree-phase:   I = P ÷ (√3 × V_LL × PF)\n\nFrom apparent power (AC):\n  Single-phase:  I = S ÷ V\n  Three-phase:   I = S ÷ (√3 × V_LL)\n\nMotor input:   P = HP × 746 ÷ Efficiency\n\nI — current (A)   P — real power (W)   S — apparent power (VA)\nV — voltage (V)   V_LL — line-to-line voltage   PF — power factor (0–1)',
  examplesTitle: 'Amp Calculation Examples',
  example: '',
  examples: [
    { title: 'Example 1 — 1,800 W space heater on 120 V', body: 'Resistive load, PF = 1\nI = 1,800 ÷ 120 = 15.0 A' },
    { title: 'Example 2 — 10 kW three-phase load at 480 V, PF 0.9', body: 'I = 10,000 ÷ (1.732 × 480 × 0.9)\n  = 10,000 ÷ 748.2\n  = 13.37 A per phase' },
    { title: 'Example 3 — 75 kVA transformer secondary, 208 V three-phase', body: 'I = 75,000 ÷ (1.732 × 208)\n  = 75,000 ÷ 360.3\n  = 208.2 A full-load current' },
  ],
  referenceTables: [
    {
      title: 'Watts to Amps at Common Voltages (PF = 1)',
      columns: ['Watts', '12 V DC', '120 V', '240 V', '208 V 3φ', '480 V 3φ'],
      rows: [100, 500, 1000, 1500, 2000, 5000, 10000].map((w) => [
        w.toLocaleString('en-US'),
        `${(w / 12).toFixed(1)} A`,
        `${(w / 120).toFixed(2)} A`,
        `${(w / 240).toFixed(2)} A`,
        `${(w / (Math.sqrt(3) * 208)).toFixed(2)} A`,
        `${(w / (Math.sqrt(3) * 480)).toFixed(2)} A`,
      ]),
      note: 'Computed from the formulas above with power factor 1 (resistive load). Loads with a lower power factor draw proportionally more current.',
    },
  ],
  tipsTitle: 'Practical Notes',
  tips: [
    'For sizing conductors, take the current from here to the <a href="/calculators/wire-size-calculator">wire size calculator</a>. It checks ampacity and voltage drop.',
    'Nameplate current beats a calculated value. Motors and appliances list full-load amps on the nameplate, and that is what you should design to.',
    'To see what a load costs to run, enter its watts in the <a href="/calculators/energy-cost-calculator">energy cost calculator</a>.',
    'In the US, 120 V and 240 V are nominal. Actual supply voltage varies, and lower voltage means higher current for the same power.',
  ],
  methodology: {
    title: 'Assumptions & Limitations',
    disclaimer: '<strong>Planning aid only.</strong> This converts between power, voltage and current. It does not size breakers or conductors, and it does not replace the electrical code that applies where you are, the equipment manufacturer\'s instructions, or a licensed electrician.',
    assumptions: [
      'Steady-state, sinusoidal AC with balanced three-phase loads. Three-phase results are per-phase line current.',
      'Power factor is entered by you. It is 1 for resistive loads; for motors and electronic loads, use the nameplate or datasheet value.',
      'Horsepower is mechanical output, converted at 746 W per HP and divided by the efficiency you enter to get electrical input.',
      'Voltage is the actual supply voltage at the load.',
    ],
    exclusions: [
      'Motor branch-circuit sizing. In the US, the NEC sizes motor circuits from its full-load current tables (Article 430), not from nameplate horsepower math.',
      'Inrush or starting current, harmonics, and unbalanced three-phase loads.',
      'Breaker or fuse selection and conductor sizing.',
    ],
  },
  faq: [
    {
      question: 'How many amps is 1,500 watts?',
      answer: 'At 120 V with a resistive load, 1,500 ÷ 120 = 12.5 A. At 240 V it is 6.25 A. A motor or other inductive load with a power factor below 1 draws more current for the same wattage.',
    },
    {
      question: 'Why does three-phase use √3?',
      answer: 'In a balanced three-phase system, total power is shared across three conductors whose voltages are 120° apart. Measured with line-to-line voltage, total power works out to √3 × V × I × PF, so current per phase is power ÷ (√3 × V × PF).',
    },
    {
      question: 'Should I use watts or kVA?',
      answer: 'Use watts (real power) when you know what the load consumes, with its power factor. Use kVA (apparent power) when the equipment is rated that way, as transformers, generators and UPS units usually are. Power factor is already included in kVA.',
    },
  ],
  relatedSlugs: ['wire-size-calculator', 'energy-cost-calculator'],
};

export const ampCalculator: CalculatorDefinition = { meta, Component: AmpUI };
