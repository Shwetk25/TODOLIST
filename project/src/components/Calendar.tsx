import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { Todo } from '../types';

interface CalendarProps {
  todos: Todo[];
  currentMonth: Date;
  onDateClick: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  todos, 
  currentMonth, 
  onDateClick, 
  onPrevMonth, 
  onNextMonth 
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getTodosForDate = (date: Date) => {
    return todos.filter(todo => 
      todo.dueDate && isSameDay(new Date(todo.dueDate), date)
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-500">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-md bg-green-100 hover:bg-green-300"
          >
            &lt;
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 rounded-md bg-green-100 hover:bg-green-300"
          >
            &gt;
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-green-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const todosForDay = getTodosForDate(day);
          const hasTodos = todosForDay.length > 0;
          const hasOverdue = todosForDay.some(todo => !todo.completed);
          
          return (
            <div
              key={day.toString()}
              onClick={() => onDateClick(day)}
              className={`
                h-16 p-1 border rounded-md cursor-pointer transition-colors
                ${!isSameMonth(day, currentMonth) ? 'bg-green-50 text-green-400' : ''}
                ${isToday(day) ? 'border-blue-500 bg-blue-50' : 'border-green-200'}
                ${hasTodos ? 'hover:bg-blue-50' : 'hover:bg-green-50'}
              `}
            >
              <div className="flex flex-col h-full">
                <div className="text-right text-sm">
                  {format(day, 'd')}
                </div>
                {hasTodos && (
                  <div className="mt-auto flex justify-center">
                    <div 
                      className={`w-4 h-4 rounded-full ${
                        hasOverdue ? 'bg-green-500' : 'bg-green-600'
                      }`}
                    >
                      {todosForDay.length > 1 && (
                        <span className="text-red text-xs flex justify-center">
                          {todosForDay.length}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Calendar;