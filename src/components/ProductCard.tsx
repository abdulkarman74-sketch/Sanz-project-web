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

  const title = product?.name || "Produk";
  const description = product?.description || (product?.benefits && product?.benefits[0]) || "Produk digital premium siap order.";
  const image = product?.image || "";
  const price = product?.price || "0";
  const category = product?.category || "PRODUK";
  const rating = product?.rating || "5.0";

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="new-product-card"
    >
      <div 
        className="new-product-image-box cursor-pointer"
        onClick={() => onDetail?.(product)}
      >
        <img
          src={imageError ? 'https://files.catbox.moe/p88k63.jpg' : image}
          alt={title}
          className={`new-product-image transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
        />
        {!imageLoaded && !imageError && (
          <div className="new-product-image-placeholder">
            <span>✦</span>
          </div>
        )}

        <div className="new-product-image-badge">
          {category}
        </div>
      </div>

      <div className="new-product-content">
        <div className="new-product-meta">
          <span className="new-product-category">
            ✦ {category}
          </span>

          <span className="new-product-rating">
            ⭐ {rating}
          </span>
        </div>

        <h3 
          className="new-product-title cursor-pointer hover:text-theme-accent transition-colors"
          onClick={() => onDetail?.(product)}
        >
          {title}
        </h3>

        <p className="new-product-description">
          {description}
        </p>

        <div className="new-product-footer">
          <div className="new-product-price-wrap">
            <span className="new-product-price-label">
              TOTAL HARGA
            </span>
            <strong className="new-product-price">
              <span className="text-[10px] mr-1">Rp</span>
              {price}
            </strong>
          </div>

          <button
            type="button"
            className="new-product-buy-button active:scale-95 transition-transform"
            onClick={() => onDetail?.(product)}
          >
            Beli
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
