import React from 'react';
import { ArrowRight, Droplets, Edit3, Lock, User } from 'lucide-react';
import type { OnboardingDataModel } from '../../types/onboarding';
import { computePhysicalSummary } from '../../services/workouts/planMatcher';
import {
  BOTTLE_CAPACITY_LABELS,
  DRINKING_FREQUENCY_LABELS,
  HYDRATION_INTAKE_LABELS,
  REMINDER_PREFERENCE_LABELS,
} from '../../services/hydration/hydrationTracker';

interface Step07ReviewProps {
  data: OnboardingDataModel;
  onEditStep: (stepNumber: number, scrollTargetId?: string) => void;
  onContinueToPlans: () => void;
}

const GOAL_LABELS: Record<string, string> = {
  fat_loss: 'Fat Loss',
  lean_recomp: 'Lean Body Recomposition',
  muscle_gain: 'Strength & Muscle Gain',
  athletic_conditioning: 'Athletic Conditioning',
};

const DIET_LABELS: Record<string, string> = {
  vegetarian: 'Vegetarian',
  non_vegetarian: 'Non-vegetarian',
  eggetarian: 'Eggetarian',
};

const GENDER_LABELS: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  non_binary: 'Non-binary',
  prefer_not_to_say: 'Prefer not to say',
};

export const Step07Review: React.FC<Step07ReviewProps> = ({
  data,
  onEditStep,
  onContinueToPlans,
}) => {
  const {
    personal_information: p,
    physical_information: ph,
    fitness_information: f,
    nutrition_information: n,
    hydration_information: hy,
    health_information: h,
  } = data;

  const summary = computePhysicalSummary(
    ph.height_cm,
    ph.current_weight_kg,
    ph.target_weight_kg
  );

  const initials = p.full_name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const healthItems = [
    h.diabetes_status !== 'not_applicable'
      ? `Diabetes (${h.diabetes_status === 'type_1' ? 'Type 1' : 'Type 2'})`
      : null,
    h.pcos_status === 'yes' ? 'PCOS reported' : null,
    h.other_conditions.trim() || null,
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      {/* A. Personal Information */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#191B1D]/70 border border-[#292C2E] space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-semibold text-white">
            A · Personal Information
          </h2>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            aria-label="Edit Personal Information"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[36px]"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#D4FF1A]" />
            <span>Edit</span>
          </button>
        </div>

        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#111111] border border-[#292C2E] flex items-center justify-center shrink-0">
            {p.profile_photo ? (
              <img
                src={p.profile_photo}
                alt={p.full_name}
                className="w-full h-full object-cover"
              />
            ) : initials ? (
              <span className="font-display text-sm font-bold text-[#D4FF1A]">{initials}</span>
            ) : (
              <User className="w-5 h-5 text-[#6B6B6B]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{p.full_name}</p>
            <p className="text-xs text-[#9BA1A6] truncate">{p.email}</p>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#292C2E]/80 text-xs">
          <div>
            <dt className="text-[#8A8F94]">Phone</dt>
            <dd className="text-white font-medium tabular-nums mt-0.5">{p.phone}</dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Date of Birth</dt>
            <dd className="text-white font-medium tabular-nums mt-0.5">{p.date_of_birth}</dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Gender</dt>
            <dd className="text-white font-medium mt-0.5">
              {p.gender ? GENDER_LABELS[p.gender] : 'Not specified'}
            </dd>
          </div>
        </dl>
      </section>

      {/* B. Physical Metrics */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#191B1D]/70 border border-[#292C2E] space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-semibold text-white">B · Physical Metrics</h2>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            aria-label="Edit Physical Metrics"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[36px]"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#D4FF1A]" />
            <span>Edit</span>
          </button>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <dt className="text-[#8A8F94]">Height</dt>
            <dd className="text-white font-semibold tabular-nums mt-0.5">{ph.height_cm} cm</dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Current Weight</dt>
            <dd className="text-white font-semibold tabular-nums mt-0.5">
              {ph.current_weight_kg} kg
            </dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Target Weight</dt>
            <dd className="text-[#D4FF1A] font-semibold tabular-nums mt-0.5">
              {ph.target_weight_kg} kg
            </dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Baseline BMI</dt>
            <dd className="text-white font-semibold tabular-nums mt-0.5">
              {summary.bmi ?? '—'}
            </dd>
          </div>
        </dl>
      </section>

      {/* C. Fitness Profile & Preferences */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#191B1D]/70 border border-[#292C2E] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-sm font-semibold text-white">
            C · Fitness Profile &amp; Preferences
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="px-3 py-1.5 rounded-lg bg-[#111111] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[36px] whitespace-nowrap"
            >
              Edit Goal
            </button>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              aria-label="Edit Workout Preferences"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[36px] whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#D4FF1A]" />
              <span>Edit Schedule</span>
            </button>
          </div>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <dt className="text-[#8A8F94]">Primary Goal</dt>
            <dd className="text-white font-medium mt-0.5">
              {GOAL_LABELS[f.fitness_goal] ?? f.fitness_goal}
            </dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Experience</dt>
            <dd className="text-white font-medium capitalize mt-0.5">{f.experience_level}</dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Location</dt>
            <dd className="text-white font-medium capitalize mt-0.5">{f.workout_location}</dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Weekly Split</dt>
            <dd className="text-white font-medium tabular-nums mt-0.5">
              {f.available_workout_days} days / week
            </dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Preferred Time</dt>
            <dd className="text-white font-medium mt-0.5">{f.preferred_workout_time}</dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Mission Focus</dt>
            <dd className="text-white font-medium mt-0.5">
              {f.preferred_mission_types.join(' · ')}
            </dd>
          </div>
        </dl>
      </section>

      {/* D. Nutrition Preferences */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#191B1D]/70 border border-[#292C2E] space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-semibold text-white">
            D · Nutrition Preferences
          </h2>
          <button
            type="button"
            onClick={() => onEditStep(5)}
            aria-label="Edit Nutrition Preferences"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[36px]"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#D4FF1A]" />
            <span>Edit</span>
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <dt className="text-[#8A8F94]">Dietary Pattern</dt>
            <dd className="text-white font-medium mt-0.5">
              {DIET_LABELS[n.dietary_preference] ?? n.dietary_preference}
            </dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Meal Frequency</dt>
            <dd className="text-white font-medium tabular-nums mt-0.5">
              {n.meal_frequency} meals / day
            </dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Food Preferences</dt>
            <dd className="text-white font-medium mt-0.5">{n.food_preferences.join(', ')}</dd>
          </div>
        </dl>
      </section>

      {/* Hydration Profile */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#191B1D]/70 border border-[#292C2E] space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-3.5 h-3.5 text-[#D4FF1A]" />
            <h2 className="font-display text-sm font-semibold text-white">Hydration Profile</h2>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(5, 'hydration-habits-section')}
            aria-label="Edit Hydration Profile"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[36px]"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#D4FF1A]" />
            <span>Edit</span>
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <dt className="text-[#8A8F94]">Average Daily Water Intake</dt>
            <dd className="text-white font-medium tabular-nums mt-0.5">
              {hy.average_daily_water_intake
                ? HYDRATION_INTAKE_LABELS[hy.average_daily_water_intake]
                : 'Not specified'}
            </dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Drinking Frequency</dt>
            <dd className="text-white font-medium mt-0.5">
              {hy.drinking_frequency
                ? DRINKING_FREQUENCY_LABELS[hy.drinking_frequency]
                : 'Not specified'}
            </dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Usual Bottle Capacity</dt>
            <dd className="text-white font-medium tabular-nums mt-0.5">
              {hy.bottle_capacity_ml !== null
                ? BOTTLE_CAPACITY_LABELS[String(hy.bottle_capacity_ml)]
                : 'Not specified'}
            </dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Reminder Preference</dt>
            <dd className="text-white font-medium mt-0.5">
              {hy.reminder_preference
                ? REMINDER_PREFERENCE_LABELS[hy.reminder_preference]
                : 'Not specified'}
            </dd>
          </div>
        </dl>
      </section>

      {/* E. Health & Safety Summary (Privacy-Conscious) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#191B1D]/70 border border-[#292C2E] space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#D4FF1A]" />
            <h2 className="font-display text-sm font-semibold text-white">
              E · Health &amp; Safety Summary
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(6)}
            aria-label="Edit Health Information"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[36px]"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#D4FF1A]" />
            <span>Edit</span>
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <dt className="text-[#8A8F94]">Health Notes</dt>
            <dd className="text-white font-medium mt-0.5">
              {healthItems.length > 0 ? healthItems.join(' · ') : 'None flagged'}
            </dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Exercise Restrictions</dt>
            <dd className="text-white font-medium capitalize mt-0.5">
              {h.exercise_restrictions.length > 0
                ? h.exercise_restrictions.map((r) => r.replace(/_/g, ' ')).join(', ')
                : 'None flagged'}
            </dd>
          </div>
          <div>
            <dt className="text-[#8A8F94]">Coach Privacy Consent</dt>
            <dd className="text-[#D4FF1A] font-medium mt-0.5">
              {h.consent_status ? 'Explicitly Confirmed' : 'Pending'}
            </dd>
          </div>
        </dl>
      </section>

      {/* Primary & Secondary CTAs */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onEditStep(1)}
          className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#3E4246] text-sm font-medium text-white transition-colors min-h-[48px]"
        >
          Edit Information
        </button>

        <button
          type="button"
          onClick={onContinueToPlans}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] active:scale-[0.98] transition-all min-h-[48px]"
        >
          <span>Continue to Workout Plan</span>
          <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
};
