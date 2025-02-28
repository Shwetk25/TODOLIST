import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit, Calendar, Bell, BellOff } from 'lucide-react';
import { Todo } from '../types';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
  toggleReminder: (id: string) => void;
  updateDueDate: (id: string, dueDate?: Date) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  toggleTodo, 
  deleteTodo, 
  editTodo,
  toggleReminder,
  updateDueDate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(todo.dueDate || null);

  const handleEdit = () => {
    if (editText.trim() !== '') {
      editTodo(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    updateDueDate(todo.id, date || undefined);
  };

  const getDueDateLabel = () => {
    if (!todo.dueDate) return null;
    
    if (isToday(todo.dueDate)) {
      return <span className="text-orange-500 font-medium">Today</span>;
    } else if (isTomorrow(todo.dueDate)) {
      return <span className="text-yellow-500 font-medium">Tomorrow</span>;
    } else if (isPast(todo.dueDate)) {
      return <span className="text-red-500 font-medium">Overdue</span>;
    }
    
    return <span className="text-yellow-500">{format(todo.dueDate, 'MMM d')}</span>;
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center justify-between p-4 mb-3 rounded-lg shadow-md ${
        todo.completed ? 'bg-yellow-50' : isPast(new Date(todo.dueDate || '')) && !todo.completed ? 'bg-red-50' : 'bg-white'
      }`}
    >
      <div className="flex items-center flex-1">
        <button
          onClick={() => toggleTodo(todo.id)}
          className={`w-6 h-6 mr-4 rounded-full border-2 flex items-center justify-center ${
            todo.completed ? 'bg-yellow-500 border-yellow-500' : 'border-gray-300'
          }`}
        >
          {todo.completed && <Check size={14} className="text-white" />}
        </button>

        <div className="flex-1">
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleEdit}
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                autoFocus
                className="w-full p-1 border border-gray-300 rounded mb-2"
              />
              <div className="flex items-center mt-2">
                <Calendar size={15} className="text-gray-500 mr-2" />
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  placeholderText="Set due date"
                  className="p-1 text-sm border border-yellow-300 rounded"
                  dateFormat="MMM d, yyyy"
                />
              </div>
            </div>
          ) : (
            <div>
              <span
                className={`block ${
                  todo.completed ? 'line-through text-yellow-500' : 'text-gray-800'
                }`}
              >
                {todo.text}
              </span>
              
              {todo.dueDate && (
                <div className="flex items-center mt-1 text-xs">
                  <Calendar size={12} className="mr-1 text-yellow-400" />
                  {getDueDateLabel()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        {!isEditing && todo.dueDate && !todo.completed && (
          <button
            onClick={() => toggleReminder(todo.id)}
            className={`p-1 ${todo.reminder ? 'text-red-500' : 'text-red-400'} hover:text-red-700 transition-colors`}
            title={todo.reminder ? "Disable reminder" : "Enable reminder"}
          >
            {todo.reminder ? <Bell size={19} /> : <BellOff size={18} />}
          </button>
        )}
        <button
          onClick={() => {
            if (isEditing) {
              handleEdit();
            } else {
              setIsEditing(true);
            }
          }}
          className="p-1 text-blue-500 hover:text-blue-900 transition-colors"
        >
          <Edit size={19} />
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="p-1 text-yellow-400 hover:text-yellow-700 transition-colors"
        >
          <Trash2 size={19} />
        </button>
      </div>
    </motion.li>
  );
};

export default TodoItem;