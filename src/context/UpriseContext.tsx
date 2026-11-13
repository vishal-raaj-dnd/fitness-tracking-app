import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type {
  ActiveDailyMissionState,
  Badge,
  BodyMeasurementSnapshot,
  DailyMission,
  Exercise,
  FoodItem,
  HeatmapDay,
  MemberStreakState,
  NutritionTargets,
  ScheduledMeal,
  SetLogEntry,
  StreakRuleConfig,
  UserProfile,
  UserRole,
  WeightRecord,
  WorkoutDay,
  WorkoutHistoryEntry,
} from '../types';
import { SEED_COACH_ROSTER, SEED_USERS, type CoachRosterMember } from '../data/users/seedUsers';
import {
  SEED_FOOD_DATABASE,
  SEED_MEALS,
  SEED_NUTRITION_TARGETS,
} from '../data/meals/seedMeals';
import {
  SEED_EXERCISES,
  SEED_WEEKLY_SPLIT,
  SEED_WORKOUT_HISTORY,
} from '../data/workouts/seedWorkouts';
import { SEED_DAILY_MISSIONS } from '../data/missions/seedMissions';
import {
  buildSeedHeatmap,
  SEED_BADGES,
  SEED_MEASUREMENTS,
  SEED_STREAK_STATE,
  SEED_WEIGHT_HISTORY,
} from '../data/progress/seedProgress';
import {
  applyQualifyingActionToStreak,
  computeStreakStatus,
  DEFAULT_STREAK_RULES,
  grantCoachRestPass,
  hasQualifyingActionToday,
} from '../services/streaks/streakEngine';
import {
  acceptMission,
  completeMission,
  revealMission,
  selectDailyMission,
  skipMission,
  swapMissionOnce,
} from '../services/missions/missionSelector';
import { calculateDailyNutrition } from '../services/meals/nutritionCalc';

const STORAGE_KEY = 'uprise_mvp_state_v1';

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
}

interface PersistedState {
  currentUserId: string;
  users: UserProfile[];
  meals: ScheduledMeal[];
  customFoods: FoodItem[];
  nutritionTargets: NutritionTargets;
  foodDatabase: FoodItem[];
  weeklySplit: WorkoutDay[];
  exercises: Exercise[];
  todayWorkoutId: string;
  todayWorkoutCompleted: boolean;
  workoutHistory: WorkoutHistoryEntry[];
  weightHistory: WeightRecord[];
  measurements: {
    initial: BodyMeasurementSnapshot;
    current: BodyMeasurementSnapshot;
  };
  heatmap: HeatmapDay[];
  streakState: MemberStreakState;
  streakRules: StreakRuleConfig;
  badges: Badge[];
  missionLibrary: DailyMission[];
  activeMissionState: ActiveDailyMissionState;
  coachRoster: CoachRosterMember[];
  notifications: AppNotification[];
  todayQualifiedRecorded: boolean;
}

function createInitialState(): PersistedState {
  const defaultMember = SEED_USERS[0];
  const initialMission = selectDailyMission(SEED_DAILY_MISSIONS, {
    profile: defaultMember,
    isRestDay: false,
    recentTrainingLoad: 'moderate',
  });

  return {
    currentUserId: defaultMember.id,
    users: SEED_USERS,
    meals: SEED_MEALS,
    customFoods: [],
    nutritionTargets: SEED_NUTRITION_TARGETS,
    foodDatabase: SEED_FOOD_DATABASE,
    weeklySplit: SEED_WEEKLY_SPLIT,
    exercises: SEED_EXERCISES,
    todayWorkoutId: 'day-mon',
    todayWorkoutCompleted: false,
    workoutHistory: SEED_WORKOUT_HISTORY,
    weightHistory: SEED_WEIGHT_HISTORY,
    measurements: SEED_MEASUREMENTS,
    heatmap: buildSeedHeatmap(),
    streakState: SEED_STREAK_STATE,
    streakRules: DEFAULT_STREAK_RULES,
    badges: SEED_BADGES,
    missionLibrary: SEED_DAILY_MISSIONS,
    activeMissionState: {
      missionId: initialMission.id,
      status: 'unrevealed',
      swappedOnce: false,
    },
    coachRoster: SEED_COACH_ROSTER,
    notifications: [
      {
        id: 'notif-1',
        title: '14-Day Streak Milestone Unlocked',
        detail: 'You earned +1 Rest Pass. Wallet balance: 2 of 3 passes.',
        time: 'Yesterday',
        read: false,
      },
      {
        id: 'notif-2',
        title: 'Coach Vikram reviewed Day 23',
        detail: 'Keep neutral spine cues on Barbell RDL today. Great adherence this week.',
        time: '2h ago',
        read: false,
      },
    ],
    todayQualifiedRecorded: false,
  };
}

function loadPersistedState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const defaults = createInitialState();
    return {
      ...defaults,
      ...parsed,
    };
  } catch {
    return createInitialState();
  }
}

interface UpriseContextValue {
  currentUser: UserProfile;
  users: UserProfile[];
  meals: ScheduledMeal[];
  customFoods: FoodItem[];
  nutritionTargets: NutritionTargets;
  foodDatabase: FoodItem[];
  weeklySplit: WorkoutDay[];
  exercises: Exercise[];
  todayWorkout: WorkoutDay;
  todayWorkoutCompleted: boolean;
  workoutHistory: WorkoutHistoryEntry[];
  weightHistory: WeightRecord[];
  measurements: { initial: BodyMeasurementSnapshot; current: BodyMeasurementSnapshot };
  heatmap: HeatmapDay[];
  streakState: MemberStreakState;
  streakRules: StreakRuleConfig;
  badges: Badge[];
  missionLibrary: DailyMission[];
  activeMission: DailyMission;
  activeMissionState: ActiveDailyMissionState;
  coachRoster: CoachRosterMember[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  // Actions
  switchRole: (role: UserRole) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  completeOnboarding: (profileData: Partial<UserProfile>) => void;
  toggleMealCompleted: (mealId: string) => void;
  selectMealAlternative: (mealId: string, alternativeId: string | undefined) => void;
  addCustomFood: (food: Omit<FoodItem, 'id'>) => void;
  removeCustomFood: (foodId: string) => void;
  completeWorkoutSession: (params: {
    durationMinutes: number;
    logsByExercise: Record<string, SetLogEntry[]>;
    totalVolumeKg: number;
    exercisesCompleted: number;
    totalExercises: number;
  }) => void;
  selectTodayWorkoutDay: (dayId: string) => void;
  checkInRestDay: () => void;
  revealDailyMission: () => void;
  acceptDailyMission: () => void;
  swapDailyMission: () => void;
  skipDailyMission: () => void;
  completeDailyMission: () => void;
  addWeightRecord: (weightKg: number, note?: string) => void;
  updateCurrentMeasurements: (next: Partial<BodyMeasurementSnapshot>) => void;
  markNotificationsRead: () => void;
  grantRestPassToMember: (memberId: string, reason: string) => void;
  assignCoachToMember: (memberId: string, coachId: string) => void;
  addFoodToDatabase: (food: Omit<FoodItem, 'id'>) => void;
  addExerciseToLibrary: (exercise: Omit<Exercise, 'id'>) => void;
  addMissionToLibrary: (mission: Omit<DailyMission, 'id'>) => void;
  updateStreakRules: (patch: Partial<StreakRuleConfig>) => void;
  resetDemoData: () => void;
}

const UpriseContext = createContext<UpriseContextValue | null>(null);

export const UpriseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(() => loadPersistedState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors in private mode
    }
  }, [state]);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? state.users[0],
    [state.users, state.currentUserId]
  );

  const todayWorkout = useMemo(
    () => state.weeklySplit.find((d) => d.id === state.todayWorkoutId) ?? state.weeklySplit[0],
    [state.weeklySplit, state.todayWorkoutId]
  );

  const activeMission = useMemo(
    () =>
      state.missionLibrary.find((m) => m.id === state.activeMissionState.missionId) ??
      state.missionLibrary[0],
    [state.missionLibrary, state.activeMissionState.missionId]
  );

  const unreadNotificationsCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications]
  );

  // Helper that syncs today's heatmap & streak whenever a qualifying action happens
  const syncQualifyingProgress = (prev: PersistedState): PersistedState => {
    const nutritionTotals = calculateDailyNutrition(prev.meals, prev.customFoods);
    const missionDone = prev.activeMissionState.status === 'completed';
    const currentWorkout =
      prev.weeklySplit.find((d) => d.id === prev.todayWorkoutId) ?? prev.weeklySplit[0];

    const qualified = hasQualifyingActionToday(
      {
        workoutCompleted: prev.todayWorkoutCompleted,
        mealsCompletedCount: nutritionTotals.completedMealsCount,
        missionCompleted: missionDone,
        isScheduledRestDay: currentWorkout.isRestDay,
        restDayCheckedIn: prev.streakState.restDayCheckedInToday,
      },
      prev.streakRules
    );

    const updatedHeatmap = prev.heatmap.map((day) => {
      if (day.dayNumber !== currentUser.programmeDay) return day;
      return {
        ...day,
        workoutDone: prev.todayWorkoutCompleted,
        mealsDoneCount: nutritionTotals.completedMealsCount,
        missionDone,
        status: qualified
          ? currentWorkout.isRestDay && !prev.todayWorkoutCompleted
            ? ('rest' as const)
            : ('active' as const)
          : ('upcoming' as const),
      };
    });

    if (qualified && !prev.todayQualifiedRecorded) {
      const { nextState, milestonePassAwarded } = applyQualifyingActionToStreak(
        prev.streakState,
        false,
        prev.streakRules
      );
      const nextCoachRoster = prev.coachRoster.map((m) =>
        m.id === 'member-arjun'
          ? {
              ...m,
              currentStreak: nextState.currentStreak,
              streakStatus: nextState.status,
              restPassBalance: nextState.restPassBalance,
              missionCompletedToday: missionDone,
            }
          : m
      );
      return {
        ...prev,
        heatmap: updatedHeatmap,
        streakState: nextState,
        coachRoster: nextCoachRoster,
        todayQualifiedRecorded: true,
        notifications: milestonePassAwarded
          ? [
              {
                id: `notif-ms-${Date.now()}`,
                title: `${nextState.currentStreak}-Day Streak Milestone`,
                detail: 'Earned +1 Rest Pass for consistent execution.',
                time: 'Just now',
                read: false,
              },
              ...prev.notifications,
            ]
          : prev.notifications,
      };
    }

    const nextStatus = computeStreakStatus({
      todaySnapshot: {
        workoutCompleted: prev.todayWorkoutCompleted,
        mealsCompletedCount: nutritionTotals.completedMealsCount,
        missionCompleted: missionDone,
        isScheduledRestDay: currentWorkout.isRestDay,
        restDayCheckedIn: prev.streakState.restDayCheckedInToday,
      },
      preferredWorkoutTime: currentUser.preferredWorkoutTime,
      currentTimeHHmm: '14:00',
      rules: prev.streakRules,
    });

    return {
      ...prev,
      heatmap: updatedHeatmap,
      streakState: {
        ...prev.streakState,
        status: qualified ? 'Active' : nextStatus,
      },
    };
  };

  const switchRole = (role: UserRole) => {
    setState((prev) => {
      const targetUser = prev.users.find((u) => u.role === role) ?? prev.users[0];
      return { ...prev, currentUserId: targetUser.id };
    });
  };

  const updateProfile = (patch: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === prev.currentUserId ? { ...u, ...patch } : u)),
    }));
  };

  const completeOnboarding = (profileData: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === 'member-arjun' ? { ...u, ...profileData, onboardingComplete: true } : u
      ),
      currentUserId: 'member-arjun',
    }));
  };

  const toggleMealCompleted = (mealId: string) => {
    setState((prev) => {
      const nextMeals = prev.meals.map((m) =>
        m.id === mealId
          ? {
              ...m,
              completed: !m.completed,
              loggedAt: !m.completed
                ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : undefined,
            }
          : m
      );
      return syncQualifyingProgress({ ...prev, meals: nextMeals });
    });
  };

  const selectMealAlternative = (mealId: string, alternativeId: string | undefined) => {
    setState((prev) => ({
      ...prev,
      meals: prev.meals.map((m) =>
        m.id === mealId ? { ...m, selectedAlternativeId: alternativeId } : m
      ),
    }));
  };

  const addCustomFood = (food: Omit<FoodItem, 'id'>) => {
    setState((prev) => {
      const nextCustomFoods = [
        ...prev.customFoods,
        { ...food, id: `custom-${Date.now()}` },
      ];
      return { ...prev, customFoods: nextCustomFoods };
    });
  };

  const removeCustomFood = (foodId: string) => {
    setState((prev) => ({
      ...prev,
      customFoods: prev.customFoods.filter((f) => f.id !== foodId),
    }));
  };

  const completeWorkoutSession = (params: {
    durationMinutes: number;
    logsByExercise: Record<string, SetLogEntry[]>;
    totalVolumeKg: number;
    exercisesCompleted: number;
    totalExercises: number;
  }) => {
    setState((prev) => {
      const workout =
        prev.weeklySplit.find((d) => d.id === prev.todayWorkoutId) ?? prev.weeklySplit[0];
      const newEntry: WorkoutHistoryEntry = {
        id: `wh-${Date.now()}`,
        date: `Day ${currentUser.programmeDay} · Today`,
        workoutTitle: workout.title,
        durationMinutes: Math.max(1, params.durationMinutes),
        totalVolumeKg: params.totalVolumeKg,
        exercisesCompleted: params.exercisesCompleted,
        totalExercises: params.totalExercises,
      };
      return syncQualifyingProgress({
        ...prev,
        todayWorkoutCompleted: true,
        workoutHistory: [newEntry, ...prev.workoutHistory],
      });
    });
  };

  const selectTodayWorkoutDay = (dayId: string) => {
    setState((prev) => ({ ...prev, todayWorkoutId: dayId }));
  };

  const checkInRestDay = () => {
    setState((prev) =>
      syncQualifyingProgress({
        ...prev,
        streakState: { ...prev.streakState, restDayCheckedInToday: true },
      })
    );
  };

  const revealDailyMission = () => {
    setState((prev) => ({
      ...prev,
      activeMissionState: revealMission(prev.activeMissionState),
    }));
  };

  const acceptDailyMission = () => {
    setState((prev) => ({
      ...prev,
      activeMissionState: acceptMission(prev.activeMissionState),
    }));
  };

  const swapDailyMission = () => {
    setState((prev) => {
      const nextMissionState = swapMissionOnce(prev.activeMissionState, prev.missionLibrary, {
        profile: currentUser,
        isRestDay: todayWorkout.isRestDay,
        recentTrainingLoad: 'moderate',
      });
      return {
        ...prev,
        activeMissionState: nextMissionState,
        streakState: {
          ...prev.streakState,
          swappedMissionsCount: prev.streakState.swappedMissionsCount + 1,
        },
      };
    });
  };

  const skipDailyMission = () => {
    setState((prev) => ({
      ...prev,
      activeMissionState: skipMission(prev.activeMissionState),
      streakState: {
        ...prev.streakState,
        skippedMissionsCount: prev.streakState.skippedMissionsCount + 1,
      },
    }));
  };

  const completeDailyMission = () => {
    setState((prev) =>
      syncQualifyingProgress({
        ...prev,
        activeMissionState: completeMission(prev.activeMissionState),
        streakState: {
          ...prev.streakState,
          completedMissionsCount: prev.streakState.completedMissionsCount + 1,
        },
      })
    );
  };

  const addWeightRecord = (weightKg: number, note?: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setState((prev) => ({
      ...prev,
      weightHistory: [
        ...prev.weightHistory,
        { id: `w-${Date.now()}`, date: todayStr, weightKg, note },
      ],
      users: prev.users.map((u) =>
        u.id === prev.currentUserId ? { ...u, currentWeightKg: weightKg } : u
      ),
    }));
  };

  const updateCurrentMeasurements = (next: Partial<BodyMeasurementSnapshot>) => {
    setState((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        current: {
          ...prev.measurements.current,
          ...next,
          date: new Date().toISOString().slice(0, 10),
        },
      },
    }));
  };

  const markNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const grantRestPassToMember = (memberId: string, reason: string) => {
    setState((prev) => {
      const updatedRoster = prev.coachRoster.map((m) =>
        m.id === memberId
          ? {
              ...m,
              restPassBalance: Math.min(prev.streakRules.maxRestPassBalance, m.restPassBalance + 1),
            }
          : m
      );
      const updatedMemberStreak =
        memberId === 'member-arjun'
          ? grantCoachRestPass(
              prev.streakState,
              {
                memberId,
                coachName: 'Vikram Rao',
                reason,
                amount: 1,
                grantedAt: new Date().toISOString().slice(0, 10),
              },
              prev.streakRules
            )
          : prev.streakState;

      return {
        ...prev,
        coachRoster: updatedRoster,
        streakState: updatedMemberStreak,
        notifications:
          memberId === 'member-arjun'
            ? [
                {
                  id: `notif-rp-${Date.now()}`,
                  title: 'Coach Granted +1 Rest Pass',
                  detail: reason,
                  time: 'Just now',
                  read: false,
                },
                ...prev.notifications,
              ]
            : prev.notifications,
      };
    });
  };

  const assignCoachToMember = (memberId: string, coachId: string) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === memberId ? { ...u, assignedCoachId: coachId } : u
      ),
    }));
  };

  const addFoodToDatabase = (food: Omit<FoodItem, 'id'>) => {
    setState((prev) => ({
      ...prev,
      foodDatabase: [{ ...food, id: `food-${Date.now()}` }, ...prev.foodDatabase],
    }));
  };

  const addExerciseToLibrary = (exercise: Omit<Exercise, 'id'>) => {
    setState((prev) => ({
      ...prev,
      exercises: [{ ...exercise, id: `ex-${Date.now()}` }, ...prev.exercises],
    }));
  };

  const addMissionToLibrary = (mission: Omit<DailyMission, 'id'>) => {
    setState((prev) => ({
      ...prev,
      missionLibrary: [{ ...mission, id: `mis-${Date.now()}` }, ...prev.missionLibrary],
    }));
  };

  const updateStreakRules = (patch: Partial<StreakRuleConfig>) => {
    setState((prev) => ({
      ...prev,
      streakRules: { ...prev.streakRules, ...patch },
    }));
  };

  const resetDemoData = () => {
    const fresh = createInitialState();
    setState(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // ignore
    }
  };

  return (
    <UpriseContext.Provider
      value={{
        currentUser,
        users: state.users,
        meals: state.meals,
        customFoods: state.customFoods,
        nutritionTargets: state.nutritionTargets,
        foodDatabase: state.foodDatabase,
        weeklySplit: state.weeklySplit,
        exercises: state.exercises,
        todayWorkout,
        todayWorkoutCompleted: state.todayWorkoutCompleted,
        workoutHistory: state.workoutHistory,
        weightHistory: state.weightHistory,
        measurements: state.measurements,
        heatmap: state.heatmap,
        streakState: state.streakState,
        streakRules: state.streakRules,
        badges: state.badges,
        missionLibrary: state.missionLibrary,
        activeMission,
        activeMissionState: state.activeMissionState,
        coachRoster: state.coachRoster,
        notifications: state.notifications,
        unreadNotificationsCount,
        switchRole,
        updateProfile,
        completeOnboarding,
        toggleMealCompleted,
        selectMealAlternative,
        addCustomFood,
        removeCustomFood,
        completeWorkoutSession,
        selectTodayWorkoutDay,
        checkInRestDay,
        revealDailyMission,
        acceptDailyMission,
        swapDailyMission,
        skipDailyMission,
        completeDailyMission,
        addWeightRecord,
        updateCurrentMeasurements,
        markNotificationsRead,
        grantRestPassToMember,
        assignCoachToMember,
        addFoodToDatabase,
        addExerciseToLibrary,
        addMissionToLibrary,
        updateStreakRules,
        resetDemoData,
      }}
    >
      {children}
    </UpriseContext.Provider>
  );
};

export function useUprise(): UpriseContextValue {
  const ctx = useContext(UpriseContext);
  if (!ctx) {
    throw new Error('useUprise must be used within UpriseProvider');
  }
  return ctx;
}
