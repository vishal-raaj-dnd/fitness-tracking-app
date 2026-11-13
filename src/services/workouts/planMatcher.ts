import type { ApprovedWorkoutPlan, OnboardingDataModel } from '../../types/onboarding';

/**
 * Pure compatibility matcher for Step 08.
 * Strictly returns only Pugal-approved plans matching the member's profile attributes:
 * - Fitness goal
 * - Experience level
 * - Workout location (Home / Gym)
 * - Available workout days (3, 4, 5, 6-day split)
 * - Preferred workout time
 *
 * Never invents or generates unapproved workout plans.
 */
export function findCompatibleApprovedPlans(
  library: ApprovedWorkoutPlan[],
  fitnessInfo: OnboardingDataModel['fitness_information']
): ApprovedWorkoutPlan[] {
  const {
    fitness_goal,
    experience_level,
    workout_location,
    available_workout_days,
    preferred_workout_time,
  } = fitnessInfo;

  if (
    !fitness_goal ||
    !experience_level ||
    !workout_location ||
    !available_workout_days ||
    !preferred_workout_time
  ) {
    return [];
  }

  return library.filter(
    (plan) =>
      plan.splitDays === available_workout_days &&
      plan.locations.includes(workout_location) &&
      plan.experienceLevels.includes(experience_level) &&
      plan.goals.includes(fitness_goal) &&
      plan.preferredTimes.includes(preferred_workout_time)
  );
}

/**
 * Computes a clean, non-prescriptive physical summary without altering user's entered numbers.
 */
export function computePhysicalSummary(
  heightCmRaw: string,
  currentWeightRaw: string,
  targetWeightRaw: string
): {
  valid: boolean;
  bmi: number | null;
  deltaKg: number | null;
} {
  const h = Number(heightCmRaw);
  const cw = Number(currentWeightRaw);
  const tw = Number(targetWeightRaw);
  if (
    !heightCmRaw.trim() ||
    !currentWeightRaw.trim() ||
    !targetWeightRaw.trim() ||
    Number.isNaN(h) ||
    Number.isNaN(cw) ||
    Number.isNaN(tw) ||
    h < 100 ||
    cw <= 0 ||
    tw <= 0
  ) {
    return { valid: false, bmi: null, deltaKg: null };
  }
  const heightM = h / 100;
  const bmi = Number((cw / (heightM * heightM)).toFixed(1));
  const deltaKg = Number((tw - cw).toFixed(1));
  return { valid: true, bmi, deltaKg };
}

/**
 * Validates each onboarding stage (1-indexed 1..9) returning an error message or null when valid.
 */
export function validateOnboardingStage(
  stage: number,
  data: OnboardingDataModel
): string | null {
  if (stage === 1) {
    const p = data.personal_information;
    if (!p.full_name.trim()) return 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (p.phone.trim().length < 7) return 'Please enter a valid phone number.';
    if (!p.date_of_birth.trim()) return 'Please select your date of birth.';
    return null;
  }

  if (stage === 2) {
    const ph = data.physical_information;
    const h = Number(ph.height_cm);
    const cw = Number(ph.current_weight_kg);
    const tw = Number(ph.target_weight_kg);
    if (!ph.height_cm.trim() || Number.isNaN(h) || h < 120 || h > 240) {
      return 'Enter your height in centimetres (120–240 cm).';
    }
    if (!ph.current_weight_kg.trim() || Number.isNaN(cw) || cw < 30 || cw > 250) {
      return 'Enter your current weight in kilograms (30–250 kg).';
    }
    if (!ph.target_weight_kg.trim() || Number.isNaN(tw) || tw < 30 || tw > 250) {
      return 'Enter your target weight in kilograms (30–250 kg).';
    }
    return null;
  }

  if (stage === 3) {
    const f = data.fitness_information;
    if (!f.fitness_goal) return 'Select your primary fitness goal.';
    if (!f.experience_level) return 'Select your current training experience level.';
    return null;
  }

  if (stage === 4) {
    const f = data.fitness_information;
    if (!f.workout_location) return 'Select where you will train (Home or Gym).';
    if (!f.available_workout_days) return 'Select how many days per week you can train.';
    if (!f.preferred_workout_time) return 'Select your preferred workout time.';
    if (f.preferred_mission_types.length === 0) {
      return 'Select at least one preferred Daily Mission type.';
    }
    return null;
  }

  if (stage === 5) {
    const n = data.nutrition_information;
    if (!n.dietary_preference) return 'Select your dietary preference.';
    if (!n.meal_frequency) return 'Select your preferred meal frequency.';
    if (n.food_preferences.length === 0) {
      return 'Select at least one food preference so your meal plan fits your palate.';
    }
    return null;
  }

  if (stage === 6) {
    if (!data.health_information.consent_status) {
      return 'Explicit consent is required before saving your health screening information.';
    }
    return null;
  }

  return null;
}
