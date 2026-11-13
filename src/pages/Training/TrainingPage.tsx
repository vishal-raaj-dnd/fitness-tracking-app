import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  History,
  Dumbbell,
} from 'lucide-react';
import { useUprise } from '../../context/UpriseContext';
import { SafeImage } from '../../components/layout/SafeImage';

export const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    weeklySplit,
    todayWorkout,
    todayWorkoutCompleted,
    workoutHistory,
    selectTodayWorkoutDay,
    checkInRestDay,
    streakState,
  } = useUprise();

  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    todayWorkout.exercises[0]?.id ?? null
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-xs font-medium text-[#8A8F94]">
          SHRED 90 Split · {currentUser.workoutLocation.replace('_', ' ')}
        </p>
        <h1 className="font-display text-3xl font-bold text-white mt-1">Training</h1>
      </header>

      {/* Weekly Split Selector */}
      <section aria-label="Weekly workout split">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-sm font-semibold text-[#8A8F94]">Weekly Schedule</h2>
          <span className="text-xs text-[#8A8F94] tabular-nums">
            {currentUser.availableWorkoutDays.length} training days / week
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weeklySplit.map((day) => {
            const isSelected = day.id === todayWorkout.id;
            const isAvailable = currentUser.availableWorkoutDays.includes(day.dayShort);
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => {
                  selectTodayWorkoutDay(day.id);
                  setExpandedExerciseId(day.exercises[0]?.id ?? null);
                }}
                className={`py-3 px-2 rounded-xl border text-center transition-colors min-h-[56px] flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-[#D4FF1A] border-[#D4FF1A] text-black'
                    : 'bg-[#111111] border-[#292C2E] text-white hover:border-[#3E4246]'
                }`}
              >
                <span className="text-xs font-semibold">{day.dayShort}</span>
                <span
                  className={`text-[10px] ${
                    isSelected ? 'text-black/80 font-medium' : 'text-[#8A8F94]'
                  }`}
                >
                  {day.isRestDay ? 'Rest' : isAvailable ? 'Train' : 'Flex'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Workout Hero Card */}
      <section
        aria-label="Scheduled workout overview"
        className="bg-[#111111] border border-[#292C2E] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
      >
        <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-[280px]">
          <SafeImage
            src={todayWorkout.heroImageUrl}
            alt={todayWorkout.title}
            fallbackTitle={todayWorkout.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#111111]/80" />
        </div>

        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A8F94]">
              <span className="text-[#D4FF1A] font-medium">{todayWorkout.dayLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{todayWorkout.focus}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">
              {todayWorkout.title}
            </h2>

            <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-[#9BA1A6] tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#D4FF1A]" />
                {todayWorkout.durationMinutes > 0
                  ? `${todayWorkout.durationMinutes} min`
                  : 'Recovery day'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#D4FF1A]" />
                {todayWorkout.isRestDay
                  ? 'Zero barbell load'
                  : `${todayWorkout.exercises.length} exercises`}
              </span>
              {todayWorkoutCompleted && (
                <span className="inline-flex items-center gap-1.5 text-[#D4FF1A] font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed today
                </span>
              )}
            </div>
          </div>

          {todayWorkout.isRestDay ? (
            <button
              type="button"
              disabled={streakState.restDayCheckedInToday}
              onClick={checkInRestDay}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors min-h-[48px] w-full sm:w-auto ${
                streakState.restDayCheckedInToday
                  ? 'bg-[#191B1D] text-[#D4FF1A] border border-[#292C2E]'
                  : 'bg-[#D4FF1A] text-black hover:bg-[#c5ee14]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {streakState.restDayCheckedInToday
                  ? 'Rest Day Check-In Logged'
                  : 'Complete Rest Day Check-In'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/workout-mode')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] transition-colors min-h-[48px] w-full sm:w-auto"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{todayWorkoutCompleted ? 'Run Workout Again' : 'Start Workout'}</span>
            </button>
          )}
        </div>
      </section>

      {/* Exercise Breakdown */}
      {!todayWorkout.isRestDay && (
        <section aria-label="Exercise breakdown" className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-white">
            Session Exercises ({todayWorkout.exercises.length})
          </h2>

          <div className="space-y-3">
            {todayWorkout.exercises.map((exercise, index) => {
              const isOpen = expandedExerciseId === exercise.id;
              const hasRestrictionWarning = exercise.contraindications.some((c) =>
                currentUser.exerciseRestrictions.includes(c)
              );

              return (
                <article
                  key={exercise.id}
                  className="bg-[#111111] border border-[#292C2E] rounded-2xl overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpandedExerciseId(isOpen ? null : exercise.id)}
                    className="w-full p-4 sm:p-5 flex items-center gap-4 text-left hover:bg-[#16181A] transition-colors"
                  >
                    <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-[#292C2E]">
                      <SafeImage
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        fallbackTitle={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#8A8F94]">
                        0{index + 1} · {exercise.muscleGroup}
                      </p>
                      <h3 className="font-display text-base font-semibold text-white mt-0.5 truncate">
                        {exercise.name}
                      </h3>
                      <p className="text-xs text-[#9BA1A6] mt-1 tabular-nums">
                        {exercise.sets} sets × {exercise.reps} reps · Rest {exercise.restSeconds}s
                      </p>
                    </div>

                    <div className="shrink-0 text-[#8A8F94]">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-4 border-t border-[#292C2E] bg-[#141517] grid grid-cols-1 md:grid-cols-12 gap-5">
                      <div className="md:col-span-5 rounded-xl overflow-hidden border border-[#292C2E] aspect-[4/3]">
                        <SafeImage
                          src={exercise.imageUrl}
                          alt={`${exercise.name} demonstration`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-7 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#8A8F94] mb-2">
                            <span>Execution Cues</span>
                            <span>{exercise.videoLabel ?? 'Form Guide'}</span>
                          </div>
                          <ol className="space-y-2 text-sm text-[#D1D5DB] list-decimal list-inside">
                            {exercise.instructions.map((step, i) => (
                              <li key={i} className="leading-relaxed">
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {hasRestrictionWarning && (
                          <div className="p-3 rounded-xl bg-[#202321] border border-[#292C2E] flex items-start gap-2.5 text-xs text-[#D4FF1A]">
                            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>
                              Coach safety flag: use controlled tempo and stop short of joint
                              discomfort per your restriction profile.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Workout History */}
      <section
        aria-label="Recent workout history"
        className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <History className="w-4 h-4 text-[#D4FF1A]" />
          <h2 className="font-display text-base font-semibold text-white">Workout History</h2>
        </div>

        <div className="divide-y divide-[#292C2E]">
          {workoutHistory.map((entry) => (
            <div
              key={entry.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <p className="text-sm font-medium text-white">{entry.workoutTitle}</p>
                <p className="text-xs text-[#8A8F94] mt-0.5">{entry.date}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#9BA1A6] tabular-nums">
                <span>{entry.durationMinutes} min</span>
                <span aria-hidden="true">·</span>
                <span>
                  {entry.totalVolumeKg > 0
                    ? `${entry.totalVolumeKg.toLocaleString()} kg volume`
                    : 'Recovery'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#D4FF1A]">
                  {entry.exercisesCompleted}/{entry.totalExercises} exercises
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
