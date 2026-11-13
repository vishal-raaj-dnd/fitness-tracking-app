import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyOnboardingData } from '../../types/onboarding';
import { validateOnboardingStage } from '../workouts/planMatcher';
import {
  buildInitialHydrationConfig,
  computeWeeklyHydrationConsistency,
  configureDailyHydrationTarget,
  createWaterLogEntry,
  getQuickAddIncrementsMl,
  summarizeDailyHydration,
} from './hydrationTracker';

test('hydration questions in Stage 5 can be skipped while mandatory nutrition fields validate', () => {
  const data = createEmptyOnboardingData();
  data.nutrition_information.dietary_preference = 'vegetarian';
  data.nutrition_information.meal_frequency = 4;
  data.nutrition_information.food_preferences = ['South Indian Staples'];

  // Hydration fields remain completely optional
  assert.equal(validateOnboardingStage(5, data), null);
});

test('buildInitialHydrationConfig sets reminder preference and flags medical considerations without prescribing weight-based target', () => {
  const config = buildInitialHydrationConfig(
    {
      average_daily_water_intake: '1500_2000',
      drinking_frequency: 'frequently',
      bottle_capacity_ml: 750,
      reminder_preference: 'yes_remind',
    },
    true
  );

  assert.equal(config.dailyTargetMl, null);
  assert.equal(config.targetSource, 'unconfigured');
  assert.equal(config.remindersEnabled, true);
  assert.equal(config.medicalConsiderationsFlag, true);
  assert.ok(config.coachGuidanceNote);
});

test('hydration tracker logs ml entries, configures target, and computes daily & weekly summaries', () => {
  const increments = getQuickAddIncrementsMl(750);
  assert.deepEqual(increments, [250, 500, 750]);

  const initialConfig = buildInitialHydrationConfig(
    {
      average_daily_water_intake: '2000_2500',
      drinking_frequency: 'frequently',
      bottle_capacity_ml: 750,
      reminder_preference: 'no_self_track',
    },
    false
  );
  const configured = configureDailyHydrationTarget(initialConfig, 2500, 'coach_approved');
  assert.equal(configured.dailyTargetMl, 2500);
  assert.equal(configured.targetSource, 'coach_approved');

  const log1 = createWaterLogEntry({ date: '2026-11-13', amountMl: 750, source: 'bottle' });
  const log2 = createWaterLogEntry({ date: '2026-11-13', amountMl: 1750, source: 'custom' });
  const log3 = createWaterLogEntry({ date: '2026-11-12', amountMl: 1500, source: 'quick_add' });
  assert.ok(log1 && log2 && log3);

  const todaySummary = summarizeDailyHydration([log1, log2, log3], '2026-11-13', configured.dailyTargetMl);
  assert.equal(todaySummary.totalMl, 2500);
  assert.equal(todaySummary.progressPct, 100);
  assert.equal(todaySummary.targetReached, true);

  const weekly = computeWeeklyHydrationConsistency(
    [log1, log2, log3],
    ['2026-11-12', '2026-11-13'],
    configured.dailyTargetMl
  );
  assert.equal(weekly.daysTracked, 2);
  assert.equal(weekly.daysTargetMet, 1);
  assert.equal(weekly.averageDailyMl, 2000);
  assert.equal(weekly.consistencyPct, 50);
});
