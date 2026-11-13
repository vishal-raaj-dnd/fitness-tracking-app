import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import type { ApprovedWorkoutPlan, OnboardingDataModel } from '../../types/onboarding';
import { PUGAL_APPROVED_PLANS } from '../../data/workouts/approvedPlans';
import { findCompatibleApprovedPlans } from '../../services/workouts/planMatcher';
import { SafeImage } from '../layout/SafeImage';

interface Step08WorkoutPlanProps {
  data: OnboardingDataModel;
  selectedPlanId: string | null;
  onSelectPlan: (plan: ApprovedWorkoutPlan | null) => void;
  onAdjustPreferences: () => void;
  onContinuePendingAssignment: () => void;
}

export const Step08WorkoutPlan: React.FC<Step08WorkoutPlanProps> = ({
  data,
  selectedPlanId,
  onSelectPlan,
  onAdjustPreferences,
  onContinuePendingAssignment,
}) => {
  const [inspectingPlanId, setInspectingPlanId] = useState<string | null>(null);

  const compatiblePlans = useMemo(
    () => findCompatibleApprovedPlans(PUGAL_APPROVED_PLANS, data.fitness_information),
    [data.fitness_information]
  );

  const inspectedPlan = useMemo(
    () => compatiblePlans.find((p) => p.id === inspectingPlanId) ?? null,
    [compatiblePlans, inspectingPlanId]
  );

  // Dedicated Plan Detail View
  if (inspectedPlan) {
    const trainingDays = inspectedPlan.weeklySchedule.filter((d) => !d.isRestDay);
    const restDaysCount = inspectedPlan.weeklySchedule.length - trainingDays.length;

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setInspectingPlanId(null)}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#9BA1A6] hover:text-white transition-colors min-h-[36px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Compatible Plans</span>
        </button>

        {/* Plan Overview Header */}
        <div className="rounded-2xl overflow-hidden bg-[#191B1D] border border-[#292C2E]">
          <div className="relative h-44 sm:h-52">
            <SafeImage
              src={inspectedPlan.heroImageUrl}
              alt={inspectedPlan.planName}
              fallbackTitle={inspectedPlan.planName}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(17,17,17,0.95) 100%)',
              }}
            />
            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-xs font-semibold text-[#D4FF1A]">
                {inspectedPlan.approvedBy} · {inspectedPlan.splitLabel}
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                {inspectedPlan.planName}
              </h2>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-[#D1D5DB] leading-relaxed">{inspectedPlan.overview}</p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#9BA1A6] tabular-nums pt-1">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Calendar className="w-3.5 h-3.5 text-[#D4FF1A]" />
                {trainingDays.length} training · {restDaysCount} rest days
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 text-[#D4FF1A]" />~{inspectedPlan.estimatedMinutes} min
                / session
              </span>
            </div>

            {inspectedPlan.requiresCoachApproval && (
              <div className="p-3.5 rounded-xl bg-[#202321] border border-[#292C2E] flex items-start gap-2.5 text-xs text-[#D1D5DB]">
                <ShieldCheck className="w-4 h-4 text-[#D4FF1A] shrink-0 mt-0.5" />
                <span>
                  This split enters <strong className="text-white">Pending Coach Approval</strong>{' '}
                  so your assigned coach can validate load progression with your health profile.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 7-Day Weekly Schedule Breakdown */}
        <div className="space-y-3">
          <h3 className="font-display text-sm font-semibold text-white">
            Weekly Structure &amp; Exercise Preview
          </h3>

          <div className="space-y-2.5">
            {inspectedPlan.weeklySchedule.map((day) => (
              <div
                key={day.id}
                className="p-4 rounded-xl bg-[#191B1D]/70 border border-[#292C2E] space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-[#D4FF1A]">
                      {day.dayLabel} · {day.isRestDay ? 'Recovery / Rest' : 'Training Day'}
                    </p>
                    <p className="font-display text-sm font-semibold text-white mt-0.5">
                      {day.title}
                    </p>
                  </div>
                  <span className="text-xs text-[#8A8F94] tabular-nums shrink-0">
                    {day.durationMinutes > 0 ? `${day.durationMinutes} min` : 'Rest'}
                  </span>
                </div>

                {!day.isRestDay && day.exercises.length > 0 && (
                  <div className="pt-2 border-t border-[#292C2E]/80 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#9BA1A6]">
                    {day.exercises.map((ex) => (
                      <span key={ex.id} className="tabular-nums">
                        {ex.name} ({ex.sets}×{ex.reps})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setInspectingPlanId(null)}
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm font-medium text-white hover:border-[#3E4246] min-h-[48px]"
          >
            Back to Compare Plans
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectPlan(inspectedPlan);
              setInspectingPlanId(null);
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] min-h-[48px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Select This Plan</span>
          </button>
        </div>
      </div>
    );
  }

  // Empty Match Fallback — Never invent unapproved plans
  if (compatiblePlans.length === 0) {
    return (
      <div className="space-y-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#191B1D]/80 border border-[#292C2E] space-y-4">
          <div className="w-11 h-11 rounded-xl bg-[#202321] border border-[#292C2E] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#D4FF1A]" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-[#D4FF1A]">Coach Review Queued</p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              We&apos;re preparing the right plan for you.
            </h2>
            <p className="text-sm text-[#9BA1A6] leading-relaxed">
              No pre-approved Pugal template matched every combination of your selected location (
              <span className="text-white capitalize">
                {data.fitness_information.workout_location}
              </span>
              ),{' '}
              <span className="text-white">
                {data.fitness_information.available_workout_days}-day split
              </span>
              , and{' '}
              <span className="text-white capitalize">
                {data.fitness_information.experience_level}
              </span>{' '}
              level. We never generate unverified workout routines—your assigned coach will tailor
              and approve your programme shortly.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onContinuePendingAssignment}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] min-h-[48px]"
            >
              <span>Continue to Completion</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onAdjustPreferences}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#111111] border border-[#292C2E] hover:border-[#3E4246] text-sm font-medium text-white min-h-[48px]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D4FF1A]" />
              <span>Adjust Training Preferences</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compatible Approved Plans Selection
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#9BA1A6]">
        <span>
          Showing {compatiblePlans.length} Pugal-approved{' '}
          {compatiblePlans.length === 1 ? 'programme' : 'programmes'} matched to your{' '}
          <strong className="text-white capitalize">
            {data.fitness_information.workout_location}
          </strong>{' '}
          ·{' '}
          <strong className="text-white tabular-nums">
            {data.fitness_information.available_workout_days}-day
          </strong>{' '}
          profile
        </span>
      </div>

      <div className="space-y-4">
        {compatiblePlans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <article
              key={plan.id}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isSelected
                  ? 'bg-[#202321] border-[#D4FF1A]'
                  : 'bg-[#191B1D]/70 border-[#292C2E] hover:border-[#3E4246]'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12">
                <div className="sm:col-span-4 h-40 sm:h-auto relative">
                  <SafeImage
                    src={plan.heroImageUrl}
                    alt={plan.planName}
                    fallbackTitle={plan.planName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="sm:col-span-8 p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#D4FF1A]">{plan.approvedBy}</span>
                      <span className="text-[#8A8F94] tabular-nums">
                        {plan.splitDays} days/wk · ~{plan.estimatedMinutes} min
                      </span>
                    </div>

                    <h2 className="font-display text-lg font-bold text-white">{plan.planName}</h2>
                    <p className="text-xs sm:text-sm text-[#9BA1A6] leading-relaxed">
                      {plan.shortDescription}
                    </p>

                    {plan.requiresCoachApproval && (
                      <p className="text-xs text-[#D4FF1A] pt-1">
                        Requires coach sign-off after selection (Pending Coach Approval)
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#292C2E]">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan)}
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors min-h-[44px] ${
                        isSelected
                          ? 'bg-[#D4FF1A] text-black'
                          : 'bg-[#111111] border border-[#292C2E] text-white hover:border-[#D4FF1A]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <Dumbbell className="w-4 h-4 text-[#D4FF1A]" />
                          <span>Select Plan</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setInspectingPlanId(plan.id)}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#111111] border border-[#292C2E] hover:border-[#3E4246] text-xs sm:text-sm font-medium text-[#D1D5DB] hover:text-white transition-colors min-h-[44px]"
                    >
                      View Plan Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
