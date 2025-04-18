import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export function CalendarView({ entries }) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Get the first day of the month and the last day of the month
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  
  // Get the first day of the week that contains the first day of the month
  const firstDayOfCalendar = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  // Get the last day of the week that contains the last day of the month
  const lastDayOfCalendar = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfCalendar,
    end: lastDayOfCalendar,
  });

  const entriesByDate = entries.reduce((acc, entry) => {
    const date = format(new Date(entry.createdAt), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  const handleDayClick = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    router.push(`/?date=${dateStr}&view=list`);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handlePrevMonth}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleNextMonth}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm text-muted-foreground py-2">
            {day}
          </div>
        ))}
        
        {daysInMonth.map((day, index) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayEntries = entriesByDate[dateStr] || [];
          const isPastDay = isBefore(day, new Date()) && !isToday(day);
          const isCurrentMonth = format(day, 'MM') === format(currentDate, 'MM');
          
          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              whileHover={{ scale: 1.05, backgroundColor: 'var(--primary/10)' }}
              className={`
                aspect-square p-2 rounded-lg border cursor-pointer
                ${isPastDay ? 'bg-gray-300 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
                ${dayEntries.length > 0 ? 'border-primary' : 'border-card-border'}
                ${isToday(day) ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''}
                ${!isCurrentMonth ? 'blur-[3px]' : ''}
                transition-all duration-200
              `}
              onClick={() => handleDayClick(day)}
            >
              <div className="text-sm">{format(day, 'd')}</div>
              {dayEntries.length > 0 && (
                <div className="mt-1">
                  <div className="text-xs text-primary font-medium">
                    {dayEntries.length} entries
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 