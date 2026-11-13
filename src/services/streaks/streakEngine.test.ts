import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyQualifyingActionToStreak,
  applyRestPassIfEligible,
  computeStreakStatus,
  evaluateMilestoneRestPassAward,
  grantCoachRestPass,
  hasQualifyingActionToday,
} from './streakEngine';
import type { MemberStreakState } from '../../types';

test('qualifying action requires workout, >=2 meals, mission, or rest day check-in', () => {
  assert.equal(
    hasQualifyingActionToday({
      workoutCompleted: false,
      mealsCompletedCount: 1,
      missionCompleted: false,
      isScheduledRestDay: false,
      restDayCheckedIn: false,
    }),
    false
  );

  assert.equal(
    hasQualifyingActionToday({
      workoutCompleted: false,
      mealsCompletedCount: 2,
      missionCompleted: false,
      isScheduledRestDay: false,
      restDayCheckedIn: false,
    }),
    true
  );

  assert.equal(
    hasQualifyingActionToday({
      workoutCompleted: false,
      mealsCompletedCount: 0,
      missionCompleted: false,
      isScheduledRestDay: true,
      restDayCheckedIn: true,
    }),
    true
  );
});

test('Rest Pass awards every 14 days and caps at 3', () => {
  assert.deepEqual(evaluateMilestoneRestPassAward(14, 2), { awarded: true, nextBalance: 3 });
  assert.deepEqual(evaluateMilestoneRestPassAward(28, 3), { awarded: false, nextBalance: 3 });
  assert.deepEqual(evaluateMilestoneRestPassAward(13, 1), { awarded: false, nextBalance: 1 });
});

test('Rest Pass auto-applies on missed eligible day and freezes streak', () => {
  assert.deepEqual(applyRestPassIfEligible(2), {
    applied: true,
    nextBalance: 1,
    nextStatus: 'Frozen',
  });
  assert.deepEqual(applyRestPassIfEligible(0), {
    applied: false,
    nextBalance: 0,
    nextStatus: 'Broken',
  });
});

test('computeStreakStatus returns Active when qualifying action done today', () => {
  const status = computeStreakStatus({
    todaySnapshot: {
      workoutCompleted: true,
      mealsCompletedCount: 1,
      missionCompleted: false,
      isScheduledRestDay: false,
      restDayCheckedIn: false,
    },
    preferredWorkoutTime: '07:30',
    currentTimeHHmm: '10:00',
  });
  assert.equal(status, 'Active');
});

test('applyQualifyingActionToStreak increments once per day and updates longest streak', () => {
  const initial: MemberStreakState = {
    currentStreak: 13,
    longestStreak: 13,
    restPassBalance: 2,
    status: 'At risk',
    restDayCheckedInToday: false,
    completedMissionsCount: 5,
    swappedMissionsCount: 1,
    skippedMissionsCount: 0,
    restPassHistory: [],
  };

  const first = applyQualifyingActionToStreak(initial, false);
  assert.equal(first.nextState.currentStreak, 14);
  assert.equal(first.nextState.longestStreak, 14);
  assert.equal(first.nextState.restPassBalance, 3);
  assert.equal(first.milestonePassAwarded, true);

  const secondSameDay = applyQualifyingActionToStreak(first.nextState, true);
  assert.equal(secondSameDay.nextState.currentStreak, 14);
  assert.equal(secondSameDay.milestonePassAwarded, false);
});

test('coach grant rest pass records reason and respects cap', () => {
  const initial: MemberStreakState = {
    currentStreak: 5,
    longestStreak: 10,
    restPassBalance: 1,
    status: 'Active',
    restDayCheckedInToday: false,
    completedMissionsCount: 2,
    swappedMissionsCount: 0,
    skippedMissionsCount: 0,
    restPassHistory: [],
  };

  const updated = grantCoachRestPass(initial, {
    memberId: 'member-arjun',
    coachName: 'Vikram Rao',
    reason: 'Travel recovery day',
    amount: 1,
    grantedAt: '2026-11-13',
  });

  assert.equal(updated.restPassBalance, 2);
  assert.equal(updated.restPassHistory[0].reason, 'Travel recovery day');
});
