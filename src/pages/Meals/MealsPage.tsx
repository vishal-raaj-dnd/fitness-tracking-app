import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  Trash2,
  Utensils,
} from 'lucide-react';
import { useUprise } from '../../context/UpriseContext';
import {
  calculateDailyNutrition,
  computeMacroProgressPct,
  getMealMacros,
} from '../../services/meals/nutritionCalc';

export const MealsPage: React.FC = () => {
  const {
    meals,
    customFoods,
    nutritionTargets,
    foodDatabase,
    toggleMealCompleted,
    selectMealAlternative,
    addCustomFood,
    removeCustomFood,
  } = useUprise();

  const [expandedMealId, setExpandedMealId] = useState<string | null>('meal-lunch');
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Custom food form state
  const [foodName, setFoodName] = useState('');
  const [foodPortion, setFoodPortion] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [formError, setFormError] = useState('');

  const totals = useMemo(
    () => calculateDailyNutrition(meals, customFoods),
    [meals, customFoods]
  );

  const calPct = computeMacroProgressPct(totals.calories, nutritionTargets.calories);
  const proPct = computeMacroProgressPct(totals.proteinG, nutritionTargets.proteinG);
  const carbPct = computeMacroProgressPct(totals.carbsG, nutritionTargets.carbsG);
  const fatPct = computeMacroProgressPct(totals.fatG, nutritionTargets.fatG);

  const handleAddCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calNum = Number(calories);
    const proNum = Number(protein || 0);
    const carbNum = Number(carbs || 0);
    const fatNum = Number(fat || 0);

    if (!foodName.trim() || !foodPortion.trim() || Number.isNaN(calNum) || calNum <= 0) {
      setFormError('Enter a food name, portion quantity, and valid calorie amount.');
      return;
    }

    addCustomFood({
      name: foodName.trim(),
      portion: foodPortion.trim(),
      calories: Math.round(calNum),
      proteinG: Math.round(proNum),
      carbsG: Math.round(carbNum),
      fatG: Math.round(fatNum),
    });

    setFoodName('');
    setFoodPortion('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setFormError('');
    setShowCustomForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#8A8F94]">
            Friday, 13 Nov · {nutritionTargets.planName}
          </p>
          <h1 className="font-display text-3xl font-bold text-white mt-1">Daily Meals</h1>
        </div>

        <button
          type="button"
          onClick={() => setShowCustomForm((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] transition-colors whitespace-nowrap min-h-[44px]"
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          <span>Add Custom Food</span>
        </button>
      </header>

      {/* Daily Nutrition Overview */}
      <section
        aria-label="Daily nutrition overview"
        className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-5 border-b border-[#292C2E]">
          <div>
            <p className="text-xs text-[#8A8F94]">Calories Consumed</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-3xl font-bold text-white tabular-nums">
                {totals.calories.toLocaleString()}
              </span>
              <span className="text-sm text-[#8A8F94] tabular-nums">
                / {nutritionTargets.calories.toLocaleString()} kcal
              </span>
            </div>
          </div>
          <p className="text-sm text-[#9BA1A6] tabular-nums">
            {totals.completedMealsCount} of {totals.totalMealsCount} scheduled meals completed
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-5">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#8A8F94]">Calories</span>
              <span className="text-white font-medium tabular-nums">{calPct}%</span>
            </div>
            <div className="h-2 bg-[#191B1D] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D4FF1A] rounded-full transition-all duration-300"
                style={{ width: `${calPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#8A8F94]">Protein</span>
              <span className="text-white font-medium tabular-nums">
                {totals.proteinG}g / {nutritionTargets.proteinG}g
              </span>
            </div>
            <div className="h-2 bg-[#191B1D] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D4FF1A] rounded-full transition-all duration-300"
                style={{ width: `${proPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#8A8F94]">Carbs</span>
              <span className="text-white font-medium tabular-nums">
                {totals.carbsG}g / {nutritionTargets.carbsG}g
              </span>
            </div>
            <div className="h-2 bg-[#191B1D] rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all duration-300"
                style={{ width: `${carbPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#8A8F94]">Fat</span>
              <span className="text-white font-medium tabular-nums">
                {totals.fatG}g / {nutritionTargets.fatG}g
              </span>
            </div>
            <div className="h-2 bg-[#191B1D] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8A8F94] rounded-full transition-all duration-300"
                style={{ width: `${fatPct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Custom Food Logger Drawer/Panel */}
      {showCustomForm && (
        <section
          aria-label="Add custom food item"
          className="bg-[#191B1D] border border-[#292C2E] rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">Log Custom Food</h2>
            <button
              type="button"
              onClick={() => setShowCustomForm(false)}
              className="text-xs text-[#8A8F94] hover:text-white px-2 py-1"
            >
              Cancel
            </button>
          </div>

          {/* Quick Add from Indian Food Database */}
          <div>
            <p className="text-xs text-[#8A8F94] mb-2.5">Quick add from UPRISE food database</p>
            <div className="flex flex-wrap gap-2">
              {foodDatabase.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    addCustomFood({
                      name: item.name,
                      portion: item.portion,
                      calories: item.calories,
                      proteinG: item.proteinG,
                      carbsG: item.carbsG,
                      fatG: item.fatG,
                    });
                    setShowCustomForm(false);
                  }}
                  className="px-3 py-2 rounded-lg bg-[#111111] border border-[#292C2E] hover:border-[#D4FF1A] text-xs text-white transition-colors"
                >
                  + {item.name} ({item.calories} kcal)
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddCustomSubmit} className="space-y-4 pt-4 border-t border-[#292C2E]">
            {formError && (
              <p role="alert" className="text-xs text-red-400">
                {formError}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="custom-food-name" className="block text-xs text-[#8A8F94] mb-1.5">
                  Food Item Name
                </label>
                <input
                  id="custom-food-name"
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Grilled Paneer Cubes"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111111] border border-[#292C2E] text-sm text-white focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
              <div>
                <label htmlFor="custom-food-portion" className="block text-xs text-[#8A8F94] mb-1.5">
                  Portion Quantity
                </label>
                <input
                  id="custom-food-portion"
                  type="text"
                  value={foodPortion}
                  onChange={(e) => setFoodPortion(e.target.value)}
                  placeholder="e.g. 100g"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111111] border border-[#292C2E] text-sm text-white focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label htmlFor="custom-cal" className="block text-xs text-[#8A8F94] mb-1.5">
                  Calories (kcal)
                </label>
                <input
                  id="custom-cal"
                  type="number"
                  min="1"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="220"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111111] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
              <div>
                <label htmlFor="custom-pro" className="block text-xs text-[#8A8F94] mb-1.5">
                  Protein (g)
                </label>
                <input
                  id="custom-pro"
                  type="number"
                  min="0"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="18"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111111] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
              <div>
                <label htmlFor="custom-carbs" className="block text-xs text-[#8A8F94] mb-1.5">
                  Carbs (g)
                </label>
                <input
                  id="custom-carbs"
                  type="number"
                  min="0"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="6"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111111] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
              <div>
                <label htmlFor="custom-fat" className="block text-xs text-[#8A8F94] mb-1.5">
                  Fat (g)
                </label>
                <input
                  id="custom-fat"
                  type="number"
                  min="0"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  placeholder="14"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111111] border border-[#292C2E] text-sm text-white tabular-nums focus:outline-none focus:border-[#D4FF1A]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D4FF1A] text-black text-sm font-semibold hover:bg-[#c5ee14] transition-colors min-h-[44px]"
              >
                Save Food Item
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Scheduled Meal Schedule */}
      <section aria-label="Today's meal schedule" className="space-y-4">
        {meals.map((meal) => {
          const isExpanded = expandedMealId === meal.id;
          const macros = getMealMacros(meal);
          const selectedAlt = meal.alternatives.find((a) => a.id === meal.selectedAlternativeId);

          return (
            <article
              key={meal.id}
              className="bg-[#111111] border border-[#292C2E] rounded-2xl overflow-hidden transition-colors"
            >
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A8F94]">
                    <span className="font-medium text-white">{meal.slot}</span>
                    <span aria-hidden="true">·</span>
                    <span>{meal.scheduledTime}</span>
                    {meal.completed && meal.loggedAt && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#D4FF1A]">Logged {meal.loggedAt}</span>
                      </>
                    )}
                  </div>

                  <h2 className="font-display text-lg font-bold text-white mt-1.5">
                    {selectedAlt ? selectedAlt.title : meal.mealName}
                  </h2>

                  <p className="text-xs text-[#9BA1A6] mt-2 tabular-nums">
                    {macros.calories} kcal · P {macros.proteinG}g · C {macros.carbsG}g · F{' '}
                    {macros.fatG}g
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleMealCompleted(meal.id)}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap min-h-[44px] ${
                      meal.completed
                        ? 'bg-[#D4FF1A] text-black hover:bg-[#c5ee14]'
                        : 'bg-[#191B1D] text-white border border-[#292C2E] hover:border-[#3E4246]'
                    }`}
                  >
                    <Check className="w-4 h-4" strokeWidth={2.25} />
                    <span>{meal.completed ? 'Completed' : 'Mark Complete'}</span>
                  </button>

                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-label={`Toggle details for ${meal.slot}`}
                    onClick={() => setExpandedMealId(isExpanded ? null : meal.id)}
                    className="w-11 h-11 rounded-xl bg-[#191B1D] border border-[#292C2E] flex items-center justify-center text-[#8A8F94] hover:text-white transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-[#292C2E] bg-[#141517] space-y-5">
                  <div>
                    <p className="text-xs font-medium text-[#8A8F94]">Portion Guidance</p>
                    <p className="text-sm text-white mt-1 leading-relaxed">
                      {selectedAlt ? selectedAlt.portionGuidance : meal.portionGuidance}
                    </p>
                  </div>

                  {!selectedAlt && (
                    <div>
                      <p className="text-xs font-medium text-[#8A8F94] mb-2.5">Food Breakdown</p>
                      <div className="divide-y divide-[#292C2E] border-y border-[#292C2E]">
                        {meal.items.map((item) => (
                          <div
                            key={item.id}
                            className="py-2.5 flex items-center justify-between gap-4 text-sm"
                          >
                            <div>
                              <p className="text-white font-medium">{item.name}</p>
                              <p className="text-xs text-[#8A8F94]">{item.portion}</p>
                            </div>
                            <div className="text-right tabular-nums shrink-0">
                              <p className="text-white font-medium">{item.calories} kcal</p>
                              <p className="text-xs text-[#8A8F94]">
                                P {item.proteinG}g · C {item.carbsG}g · F {item.fatG}g
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {meal.alternatives.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <p className="text-xs font-medium text-[#8A8F94]">Meal Alternatives</p>
                        {selectedAlt && (
                          <button
                            type="button"
                            onClick={() => selectMealAlternative(meal.id, undefined)}
                            className="text-xs text-[#D4FF1A] hover:underline"
                          >
                            Reset to primary meal
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {meal.alternatives.map((alt) => {
                          const activeAlt = meal.selectedAlternativeId === alt.id;
                          return (
                            <button
                              key={alt.id}
                              type="button"
                              onClick={() =>
                                selectMealAlternative(meal.id, activeAlt ? undefined : alt.id)
                              }
                              className={`text-left p-3.5 rounded-xl border transition-colors ${
                                activeAlt
                                  ? 'bg-[#202321] border-[#D4FF1A]'
                                  : 'bg-[#111111] border-[#292C2E] hover:border-[#3E4246]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-white">{alt.title}</span>
                                <RefreshCw
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    activeAlt ? 'text-[#D4FF1A]' : 'text-[#6B6B6B]'
                                  }`}
                                />
                              </div>
                              <p className="text-xs text-[#8A8F94] mt-1 tabular-nums">
                                {alt.calories} kcal · P {alt.proteinG}g · C {alt.carbsG}g · F{' '}
                                {alt.fatG}g
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* Logged Custom Foods */}
      {customFoods.length > 0 && (
        <section
          aria-label="Logged custom food items"
          className="bg-[#111111] border border-[#292C2E] rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-4 h-4 text-[#D4FF1A]" />
            <h2 className="font-display text-base font-semibold text-white">
              Additional Logged Foods
            </h2>
          </div>
          <div className="divide-y divide-[#292C2E]">
            {customFoods.map((food) => (
              <div
                key={food.id}
                className="py-3 flex items-center justify-between gap-4 text-sm"
              >
                <div>
                  <p className="text-white font-medium">{food.name}</p>
                  <p className="text-xs text-[#8A8F94] tabular-nums">
                    {food.portion} · {food.calories} kcal · P {food.proteinG}g · C {food.carbsG}g ·
                    F {food.fatG}g
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomFood(food.id)}
                  aria-label={`Remove ${food.name}`}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[#8A8F94] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
