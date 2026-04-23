/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Info, MessageSquare } from 'lucide-react';
import { Category, Product } from '../../constants';

const ProductCard = memo(({ product, onDetail }: { product: Product; onDetail?: (p: Product) => void }) => {
  return (
    <div 
      onClick={() => onDetail?.(product)}
      className="group bg-[#0a0a0f]/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer transition-all hover:border-blue-500/30"
    >
      <div className="aspect-video overflow-hidden m-2 rounded-xl">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="px-4 pb-4 pt-1 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">{product.name}</h3>
        <div className="mt-auto pt-3 border-t border-white/5">
          <span className="text-lg font-black text-white">Rp {product.price}</span>
        </div>
      </div>
    </div>
  );
});

const DetailView = ({ category, onBack, onCategoryChange, onDetail, localCategories }: { 
  category: Category, 
  onBack: () => void, 
  onCategoryChange: (cat: Category) => void, 
  onDetail: (p: Product) => void, 
  localCategories: Category[] 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed inset-0 z-40 bg-[#0b0f19] overflow-y-auto"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1" />
            Kembali ke Menu Utama
          </button>
          <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10 overflow-x-auto">
            {localCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  category.id === cat.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} onDetail={onDetail} />
          ))}
        </div>

        <footer className="mt-24 pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
            <p>© 2026 Sanz Official Store</p>
            <div className="flex gap-6">
              <span className="flex items-center gap-2"><MessageSquare className="w-3 h-3" /> Group Bot</span>
              <span className="flex items-center gap-2"><Info className="w-3 h-3" /> Testimoni</span>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default memo(DetailView);
