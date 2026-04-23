import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, MessageSquare, Shield, Zap, DollarSign, Users, ExternalLink, RocketIcon, Database, Cpu, Layers, Flame } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

const ScriptBotView: React.FC = () => {
  const features = [
    { icon: <RocketIcon className="w-5 h-5 text-emerald-400" />, title: "1400+ Fitur", desc: "Koleksi fitur terlengkap untuk segala kebutuhan." },
    { icon: <Database className="w-5 h-5 text-blue-400" />, title: "Multi Database", desc: "Mendukung berbagai jenis penyimpanan data." },
    { icon: <Cpu className="w-5 h-5 text-purple-400" />, title: "High Performance", desc: "Optimasi kode untuk respon super cepat." },
    { icon: <Layers className="w-5 h-5 text-orange-400" />, title: "Easy Setup", desc: "Instalasi mudah bahkan untuk pemula." },
    { icon: <Shield className="w-5 h-5 text-red-400" />, title: "Anti Ban", desc: "Sistem keamanan berlapis untuk akun Anda." },
    { icon: <Flame className="w-5 h-5 text-yellow-400" />, title: "Active Update", desc: "Pembaruan rutin untuk fitur-fitur terbaru." }
  ];

  return (
    <div className="min-h-screen bg-black pt-20 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-zinc-900/50 border border-white/10 mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10" />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
                <Zap className="w-3 h-3" />
                PREMIUM SCRIPT
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cyrene MD <span className="text-emerald-500">v10.5.0</span></h1>
              <p className="text-zinc-400 text-lg mb-8 max-w-xl">
                Script bot WhatsApp tercanggih dengan fitur terlengkap di kelasnya. 
                Didesain untuk performa tinggi dan kemudahan penggunaan.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo, saya ingin membeli Script Cyrene MD`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
                >
                  <DollarSign className="w-5 h-5" />
                  Beli Sekarang
                </a>
                <a 
                  href="https://whatsapp.com/channel/0029Vajm76q6BIEfP78FvX3p"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all border border-white/5"
                >
                  <ExternalLink className="w-5 h-5" />
                  Demo Bot
                </a>
              </div>
            </div>
            <div className="w-full md:w-72 aspect-square relative">
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <img 
                  src="https://raw.githubusercontent.com/RahmadPasker/dat1/main/uploads/alip-clutch-1773946543386.jpg" 
                  alt="Cyrene MD"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute -bottom-4 -right-4 bg-zinc-900 border border-white/10 p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs">
                    <div className="text-white font-bold">500+</div>
                    <div className="text-zinc-500 text-[10px]">Users Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-emerald-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-white font-bold mb-2">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing/Benefits Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              Apa yang Anda dapatkan?
            </h3>
            <ul className="space-y-4">
              {[
                "Full Source Code (No Encrypt)",
                "Free Update Selamanya",
                "Akses Group Support Premium",
                "Tutorial Instalasi Lengkap",
                "Free Konsultasi 24/7",
                "Lisensi Penggunaan Pribadi"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">Harga Spesial</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">Rp 70.000</span>
                <span className="text-zinc-500 line-through">Rp 150.000</span>
              </div>
              <p className="text-zinc-400 text-sm mb-8">
                Dapatkan akses penuh ke script Cyrene MD dengan harga promo terbatas. 
                Investasi sekali untuk penggunaan selamanya.
              </p>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo, saya ingin membeli Script Cyrene MD`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Hubungi Owner
              </a>
            </div>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScriptBotView;
