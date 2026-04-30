import React, { useState, useEffect, useRef } from 'react';
import { Server, Cpu, MessageSquare, Circle } from 'lucide-react';
import { SiteSettings } from '../../constants';

const VpsStatusShowcase = ({ siteSettings }: { siteSettings?: SiteSettings }) => {
  const vpsConfig = siteSettings?.layout;
  const initialDuration = (vpsConfig?.vpsInitialDays || 49) * 86400 + 
                          (vpsConfig?.vpsInitialHours || 22) * 3600 + 
                          (vpsConfig?.vpsInitialMins || 51) * 60;
  
  const [uptimeSeconds, setUptimeSeconds] = useState(initialDuration);
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - mountedAt.current) / 1000);
      setUptimeSeconds(initialDuration + elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const d = Math.floor(uptimeSeconds / (3600 * 24));
  const h = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
  const m = Math.floor((uptimeSeconds % 3600) / 60);
  const s = uptimeSeconds % 60;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12 mb-12">
      {/* Badges */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
        <div className="px-4 py-2 bg-theme-surface border border-theme-border rounded-full text-theme-text text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
           <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-theme-accent text-theme-accent" />
           Aman & Terpercaya
        </div>
        <div className="px-4 py-2 bg-theme-surface border border-theme-border rounded-full text-theme-text text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
           <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-theme-accent-sec text-theme-accent-sec" />
           Cepat & Stabil
        </div>
      </div>

      {/* Dashboard VPS Section */}
      <div className="relative max-w-5xl mx-auto">
        <div className="bg-theme-card rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-theme-border overflow-hidden relative w-full">
          
          {/* Header mini dashboard */}
          <div className="bg-theme-card border-b border-theme-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs font-mono font-bold tracking-widest text-theme-muted uppercase">
              {siteSettings?.branding?.siteName ? `${siteSettings.branding.siteName.replace(/\s+/g, '-')}-CLOUD` : 'SERVER-DASHBOARD'}
            </div>
            <div className="text-theme-muted">
              <Server className="w-4 h-4" />
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 sm:p-6 md:p-10 flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch">
            
            {/* Card Info CPU */}
            <div className="w-full lg:w-1/3 bg-theme-surface rounded-2xl p-5 sm:p-6 border border-theme-border flex flex-row lg:flex-col items-center lg:items-start lg:justify-center gap-4 shadow-inner">
              <div className="w-12 h-12 bg-theme-accent/10 rounded-xl flex items-center justify-center shrink-0 border border-theme-accent/20">
                <Cpu className="w-6 h-6 text-theme-accent" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-theme-text mb-0.5 sm:mb-1">Powered by AMD EPYC</h3>
                <p className="text-xs sm:text-sm font-medium text-theme-muted">R26 • C6 High Performance</p>
              </div>
            </div>

            {/* Card Uptime */}
            <div className="flex-1 bg-theme-bg rounded-2xl p-5 sm:p-6 md:p-8 border border-theme-border text-white relative overflow-hidden flex flex-col justify-center shadow-inner">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-theme-accent-sec/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
                  <span className="text-[10px] font-bold tracking-widest text-theme-muted uppercase">SERVER UPTIME</span>
                  <span className="px-3 py-1 bg-theme-accent/10 text-theme-accent text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 border border-theme-accent/20">
                    <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                    LIVE
                  </span>
                </div>
                
                <div className="font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-4 tracking-tighter text-theme-text flex flex-wrap gap-x-2 gap-y-1 items-baseline">
                  {d} <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-widest text-theme-muted mr-1 sm:mr-3">HARI</span>
                  {h} <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-widest text-theme-muted mr-1 sm:mr-3">JAM</span>
                  {String(m).padStart(2, '0')} <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-widest text-theme-muted mr-1 sm:mr-3">MENIT</span>
                  {String(s).padStart(2, '0')} <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-widest text-theme-muted">DETIK</span>
                </div>

                <div className="text-[10px] sm:text-xs font-medium text-theme-muted mb-5 sm:mb-6">
                  Uptime Sejak: 07 Apr 2026 • Terus aktif tanpa gangguan
                </div>

                <div className="w-full h-1.5 sm:h-2 bg-theme-surface rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-theme-accent to-theme-accent-sec w-[96%] sm:w-[98%] rounded-full relative">
                    <div className="absolute right-0 top-0 h-full w-4 bg-white/50 blur-sm animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile bot bubble (Flows in document) */}
          <div className="lg:hidden mx-4 sm:mx-6 mb-4 sm:mb-6 flex items-center gap-3 bg-theme-surface p-3 pr-5 rounded-2xl shadow-sm border border-theme-border w-max relative z-20">
            <div className="w-10 h-10 bg-theme-accent/10 border border-theme-accent/20 rounded-xl flex items-center justify-center shadow-inner">
              <MessageSquare className="w-5 h-5 text-theme-accent" />
            </div>
            <div>
              <div className="text-sm font-black text-theme-text tracking-tight">Bot Otomatis</div>
              <div className="text-[9px] font-bold tracking-widest text-theme-muted uppercase">AUTO REPLY SYSTEM</div>
            </div>
          </div>
        </div>

        {/* Desktop bubble bot (Absolute position) */}
        <div className="hidden lg:flex absolute -bottom-6 -left-6 items-center gap-3 bg-theme-surface p-3 pr-6 rounded-2xl shadow-xl border border-theme-border z-20">
          <div className="w-12 h-12 bg-theme-accent/10 border border-theme-accent/20 rounded-xl flex items-center justify-center shadow-inner">
            <MessageSquare className="w-6 h-6 text-theme-accent" />
          </div>
          <div>
            <div className="text-sm font-black text-theme-text tracking-tight">Bot Otomatis</div>
            <div className="text-[10px] font-bold tracking-widest text-theme-muted uppercase">AUTO REPLY SYSTEM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VpsStatusShowcase;
