import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const TimeDateCard = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Initial set
    setTime(new Date());

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null;

  // Formatting Jam WIB
  const jamWIB = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(time) + ' WIB';

  // Formatting Tanggal Masehi
  const tanggalMasehi = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(time);

  // Formatting Tanggal Hijriah
  let tanggalHijriah = '';
  try {
    tanggalHijriah = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(time) + ' H';
  } catch (e) {
    // Fallback if browser doesn't support islamic calendar formatting perfectly
    tanggalHijriah = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(time) + ' H';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-[900px] mt-8 mb-12"
    >
      <div 
        className="relative overflow-hidden p-[2px] rounded-[22px] md:rounded-[26px]"
      >
        {/* Border gradient effect could go here, but using simple borders for Clean Premium */}
        <div className="bg-[#ffffff] rounded-[20px] md:rounded-[24px] border border-[#e2e8f0] p-[18px] md:p-[24px] shadow-[0_4px_15px_rgba(15,23,42,0.03)] relative z-10 flex flex-col items-center">
          
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-[#0f172a]" />
            <span className="text-xs font-bold text-[#0f172a] uppercase tracking-widest">Waktu Indonesia Barat</span>
            <span className="ml-2 bg-[#e0f2fe] text-[#0284c7] px-[10px] py-[5px] rounded-full text-[11px] font-bold">LIVE WIB</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full">
            
            {/* Jam WIB */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[18px] p-4 text-center hover:-translate-y-[2px] transition-transform duration-300">
               <p className="text-[12px] uppercase tracking-[0.08em] text-[#64748b] font-bold mb-2">Jam Sekarang</p>
               <p className="text-[28px] md:text-[36px] font-[800] text-[#0f172a] tracking-[-0.04em] leading-none">{jamWIB}</p>
            </div>

            {/* Tanggal Masehi */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[18px] p-4 text-center hover:-translate-y-[2px] transition-transform duration-300 flex flex-col justify-center">
               <p className="text-[12px] uppercase tracking-[0.08em] text-[#64748b] font-bold mb-2">Tanggal Masehi</p>
               <p className="text-[16px] md:text-[18px] font-[600] text-[#0f172a] leading-tight">{tanggalMasehi}</p>
            </div>

            {/* Tanggal Hijriah */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[18px] p-4 text-center hover:-translate-y-[2px] transition-transform duration-300 flex flex-col justify-center">
               <p className="text-[12px] uppercase tracking-[0.08em] text-[#64748b] font-bold mb-2">Tanggal Hijriah</p>
               <p className="text-[16px] md:text-[18px] font-[600] text-[#0f172a] leading-tight">{tanggalHijriah}</p>
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default TimeDateCard;
