import React, { useState, useEffect } from 'react';
import { Server, Cpu, MessageSquare, Circle } from 'lucide-react';

const VpsStatusShowcase = () => {
  // Target: 49 days, 22 hours, 51 mins, 0 secs
  // Which is 49 * 86400 + 22 * 3600 + 51 * 60 = 4315860 seconds
  const initialSeconds = 4315860;
  const [uptimeSeconds, setUptimeSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptimeSeconds(prev => prev + 1);
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
        <div className="px-4 py-2 bg-[#111827] border border-[#1f2937] rounded-full text-[#f8fafc] text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
           <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#22d3ee] text-[#22d3ee]" />
           Aman & Terpercaya
        </div>
        <div className="px-4 py-2 bg-[#111827] border border-[#1f2937] rounded-full text-[#f8fafc] text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
           <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#2dd4bf] text-[#2dd4bf]" />
           Cepat & Stabil
        </div>
      </div>

      {/* Dashboard VPS Section */}
      <div className="relative max-w-5xl mx-auto">
        <div className="bg-[#0b1220] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[#1f2937] overflow-hidden relative w-full">
          
          {/* Header mini dashboard */}
          <div className="bg-[#0b1220] border-b border-[#1f2937] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs font-mono font-bold tracking-widest text-[#94a3b8]">
              SANZ-CLOUD-DASHBOARD
            </div>
            <div className="text-[#94a3b8]">
              <Server className="w-4 h-4" />
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 sm:p-6 md:p-10 flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch">
            
            {/* Card Info CPU */}
            <div className="w-full lg:w-1/3 bg-[#111827] rounded-2xl p-5 sm:p-6 border border-[#1f2937] flex flex-row lg:flex-col items-center lg:items-start lg:justify-center gap-4 shadow-inner">
              <div className="w-12 h-12 bg-[#22d3ee]/10 rounded-xl flex items-center justify-center shrink-0 border border-[#22d3ee]/20">
                <Cpu className="w-6 h-6 text-[#22d3ee]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-[#f8fafc] mb-0.5 sm:mb-1">Powered by AMD EPYC</h3>
                <p className="text-xs sm:text-sm font-medium text-[#94a3b8]">R26 • C6 High Performance</p>
              </div>
            </div>

            {/* Card Uptime */}
            <div className="flex-1 bg-[#050816] rounded-2xl p-5 sm:p-6 md:p-8 border border-[#1f2937] text-white relative overflow-hidden flex flex-col justify-center shadow-inner">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#22d3ee]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2dd4bf]/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
                  <span className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">SERVER UPTIME</span>
                  <span className="px-3 py-1 bg-[#22d3ee]/10 text-[#22d3ee] text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 border border-[#22d3ee]/20">
                    <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                    LIVE
                  </span>
                </div>
                
                <div className="font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-4 tracking-tighter text-[#f8fafc] flex flex-wrap gap-x-2 gap-y-1 items-baseline">
                  {d} <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-widest text-[#94a3b8] mr-1 sm:mr-3">HARI</span>
                  {h} <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-widest text-[#94a3b8] mr-1 sm:mr-3">JAM</span>
                  {String(m).padStart(2, '0')} <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-widest text-[#94a3b8] mr-1 sm:mr-3">MENIT</span>
                  {String(s).padStart(2, '0')} <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-widest text-[#94a3b8]">DETIK</span>
                </div>

                <div className="text-[10px] sm:text-xs font-medium text-[#94a3b8] mb-5 sm:mb-6">
                  Uptime Sejak: 07 Apr 2026 • Terus aktif tanpa gangguan
                </div>

                <div className="w-full h-1.5 sm:h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#22d3ee] to-[#2dd4bf] w-[96%] sm:w-[98%] rounded-full relative">
                    <div className="absolute right-0 top-0 h-full w-4 bg-white/50 blur-sm animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile bot bubble (Flows in document) */}
          <div className="lg:hidden mx-4 sm:mx-6 mb-4 sm:mb-6 flex items-center gap-3 bg-[#111827] p-3 pr-5 rounded-2xl shadow-sm border border-[#1f2937] w-max relative z-20">
            <div className="w-10 h-10 bg-[#22d3ee]/10 border border-[#22d3ee]/20 rounded-xl flex items-center justify-center shadow-inner">
              <MessageSquare className="w-5 h-5 text-[#22d3ee]" />
            </div>
            <div>
              <div className="text-sm font-black text-[#f8fafc] tracking-tight">Bot Otomatis</div>
              <div className="text-[9px] font-bold tracking-widest text-[#94a3b8] uppercase">AUTO REPLY SYSTEM</div>
            </div>
          </div>
        </div>

        {/* Desktop bubble bot (Absolute position) */}
        <div className="hidden lg:flex absolute -bottom-6 -left-6 items-center gap-3 bg-[#111827] p-3 pr-6 rounded-2xl shadow-xl border border-[#1f2937] z-20">
          <div className="w-12 h-12 bg-[#22d3ee]/10 border border-[#22d3ee]/20 rounded-xl flex items-center justify-center shadow-inner">
            <MessageSquare className="w-6 h-6 text-[#22d3ee]" />
          </div>
          <div>
            <div className="text-sm font-black text-[#f8fafc] tracking-tight">Bot Otomatis</div>
            <div className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">AUTO REPLY SYSTEM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VpsStatusShowcase;
