/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket as RocketIcon } from 'lucide-react';

const LoadingScreen = ({
  onComplete,
  storeName,
  settings
}: {
  onComplete: () => void;
  storeName?: string;
  settings?: any;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1200; // Fast loading for better mobile UX
    const intervalTime = 15;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: settings?.bgColor || '#ffffff' }}
    >
      <div className="relative mb-12">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-blue-100 blur-3xl rounded-full"
        />
        <div className="relative w-24 h-24 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200/50">
          <RocketIcon className="w-12 h-12 text-slate-900" />
        </div>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-slate-900 font-black text-xs uppercase tracking-[0.4em]">
              {settings?.mainText || storeName || "Loading Store"}
            </h2>
            <p className="text-blue-600 text-[10px] font-mono uppercase tracking-widest animate-pulse">
              {settings?.subText || "Memuat Sistem..."}
            </p>
          </div>
          <span className="text-slate-900 font-mono text-xl font-black">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <motion.div
            className="h-full bg-slate-900"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default memo(LoadingScreen);
