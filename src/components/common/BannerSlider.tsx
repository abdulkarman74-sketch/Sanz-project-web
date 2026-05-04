/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BANNER_SLIDES } from '../../constants';

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);
  const slides = BANNER_SLIDES;

  const next = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="relative w-full aspect-[21/9] md:aspect-auto md:h-[500px] overflow-hidden rounded-2xl md:rounded-[3rem] shadow-sm bg-[var(--theme-bg-main)] group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img src={slides[current].image || undefined} alt="" className="w-full h-full object-cover opacity-80" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent opacity-90" />
          
          <div className="absolute inset-y-0 left-0 flex items-center p-8 md:p-16 max-w-2xl">
            <div>
              <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block">Official Release</motion.span>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-6xl font-display font-black text-[var(--theme-text-main)] tracking-tighter leading-tight mb-4 uppercase">{slides[current].title}</motion.h2>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-[var(--theme-text-muted)] text-sm md:text-base font-medium tracking-wide max-w-lg uppercase">{slides[current].subtext}</motion.p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={prev} className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-900 text-[var(--theme-text-main)] transition-all"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={next} className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-900 text-[var(--theme-text-main)] transition-all"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`transition-all duration-300 rounded-full h-1.5 ${current === i ? 'w-8 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
};

export default memo(BannerSlider);
