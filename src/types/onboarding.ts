import type {
  DietaryPreference,
  ExperienceLevel,
  FitnessGoal,
  MissionCategory,
  SafetyRestriction,
  WorkoutDay,
} from './index';
import type { HydrationProfileBaseline } from './hydration';

export type OnboardingLocation = 'home' | 'gym';
export type WorkoutDaysCount = 3 | 4 | 5 | 6;
export type PreferredTimeSlot = 'Morning' | 'Afternoon' | 'Evening';
export type OnboardingMissionType = Extract<
  MissionCategory,
  'Mobility' | 'Walk' | 'Workout' | 'Recovery'
>;
export type OnboardingDietPreference = Extract<
  DietaryPreference,
  'vegetarian' | 'non_vegetarian' | 'eggetarian'
>;

export type DiabetesStatus = 'not_applicable' | 'type_1' | 'type_2';
export type PcosStatus = 'not_applicable' | 'yes' | 'no';
export type GenderOption = '' | 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';

export type PlanAssignmentStatus =
  | 'unassigned'
  | 'selected_approved'
  | 'pending_coach_approval'
  | 'pending_coach_assignment';

export interface OnboardingDataModel {
  personal_information: {
    full_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    gender: GenderOption;
    profile_photo: string; // Data URL or empty string
  };
  physical_information: {
    height_cm: string;
    current_weight_kg: string;
    target_weight_kg: string;
  };
  fitness_information: {
    fitness_goal: FitnessGoal | '';
    experience_level: ExperienceLevel | '';
    workout_location: OnboardingLocation | '';
    available_workout_days: WorkoutDaysCount | null;
    preferred_workout_time: PreferredTimeSlot | '';
    preferred_mission_types: OnboardingMissionType[];
  };
  nutrition_information: {
    dietary_preference: OnboardingDietPreference | '';
    meal_frequency: 3 | 4 | 5 | null;
    food_preferences: string[];
  };
  hydration_information: HydrationProfileBaseline;
  health_information: {
    diabetes_status: DiabetesStatus;
    pcos_status: PcosStatus;
    other_conditions: string;
    medications: string;
    exercise_restrictions: SafetyRestriction[];
    custom_restriction_note: string;
    allergies: string;
    dietary_restrictions: string;
    consent_status: boolean;
  };
  workout_assignment: {
    selected_plan_id: string | null;
    selected_split: string | null;
    assignment_status: PlanAssignmentStatus;
  };
}

export interface ApprovedWorkoutPlan {
  id: string;
  planName: string;
  approvedBy: string; // e.g., "Pugal-Approved"
  splitDays: WorkoutDaysCount;
  splitLabel: string; // e.g., "4-Day Upper / Lower"
  locations: OnboardingLocation[];
  experienceLevels: ExperienceLevel[];
  goals: FitnessGoal[];
  preferredTimes: PreferredTimeSlot[];
  estimatedMinutes: number;
  shortDescription: string;
  overview: string;
  highlights: string[];
  heroImageUrl: string;
  requiresCoachApproval: boolean;
  weeklySchedule: WorkoutDay[];
}

export function createEmptyOnboardingData(): OnboardingDataModel {
  return {
    personal_information: {
      full_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      profile_photo: '',
    },
    physical_information: {
      height_cm: '',
      current_weight_kg: '',
      target_weight_kg: '',
    },
    fitness_information: {
      fitness_goal: '',
      experience_level: '',
      workout_location: '',
      available_workout_days: null,
      preferred_workout_time: '',
      preferred_mission_types: [],
    },
    nutrition_information: {
      dietary_preference: '',
      meal_frequency: null,
      food_preferences: [],
    },
    hydration_information: {
      average_daily_water_intake: '',
      drinking_frequency: '',
      bottle_capacity_ml: null,
      reminder_preference: '',
    },
    health_information: {
      diabetes_status: 'not_applicable',
      pcos_status: 'not_applicable',
      other_conditions: '',
      medications: '',
      exercise_restrictions: [],
      custom_restriction_note: '',
      allergies: '',
      dietary_restrictions: '',
      consent_status: false,
    },
    workout_assignment: {
      selected_plan_id: null,
      selected_split: null,
      assignment_status: 'unassigned',
    },
  };
}
