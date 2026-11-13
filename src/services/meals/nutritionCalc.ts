import type { FoodItem, NutritionTargets, ScheduledMeal } from '../../types';

export interface NutritionTotals {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  completedMealsCount: number;
  totalMealsCount: number;
}

export function getMealMacros(meal: ScheduledMeal): {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
} {
  if (meal.selectedAlternativeId) {
    const alt = meal.alternatives.find((a) => a.id === meal.selectedAlternativeId);
    if (alt) {
      return {
        calories: alt.calories,
        proteinG: alt.proteinG,
        carbsG: alt.carbsG,
        fatG: alt.fatG,
      };
    }
  }
  return meal.items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      proteinG: acc.proteinG + item.proteinG,
      carbsG: acc.carbsG + item.carbsG,
      fatG: acc.fatG + item.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );
}

export function calculateDailyNutrition(
  meals: ScheduledMeal[],
  customFoods: FoodItem[]
): NutritionTotals {
  let calories = 0;
  let proteinG = 0;
  let carbsG = 0;
  let fatG = 0;
  let completedMealsCount = 0;

  for (const meal of meals) {
    if (meal.completed) {
      completedMealsCount += 1;
      const macros = getMealMacros(meal);
      calories += macros.calories;
      proteinG += macros.proteinG;
      carbsG += macros.carbsG;
      fatG += macros.fatG;
    }
  }

  for (const food of customFoods) {
    calories += food.calories;
    proteinG += food.proteinG;
    carbsG += food.carbsG;
    fatG += food.fatG;
  }

  return {
    calories,
    proteinG,
    carbsG,
    fatG,
    completedMealsCount,
    totalMealsCount: meals.length,
  };
}

export function computeMacroProgressPct(consumed: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((consumed / target) * 100));
}

export function getRemainingMacros(totals: NutritionTotals, targets: NutritionTargets) {
  return {
    calories: Math.max(0, targets.calories - totals.calories),
    proteinG: Math.max(0, targets.proteinG - totals.proteinG),
    carbsG: Math.max(0, targets.carbsG - totals.carbsG),
    fatG: Math.max(0, targets.fatG - totals.fatG),
  };
}
