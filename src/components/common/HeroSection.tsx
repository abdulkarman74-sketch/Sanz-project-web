/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import { motion } from 'motion/react';
import { Server, MessageCircle, LayoutGrid, ShieldCheck, Play, Volume2, Cpu, Clock, Activity, Cloud, Terminal } from 'lucide-react';

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [uptime, setUptime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Attempt autoplay (might be blocked by browser)
    if (audioRef.current) {
        audioRef.current.play().then(() => {
            setIsPlaying(true);
        }).catch(() => {
            console.log("Autoplay blocked. User interaction required.");
            setIsPlaying(false);
        });
    }
    
    // Fixed start time: around mid-April 2026 (or earlier) to simulate a running server.
    const START_TIME = new Date('2026-04-07T08:30:00Z').getTime();
    
    const updateTimer = () => {
        const now = Date.now();
        const diffInSeconds = Math.max(0, Math.floor((now - START_TIME) / 1000));
        setUptime({
            days: Math.floor(diffInSeconds / 86400),
            hours: Math.floor((diffInSeconds % 86400) / 3600),
            minutes: Math.floor((diffInSeconds % 3600) / 60),
            seconds: diffInSeconds % 60
        });
    };
    
    updateTimer(); // Initialize immediately
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full overflow-hidden bg-white min-h-[85vh] flex items-center pt-24 pb-16">
      <audio ref={audioRef} loop src="http://rahmad-elaina.my.id/file/cd38fe1d6b.mp3" preload="auto" />
      
      {/* Abstract Background Design / Lightweight Gradients */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-50/60 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-emerald-50/40 rounded-full blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Left Content (Text & CTA) */}
        <div className="flex flex-col items-start text-left space-y-5 lg:space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-200 shadow-sm"
          >
            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-700">Digital Store Premium</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-slate-900 tracking-tighter uppercase leading-[1.1]"
          >
            Infrastruktur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Terpadu &amp;</span> Modern
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm sm:text-base lg:text-lg font-medium leading-relaxed max-w-xl"
          >
            Pusat layanan digital eksklusif. Tingkatkan performa dan otomasi bisnis Anda dengan Cloud VPS kelas enterprise, sistem cerdas Bot WhatsApp, dan lisensi Aplikasi Premium siap pakai.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2"
          >
            <button 
              onClick={() => document.getElementById('products')?.scrollIntoView({behavior: 'smooth'})}
              className="h-14 px-8 bg-slate-900 hover:bg-black text-white rounded-xl font-bold uppercase tracking-widest text-[11px] sm:text-xs shadow-lg shadow-slate-900/10 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <LayoutGrid className="w-4 h-4" /> Lihat Layanan
            </button>
            <button 
              onClick={toggleAudio}
              className="h-14 px-8 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold uppercase tracking-widest text-[11px] sm:text-xs shadow-sm transition-all flex items-center justify-center gap-2 z-20 group"
            >
              {isPlaying ? <Volume2 className="w-4 h-4 text-blue-500" /> : <Play className="w-4 h-4 text-slate-500" />}
              <span>{isPlaying ? 'Matikan Musik' : 'Putar Musik'}</span>
            </button>
          </motion.div>
          
          {/* Subtle Trust Indicators */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
                 <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest">Aman &amp; Terpercaya</span>
              </div>
              <div className="flex items-center gap-2">
                 <Cloud className="w-4 h-4 text-blue-500" />
                 <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest">Cepat &amp; Stabil</span>
              </div>
          </motion.div>
        </div>

        {/* Right Content - Realistic SaaS / Dashboard Monitor (Mobile First Layout) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative w-full max-w-[500px] lg:max-w-none mx-auto mt-8 lg:mt-0 px-2 sm:px-0"
        >
          {/* Central Dashboard Panel */}
          <div className="relative z-10 w-full bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
             
             {/* Fake Header Controls */}
             <div className="w-full h-10 border-b border-slate-100 flex items-center px-4 gap-2 bg-slate-50/50">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                 <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                 <div className="mx-auto px-3 py-1 rounded-md bg-white border border-slate-100 flex items-center gap-1.5 shadow-sm">
                    <Terminal className="w-3 h-3 text-slate-400" />
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">sanz-cloud-dashboard</span>
                 </div>
             </div>
             
             <div className="flex-1 w-full flex flex-col p-4 sm:p-6 gap-4 sm:gap-5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/30 to-white">
                 
                 {/* AMD EPYC Spec Panel */}
                 <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                        <Cpu className="w-16 h-16 text-blue-900" />
                     </div>
                     <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl flex items-center justify-center">
                         <Cpu className="w-6 h-6 text-blue-600" />
                     </div>
                     <div className="relative z-10 flex flex-col justify-center">
                         <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">Powered by AMD EPYC</h3>
                         <p className="text-[10px] sm:text-xs text-slate-500 font-mono tracking-wide mt-0.5">R26 • C6 High Performance</p>
                     </div>
                 </div>
                 
                 {/* LIVE UPTIME COUNTER CARD */}
                 <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-center relative overflow-hidden group">
                     {/* Decorative subtle grid inside dark card */}
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-50" />
                     
                     <div className="relative z-10 flex items-center justify-between mb-3">
                         <span className="text-[10px] sm:text-xs text-slate-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
                             <Clock className="w-3.5 h-3.5 text-blue-400" /> SERVER UPTIME
                         </span>
                         <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase tracking-widest">
                             <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.5)]" /> LIVE
                         </span>
                     </div>
                     
                     {/* Dynamic Uptime Reading */}
                     <div className="relative z-10 font-mono text-sm sm:text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white tracking-widest mb-2 flex flex-wrap gap-1">
                         <span>{uptime.days} <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-sans font-medium mr-1.5">hari</span></span>
                         <span>{uptime.hours.toString().padStart(2, '0')} <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-sans font-medium mr-1.5">jam</span></span>
                         <span>{uptime.minutes.toString().padStart(2, '0')} <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-sans font-medium mr-1.5">menit</span></span>
                         <span>{uptime.seconds.toString().padStart(2, '0')} <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-sans font-medium">detik</span></span>
                     </div>
                     
                     <div className="relative z-10 flex items-center gap-2 text-[9px] sm:text-[10px] text-slate-400 mt-1 pb-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                         <p>Uptime Sejak: 07 Apr 2026 • Terus aktif tanpa gangguan</p>
                     </div>
                     
                     {/* Bottom progress bar illusion */}
                     <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-800">
                         <motion.div className="h-full bg-emerald-400" animate={{ width: ["0%", "100%"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
                     </div>
                 </div>

             </div>
          </div>

          {/* Floating Cards (Responsive positioned specifically so they don't block the UI in mobile mode) */}
          
          <motion.div 
            animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-4 -right-1 sm:-top-6 sm:-right-6 z-20 scale-90 sm:scale-100"
          >
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 backdrop-blur-md">
               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                 <Server className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
               </div>
               <div className="pr-2 hidden sm:block">
                 <p className="text-[11px] font-bold text-slate-900 leading-tight">Secure Cloud</p>
                 <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Deployed Ready</p>
               </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-3 -left-2 sm:-bottom-8 sm:-left-8 z-20 scale-90 sm:scale-100"
          >
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 backdrop-blur-md">
               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                 <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
               </div>
               <div className="pr-2">
                 <p className="text-[10px] sm:text-[11px] font-bold text-slate-900 leading-tight">Bot Otomatis</p>
                 <p className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest">Auto Reply System</p>
               </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default memo(HeroSection);
