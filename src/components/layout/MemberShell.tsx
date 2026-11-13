import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Home, Utensils, Dumbbell, TrendingUp, User, Play } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import { UpriseLogo } from './UpriseLogo';
import { SafeImage } from './SafeImage';
import { useUprise } from '../../context/UpriseContext';

const MEMBER_NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/meals', label: 'Meals', icon: Utensils },
  { to: '/training', label: 'Training', icon: Dumbbell },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/profile', label: 'Profile', icon: User },
] as const;

export const MemberShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, streakState, todayWorkout, todayWorkoutCompleted } = useUprise();
  const location = useLocation();
  const programmePct = Math.min(
    100,
    Math.round((currentUser.programmeDay / currentUser.programmeTotalDays) * 100)
  );

  return (
    <div className="min-h-screen bg-[#000000] uprise-ambient-canvas text-white flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar (>= 1024px) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 bg-[#08090A]/95 backdrop-blur-md border-r border-[#292C2E] z-30">
        <div className="px-6 pt-7 pb-6 border-b border-[#292C2E]/70">
          <NavLink to="/" aria-label="UPRISE Home" className="block focus-visible:outline-none">
            <UpriseLogo size="md" />
          </NavLink>
          <p className="mt-2 text-xs text-[#8A8F94] tracking-wide">SHRED 90 · NXTGEN</p>
        </div>

        <nav aria-label="Member navigation" className="flex-1 px-3.5 py-6 space-y-1">
          {MEMBER_NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive =
              to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors duration-150 whitespace-nowrap group ${
                  isActive ? 'text-white' : 'text-[#8A8F94] hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="desktopNavIndicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-xl bg-[#191B1D] border border-[#292C2E] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  />
                )}
                <Icon
                  className={`relative z-10 w-5 h-5 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                    isActive ? 'text-[#D4FF1A]' : 'text-[#6B6B6B] group-hover:text-[#9BA1A6]'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.75}
                />
                <span className="relative z-10">{label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="relative z-10 ml-auto w-1.5 h-4 rounded-full bg-[#D4FF1A]"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Workout Shortcut + Member Card */}
        <div className="p-4 space-y-3 border-t border-[#292C2E]/80">
          {!todayWorkout.isRestDay && !todayWorkoutCompleted && (
            <Link
              to="/workout-mode"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#D4FF1A] text-black text-xs font-semibold hover:bg-[#c5ee14] active:scale-[0.98] transition-all duration-150"
            >
              <span className="truncate">Start {todayWorkout.dayShort} Session</span>
              <Play className="w-3.5 h-3.5 fill-current shrink-0" />
            </Link>
          )}

          <NavLink
            to="/profile"
            className="block p-3 rounded-xl uprise-surface border border-[#292C2E] transition-colors"
          >
            <div className="flex items-center gap-3">
              <SafeImage
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                fallbackInitials={currentUser.fullName
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((p) => p[0]?.toUpperCase() ?? '')
                  .join('')}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#292C2E]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{currentUser.fullName}</p>
                <p className="text-xs text-[#8A8F94] tabular-nums truncate">
                  Day {currentUser.programmeDay}/{currentUser.programmeTotalDays} ·{' '}
                  {streakState.currentStreak}d streak
                </p>
              </div>
            </div>
            <div className="mt-3 h-1 w-full bg-[#191B1D] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D4FF1A] rounded-full transition-all duration-500"
                style={{ width: `${programmePct}%` }}
              />
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Viewport with Subtle Page Transition */}
      <div className="flex-1 lg:pl-64 pb-28 lg:pb-12 min-w-0 flex flex-col">
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-5 lg:pt-9">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>

        {/* Quiet Brand Footer */}
        <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-4">
          <div className="pt-5 border-t border-[#292C2E]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6B6B6B]">
            <span>UPRISE by NXTGEN · SHRED 90 Programme</span>
            <div className="flex items-center gap-4">
              <Link to="/onboarding" className="hover:text-[#9BA1A6] transition-colors">
                Onboarding
              </Link>
              <Link to="/profile" className="hover:text-[#9BA1A6] transition-colors">
                Preferences &amp; Portals
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Floating Dock Bottom Footer Navbar (< 1024px) */}
      <div className="lg:hidden fixed bottom-3 inset-x-3 z-40 pointer-events-none pb-safe">
        <LayoutGroup id="mobile-bottom-nav">
          <nav
            aria-label="Mobile navigation"
            className="pointer-events-auto max-w-md mx-auto bg-[#0F1012]/92 backdrop-blur-xl border border-[#292C2E] rounded-2xl shadow-[0_14px_36px_rgba(0,0,0,0.82)] px-1.5"
          >
            <div className="grid grid-cols-5 h-[66px] items-center">
              {MEMBER_NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                const isActive =
                  to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
                return (
                  <NavLink
                    key={to}
                    to={to}
                    aria-current={isActive ? 'page' : undefined}
                    className="relative flex items-center justify-center min-h-[50px] min-w-[44px] rounded-xl select-none touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF1A]/60"
                  >
                    <motion.div
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                      className="relative w-full h-[54px] flex flex-col items-center justify-center gap-1 pt-1"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mobileNavIndicator"
                          transition={{ type: 'spring', stiffness: 460, damping: 32, mass: 0.75 }}
                          className="absolute inset-0.5 rounded-xl bg-[#1C201D] border border-[#D4FF1A]/35 shadow-[inset_0_1px_0_0_rgba(212,255,26,0.12)]"
                        />
                      )}

                      {isActive && (
                        <motion.span
                          layoutId="mobileNavTopBar"
                          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                          aria-hidden="true"
                          className="absolute top-1 w-6 h-[2.5px] rounded-full bg-[#D4FF1A] shadow-[0_0_8px_rgba(212,255,26,0.55)] z-20"
                        />
                      )}

                      <motion.span
                        aria-hidden="true"
                        animate={{
                          opacity: isActive ? 1 : 0,
                          scale: isActive ? 1 : 0.65,
                        }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-2.5 w-7 h-7 rounded-full bg-[#D4FF1A]/12 blur-md pointer-events-none"
                      />

                      <motion.span
                        animate={{
                          scale: isActive ? 1.12 : 1,
                          y: isActive ? -1 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 520, damping: 28 }}
                        className="relative z-10 flex items-center justify-center"
                      >
                        <Icon
                          className={`w-5 h-5 transition-colors duration-200 ${
                            isActive ? 'text-[#D4FF1A]' : 'text-[#6B6B6B]'
                          }`}
                          strokeWidth={isActive ? 2.25 : 1.75}
                        />
                      </motion.span>

                      <motion.span
                        animate={{
                          opacity: isActive ? 1 : 0.72,
                          y: isActive ? -0.5 : 0,
                        }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className={`relative z-10 text-[11px] leading-none transition-colors duration-200 ${
                          isActive ? 'font-semibold text-white' : 'font-medium text-[#8A8F94]'
                        }`}
                      >
                        {label}
                      </motion.span>
                    </motion.div>
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </LayoutGroup>
      </div>
    </div>
  );
};
