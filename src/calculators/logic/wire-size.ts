/**
 * Minimum conductor size from (1) NEC Table 310.16 ampacity and (2) voltage
 * drop using NEC Chapter 9 Table 8 DC resistance. Tables: src/data/electrical/conductors.json.
 *
 * Deliberately NOT modeled (stated on the page): ambient-temperature and
 * conductor-bundling adjustment factors, AC reactance/skin effect, parallel
 * conductors, motor/HVAC/EV-specific sizing rules, local amendments.
 */

export type Material = 'cu' | 'al';
export type TempRating = 60 | 75 | 90;
export type Phase = 'dc' | 'ac1' | 'ac3';

export interface ConductorProps {
  a60: number;
  a75: number;
  a90: number;
  /** NEC 240.4(D) maximum overcurrent device for small conductors. */
  ocpdMax?: number;
  ohmsPerKft: number;
}

export interface SizeRow {
  size: string;
  cmil: number;
  cu: ConductorProps | null;
  al: ConductorProps | null;
}

export interface WireInput {
  /** Load current in amps. */
  amps: number;
  /** Treat as continuous (3h+) — size for 125% of the load. */
  continuous: boolean;
  volts: number;
  phase: Phase;
  /** One-way circuit length in feet. */
  lengthFt: number;
  material: Material;
  /** Temperature column used for ampacity (limited by terminations). */
  tempRating: TempRating;
  /** Maximum allowed voltage drop, percent. */
  maxDropPct: number;
}

export interface SizeCheck {
  size: string;
  ampacity: number;
  ocpdMax?: number;
  dropVolts: number;
  dropPct: number;
}

export interface WireResult {
  /** Current the conductor must carry: amps × 1.25 if continuous. */
  designAmps: number;
  /** Smallest size whose ampacity (and 240.4(D) limit) covers designAmps. */
  byAmpacity: SizeCheck | null;
  /** Smallest size whose voltage drop ≤ maxDropPct. */
  byVoltageDrop: SizeCheck | null;
  /** The larger of the two — the recommendation. */
  recommended: SizeCheck | null;
  /** Which requirement set the recommendation. */
  governedBy: 'ampacity' | 'voltage-drop' | null;
}

/** Voltage drop across the round trip. Three-phase uses √3 instead of 2. */
export function voltageDrop(phase: Phase, amps: number, ohmsPerKft: number, lengthFt: number): number {
  const k = phase === 'ac3' ? Math.sqrt(3) : 2;
  return (k * amps * ohmsPerKft * lengthFt) / 1000;
}

export function ampacityOf(p: ConductorProps, t: TempRating): number {
  return t === 60 ? p.a60 : t === 75 ? p.a75 : p.a90;
}

/** NEC 110.14(C) default: 60°C terminations for circuits ≤100 A (or 14–1 AWG), 75°C above. */
export function defaultTempRating(amps: number): TempRating {
  return amps <= 100 ? 60 : 75;
}

export function sizeWire(input: WireInput, table: SizeRow[]): WireResult {
  const designAmps = input.continuous ? input.amps * 1.25 : input.amps;
  const rows = table.filter((r) => r[input.material] !== null);

  const evaluate = (r: SizeRow): SizeCheck => {
    const p = r[input.material] as ConductorProps;
    // Voltage drop is computed at the actual load current, not the 125% design current.
    const dropVolts = voltageDrop(input.phase, input.amps, p.ohmsPerKft, input.lengthFt);
    return { size: r.size, ampacity: ampacityOf(p, input.tempRating), ocpdMax: p.ocpdMax, dropVolts, dropPct: (dropVolts / input.volts) * 100 };
  };

  const checks = rows.map(evaluate);
  const ampIdx = checks.findIndex((c) => Math.min(c.ampacity, c.ocpdMax ?? Infinity) >= designAmps);
  const vdIdx = checks.findIndex((c) => c.dropPct <= input.maxDropPct);
  const byAmpacity = ampIdx >= 0 ? checks[ampIdx] : null;
  const byVoltageDrop = vdIdx >= 0 ? checks[vdIdx] : null;
  if (ampIdx < 0 || vdIdx < 0) return { designAmps, byAmpacity, byVoltageDrop, recommended: null, governedBy: null };
  const idx = Math.max(ampIdx, vdIdx);
  return { designAmps, byAmpacity, byVoltageDrop, recommended: checks[idx], governedBy: vdIdx > ampIdx ? 'voltage-drop' : 'ampacity' };
}
