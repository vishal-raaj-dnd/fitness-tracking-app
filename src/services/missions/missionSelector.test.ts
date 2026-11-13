import test from 'node:test';
import assert from 'node:assert/strict';
import {
  acceptMission,
  completeMission,
  filterSafeMissions,
  revealMission,
  selectDailyMission,
  swapMissionOnce,
} from './missionSelector';
import { SEED_DAILY_MISSIONS } from '../../data/missions/seedMissions';
import type { ActiveDailyMissionState } from '../../types';

test('filterSafeMissions excludes missions contraindicated by health restrictions', () => {
  const safe = filterSafeMissions(SEED_DAILY_MISSIONS, {
    profile: {
      fitnessGoal: 'fat_loss',
      experienceLevel: 'intermediate',
      workoutLocation: 'commercial_gym',
      exerciseRestrictions: ['knee_injury', 'shoulder_impingement'],
    },
    isRestDay: false,
    recentTrainingLoad: 'moderate',
  });

  assert.equal(
    safe.some((m) => m.avoidRestrictions.includes('knee_injury')),
    false
  );
  assert.equal(
    safe.some((m) => m.avoidRestrictions.includes('shoulder_impingement')),
    false
  );
});

test('on rest days selectDailyMission never assigns high-intensity Workout missions', () => {
  const mission = selectDailyMission(SEED_DAILY_MISSIONS, {
    profile: {
      fitnessGoal: 'fat_loss',
      experienceLevel: 'intermediate',
      workoutLocation: 'commercial_gym',
      exerciseRestrictions: [],
    },
    isRestDay: true,
    recentTrainingLoad: 'low',
  });

  assert.notEqual(mission.category, 'Workout');
});

test('mission lifecycle supports reveal, accept, single swap, and complete', () => {
  const initial: ActiveDailyMissionState = {
    missionId: SEED_DAILY_MISSIONS[0].id,
    status: 'unrevealed',
    swappedOnce: false,
  };

  const revealed = revealMission(initial);
  assert.equal(revealed.status, 'revealed');

  const swapped = swapMissionOnce(revealed, SEED_DAILY_MISSIONS, {
    profile: {
      fitnessGoal: 'fat_loss',
      experienceLevel: 'intermediate',
      workoutLocation: 'commercial_gym',
      exerciseRestrictions: [],
    },
    isRestDay: false,
    recentTrainingLoad: 'moderate',
  });
  assert.equal(swapped.swappedOnce, true);
  assert.notEqual(swapped.missionId, initial.missionId);

  // Attempting a second swap should not alter missionId
  const secondSwap = swapMissionOnce(swapped, SEED_DAILY_MISSIONS, {
    profile: {
      fitnessGoal: 'fat_loss',
      experienceLevel: 'intermediate',
      workoutLocation: 'commercial_gym',
      exerciseRestrictions: [],
    },
    isRestDay: false,
    recentTrainingLoad: 'moderate',
  });
  assert.equal(secondSwap.missionId, swapped.missionId);

  const accepted = acceptMission(swapped);
  assert.equal(accepted.status, 'accepted');

  const completed = completeMission(accepted);
  assert.equal(completed.status, 'completed');
});
