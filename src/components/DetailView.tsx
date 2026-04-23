import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Bot, Cpu, Flame, MessageSquare, Info } from 'lucide-react';
import { Category, CATEGORIES } from '../constants';
import ProductCard from './ProductCard';

interface DetailViewProps {
  category: Category;
  onBack: () => void;
  onCategoryChange: (cat: Category) => void;
}

const DetailView = ({ category, onBack, onCategoryChange }: DetailViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 bg-[#0b0f19]/40 backdrop-blur-2xl overflow-y-auto"
    >
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 tech-grid opacity-[0.03]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Menu Utama
          </button>

          {/* Category Switcher */}
          <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  category.id === cat.id 
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-mono uppercase tracking-widest mb-2">
            <span>Home</span>
            <span className="opacity-50">/</span>
            <span>{category.title}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            {category.title}
          </h2>
          <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">{category.description}</p>
        </div>

        {category.id === 'bot' ? (
          <div className="space-y-20">
            {/* Bot Kobo Section */}
            <section>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Bot className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    SEWA BOT KOBO KANAERU
                  </h3>
                </div>
                <p className="text-gray-400 text-sm max-w-xl">
                  Bot WhatsApp dengan fitur otomatis lengkap and performa stabil untuk kebutuhan personal maupun grup.
                </p>
                <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-blue-500/50 via-blue-500/10 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.products.filter(p => p.id.startsWith('bk')).map((product) => (
                  <ProductCard key={product.id} product={product} categoryId={category.id} />
                ))}
              </div>
            </section>

            {/* Visual Divider */}
            <div className="relative py-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]"></div>
              </div>
              <div className="relative px-4 bg-[#0b0f19]">
                <div className="p-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <Cpu className="w-4 h-4 text-blue-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Bot Elaina Section */}
            <section>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Flame className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    SEWA BOT ELAINA MD
                  </h3>
                </div>
                <p className="text-gray-400 text-sm max-w-xl">
                  Bot WhatsApp dengan fitur premium and sistem respons cepat, dirancang untuk efisiensi maksimal.
                </p>
                <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-purple-500/50 via-purple-500/10 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.products.filter(p => p.id.startsWith('be')).map((product) => (
                  <ProductCard key={product.id} product={product} categoryId={category.id} />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} categoryId={category.id} />
            ))}
          </motion.div>
        )}

        {/* Footer in Detail */}
        <footer className="mt-24 pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-white/80 text-sm font-medium mb-1">© 2026 Sanz Official Store</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">All Rights Reserved</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="https://chat.whatsapp.com/H4IQh2FeNEtJb8II2ZNJfd?mode=gi_t" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors group"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-400/60 group-hover:text-blue-400" />
                <span className="group-hover:underline underline-offset-4">Join Group Bot</span>
              </a>
              <a 
                href="https://whatsapp.com/channel/0029Vb73N7dId7nVhxB4wu3R" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors group"
              >
                <Info className="w-3.5 h-3.5 text-blue-400/60 group-hover:text-blue-400" />
                <span className="group-hover:underline underline-offset-4">Channel Info & Testimoni</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default DetailView;
