import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { UpriseLogo } from '../layout/UpriseLogo';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onExistingMember: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onExistingMember,
}) => {
  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden flex flex-col justify-between">
      {/* Cinematic Athletic Backdrop */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img
          src="/src/assets/images/training_strength_hero_1794571843058.jpg"
          alt=""
          className="w-full h-full object-cover object-center opacity-35 scale-[1.03]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.58) 42%, rgba(0,0,0,0.96) 86%, #000000 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 45% at 15% 15%, rgba(212,255,26,0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Top Brand Header */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 pt-8 sm:pt-12 flex items-center justify-between gap-4">
        <UpriseLogo size="lg" />
        <button
          type="button"
          onClick={onExistingMember}
          className="text-xs sm:text-sm font-medium text-[#9BA1A6] hover:text-white transition-colors min-h-[44px] px-2"
        >
          Existing member? Sign in
        </button>
      </header>

      {/* Center / Bottom Editorial Hero */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 py-14 sm:py-20 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl space-y-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4FF1A]">
            90-day SHRED programme
          </p>

          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.06]">
            Your transformation starts here.
          </h1>

          <p className="text-base sm:text-lg text-[#B5BAC0] leading-relaxed max-w-lg">
            Let&apos;s understand your goals, lifestyle and fitness preferences to build your 90-day
            journey.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              type="button"
              onClick={onGetStarted}
              className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-[#D4FF1A] text-black font-display text-base font-bold hover:bg-[#c5ee14] active:scale-[0.98] transition-all duration-150 min-h-[54px] w-full sm:w-auto"
            >
              <span>Get Started</span>
              <ArrowRight
                className="w-5 h-5 transition-transform duration-150 group-hover:translate-x-0.5"
                strokeWidth={2.25}
              />
            </button>

            <span className="text-xs text-[#8A8F94]">
              Guided fitness assessment · Saves automatically
            </span>
          </div>
        </motion.div>
      </main>

      {/* Quiet Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 pb-8 flex items-center justify-between text-xs text-[#6B6B6B]">
        <span>UPRISE by NXTGEN</span>
        <span>Less clutter · More clarity</span>
      </footer>
    </div>
  );
};
