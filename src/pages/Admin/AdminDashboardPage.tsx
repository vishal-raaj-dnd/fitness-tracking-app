import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  BarChart3,
  Dumbbell,
  Flame,
  Plus,
  Sparkles,
  Upload,
  Users,
  Utensils,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useUprise } from '../../context/UpriseContext';
import { UpriseLogo } from '../../components/layout/UpriseLogo';
import { IMG_HERO_STRENGTH } from '../../data/workouts/seedWorkouts';

type AdminTab = 'analytics' | 'users' | 'nutrition' | 'training' | 'missions' | 'rules';

const ENGAGEMENT_CHART_DATA = [
  { week: 'W1', workoutPct: 86, mealPct: 81, missionPct: 64 },
  { week: 'W2', workoutPct: 89, mealPct: 84, missionPct: 70 },
  { week: 'W3', workoutPct: 91, mealPct: 87, missionPct: 73 },
  { week: 'W4', workoutPct: 92, mealPct: 88, missionPct: 76 },
];

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    users,
    foodDatabase,
    exercises,
    missionLibrary,
    streakRules,
    badges,
    coachRoster,
    assignCoachToMember,
    addFoodToDatabase,
    addExerciseToLibrary,
    addMissionToLibrary,
    updateStreakRules,
    switchRole,
  } = useUprise();

  const [tab, setTab] = useState<AdminTab>('analytics');

  // Food add form
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodPortion, setNewFoodPortion] = useState('100g');
  const [newFoodCal, setNewFoodCal] = useState('160');

  // Exercise add + video upload placeholder
  const [newExName, setNewExName] = useState('');
  const [newExMuscle, setNewExMuscle] = useState('');
  const [newExVideoFile, setNewExVideoFile] = useState('form_demo_upload.mp4');

  // Mission add form
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionDuration, setNewMissionDuration] = useState('10');

  const members = users.filter((u) => u.role === 'member');
  const coaches = users.filter((u) => u.role === 'coach');

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;
    addFoodToDatabase({
      name: newFoodName.trim(),
      portion: newFoodPortion.trim() || '1 serving',
      calories: Number(newFoodCal) || 150,
      proteinG: 12,
      carbsG: 18,
      fatG: 4,
    });
    setNewFoodName('');
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim() || !newExMuscle.trim()) return;
    addExerciseToLibrary({
      name: newExName.trim(),
      muscleGroup: newExMuscle.trim(),
      sets: 3,
      reps: '10–12',
      restSeconds: 90,
      imageUrl: IMG_HERO_STRENGTH,
      videoLabel: `Uploaded · ${newExVideoFile}`,
      instructions: ['Maintain controlled eccentric tempo and full range of motion.'],
      contraindications: [],
    });
    setNewExName('');
    setNewExMuscle('');
  };

  const handleAddMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionTitle.trim()) return;
    addMissionToLibrary({
      title: newMissionTitle.trim(),
      category: 'Mobility',
      durationMinutes: Number(newMissionDuration) || 10,
      description: 'Admin-published SHRED 90 daily engagement mission.',
      safetyTags: [],
      avoidRestrictions: [],
      suitableLocations: ['commercial_gym', 'home_dumbbells', 'bodyweight'],
      suitableGoals: ['fat_loss', 'lean_recomp', 'muscle_gain', 'athletic_conditioning'],
      isRecoveryOrRest: true,
    });
    setNewMissionTitle('');
  };

  const TABS: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users & Coaches', icon: Users },
    { id: 'nutrition', label: 'Meals & Foods', icon: Utensils },
    { id: 'training', label: 'Workouts & Videos', icon: Dumbbell },
    { id: 'missions', label: 'Mission Library', icon: Sparkles },
    { id: 'rules', label: 'Streaks & Badges', icon: Flame },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Admin Top Header */}
      <header className="border-b border-[#292C2E] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UpriseLogo size="sm" />
            <span className="text-xs font-medium text-[#8A8F94] hidden sm:inline">
              Administrator Console · NXTGEN SHRED 90
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              switchRole('member');
              navigate('/');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[40px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Member App</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Admin Navigation Rail */}
        <aside className="lg:col-span-3 space-y-1.5">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                  active
                    ? 'bg-[#191B1D] text-white border border-[#292C2E]'
                    : 'text-[#8A8F94] hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#D4FF1A]' : 'text-[#6B6B6B]'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </aside>

        {/* Admin Main Workspace */}
        <main className="lg:col-span-9 space-y-6">
          {tab === 'analytics' && (
            <section className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-white">
                  Engagement Analytics
                </h1>
                <p className="text-xs text-[#8A8F94] mt-1">
                  Programme-wide SHRED 90 adherence &amp; module completion (Demo Cohort Data)
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-5">
                  <p className="text-xs text-[#8A8F94]">Active Members</p>
                  <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">
                    {members.length}
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-5">
                  <p className="text-xs text-[#8A8F94]">Avg Adherence</p>
                  <p className="font-display text-2xl font-bold text-[#D4FF1A] mt-1 tabular-nums">
                    {Math.round(
                      coachRoster.reduce((acc, m) => acc + m.adherencePct, 0) /
                        Math.max(1, coachRoster.length)
                    )}
                    %
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-5">
                  <p className="text-xs text-[#8A8F94]">Exercise Library</p>
                  <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">
                    {exercises.length}
                  </p>
                </div>
                <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-5">
                  <p className="text-xs text-[#8A8F94]">Daily Missions</p>
                  <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">
                    {missionLibrary.length}
                  </p>
                </div>
              </div>

              <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6">
                <h2 className="font-display text-base font-semibold text-white mb-4">
                  Weekly Module Adherence (%)
                </h2>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ENGAGEMENT_CHART_DATA}>
                      <CartesianGrid stroke="#292C2E" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="week" stroke="#8A8F94" axisLine={false} tickLine={false} />
                      <YAxis stroke="#8A8F94" axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#191B1D',
                          borderColor: '#292C2E',
                          borderRadius: '12px',
                          color: '#FFFFFF',
                        }}
                      />
                      <Bar dataKey="workoutPct" name="Workouts %" fill="#D4FF1A" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="mealPct" name="Meals %" fill="#FFFFFF" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="missionPct" name="Missions %" fill="#6B6B6B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          )}

          {tab === 'users' && (
            <section className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-5">
              <h1 className="font-display text-xl font-bold text-white">
                User &amp; Coach Assignment Management
              </h1>
              <div className="divide-y divide-[#292C2E]">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{member.fullName}</p>
                      <p className="text-xs text-[#8A8F94]">
                        {member.email} · Day {member.programmeDay}/{member.programmeTotalDays}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor={`assign-${member.id}`} className="text-xs text-[#8A8F94]">
                        Assigned Coach:
                      </label>
                      <select
                        id={`assign-${member.id}`}
                        value={member.assignedCoachId ?? ''}
                        onChange={(e) => assignCoachToMember(member.id, e.target.value)}
                        className="px-3 py-2 rounded-xl bg-[#191B1D] border border-[#292C2E] text-xs text-white"
                      >
                        {coaches.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'nutrition' && (
            <section className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-5">
              <div>
                <h1 className="font-display text-xl font-bold text-white">
                  Meal Plan &amp; Indian Food Database
                </h1>
                <p className="text-xs text-[#8A8F94] mt-1">
                  Manage verified food items available to coaches and member meal plans.
                </p>
              </div>

              <form onSubmit={handleAddFood} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  placeholder="Food item name"
                  className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white"
                />
                <input
                  type="text"
                  value={newFoodPortion}
                  onChange={(e) => setNewFoodPortion(e.target.value)}
                  placeholder="Portion"
                  className="px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold min-h-[44px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Food</span>
                </button>
              </form>

              <div className="divide-y divide-[#292C2E] border-t border-[#292C2E]">
                {foodDatabase.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-xs text-[#8A8F94]">{item.portion}</p>
                    </div>
                    <span className="text-xs text-[#9BA1A6] tabular-nums">
                      {item.calories} kcal · P {item.proteinG}g
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'training' && (
            <section className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-5">
              <div>
                <h1 className="font-display text-xl font-bold text-white">
                  Exercise Library &amp; Video Hosting Queue
                </h1>
                <p className="text-xs text-[#8A8F94] mt-1">
                  Cloud video upload boundary ready — attach MP4 demonstration clips per exercise.
                </p>
              </div>

              <form onSubmit={handleAddExercise} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  placeholder="Exercise name"
                  className="px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white"
                />
                <input
                  type="text"
                  value={newExMuscle}
                  onChange={(e) => setNewExMuscle(e.target.value)}
                  placeholder="Target muscle group"
                  className="px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white"
                />
                <div className="flex items-center gap-2">
                  <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-xs text-[#9BA1A6] cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#D4FF1A]" />
                    <span className="truncate">{newExVideoFile}</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="sr-only"
                      onChange={(e) =>
                        setNewExVideoFile(e.target.files?.[0]?.name ?? 'form_demo_upload.mp4')
                      }
                    />
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold min-h-[44px]"
                  >
                    Add
                  </button>
                </div>
              </form>

              <div className="divide-y divide-[#292C2E] border-t border-[#292C2E]">
                {exercises.map((ex) => (
                  <div key={ex.id} className="py-3 flex items-center justify-between gap-4 text-sm">
                    <div>
                      <p className="text-white font-medium">{ex.name}</p>
                      <p className="text-xs text-[#8A8F94]">
                        {ex.muscleGroup} · {ex.sets} × {ex.reps}
                      </p>
                    </div>
                    <span className="text-xs text-[#D4FF1A]">{ex.videoLabel ?? 'Ready'}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'missions' && (
            <section className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-5">
              <h1 className="font-display text-xl font-bold text-white">Daily Mission Library</h1>

              <form onSubmit={handleAddMission} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newMissionTitle}
                  onChange={(e) => setNewMissionTitle(e.target.value)}
                  placeholder="Mission title (e.g. 10-Min Ankle Mobility Reset)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white"
                />
                <input
                  type="number"
                  min="5"
                  max="20"
                  value={newMissionDuration}
                  onChange={(e) => setNewMissionDuration(e.target.value)}
                  className="w-24 px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold min-h-[44px]"
                >
                  Publish Mission
                </button>
              </form>

              <div className="divide-y divide-[#292C2E] border-t border-[#292C2E]">
                {missionLibrary.map((m) => (
                  <div key={m.id} className="py-3 flex items-center justify-between gap-4 text-sm">
                    <div>
                      <p className="text-white font-medium">{m.title}</p>
                      <p className="text-xs text-[#8A8F94]">
                        {m.category} · {m.durationMinutes} min
                      </p>
                    </div>
                    <span className="text-xs text-[#9BA1A6]">
                      {m.isRecoveryOrRest ? 'Recovery safe' : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'rules' && (
            <section className="space-y-6">
              <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-4">
                <h1 className="font-display text-xl font-bold text-white">
                  Streak &amp; Rest Pass Configuration
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#8A8F94] mb-1.5">
                      Starting Rest Passes
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={streakRules.startingRestPasses}
                      onChange={(e) =>
                        updateStreakRules({ startingRestPasses: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8A8F94] mb-1.5">
                      Milestone Days for +1 Pass
                    </label>
                    <input
                      type="number"
                      min="7"
                      max="30"
                      value={streakRules.milestoneDaysForPass}
                      onChange={(e) =>
                        updateStreakRules({ milestoneDaysForPass: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8A8F94] mb-1.5">
                      Max Rest Pass Wallet Cap
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={streakRules.maxRestPassBalance}
                      onChange={(e) =>
                        updateStreakRules({ maxRestPassBalance: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4FF1A]" />
                  <h2 className="font-display text-base font-semibold text-white">
                    Badge &amp; Milestone Configuration
                  </h2>
                </div>
                <div className="divide-y divide-[#292C2E]">
                  {badges.map((b) => (
                    <div key={b.id} className="py-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="text-white font-medium">{b.title}</p>
                        <p className="text-xs text-[#8A8F94]">{b.description}</p>
                      </div>
                      <span className="text-xs text-[#D4FF1A] tabular-nums">
                        Day {b.milestoneDays}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
