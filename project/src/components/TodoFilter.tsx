import React from 'react';
import { Filter, Calendar } from 'lucide-react';
import { FilterType } from '../types';

interface TodoFilterProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
  completedCount: number;
  upcomingCount: number;
}

const TodoFilter: React.FC<TodoFilterProps> = ({
  filter,
  setFilter,
  clearCompleted,
  completedCount,
  upcomingCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center mb-3 sm:mb-0">
        <Filter size={18} className="text-gray-500 mr-2" />
        <span className="text-gray-700 font-medium">Filter:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md ${
            filter === 'all'
            ? 'bg-yellow-500 text-yellow'
            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
        }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded-md ${
            filter === 'active'
            ? 'bg-yellow-500 text-yellow'
            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
        }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded-md ${
            filter === 'completed'
            ? 'bg-yellow-500 text-yellow'
            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
        }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3 py-1 rounded-md flex items-center ${
            filter === 'upcoming'
              ? 'bg-yellow-500 text-yellow'
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          <Calendar size={14} className="mr-1" />
          Upcoming
          {upcomingCount > 0 && (
            <span className="ml-1 bg-green-200 text-black text-xs square-full w-5 h-5 flex items-center justify-center">
              {upcomingCount}
            </span>
          )}
        </button>
      </div>
      
      <button
        onClick={clearCompleted}
        disabled={completedCount === 0}
        className={`mt-3 sm:mt-0 px-3 py-1 rounded-md ${
          completedCount > 0
            ? 'bg-blue-400 text-white hover:bg-blue-600'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Clear Completed
      </button>
    </div>
  );
};

export default TodoFilter;