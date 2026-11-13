import React from 'react';
import { Flame, Dumbbell, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import type { ExperienceLevel, FitnessGoal } from '../../types';
import type { OnboardingDataModel } from '../../types/onboarding';

interface Step03GoalsProps {
  value: OnboardingDataModel['fitness_information'];
  onChange: (next: OnboardingDataModel['fitness_information']) => void;
}

const GOAL_CARDS: {
  id: FitnessGoal;
  title: string;
  description: string;
  icon: React.FC<{ className?: string; strokeWidth?: number }>;
}[] = [
  {
    id: 'fat_loss',
    title: 'Fat Loss',
    description: 'Strip body fat steadily while preserving lean strength across 90 days.',
    icon: Flame,
  },
  {
    id: 'lean_recomp',
    title: 'Lean Body Recomposition',
    description: 'Tighten waist measurements while building balanced muscle definition.',
    icon: RefreshCw,
  },
  {
    id: 'muscle_gain',
    title: 'Strength & Muscle Gain',
    description: 'Progressive resistance training focused on hypertrophy and compound lifts.',
    icon: Dumbbell,
  },
  {
    id: 'athletic_conditioning',
    title: 'Athletic Conditioning',
    description: 'Improve work capacity, mobility, and high-output stamina.',
    icon: Zap,
  },
];

const EXPERIENCE_CARDS: {
  id: ExperienceLevel;
  title: string;
  description: string;
}[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'New to structured training or returning after 6+ months away.',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Consistent with compound lifts and weekly splits for 6–24 months.',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: '2+ years of disciplined strength training and recovery management.',
  },
];

export const Step03Goals: React.FC<Step03GoalsProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Fitness Goal */}
      <div>
        <p className="text-xs font-medium text-[#9BA1A6] mb-3">Primary Fitness Goal</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GOAL_CARDS.map(({ id, title, description, icon: Icon }) => {
            const active = value.fitness_goal === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...value, fitness_goal: id })}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 min-h-[112px] ${
                  active
                    ? 'bg-[#202321] border-[#D4FF1A] text-white'
                    : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      active ? 'bg-[#D4FF1A] text-black' : 'bg-[#111111] text-[#D4FF1A]'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  {active && <CheckCircle2 className="w-4 h-4 text-[#D4FF1A]" strokeWidth={2.25} />}
                </div>
                <div>
                  <p className="font-display text-sm sm:text-base font-semibold text-white">
                    {title}
                  </p>
                  <p className="text-xs text-[#9BA1A6] mt-1 leading-relaxed">{description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fitness Experience */}
      <div>
        <p className="text-xs font-medium text-[#9BA1A6] mb-3">Fitness Experience</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {EXPERIENCE_CARDS.map(({ id, title, description }) => {
            const active = value.experience_level === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...value, experience_level: id })}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  active
                    ? 'bg-[#202321] border-[#D4FF1A] text-white'
                    : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-white">{title}</span>
                  {active && <CheckCircle2 className="w-4 h-4 text-[#D4FF1A]" strokeWidth={2.25} />}
                </div>
                <p className="text-xs text-[#9BA1A6] leading-relaxed">{description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
