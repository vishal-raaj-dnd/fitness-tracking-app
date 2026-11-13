import React, { useState } from 'react';
import { Camera, RefreshCw, Trash2, User } from 'lucide-react';
import type { GenderOption, OnboardingDataModel } from '../../types/onboarding';

interface Step01PersonalProps {
  value: OnboardingDataModel['personal_information'];
  onChange: (next: OnboardingDataModel['personal_information']) => void;
}

const GENDER_OPTIONS: { value: Exclude<GenderOption, ''>; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export const Step01Personal: React.FC<Step01PersonalProps> = ({ value, onChange }) => {
  const [photoError, setPhotoError] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setPhotoError('Please choose an image under 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({ ...value, profile_photo: reader.result });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Custom Profile Picture Upload */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#191B1D]/70 border border-[#292C2E] flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-[#111111] border border-[#292C2E] flex items-center justify-center shrink-0">
          {value.profile_photo ? (
            <img
              src={value.profile_photo}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-[#6B6B6B]" strokeWidth={1.5} />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2.5">
          <div>
            <p className="text-sm font-medium text-white">Profile Picture (Optional)</p>
            <p className="text-xs text-[#8A8F94] mt-0.5">
              Used on your member profile and 90-day completion summary.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              id="ob-profile-photo-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="sr-only"
            />
            <label
              htmlFor="ob-profile-photo-input"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#202321] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white transition-colors min-h-[40px]"
            >
              {value.profile_photo ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4FF1A]" />
                  <span>Replace Photo</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5 text-[#D4FF1A]" />
                  <span>Upload Photo</span>
                </>
              )}
            </label>

            {value.profile_photo && (
              <button
                type="button"
                onClick={() => onChange({ ...value, profile_photo: '' })}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111111] border border-[#292C2E] hover:border-red-400/50 text-xs font-medium text-[#9BA1A6] hover:text-white transition-colors min-h-[40px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {photoError && <p className="text-xs text-red-400">{photoError}</p>}
        </div>
      </div>

      {/* Required Fields */}
      <div className="space-y-4">
        <div>
          <label htmlFor="ob-full-name" className="block text-xs font-medium text-[#9BA1A6] mb-1.5">
            Full Name <span className="text-[#D4FF1A]">*</span>
          </label>
          <input
            id="ob-full-name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            value={value.full_name}
            onChange={(e) => onChange({ ...value, full_name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#D4FF1A] min-h-[46px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ob-email" className="block text-xs font-medium text-[#9BA1A6] mb-1.5">
              Email Address <span className="text-[#D4FF1A]">*</span>
            </label>
            <input
              id="ob-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={value.email}
              onChange={(e) => onChange({ ...value, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#D4FF1A] min-h-[46px]"
            />
          </div>

          <div>
            <label htmlFor="ob-phone" className="block text-xs font-medium text-[#9BA1A6] mb-1.5">
              Phone Number <span className="text-[#D4FF1A]">*</span>
            </label>
            <input
              id="ob-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98000 00000"
              value={value.phone}
              onChange={(e) => onChange({ ...value, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white placeholder-[#6B6B6B] tabular-nums focus:outline-none focus:border-[#D4FF1A] min-h-[46px]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="ob-dob" className="block text-xs font-medium text-[#9BA1A6] mb-1.5">
            Date of Birth <span className="text-[#D4FF1A]">*</span>
          </label>
          <input
            id="ob-dob"
            type="date"
            value={value.date_of_birth}
            onChange={(e) => onChange({ ...value, date_of_birth: e.target.value })}
            className="w-full sm:w-64 px-4 py-3 rounded-xl bg-[#191B1D] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A] min-h-[46px] [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Optional Gender Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-[#9BA1A6]">Gender (Optional)</p>
          {value.gender && (
            <button
              type="button"
              onClick={() => onChange({ ...value, gender: '' })}
              className="text-[11px] text-[#8A8F94] hover:text-white"
            >
              Clear selection
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {GENDER_OPTIONS.map((opt) => {
            const active = value.gender === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange({ ...value, gender: active ? '' : opt.value })
                }
                className={`px-3 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all min-h-[44px] ${
                  active
                    ? 'bg-[#202321] border-[#D4FF1A] text-white'
                    : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
