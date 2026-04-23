/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingCart, Star, Shield, Zap } from 'lucide-react';
import { Product, WHATSAPP_NUMBER } from '../../constants';

const ProductDetailModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  if (!product) return null;

  const handleOrder = () => {
    const message = `Halo Sanz Official, saya ingin memesan:\n\n*Produk:* ${product.name}\n*Harga:* Rp${product.price}\n\nMohon info selanjutnya.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-3xl bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2.5 bg-white/50 backdrop-blur-md hover:bg-slate-100 rounded-full border border-slate-200 transition-all text-slate-800"><X className="w-5 h-5" /></button>
        
        <div className="w-full md:w-1/2 aspect-square relative bg-slate-50">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="eager" />
          <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-slate-900 text-[10px] font-black uppercase tracking-widest rounded-lg text-white shadow-sm">Official Item</span></div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-white">
          <div className="mb-4 md:mb-6">
            <div className="flex items-center gap-2 mb-3"><Star className="w-4 h-4 text-orange-400 fill-orange-400" /><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">4.9/5 Rating</span></div>
            <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 uppercase tracking-tighter leading-snug mb-2">{product.name}</h3>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">{product.category}</p>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2 no-scrollbar mb-6 md:mb-8">
            <p className="text-slate-600 text-sm leading-relaxed">{product.description || "Layanan digital berkualitas tinggi dari Sanz Official Store. Proses cepat, aman, dan terpercaya."}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3"><Zap className="w-4 h-4 text-blue-500" /><span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Instan</span></div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3"><Shield className="w-4 h-4 text-blue-500" /><span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Garansi</span></div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price</span>
                <span className="text-3xl md:text-4xl font-black text-slate-900 leading-none">Rp {product.price}</span>
              </div>
              <p className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest">In Stock</p>
            </div>
            <button onClick={handleOrder} className="w-full h-14 bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-3"><ShoppingCart className="w-5 h-5" /> Hubungi CS</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(ProductDetailModal);
