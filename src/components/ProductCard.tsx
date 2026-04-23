import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Shield, Zap, DollarSign, Users, Heart } from 'lucide-react';
import { Product, WHATSAPP_NUMBER } from '../constants';

interface ProductCardProps {
  product: Product;
  onDetail?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDetail }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-zinc-900/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-500"
    >
      <div 
        className="relative aspect-[4/3] overflow-hidden cursor-pointer"
        onClick={() => onDetail?.(product)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent opacity-60" />
        
        {product.badge && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-bold tracking-wider uppercase shadow-lg shadow-emerald-500/20">
            {product.badge}
          </div>
        )}
        
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-rose-500 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-yellow-500">
            <Zap className="w-3 h-3 fill-current" />
            <span className="text-xs font-bold">{product.rating}</span>
          </div>
          <span className="text-zinc-600 text-xs">•</span>
          <div className="flex items-center gap-1 text-zinc-500">
            <Users className="w-3 h-3" />
            <span className="text-xs">{product.stock} Stok</span>
          </div>
        </div>

        <h3 
          className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1 cursor-pointer"
          onClick={() => onDetail?.(product)}
        >
          {product.name}
        </h3>

        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Rp</span>
          <span className="text-2xl font-black text-white">{product.price}</span>
          {product.duration && (
            <span className="text-zinc-500 text-xs font-medium">/{product.duration}</span>
          )}
        </div>

        <div className="space-y-2 mb-6">
          {product.benefits.slice(0, 3).map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-zinc-500 text-xs">
              <Shield className="w-3 h-3 text-emerald-500/50" />
              <span className="line-clamp-1">{benefit}</span>
            </div>
          ))}
        </div>

        <a 
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo, saya ingin membeli ${product.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-zinc-800 hover:bg-emerald-500 text-white hover:text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 group/btn"
        >
          <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          Beli Sekarang
        </a>
      </div>
    </motion.div>
  );
};

export default ProductCard;
