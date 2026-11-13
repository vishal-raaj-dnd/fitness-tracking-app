import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { UpriseProvider } from './context/UpriseContext';
import { MemberShell } from './components/layout/MemberShell';
import { HomePage } from './pages/Home/HomePage';
import { MealsPage } from './pages/Meals/MealsPage';
import { TrainingPage } from './pages/Training/TrainingPage';
import { WorkoutModePage } from './pages/WorkoutMode/WorkoutModePage';
import { ProgressPage } from './pages/Progress/ProgressPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { OnboardingPage } from './pages/Onboarding/OnboardingPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { CoachDashboardPage } from './pages/Coach/CoachDashboardPage';
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <UpriseProvider>
        <BrowserRouter>
        <Routes>
          {/* Member Experience Routes */}
          <Route
            path="/"
            element={
              <MemberShell>
                <HomePage />
              </MemberShell>
            }
          />
          <Route
            path="/meals"
            element={
              <MemberShell>
                <MealsPage />
              </MemberShell>
            }
          />
          <Route
            path="/training"
            element={
              <MemberShell>
                <TrainingPage />
              </MemberShell>
            }
          />
          <Route
            path="/progress"
            element={
              <MemberShell>
                <ProgressPage />
              </MemberShell>
            }
          />
          <Route
            path="/profile"
            element={
              <MemberShell>
                <ProfilePage />
              </MemberShell>
            }
          />

          {/* Distraction-Free Workout Mode */}
          <Route path="/workout-mode" element={<WorkoutModePage />} />

          {/* Onboarding & Auth */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Separate Coach & Admin Areas */}
          <Route path="/coach" element={<CoachDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UpriseProvider>
    </MotionConfig>
  );
}
