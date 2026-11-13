import React, { useMemo } from 'react';
import { Ruler, Scale, Target } from 'lucide-react';
import type { OnboardingDataModel } from '../../types/onboarding';
import { computePhysicalSummary } from '../../services/workouts/planMatcher';

interface Step02PhysicalProps {
  value: OnboardingDataModel['physical_information'];
  onChange: (next: OnboardingDataModel['physical_information']) => void;
}

export const Step02Physical: React.FC<Step02PhysicalProps> = ({ value, onChange }) => {
  const summary = useMemo(
    () =>
      computePhysicalSummary(
        value.height_cm,
        value.current_weight_kg,
        value.target_weight_kg
      ),
    [value.height_cm, value.current_weight_kg, value.target_weight_kg]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Height */}
        <div>
          <label htmlFor="ob-height-cm" className="block text-xs font-medium text-[#9BA1A6] mb-1.5">
            Height
          </label>
          <div className="relative flex items-center">
            <Ruler className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 pointer-events-none" />
            <input
              id="ob-height-cm"
              type="number"
              inputMode="decimal"
              min={120}
              max={240}
              placeholder="175"
              value={value.height_cm}
              onChange={(e) => onChange({ ...value, height_cm: e.target.value })}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white placeholder-[#6B6B6B] tabular-nums focus:outline-none focus:border-[#D4FF1A] min-h-[48px]"
            />
            <span className="absolute right-3.5 text-xs font-medium text-[#8A8F94] pointer-events-none">
              cm
            </span>
          </div>
        </div>

        {/* Current Weight */}
        <div>
          <label
            htmlFor="ob-current-weight"
            className="block text-xs font-medium text-[#9BA1A6] mb-1.5"
          >
            Current Weight
          </label>
          <div className="relative flex items-center">
            <Scale className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 pointer-events-none" />
            <input
              id="ob-current-weight"
              type="number"
              inputMode="decimal"
              step="0.1"
              min={30}
              max={250}
              placeholder="82.0"
              value={value.current_weight_kg}
              onChange={(e) => onChange({ ...value, current_weight_kg: e.target.value })}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white placeholder-[#6B6B6B] tabular-nums focus:outline-none focus:border-[#D4FF1A] min-h-[48px]"
            />
            <span className="absolute right-3.5 text-xs font-medium text-[#8A8F94] pointer-events-none">
              kg
            </span>
          </div>
        </div>

        {/* Target Weight */}
        <div>
          <label
            htmlFor="ob-target-weight"
            className="block text-xs font-medium text-[#9BA1A6] mb-1.5"
          >
            Target Weight
          </label>
          <div className="relative flex items-center">
            <Target className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 pointer-events-none" />
            <input
              id="ob-target-weight"
              type="number"
              inputMode="decimal"
              step="0.1"
              min={30}
              max={250}
              placeholder="75.0"
              value={value.target_weight_kg}
              onChange={(e) => onChange({ ...value, target_weight_kg: e.target.value })}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white placeholder-[#6B6B6B] tabular-nums focus:outline-none focus:border-[#D4FF1A] min-h-[48px]"
            />
            <span className="absolute right-3.5 text-xs font-medium text-[#8A8F94] pointer-events-none">
              kg
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Visual Summary */}
      <div className="p-5 rounded-2xl bg-[#191B1D]/70 border border-[#292C2E] space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-[#8A8F94]">Baseline Snapshot</p>
          <span className="text-[11px] text-[#6B6B6B]">
            Values remain exactly as entered
          </span>
        </div>

        {summary.valid && summary.bmi !== null && summary.deltaKg !== null ? (
          <div className="grid grid-cols-3 gap-4 pt-1">
            <div>
              <p className="text-xs text-[#8A8F94]">Height</p>
              <p className="font-display text-lg sm:text-xl font-bold text-white tabular-nums mt-0.5">
                {value.height_cm} cm
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8A8F94]">90-Day Target Shift</p>
              <p className="font-display text-lg sm:text-xl font-bold text-[#D4FF1A] tabular-nums mt-0.5">
                {summary.deltaKg > 0 ? `+${summary.deltaKg}` : summary.deltaKg} kg
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8A8F94]">Starting BMI</p>
              <p className="font-display text-lg sm:text-xl font-bold text-white tabular-nums mt-0.5">
                {summary.bmi}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#8A8F94]">
            Enter your height, current weight, and target weight above to preview your Day 1
            baseline.
          </p>
        )}
      </div>
    </div>
  );
};
