import React from 'react';
import { motion } from 'motion/react';
import { RocketIcon } from 'lucide-react';

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <RocketIcon className="w-12 h-12 text-emerald-500" />
          </motion.div>
        </div>
        <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
      </motion.div>
      
      <div className="w-64 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 text-zinc-500 text-xs font-mono tracking-widest uppercase">
        Initializing System {progress}%
      </div>
    </div>
  );
};

export default LoadingScreen;
