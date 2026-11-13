import test from 'node:test';
import assert from 'node:assert/strict';
import { PUGAL_APPROVED_PLANS } from '../../data/workouts/approvedPlans';
import { createEmptyOnboardingData } from '../../types/onboarding';
import {
  computePhysicalSummary,
  findCompatibleApprovedPlans,
  validateOnboardingStage,
} from './planMatcher';

test('findCompatibleApprovedPlans matches gym 4-day intermediate fat loss plan', () => {
  const plans = findCompatibleApprovedPlans(PUGAL_APPROVED_PLANS, {
    fitness_goal: 'fat_loss',
    experience_level: 'intermediate',
    workout_location: 'gym',
    available_workout_days: 4,
    preferred_workout_time: 'Morning',
    preferred_mission_types: ['Mobility', 'Walk'],
  });

  assert.equal(plans.length, 1);
  assert.equal(plans[0].splitDays, 4);
  assert.equal(plans[0].approvedBy, 'Pugal-Approved');
});

test('findCompatibleApprovedPlans returns empty array when no approved plan fits criteria (never invents plans)', () => {
  const plans = findCompatibleApprovedPlans(PUGAL_APPROVED_PLANS, {
    fitness_goal: 'muscle_gain',
    experience_level: 'advanced',
    workout_location: 'home',
    available_workout_days: 6,
    preferred_workout_time: 'Evening',
    preferred_mission_types: ['Workout'],
  });

  assert.equal(plans.length, 0);
});

test('validateOnboardingStage requires mandatory fields and consent while keeping optional fields optional', () => {
  const data = createEmptyOnboardingData();

  // Stage 1 missing required fields
  assert.notEqual(validateOnboardingStage(1, data), null);

  // Stage 1 with required fields filled (gender & photo omitted/optional)
  data.personal_information.full_name = 'Meera Krishnan';
  data.personal_information.email = 'meera@example.com';
  data.personal_information.phone = '+91 98111 22334';
  data.personal_information.date_of_birth = '1996-05-14';
  assert.equal(validateOnboardingStage(1, data), null);

  // Stage 6 requires explicit consent
  assert.notEqual(validateOnboardingStage(6, data), null);
  data.health_information.consent_status = true;
  assert.equal(validateOnboardingStage(6, data), null);
});

test('computePhysicalSummary computes BMI and delta without altering inputs', () => {
  const res = computePhysicalSummary('175', '80', '72');
  assert.equal(res.valid, true);
  assert.equal(res.bmi, 26.1);
  assert.equal(res.deltaKg, -8);
});
