import React, { useState } from 'react';
import { Check, Droplets, Plus, Utensils } from 'lucide-react';
import type { OnboardingDataModel, OnboardingDietPreference } from '../../types/onboarding';
import type {
  BottleCapacityMl,
  DailyWaterIntakeBracket,
  DrinkingFrequency,
  HydrationReminderPreference,
} from '../../types/hydration';

interface Step05NutritionProps {
  value: OnboardingDataModel['nutrition_information'];
  hydrationValue: OnboardingDataModel['hydration_information'];
  onChange: (next: OnboardingDataModel['nutrition_information']) => void;
  onHydrationChange: (next: OnboardingDataModel['hydration_information']) => void;
}

const DIET_OPTIONS: {
  id: OnboardingDietPreference;
  title: string;
  description: string;
}[] = [
  {
    id: 'vegetarian',
    title: 'Vegetarian',
    description: 'Paneer, tofu, lentils, dairy, grains, and plant-rich Indian meals.',
  },
  {
    id: 'non_vegetarian',
    title: 'Non-vegetarian',
    description: 'Includes poultry, fish, eggs alongside vegetarian staples.',
  },
  {
    id: 'eggetarian',
    title: 'Eggetarian',
    description: 'Vegetarian meals complemented with whole eggs and egg whites.',
  },
];

const MEAL_FREQUENCIES: { count: 3 | 4 | 5; hint: string }[] = [
  { count: 3, hint: 'Breakfast · Lunch · Dinner' },
  { count: 4, hint: '3 main meals · 1 snack' },
  { count: 5, hint: '3 main meals · 2 snacks' },
];

const WATER_INTAKE_OPTIONS: { id: DailyWaterIntakeBracket; label: string }[] = [
  { id: 'lt_500', label: 'Less than 500 ml' },
  { id: '500_1000', label: '500 ml – 1 litre' },
  { id: '1000_1500', label: '1 – 1.5 litres' },
  { id: '1500_2000', label: '1.5 – 2 litres' },
  { id: '2000_2500', label: '2 – 2.5 litres' },
  { id: '2500_3000', label: '2.5 – 3 litres' },
  { id: 'gt_3000', label: 'More than 3 litres' },
  { id: 'not_sure', label: 'Not sure' },
];

const DRINKING_FREQUENCY_OPTIONS: { id: DrinkingFrequency; label: string }[] = [
  { id: 'frequently', label: 'Frequently throughout the day.' },
  { id: 'thirsty_only', label: 'Only when I feel thirsty.' },
  { id: 'with_meals', label: 'Mostly during meals.' },
  { id: 'occasionally', label: 'Occasionally.' },
  { id: 'often_forget', label: 'I often forget to drink water.' },
];

const BOTTLE_CAPACITY_OPTIONS: { id: BottleCapacityMl; label: string }[] = [
  { id: 250, label: '250 ml' },
  { id: 500, label: '500 ml' },
  { id: 750, label: '750 ml' },
  { id: 1000, label: '1 litre' },
  { id: 1500, label: '1.5 litres' },
  { id: 'other_not_sure', label: 'Other / Not sure' },
];

const REMINDER_OPTIONS: { id: HydrationReminderPreference; label: string }[] = [
  { id: 'yes_remind', label: 'Yes, remind me throughout the day.' },
  { id: 'no_self_track', label: "No, I'll track it myself." },
];

const COMMON_FOOD_PREFS = [
  'North Indian Home Style',
  'South Indian Staples',
  'High-Protein Paneer & Dal',
  'Chicken & Fish',
  'Egg-Based Breakfasts',
  'Oats & Whey Bowls',
  'Low-Oil Preparation',
  'Millet & Roti Options',
];

export const Step05Nutrition: React.FC<Step05NutritionProps> = ({
  value,
  hydrationValue,
  onChange,
  onHydrationChange,
}) => {
  const [customInput, setCustomInput] = useState('');

  const toggleFoodPref = (pref: string) => {
    const exists = value.food_preferences.includes(pref);
    onChange({
      ...value,
      food_preferences: exists
        ? value.food_preferences.filter((item) => item !== pref)
        : [...value.food_preferences, pref],
    });
  };

  const handleAddCustomPref = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customInput.trim();
    if (!cleaned) return;
    if (!value.food_preferences.includes(cleaned)) {
      onChange({
        ...value,
        food_preferences: [...value.food_preferences, cleaned],
      });
    }
    setCustomInput('');
  };

  const allDisplayOptions = Array.from(
    new Set([...COMMON_FOOD_PREFS, ...value.food_preferences])
  );

  return (
    <div className="space-y-8">
      {/* Dietary Preference */}
      <div>
        <p className="text-xs font-medium text-[#9BA1A6] mb-3">Dietary Preference</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DIET_OPTIONS.map(({ id, title, description }) => {
            const active = value.dietary_preference === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...value, dietary_preference: id })}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  active
                    ? 'bg-[#202321] border-[#D4FF1A] text-white'
                    : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-white">{title}</span>
                  <Utensils
                    className={`w-4 h-4 ${active ? 'text-[#D4FF1A]' : 'text-[#6B6B6B]'}`}
                  />
                </div>
                <p className="text-xs text-[#9BA1A6] leading-relaxed">{description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal Frequency */}
      <div>
        <p className="text-xs font-medium text-[#9BA1A6] mb-3">Preferred Meal Frequency</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {MEAL_FREQUENCIES.map(({ count, hint }) => {
            const active = value.meal_frequency === count;
            return (
              <button
                key={count}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...value, meal_frequency: count })}
                className={`p-3.5 rounded-2xl border text-left transition-all min-h-[64px] ${
                  active
                    ? 'bg-[#202321] border-[#D4FF1A] text-white'
                    : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                }`}
              >
                <span className="font-display text-base font-bold text-white tabular-nums block">
                  {count} meals / day
                </span>
                <span className="text-[11px] text-[#8A8F94] block mt-0.5">{hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dedicated Subsection: Your Hydration Habits */}
      <section
        id="hydration-habits-section"
        aria-labelledby="hydration-habits-heading"
        className="pt-6 border-t border-[#292C2E] space-y-6"
      >
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-[#D4FF1A] shrink-0" strokeWidth={2} />
              <h2
                id="hydration-habits-heading"
                className="font-display text-lg font-bold tracking-tight text-white"
              >
                Your Hydration Habits
              </h2>
            </div>
            <span className="text-[11px] text-[#8A8F94]">Optional</span>
          </div>
          <p className="text-xs sm:text-sm text-[#9BA1A6] leading-relaxed">
            Water plays an important role in your daily fitness routine. Let&apos;s understand your
            current hydration habits.
          </p>
        </div>

        {/* A. Average Daily Water Intake */}
        <div className="space-y-2.5">
          <p className="text-xs font-medium text-[#D1D5DB]">
            Approximately how much water do you drink in a day?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {WATER_INTAKE_OPTIONS.map((opt) => {
              const active = hydrationValue.average_daily_water_intake === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    onHydrationChange({
                      ...hydrationValue,
                      average_daily_water_intake: active ? '' : opt.id,
                    })
                  }
                  className={`px-3 py-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between gap-2 transition-all min-h-[46px] tabular-nums ${
                    active
                      ? 'bg-[#202321] border-[#D4FF1A] text-white'
                      : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <Check className="w-3.5 h-3.5 text-[#D4FF1A] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* B. Drinking Frequency */}
        <div className="space-y-2.5">
          <p className="text-xs font-medium text-[#D1D5DB]">
            How frequently do you usually drink water?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DRINKING_FREQUENCY_OPTIONS.map((opt) => {
              const active = hydrationValue.drinking_frequency === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    onHydrationChange({
                      ...hydrationValue,
                      drinking_frequency: active ? '' : opt.id,
                    })
                  }
                  className={`px-3.5 py-3 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all min-h-[46px] ${
                    active
                      ? 'bg-[#202321] border-[#D4FF1A] text-white'
                      : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <Check className="w-4 h-4 text-[#D4FF1A] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* C. Water Bottle Capacity */}
        <div className="space-y-2.5">
          <p className="text-xs font-medium text-[#D1D5DB]">
            What is the size of your usual water bottle?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {BOTTLE_CAPACITY_OPTIONS.map((opt) => {
              const active = hydrationValue.bottle_capacity_ml === opt.id;
              return (
                <button
                  key={String(opt.id)}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    onHydrationChange({
                      ...hydrationValue,
                      bottle_capacity_ml: active ? null : opt.id,
                    })
                  }
                  className={`px-3.5 py-3 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all min-h-[46px] tabular-nums ${
                    active
                      ? 'bg-[#202321] border-[#D4FF1A] text-white'
                      : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <Check className="w-4 h-4 text-[#D4FF1A] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* D. Hydration Reminder Preference */}
        <div className="space-y-2.5">
          <p className="text-xs font-medium text-[#D1D5DB]">
            Would you like reminders to drink water?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {REMINDER_OPTIONS.map((opt) => {
              const active = hydrationValue.reminder_preference === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    onHydrationChange({
                      ...hydrationValue,
                      reminder_preference: active ? '' : opt.id,
                    })
                  }
                  className={`px-3.5 py-3 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all min-h-[46px] ${
                    active
                      ? 'bg-[#202321] border-[#D4FF1A] text-white'
                      : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <Check className="w-4 h-4 text-[#D4FF1A] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Food Preferences */}
      <div className="space-y-3 pt-6 border-t border-[#292C2E]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[#9BA1A6]">
            Food Preferences (Select all that fit your routine)
          </p>
          <span className="text-[11px] text-[#8A8F94] tabular-nums">
            {value.food_preferences.length} selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {allDisplayOptions.map((item) => {
            const active = value.food_preferences.includes(item);
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => toggleFoodPref(item)}
                className={`px-3.5 py-3 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-all min-h-[44px] ${
                  active
                    ? 'bg-[#202321] border-[#D4FF1A] text-white'
                    : 'bg-[#191B1D] border-[#292C2E] text-[#9BA1A6] hover:border-[#3E4246] hover:text-white'
                }`}
              >
                <span className="truncate">{item}</span>
                {active && <Check className="w-4 h-4 text-[#D4FF1A] shrink-0" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleAddCustomPref} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add another food preference (e.g. No dairy, Air-fried snacks)"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#191B1D] border border-[#292C2E] text-xs sm:text-sm text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#D4FF1A] min-h-[44px]"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#202321] border border-[#292C2E] hover:border-[#D4FF1A] text-xs font-medium text-white min-h-[44px] whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4FF1A]" />
            <span>Add</span>
          </button>
        </form>
      </div>
    </div>
  );
};
