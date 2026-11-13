import React from 'react';
import { Check, Snowflake, Minus } from 'lucide-react';
import type { HeatmapDay } from '../../types';

interface WeeklyActivityStripProps {
  days: HeatmapDay[];
  todayDayNumber: number;
}

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekdayShort(dateStr: string): string {
  const parsed = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return 'Day';
  return WEEKDAY_NAMES[parsed.getUTCDay()] ?? 'Day';
}

export const WeeklyActivityStrip: React.FC<WeeklyActivityStripProps> = ({
  days,
  todayDayNumber,
}) => {
  // Anchor a 7-day window so Today sits on the 6th slot with tomorrow previewed
  const startDay = Math.max(1, todayDayNumber - 5);
  const windowDays = days.slice(startDay - 1, startDay + 6);

  return (
    <div className="grid grid-cols-7 gap-2" aria-label="Seven day activity strip">
      {windowDays.map((day) => {
        const isToday = day.dayNumber === todayDayNumber;
        const label = getWeekdayShort(day.date);

        let boxStyle = 'bg-[#191B1D] border-[#292C2E] text-[#6B6B6B]';
        let icon: React.ReactNode = <Minus className="w-3.5 h-3.5" strokeWidth={2} />;

        if (day.status === 'active') {
          boxStyle = 'bg-[#D4FF1A] border-[#D4FF1A] text-black';
          icon = <Check className="w-4 h-4" strokeWidth={2.5} />;
        } else if (day.status === 'rest') {
          boxStyle = 'bg-[#202321] border-[#3A3E42] text-white';
          icon = <span className="text-[11px] font-medium">R</span>;
        } else if (day.status === 'rest_pass') {
          boxStyle = 'bg-[#191B1D] border-[#D4FF1A]/50 text-[#D4FF1A]';
          icon = <Snowflake className="w-3.5 h-3.5" strokeWidth={2} />;
        } else if (day.status === 'missed') {
          boxStyle = 'bg-[#111111] border-[#292C2E] text-[#6B6B6B]';
          icon = <Minus className="w-3.5 h-3.5" strokeWidth={1.75} />;
        }

        return (
          <div key={day.dayNumber} className="flex flex-col items-center gap-1.5">
            <span
              className={`text-[11px] font-medium ${
                isToday ? 'text-white' : 'text-[#8A8F94]'
              }`}
            >
              {label}
            </span>
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-colors ${boxStyle} ${
                isToday && day.status !== 'active' ? 'ring-1 ring-[#D4FF1A]' : ''
              }`}
              title={`Day ${day.dayNumber} (${label}): ${day.status.replace('_', ' ')}`}
            >
              {icon}
            </div>
          </div>
        );
      })}
    </div>
  );
};
