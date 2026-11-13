import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Flame,
  ShieldAlert,
  Snowflake,
  Users,
} from 'lucide-react';
import { useUprise } from '../../context/UpriseContext';
import { UpriseLogo } from '../../components/layout/UpriseLogo';

export const CoachDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, coachRoster, streakState, grantRestPassToMember, switchRole } = useUprise();

  const coachUser = users.find((u) => u.role === 'coach') ?? users[3];

  // Enforce Coach access boundary: only members assigned to this coach
  const assignedRoster = useMemo(() => {
    const assignedIds = new Set(
      users.filter((u) => u.role === 'member' && u.assignedCoachId === coachUser.id).map((u) => u.id)
    );
    return coachRoster.filter((m) => assignedIds.has(m.id));
  }, [coachRoster, users, coachUser.id]);

  const [filterMode, setFilterMode] = useState<'all' | 'inactive'>('all');
  const [selectedId, setSelectedId] = useState<string>(assignedRoster[0]?.id ?? 'member-arjun');
  const [reason, setReason] = useState('');
  const [grantFeedback, setGrantFeedback] = useState('');
  const [grantError, setGrantError] = useState('');

  const visibleRoster = useMemo(() => {
    if (filterMode === 'inactive') {
      return assignedRoster.filter((m) => m.lastActiveDaysAgo >= 3 || m.streakStatus === 'Broken');
    }
    return assignedRoster;
  }, [assignedRoster, filterMode]);

  const selectedMember =
    assignedRoster.find((m) => m.id === selectedId) ?? assignedRoster[0];

  const handleGrantRestPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    if (reason.trim().length < 5) {
      setGrantError('Provide a recorded coaching reason (at least 5 characters).');
      return;
    }
    grantRestPassToMember(selectedMember.id, reason.trim());
    setReason('');
    setGrantError('');
    setGrantFeedback(`Granted +1 Rest Pass to ${selectedMember.fullName}.`);
    window.setTimeout(() => setGrantFeedback(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Separate Coach Top Header */}
      <header className="border-b border-[#292C2E] bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UpriseLogo size="sm" />
            <span className="text-xs font-medium text-[#8A8F94] hidden sm:inline">
              Coach Portal · Assigned Members Only
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#9BA1A6] hidden md:inline">{coachUser.fullName}</span>
            <button
              type="button"
              onClick={() => {
                switchRole('member');
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[40px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Member View</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#D4FF1A]">Coach Workspace · SHRED 90</p>
            <h1 className="font-display text-3xl font-bold text-white mt-1">
              Assigned Members ({assignedRoster.length})
            </h1>
          </div>

          <div
            role="group"
            aria-label="Filter assigned members"
            className="inline-flex p-1 rounded-xl bg-[#111111] border border-[#292C2E]"
          >
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                filterMode === 'all' ? 'bg-[#D4FF1A] text-black' : 'text-[#8A8F94] hover:text-white'
              }`}
            >
              All Assigned ({assignedRoster.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('inactive')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                filterMode === 'inactive'
                  ? 'bg-[#D4FF1A] text-black'
                  : 'text-[#8A8F94] hover:text-white'
              }`}
            >
              Needs Attention (
              {assignedRoster.filter((m) => m.lastActiveDaysAgo >= 3 || m.streakStatus === 'Broken').length}
              )
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Assigned Roster List */}
          <section
            aria-label="Assigned member roster"
            className="lg:col-span-5 bg-[#111111] border border-[#292C2E] rounded-2xl divide-y divide-[#292C2E]"
          >
            {visibleRoster.map((member) => {
              const isSelected = selectedMember?.id === member.id;
              const isInactive = member.lastActiveDaysAgo >= 3;
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setSelectedId(member.id)}
                  className={`w-full text-left p-5 transition-colors flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-[#191B1D]' : 'hover:bg-[#151618]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-base font-semibold text-white truncate">
                        {member.fullName}
                      </p>
                      {isInactive && (
                        <AlertTriangle
                          className="w-4 h-4 text-amber-400 shrink-0"
                          aria-label="Inactive member alert"
                        />
                      )}
                    </div>
                    <p className="text-xs text-[#8A8F94] mt-1 tabular-nums">
                      Day {member.programmeDay}/{member.programmeTotalDays} · Adherence{' '}
                      {member.adherencePct}%
                    </p>
                    <p className="text-xs text-[#9BA1A6] mt-1">
                      {isInactive
                        ? `Inactive ${member.lastActiveDaysAgo} days`
                        : 'Active today'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        member.streakStatus === 'Active'
                          ? 'text-[#D4FF1A]'
                          : member.streakStatus === 'Broken'
                            ? 'text-red-400'
                            : 'text-white'
                      }`}
                    >
                      {member.currentStreak}d · {member.streakStatus}
                    </span>
                    <p className="text-[11px] text-[#8A8F94] mt-1 tabular-nums">
                      {member.restPassBalance}/3 passes
                    </p>
                  </div>
                </button>
              );
            })}
          </section>

          {/* Selected Member Details & Coach Actions */}
          {selectedMember && (
            <section
              aria-label="Member coaching detail"
              className="lg:col-span-7 bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#292C2E]">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#8A8F94]">
                    <Users className="w-3.5 h-3.5 text-[#D4FF1A]" />
                    <span>Assigned Member Profile</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white mt-1">
                    {selectedMember.fullName}
                  </h2>
                </div>
                <div className="text-left sm:text-right tabular-nums">
                  <p className="text-xs text-[#8A8F94]">Weight Progress</p>
                  <p className="font-display text-lg font-bold text-white">
                    {selectedMember.startWeightKg} → {selectedMember.currentWeightKg} kg
                    <span className="text-xs text-[#D4FF1A] ml-2">
                      (Goal {selectedMember.targetWeightKg} kg)
                    </span>
                  </p>
                </div>
              </div>

              {/* Assigned Plans & Engagement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-[#191B1D] border border-[#292C2E]">
                  <p className="text-xs text-[#8A8F94]">Assigned Meal Plan</p>
                  <p className="text-white font-medium mt-1">{selectedMember.mealPlanName}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#191B1D] border border-[#292C2E]">
                  <p className="text-xs text-[#8A8F94]">Assigned Workout Plan</p>
                  <p className="text-white font-medium mt-1">{selectedMember.workoutPlanName}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#191B1D] border border-[#292C2E] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#8A8F94]">Streak &amp; Mission</p>
                    <p className="text-white font-medium mt-1 tabular-nums">
                      {selectedMember.currentStreak}d ({selectedMember.streakStatus})
                    </p>
                    <p className="text-xs text-[#8A8F94] mt-0.5">
                      Daily Mission: {selectedMember.missionCompletedToday ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                  <Flame className="w-5 h-5 text-[#D4FF1A]" />
                </div>
                <div className="p-4 rounded-xl bg-[#191B1D] border border-[#292C2E] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#8A8F94]">Rest Pass Wallet</p>
                    <p className="font-display text-xl font-bold text-white mt-1 tabular-nums">
                      {selectedMember.restPassBalance} / 3
                    </p>
                  </div>
                  <Snowflake className="w-5 h-5 text-[#D4FF1A]" />
                </div>
              </div>

              {/* Safety Restriction Note */}
              <div className="p-4 rounded-xl bg-[#191B1D] border border-[#292C2E] flex items-start gap-3 text-xs text-[#D1D5DB]">
                <ShieldAlert className="w-4 h-4 text-[#D4FF1A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Coach-Approved Health Safety Note</p>
                  <p className="mt-1 text-[#9BA1A6] leading-relaxed">{selectedMember.safetyNote}</p>
                </div>
              </div>

              {/* Grant Rest Pass With Recorded Reason */}
              <form
                onSubmit={handleGrantRestPass}
                className="pt-5 border-t border-[#292C2E] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold text-white">
                    Grant Extra Rest Pass
                  </h3>
                  {grantFeedback && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#D4FF1A]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {grantFeedback}
                    </span>
                  )}
                </div>

                {grantError && (
                  <p role="alert" className="text-xs text-red-400">
                    {grantError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="coach-rp-reason" className="sr-only">
                    Reason for granting Rest Pass
                  </label>
                  <input
                    id="coach-rp-reason"
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Recorded reason (e.g. Medical recovery / work travel)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white focus:outline-none focus:border-[#D4FF1A]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] transition-colors whitespace-nowrap min-h-[44px]"
                  >
                    Grant +1 Rest Pass
                  </button>
                </div>
              </form>

              {selectedMember.id === 'member-arjun' && streakState.restPassHistory.length > 0 && (
                <div className="pt-3 border-t border-[#292C2E]">
                  <p className="text-xs font-medium text-[#8A8F94] mb-2">Rest Pass Audit Log</p>
                  <div className="space-y-1.5 text-xs text-[#9BA1A6]">
                    {streakState.restPassHistory.slice(0, 3).map((ev) => (
                      <p key={ev.id}>
                        {ev.grantedAt} · +{ev.amount} by {ev.grantedBy} — &ldquo;{ev.reason}&rdquo;
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
