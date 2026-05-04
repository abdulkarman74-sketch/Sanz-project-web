/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Smartphone, Check } from 'lucide-react';
import { Product, SiteSettings, WHATSAPP_NUMBER } from '../../constants';

interface ScriptBotProps {
  product?: Product;
  settings?: SiteSettings;
}

const ScriptBotView: React.FC<ScriptBotProps> = ({ product, settings }) => {
  const data = product || {
    name: "Cyrene MD v10.5.0",
    price: "150.000",
    description: "Script WhatsApp Bot Premium paling stabil dengan fitur terlengkap.",
    benefits: ["Full Fitur", "Update Selamanya", "Admin Group Control", "Support Owner"]
  };

  const handleBuy = () => {
    const name = settings?.branding?.siteName || "Admin";
    const phone = settings?.contact?.whatsapp || settings?.branding?.whatsapp || WHATSAPP_NUMBER;
    
    let defaultMsg = settings?.contact?.botMessage || settings?.contact?.orderMessage || `Halo ${name}, saya ingin membeli script bot: {product_name}`;
    
    const message = defaultMsg
       .replace(/{product_name}/g, data.name)
       .replace(/{product_price}/g, data.price.toString());
       
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col pt-16 md:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">Premium Release</span>
                <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 tracking-tighter leading-none mb-6 uppercase">{data.name}</h2>
                <p className="text-[var(--theme-text-soft)] text-lg md:text-xl leading-relaxed max-w-xl">{data.description}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button onClick={handleBuy} className="h-16 px-10 bg-[var(--theme-bg-main)] hover:bg-black text-[var(--theme-text-main)] font-bold uppercase tracking-widest rounded-2xl transition-all flex items-center gap-3 shadow-lg shadow-slate-900/10">
                  <ShoppingCart className="w-5 h-5" /> Pesan Sekarang
                </button>
                <div className="h-16 px-8 flex items-center gap-2 text-slate-800 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <span className="text-[var(--theme-text-soft)] font-mono text-sm">IDR</span> <span className="text-2xl font-black">{data.price}</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50">
                <div className="h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100"><Smartphone className="w-8 h-8 text-blue-600" /></div>
                    <div className="text-right text-[10px] font-mono text-[var(--theme-text-soft)] uppercase tracking-widest"><p>Version 10.5.0</p><p className="text-blue-500 font-bold mt-1">Latest Build</p></div>
                  </div>
                  <div className="space-y-4">
                    {data.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-6 h-6 bg-slate-50 border border-slate-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-bold"><Check className="w-4 h-4" /></div>
                        <span className="text-lg font-bold text-slate-700 uppercase tracking-tight">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ScriptBotView);
