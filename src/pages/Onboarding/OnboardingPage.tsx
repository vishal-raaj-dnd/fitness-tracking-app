import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Shield } from 'lucide-react';
import { useUprise } from '../../context/UpriseContext';
import { UpriseLogo } from '../../components/layout/UpriseLogo';
import type {
  DietaryPreference,
  ExperienceLevel,
  FitnessGoal,
  SafetyRestriction,
  WorkoutLocation,
} from '../../types';

const DRAFT_KEY = 'uprise_onboarding_draft_v1';

const STEPS = [
  'Personal Information',
  'Physical Information',
  'Fitness Goals & Experience',
  'Workout Preferences',
  'Nutrition Preferences',
  'Health & Consent',
  'Review & Launch',
] as const;

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, completeOnboarding } = useUprise();

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
      heightCm: String(currentUser.heightCm),
      currentWeightKg: String(currentUser.currentWeightKg),
      targetWeightKg: String(currentUser.targetWeightKg),
      fitnessGoal: currentUser.fitnessGoal as FitnessGoal,
      experienceLevel: currentUser.experienceLevel as ExperienceLevel,
      workoutLocation: currentUser.workoutLocation as WorkoutLocation,
      availableWorkoutDays: currentUser.availableWorkoutDays,
      preferredWorkoutTime: currentUser.preferredWorkoutTime,
      dietaryPreference: currentUser.dietaryPreference as DietaryPreference,
      mealFrequency: currentUser.mealFrequency,
      foodPreferences: currentUser.foodPreferences,
      medicalConditions: currentUser.medicalConditions,
      exerciseRestrictions: currentUser.exerciseRestrictions as SafetyRestriction[],
      allergies: currentUser.allergies,
      healthConsentAccepted: currentUser.healthConsentAccepted,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }
  }, [form]);

  const validateCurrentStep = (): boolean => {
    setError('');
    if (step === 0) {
      if (!form.fullName.trim() || !form.email.includes('@') || form.phone.trim().length < 7) {
        setError('Please enter your full name, a valid email address, and phone number.');
        return false;
      }
    }
    if (step === 1) {
      const h = Number(form.heightCm);
      const cw = Number(form.currentWeightKg);
      const tw = Number(form.targetWeightKg);
      if (Number.isNaN(h) || h < 120 || h > 230 || Number.isNaN(cw) || cw < 35 || Number.isNaN(tw) || tw < 35) {
        setError('Enter realistic height (cm) and current/target weight (kg).');
        return false;
      }
    }
    if (step === 3 && form.availableWorkoutDays.length === 0) {
      setError('Select at least one available workout day.');
      return false;
    }
    if (step === 5 && !form.healthConsentAccepted) {
      setError('Explicit health data consent is required to tailor safe training and missions.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const handleBack = () => {
    setError('');
    if (step === 0) {
      navigate('/');
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const handleFinish = () => {
    completeOnboarding({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      heightCm: Number(form.heightCm),
      currentWeightKg: Number(form.currentWeightKg),
      targetWeightKg: Number(form.targetWeightKg),
      fitnessGoal: form.fitnessGoal,
      experienceLevel: form.experienceLevel,
      workoutLocation: form.workoutLocation,
      availableWorkoutDays: form.availableWorkoutDays,
      preferredWorkoutTime: form.preferredWorkoutTime,
      dietaryPreference: form.dietaryPreference,
      mealFrequency: form.mealFrequency,
      foodPreferences: form.foodPreferences,
      medicalConditions: form.medicalConditions,
      exerciseRestrictions: form.exerciseRestrictions,
      allergies: form.allergies,
      healthConsentAccepted: form.healthConsentAccepted,
      healthConsentTimestamp: new Date().toISOString(),
    });
    localStorage.removeItem(DRAFT_KEY);
    navigate('/');
  };

  const toggleDay = (day: string) => {
    setForm((prev: typeof form) => {
      const exists = prev.availableWorkoutDays.includes(day);
      return {
        ...prev,
        availableWorkoutDays: exists
          ? prev.availableWorkoutDays.filter((d: string) => d !== day)
          : [...prev.availableWorkoutDays, day],
      };
    });
  };

  const toggleRestriction = (res: SafetyRestriction) => {
    setForm((prev: typeof form) => {
      const exists = prev.exerciseRestrictions.includes(res);
      return {
        ...prev,
        exerciseRestrictions: exists
          ? prev.exerciseRestrictions.filter((r: SafetyRestriction) => r !== res)
          : [...prev.exerciseRestrictions, res],
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between px-4 py-8 sm:py-12">
      <div className="max-w-xl w-full mx-auto space-y-8">
        {/* Brand & Step Progress */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <UpriseLogo size="sm" />
            <span className="text-xs font-medium text-[#8A8F94] tabular-nums">
              Step 0{step + 1} / 0{STEPS.length}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5" aria-label="Onboarding progress">
            {STEPS.map((label, idx) => (
              <div
                key={label}
                className={`h-1.5 rounded-full transition-colors ${
                  idx <= step ? 'bg-[#D4FF1A]' : 'bg-[#191B1D]'
                }`}
              />
            ))}
          </div>

          <div>
            <p className="text-xs font-medium text-[#D4FF1A]">SHRED 90 Onboarding</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              {STEPS[step]}
            </h1>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 sm:p-8 space-y-5">
          {error && (
            <p role="alert" className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
              {error}
            </p>
          )}

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="ob-name" className="block text-xs text-[#8A8F94] mb-1.5">
                  Full Name
                </label>
                <input
                  id="ob-name"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
              <div>
                <label htmlFor="ob-email" className="block text-xs text-[#8A8F94] mb-1.5">
                  Email Address
                </label>
                <input
                  id="ob-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
              <div>
                <label htmlFor="ob-phone" className="block text-xs text-[#8A8F94] mb-1.5">
                  Phone Number
                </label>
                <input
                  id="ob-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="ob-height" className="block text-xs text-[#8A8F94] mb-1.5">
                  Height (cm)
                </label>
                <input
                  id="ob-height"
                  type="number"
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
              <div>
                <label htmlFor="ob-cw" className="block text-xs text-[#8A8F94] mb-1.5">
                  Current Weight (kg)
                </label>
                <input
                  id="ob-cw"
                  type="number"
                  step="0.1"
                  value={form.currentWeightKg}
                  onChange={(e) => setForm({ ...form, currentWeightKg: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
              <div>
                <label htmlFor="ob-tw" className="block text-xs text-[#8A8F94] mb-1.5">
                  Target Weight (kg)
                </label>
                <input
                  id="ob-tw"
                  type="number"
                  step="0.1"
                  value={form.targetWeightKg}
                  onChange={(e) => setForm({ ...form, targetWeightKg: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs text-[#8A8F94] mb-2.5">Primary 90-Day Goal</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(
                    [
                      ['fat_loss', 'Fat Loss & Definition'],
                      ['lean_recomp', 'Lean Body Recomposition'],
                      ['muscle_gain', 'Strength & Hypertrophy'],
                      ['athletic_conditioning', 'Athletic Conditioning'],
                    ] as const
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm({ ...form, fitnessGoal: val })}
                      className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-colors ${
                        form.fitnessGoal === val
                          ? 'bg-[#202321] border-[#D4FF1A] text-white'
                          : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-[#8A8F94] mb-2.5">Training Experience</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setForm({ ...form, experienceLevel: lvl })}
                      className={`p-3 rounded-xl border text-center text-sm font-medium capitalize transition-colors ${
                        form.experienceLevel === lvl
                          ? 'bg-[#202321] border-[#D4FF1A] text-white'
                          : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs text-[#8A8F94] mb-2.5">Workout Location</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      ['commercial_gym', 'Commercial Gym'],
                      ['home_dumbbells', 'Home Dumbbells'],
                      ['bodyweight', 'Bodyweight'],
                    ] as const
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm({ ...form, workoutLocation: val })}
                      className={`p-3 rounded-xl border text-center text-sm font-medium transition-colors ${
                        form.workoutLocation === val
                          ? 'bg-[#202321] border-[#D4FF1A] text-white'
                          : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-[#8A8F94] mb-2.5">Available Workout Days</p>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => {
                    const selected = form.availableWorkoutDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={`py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                          selected
                            ? 'bg-[#D4FF1A] border-[#D4FF1A] text-black'
                            : 'bg-[#191B1D] border-[#292C2E] text-[#8A8F94]'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="ob-time" className="block text-xs text-[#8A8F94] mb-1.5">
                  Preferred Workout Time
                </label>
                <input
                  id="ob-time"
                  type="time"
                  value={form.preferredWorkoutTime}
                  onChange={(e) => setForm({ ...form, preferredWorkoutTime: e.target.value })}
                  className="w-full sm:w-48 px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs text-[#8A8F94] mb-2.5">Dietary Preference</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {(
                    [
                      ['non_vegetarian', 'Non-Vegetarian'],
                      ['vegetarian', 'Vegetarian'],
                      ['eggetarian', 'Eggetarian'],
                      ['vegan', 'Vegan'],
                    ] as const
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm({ ...form, dietaryPreference: val })}
                      className={`p-3 rounded-xl border text-left text-sm font-medium transition-colors ${
                        form.dietaryPreference === val
                          ? 'bg-[#202321] border-[#D4FF1A] text-white'
                          : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="ob-food-pref" className="block text-xs text-[#8A8F94] mb-1.5">
                  Food Preferences &amp; Regional Notes
                </label>
                <input
                  id="ob-food-pref"
                  type="text"
                  value={form.foodPreferences}
                  onChange={(e) => setForm({ ...form, foodPreferences: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-xs text-[#9BA1A6]">
                <Shield className="w-4 h-4 text-[#D4FF1A] shrink-0 mt-0.5" />
                <span>
                  Health information is treated as strictly private and is never exposed to other
                  members.
                </span>
              </div>

              <div>
                <p className="text-xs text-[#8A8F94] mb-2">Exercise Restrictions</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(
                    [
                      ['knee_injury', 'Knee sensitivity / injury'],
                      ['lower_back_sensitivity', 'Lower back sensitivity'],
                      ['shoulder_impingement', 'Shoulder impingement'],
                      ['hypertension', 'Blood pressure / hypertension'],
                    ] as const
                  ).map(([val, label]) => {
                    const active = form.exerciseRestrictions.includes(val);
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => toggleRestriction(val)}
                        className={`p-3 rounded-xl border text-left text-sm transition-colors ${
                          active
                            ? 'bg-[#202321] border-[#D4FF1A] text-white'
                            : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ob-med" className="block text-xs text-[#8A8F94] mb-1.5">
                    Medical Conditions
                  </label>
                  <input
                    id="ob-med"
                    type="text"
                    value={form.medicalConditions}
                    onChange={(e) => setForm({ ...form, medicalConditions: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white"
                  />
                </div>
                <div>
                  <label htmlFor="ob-allergy" className="block text-xs text-[#8A8F94] mb-1.5">
                    Food Allergies
                  </label>
                  <input
                    id="ob-allergy"
                    type="text"
                    value={form.allergies}
                    onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={form.healthConsentAccepted}
                  onChange={(e) => setForm({ ...form, healthConsentAccepted: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-[#D4FF1A]"
                />
                <span className="text-xs text-[#D1D5DB] leading-relaxed">
                  I give explicit consent for my assigned NXTGEN coach and the UPRISE safety engine
                  to process my health restrictions and adapt workouts and missions safely.
                </span>
              </label>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-[#292C2E]">
                <span className="text-[#8A8F94]">Member</span>
                <span className="text-white font-medium">{form.fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#292C2E]">
                <span className="text-[#8A8F94]">Metrics</span>
                <span className="text-white tabular-nums">
                  {form.heightCm} cm · {form.currentWeightKg} kg → {form.targetWeightKg} kg
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#292C2E]">
                <span className="text-[#8A8F94]">Goal &amp; Split</span>
                <span className="text-white capitalize">
                  {form.fitnessGoal.replace('_', ' ')} · {form.availableWorkoutDays.length} days/wk
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#8A8F94]">Nutrition</span>
                <span className="text-white capitalize">
                  {form.dietaryPreference.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111111] border border-[#292C2E] text-sm font-medium text-white hover:border-[#3E4246] min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 0 ? 'Cancel' : 'Back'}</span>
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] min-h-[44px]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] min-h-[44px]"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              <span>Save &amp; Enter UPRISE</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
