/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingCart, Star, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { formatProductTypeDetails, getSmartStockLabel } from '../../utils/formatUtils';
import { Product, SiteSettings, WHATSAPP_NUMBER } from '../../constants';

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

const ProductDetailModal = ({ 
  product, 
  allProducts, 
  onClose,
  settings
}: { 
  product: Product; 
  allProducts?: Product[]; 
  onClose: () => void;
  settings?: SiteSettings;
}) => {
  const [selectedVariant, setSelectedVariant] = React.useState<Product>(product);

  React.useEffect(() => {
    setSelectedVariant(product);
  }, [product]);

  if (!product) return null;

  const currentProduct = selectedVariant;
  const variants = allProducts ? allProducts.filter(p => p.category === product.category) : [];

  const handleOrder = () => {
    const name = settings?.branding?.siteName || "Admin";
    const phone = settings?.contact?.whatsapp || WHATSAPP_NUMBER;
    
    let defaultMsg = settings?.contact?.orderMessage || `Halo ${name}, saya ingin memesan:\n\n*Produk:* {product_name}\n*Harga:* Rp{product_price}\n\nMohon info selanjutnya.`;
    
    const catLower = currentProduct.category.toLowerCase();
    if (catLower.includes('panel') && settings?.contact?.panelMessage) {
       defaultMsg = settings.contact.panelMessage;
    } else if (catLower.includes('bot') && settings?.contact?.botMessage) {
       defaultMsg = settings.contact.botMessage;
    }

    const message = defaultMsg
       .replace(/{product_name}/g, currentProduct.name)
       .replace(/{product_price}/g, currentProduct.price.toString());

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const featureList = formatDescription(currentProduct.description || "Produk premium siap order.");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-theme-bg/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-xl bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2.5 bg-theme-bg/40 backdrop-blur-md hover:bg-theme-bg/60 rounded-full border border-white/10 transition-all text-[var(--theme-text-main)]"><X className="w-5 h-5" /></button>
        
        {/* Image 16:9 always on top */}
        <div className="w-full aspect-[16/9] relative bg-theme-bg shrink-0">
          <img src={currentProduct.image || undefined} alt={currentProduct.name} className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-theme-card via-transparent to-transparent opacity-80" />
          <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-theme-accent/10 border border-theme-accent/20 text-[10px] font-black uppercase tracking-widest rounded-lg text-theme-accent shadow-sm">Official Item</span></div>
        </div>

        {/* Scrollable Detail Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1 overflow-y-auto w-full no-scrollbar">
          <div className="mb-4">
            {currentProduct.rating ? (
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">{currentProduct.rating}/5 Rating</span>
              </div>
            ) : null}
            <h3 className="text-xl sm:text-2xl font-display font-black text-theme-text uppercase tracking-tight leading-snug mb-1 pr-4">{currentProduct.name}</h3>
            <p className="text-theme-muted text-xs font-mono uppercase tracking-widest">{currentProduct.category}</p>
          </div>

          <div className="flex-1 mb-6 mt-2">
            {variants.length > 1 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-theme-muted uppercase tracking-widest mb-3 flex items-center gap-2">Pilih Varian</h4>
                <div className="grid grid-cols-1 gap-2">
                  {variants.map(v => (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedVariant(v)} 
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${currentProduct.id === v.id ? 'bg-theme-border border-theme-accent/50 shadow-[0_0_20px_rgba(34,211,238,0.15)] ring-1 ring-theme-accent/20' : 'bg-theme-surface border-theme-border hover:border-[var(--theme-border)] hover:bg-theme-surface/80'}`}
                    >
                      <span className={`${currentProduct.id === v.id ? 'text-theme-accent font-bold' : 'text-theme-text font-medium'} text-sm text-left line-clamp-1`}>{v.name}</span>
                      <span className={`${currentProduct.id === v.id ? 'text-theme-accent-sec bg-theme-accent-sec/10 border-theme-accent-sec/20 px-2.5 py-1 rounded-md' : 'text-theme-muted'} text-xs font-bold border border-transparent transition-all shrink-0 ml-2`}>Rp {v.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(() => {
              const details = formatProductTypeDetails(currentProduct.typeDetails, currentProduct.type || 'panel');
              return details.length > 0 ? (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-theme-muted uppercase tracking-widest mb-3">Spesifikasi Detail</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {details.map((d, i) => (
                      <div key={i} className="flex flex-col p-3 bg-theme-surface/50 border border-theme-border rounded-xl">
                        <span className="text-[9px] text-theme-muted uppercase tracking-widest font-bold">{d.label}</span>
                        <span className="text-sm font-medium text-theme-text mt-1 truncate">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-theme-muted uppercase tracking-widest mb-1">Deskripsi Tambahan</h4>
              {featureList.map((item, i) => (
                <div key={i} className="flex gap-3 items-start p-3 bg-theme-surface/50 rounded-xl border border-theme-border/50">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-theme-accent shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0 mt-6">
              <div className="p-3 bg-theme-surface rounded-xl border border-theme-border flex items-center gap-3"><Zap className="w-4 h-4 text-theme-accent" /><span className="text-[10px] font-bold text-theme-text uppercase tracking-widest">Instan</span></div>
              <div className="p-3 bg-theme-surface rounded-xl border border-theme-border flex items-center gap-3"><Shield className="w-4 h-4 text-theme-accent" /><span className="text-[10px] font-bold text-theme-text uppercase tracking-widest">Garansi</span></div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-theme-border shrink-0 w-full">
            <div className="flex items-end justify-between mb-5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest mb-1">Total Harga</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-theme-text leading-none tracking-tight">Rp {currentProduct.promoPrice || currentProduct.price}</span>
                  {currentProduct.promoPrice && <span className="text-sm text-theme-muted line-through font-bold">Rp {currentProduct.price}</span>}
                </div>
              </div>
              {(() => {
                const badge = getSmartStockLabel(currentProduct.stock);
                if (!badge) return null;
                return <p className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-md border ${badge.color}`}>{badge.text}</p>;
              })()}
            </div>
            <button onClick={handleOrder} className="w-full h-12 bg-gradient-to-br from-[#0891b2] to-theme-accent hover:from-[#0e7490] hover:to-[#06b6d4] text-[var(--theme-text-main)] font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_15px_rgba(34,211,238,0.3)] hover:shadow-[0_6px_20px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2 text-sm"><ShoppingCart className="w-4 h-4" /> BELI SEKARANG</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(ProductDetailModal);
