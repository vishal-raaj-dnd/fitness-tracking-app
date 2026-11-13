import React from 'react';
import {
  Building2,
  Home,
  Sun,
  Sunset,
  Moon,
  Footprints,
  Sparkles,
  Dumbbell,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import type {
  OnboardingDataModel,
  OnboardingLocation,
  OnboardingMissionType,
  PreferredTimeSlot,
  WorkoutDaysCount,
} from '../../types/onboarding';

interface Step04WorkoutPrefsProps {
  value: OnboardingDataModel['fitness_information'];
  onChange: (next: OnboardingDataModel['fitness_information']) => void;
}

const LOCATION_OPTIONS: {
  id: OnboardingLocation;
  title: string;
  description: string;
  icon: React.FC<{ className?: string; strokeWidth?: number }>;
}[] = [
  {
    id: 'gym',
    title: 'Gym',
    description: 'Full access to barbells, dumbbells, cables, and machines.',
    icon: Building2,
  },
  {
    id: 'home',
    title: 'Home',
    description: 'Train from home using dumbbells, kettlebells, or bodyweight.',
    icon: Home,
  },
];

const DAY_COUNTS: { count: WorkoutDaysCount; subtitle: string }[] = [
  { count: 3, subtitle: 'Full-body rhythm' },
  { count: 4, subtitle: 'Upper / Lower' },
  { count: 5, subtitle: 'Balanced hybrid' },
  { count: 6, subtitle: 'SHRED flagship' },
];

const TIME_SLOTS: {
  id: PreferredTimeSlot;
  windowLabel: string;
  icon: React.FC<{ className?: string; strokeWidth?: number }>;
}[] = [
  { id: 'Morning', windowLabel: '05:30 – 10:30', icon: Sun },
  { id: 'Afternoon', windowLabel: '12:00 – 16:30', icon: Sunset },
  { id: 'Evening', windowLabel: '17:00 – 21:30', icon: Moon },
];

const MISSION_TYPES: {
  id: OnboardingMissionType;
  label: string;
  hint: string;
  icon: React.FC<{ className?: string; strokeWidth?: number }>;
}[] = [
  { id: 'Mobility', label: 'Mobility', hint: 'Joint flow & posture reset', icon: Sparkles },
  { id: 'Walk', label: 'Walk', hint: 'Zone 2 step bursts', icon: Footprints },
  { id: 'Workout', label: 'Workout', hint: 'Short conditioning finishers', icon: Dumbbell },
  { id: 'Recovery', label: 'Recovery', hint: 'Breathing & hydration habits', icon: HeartHandshake },
];

export const Step04WorkoutPrefs: React.FC<Step04WorkoutPrefsProps> = ({ value, onChange }) => {
  const toggleMissionType = (mission: OnboardingMissionType) => {
    const exists = value.preferred_mission_types.includes(mission);
    onChange({
      ...value,
      preferred_mission_types: exists
        ? value.preferred_mission_types.filter((m) => m !== mission)
        : [...value.preferred_mission_types, mission],
    });
  };

  return (
    <div className="space-y-6">
      {/* Workout Location */}
      <div>
        <p className="text-xs font-medium text-[#9BA1A6] mb-3">Workout Location</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LOCATION_OPTIONS.map(({ id, title, description, icon: Icon }) => {
            const active = value.workout_location === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...value, workout_location: id })}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  active
                    ? 'bg-[#202321] border-[#D4FF1A] text-white'
                    : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    active ? 'bg-[#D4FF1A] text-black' : 'bg-[#111111] text-[#D4FF1A]'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-semibold text-white">{title}</span>
                    {active && <CheckCircle2 className="w-4 h-4 text-[#D4FF1A]" />}
                  </div>
                  <p className="text-xs text-[#9BA1A6] mt-1 leading-relaxed">{description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Workout Days */}
      <div>
        <p className="text-xs font-medium text-[#9BA1A6] mb-3">Available Workout Days</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {DAY_COUNTS.map(({ count, subtitle }) => {
            const active = value.available_workout_days === count;
            return (
              <button
                key={count}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...value, available_workout_days: count })}
                className={`p-3.5 rounded-2xl border text-left transition-all min-h-[72px] ${
                  active
                    ? 'bg-[#202321] border-[#D4FF1A] text-white'
                    : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                }`}
              >
                <span className="font-display text-lg font-bold text-white tabular-nums block">
                  {count} days
                </span>
                <span className="text-[11px] text-[#8A8F94] block mt-0.5">{subtitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Workout Time */}
      <div>
        <p className="text-xs font-medium text-[#9BA1A6] mb-3">Preferred Workout Time</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {TIME_SLOTS.map(({ id, windowLabel, icon: Icon }) => {
            const active = value.preferred_workout_time === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...value, preferred_workout_time: id })}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 min-h-[60px] ${
                  active
                    ? 'bg-[#202321] border-[#D4FF1A] text-white'
                    : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${active ? 'text-[#D4FF1A]' : 'text-[#8A8F94]'}`}
                />
                <div>
                  <span className="text-sm font-semibold text-white block">{id}</span>
                  <span className="text-[11px] text-[#8A8F94] tabular-nums">{windowLabel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Mission Types (Multi-Select) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-[#9BA1A6]">
            Preferred Daily Mission Types (Select one or more)
          </p>
          <span className="text-[11px] text-[#8A8F94] tabular-nums">
            {value.preferred_mission_types.length} selected
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {MISSION_TYPES.map(({ id, label, hint, icon: Icon }) => {
            const active = value.preferred_mission_types.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleMissionType(id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 min-h-[58px] ${
                  active
                    ? 'bg-[#202321] border-[#D4FF1A] text-white'
                    : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${active ? 'text-[#D4FF1A]' : 'text-[#8A8F94]'}`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-white block">{label}</span>
                  <span className="text-[11px] text-[#8A8F94] block truncate">{hint}</span>
                </div>
                {active && <CheckCircle2 className="w-4 h-4 text-[#D4FF1A] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
