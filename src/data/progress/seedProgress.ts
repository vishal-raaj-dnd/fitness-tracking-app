import type {
  Badge,
  BodyMeasurementSnapshot,
  HeatmapDay,
  MemberStreakState,
  WeightRecord,
} from '../../types';

export const SEED_WEIGHT_HISTORY: WeightRecord[] = [
  { id: 'w-1', date: '2026-10-21', weightKg: 84.5, note: 'Day 1 Baseline' },
  { id: 'w-2', date: '2026-10-24', weightKg: 84.1 },
  { id: 'w-3', date: '2026-10-27', weightKg: 83.3 },
  { id: 'w-4', date: '2026-10-30', weightKg: 83.5 },
  { id: 'w-5', date: '2026-11-02', weightKg: 82.6 },
  { id: 'w-6', date: '2026-11-05', weightKg: 81.9 },
  { id: 'w-7', date: '2026-11-08', weightKg: 81.2 },
  { id: 'w-8', date: '2026-11-10', weightKg: 81.4 },
  { id: 'w-9', date: '2026-11-12', weightKg: 80.6 },
  { id: 'w-10', date: '2026-11-13', weightKg: 80.2, note: 'Morning fasted check-in' },
];

export const SEED_MEASUREMENTS: {
  initial: BodyMeasurementSnapshot;
  current: BodyMeasurementSnapshot;
} = {
  initial: {
    label: 'Day 1 (Baseline)',
    date: '2026-10-21',
    chestCm: 103.5,
    waistCm: 92.0,
    hipsCm: 101.0,
    armCm: 35.5,
    thighCm: 58.0,
    bodyFatPct: 22.4,
  },
  current: {
    label: 'Day 24 (Current)',
    date: '2026-11-13',
    chestCm: 102.0,
    waistCm: 87.2,
    hipsCm: 98.4,
    armCm: 35.8,
    thighCm: 57.1,
    bodyFatPct: 19.1,
  },
};

export const SEED_BADGES: Badge[] = [
  {
    id: 'badge-day7',
    title: '7-Day Ignition',
    description: 'Maintained 7 consecutive qualifying days in SHRED 90.',
    milestoneDays: 7,
    earned: true,
    earnedDate: '2026-10-27',
  },
  {
    id: 'badge-day14',
    title: '14-Day Momentum',
    description: 'Reached a 14-day streak and unlocked +1 Rest Pass.',
    milestoneDays: 14,
    earned: true,
    earnedDate: '2026-11-12',
  },
  {
    id: 'badge-day30',
    title: '30-Day Discipline',
    description: 'Complete one full month of structured training & meals.',
    milestoneDays: 30,
    earned: false,
  },
  {
    id: 'badge-day60',
    title: '60-Day Grit',
    description: 'Two-thirds through the 90-day transformation.',
    milestoneDays: 60,
    earned: false,
  },
  {
    id: 'badge-day90',
    title: 'SHRED 90 Finisher',
    description: 'Completed the full 90-day NXTGEN SHRED protocol.',
    milestoneDays: 90,
    earned: false,
  },
];

export function buildSeedHeatmap(): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const startDate = new Date('2026-10-21T00:00:00Z');

  for (let i = 1; i <= 90; i++) {
    const d = new Date(startDate);
    d.setUTCDate(startDate.getUTCDate() + (i - 1));
    const dateStr = d.toISOString().slice(0, 10);

    if (i > 24) {
      days.push({
        dayNumber: i,
        date: dateStr,
        status: 'upcoming',
        workoutDone: false,
        mealsDoneCount: 0,
        missionDone: false,
      });
    } else if (i === 24) {
      // Today (Day 24): currently 1 meal done (Breakfast), workout pending
      days.push({
        dayNumber: i,
        date: dateStr,
        status: 'upcoming',
        workoutDone: false,
        mealsDoneCount: 1,
        missionDone: false,
      });
    } else if (i === 9) {
      // Missed day earlier in programme
      days.push({
        dayNumber: i,
        date: dateStr,
        status: 'missed',
        workoutDone: false,
        mealsDoneCount: 1,
        missionDone: false,
      });
    } else if (i === 17) {
      // Rest Pass applied automatically
      days.push({
        dayNumber: i,
        date: dateStr,
        status: 'rest_pass',
        workoutDone: false,
        mealsDoneCount: 1,
        missionDone: false,
      });
    } else if (i % 7 === 0 || i === 4 || i === 11 || i === 18) {
      days.push({
        dayNumber: i,
        date: dateStr,
        status: 'rest',
        workoutDone: false,
        mealsDoneCount: 3,
        missionDone: true,
      });
    } else {
      days.push({
        dayNumber: i,
        date: dateStr,
        status: 'active',
        workoutDone: true,
        mealsDoneCount: 4,
        missionDone: i % 2 === 0,
      });
    }
  }
  return days;
}

export const SEED_STREAK_STATE: MemberStreakState = {
  currentStreak: 14,
  longestStreak: 14,
  restPassBalance: 2,
  status: 'At risk',
  restDayCheckedInToday: false,
  completedMissionsCount: 11,
  swappedMissionsCount: 2,
  skippedMissionsCount: 1,
  restPassHistory: [
    {
      id: 'rp-seed-1',
      memberId: 'member-arjun',
      grantedBy: 'System Milestone',
      reason: '14-Day Streak Milestone Reward',
      amount: 1,
      grantedAt: '2026-11-12',
    },
  ],
};
