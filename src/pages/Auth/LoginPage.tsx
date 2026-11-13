import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { UpriseLogo } from '../../components/layout/UpriseLogo';
import { useUprise } from '../../context/UpriseContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useUprise();

  const [email, setEmail] = useState('arjun.mehta@nxtgenfit.in');
  const [password, setPassword] = useState('shred90demo');
  const [error, setError] = useState('');

  const handleMemberSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || password.trim().length < 4) {
      setError('Enter a valid member email and password.');
      return;
    }
    switchRole('member');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="space-y-3">
          <UpriseLogo size="lg" />
          <p className="text-xs font-medium text-[#8A8F94]">NXTGEN · SHRED 90-Day Fitness Platform</p>
          <h1 className="font-display text-3xl font-bold text-white">Sign in to UPRISE</h1>
          <p className="text-sm text-[#9BA1A6]">
            Less clutter. More clarity. Better consistency.
          </p>
        </div>

        <form
          onSubmit={handleMemberSignIn}
          className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6 space-y-4"
        >
          {error && (
            <p role="alert" className="text-xs text-red-400">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="login-email" className="block text-xs text-[#8A8F94] mb-1.5">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white focus:outline-none focus:border-[#D4FF1A]"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs text-[#8A8F94] mb-1.5">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white focus:outline-none focus:border-[#D4FF1A]"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] transition-colors min-h-[48px]"
          >
            <span>Continue as Member</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-3 border-t border-[#292C2E] flex items-center justify-between text-xs text-[#8A8F94]">
            <span>Whop SSO integration ready</span>
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="text-[#D4FF1A] font-medium hover:underline"
            >
              New Member Onboarding
            </button>
          </div>
        </form>

        {/* Role Portal Access (Coach & Admin Separation) */}
        <div className="bg-[#111111] border border-[#292C2E] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#8A8F94]">
            <ShieldCheck className="w-4 h-4 text-[#D4FF1A]" />
            <span>Staff Portals</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                switchRole('coach');
                navigate('/coach');
              }}
              className="px-4 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[44px]"
            >
              Coach Portal
            </button>
            <button
              type="button"
              onClick={() => {
                switchRole('admin');
                navigate('/admin');
              }}
              className="px-4 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[44px]"
            >
              Admin Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
