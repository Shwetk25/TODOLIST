import React, { useState } from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface TodoFormProps {
  addTodo: (text: string, dueDate?: Date, reminder?: boolean) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [reminder, setReminder] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text, dueDate || undefined, reminder);
      setText('');
      setDueDate(null);
      setReminder(false);
      setShowDatePicker(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-3 border border-yellow-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="bg-yellow-100 hover:bg-yellow-200 p-3 transition-colors flex items-center"
        >
          <Calendar size={20} className={dueDate ? "text-yellow-600" : "text-yellow-500"} />
        </button>
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-r-lg transition-colors flex items-center"
        >
          <PlusCircle size={20} className="mr-1" />
          Add
        </button>
      </div>
      
      {showDatePicker && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg">
          <div className="mb-3">
            <label className="block text-sm font-medium text-red-700 mb-1">Due Date</label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              minDate={new Date()}
              placeholderText="Select a due date"
              className="w-full p-2 border border-red-300 rounded-md"
              dateFormat="MMMM d, yyyy"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reminder"
              checked={reminder}
              onChange={() => setReminder(!reminder)}
              className="h-4 w-4 text-yellow-600 focus:ring-blue-500 border-yellow-300 rounded"
            />
            <label htmlFor="reminder" className="ml-2 block text-sm text-red-700">
              Set reminder notification
            </label>
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoForm;