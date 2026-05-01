import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronRight,
  Package,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import {
  Category,
  Product,
  SiteSettings,
  WHATSAPP_NUMBER,
} from "../../constants";

interface CategoryPopupProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  siteSettings: SiteSettings;
}

export default function CategoryPopup({
  category,
  isOpen,
  onClose,
  siteSettings,
}: CategoryPopupProps) {
  if (!isOpen || !category) return null;

  const handleOrder = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const name = siteSettings?.branding?.siteName || "Admin";
    const phone = siteSettings?.contact?.whatsapp || WHATSAPP_NUMBER;

    let defaultMsg =
      siteSettings?.contact?.orderMessage ||
      `Halo ${name}, saya ingin memesan:\n\n*Produk:* {product_name}\n*Harga:* Rp{product_price}\n\nMohon info selanjutnya.`;

    const catLower = product.category.toLowerCase();
    if (catLower.includes("panel") && siteSettings?.contact?.panelMessage) {
      defaultMsg = siteSettings.contact.panelMessage;
    } else if (catLower.includes("bot") && siteSettings?.contact?.botMessage) {
      defaultMsg = siteSettings.contact.botMessage;
    }

    const message = defaultMsg
      .replace(/{product_name}/g, product.name)
      .replace(/{product_price}/g, product.price.toString());

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-[800px] max-h-[90vh] bg-theme-bg border border-theme-border rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="relative h-48 md:h-56 shrink-0 bg-theme-surface border-b border-theme-border">
            {category.image ? (
              <img
                src={category.image}
                alt={category.title || category.name}
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-theme-surface">
                <Package className="w-16 h-16 text-theme-muted opacity-30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-theme-bg/80 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block px-3 py-1 bg-theme-accent/20 border border-theme-accent/30 text-theme-accent text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full mb-2">
                {category.products?.length || 0} Produk
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-theme-text mb-1">
                {category.title || category.name}
              </h2>
              <p className="text-theme-muted text-xs md:text-sm line-clamp-1 max-w-[90%]">
                {category.description ||
                  "Pilih produk terbaik dari kategori ini."}
              </p>
            </div>
          </div>

          {/* Content Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-theme-bg">
            {/* Ketentuan & Garansi Box */}
            <div className="mb-6 p-4 rounded-[16px] bg-theme-accent/10 border border-theme-accent/20">
              <div className="flex items-center gap-2 mb-2 text-theme-accent font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Ketentuan & Garansi
              </div>
              <ul className="space-y-1.5 text-xs text-theme-text opacity-90 pl-6 list-disc">
                <li>Server stabil 24/7</li>
                <li>Anti mokad / full garansi</li>
                <li>Proses cepat setelah pembayaran</li>
                <li>Support selama masa aktif</li>
                <li>Pastikan data order benar sebelum checkout</li>
              </ul>
            </div>

            {/* Catatan Penting Box */}
            <div className="mb-8 p-4 rounded-[16px] bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Catatan Penting
              </div>
              <ul className="space-y-1.5 text-xs text-red-200/80 pl-6 list-disc">
                <li>Garansi tidak berlaku jika kesalahan dari pembeli.</li>
                <li>Pastikan memilih paket sesuai kebutuhan.</li>
                <li>Stok dan harga dapat berubah sewaktu-waktu.</li>
              </ul>
            </div>

            {/* Product List */}
            <h3 className="text-[15px] font-bold text-theme-text mb-4 uppercase tracking-wider">
              Pilih Paket
            </h3>
            <div className="space-y-3">
              {category.products && category.products.length > 0 ? (
                category.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 md:p-4 rounded-[16px] bg-theme-surface hover:bg-theme-card border border-theme-border hover:border-theme-accent/50 transition-all group cursor-pointer"
                    onClick={(e) => handleOrder(product, e)}
                  >
                    <div className="flex-1 flex gap-3 h-full items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-theme-accent/10 border border-theme-accent/20 flex flex-shrink-0 items-center justify-center">
                        <Package className="w-5 h-5 md:w-6 md:h-6 text-theme-accent" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-[13px] md:text-[14px] font-bold text-theme-text mb-0.5 group-hover:text-theme-accent transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                        <span className="text-[10px] md:text-xs text-theme-muted">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-theme-border border-dashed sm:border-none">
                      <div className="flex flex-col sm:items-end">
                        <span className="text-[13px] md:text-sm font-black text-theme-accent">
                          Rp {product.price}
                        </span>
                        {product.stock && (
                          <span className="text-[9px] md:text-[10px] text-theme-accent">
                            {product.stock}
                          </span>
                        )}
                      </div>
                      <button
                        className="px-3 py-1.5 md:px-4 md:py-2 bg-theme-accent text-theme-bg font-bold text-[10px] md:text-xs rounded-lg whitespace-nowrap hover:bg-white transition-colors"
                        onClick={(e) => handleOrder(product, e)}
                      >
                        Beli Sekarang
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-theme-muted text-sm border border-dashed border-theme-border rounded-xl">
                  Belum ada produk aktif di kategori ini.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
