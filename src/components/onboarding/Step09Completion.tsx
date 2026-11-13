import React from 'react';
import { ArrowRight, CheckCircle2, Clock, User } from 'lucide-react';
import type { ApprovedWorkoutPlan, OnboardingDataModel } from '../../types/onboarding';

interface Step09CompletionProps {
  data: OnboardingDataModel;
  selectedPlan: ApprovedWorkoutPlan | null;
  onEnterUprise: () => void;
}

const GOAL_LABELS: Record<string, string> = {
  fat_loss: 'Fat Loss',
  lean_recomp: 'Lean Body Recomposition',
  muscle_gain: 'Strength & Muscle Gain',
  athletic_conditioning: 'Athletic Conditioning',
};

export const Step09Completion: React.FC<Step09CompletionProps> = ({
  data,
  selectedPlan,
  onEnterUprise,
}) => {
  const { personal_information: p, fitness_information: f, workout_assignment: wa } = data;

  const initials = p.full_name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const splitSummary = selectedPlan
    ? selectedPlan.splitLabel
    : wa.assignment_status === 'pending_coach_assignment'
      ? 'Pending Coach Assignment'
      : 'Custom Split Queued';

  const statusNote =
    wa.assignment_status === 'pending_coach_approval'
      ? 'Selected · Pending Coach Approval'
      : wa.assignment_status === 'pending_coach_assignment'
        ? 'Pending Coach Assignment'
        : selectedPlan
          ? `${selectedPlan.approvedBy} · Ready Day 1`
          : 'Ready Day 1';

  return (
    <div className="space-y-6">
      {/* Identity & Headline */}
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#191B1D] border-2 border-[#D4FF1A] flex items-center justify-center">
            {p.profile_photo ? (
              <img
                src={p.profile_photo}
                alt={p.full_name}
                className="w-full h-full object-cover"
              />
            ) : initials ? (
              <span className="font-display text-2xl font-bold text-[#D4FF1A]">{initials}</span>
            ) : (
              <User className="w-8 h-8 text-[#D4FF1A]" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#D4FF1A] text-black flex items-center justify-center border-2 border-[#111111]">
            <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            You&apos;re ready to rise.
          </h2>
          <p className="text-sm text-[#9BA1A6] leading-relaxed">
            Your fitness profile is ready. Your 90-day journey starts now.
          </p>
        </div>
      </div>

      {/* Member & Programme Summary */}
      <div className="rounded-2xl bg-[#191B1D]/80 border border-[#292C2E] divide-y divide-[#292C2E] text-sm">
        <div className="px-5 py-3.5 flex items-center justify-between gap-4">
          <span className="text-[#8A8F94]">Member</span>
          <span className="text-white font-semibold truncate">{p.full_name}</span>
        </div>
        <div className="px-5 py-3.5 flex items-center justify-between gap-4">
          <span className="text-[#8A8F94]">Primary Goal</span>
          <span className="text-white font-medium">
            {GOAL_LABELS[f.fitness_goal] ?? f.fitness_goal}
          </span>
        </div>
        <div className="px-5 py-3.5 flex items-center justify-between gap-4">
          <span className="text-[#8A8F94]">Workout Location</span>
          <span className="text-white font-medium capitalize">{f.workout_location}</span>
        </div>
        <div className="px-5 py-3.5 flex items-center justify-between gap-4">
          <span className="text-[#8A8F94]">Selected Workout Split</span>
          <span className="text-white font-medium text-right">{splitSummary}</span>
        </div>
        <div className="px-5 py-3.5 flex items-center justify-between gap-4">
          <span className="text-[#8A8F94]">Plan Status</span>
          <span className="inline-flex items-center gap-1.5 text-[#D4FF1A] font-medium text-right">
            {wa.assignment_status !== 'selected_approved' && <Clock className="w-3.5 h-3.5" />}
            <span>{statusNote}</span>
          </span>
        </div>
        <div className="px-5 py-3.5 flex items-center justify-between gap-4">
          <span className="text-[#8A8F94]">Programme Duration</span>
          <span className="text-[#D4FF1A] font-semibold tabular-nums">90 days</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onEnterUprise}
        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#D4FF1A] text-black font-display text-base font-bold hover:bg-[#c5ee14] active:scale-[0.98] transition-all min-h-[54px]"
      >
        <span>Enter UPRISE</span>
        <ArrowRight className="w-5 h-5" strokeWidth={2.25} />
      </button>
    </div>
  );
};
