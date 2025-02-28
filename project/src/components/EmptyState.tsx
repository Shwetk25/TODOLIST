import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ListTodo } from 'lucide-react';

interface EmptyStateProps {
  type: 'empty' | 'completed';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      {type === 'empty' ? (
        <>
          <ListTodo size={64} className="text-yellow-300 mb-4" />
          <h3 className="text-xl font-medium text-yellow-500 mb-2">No tasks yet</h3>
          <p className="text-yellow-400 max-w-xs">
            Add some tasks to your list and start being productive!
          </p>
        </>
      ) : (
        <>
          <CheckCircle size={64} className="text-yellow-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">All done!</h3>
          <p className="text-gray-400 max-w-xs">
            You've completed all your tasks. Time for a break!
          </p>
        </>
      )}
    </motion.div>
  );
};

export default EmptyState;