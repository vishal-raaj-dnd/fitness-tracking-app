import type {
  ActiveDailyMissionState,
  DailyMission,
  UserProfile,
} from '../../types';

export interface MissionSelectionContext {
  profile: Pick<
    UserProfile,
    'fitnessGoal' | 'experienceLevel' | 'workoutLocation' | 'exerciseRestrictions'
  >;
  isRestDay: boolean;
  recentTrainingLoad: 'low' | 'moderate' | 'high';
  excludeMissionIds?: string[];
}

/**
 * Filters missions to strictly respect coach-approved health & safety restrictions.
 * Never encourages members to train through illness, injury, or medical restrictions.
 */
export function filterSafeMissions(
  library: DailyMission[],
  context: MissionSelectionContext
): DailyMission[] {
  const excluded = new Set(context.excludeMissionIds ?? []);
  return library.filter((mission) => {
    if (excluded.has(mission.id)) return false;

    // Strictly exclude missions contraindicated by user's health restrictions
    const hasUnsafeRestriction = mission.avoidRestrictions.some((r) =>
      context.profile.exerciseRestrictions.includes(r)
    );
    if (hasUnsafeRestriction) return false;

    // On rest days or high training load, favour recovery, walk, mobility, or rest
    if (context.isRestDay && mission.category === 'Workout') return false;
    if (context.recentTrainingLoad === 'high' && mission.category === 'Workout') return false;

    // Match workout location unless it's a walk/recovery/rest mission
    if (
      mission.category === 'Workout' &&
      !mission.suitableLocations.includes(context.profile.workoutLocation)
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Selects a personalized Daily Mission based on member context.
 */
export function selectDailyMission(
  library: DailyMission[],
  context: MissionSelectionContext,
  seedIndex = 0
): DailyMission {
  const safePool = filterSafeMissions(library, context);
  const goalMatched = safePool.filter((m) =>
    m.suitableGoals.includes(context.profile.fitnessGoal)
  );
  const candidates = goalMatched.length > 0 ? goalMatched : safePool;

  if (candidates.length === 0) {
    // Fallback to gentle rest/recovery mission from library or guaranteed safe default
    const fallback = library.find((m) => m.isRecoveryOrRest);
    if (fallback) return fallback;
    return {
      id: 'mission-safe-rest',
      title: '10-Minute Diaphragmatic Breathing & Reset',
      category: 'Rest',
      durationMinutes: 10,
      description:
        'Unwind with slow nasal breathing and gentle posture decompression to support nervous system recovery.',
      safetyTags: [],
      avoidRestrictions: [],
      suitableLocations: ['commercial_gym', 'home_dumbbells', 'bodyweight'],
      suitableGoals: ['fat_loss', 'lean_recomp', 'muscle_gain', 'athletic_conditioning'],
      isRecoveryOrRest: true,
    };
  }

  return candidates[Math.abs(seedIndex) % candidates.length];
}

/**
 * Transitions the Surprise Daily Mission through its lifecycle:
 * reveal -> accept -> swapOnce -> skip -> complete.
 */
export function revealMission(state: ActiveDailyMissionState): ActiveDailyMissionState {
  if (state.status !== 'unrevealed') return state;
  return { ...state, status: 'revealed' };
}

export function acceptMission(state: ActiveDailyMissionState): ActiveDailyMissionState {
  if (state.status === 'completed' || state.status === 'skipped') return state;
  return { ...state, status: 'accepted' };
}

export function swapMissionOnce(
  state: ActiveDailyMissionState,
  library: DailyMission[],
  context: MissionSelectionContext
): ActiveDailyMissionState {
  if (state.swappedOnce || state.status === 'completed') return state;
  const nextMission = selectDailyMission(
    library,
    {
      ...context,
      excludeMissionIds: [state.missionId, ...(context.excludeMissionIds ?? [])],
    },
    1
  );
  return {
    missionId: nextMission.id,
    status: 'revealed',
    swappedOnce: true,
    previousMissionId: state.missionId,
  };
}

export function skipMission(state: ActiveDailyMissionState): ActiveDailyMissionState {
  if (state.status === 'completed') return state;
  return { ...state, status: 'skipped' };
}

export function completeMission(state: ActiveDailyMissionState): ActiveDailyMissionState {
  return { ...state, status: 'completed' };
}
