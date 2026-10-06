/** Amps ↔ watts ↔ volts for DC, single-phase AC and three-phase AC. */

export type System = 'dc' | 'ac1' | 'ac3';

/** Watts per electrical horsepower (the conventional 746 W used for motors). */
export const WATTS_PER_HP = 746;

/** Current from real power. Three-phase uses line-to-line voltage. */
export function ampsFromWatts(system: System, watts: number, volts: number, pf = 1): number {
  if (system === 'dc') return watts / volts;
  if (system === 'ac1') return watts / (volts * pf);
  return watts / (Math.sqrt(3) * volts * pf);
}

/** Real power from current. */
export function wattsFromAmps(system: System, amps: number, volts: number, pf = 1): number {
  if (system === 'dc') return amps * volts;
  if (system === 'ac1') return amps * volts * pf;
  return Math.sqrt(3) * amps * volts * pf;
}

/** Current from apparent power (VA). Power factor does not apply. */
export function ampsFromVA(system: System, va: number, volts: number): number {
  return system === 'ac3' ? va / (Math.sqrt(3) * volts) : va / volts;
}

/** Apparent power (VA) from current. */
export function vaFromAmps(system: System, amps: number, volts: number): number {
  return system === 'ac3' ? Math.sqrt(3) * amps * volts : amps * volts;
}

/** Electrical input power for a motor with `hp` mechanical output at `efficiencyPct`. */
export function inputWattsFromHp(hp: number, efficiencyPct: number): number {
  return (hp * WATTS_PER_HP) / (efficiencyPct / 100);
}
