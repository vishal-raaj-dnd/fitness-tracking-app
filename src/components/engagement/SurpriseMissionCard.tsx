import React from 'react';
import { Sparkles, RefreshCw, Check, SkipForward, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useUprise } from '../../context/UpriseContext';

export const SurpriseMissionCard: React.FC = () => {
  const {
    activeMission,
    activeMissionState,
    revealDailyMission,
    acceptDailyMission,
    swapDailyMission,
    skipDailyMission,
    completeDailyMission,
  } = useUprise();

  const { status, swappedOnce } = activeMissionState;

  return (
    <section
      aria-labelledby="daily-mission-heading"
      className="uprise-surface border border-[#292C2E] rounded-2xl p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#8A8F94]">
            Optional engagement · Today&apos;s drop
          </p>
          <h2
            id="daily-mission-heading"
            className="font-display text-lg font-semibold text-white mt-1"
          >
            Surprise Daily Mission
          </h2>
        </div>
        <Sparkles className="w-5 h-5 text-[#D4FF1A] shrink-0" strokeWidth={1.75} />
      </div>

      <AnimatePresence mode="wait">
        {status === 'unrevealed' && (
          <motion.div
            key="unrevealed"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#292C2E]"
          >
            <p className="text-sm text-[#9BA1A6] max-w-lg leading-relaxed">
              A 5–20 minute bonus action tailored to your recovery load and safety profile. Optional
              for your streak, built for momentum.
            </p>
            <button
              type="button"
              onClick={revealDailyMission}
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 min-h-[44px]"
            >
              <span>Reveal Mission</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5"
                strokeWidth={2.25}
              />
            </button>
          </motion.div>
        )}

        {(status === 'revealed' || status === 'accepted') && (
          <motion.div
            key={`active-${activeMission.id}-${status}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 pt-4 border-t border-[#292C2E]"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A8F94]">
              <span className="text-[#D4FF1A] font-medium">{activeMission.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{activeMission.durationMinutes} min</span>
              <span aria-hidden="true">·</span>
              <span>{status === 'accepted' ? 'Accepted' : 'Ready to accept'}</span>
            </div>

            <h3 className="font-display text-xl font-bold text-white mt-2">
              {activeMission.title}
            </h3>
            <p className="text-sm text-[#9BA1A6] mt-2 leading-relaxed max-w-2xl">
              {activeMission.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {status === 'revealed' && (
                <button
                  type="button"
                  onClick={acceptDailyMission}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] active:scale-[0.98] transition-all duration-150 whitespace-nowrap min-h-[44px]"
                >
                  <Check className="w-4 h-4" strokeWidth={2.25} />
                  <span>Accept</span>
                </button>
              )}

              <button
                type="button"
                onClick={completeDailyMission}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all duration-150 whitespace-nowrap min-h-[44px] ${
                  status === 'accepted'
                    ? 'bg-[#D4FF1A] text-black hover:bg-[#c5ee14]'
                    : 'bg-[#191B1D] text-white border border-[#292C2E] hover:border-[#3E4246]'
                }`}
              >
                <Check className="w-4 h-4" strokeWidth={2.25} />
                <span>Complete</span>
              </button>

              <button
                type="button"
                disabled={swappedOnce}
                onClick={swapDailyMission}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border active:scale-[0.98] transition-all duration-150 whitespace-nowrap min-h-[44px] ${
                  swappedOnce
                    ? 'bg-[#111111] border-[#292C2E] text-[#6B6B6B] cursor-not-allowed'
                    : 'bg-[#191B1D] border-[#292C2E] text-white hover:border-[#3E4246]'
                }`}
              >
                <RefreshCw className="w-4 h-4" strokeWidth={1.75} />
                <span>{swappedOnce ? 'Swapped' : 'Swap Once'}</span>
              </button>

              <button
                type="button"
                onClick={skipDailyMission}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#8A8F94] hover:text-white transition-colors whitespace-nowrap min-h-[44px]"
              >
                <SkipForward className="w-4 h-4" strokeWidth={1.75} />
                <span>Skip</span>
              </button>
            </div>
          </motion.div>
        )}

        {status === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-4 pt-4 border-t border-[#292C2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <p className="text-xs text-[#D4FF1A] font-medium">
                Completed · {activeMission.category} · {activeMission.durationMinutes} min
              </p>
              <p className="font-display text-base font-semibold text-white mt-1">
                {activeMission.title}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#D4FF1A]">
              <Check className="w-4 h-4" strokeWidth={2.5} />
              Streak credit logged
            </span>
          </motion.div>
        )}

        {status === 'skipped' && (
          <motion.div
            key="skipped"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="mt-4 pt-4 border-t border-[#292C2E] flex items-center justify-between gap-3"
          >
            <p className="text-sm text-[#8A8F94]">
              Skipped for today. Your streak remains safe through workouts, meals, or rest check-ins.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
