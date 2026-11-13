import React from 'react';
import { Lock, ShieldAlert, Check } from 'lucide-react';
import type { SafetyRestriction } from '../../types';
import type { DiabetesStatus, OnboardingDataModel, PcosStatus } from '../../types/onboarding';

interface Step06HealthProps {
  value: OnboardingDataModel['health_information'];
  onChange: (next: OnboardingDataModel['health_information']) => void;
}

const DIABETES_OPTIONS: { id: DiabetesStatus; label: string }[] = [
  { id: 'not_applicable', label: 'Not applicable' },
  { id: 'type_1', label: 'Type 1' },
  { id: 'type_2', label: 'Type 2' },
];

const PCOS_OPTIONS: { id: PcosStatus; label: string }[] = [
  { id: 'not_applicable', label: 'Not applicable' },
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
];

const EXERCISE_RESTRICTIONS: { id: SafetyRestriction; label: string }[] = [
  { id: 'knee_injury', label: 'Knee injury / sensitivity' },
  { id: 'lower_back_sensitivity', label: 'Lower back sensitivity' },
  { id: 'shoulder_impingement', label: 'Shoulder impingement' },
  { id: 'hypertension', label: 'Hypertension / blood pressure' },
];

export const Step06Health: React.FC<Step06HealthProps> = ({ value, onChange }) => {
  const toggleRestriction = (res: SafetyRestriction) => {
    const exists = value.exercise_restrictions.includes(res);
    onChange({
      ...value,
      exercise_restrictions: exists
        ? value.exercise_restrictions.filter((r) => r !== res)
        : [...value.exercise_restrictions, res],
    });
  };

  return (
    <div className="space-y-6">
      {/* Coach Explanation & Privacy Reassurance */}
      <div className="p-4 rounded-2xl bg-[#191B1D] border border-[#292C2E] space-y-2">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-[#D4FF1A] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
            This information helps your coach understand your requirements and ensure that your
            assigned fitness activities are appropriate.
          </p>
        </div>
        <div className="flex items-center gap-2 pl-7 text-[11px] text-[#8A8F94]">
          <Lock className="w-3.5 h-3.5 text-[#D4FF1A]" />
          <span>Strict confidentiality · Private to you and your assigned NXTGEN coach</span>
        </div>
      </div>

      {/* Diabetes & PCOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-medium text-[#9BA1A6] mb-2">Diabetes</p>
          <div className="grid grid-cols-3 gap-2">
            {DIABETES_OPTIONS.map((opt) => {
              const active = value.diabetes_status === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ ...value, diabetes_status: opt.id })}
                  className={`px-2.5 py-2.5 rounded-xl border text-xs font-medium transition-all min-h-[44px] ${
                    active
                      ? 'bg-[#202321] border-[#D4FF1A] text-white'
                      : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-[#9BA1A6] mb-2">PCOS</p>
          <div className="grid grid-cols-3 gap-2">
            {PCOS_OPTIONS.map((opt) => {
              const active = value.pcos_status === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ ...value, pcos_status: opt.id })}
                  className={`px-2.5 py-2.5 rounded-xl border text-xs font-medium transition-all min-h-[44px] ${
                    active
                      ? 'bg-[#202321] border-[#D4FF1A] text-white'
                      : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exercise Restrictions */}
      <div>
        <p className="text-xs font-medium text-[#9BA1A6] mb-2.5">
          Exercise Restrictions (Select any that apply)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {EXERCISE_RESTRICTIONS.map((item) => {
            const active = value.exercise_restrictions.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleRestriction(item.id)}
                className={`px-3.5 py-3 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all min-h-[44px] ${
                  active
                    ? 'bg-[#202321] border-[#D4FF1A] text-white'
                    : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {active && <Check className="w-4 h-4 text-[#D4FF1A] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Other Conditions & Medications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="ob-other-conditions"
            className="block text-xs font-medium text-[#9BA1A6] mb-1.5"
          >
            Other Diagnosed Conditions (Optional)
          </label>
          <input
            id="ob-other-conditions"
            type="text"
            placeholder="e.g. Thyroid, asthma, or none"
            value={value.other_conditions}
            onChange={(e) => onChange({ ...value, other_conditions: e.target.value })}
            className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#D4FF1A] min-h-[46px]"
          />
        </div>

        <div>
          <label
            htmlFor="ob-medications"
            className="block text-xs font-medium text-[#9BA1A6] mb-1.5"
          >
            Medications (Optional)
          </label>
          <input
            id="ob-medications"
            type="text"
            placeholder="Current daily medications, if any"
            value={value.medications}
            onChange={(e) => onChange({ ...value, medications: e.target.value })}
            className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#D4FF1A] min-h-[46px]"
          />
        </div>
      </div>

      {/* Allergies & Dietary Restrictions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="ob-allergies"
            className="block text-xs font-medium text-[#9BA1A6] mb-1.5"
          >
            Allergies (Optional)
          </label>
          <input
            id="ob-allergies"
            type="text"
            placeholder="e.g. Peanuts, shellfish, lactose"
            value={value.allergies}
            onChange={(e) => onChange({ ...value, allergies: e.target.value })}
            className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#D4FF1A] min-h-[46px]"
          />
        </div>

        <div>
          <label
            htmlFor="ob-diet-restrictions"
            className="block text-xs font-medium text-[#9BA1A6] mb-1.5"
          >
            Dietary Restrictions (Optional)
          </label>
          <input
            id="ob-diet-restrictions"
            type="text"
            placeholder="e.g. Gluten-free, Jain, low-sodium"
            value={value.dietary_restrictions}
            onChange={(e) => onChange({ ...value, dietary_restrictions: e.target.value })}
            className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#D4FF1A] min-h-[46px]"
          />
        </div>
      </div>

      {/* Explicit Mandatory Consent */}
      <div className="pt-2 border-t border-[#292C2E]">
        <label className="flex items-start gap-3.5 cursor-pointer p-3.5 rounded-xl bg-[#191B1D]/60 border border-[#292C2E] hover:border-[#3E4246] transition-colors">
          <input
            id="ob-health-consent"
            type="checkbox"
            checked={value.consent_status}
            onChange={(e) => onChange({ ...value, consent_status: e.target.checked })}
            className="mt-0.5 w-5 h-5 accent-[#D4FF1A] rounded cursor-pointer shrink-0"
          />
          <span className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
            I give explicit consent for my assigned NXTGEN coach and UPRISE safety checks to use
            this health screening information to review my programme safely.{' '}
            <span className="text-[#D4FF1A] font-medium">Required</span>
          </span>
        </label>
      </div>
    </div>
  );
};
