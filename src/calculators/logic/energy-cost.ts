/** Electricity use and cost for a device running a set number of hours. */

export const DAYS_PER_YEAR = 365;

export interface EnergyResult {
  kwhPerDay: number;
  kwhPerMonth: number;
  kwhPerYear: number;
  costPerDay: number;
  costPerMonth: number;
  costPerYear: number;
  costPerHour: number;
}

/**
 * kWh/day on a day the device is used = W × h × qty / 1000.
 * Yearly = kWh/day × daysPerWeek × 365/7; monthly = yearly / 12.
 * costPerDay is the average day across the year (not a usage day).
 */
export function energyCost(watts: number, hoursPerDay: number, daysPerWeek: number, quantity: number, ratePerKwh: number): EnergyResult {
  const kwhUseDay = (watts * hoursPerDay * quantity) / 1000;
  const kwhPerYear = kwhUseDay * daysPerWeek * (DAYS_PER_YEAR / 7);
  const kwhPerMonth = kwhPerYear / 12;
  const kwhPerDay = kwhPerYear / DAYS_PER_YEAR;
  return {
    kwhPerDay, kwhPerMonth, kwhPerYear,
    costPerDay: kwhPerDay * ratePerKwh,
    costPerMonth: kwhPerMonth * ratePerKwh,
    costPerYear: kwhPerYear * ratePerKwh,
    costPerHour: ((watts * quantity) / 1000) * ratePerKwh,
  };
}
