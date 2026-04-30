import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, Star } from 'lucide-react';
import { SiteSettings } from '../../constants';

const TimeDateCard = ({ siteSettings }: { siteSettings?: SiteSettings }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }) + ' WIB';

  const dateString = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  }).format(now);

  const hijriString = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  }).format(now);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative max-w-5xl mx-auto">
        <div className="bg-theme-card rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-theme-border overflow-hidden relative w-full">
          {/* Header */}
          <div className="bg-theme-card border-b border-theme-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs font-mono font-bold tracking-widest text-theme-muted uppercase">
               REALTIME SERVER TIME
            </div>
            <div className="text-theme-muted">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-10 flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch">
            {/* Clock Section */}
            <div className="w-full lg:w-1/3 bg-theme-surface rounded-2xl p-5 sm:p-6 border border-theme-border flex flex-row lg:flex-col items-center lg:items-start lg:justify-center gap-4 shadow-inner group">
              <div className="w-12 h-12 bg-theme-accent/10 rounded-xl flex items-center justify-center shrink-0 border border-theme-accent/20 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-theme-accent animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-theme-text mb-0.5 sm:mb-1">{timeString}</h3>
                <p className="text-[10px] sm:text-xs font-black text-theme-accent uppercase tracking-widest">WIB ASIA/JAKARTA</p>
              </div>
            </div>

            {/* Date Section */}
            <div className="flex-1 bg-theme-bg rounded-2xl p-5 sm:p-6 md:p-8 border border-theme-border text-white relative overflow-hidden flex flex-col justify-center shadow-inner group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <span className="text-[10px] font-bold tracking-widest text-theme-muted uppercase">KALENDER AKTIF</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse transition-all"></div>
                     <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Synchronized</span>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-4 p-4 bg-theme-surface/50 border border-theme-border rounded-2xl group/item hover:border-theme-accent/50 transition-all">
                      <div className="p-3 bg-theme-accent/10 rounded-xl text-theme-accent">
                         <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-theme-muted uppercase tracking-widest mb-1 opacity-60">Masehi</p>
                         <h4 className="text-base sm:text-xl font-black text-theme-text">{dateString}</h4>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4 p-4 bg-theme-surface/50 border border-theme-border rounded-2xl group/item hover:border-theme-accent-sec/50 transition-all">
                      <div className="p-3 bg-theme-accent-sec/10 rounded-xl text-theme-accent-sec">
                         <Star className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-theme-muted uppercase tracking-widest mb-1 opacity-60">Hijriah</p>
                         <h4 className="text-base sm:text-xl font-black text-theme-text">{hijriString} H</h4>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
           <div className="hidden lg:flex absolute -bottom-6 -right-6 items-center gap-3 bg-theme-surface p-3 pr-6 rounded-2xl shadow-xl border border-theme-border z-20">
            <div className="w-12 h-12 bg-theme-accent-sec/10 border border-theme-accent-sec/20 rounded-xl flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-6 h-6 text-theme-accent-sec" />
            </div>
            <div>
              <div className="text-sm font-black text-theme-text tracking-tight">System Valid</div>
              <div className="text-[10px] font-bold tracking-widest text-theme-muted uppercase">SERVER TIME SYNCED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDateCard;
