import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { UpriseLogo } from '../layout/UpriseLogo';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepSubtitle: string;
  onBack: () => void;
  backLabel?: string;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  stepSubtitle,
  onBack,
  backLabel = 'Back',
}) => {
  const progressPct = Math.round((currentStep / totalSteps) * 100);
  const formattedStep = String(currentStep).padStart(2, '0');
  const formattedTotal = String(totalSteps).padStart(2, '0');

  return (
    <header className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 -ml-3 rounded-xl text-sm font-medium text-[#9BA1A6] hover:text-white hover:bg-[#111111] transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span>{backLabel}</span>
        </button>

        <UpriseLogo size="sm" />

        <span className="text-xs font-medium text-[#8A8F94] tabular-nums">
          Step {formattedStep} / {formattedTotal}
        </span>
      </div>

      {/* Subtle Progress Bar */}
      <div className="space-y-2">
        <div
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Onboarding step ${currentStep} of ${totalSteps}`}
          className="h-1.5 w-full bg-[#191B1D] rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-[#D4FF1A] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#6B6B6B] tabular-nums">
          <span>{progressPct}% complete</span>
          <span>Progress auto-saved</span>
        </div>
      </div>

      {/* Stage Heading */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {stepTitle}
        </h1>
        <p className="text-sm text-[#9BA1A6] mt-1.5 leading-relaxed">{stepSubtitle}</p>
      </div>
    </header>
  );
};
