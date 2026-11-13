import type { SetLogEntry } from '../../types';

export function calculateExerciseVolume(sets: SetLogEntry[]): number {
  return sets.reduce((sum, s) => {
    if (!s.completed) return sum;
    return sum + s.reps * s.weightKg;
  }, 0);
}

export function calculateSessionVolume(logsByExercise: Record<string, SetLogEntry[]>): number {
  return Object.values(logsByExercise).reduce(
    (total, sets) => total + calculateExerciseVolume(sets),
    0
  );
}

export function formatRestTimer(secondsRemaining: number): string {
  const safe = Math.max(0, Math.floor(secondsRemaining));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
