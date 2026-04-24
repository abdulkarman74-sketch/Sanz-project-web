/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingCart, Star, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { Product, WHATSAPP_NUMBER } from '../../constants';

// Helper to format description into a clean list
const formatDescription = (desc: string) => {
  if (!desc) return [];
  let items: string[] = [];
  if (desc.includes('✔') || desc.includes('✓') || desc.includes('•')) {
    items = desc.split(/[✔✓•]/).map(s => s.trim()).filter(s => s.length > 0);
  } else if (desc.includes(',')) {
    items = desc.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } else {
    items = [desc.trim()];
  }
  return items;
};

const ProductDetailModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  if (!product) return null;

  const handleOrder = () => {
    const message = `Halo Sanz Official, saya ingin memesan:\n\n*Produk:* ${product.name}\n*Harga:* Rp${product.price}\n\nMohon info selanjutnya.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const featureList = formatDescription(product.description || "Layanan digital berkualitas tinggi dari Sanz Official Store. Proses cepat, aman, dan terpercaya.");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050816]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-xl bg-[#0b1220] border border-[#1f2937] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2.5 bg-[#050816]/40 backdrop-blur-md hover:bg-[#050816]/60 rounded-full border border-white/10 transition-all text-white"><X className="w-5 h-5" /></button>
        
        {/* Image 16:9 always on top */}
        <div className="w-full aspect-[16/9] relative bg-[#050816] shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] directly into transparent via-transparent opacity-80" />
          <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[10px] font-black uppercase tracking-widest rounded-lg text-[#22d3ee] shadow-sm">Official Item</span></div>
        </div>

        {/* Scrollable Detail Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 overflow-y-auto w-full no-scrollbar">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">{product.rating || '4.9'}/5 Rating</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-black text-[#f8fafc] uppercase tracking-tight leading-snug mb-1 pr-4">{product.name}</h3>
            <p className="text-[#94a3b8] text-xs font-mono uppercase tracking-widest">{product.category}</p>
          </div>

          <div className="flex-1 mb-6 mt-2">
            <div className="space-y-3 mb-6">
              {featureList.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#22d3ee] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#cbd5e1] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0 mt-6">
              <div className="p-3 bg-[#111827] rounded-xl border border-[#1f2937] flex items-center gap-3"><Zap className="w-4 h-4 text-[#22d3ee]" /><span className="text-[10px] font-bold text-[#f8fafc] uppercase tracking-widest">Instan</span></div>
              <div className="p-3 bg-[#111827] rounded-xl border border-[#1f2937] flex items-center gap-3"><Shield className="w-4 h-4 text-[#22d3ee]" /><span className="text-[10px] font-bold text-[#f8fafc] uppercase tracking-widest">Garansi</span></div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-[#1f2937] shrink-0 w-full">
            <div className="flex items-end justify-between mb-5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-1">Total Harga</span>
                <span className="text-3xl font-black text-[#f8fafc] leading-none tracking-tight">Rp {product.price}</span>
              </div>
              <p className="text-[10px] font-mono text-[#2dd4bf] font-bold uppercase tracking-widest bg-[#2dd4bf]/10 border border-[#2dd4bf]/20 px-3 py-1.5 rounded-md">In Stock</p>
            </div>
            <button onClick={handleOrder} className="w-full h-12 bg-gradient-to-br from-[#0891b2] to-[#22d3ee] hover:from-[#0e7490] hover:to-[#06b6d4] text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_15px_rgba(34,211,238,0.3)] hover:shadow-[0_6px_20px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2 text-sm"><ShoppingCart className="w-4 h-4" /> BELI SEKARANG</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(ProductDetailModal);
