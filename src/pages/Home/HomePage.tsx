import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Flame,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Utensils,
  Dumbbell,
  ShieldCheck,
} from 'lucide-react';
import { useUprise } from '../../context/UpriseContext';
import { SafeImage } from '../../components/layout/SafeImage';
import { UpriseLogo } from '../../components/layout/UpriseLogo';
import { ProgrammeRing } from '../../components/engagement/ProgrammeRing';
import { WeeklyActivityStrip } from '../../components/engagement/WeeklyActivityStrip';
import { SurpriseMissionCard } from '../../components/engagement/SurpriseMissionCard';
import { calculateDailyNutrition } from '../../services/meals/nutritionCalc';
import { summarizeHeatmap } from '../../services/streaks/streakEngine';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    meals,
    customFoods,
    nutritionTargets,
    todayWorkout,
    todayWorkoutCompleted,
    heatmap,
    streakState,
    notifications,
    unreadNotificationsCount,
    markNotificationsRead,
    checkInRestDay,
  } = useUprise();

  const [notifOpen, setNotifOpen] = useState(false);

  const firstName = currentUser.fullName.split(' ')[0];
  const nutritionTotals = useMemo(
    () => calculateDailyNutrition(meals, customFoods),
    [meals, customFoods]
  );
  const heatmapSummary = useMemo(() => summarizeHeatmap(heatmap), [heatmap]);

  const weightDeltaKg = Number(
    (currentUser.currentWeightKg - currentUser.startWeightKg).toFixed(1)
  );

  const handleToggleNotifications = () => {
    const next = !notifOpen;
    setNotifOpen(next);
    if (next && unreadNotificationsCount > 0) {
      markNotificationsRead();
    }
  };

  return (
    <div className="space-y-8">
      {/* Section A — Header */}
      <header className="flex items-center justify-between gap-4 relative">
        <div className="min-w-0">
          <div className="lg:hidden mb-3">
            <UpriseLogo size="sm" />
          </div>
          <p className="text-xs font-medium text-[#8A8F94]">Friday, 13 Nov · {currentUser.programmeName}</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mt-0.5 truncate">
            Stay sharp, {firstName}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggleNotifications}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            className="relative w-11 h-11 rounded-xl bg-[#111111] border border-[#292C2E] flex items-center justify-center text-white hover:border-[#3E4246] transition-colors"
          >
            <Bell className="w-5 h-5" strokeWidth={1.75} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4FF1A] text-black text-[10px] font-bold flex items-center justify-center tabular-nums">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <Link
            to="/profile"
            aria-label="Open profile"
            className="w-11 h-11 rounded-xl overflow-hidden border border-[#292C2E] hover:border-[#D4FF1A] transition-colors block shrink-0"
          >
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
          </Link>
        </div>

        {notifOpen && (
          <div
            role="dialog"
            aria-label="Notifications list"
            className="absolute right-0 top-14 w-80 sm:w-96 bg-[#191B1D] border border-[#292C2E] rounded-2xl p-4 z-50"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#292C2E]">
              <h2 className="font-display text-sm font-semibold text-white">Updates</h2>
              <button
                type="button"
                onClick={() => setNotifOpen(false)}
                className="text-xs text-[#8A8F94] hover:text-white px-2 py-1"
              >
                Close
              </button>
            </div>
            <div className="divide-y divide-[#292C2E] max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">{n.title}</p>
                    <span className="text-[11px] text-[#6B6B6B] whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-xs text-[#9BA1A6] mt-1 leading-relaxed">{n.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Section B — Programme Overview & Fitness Streak */}
      <section
        aria-label="Programme progress and streak"
        className="grid grid-cols-1 lg:grid-cols-12 gap-4"
      >
        {/* Programme Journey */}
        <div className="lg:col-span-7 uprise-surface border border-[#292C2E] rounded-2xl p-6 flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#8A8F94]">90-Day Journey</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-3xl sm:text-4xl font-bold text-white tabular-nums">
                  Day {currentUser.programmeDay}
                </span>
                <span className="font-display text-lg text-[#6B6B6B] tabular-nums">
                  / {currentUser.programmeTotalDays}
                </span>
              </div>
              <p className="text-sm text-[#9BA1A6] mt-2 text-balance">
                {currentUser.programmeTotalDays - currentUser.programmeDay} days left in SHRED&nbsp;90
              </p>
            </div>
            <ProgrammeRing
              currentDay={currentUser.programmeDay}
              totalDays={currentUser.programmeTotalDays}
            />
          </div>

          <div className="pt-4 border-t border-[#292C2E]">
            <WeeklyActivityStrip days={heatmap} todayDayNumber={currentUser.programmeDay} />
          </div>
        </div>

        {/* Fitness Streak (Visually Distinct) */}
        <div className="lg:col-span-5 uprise-surface-elevated border border-[#292C2E] rounded-2xl p-6 flex flex-col justify-between gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#8A8F94]">Fitness Streak</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-3xl sm:text-4xl font-bold text-[#D4FF1A] tabular-nums">
                  {streakState.currentStreak}
                </span>
                <span className="text-sm font-medium text-white">days</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#202321] border border-[#292C2E] flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#D4FF1A]" strokeWidth={2} />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#292C2E]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A8F94]">Today&apos;s status</span>
              <span
                className={`font-medium ${
                  streakState.status === 'Active' ? 'text-[#D4FF1A]' : 'text-white'
                }`}
              >
                {streakState.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8A8F94]">Rest Pass wallet</span>
              <span className="font-medium text-white tabular-nums">
                {streakState.restPassBalance} / 3 available
              </span>
            </div>
            <p className="text-xs text-[#8A8F94] leading-relaxed">
              {streakState.status === 'Active'
                ? 'Today is locked in. Keep building momentum.'
                : 'Complete today’s workout, log 2 meals, or finish your mission to secure today.'}
            </p>
          </div>
        </div>
      </section>

      {/* Section C — Today's Plan (Meals + Training) */}
      <section aria-label="Today's plan" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Nutrition */}
        <div className="uprise-surface border border-[#292C2E] rounded-2xl p-6 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Utensils className="w-4 h-4 text-[#D4FF1A]" strokeWidth={2} />
                <h2 className="font-display text-base font-semibold text-white">Today&apos;s Meals</h2>
              </div>
              <span className="text-xs text-[#8A8F94] tabular-nums">
                {nutritionTotals.completedMealsCount} / {nutritionTotals.totalMealsCount} logged
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl font-bold text-white tabular-nums">
                  {nutritionTotals.calories.toLocaleString()}
                </span>
                <span className="text-xs text-[#8A8F94] tabular-nums">
                  of {nutritionTargets.calories.toLocaleString()} kcal target
                </span>
              </div>
              <div className="mt-3 h-2 bg-[#191B1D] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D4FF1A] rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((nutritionTotals.calories / nutritionTargets.calories) * 100)
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-[#8A8F94] mt-3 tabular-nums">
                Protein {nutritionTotals.proteinG}g / {nutritionTargets.proteinG}g ·{' '}
                {nutritionTargets.planName.split('·')[1]?.trim() ?? 'Indian Meal Plan'}
              </p>
            </div>
          </div>

          <Link
            to="/meals"
            className="group inline-flex items-center justify-between px-4 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#3E4246] active:scale-[0.98] text-sm font-medium text-white transition-all duration-150 min-h-[44px]"
          >
            <span>Open Meal Schedule</span>
            <ArrowUpRight
              className="w-4 h-4 text-[#D4FF1A] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </Link>
        </div>

        {/* Today's Training */}
        <div className="uprise-surface border border-[#292C2E] rounded-2xl p-6 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Dumbbell className="w-4 h-4 text-[#D4FF1A]" strokeWidth={2} />
                <h2 className="font-display text-base font-semibold text-white">Today&apos;s Training</h2>
              </div>
              <span
                className={`text-xs font-medium ${
                  todayWorkoutCompleted || streakState.restDayCheckedInToday
                    ? 'text-[#D4FF1A]'
                    : 'text-[#8A8F94]'
                }`}
              >
                {todayWorkoutCompleted
                  ? 'Completed'
                  : todayWorkout.isRestDay
                    ? streakState.restDayCheckedInToday
                      ? 'Checked in'
                      : 'Rest Day'
                    : 'Pending'}
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-white mt-4">
              {currentUser.workoutAssignment?.assignmentStatus === 'pending_coach_assignment'
                ? 'Coach Plan In Preparation'
                : todayWorkout.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#8A8F94] mt-2 tabular-nums">
              {currentUser.workoutAssignment?.assignmentStatus === 'pending_coach_assignment' ? (
                <span className="text-[#D4FF1A]">
                  Pending coach assignment · Safe baseline ready
                </span>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                    {todayWorkout.durationMinutes > 0
                      ? `${todayWorkout.durationMinutes} min`
                      : 'Recovery'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {todayWorkout.isRestDay
                      ? 'No barbell load today'
                      : `${todayWorkout.exercises.length} exercises`}
                  </span>
                  {currentUser.workoutAssignment?.assignmentStatus === 'pending_coach_approval' && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#D4FF1A]">Awaiting coach sign-off</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {todayWorkout.isRestDay ? (
              <button
                type="button"
                disabled={streakState.restDayCheckedInToday}
                onClick={checkInRestDay}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all duration-150 min-h-[44px] ${
                  streakState.restDayCheckedInToday
                    ? 'bg-[#191B1D] text-[#D4FF1A] border border-[#292C2E]'
                    : 'bg-[#D4FF1A] text-black hover:bg-[#c5ee14]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" strokeWidth={2} />
                <span>
                  {streakState.restDayCheckedInToday ? 'Rest Day Checked In' : 'Check In Rest Day'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/workout-mode')}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all duration-150 min-h-[44px] ${
                  todayWorkoutCompleted
                    ? 'bg-[#191B1D] text-white border border-[#292C2E] hover:border-[#3E4246]'
                    : 'bg-[#D4FF1A] text-black hover:bg-[#c5ee14]'
                }`}
              >
                {todayWorkoutCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#D4FF1A]" strokeWidth={2} />
                    <span>Train Again</span>
                  </>
                ) : (
                  <span>Start Workout</span>
                )}
              </button>
            )}

            <Link
              to="/training"
              className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#3E4246] active:scale-[0.98] text-sm font-medium text-white transition-all duration-150 whitespace-nowrap min-h-[44px]"
            >
              Details
            </Link>
          </div>
        </div>
      </section>

      {/* Section D — Surprise Daily Mission */}
      <SurpriseMissionCard />

      {/* Section E — Progress Snapshot */}
      <section
        aria-label="Progress snapshot"
        className="uprise-surface border border-[#292C2E] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div className="grid grid-cols-2 gap-8 sm:gap-12">
          <div>
            <p className="text-xs text-[#8A8F94]">Current Weight</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-2xl font-bold text-white tabular-nums">
                {currentUser.currentWeightKg.toFixed(1)} kg
              </span>
              <span className="text-xs font-medium text-[#D4FF1A] tabular-nums">
                {weightDeltaKg} kg
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-[#8A8F94]">Programme Adherence</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-2xl font-bold text-white tabular-nums">
                {heatmapSummary.adherencePct}%
              </span>
              <span className="text-xs text-[#8A8F94] tabular-nums">
                {heatmapSummary.activeDays} active days
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/progress"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#3E4246] text-sm font-medium text-white transition-colors whitespace-nowrap min-h-[44px]"
        >
          <span>View Transformation</span>
          <ArrowUpRight className="w-4 h-4 text-[#D4FF1A]" strokeWidth={2} />
        </Link>
      </section>
    </div>
  );
};
