import React from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Shield, Zap, Heart } from 'lucide-react';
import { Product, WHATSAPP_NUMBER } from '../constants';

interface ProductCardProps {
  product: Product;
  onDetail?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDetail }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-theme-card backdrop-blur-xl rounded-3xl overflow-hidden border border-theme-border hover:border-theme-accent/50 transition-all duration-500 shadow-lg"
    >
      <div 
        className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-theme-surface"
        onClick={() => onDetail?.(product)}
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-theme-surface to-theme-border" />
        )}
        <img 
          src={imageError ? 'https://files.catbox.moe/p88k63.jpg' : product.image} 
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-card/80 via-transparent to-transparent opacity-60" />
        
        {product.badge && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-theme-accent text-slate-950 text-[10px] font-black tracking-widest uppercase shadow-lg shadow-theme-accent/20 border border-white/10">
            {product.badge}
          </div>
        )}
        
        <button className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-[var(--theme-text-main)] hover:text-theme-accent transition-all group-hover:bg-theme-card/60">
          <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>
      </div>

      <div className="p-5 sm:p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-[11px] font-bold">{product.rating || '5.0'}</span>
          </div>
          <span className="text-theme-muted/30 text-[10px]">•</span>
          <div className="flex items-center gap-1 text-theme-muted">
            <Zap className="w-3.5 h-3.5 text-theme-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{product.stock || 'Ready'}</span>
          </div>
        </div>

        <h3 
          className="text-lg font-black text-theme-text mb-2 group-hover:text-theme-accent transition-colors line-clamp-1 cursor-pointer uppercase tracking-tight"
          onClick={() => onDetail?.(product)}
        >
          {product.name}
        </h3>

        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-[10px] font-black text-theme-accent uppercase tracking-widest">Rp</span>
          <span className="text-2xl font-black text-theme-text">{product.price}</span>
          {product.duration && (
            <span className="text-theme-muted text-[10px] font-bold uppercase tracking-widest ml-1">/{product.duration}</span>
          )}
        </div>

        <div className="space-y-2 mb-6 flex-1">
          {product.benefits.slice(0, 3).map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-theme-muted text-[11px] font-medium border-l border-theme-accent/20 pl-3">
              <span className="line-clamp-1">{benefit}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => onDetail?.(product)}
          className="w-full py-4 bg-theme-surface hover:bg-theme-accent text-theme-text hover:text-slate-900 font-bold uppercase tracking-widest text-[11px] rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] group/btn border border-theme-border shadow-inner"
        >
          <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          Lihat Detail
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
