/** Restaurant food cost: per-plate (recipe) and per-period (inventory) methods. */

export interface PlateResult {
  recipeCost: number;
  portionCost: number;
  /** portionCost / menuPrice × 100; null without a menu price. */
  foodCostPct: number | null;
  /** menuPrice − portionCost. */
  grossProfit: number | null;
  /** portionCost / (target / 100); null without a target. */
  suggestedPrice: number | null;
}

export function plateCost(ingredientCosts: number[], portions: number, menuPrice: number | null, targetPct: number | null): PlateResult {
  const recipeCost = ingredientCosts.reduce((a, b) => a + b, 0);
  const portionCost = portions > 0 ? recipeCost / portions : recipeCost;
  const priced = menuPrice !== null && menuPrice > 0;
  return {
    recipeCost,
    portionCost,
    foodCostPct: priced ? (portionCost / (menuPrice as number)) * 100 : null,
    grossProfit: priced ? (menuPrice as number) - portionCost : null,
    suggestedPrice: targetPct !== null && targetPct > 0 ? portionCost / (targetPct / 100) : null,
  };
}

export interface PeriodResult {
  /** Beginning inventory + purchases − ending inventory. */
  cogs: number;
  foodCostPct: number | null;
}

export function periodFoodCost(beginning: number, purchases: number, ending: number, foodSales: number): PeriodResult {
  const cogs = beginning + purchases - ending;
  return { cogs, foodCostPct: foodSales > 0 ? (cogs / foodSales) * 100 : null };
}
