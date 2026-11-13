import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Pause,
  Play,
  RotateCcw,
  Timer,
  X,
} from 'lucide-react';
import { useUprise } from '../../context/UpriseContext';
import { SafeImage } from '../../components/layout/SafeImage';
import { calculateSessionVolume, formatRestTimer } from '../../services/workouts/workoutProgress';
import type { SetLogEntry } from '../../types';

export const WorkoutModePage: React.FC = () => {
  const navigate = useNavigate();
  const { todayWorkout, completeWorkoutSession } = useUprise();

  const exercises = todayWorkout.exercises;
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Build initial set logs per exercise
  const [logsByExercise, setLogsByExercise] = useState<Record<string, SetLogEntry[]>>(() => {
    const initial: Record<string, SetLogEntry[]> = {};
    for (const ex of exercises) {
      initial[ex.id] = Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: 10,
        weightKg: 20,
        completed: false,
      }));
    }
    return initial;
  });

  // Rest timer state
  const currentExercise = exercises[exerciseIdx];
  const [restSecondsLeft, setRestSecondsLeft] = useState(currentExercise?.restSeconds ?? 90);
  const [restRunning, setRestRunning] = useState(false);

  // Elapsed workout clock
  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Rest timer countdown
  useEffect(() => {
    if (!restRunning) return;
    const id = window.setInterval(() => {
      setRestSecondsLeft((s) => {
        if (s <= 1) {
          setRestRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [restRunning]);

  const currentSets = useMemo(
    () => (currentExercise ? logsByExercise[currentExercise.id] ?? [] : []),
    [currentExercise, logsByExercise]
  );

  const completedSetsCount = currentSets.filter((s) => s.completed).length;

  const updateSetField = (setIndex: number, field: 'reps' | 'weightKg', value: number) => {
    if (!currentExercise) return;
    setLogsByExercise((prev) => ({
      ...prev,
      [currentExercise.id]: (prev[currentExercise.id] ?? []).map((s, idx) =>
        idx === setIndex ? { ...s, [field]: Math.max(0, value) } : s
      ),
    }));
  };

  const toggleSetCompleted = (setIndex: number) => {
    if (!currentExercise) return;
    const targetWasCompleted = currentSets[setIndex]?.completed ?? false;
    setLogsByExercise((prev) => ({
      ...prev,
      [currentExercise.id]: (prev[currentExercise.id] ?? []).map((s, idx) =>
        idx === setIndex ? { ...s, completed: !s.completed } : s
      ),
    }));

    if (!targetWasCompleted) {
      setRestSecondsLeft(currentExercise.restSeconds);
      setRestRunning(true);
    }
  };

  const handleGoExercise = (nextIdx: number) => {
    const clamped = Math.max(0, Math.min(exercises.length - 1, nextIdx));
    setExerciseIdx(clamped);
    setRestRunning(false);
    setRestSecondsLeft(exercises[clamped]?.restSeconds ?? 90);
  };

  const handleFinishWorkout = () => {
    const totalVolumeKg = calculateSessionVolume(logsByExercise);
    const exercisesCompleted = exercises.filter((ex) =>
      (logsByExercise[ex.id] ?? []).some((s) => s.completed)
    ).length;

    completeWorkoutSession({
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      logsByExercise,
      totalVolumeKg,
      exercisesCompleted: Math.max(1, exercisesCompleted),
      totalExercises: exercises.length,
    });
    navigate('/training');
  };

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-6 text-center">
        <p className="text-lg font-display font-semibold">No exercises scheduled for this rest day.</p>
        <button
          type="button"
          onClick={() => navigate('/training')}
          className="mt-4 px-5 py-3 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold"
        >
          Back to Training
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col">
      {/* Focused Workout Top Bar */}
      <header className="sticky top-0 z-30 bg-[#000000]/95 backdrop-blur-md border-b border-[#292C2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/training')}
            aria-label="Exit workout mode"
            className="inline-flex items-center gap-2 text-sm text-[#8A8F94] hover:text-white min-h-[44px]"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <div className="text-center min-w-0">
            <p className="text-xs text-[#8A8F94] tabular-nums">
              Exercise {exerciseIdx + 1} of {exercises.length} · {formatRestTimer(elapsedSeconds)}
            </p>
            <p className="font-display text-sm font-semibold text-white truncate">
              {todayWorkout.title}
            </p>
          </div>

          <button
            type="button"
            onClick={handleFinishWorkout}
            className="px-4 py-2 rounded-xl bg-[#D4FF1A] text-black text-xs sm:text-sm font-semibold hover:bg-[#c5ee14] transition-colors whitespace-nowrap min-h-[40px]"
          >
            Finish Workout
          </button>
        </div>
      </header>

      {/* Main Distraction-Free Workout Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Exercise Demonstration & Meta */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          <div className="md:col-span-5 rounded-2xl overflow-hidden border border-[#292C2E] aspect-[4/3] md:aspect-auto">
            <SafeImage
              src={currentExercise.imageUrl}
              alt={currentExercise.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:col-span-7 bg-[#111111] border border-[#292C2E] rounded-2xl p-6 flex flex-col justify-between gap-5">
            <div>
              <p className="text-xs font-medium text-[#D4FF1A]">{currentExercise.muscleGroup}</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                {currentExercise.name}
              </h1>
              <p className="text-sm text-[#9BA1A6] mt-2 tabular-nums">
                Target: {currentExercise.sets} sets × {currentExercise.reps} reps · Completed{' '}
                {completedSetsCount}/{currentExercise.sets} sets
              </p>
            </div>

            {/* Working Rest Timer */}
            <div className="p-4 rounded-xl bg-[#191B1D] border border-[#292C2E] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-[#D4FF1A]" />
                <div>
                  <p className="text-xs text-[#8A8F94]">Rest Timer</p>
                  <p className="font-display text-2xl font-bold text-white tabular-nums">
                    {formatRestTimer(restSecondsLeft)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRestRunning((r) => !r)}
                  aria-label={restRunning ? 'Pause rest timer' : 'Start rest timer'}
                  className="w-11 h-11 rounded-xl bg-[#D4FF1A] text-black flex items-center justify-center hover:bg-[#c5ee14] transition-colors"
                >
                  {restRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRestRunning(false);
                    setRestSecondsLeft(currentExercise.restSeconds);
                  }}
                  aria-label="Reset rest timer"
                  className="w-11 h-11 rounded-xl bg-[#111111] border border-[#292C2E] text-white flex items-center justify-center hover:border-[#3E4246] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Set Logger Table with Large Touch Controls */}
        <section
          aria-label="Set counter and weight logging"
          className="bg-[#111111] border border-[#292C2E] rounded-2xl p-5 sm:p-6"
        >
          <div className="grid grid-cols-12 gap-3 text-xs font-medium text-[#8A8F94] pb-3 border-b border-[#292C2E]">
            <div className="col-span-2">Set</div>
            <div className="col-span-4">Weight (kg)</div>
            <div className="col-span-3">Reps</div>
            <div className="col-span-3 text-right">Log</div>
          </div>

          <div className="divide-y divide-[#292C2E]">
            {currentSets.map((setRow, idx) => (
              <div
                key={setRow.setNumber}
                className="py-3.5 grid grid-cols-12 gap-3 items-center"
              >
                <div className="col-span-2 font-display text-base font-bold text-white tabular-nums">
                  {setRow.setNumber}
                </div>

                <div className="col-span-4">
                  <label htmlFor={`weight-${idx}`} className="sr-only">
                    Set {setRow.setNumber} weight in kg
                  </label>
                  <input
                    id={`weight-${idx}`}
                    type="number"
                    min="0"
                    step="2.5"
                    value={setRow.weightKg}
                    onChange={(e) => updateSetField(idx, 'weightKg', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-base font-medium text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
                  />
                </div>

                <div className="col-span-3">
                  <label htmlFor={`reps-${idx}`} className="sr-only">
                    Set {setRow.setNumber} repetitions
                  </label>
                  <input
                    id={`reps-${idx}`}
                    type="number"
                    min="1"
                    value={setRow.reps}
                    onChange={(e) => updateSetField(idx, 'reps', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-base font-medium text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
                  />
                </div>

                <div className="col-span-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => toggleSetCompleted(idx)}
                    aria-label={`Mark set ${setRow.setNumber} complete`}
                    className={`w-12 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      setRow.completed
                        ? 'bg-[#D4FF1A] text-black'
                        : 'bg-[#191B1D] border border-[#292C2E] text-[#8A8F94] hover:text-white'
                    }`}
                  >
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Previous / Next Exercise Navigation */}
        <footer className="flex items-center justify-between gap-4 pt-2 pb-8">
          <button
            type="button"
            disabled={exerciseIdx === 0}
            onClick={() => handleGoExercise(exerciseIdx - 1)}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border text-sm font-medium min-h-[48px] transition-colors ${
              exerciseIdx === 0
                ? 'bg-[#111111] border-[#292C2E] text-[#6B6B6B] cursor-not-allowed'
                : 'bg-[#191B1D] border-[#292C2E] text-white hover:border-[#3E4246]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Exercise</span>
          </button>

          {exerciseIdx < exercises.length - 1 ? (
            <button
              type="button"
              onClick={() => handleGoExercise(exerciseIdx + 1)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] min-h-[48px] transition-colors"
            >
              <span>Next Exercise</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishWorkout}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] min-h-[48px] transition-colors"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              <span>Complete Workout</span>
            </button>
          )}
        </footer>
      </main>
    </div>
  );
};
