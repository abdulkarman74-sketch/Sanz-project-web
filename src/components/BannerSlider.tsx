import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, RocketIcon } from 'lucide-react';
import { BANNER_SLIDES } from '../constants';

const BannerSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[240px] md:h-[400px] w-full rounded-[40px] overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={BANNER_SLIDES[currentSlide].image || undefined} 
            alt={BANNER_SLIDES[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-4">
                <RocketIcon className="w-3 h-3" />
                Featured Product
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-[var(--theme-text-main)] mb-4 leading-tight tracking-tighter">
                {BANNER_SLIDES[currentSlide].title}
              </h2>
              <p className="text-zinc-400 text-sm md:text-xl font-medium mb-8 max-w-md leading-relaxed">
                {BANNER_SLIDES[currentSlide].subtext}
              </p>
              <button className="px-8 py-4 bg-white hover:bg-emerald-500 text-black font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                {BANNER_SLIDES[currentSlide].buttonText}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {BANNER_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              currentSlide === i ? 'w-12 bg-emerald-500' : 'w-3 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-[var(--theme-text-main)] opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-black"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-[var(--theme-text-main)] opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-black"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default BannerSlider;
