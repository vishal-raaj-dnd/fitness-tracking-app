import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Award, FileText, Plus, Scale, Snowflake, CheckCircle2 } from 'lucide-react';
import { useUprise } from '../../context/UpriseContext';
import { summarizeHeatmap } from '../../services/streaks/streakEngine';

type DateRangeFilter = '14d' | '30d' | '90d';

export const ProgressPage: React.FC = () => {
  const {
    currentUser,
    weightHistory,
    measurements,
    heatmap,
    streakState,
    badges,
    workoutHistory,
    meals,
    addWeightRecord,
    updateCurrentMeasurements,
  } = useUprise();

  const [range, setRange] = useState<DateRangeFilter>('90d');
  const [newWeight, setNewWeight] = useState('');
  const [newWeightNote, setNewWeightNote] = useState('');
  const [weightError, setWeightError] = useState('');
  const [editingMeasurements, setEditingMeasurements] = useState(false);
  const [waistInput, setWaistInput] = useState(String(measurements.current.waistCm));
  const [chestInput, setChestInput] = useState(String(measurements.current.chestCm));
  const [bodyFatInput, setBodyFatInput] = useState(String(measurements.current.bodyFatPct));
  const [reportOpen, setReportOpen] = useState(false);

  const heatmapSummary = useMemo(() => summarizeHeatmap(heatmap), [heatmap]);

  const filteredWeights = useMemo(() => {
    const count = range === '14d' ? 4 : range === '30d' ? 7 : weightHistory.length;
    return weightHistory.slice(-count).map((w) => ({
      ...w,
      shortDate: w.date.slice(5),
    }));
  }, [weightHistory, range]);

  const weightChange = Number(
    (currentUser.currentWeightKg - currentUser.startWeightKg).toFixed(1)
  );
  const programmePct = Math.round(
    (currentUser.programmeDay / currentUser.programmeTotalDays) * 100
  );
  const completedMealsToday = meals.filter((m) => m.completed).length;

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(newWeight);
    if (Number.isNaN(parsed) || parsed < 30 || parsed > 250) {
      setWeightError('Enter a realistic weight between 30 and 250 kg.');
      return;
    }
    addWeightRecord(Number(parsed.toFixed(1)), newWeightNote.trim() || undefined);
    setNewWeight('');
    setNewWeightNote('');
    setWeightError('');
  };

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    const waist = Number(waistInput);
    const chest = Number(chestInput);
    const bf = Number(bodyFatInput);
    if (waist > 40 && chest > 50 && bf > 4) {
      updateCurrentMeasurements({
        waistCm: Number(waist.toFixed(1)),
        chestCm: Number(chest.toFixed(1)),
        bodyFatPct: Number(bf.toFixed(1)),
      });
      setEditingMeasurements(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#8A8F94]">
            SHRED 90 Transformation Analytics · Demo Seed &amp; Live Logs
          </p>
          <h1 className="font-display text-3xl font-bold text-white mt-1">Progress</h1>
        </div>
        <button
          type="button"
          onClick={() => setReportOpen((o) => !o)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#3E4246] text-sm font-medium text-white transition-colors whitespace-nowrap min-h-[44px]"
        >
          <FileText className="w-4 h-4 text-[#D4FF1A]" />
          <span>Transformation Report (PDF)</span>
        </button>
      </header>

      {/* PDF Report Interface Placeholder */}
      {reportOpen && (
        <section
          aria-label="PDF Transformation Report preview"
          className="bg-[#191B1D] border border-[#292C2E] rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-[#D4FF1A] font-medium">
                Report Preview · PDF Generation Boundary Ready
              </p>
              <h2 className="font-display text-xl font-bold text-white mt-1">
                {currentUser.fullName} — Day {currentUser.programmeDay} Transformation Summary
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setReportOpen(false)}
              className="text-xs text-[#8A8F94] hover:text-white px-2 py-1"
            >
              Close
            </button>
          </div>
          <p className="text-sm text-[#9BA1A6] leading-relaxed">
            Includes baseline-to-current weight curve ({currentUser.startWeightKg} kg →{' '}
            {currentUser.currentWeightKg} kg), waist reduction (
            {(measurements.current.waistCm - measurements.initial.waistCm).toFixed(1)} cm),{' '}
            {heatmapSummary.adherencePct}% adherence across {heatmapSummary.elapsed} elapsed days,
            and coach safety annotations. Connect a server-side PDF renderer in production to export
            signed files.
          </p>
        </section>
      )}

      {/* A. Overview Metrics */}
      <section aria-label="Transformation overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-5">
          <p className="text-xs text-[#8A8F94]">Current Weight</p>
          <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">
            {currentUser.currentWeightKg.toFixed(1)} kg
          </p>
        </div>
        <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-5">
          <p className="text-xs text-[#8A8F94]">Target Weight</p>
          <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">
            {currentUser.targetWeightKg.toFixed(1)} kg
          </p>
        </div>
        <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-5">
          <p className="text-xs text-[#8A8F94]">Weight Change</p>
          <p className="font-display text-2xl font-bold text-[#D4FF1A] mt-1 tabular-nums">
            {weightChange > 0 ? `+${weightChange}` : weightChange} kg
          </p>
        </div>
        <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-5">
          <p className="text-xs text-[#8A8F94]">Programme Completion</p>
          <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">
            {programmePct}% · Day {currentUser.programmeDay}
          </p>
        </div>
      </section>

      {/* B. Weight Tracking Chart + Entry Form */}
      <section
        aria-label="Weight tracking"
        className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">Weight Trend</h2>
            <p className="text-xs text-[#8A8F94] mt-0.5">
              Morning fasted weigh-ins (kg) · Demo history + your live entries
            </p>
          </div>

          <div
            role="group"
            aria-label="Weight chart date range"
            className="inline-flex p-1 rounded-xl bg-[#191B1D] border border-[#292C2E]"
          >
            {(['14d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  range === r ? 'bg-[#D4FF1A] text-black' : 'text-[#8A8F94] hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full" data-testid="weight-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredWeights} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="upriseWeightFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4FF1A" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#D4FF1A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#292C2E" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="shortDate"
                stroke="#6B6B6B"
                tick={{ fill: '#8A8F94', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                stroke="#6B6B6B"
                tick={{ fill: '#8A8F94', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#191B1D',
                  borderColor: '#292C2E',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                }}
                formatter={(value) => [`${value ?? ''} kg`, 'Weight']}
              />
              <Area
                type="monotone"
                dataKey="weightKg"
                stroke="#D4FF1A"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#upriseWeightFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Log New Weight Entry */}
        <form
          onSubmit={handleWeightSubmit}
          className="pt-5 border-t border-[#292C2E] flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
        >
          <div className="sm:w-44">
            <label htmlFor="log-weight-kg" className="block text-xs text-[#8A8F94] mb-1.5">
              Log Weight (kg)
            </label>
            <input
              id="log-weight-kg"
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="e.g. 79.8"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="log-weight-note" className="block text-xs text-[#8A8F94] mb-1.5">
              Optional Note
            </label>
            <input
              id="log-weight-note"
              type="text"
              value={newWeightNote}
              onChange={(e) => setNewWeightNote(e.target.value)}
              placeholder="e.g. Post-rest morning check-in"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white focus:outline-none focus:border-[#D4FF1A]"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] transition-colors whitespace-nowrap min-h-[44px]"
          >
            <Plus className="w-4 h-4" strokeWidth={2.25} />
            <span>Add Entry</span>
          </button>
        </form>
        {weightError && (
          <p role="alert" className="text-xs text-red-400">
            {weightError}
          </p>
        )}

        {/* Recent Weight Records */}
        <div className="divide-y divide-[#292C2E] border-t border-[#292C2E] pt-2">
          {[...weightHistory].reverse().slice(0, 4).map((rec) => (
            <div key={rec.id} className="py-2.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <Scale className="w-4 h-4 text-[#6B6B6B]" />
                <span className="text-white tabular-nums">{rec.date}</span>
                {rec.note && <span className="text-xs text-[#8A8F94]">· {rec.note}</span>}
              </div>
              <span className="font-medium text-white tabular-nums">{rec.weightKg.toFixed(1)} kg</span>
            </div>
          ))}
        </div>
      </section>

      {/* C. Body Measurements Comparison & D. Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <section
          aria-label="Body measurements comparison"
          className="lg:col-span-7 bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold text-white">Body Measurements</h2>
              <p className="text-xs text-[#8A8F94] mt-0.5">
                {measurements.initial.label} vs {measurements.current.label}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditingMeasurements((v) => !v)}
              className="px-3.5 py-2 rounded-xl bg-[#191B1D] border border-[#292C2E] text-xs font-medium text-white hover:border-[#3E4246]"
            >
              {editingMeasurements ? 'Cancel' : 'Update'}
            </button>
          </div>

          {editingMeasurements ? (
            <form onSubmit={handleSaveMeasurements} className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-[#8A8F94] mb-1">Waist (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={waistInput}
                  onChange={(e) => setWaistInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8A8F94] mb-1">Chest (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={chestInput}
                  onChange={(e) => setChestInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8A8F94] mb-1">Body Fat (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFatInput}
                  onChange={(e) => setBodyFatInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums"
                />
              </div>
              <div className="col-span-3 flex justify-end mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D4FF1A] text-black text-xs font-semibold"
                >
                  Save Measurements
                </button>
              </div>
            </form>
          ) : (
            <div className="divide-y divide-[#292C2E] text-sm">
              {[
                {
                  label: 'Waist',
                  init: `${measurements.initial.waistCm} cm`,
                  curr: `${measurements.current.waistCm} cm`,
                  diff: (measurements.current.waistCm - measurements.initial.waistCm).toFixed(1),
                  unit: 'cm',
                },
                {
                  label: 'Chest',
                  init: `${measurements.initial.chestCm} cm`,
                  curr: `${measurements.current.chestCm} cm`,
                  diff: (measurements.current.chestCm - measurements.initial.chestCm).toFixed(1),
                  unit: 'cm',
                },
                {
                  label: 'Hips',
                  init: `${measurements.initial.hipsCm} cm`,
                  curr: `${measurements.current.hipsCm} cm`,
                  diff: (measurements.current.hipsCm - measurements.initial.hipsCm).toFixed(1),
                  unit: 'cm',
                },
                {
                  label: 'Arm (Flexed)',
                  init: `${measurements.initial.armCm} cm`,
                  curr: `${measurements.current.armCm} cm`,
                  diff: (measurements.current.armCm - measurements.initial.armCm).toFixed(1),
                  unit: 'cm',
                },
                {
                  label: 'Estimated Body Fat',
                  init: `${measurements.initial.bodyFatPct}%`,
                  curr: `${measurements.current.bodyFatPct}%`,
                  diff: (measurements.current.bodyFatPct - measurements.initial.bodyFatPct).toFixed(
                    1
                  ),
                  unit: '%',
                },
              ].map((row) => (
                <div key={row.label} className="py-3 grid grid-cols-12 items-center gap-2">
                  <span className="col-span-5 text-[#9BA1A6]">{row.label}</span>
                  <span className="col-span-2 text-right text-[#6B6B6B] tabular-nums">
                    {row.init}
                  </span>
                  <span className="col-span-3 text-right font-medium text-white tabular-nums">
                    {row.curr}
                  </span>
                  <span className="col-span-2 text-right text-xs font-medium text-[#D4FF1A] tabular-nums">
                    {Number(row.diff) > 0 ? `+${row.diff}` : row.diff}
                    {row.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* D. Consistency Metrics */}
        <section
          aria-label="Consistency breakdown"
          className="lg:col-span-5 bg-[#111111] border border-[#292C2E] rounded-2xl p-6 flex flex-col justify-between gap-4"
        >
          <div>
            <h2 className="font-display text-lg font-semibold text-white">Consistency</h2>
            <p className="text-xs text-[#8A8F94] mt-0.5">Programme execution across modules</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2.5 border-b border-[#292C2E]">
              <span className="text-sm text-[#9BA1A6]">Workouts Logged</span>
              <span className="font-display text-lg font-bold text-white tabular-nums">
                {workoutHistory.length + 14} sessions
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-[#292C2E]">
              <span className="text-sm text-[#9BA1A6]">Nutrition Adherence</span>
              <span className="font-display text-lg font-bold text-[#D4FF1A] tabular-nums">
                {Math.min(100, 88 + completedMealsToday * 2)}%
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-[#292C2E]">
              <span className="text-sm text-[#9BA1A6]">Active Days</span>
              <span className="font-display text-lg font-bold text-white tabular-nums">
                {heatmapSummary.activeDays} days
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-[#9BA1A6]">Completed Rest Days</span>
              <span className="font-display text-lg font-bold text-white tabular-nums">
                {heatmapSummary.restDays} days
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* E. 90-Day Transformation Timeline Heatmap */}
      <section
        aria-label="90-day transformation heatmap"
        className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              90-Day Transformation Timeline
            </h2>
            <p className="text-xs text-[#8A8F94] mt-0.5 tabular-nums">
              Day 1 to Day 90 · {heatmapSummary.activeDays} active · {heatmapSummary.restDays} rest ·{' '}
              {heatmapSummary.restPassDays} rest pass · {heatmapSummary.missedDays} missed
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#9BA1A6]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#D4FF1A]" /> Active
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-white/75" /> Rest
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#202321] border border-[#D4FF1A]" /> Rest Pass
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#292C2E]" /> Missed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-10 sm:grid-cols-[repeat(15,minmax(0,1fr))] md:grid-cols-[repeat(18,minmax(0,1fr))] gap-1.5">
          {heatmap.map((day) => {
            let cellClass = 'bg-[#191B1D] border-[#292C2E] text-[#6B6B6B]';
            if (day.status === 'active') {
              cellClass = 'bg-[#D4FF1A] border-[#D4FF1A] text-black font-semibold';
            } else if (day.status === 'rest') {
              cellClass = 'bg-white/80 border-white/80 text-black font-medium';
            } else if (day.status === 'rest_pass') {
              cellClass = 'bg-[#202321] border-[#D4FF1A] text-[#D4FF1A]';
            } else if (day.status === 'missed') {
              cellClass = 'bg-[#292C2E] border-[#3A3E42] text-[#8A8F94]';
            }

            return (
              <div
                key={day.dayNumber}
                title={`Day ${day.dayNumber} (${day.date}): ${day.status.replace('_', ' ')}`}
                className={`h-7 rounded-md border flex items-center justify-center text-[10px] tabular-nums ${cellClass}`}
              >
                {day.dayNumber}
              </div>
            );
          })}
        </div>
      </section>

      {/* F. Streak History & Badges */}
      <section
        aria-label="Streak history and badges"
        className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-6"
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pb-5 border-b border-[#292C2E]">
          <div>
            <p className="text-xs text-[#8A8F94]">Current Streak</p>
            <p className="font-display text-2xl font-bold text-[#D4FF1A] mt-1 tabular-nums">
              {streakState.currentStreak}d
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8A8F94]">Longest Streak</p>
            <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">
              {streakState.longestStreak}d
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8A8F94]">Completed Missions</p>
            <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">
              {streakState.completedMissionsCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8A8F94]">Swapped Missions</p>
            <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">
              {streakState.swappedMissionsCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8A8F94]">Skipped Missions</p>
            <p className="font-display text-2xl font-bold text-[#8A8F94] mt-1 tabular-nums">
              {streakState.skippedMissionsCount}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-semibold text-white">Earned &amp; Upcoming Badges</h2>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#8A8F94] tabular-nums">
              <Snowflake className="w-3.5 h-3.5 text-[#D4FF1A]" />
              {streakState.restPassBalance}/3 Rest Passes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  badge.earned
                    ? 'bg-[#191B1D] border-[#292C2E]'
                    : 'bg-[#0C0D0E] border-[#292C2E]/60 opacity-70'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    badge.earned ? 'bg-[#D4FF1A] text-black' : 'bg-[#191B1D] text-[#6B6B6B]'
                  }`}
                >
                  {badge.earned ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Award className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{badge.title}</p>
                  <p className="text-xs text-[#8A8F94] mt-1 leading-relaxed">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
