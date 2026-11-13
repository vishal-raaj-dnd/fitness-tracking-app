export type DailyWaterIntakeBracket =
  | 'lt_500'
  | '500_1000'
  | '1000_1500'
  | '1500_2000'
  | '2000_2500'
  | '2500_3000'
  | 'gt_3000'
  | 'not_sure';

export type DrinkingFrequency =
  | 'frequently'
  | 'thirsty_only'
  | 'with_meals'
  | 'occasionally'
  | 'often_forget';

export type BottleCapacityMl = 250 | 500 | 750 | 1000 | 1500 | 'other_not_sure';

export type HydrationReminderPreference = 'yes_remind' | 'no_self_track';

export interface HydrationProfileBaseline {
  average_daily_water_intake: DailyWaterIntakeBracket | '';
  drinking_frequency: DrinkingFrequency | '';
  bottle_capacity_ml: BottleCapacityMl | null;
  reminder_preference: HydrationReminderPreference | '';
}

export interface HydrationLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
  loggedAt: string;
  source: 'quick_add' | 'custom' | 'bottle';
}

export interface HydrationConfiguration {
  dailyTargetMl: number | null;
  targetSource: 'unconfigured' | 'member_configured' | 'coach_approved';
  remindersEnabled: boolean;
  coachGuidanceNote?: string;
  medicalConsiderationsFlag: boolean;
}

export interface DailyHydrationSummary {
  date: string;
  totalMl: number;
  targetMl: number | null;
  progressPct: number | null;
  entriesCount: number;
  targetReached: boolean;
}

export interface WeeklyHydrationConsistency {
  daysTracked: number;
  daysTargetMet: number;
  averageDailyMl: number;
  consistencyPct: number;
}
