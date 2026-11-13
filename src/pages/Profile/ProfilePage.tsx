import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Award,
  Snowflake,
  LogOut,
  Check,
  UserCog,
  RotateCcw,
} from 'lucide-react';
import { useUprise } from '../../context/UpriseContext';
import { SafeImage } from '../../components/layout/SafeImage';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    streakState,
    badges,
    updateProfile,
    switchRole,
    resetDemoData,
  } = useUprise();

  const [savedFeedback, setSavedFeedback] = useState('');
  const [targetWeight, setTargetWeight] = useState(String(currentUser.targetWeightKg));
  const [preferredTime, setPreferredTime] = useState(currentUser.preferredWorkoutTime);
  const [foodPrefs, setFoodPrefs] = useState(currentUser.foodPreferences);

  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const tw = Number(targetWeight);
    updateProfile({
      targetWeightKg: Number.isNaN(tw) || tw < 35 ? currentUser.targetWeightKg : tw,
      preferredWorkoutTime: preferredTime,
      foodPreferences: foodPrefs,
    });
    setSavedFeedback('Profile preferences saved.');
    window.setTimeout(() => setSavedFeedback(''), 2500);
  };

  const handleToggleNotif = (key: keyof typeof currentUser.notifications) => {
    updateProfile({
      notifications: {
        ...currentUser.notifications,
        [key]: !currentUser.notifications[key],
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#292C2E] shrink-0">
            <SafeImage
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              fallbackInitials={currentUser.fullName
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase() ?? '')
                .join('')}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-[#8A8F94]">
              {currentUser.programmeName} · {currentUser.timezone}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
              {currentUser.fullName}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            try {
              localStorage.removeItem('uprise_onboarding_wizard_v2');
            } catch {
              // ignore
            }
            navigate('/onboarding');
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#3E4246] text-xs font-medium text-white transition-colors whitespace-nowrap min-h-[44px]"
        >
          Re-run Onboarding
        </button>
      </header>

      {/* Personal & Physical Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-base font-semibold text-white">Personal Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 py-1.5 border-b border-[#292C2E]">
              <dt className="text-[#8A8F94]">Full Name</dt>
              <dd className="text-white font-medium">{currentUser.fullName}</dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5 border-b border-[#292C2E]">
              <dt className="text-[#8A8F94]">Email</dt>
              <dd className="text-white">{currentUser.email}</dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5">
              <dt className="text-[#8A8F94]">Phone</dt>
              <dd className="text-white tabular-nums">{currentUser.phone}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-base font-semibold text-white">Physical &amp; Fitness</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 py-1.5 border-b border-[#292C2E]">
              <dt className="text-[#8A8F94]">Height · Current Weight</dt>
              <dd className="text-white font-medium tabular-nums">
                {currentUser.heightCm} cm · {currentUser.currentWeightKg} kg
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5 border-b border-[#292C2E]">
              <dt className="text-[#8A8F94]">Goal · Level</dt>
              <dd className="text-white capitalize">
                {currentUser.fitnessGoal.replace('_', ' ')} · {currentUser.experienceLevel}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5 border-b border-[#292C2E]">
              <dt className="text-[#8A8F94]">Location · Days</dt>
              <dd className="text-white capitalize">
                {currentUser.workoutLocation.replace('_', ' ')} ·{' '}
                {currentUser.availableWorkoutDays.join(', ')}
              </dd>
            </div>
            {currentUser.workoutAssignment && (
              <div className="flex justify-between gap-4 py-1.5">
                <dt className="text-[#8A8F94]">Assigned Split</dt>
                <dd className="text-[#D4FF1A] font-medium text-right">
                  {currentUser.workoutAssignment.selectedSplit ?? 'Pending Coach Assignment'}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* Editable Fitness & Nutrition Preferences */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-white">
            Training &amp; Nutrition Preferences
          </h2>
          {savedFeedback && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D4FF1A]">
              <Check className="w-3.5 h-3.5" />
              {savedFeedback}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="pref-target-weight" className="block text-xs text-[#8A8F94] mb-1.5">
              Target Weight (kg)
            </label>
            <input
              id="pref-target-weight"
              type="number"
              step="0.5"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
            />
          </div>

          <div>
            <label htmlFor="pref-workout-time" className="block text-xs text-[#8A8F94] mb-1.5">
              Preferred Workout Time
            </label>
            <input
              id="pref-workout-time"
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8A8F94] mb-1.5">Dietary Pattern</label>
            <div className="px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white capitalize">
              {currentUser.dietaryPreference.replace('_', ' ')} · {currentUser.mealFrequency} meals
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="pref-food-notes" className="block text-xs text-[#8A8F94] mb-1.5">
            Food Preferences
          </label>
          <input
            id="pref-food-notes"
            type="text"
            value={foodPrefs}
            onChange={(e) => setFoodPrefs(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white focus:outline-none focus:border-[#D4FF1A]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] transition-colors min-h-[44px]"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Health & Safety (Private Sensitive Data) */}
      <section
        aria-label="Private health and safety profile"
        className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-[#D4FF1A]" />
            <h2 className="font-display text-base font-semibold text-white">
              Health &amp; Safety Profile
            </h2>
          </div>
          <span className="text-xs text-[#8A8F94]">Private · Visible only to you &amp; your coach</span>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
          <div className="p-4 rounded-xl bg-[#191B1D] border border-[#292C2E]">
            <dt className="text-xs text-[#8A8F94]">Exercise Restrictions</dt>
            <dd className="text-white font-medium mt-1 capitalize">
              {currentUser.exerciseRestrictions.length > 0
                ? currentUser.exerciseRestrictions.map((r) => r.replace(/_/g, ' ')).join(', ')
                : 'None active'}
            </dd>
          </div>
          <div className="p-4 rounded-xl bg-[#191B1D] border border-[#292C2E]">
            <dt className="text-xs text-[#8A8F94]">Medical Conditions &amp; Allergies</dt>
            <dd className="text-white font-medium mt-1">
              {currentUser.medicalConditions} · Allergies: {currentUser.allergies}
            </dd>
          </div>
        </dl>

        <p className="text-xs text-[#9BA1A6] leading-relaxed">
          Safety guidance: {currentUser.safetyNotes} · Explicit health consent{' '}
          {currentUser.healthConsentAccepted ? 'verified' : 'pending'}.
        </p>
      </section>

      {/* Engagement & Notifications */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-base font-semibold text-white">
            Engagement &amp; Rest Pass Wallet
          </h2>
          <div className="flex items-center justify-between py-2 border-b border-[#292C2E] text-sm">
            <span className="text-[#8A8F94]">Current Streak</span>
            <span className="font-semibold text-[#D4FF1A] tabular-nums">
              {streakState.currentStreak} days
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#292C2E] text-sm">
            <span className="text-[#8A8F94] inline-flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-[#D4FF1A]" />
              Rest Pass Wallet
            </span>
            <span className="font-semibold text-white tabular-nums">
              {streakState.restPassBalance} / 3 passes
            </span>
          </div>
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-[#8A8F94] inline-flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D4FF1A]" />
              Badges Unlocked
            </span>
            <span className="font-semibold text-white tabular-nums">
              {earnedBadgesCount} / {badges.length}
            </span>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-3">
          <h2 className="font-display text-base font-semibold text-white mb-2">
            Notification Preferences
          </h2>
          {(
            [
              ['workoutReminders', 'Workout schedule reminders'],
              ['mealCheckins', 'Meal logging check-ins'],
              ['streakAlerts', 'Streak protection alerts'],
              ['missionDrops', 'Surprise Daily Mission drops'],
            ] as const
          ).map(([key, label]) => {
            const active = currentUser.notifications[key];
            return (
              <div key={key} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-[#D1D5DB]">{label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={active}
                  onClick={() => handleToggleNotif(key)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    active ? 'bg-[#D4FF1A]' : 'bg-[#292C2E]'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-black transition-transform ${
                      active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Account & Separate Portal Switching */}
      <section className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-base font-semibold text-white">Account &amp; Portals</h2>
          <p className="text-xs text-[#8A8F94] mt-1">
            Switch to dedicated Coach or Administrator portals, or reset local prototype data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              switchRole('coach');
              navigate('/coach');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[44px]"
          >
            <UserCog className="w-4 h-4 text-[#D4FF1A]" />
            <span>Coach Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              switchRole('admin');
              navigate('/admin');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[44px]"
          >
            <UserCog className="w-4 h-4 text-[#D4FF1A]" />
            <span>Admin Portal</span>
          </button>

          <button
            type="button"
            onClick={resetDemoData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#3E4246] text-xs font-medium text-[#9BA1A6] hover:text-white transition-colors min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-red-400/50 text-xs font-medium text-white transition-colors min-h-[44px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </section>
    </div>
  );
};
