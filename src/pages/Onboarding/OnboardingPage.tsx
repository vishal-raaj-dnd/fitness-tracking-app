import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useUprise } from '../../context/UpriseContext';
import {
  createEmptyOnboardingData,
  type ApprovedWorkoutPlan,
  type OnboardingDataModel,
} from '../../types/onboarding';
import { PUGAL_APPROVED_PLANS } from '../../data/workouts/approvedPlans';
import {
  findCompatibleApprovedPlans,
  validateOnboardingStage,
} from '../../services/workouts/planMatcher';
import { WelcomeScreen } from '../../components/onboarding/WelcomeScreen';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { Step01Personal } from '../../components/onboarding/Step01Personal';
import { Step02Physical } from '../../components/onboarding/Step02Physical';
import { Step03Goals } from '../../components/onboarding/Step03Goals';
import { Step04WorkoutPrefs } from '../../components/onboarding/Step04WorkoutPrefs';
import { Step05Nutrition } from '../../components/onboarding/Step05Nutrition';
import { Step06Health } from '../../components/onboarding/Step06Health';
import { Step07Review } from '../../components/onboarding/Step07Review';
import { Step08WorkoutPlan } from '../../components/onboarding/Step08WorkoutPlan';
import { Step09Completion } from '../../components/onboarding/Step09Completion';

export const ONBOARDING_DRAFT_KEY = 'uprise_onboarding_wizard_v2';

const STAGE_META: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: 'Personal Information',
    subtitle: 'Tell us who you are so your NXTGEN coach can personalise your SHRED 90 account.',
  },
  2: {
    title: 'Physical Information',
    subtitle: 'Enter your current baseline metrics. We keep your numbers exactly as entered.',
  },
  3: {
    title: 'Fitness Goals',
    subtitle: 'Select what you want to achieve over the next 90 days and your training background.',
  },
  4: {
    title: 'Workout Preferences',
    subtitle: 'Choose where you train, how many days fit your week, and your preferred mission style.',
  },
  5: {
    title: 'Nutrition Preferences',
    subtitle: 'Share your eating pattern and food preferences without tracking complex macros here.',
  },
  6: {
    title: 'Health Information',
    subtitle: 'Private health screening reviewed strictly by your assigned coach for safe programming.',
  },
  7: {
    title: 'Profile Review',
    subtitle: 'Confirm every detail you entered before matching your Pugal-approved workout plan.',
  },
  8: {
    title: 'Workout Plan Selection',
    subtitle: 'Select a Pugal-approved split matched specifically to your profile.',
  },
  9: {
    title: 'Onboarding Completion',
    subtitle: 'Everything is set for Day 1 of your 90-day SHRED programme.',
  },
};

interface SavedWizardDraft {
  stage: number;
  data: OnboardingDataModel;
  editingFromReview: boolean;
}

function loadWizardDraft(requestedStepParam: string | null): SavedWizardDraft {
  try {
    const raw = localStorage.getItem(ONBOARDING_DRAFT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SavedWizardDraft>;
      const defaults = createEmptyOnboardingData();
      const mergedData: OnboardingDataModel = {
        personal_information: {
          ...defaults.personal_information,
          ...(parsed.data?.personal_information ?? {}),
        },
        physical_information: {
          ...defaults.physical_information,
          ...(parsed.data?.physical_information ?? {}),
        },
        fitness_information: {
          ...defaults.fitness_information,
          ...(parsed.data?.fitness_information ?? {}),
        },
        nutrition_information: {
          ...defaults.nutrition_information,
          ...(parsed.data?.nutrition_information ?? {}),
        },
        hydration_information: {
          ...defaults.hydration_information,
          ...(parsed.data?.hydration_information ?? {}),
        },
        health_information: {
          ...defaults.health_information,
          ...(parsed.data?.health_information ?? {}),
        },
        workout_assignment: {
          ...defaults.workout_assignment,
          ...(parsed.data?.workout_assignment ?? {}),
        },
      };
      const parsedStage =
        typeof parsed.stage === 'number' && parsed.stage >= 0 && parsed.stage <= 9
          ? parsed.stage
          : 0;
      const initialStage =
        requestedStepParam === '1' && parsedStage === 0 ? 1 : parsedStage;

      return {
        stage: initialStage,
        data: mergedData,
        editingFromReview: Boolean(parsed.editingFromReview),
      };
    }
  } catch {
    // ignore corrupted draft
  }

  return {
    stage: requestedStepParam === '1' ? 1 : 0,
    data: createEmptyOnboardingData(),
    editingFromReview: false,
  };
}

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeOnboardingWizard } = useUprise();

  const initialDraft = useMemo(
    () => loadWizardDraft(searchParams.get('step')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [stage, setStage] = useState<number>(initialDraft.stage);
  const [data, setData] = useState<OnboardingDataModel>(initialDraft.data);
  const [editingFromReview, setEditingFromReview] = useState<boolean>(
    initialDraft.editingFromReview
  );
  const [error, setError] = useState<string>('');

  // Auto-save progress automatically across every stage
  useEffect(() => {
    try {
      localStorage.setItem(
        ONBOARDING_DRAFT_KEY,
        JSON.stringify({ stage, data, editingFromReview })
      );
    } catch {
      // ignore storage quota errors
    }
  }, [stage, data, editingFromReview]);

  const compatiblePlans = useMemo(
    () => findCompatibleApprovedPlans(PUGAL_APPROVED_PLANS, data.fitness_information),
    [data.fitness_information]
  );

  const selectedPlan = useMemo(
    () =>
      compatiblePlans.find((p) => p.id === data.workout_assignment.selected_plan_id) ?? null,
    [compatiblePlans, data.workout_assignment.selected_plan_id]
  );

  const handleGetStarted = () => {
    setError('');
    setStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExistingMember = () => {
    try {
      localStorage.setItem('uprise_entry_dismissed_v1', '1');
    } catch {
      // ignore
    }
    navigate('/login');
  };

  const handleBack = () => {
    setError('');
    if (editingFromReview) {
      setEditingFromReview(false);
      setStage(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (stage <= 1) {
      setStage(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setStage((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    const validationError = validateOnboardingStage(stage, data);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

    if (editingFromReview && stage >= 1 && stage <= 6) {
      setEditingFromReview(false);
      setStage(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (stage === 8) {
      if (compatiblePlans.length > 0 && !selectedPlan) {
        setError('Please select a Pugal-approved workout plan to continue.');
        return;
      }
      if (compatiblePlans.length === 0) {
        setData((prev) => ({
          ...prev,
          workout_assignment: {
            selected_plan_id: null,
            selected_split: null,
            assignment_status: 'pending_coach_assignment',
          },
        }));
      }
    }

    setStage((prev) => Math.min(9, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditStepFromReview = (targetStep: number, scrollTargetId?: string) => {
    setError('');
    setEditingFromReview(true);
    setStage(targetStep);
    if (scrollTargetId) {
      window.setTimeout(() => {
        const el = document.getElementById(scrollTargetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 220);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectPlan = (plan: ApprovedWorkoutPlan | null) => {
    setError('');
    if (!plan) {
      setData((prev) => ({
        ...prev,
        workout_assignment: {
          selected_plan_id: null,
          selected_split: null,
          assignment_status: 'pending_coach_assignment',
        },
      }));
      return;
    }
    setData((prev) => ({
      ...prev,
      workout_assignment: {
        selected_plan_id: plan.id,
        selected_split: plan.splitLabel,
        assignment_status: plan.requiresCoachApproval
          ? 'pending_coach_approval'
          : 'selected_approved',
      },
    }));
  };

  const handleContinuePendingAssignment = () => {
    setError('');
    setData((prev) => ({
      ...prev,
      workout_assignment: {
        selected_plan_id: null,
        selected_split: null,
        assignment_status: 'pending_coach_assignment',
      },
    }));
    setStage(9);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterUprise = () => {
    completeOnboardingWizard(data, selectedPlan);
    try {
      localStorage.removeItem(ONBOARDING_DRAFT_KEY);
    } catch {
      // ignore
    }
    navigate('/');
  };

  if (stage === 0) {
    return (
      <WelcomeScreen
        onGetStarted={handleGetStarted}
        onExistingMember={handleExistingMember}
      />
    );
  }

  const meta = STAGE_META[stage] ?? STAGE_META[1];
  const showDefaultBottomActions = stage >= 1 && stage <= 6;
  const showStep8BottomActions = stage === 8 && compatiblePlans.length > 0;

  return (
    <div className="min-h-screen bg-[#000000] uprise-ambient-canvas text-white px-4 py-8 sm:py-12">
      <div className="max-w-2xl w-full mx-auto space-y-7">
        <OnboardingHeader
          currentStep={stage}
          totalSteps={9}
          stepTitle={meta.title}
          stepSubtitle={meta.subtitle}
          onBack={handleBack}
          backLabel={
            editingFromReview
              ? 'Back to Review'
              : stage === 1
                ? 'Welcome'
                : 'Back'
          }
        />

        {/* Stage Content Surface */}
        <div className="uprise-surface border border-[#292C2E] rounded-2xl p-5 sm:p-8 space-y-6">
          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs sm:text-sm text-red-200"
            >
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {stage === 1 && (
                <Step01Personal
                  value={data.personal_information}
                  onChange={(personal_information) => {
                    setError('');
                    setData((prev) => ({ ...prev, personal_information }));
                  }}
                />
              )}

              {stage === 2 && (
                <Step02Physical
                  value={data.physical_information}
                  onChange={(physical_information) => {
                    setError('');
                    setData((prev) => ({ ...prev, physical_information }));
                  }}
                />
              )}

              {stage === 3 && (
                <Step03Goals
                  value={data.fitness_information}
                  onChange={(fitness_information) => {
                    setError('');
                    setData((prev) => ({
                      ...prev,
                      fitness_information,
                      workout_assignment: createEmptyOnboardingData().workout_assignment,
                    }));
                  }}
                />
              )}

              {stage === 4 && (
                <Step04WorkoutPrefs
                  value={data.fitness_information}
                  onChange={(fitness_information) => {
                    setError('');
                    setData((prev) => ({
                      ...prev,
                      fitness_information,
                      workout_assignment: createEmptyOnboardingData().workout_assignment,
                    }));
                  }}
                />
              )}

              {stage === 5 && (
                <Step05Nutrition
                  value={data.nutrition_information}
                  hydrationValue={data.hydration_information}
                  onChange={(nutrition_information) => {
                    setError('');
                    setData((prev) => ({ ...prev, nutrition_information }));
                  }}
                  onHydrationChange={(hydration_information) => {
                    setError('');
                    setData((prev) => ({ ...prev, hydration_information }));
                  }}
                />
              )}

              {stage === 6 && (
                <Step06Health
                  value={data.health_information}
                  onChange={(health_information) => {
                    setError('');
                    setData((prev) => ({ ...prev, health_information }));
                  }}
                />
              )}

              {stage === 7 && (
                <Step07Review
                  data={data}
                  onEditStep={handleEditStepFromReview}
                  onContinueToPlans={() => {
                    setError('');
                    setStage(8);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {stage === 8 && (
                <Step08WorkoutPlan
                  data={data}
                  selectedPlanId={data.workout_assignment.selected_plan_id}
                  onSelectPlan={handleSelectPlan}
                  onAdjustPreferences={() => {
                    setError('');
                    setEditingFromReview(false);
                    setStage(4);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onContinuePendingAssignment={handleContinuePendingAssignment}
                />
              )}

              {stage === 9 && (
                <Step09Completion
                  data={data}
                  selectedPlan={selectedPlan}
                  onEnterUprise={handleEnterUprise}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Bar for Stages 1-6 and Stage 8 */}
        {(showDefaultBottomActions || showStep8BottomActions) && (
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#111111] border border-[#292C2E] hover:border-[#3E4246] text-sm font-medium text-white transition-colors min-h-[48px]"
            >
              {editingFromReview ? 'Cancel Edit' : 'Back'}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] active:scale-[0.98] transition-all min-h-[48px]"
            >
              {editingFromReview ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  <span>Save &amp; Return to Review</span>
                </>
              ) : (
                <>
                  <span>
                    {stage === 6
                      ? 'Review Profile'
                      : stage === 8
                        ? 'Complete Onboarding'
                        : 'Continue'}
                  </span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
