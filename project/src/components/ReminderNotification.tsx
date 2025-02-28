import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { Todo } from '../types';

interface ReminderNotificationProps {
  todo: Todo | null;
  onClose: () => void;
}

const ReminderNotification: React.FC<ReminderNotificationProps> = ({ todo, onClose }) => {
  useEffect(() => {
    if (todo) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [todo, onClose]);

  return (
    <AnimatePresence>
      {todo && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-blue-600 px-4 py-2 flex justify-between items-center">
            <div className="flex items-center text-white">
              <Bell size={18} className="mr-2" />
              <h3 className="font-medium">Task Reminder</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-blue-200"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-4">
            <p className="font-medium mb-1">{todo.text}</p>
            <p className="text-sm text-gray-600">
              This task is due {todo.dueDate ? `on ${new Date(todo.dueDate).toLocaleDateString()}` : 'soon'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReminderNotification;