import type { HydrationConfiguration, HydrationProfileBaseline } from './hydration';

export type UserRole = 'member' | 'coach' | 'admin';

export type FitnessGoal = 'fat_loss' | 'lean_recomp' | 'muscle_gain' | 'athletic_conditioning';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutLocation = 'commercial_gym' | 'home_dumbbells' | 'bodyweight';
export type DietaryPreference = 'non_vegetarian' | 'vegetarian' | 'eggetarian' | 'vegan';

export type StreakStatus = 'Active' | 'At risk' | 'Frozen' | 'Broken';

export type MissionCategory = 'Mobility' | 'Walk' | 'Workout' | 'Recovery' | 'Rest';
export type MissionLifecycleStatus = 'unrevealed' | 'revealed' | 'accepted' | 'completed' | 'skipped';

export type SafetyRestriction =
  | 'knee_injury'
  | 'lower_back_sensitivity'
  | 'shoulder_impingement'
  | 'hypertension';

export interface NotificationPrefs {
  workoutReminders: boolean;
  mealCheckins: boolean;
  streakAlerts: boolean;
  missionDrops: boolean;
}

export interface WorkoutAssignmentSummary {
  selectedPlanId: string | null;
  selectedPlanName: string | null;
  selectedSplit: string | null;
  assignmentStatus: 'unassigned' | 'selected_approved' | 'pending_coach_approval' | 'pending_coach_assignment';
}

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  avatarUrl: string;
  assignedCoachId?: string;
  programmeName: string;
  programmeDay: number;
  programmeTotalDays: number;
  heightCm: number;
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  workoutLocation: WorkoutLocation;
  availableWorkoutDays: string[];
  preferredWorkoutTime: string; // HH:mm 24h e.g. "07:30"
  preferredMissionTypes?: MissionCategory[];
  dietaryPreference: DietaryPreference;
  mealFrequency: 3 | 4 | 5;
  foodPreferences: string;
  medicalConditions: string;
  diabetesStatus?: 'not_applicable' | 'type_1' | 'type_2';
  pcosStatus?: 'not_applicable' | 'yes' | 'no';
  medications?: string;
  exerciseRestrictions: SafetyRestriction[];
  allergies: string;
  dietaryRestrictions?: string;
  safetyNotes: string;
  healthConsentAccepted: boolean;
  healthConsentTimestamp?: string;
  timezone: string;
  notifications: NotificationPrefs;
  onboardingComplete: boolean;
  workoutAssignment?: WorkoutAssignmentSummary;
  hydrationProfile?: HydrationProfileBaseline;
  hydrationConfig?: HydrationConfiguration;
}

export type MealSlotType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';

export interface FoodItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface MealAlternative {
  id: string;
  title: string;
  portionGuidance: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface ScheduledMeal {
  id: string;
  slot: MealSlotType;
  mealName: string;
  scheduledTime: string;
  items: FoodItem[];
  portionGuidance: string;
  alternatives: MealAlternative[];
  selectedAlternativeId?: string;
  completed: boolean;
  loggedAt?: string;
}

export interface NutritionTargets {
  planName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  imageUrl: string;
  videoLabel?: string;
  instructions: string[];
  contraindications: SafetyRestriction[];
}

export interface WorkoutDay {
  id: string;
  dayShort: string; // Mon, Tue...
  dayLabel: string;
  title: string;
  focus: string;
  durationMinutes: number;
  isRestDay: boolean;
  heroImageUrl: string;
  exercises: Exercise[];
}

export interface SetLogEntry {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface WorkoutHistoryEntry {
  id: string;
  date: string;
  workoutTitle: string;
  durationMinutes: number;
  totalVolumeKg: number;
  exercisesCompleted: number;
  totalExercises: number;
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  note?: string;
}

export interface BodyMeasurementSnapshot {
  label: string; // "Day 1 (Baseline)" | "Day 24 (Current)"
  date: string;
  chestCm: number;
  waistCm: number;
  hipsCm: number;
  armCm: number;
  thighCm: number;
  bodyFatPct: number;
}

export type HeatmapDayStatus = 'active' | 'rest' | 'missed' | 'rest_pass' | 'upcoming';

export interface HeatmapDay {
  dayNumber: number; // 1..90
  date: string;
  status: HeatmapDayStatus;
  workoutDone: boolean;
  mealsDoneCount: number;
  missionDone: boolean;
}

export interface DailyMission {
  id: string;
  title: string;
  category: MissionCategory;
  durationMinutes: number;
  description: string;
  safetyTags: SafetyRestriction[]; // restrictions this mission is safe for? Better: avoidRestrictions
  avoidRestrictions: SafetyRestriction[];
  suitableLocations: WorkoutLocation[];
  suitableGoals: FitnessGoal[];
  isRecoveryOrRest: boolean;
}

export interface ActiveDailyMissionState {
  missionId: string;
  status: MissionLifecycleStatus;
  swappedOnce: boolean;
  previousMissionId?: string;
}

export interface RestPassGrantRecord {
  id: string;
  memberId: string;
  grantedBy: string;
  reason: string;
  amount: number;
  grantedAt: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  milestoneDays?: number;
  earned: boolean;
  earnedDate?: string;
}

export interface StreakRuleConfig {
  startingRestPasses: number;
  milestoneDaysForPass: number;
  maxRestPassBalance: number;
  minMealsForStreak: number;
  allowRestDayCheckin: boolean;
  allowMissionForStreak: boolean;
}

export interface MemberStreakState {
  currentStreak: number;
  longestStreak: number;
  restPassBalance: number;
  status: StreakStatus;
  restDayCheckedInToday: boolean;
  completedMissionsCount: number;
  swappedMissionsCount: number;
  skippedMissionsCount: number;
  restPassHistory: RestPassGrantRecord[];
}

export interface DayActionSnapshot {
  workoutCompleted: boolean;
  mealsCompletedCount: number;
  missionCompleted: boolean;
  isScheduledRestDay: boolean;
  restDayCheckedIn: boolean;
}
