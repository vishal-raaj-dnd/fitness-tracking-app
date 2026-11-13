import type {
  DayActionSnapshot,
  HeatmapDay,
  MemberStreakState,
  StreakRuleConfig,
  StreakStatus,
} from '../../types';

export const DEFAULT_STREAK_RULES: StreakRuleConfig = {
  startingRestPasses: 2,
  milestoneDaysForPass: 14,
  maxRestPassBalance: 3,
  minMealsForStreak: 2,
  allowRestDayCheckin: true,
  allowMissionForStreak: true,
};

/**
 * Evaluates whether today's actions satisfy at least one qualifying streak criterion:
 * 1. Completing the scheduled workout or logging a workout.
 * 2. Logging or completing at least two meals.
 * 3. Completing the Surprise Daily Mission.
 * 4. Checking in on a scheduled rest day.
 */
export function hasQualifyingActionToday(
  snapshot: DayActionSnapshot,
  rules: StreakRuleConfig = DEFAULT_STREAK_RULES
): boolean {
  if (snapshot.workoutCompleted) return true;
  if (snapshot.mealsCompletedCount >= rules.minMealsForStreak) return true;
  if (rules.allowMissionForStreak && snapshot.missionCompleted) return true;
  if (rules.allowRestDayCheckin && snapshot.isScheduledRestDay && snapshot.restDayCheckedIn) {
    return true;
  }
  return false;
}

/**
 * Computes current StreakStatus:
 * - Active: Today's qualifying action is complete.
 * - Frozen: A Rest Pass covered yesterday / today's missed day.
 * - Broken: A day was missed without a Rest Pass.
 * - At risk: No qualifying action completed yet today and preferred workout time has passed.
 */
export function computeStreakStatus(params: {
  todaySnapshot: DayActionSnapshot;
  preferredWorkoutTime: string; // "HH:mm"
  currentTimeHHmm: string; // "HH:mm"
  yesterdayStatus?: 'active' | 'rest' | 'missed' | 'rest_pass';
  rules?: StreakRuleConfig;
}): StreakStatus {
  const rules = params.rules ?? DEFAULT_STREAK_RULES;
  if (hasQualifyingActionToday(params.todaySnapshot, rules)) {
    return 'Active';
  }
  if (params.yesterdayStatus === 'missed') {
    return 'Broken';
  }
  if (params.yesterdayStatus === 'rest_pass') {
    return 'Frozen';
  }
  if (params.currentTimeHHmm >= params.preferredWorkoutTime) {
    return 'At risk';
  }
  return 'At risk';
}

/**
 * Applies a Rest Pass automatically when an eligible day is missed.
 * Returns updated balance and whether the pass was applied.
 */
export function applyRestPassIfEligible(
  restPassBalance: number
): { applied: boolean; nextBalance: number; nextStatus: StreakStatus } {
  if (restPassBalance > 0) {
    return {
      applied: true,
      nextBalance: restPassBalance - 1,
      nextStatus: 'Frozen',
    };
  }
  return {
    applied: false,
    nextBalance: 0,
    nextStatus: 'Broken',
  };
}

/**
 * Awards a Rest Pass at every 14-day streak milestone, capped at maxRestPassBalance (3).
 */
export function evaluateMilestoneRestPassAward(
  newStreakCount: number,
  currentBalance: number,
  rules: StreakRuleConfig = DEFAULT_STREAK_RULES
): { awarded: boolean; nextBalance: number } {
  if (
    newStreakCount > 0 &&
    newStreakCount % rules.milestoneDaysForPass === 0 &&
    currentBalance < rules.maxRestPassBalance
  ) {
    return {
      awarded: true,
      nextBalance: Math.min(rules.maxRestPassBalance, currentBalance + 1),
    };
  }
  return { awarded: false, nextBalance: currentBalance };
}

/**
 * Computes updated streak state when a qualifying action occurs today for the first time today.
 */
export function applyQualifyingActionToStreak(
  prevState: MemberStreakState,
  wasAlreadyActiveToday: boolean,
  rules: StreakRuleConfig = DEFAULT_STREAK_RULES
): { nextState: MemberStreakState; milestonePassAwarded: boolean } {
  if (wasAlreadyActiveToday) {
    return {
      nextState: {
        ...prevState,
        status: 'Active',
      },
      milestonePassAwarded: false,
    };
  }

  const incremented = prevState.status === 'Broken' ? 1 : prevState.currentStreak + 1;
  const longest = Math.max(prevState.longestStreak, incremented);
  const award = evaluateMilestoneRestPassAward(incremented, prevState.restPassBalance, rules);

  return {
    nextState: {
      ...prevState,
      currentStreak: incremented,
      longestStreak: longest,
      restPassBalance: award.nextBalance,
      status: 'Active',
    },
    milestonePassAwarded: award.awarded,
  };
}

/**
 * Grants extra Rest Passes by a Coach with a recorded reason (respects max wallet cap unless override,
 * or caps cleanly at maxRestPassBalance).
 */
export function grantCoachRestPass(
  prevState: MemberStreakState,
  params: {
    memberId: string;
    coachName: string;
    reason: string;
    amount?: number;
    grantedAt: string;
  },
  rules: StreakRuleConfig = DEFAULT_STREAK_RULES
): MemberStreakState {
  const amount = Math.max(1, params.amount ?? 1);
  const nextBalance = Math.min(rules.maxRestPassBalance, prevState.restPassBalance + amount);
  return {
    ...prevState,
    restPassBalance: nextBalance,
    restPassHistory: [
      {
        id: `rp-${Date.now()}`,
        memberId: params.memberId,
        grantedBy: params.coachName,
        reason: params.reason.trim(),
        amount,
        grantedAt: params.grantedAt,
      },
      ...prevState.restPassHistory,
    ],
  };
}

/**
 * Summarizes 90-day heatmap stats for Progress screen.
 */
export function summarizeHeatmap(days: HeatmapDay[]) {
  let activeDays = 0;
  let restDays = 0;
  let missedDays = 0;
  let restPassDays = 0;

  for (const day of days) {
    if (day.status === 'active') activeDays += 1;
    else if (day.status === 'rest') restDays += 1;
    else if (day.status === 'missed') missedDays += 1;
    else if (day.status === 'rest_pass') restPassDays += 1;
  }

  const elapsed = activeDays + restDays + missedDays + restPassDays;
  const adherencePct = elapsed > 0 ? Math.round(((activeDays + restDays + restPassDays) / elapsed) * 100) : 0;

  return { activeDays, restDays, missedDays, restPassDays, elapsed, adherencePct };
}
