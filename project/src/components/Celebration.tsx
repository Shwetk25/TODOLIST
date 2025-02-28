import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface CelebrationProps {
  show: boolean;
  onComplete: () => void;
}

const Celebration: React.FC<CelebrationProps> = ({ show, onComplete }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white bg-opacity-80 p-8 rounded-xl shadow-lg text-center">
              <motion.h2
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-3xl font-bold text-yellow-500 mb-2"
              >
                Great job!
              </motion.h2>
              <motion.p
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="text-gray-900"
              >
                You've completed a task! 🎉
              </motion.p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Celebration;