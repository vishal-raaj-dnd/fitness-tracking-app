import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDailyNutrition, computeMacroProgressPct } from './nutritionCalc';
import { SEED_MEALS } from '../../data/meals/seedMeals';

test('calculateDailyNutrition sums completed meals and custom food items', () => {
  const meals = SEED_MEALS.map((m, idx) => ({
    ...m,
    completed: idx === 0, // only Breakfast completed initially
  }));

  const totals = calculateDailyNutrition(meals, [
    {
      id: 'custom-1',
      name: 'Whey Isolate',
      portion: '1 scoop',
      calories: 125,
      proteinG: 26,
      carbsG: 2,
      fatG: 1,
    },
  ]);

  assert.equal(totals.completedMealsCount, 1);
  assert.equal(totals.calories, 490 + 125);
  assert.equal(totals.proteinG, 37 + 26);
});

test('computeMacroProgressPct clamps at 100', () => {
  assert.equal(computeMacroProgressPct(2500, 2150), 100);
  assert.equal(computeMacroProgressPct(1075, 2150), 50);
});
