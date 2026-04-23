import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, DollarSign, Users } from 'lucide-react';
import { CATEGORIES } from '../constants';
import BannerSlider from './BannerSlider';
import ProductCard from './ProductCard';

const HomeView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {/* Hero Slider */}
      <BannerSlider />

      {/* Marketplace Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Horizontal Category Menu */}
        <div className="relative mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4">
            {['Semua', 'Panel', 'Sewa Bot', 'Source Code', 'App Premium'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                  selectedCategory === cat
                    ? 'bg-blue-500 text-black border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-blue-500/50 hover:text-blue-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Gradient Fade Indicators */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none md:hidden" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORIES.flatMap(cat => cat.products)
            .filter(p => selectedCategory === 'Semua' || p.category === selectedCategory)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 py-12 px-6 border-t border-white/5 bg-black/20 backdrop-blur-sm mt-20"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Zap, label: "Fast Response" },
            { icon: Shield, label: "Secure System" },
            { icon: DollarSign, label: "Affordable Pricing" },
            { icon: Users, label: "Trusted Platform" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center md:items-start gap-3 group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                <item.icon className="w-5 h-5 text-blue-400/60 group-hover:text-blue-400" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomeView;
