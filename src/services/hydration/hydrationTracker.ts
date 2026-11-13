import type {
  BottleCapacityMl,
  DailyHydrationSummary,
  HydrationConfiguration,
  HydrationLogEntry,
  HydrationProfileBaseline,
  WeeklyHydrationConsistency,
} from '../../types/hydration';

export const HYDRATION_INTAKE_LABELS: Record<string, string> = {
  lt_500: 'Less than 500 ml',
  '500_1000': '500 ml – 1 litre',
  '1000_1500': '1 – 1.5 litres',
  '1500_2000': '1.5 – 2 litres',
  '2000_2500': '2 – 2.5 litres',
  '2500_3000': '2.5 – 3 litres',
  gt_3000: 'More than 3 litres',
  not_sure: 'Not sure',
};

export const DRINKING_FREQUENCY_LABELS: Record<string, string> = {
  frequently: 'Frequently throughout the day',
  thirsty_only: 'Only when I feel thirsty',
  with_meals: 'Mostly during meals',
  occasionally: 'Occasionally',
  often_forget: 'I often forget to drink water',
};

export const BOTTLE_CAPACITY_LABELS: Record<string, string> = {
  '250': '250 ml',
  '500': '500 ml',
  '750': '750 ml',
  '1000': '1 litre',
  '1500': '1.5 litres',
  other_not_sure: 'Other / Not sure',
};

export const REMINDER_PREFERENCE_LABELS: Record<string, string> = {
  yes_remind: 'Yes, remind me throughout the day',
  no_self_track: "No, I'll track it myself",
};

/**
 * Initializes a configurable hydration setup from onboarding baseline.
 * Never auto-prescribes a universal target solely from body weight.
 */
export function buildInitialHydrationConfig(
  baseline: HydrationProfileBaseline,
  hasMedicalConsiderations: boolean
): HydrationConfiguration {
  return {
    dailyTargetMl: null,
    targetSource: 'unconfigured',
    remindersEnabled: baseline.reminder_preference === 'yes_remind',
    medicalConsiderationsFlag: hasMedicalConsiderations,
    coachGuidanceNote: hasMedicalConsiderations
      ? 'Medical conditions or restrictions noted during onboarding; confirm daily fluid goals with your coach or clinician.'
      : undefined,
  };
}

/**
 * Allows configuring a daily water target through an approved or member-configured setting.
 */
export function configureDailyHydrationTarget(
  current: HydrationConfiguration,
  dailyTargetMl: number | null,
  source: 'member_configured' | 'coach_approved'
): HydrationConfiguration {
  if (dailyTargetMl === null) {
    return {
      ...current,
      dailyTargetMl: null,
      targetSource: 'unconfigured',
    };
  }
  const safeMl = Math.max(250, Math.min(6000, Math.round(dailyTargetMl)));
  return {
    ...current,
    dailyTargetMl: safeMl,
    targetSource: source,
  };
}

/**
 * Returns quick-add ml increments anchored to the member's usual bottle capacity.
 */
export function getQuickAddIncrementsMl(bottleCapacity: BottleCapacityMl | null): number[] {
  if (typeof bottleCapacity === 'number') {
    const base = new Set<number>([250, bottleCapacity, 500]);
    return Array.from(base).sort((a, b) => a - b);
  }
  return [250, 500, 750];
}

export function createWaterLogEntry(params: {
  date: string;
  amountMl: number;
  source: HydrationLogEntry['source'];
  loggedAt?: string;
}): HydrationLogEntry | null {
  const cleanMl = Math.round(params.amountMl);
  if (!Number.isFinite(cleanMl) || cleanMl <= 0) return null;
  return {
    id: `hyd-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: params.date,
    amountMl: cleanMl,
    loggedAt: params.loggedAt ?? new Date().toISOString(),
    source: params.source,
  };
}

export function summarizeDailyHydration(
  logs: HydrationLogEntry[],
  date: string,
  targetMl: number | null
): DailyHydrationSummary {
  const dayLogs = logs.filter((entry) => entry.date === date);
  const totalMl = dayLogs.reduce((sum, entry) => sum + entry.amountMl, 0);
  const progressPct =
    targetMl && targetMl > 0
      ? Math.min(100, Math.round((totalMl / targetMl) * 100))
      : null;

  return {
    date,
    totalMl,
    targetMl,
    progressPct,
    entriesCount: dayLogs.length,
    targetReached: Boolean(targetMl && targetMl > 0 && totalMl >= targetMl),
  };
}

export function computeWeeklyHydrationConsistency(
  logs: HydrationLogEntry[],
  dates: string[],
  targetMl: number | null
): WeeklyHydrationConsistency {
  if (dates.length === 0) {
    return {
      daysTracked: 0,
      daysTargetMet: 0,
      averageDailyMl: 0,
      consistencyPct: 0,
    };
  }

  let daysTracked = 0;
  let daysTargetMet = 0;
  let totalWeekMl = 0;

  for (const date of dates) {
    const summary = summarizeDailyHydration(logs, date, targetMl);
    if (summary.totalMl > 0) {
      daysTracked += 1;
      totalWeekMl += summary.totalMl;
    }
    if (summary.targetReached) {
      daysTargetMet += 1;
    }
  }

  const averageDailyMl = daysTracked > 0 ? Math.round(totalWeekMl / daysTracked) : 0;
  const consistencyPct =
    targetMl && targetMl > 0
      ? Math.round((daysTargetMet / dates.length) * 100)
      : Math.round((daysTracked / dates.length) * 100);

  return {
    daysTracked,
    daysTargetMet,
    averageDailyMl,
    consistencyPct,
  };
}

export const SELF_REPORTED_HYDRATION_DISCLAIMER =
  'Self-reported water intake tracks daily drinking habits and does not measure clinical hydration status.';
