/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  useState,
  useEffect,
  useRef,
  memo,
  lazy,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  Menu,
  X,
  MessageSquare,
  Volume2,
  VolumeX,
  Settings,
  Package,
  Video,
  ChevronRight,
  ShoppingCart,
  Star,
  ArrowLeft,
  CheckCircle2,
  LayoutGrid,
  MoreHorizontal,
  Zap,
  ShieldCheck,
  Clock,
  RefreshCcw,
  DollarSign,
  TrendingUp,
  HeadphonesIcon,
  CreditCard,
  Send,
  ShoppingBag,
  ThumbsUp,
  Home,
  Gamepad2,
  Shield,
  Phone,
  Server
} from "lucide-react";
import {
  CATEGORIES,
  WHATSAPP_NUMBER,
  Category,
  Product,
  VIDEO_DATA,
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_MENU_SEMUA
} from "./constants";

import { db, firebaseReady } from "./lib/firebase";
import { doc, setDoc, onSnapshot, deleteDoc, collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { removeUndefinedDeep } from "./utils/objectUtils";
import { Toaster, toast } from "react-hot-toast";

const GameView = lazy(() => import("./components/views/GameView"));
const VideoView = lazy(() => import("./components/views/VideoView"));
const ScriptBotView = lazy(() => import("./components/views/ScriptBotView"));
const AdminPanel = lazy(() => import("./admin/admin-panel"));
const HeroSection = lazy(() => import("./components/common/HeroSection"));
const LoadingScreen = lazy(() => import("./components/common/LoadingScreen"));
const VpsStatusShowcase = lazy(
  () => import("./components/common/VpsStatusShowcase"),
);
const TimeDateCard = lazy(() => import("./components/common/TimeDateCard"));
const GlobalChatDrawer = lazy(() => import("./components/views/GlobalChatDrawer").then(module => ({ default: module.GlobalChatDrawer })));

function ShopStyleProductCard({ product, openShopProductDetail, openDurationSheet, designV2Settings = DEFAULT_DESIGN_V2 }: any) {
  const image =
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    product.foto ||
    "";

  const name =
    product.name ||
    product.title ||
    product.nama ||
    "Nama Produk";

  const desc =
    product.description ||
    product.desc ||
    product.deskripsi ||
    "";

  const price =
    product.price ||
    product.harga ||
    product.amount ||
    "Hubungi Admin";

  const category =
    product.categoryName ||
    product.category ||
    product.categoryId ||
    "Produk";

  const formattedPrice =
    typeof price === "number"
      ? `Rp${price.toLocaleString("id-ID")}`
      : String(price).toLowerCase().startsWith("rp")
        ? price
        : /^\d+$/.test(String(price))
          ? `Rp${Number(price).toLocaleString("id-ID")}`
          : price;

  return (
    <article 
      className="shop-style-card"
      onClick={() => openShopProductDetail(product)}
    >
      <div 
        className="shop-style-image-wrap"
        style={{
          aspectRatio: designV2Settings.productImageRatio || "1/1"
        }}
      >
        {image ? (
          <img src={image} alt={name} className="shop-style-image" loading="lazy" />
        ) : (
          <div className="shop-style-placeholder">✦</div>
        )}

        <span className="shop-style-badge">{category}</span>
      </div>

      <div className="shop-style-card-body">
        <h3>{name}</h3>

        {desc ? (
          <p>{desc}</p>
        ) : null}

        <strong>{formattedPrice}</strong>

        <div className="shop-style-actions">
          <button
            type="button"
            className="shop-style-detail-btn"
            onClick={(e) => {
              e.stopPropagation();
              openShopProductDetail(product);
            }}
          >
            Detail
          </button>

          <button
            type="button"
            className="shop-style-buy-btn"
            onClick={(e) => {
              e.stopPropagation();
              openDurationSheet(product, "buy");
            }}
          >
            Beli
          </button>
        </div>
      </div>
    </article>
  );
}



const DEFAULT_DESIGN_V2 = {
  brandName: "Yonz Market",
  brandSubtitle: "Premium Digital Store",
  searchPlaceholder: "Cari produk digital...",
  bannerEnabled: true,
  bannerVideoUrl: "https://d.uguu.se/uTldvYoT.mp4",
  bannerLabel: "Premium Digital Store",
  bannerTitle: "Yonz Market",
  bannerDescription: "Produk digital pilihan, cepat, aman, dan praktis.",
  showCartIcon: true,
  showChatIcon: true,
  showBottomNav: true,
  accentColor: "#06b6d4",
  accentColor2: "#0ea5e9",
  pageBackground: "#f8fafc",
  cardBackground: "#ffffff",
  mainTextColor: "#0f172a",
  mutedTextColor: "#64748b",
  priceColor: "#0891b2",
  categoryAllLabel: "Semua",
  productColumnsMobile: 2,
  productImageRatio: "1/1",
  productCardRadius: 12,
  emptyTitle: "Produk belum tersedia",
  emptyDescription: "Coba pilih kategori lain atau hapus pencarian.",
  navHomeLabel: "Beranda",
  navProductLabel: "Produk",
  navRatingLabel: "Rating",
  navChatLabel: "Chat",
  navProfileLabel: "Saya"
};

function ShopStyleLayout({
  products = [],
  categories = [],
  activeCategory,
  setActiveCategory,
  handleBuyProduct,
  openProductDetail,
  onHome,
  onChatAi,
  onAdmin,
  onRating,
  designV2Settings = DEFAULT_DESIGN_V2,
  siteSettings
}: any) {
  const [shopSearch, setShopSearch] = useState("");
  
  const [selectedShopProduct, setSelectedShopProduct] = useState<any>(null);
  const [isShopProductDetailOpen, setIsShopProductDetailOpen] = useState(false);
  const [isDurationSheetOpen, setIsDurationSheetOpen] = useState(false);
  const [selectedDurationOption, setSelectedDurationOption] = useState<any>(null);
  const [durationOrderMode, setDurationOrderMode] = useState("buy");

  function openShopProductDetail(product: any) {
    setSelectedShopProduct(product);
    setSelectedDurationOption(null);
    setIsShopProductDetailOpen(true);
  }

  function closeShopProductDetail() {
    setSelectedShopProduct(null);
    setSelectedDurationOption(null);
    setIsDurationSheetOpen(false);
    setIsShopProductDetailOpen(false);
  }

  function openDurationSheet(product: any, mode = "buy") {
    setSelectedShopProduct(product);
    setDurationOrderMode(mode);
    setSelectedDurationOption(null);
    setIsDurationSheetOpen(true);
  }

  function submitDurationOrder(product: any, duration: any, mode = "buy") {
    if (!product || !duration) {
      alert("Pilih durasi terlebih dahulu.");
      return;
    }

    const productName = getProductName(product);
    const price = formatShopPrice(duration.price);
    const durationLabel = duration.label;

    const message = [
      "Halo Admin, saya ingin order produk berikut:",
      "",
      `Produk: ${productName}`,
      `Durasi: ${durationLabel}`,
      `Harga: ${price}`,
      `Metode: ${mode === "admin" ? "Order Via Admin" : mode === "chat" ? "Chat Sekarang" : "Beli Sekarang"}`,
      "",
      "Mohon instruksi selanjutnya."
    ].join("\n");

    const phoneNumber =
      siteSettings?.contact?.whatsapp ||
      siteSettings?.whatsappNumber ||
      siteSettings?.ownerNumber ||
      WHATSAPP_NUMBER ||
      "";

    const cleanPhone = String(phoneNumber).replace(/\D/g, "");

    if (!cleanPhone) {
      alert("Nomor WhatsApp admin belum diatur.");
      return;
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    window.open(waUrl, "_blank");
  }

  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  const visibleProducts = safeProducts.filter((product: any) => {
    const productName =
      product.name ||
      product.title ||
      product.nama ||
      "";

    const productDesc =
      product.description ||
      product.desc ||
      product.deskripsi ||
      "";

    const productCategory =
      product.category ||
      product.categoryId ||
      product.categoryName ||
      product.type ||
      "";

    const matchActive = product.isActive !== false;

    const matchCategory =
      !activeCategory ||
      activeCategory === "all" ||
      activeCategory === "semua" ||
      activeCategory === "Semua" ||
      String(productCategory).toLowerCase() === String(activeCategory).toLowerCase();

    const matchSearch =
      `${productName} ${productDesc}`.toLowerCase().includes(shopSearch.toLowerCase());

    return matchActive && matchCategory && matchSearch;
  });

  return (
    <main 
      className="shop-style-page"
      style={{
        "--v2-accent": designV2Settings.accentColor,
        "--v2-accent-2": designV2Settings.accentColor2,
        "--v2-bg": designV2Settings.pageBackground,
        "--v2-card": designV2Settings.cardBackground,
        "--v2-text": designV2Settings.mainTextColor,
        "--v2-muted": designV2Settings.mutedTextColor,
        "--v2-price": designV2Settings.priceColor,
        "--v2-card-radius": `${Number(designV2Settings.productCardRadius || 12)}px`,
        "--v2-product-columns": Number(designV2Settings.productColumnsMobile || 2)
      } as React.CSSProperties}
    >
      <header className="shop-style-header">
        <div className="shop-style-search">
          <span>🔎</span>
          <input
            value={shopSearch}
            onChange={(e) => setShopSearch(e.target.value)}
            placeholder={designV2Settings.searchPlaceholder || "Cari produk digital..."}
          />
          <span>📷</span>
        </div>

        {designV2Settings.showCartIcon && (
          <button type="button" className="shop-style-icon-btn" onClick={() => window.alert('Keranjang belum aktif')}>
            🛒
          </button>
        )}

        {designV2Settings.showChatIcon && (
          <button type="button" className="shop-style-icon-btn" onClick={onChatAi}>
            💬
          </button>
        )}
      </header>

      {designV2Settings.bannerEnabled && (
        <section className="shop-live-banner">
          {designV2Settings.bannerVideoUrl ? (
            <video
              className="shop-live-video"
              src={designV2Settings.bannerVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : null}

          <div className="shop-live-overlay"></div>

          <div className="shop-live-content">
            <span>{designV2Settings.bannerLabel}</span>
            <h2>{designV2Settings.bannerTitle}</h2>
            <p>{designV2Settings.bannerDescription}</p>
          </div>
        </section>
      )}

      <section className="shop-style-categories">
        <button
          type="button"
          className={`shop-style-category ${
            !activeCategory || activeCategory === "all" || activeCategory === "semua" || activeCategory === "Semua"
              ? "active"
              : ""
          }`}
          onClick={() => setActiveCategory("Semua")}
        >
          {designV2Settings.categoryAllLabel || "Semua"}
        </button>

        {safeCategories.map((cat: any) => {
          const catValue = cat.slug || cat.id || cat.name || cat.label;
          const catLabel = cat.name || cat.label || cat.slug || "Kategori";

          return (
            <button
              key={cat.id || catValue}
              type="button"
              className={`shop-style-category ${
                String(activeCategory) === String(catValue) ? "active" : ""
              }`}
              onClick={() => setActiveCategory(catValue)}
            >
              {catLabel}
            </button>
          );
        })}
      </section>

      <section className="shop-style-products">
        {visibleProducts.length === 0 ? (
          <div className="shop-style-empty">
            <div>📦</div>
            <h3>{designV2Settings.emptyTitle}</h3>
            <p>{designV2Settings.emptyDescription}</p>
          </div>
        ) : (
          visibleProducts.map((product: any) => (
            <ShopStyleProductCard
              key={product.id}
              product={product}
              openShopProductDetail={openShopProductDetail}
              openDurationSheet={openDurationSheet}
              designV2Settings={designV2Settings}
            />
          ))
        )}
      </section>

      {designV2Settings.showBottomNav && (
        <nav className="shop-bottom-nav">
          <button type="button" className="active" onClick={() => { onHome(); window.scrollTo(0, 0); }}>
            <span>⌂</span>
            <small>{designV2Settings.navHomeLabel || "Beranda"}</small>
          </button>

          <button type="button" onClick={() => setActiveCategory("Semua")}>
            <span>▣</span>
            <small>{designV2Settings.navProductLabel || "Produk"}</small>
          </button>

          <button type="button" onClick={onRating}>
            <span>★</span>
            <small>{designV2Settings.navRatingLabel || "Rating"}</small>
          </button>

          <button type="button" onClick={onChatAi}>
            <span>💬</span>
            <small>{designV2Settings.navChatLabel || "Chat"}</small>
          </button>

          <button type="button" onClick={onAdmin}>
            <span>☻</span>
            <small>{designV2Settings.navProfileLabel || "Saya"}</small>
          </button>
        </nav>
      )}

      {isShopProductDetailOpen && selectedShopProduct && (
        <div className="shop-product-detail-page">
          <div className="shop-detail-top-actions">
            <button type="button" onClick={closeShopProductDetail}>←</button>

            <div>
              <button type="button">↗</button>
              <button type="button" onClick={() => window.alert('Keranjang belum aktif')}>🛒</button>
              <button type="button">⋮</button>
            </div>
          </div>

          <section className="shop-detail-image-section">
            {getProductImage(selectedShopProduct) ? (
              <img
                src={getProductImage(selectedShopProduct)}
                alt={getProductName(selectedShopProduct)}
                className="shop-detail-main-image"
              />
            ) : (
              <div className="shop-detail-image-placeholder">✦</div>
            )}

            <span className="shop-detail-image-count">1/1</span>
          </section>

          <section className="shop-detail-info">
            <div className="shop-detail-price-row">
              <strong>
                {formatShopPrice(
                  selectedDurationOption?.price || getProductPrice(selectedShopProduct)
                )}
              </strong>

              <span>{selectedShopProduct.sold || "24"} Terjual ♡</span>
            </div>

            <h1>{getProductName(selectedShopProduct)}</h1>

            <p className="shop-detail-description">
              {getProductDescription(selectedShopProduct)}
            </p>

            <div className="shop-detail-tags">
              <span>Garansi Harga Terbaik</span>
              <span>Cepat Diproses</span>
              <span>Support Admin</span>
            </div>
          </section>

          <section className="shop-detail-row">
            <span>🚚</span>
            <div>
              <strong>Proses cepat setelah pembayaran</strong>
              <p>Admin akan memberi instruksi selanjutnya via WhatsApp.</p>
            </div>
            <b>›</b>
          </section>

          <section className="shop-detail-row">
            <span>🛡️</span>
            <div>
              <strong>Transaksi aman</strong>
              <p>Detail order akan dikirim langsung ke admin.</p>
            </div>
            <b>›</b>
          </section>

          <section
            className="shop-detail-variation-row"
            onClick={() => openDurationSheet(selectedShopProduct, "buy")}
          >
            <strong>Pilih Durasi</strong>
            <span>{selectedDurationOption?.label || "Pilih durasi produk"} ›</span>
          </section>

          <section className="shop-detail-rating">
            <div>
              <strong>5 ⭐ Penilaian Produk</strong>
              <span>Lihat Semua ›</span>
            </div>
            <p>Produk sesuai deskripsi, proses cepat, dan admin responsif.</p>
          </section>

          <div className="shop-detail-bottom-bar">
            <button
              type="button"
              className="shop-detail-chat-btn"
              onClick={() => openDurationSheet(selectedShopProduct, "chat")}
            >
              💬
              <small>Chat Sekarang</small>
            </button>

            <button
              type="button"
              className="shop-detail-admin-btn"
              onClick={() => openDurationSheet(selectedShopProduct, "admin")}
            >
              🛒
              <small>Order Via Admin</small>
            </button>

            <button
              type="button"
              className="shop-detail-buy-now-btn"
              onClick={() => openDurationSheet(selectedShopProduct, "buy")}
            >
              Beli Sekarang
              <strong>
                {formatShopPrice(
                  selectedDurationOption?.price || getProductPrice(selectedShopProduct)
                )}
              </strong>
            </button>
          </div>
        </div>
      )}

      {isDurationSheetOpen && selectedShopProduct && (
        <div className="shop-duration-overlay" onClick={() => setIsDurationSheetOpen(false)}>
          <div className="shop-duration-sheet" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="shop-duration-close"
              onClick={() => setIsDurationSheetOpen(false)}
            >
              ×
            </button>

            <div className="shop-duration-product-head">
              <div className="shop-duration-thumb">
                {getProductImage(selectedShopProduct) ? (
                  <img src={getProductImage(selectedShopProduct)} alt={getProductName(selectedShopProduct)} />
                ) : (
                  <span>✦</span>
                )}
              </div>

              <div>
                <strong>
                  {formatShopPrice(
                    selectedDurationOption?.price || getProductPrice(selectedShopProduct)
                  )}
                </strong>
                <p>{getProductName(selectedShopProduct)}</p>
              </div>
            </div>

            <div className="shop-duration-section">
              <div className="shop-duration-section-title">
                Durasi
              </div>

              <div className="shop-duration-options">
                {getProductDurations(selectedShopProduct).map((item: any, index: number) => (
                  <button
                    key={index}
                    type="button"
                    className={`shop-duration-option ${
                      selectedDurationOption?.label === item.label ? "active" : ""
                    }`}
                    onClick={() => setSelectedDurationOption(item)}
                  >
                    <span>{item.label}</span>
                    <small>{formatShopPrice(item.price)}</small>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="shop-duration-submit"
              disabled={!selectedDurationOption}
              onClick={() => submitDurationOrder(selectedShopProduct, selectedDurationOption, durationOrderMode)}
            >
              {selectedDurationOption
                ? `Lanjutkan Order ${formatShopPrice(selectedDurationOption.price)}`
                : "Pilih Durasi Dulu"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const ViewFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

// Helpers untuk Data Produk Aman
function getProductImage(product: any) {
  return product?.image || product?.imageUrl || product?.thumbnail || product?.foto || "";
}

function getProductName(product: any) {
  return product?.name || product?.title || product?.nama || product?.productName || "Produk";
}

function getProductDescription(product: any) {
  return product?.description || (product?.benefits && product?.benefits[0]) || product?.desc || product?.deskripsi || "Belum ada deskripsi produk.";
}

function getProductPrice(product: any) {
  return product?.price || product?.harga || product?.amount || product?.productPrice || "";
}

function getProductCategory(product: any) {
  return (
    product?.categoryName ||
    product?.categoryLabel ||
    product?.category ||
    product?.categoryId ||
    product?.type ||
    "Produk"
  );
}

function formatShopPrice(price: any) {
  if (price === null || price === undefined || price === "") return "Hubungi Admin";

  if (typeof price === "number") {
    return `Rp${price.toLocaleString("id-ID")}`;
  }

  const text = String(price).trim();

  if (text.toLowerCase().startsWith("rp")) return text;

  if (/^\d+$/.test(text)) {
    return `Rp${Number(text).toLocaleString("id-ID")}`;
  }

  return text;
}

function getProductDurations(product: any) {
  if (Array.isArray(product?.durations) && product.durations.length > 0) {
    return product.durations;
  }

  if (Array.isArray(product?.variants) && product.variants.length > 0) {
    return product.variants.map((item: any) => ({
      label: item.label || item.name || item.duration || "Durasi",
      price: item.price || item.harga || product.price || product.harga || ""
    }));
  }

  return [
    {
      label: product?.duration || "Default",
      price: product?.price || product?.harga || "Hubungi Admin"
    }
  ];
}

function formatProductPrice(price: any) {
  if (price === null || price === undefined || price === "") {
    return "Hubungi Admin";
  }

  if (typeof price === "number") {
    return `Rp${price.toLocaleString("id-ID")}`;
  }

  const text = String(price).trim();

  if (!text) return "Hubungi Admin";

  if (text.toLowerCase().startsWith("rp")) return text;

  if (/^\d+$/.test(text)) {
    return `Rp${Number(text).toLocaleString("id-ID")}`;
  }

  return text;
}

function applyOrderTemplate(template: string, product: any) {
  const productName = getProductName(product);
  const category = getProductCategory(product);
  const price = formatProductPrice(getProductPrice(product));

  const lowerName = String(productName).toLowerCase();
  const lowerCategory = String(category).toLowerCase();

  const productLabel =
    lowerCategory && lowerName.includes(lowerCategory)
      ? productName
      : `${category} ${productName}`.trim();

  return String(template || "")
    .replaceAll("{productName}", productName)
    .replaceAll("{product_name}", productName)
    .replaceAll("{category}", category)
    .replaceAll("{productCategory}", category)
    .replaceAll("{product_category}", category)
    .replaceAll("{price}", price)
    .replaceAll("{productPrice}", price)
    .replaceAll("{product_price}", price)
    .replaceAll("{productLabel}", productLabel)
    .replaceAll("{product_label}", productLabel);
}

function createDirectProductOrderMessage(product: any) {
  const productName = getProductName(product);
  const category = getProductCategory(product);
  const price = formatProductPrice(getProductPrice(product));

  const lowerName = String(productName).toLowerCase();
  const lowerCategory = String(category).toLowerCase();

  const productLabel =
    lowerCategory && lowerName.includes(lowerCategory)
      ? productName
      : `${category} ${productName}`.trim();

  return [
    "Halo Admin, saya ingin membeli produk berikut:",
    "",
    `Produk: ${productLabel}`,
    `Harga: ${price}`,
    "",
    "Mohon instruksi selanjutnya."
  ].join("\n");
}

const ProductCard = memo(
  ({
    product,
    onDetail,
    onBuy,
  }: {
    product: any;
    onDetail?: (p: any) => void;
    onBuy?: (p: any) => void;
  }) => {
    return (
      <article className="pretty-product-card">
        <div className="pretty-product-image-wrap">
          {getProductImage(product) ? (
            <img
              src={getProductImage(product)}
              alt={getProductName(product)}
              className="pretty-product-image"
              loading="lazy"
            />
          ) : (
            <div className="pretty-product-placeholder">
              <span>✦</span>
            </div>
          )}

          <span className="pretty-product-image-badge">
            {getProductCategory(product)}
          </span>
        </div>

        <div className="pretty-product-body">
          <div className="pretty-product-meta-row">
            <span className="pretty-product-category">
              ✦ {getProductCategory(product)}
            </span>

            <span className="pretty-product-rating">
              ⭐ {product?.rating || "5.0"}
            </span>
          </div>

          <h3 className="pretty-product-title">
            {getProductName(product)}
          </h3>

          <p className="pretty-product-desc">
            {getProductDescription(product)}
          </p>

          <div className="pretty-product-footer">
            <div className="pretty-product-price-box">
              <span className="pretty-product-price-label">
                TOTAL HARGA
              </span>

              <strong className="pretty-product-price">
                <span className="text-[10px] mr-1">Rp</span>
                {getProductPrice(product)}
              </strong>
            </div>

            <div className="pretty-product-actions">
              <button
                type="button"
                className="pretty-product-detail-button"
                onClick={() => onDetail?.(product)}
              >
                Detail
              </button>

              <button
                type="button"
                className="pretty-product-buy-button"
                onClick={() => onBuy?.(product)}
              >
                Beli
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  },
);

import CategoryPopup from "./components/views/CategoryPopup";

// Components removed to clear unused code

import MainMenuDrawer from "./components/views/MainMenuDrawer";
import LoginModal from "./components/views/LoginModal";
import { useStoreData } from "./hooks/useStoreData";

export default function App() {
  // --- Core State ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem("adminSession");
      if (saved) {
        const session = JSON.parse(saved);
        if (session?.loggedIn === true && session?.username) {
          return true;
        }
      }
    } catch (e) {}
    // Fallback for legacy login checking (optional)
    return localStorage.getItem("isAdminLoggedIn") === "true";
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [designV2Settings, setDesignV2Settings] = useState(DEFAULT_DESIGN_V2);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "designV2"), (snap) => {
      if (snap.exists()) {
        setDesignV2Settings({
          ...DEFAULT_DESIGN_V2,
          ...snap.data()
        });
      } else {
        setDesignV2Settings(DEFAULT_DESIGN_V2);
      }
    });
    return () => unsub();
  }, []);

  const [selectedProductDetail, setSelectedProductDetail] = useState<any>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);

  function openProductDetail(product: any) {
    setSelectedProductDetail(product);
    setIsProductDetailOpen(true);
  }

  function closeProductDetail() {
    setIsProductDetailOpen(false);
    setSelectedProductDetail(null);
  }

  // --- Rating State ---
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [ratingName, setRatingName] = useState("");
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const [ratingSuccess, setRatingSuccess] = useState("");
  const [ratings, setRatings] = useState<any[]>([]);

  function openRatingMenu() {
    setIsRatingOpen(true);
  }

  function closeRatingMenu() {
    setIsRatingOpen(false);
    setRatingError("");
    setRatingSuccess("");
  }

  useEffect(() => {
    try {
      const q = query(
        collection(db, "ratings"),
        orderBy("clientCreatedAt", "desc"),
        limit(30)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        setRatings(data);
      }, (error) => {
        console.error("Error loading ratings with index:", error);
        // Fallback without orderBy if index is missing
        const fallbackUnsub = onSnapshot(collection(db, "ratings"), (snapshot) => {
          const data = snapshot.docs
            .map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data()
            }))
            .sort((a: any, b: any) => Number(b.clientCreatedAt || 0) - Number(a.clientCreatedAt || 0))
            .slice(0, 30);
          setRatings(data);
        });
        return () => fallbackUnsub();
      });

      return () => unsub();
    } catch (e) {
      console.error("Ratings hook error", e);
    }
  }, []);

  async function submitRating() {
    const name = ratingName.trim();
    const comment = ratingComment.trim();

    setRatingError("");
    setRatingSuccess("");

    if (!name) {
      setRatingError("Nama wajib diisi.");
      return;
    }

    if (name.length < 2) {
      setRatingError("Nama minimal 2 karakter.");
      return;
    }

    if (name.length > 25) {
      setRatingError("Nama maksimal 25 karakter.");
      return;
    }

    if (!ratingStars || ratingStars < 1 || ratingStars > 5) {
      setRatingError("Pilih rating bintang 1 sampai 5.");
      return;
    }

    if (!comment) {
      setRatingError("Komentar wajib diisi.");
      return;
    }

    if (comment.length < 5) {
      setRatingError("Komentar minimal 5 karakter.");
      return;
    }

    if (comment.length > 300) {
      setRatingError("Komentar maksimal 300 karakter.");
      return;
    }

    try {
      setRatingLoading(true);

      await addDoc(collection(db, "ratings"), {
        name,
        stars: Number(ratingStars),
        comment,
        createdAt: serverTimestamp(),
        clientCreatedAt: Date.now()
      });

      setRatingName("");
      setRatingStars(5);
      setRatingComment("");
      setRatingSuccess("Terima kasih, rating kamu berhasil dikirim.");
    } catch (error) {
      console.error("SUBMIT RATING ERROR:", error);
      setRatingError("Gagal mengirim rating. Coba lagi.");
    } finally {
      setRatingLoading(false);
    }
  }

  const normalizeCategory = (val: string) => {
    return String(val || "").toLowerCase().trim().replace(/&/g, "and").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  };

  const CATEGORY_ALIASES: Record<string, string[]> = {
    "sewa-bot": ["sewa-bot", "sewabot", "sewa bot", "bot", "sewa"],
    "app-premium": ["app-premium", "app premium", "apk-premium", "apk premium", "aplikasi-premium"],
    "source-code": ["source-code", "source code", "script", "script-bot", "script bot"],
    "panel": ["panel"],
    "reseller": ["reseller"]
  };

  const categoryMatches = (productValue: string, activeValue: string) => {
    const active = normalizeCategory(activeValue);
    const product = normalizeCategory(productValue);
    const aliases = CATEGORY_ALIASES[active] || [active];
    return aliases.map(normalizeCategory).includes(product);
  };

  const isLandingPage = normalizeCategory(selectedCategory) === "semua" || normalizeCategory(selectedCategory) === "all" || selectedCategory === "" || selectedCategory === "Semua";

  function slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  }

  const {
    loading: storeLoading,
    siteSettings,
    categories: rawCategories,
    products: storeProducts,
    slides,
  } = useStoreData();

  const menuSemuaText = {
    ...DEFAULT_MENU_SEMUA,
    ...siteSettings?.menuSemua,
  };

  const localCategories = useMemo(() => {
    let baseCategories: any[] = [];
    if (rawCategories && rawCategories.length > 0) {
      baseCategories = rawCategories.filter((cat) => cat.active !== false);
    } else {
      baseCategories = CATEGORIES;
    }
    return baseCategories.map((cat) => {
      const dbProducts = storeProducts.filter(
        (p) =>
          p.categoryId === cat.id ||
          p.categoryId === cat.slug ||
          p.category === cat.title ||
          p.category === cat.name ||
          p.category === cat.label ||
          p.category === cat.id ||
          (p.category &&
            cat.id && p.category.toLowerCase().includes(cat.id.toLowerCase())),
      );
      return {
        ...cat,
        products: dbProducts,
      };
    });
  }, [rawCategories, storeProducts]);

  const [loading, setLoading] = useState(true);
  const [selectedPopupCategory, setSelectedPopupCategory] =
    useState<Category | null>(null);

  useEffect(() => {
    console.log("Firestore categories:", rawCategories);
    console.log("Visible categories:", localCategories);
    console.log("Active category:", selectedCategory);
    
    if (!isLandingPage) {
      const normalizedActive = normalizeCategory(selectedCategory);
      const exists = localCategories.some((cat) => 
        normalizeCategory(cat.id) === normalizedActive || 
        normalizeCategory((cat as any).slug) === normalizedActive || 
        normalizeCategory(cat.name) === normalizedActive || 
        normalizeCategory(cat.title) === normalizedActive
      );
      if (!exists) {
        setSelectedCategory("Semua");
      }
    }
  }, [rawCategories, localCategories, selectedCategory, isLandingPage]);

  const handleDirectOrder = useCallback(
    (product: any) => {
      if (!product) {
        alert("Data produk tidak ditemukan. Coba pilih produk lagi.");
        console.error("ORDER ERROR: product kosong");
        return;
      }

      console.log("ORDER PRODUCT DATA:", product);

      const phoneNumber = 
        siteSettings?.contact?.whatsapp || 
        WHATSAPP_NUMBER ||
        "";

      const cleanPhone = String(phoneNumber).replace(/\D/g, "");

      if (!cleanPhone) {
        alert("Nomor WhatsApp admin belum diatur.");
        return;
      }

      const adminTemplate = siteSettings?.contact?.orderMessage || "";

      const hasProductVariables =
        adminTemplate.includes("{productName}") ||
        adminTemplate.includes("{product_name}") ||
        adminTemplate.includes("{productLabel}") ||
        adminTemplate.includes("{product_price}") ||
        adminTemplate.includes("{price}");

      const message = hasProductVariables
        ? applyOrderTemplate(adminTemplate, product)
        : createDirectProductOrderMessage(product);

      console.log("ORDER WHATSAPP MESSAGE:", message);

      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank");
    },
    [siteSettings],
  );

  useEffect(() => {
    if (!siteSettings?.theme) return;
    
    import('./utils/theme').then(({ applyGlobalTheme }) => {
      // Map old standard colors if new structure is absent
      const themeData = siteSettings.theme;
      applyGlobalTheme(themeData);
    });
  }, [siteSettings?.theme]);

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState<
    "home" | "produk" | "app" | "game" | "video" | "script"
  >("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Admin Menu States ---
  const [adminMode, setAdminMode] = useState<
    "dashboard" | "edit" | "add" | null
  >(null);
  const [editingProduct, setEditingProduct] = useState<{
    catId: string;
    product: Product;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const openAdminFromMainMenu = () => {
    console.log("OPEN ADMIN FROM MAIN MENU");
    setIsMenuOpen(false);
    setIsAiChatOpen(false);

    setTimeout(() => {
      // Validasi session modern
      const saved = localStorage.getItem("adminSession");
      let isValidSession = false;
      if (saved) {
        try {
          const session = JSON.parse(saved);
          if (session?.loggedIn && session?.username) {
            isValidSession = true;
          }
        } catch (e) {}
      }
      
      if (isAdminLoggedIn || isValidSession) {
        setShowLoginModal(false);
        setAdminMode("dashboard");
        return;
      }
      
      setShowLoginModal(true);
      setAdminMode(null);
    }, 120);
  };

  const handleAdminLoginInit = () => {
    console.log("ADMIN LOGIN SUCCESS");
    setIsAdminLoggedIn(true);
    setShowLoginModal(false);
    setAdminMode("dashboard");
  };

  const handleLogoutInit = () => {
    localStorage.removeItem("adminSession");
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminUsername");
    localStorage.removeItem("sanz_admin_logged_in");
    localStorage.removeItem("adminLoggedIn");
    
    setIsAdminLoggedIn(false);
    setAdminMode(null);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("adminSession");

      if (!saved) {
        setIsAdminLoggedIn(false);
        return;
      }

      const session = JSON.parse(saved);

      if (session?.loggedIn === true && session?.username) {
        setIsAdminLoggedIn(true);
      } else {
        handleLogoutInit();
      }
    } catch (error) {
      handleLogoutInit();
    }
  }, []);

  useEffect(() => {
    if ((loading && !storeLoading) || activeCategory || showLoginModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [loading, storeLoading, activeCategory, showLoginModal]);

  useEffect(() => {
    console.log("ADMIN STATE:", {
      adminLoginOpen: showLoginModal,
      adminPanelOpen: adminMode !== null,
      isAdminLoggedIn,
      savedLogin: localStorage.getItem("isAdminLoggedIn")
    });
  }, [showLoginModal, adminMode, isAdminLoggedIn]);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text selection:bg-theme-accent/20 font-sans overflow-x-hidden">
      <Toaster position="bottom-right" />
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleAdminLoginInit}
        />
      )}
      <Suspense fallback={null}>
        <AnimatePresence>
          {loading && siteSettings.loading?.enabled !== false && (
            <LoadingScreen
              onComplete={() => setLoading(false)}
              storeName={siteSettings.branding.storeName || siteSettings.branding.siteName}
              loadingName={siteSettings.branding.loadingName}
              loadingSubtitle={siteSettings.branding.loadingSubtitle}
              settings={siteSettings.loading}
            />
          )}
        </AnimatePresence>
      </Suspense>

      {(!loading || siteSettings.loading?.enabled === false) && (
        <>
          {siteSettings?.layout?.designMode === 'shop' ? (
            <ShopStyleLayout 
              products={storeProducts}
              categories={localCategories}
              activeCategory={selectedCategory}
              setActiveCategory={setSelectedCategory}
              handleBuyProduct={handleDirectOrder}
              openProductDetail={openProductDetail}
              onHome={() => setCurrentTab('home')}
              onChatAi={() => setIsAiChatOpen(true)}
              onAdmin={openAdminFromMainMenu}
              onRating={openRatingMenu}
              designV2Settings={designV2Settings}
              siteSettings={siteSettings}
            />
          ) : (
            <>
              <header className="store-header">
                <div className="premium-brand-wrap" style={{ cursor: "pointer" }} onClick={() => setCurrentTab("home")}>
                  <span className="premium-brand-spark">✦</span>

                  <div className="premium-brand-text-box">
                    <h1 className="premium-brand-name">
                      {siteSettings.branding.headerName || siteSettings.branding.storeName || siteSettings.branding.siteName || "SANZ STORE"}
                    </h1>
                    <span className="premium-brand-sub">
                      {siteSettings.branding.slogan || "Digital Store"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
              className="main-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>

            <MainMenuDrawer
              open={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onLoginAdmin={openAdminFromMainMenu}
              onChatAi={() => setIsAiChatOpen(true)}
              onRating={openRatingMenu}
              onHome={() => {
                setCurrentTab("home");
                setSelectedCategory("Semua");
              }}
              onVideoGame={() => {
                setCurrentTab("game");
                setSelectedCategory("Semua");
              }}
              onVideo={() => {
                setCurrentTab("video");
                setSelectedCategory("Semua");
              }}
            />
          </header>

          <div className="flex-1 pt-[88px] md:pt-[100px] pb-20 max-w-7xl mx-auto w-full">
            <Suspense fallback={<ViewFallback />}>
              <AnimatePresence mode="wait">
                {currentTab === "game" ? (
                  <GameView key="game" />
                ) : currentTab === "video" ? (
                  <VideoView
                    key="video"
                    videoData={VIDEO_DATA}
                    storeName={siteSettings.branding.storeName || siteSettings.branding.siteName}
                  />
                ) : currentTab === "script" ? (
                  <ScriptBotView
                    key="script"
                    product={
                      localCategories
                        .find((c) => c.id === "sc")
                        ?.products.find((p) => p.id === "sc1") ||
                      localCategories
                        .flatMap((c) => c.products)
                        .find((p) =>
                          p.category.toLowerCase().includes("script"),
                        )
                    }
                    settings={siteSettings}
                  />
                ) : (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {currentTab === "home" && (
                      <div className="mb-8 md:mb-12 px-4">
                        <HeroSection settings={siteSettings} />

                        {siteSettings.general?.infoDisplayMode ===
                        "hidden" ? null : siteSettings.general
                            ?.infoDisplayMode === "datetime" ? (
                          <TimeDateCard siteSettings={siteSettings} />
                        ) : siteSettings.general?.infoDisplayMode === "both" ? (
                          <div className="flex flex-col gap-0 overflow-hidden">
                            <VpsStatusShowcase siteSettings={siteSettings} />
                            <div className="-mt-8 md:-mt-12">
                              <TimeDateCard siteSettings={siteSettings} />
                            </div>
                          </div>
                        ) : (
                          /* "runtime" or default */
                          <VpsStatusShowcase siteSettings={siteSettings} />
                        )}
                      </div>
                    )}

                    <div className="home-category-shell">
                      <div className="home-category-track">
                        <button
                          type="button"
                          className={`home-category-pill ${isLandingPage ? "active shadow-glow" : ""}`}
                          onClick={() => setSelectedCategory("Semua")}
                        >
                          <span className="home-category-pill-label">SEMUA</span>
                        </button>

                        {localCategories.map((category: any) => {
                          const key = category.slug || category.id || (category.name ? slugify(category.name) : "");
                          if (!key) return null;
                          const isActive = categoryMatches(key, selectedCategory);

                          return (
                            <button
                              key={key}
                              type="button"
                              className={`home-category-pill ${isActive ? "active shadow-glow" : ""}`}
                              onClick={() => {
                                console.log("CATEGORY CLICK:", key);
                                setSelectedCategory(key);
                              }}
                            >
                              {isActive && siteSettings.categoryTabs?.showActiveIcon && (
                                <span className="mr-1 text-[10px] opacity-80">{siteSettings.categoryTabs?.activeIcon || "✦"}</span>
                              )}
                              <span className="home-category-pill-label">{category.name || category.title || category.label || key.replace(/-/g, " ")}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {isLandingPage ? (
                      <div className="menu-semua-premium">
                        {/* 1. Hero Premium */}
                        <section className="land-hero-premium">
                          <div className="hero-orb"></div>
                          <span className="land-badge">{siteSettings.serviceSection?.badgeText || menuSemuaText.badgeText}</span>
                          <h2 className="land-title">{siteSettings.serviceSection?.title || menuSemuaText.heroTitle}</h2>
                          <p className="land-subtitle">{siteSettings.serviceSection?.description || menuSemuaText.heroSubtitle}</p>
                          <div className="land-chips">
                            <span className="land-chip"><Zap className="w-3.5 h-3.5" /> {(menuSemuaText as any).chip1 || "Cepat"}</span>
                            <span className="land-chip"><ShieldCheck className="w-3.5 h-3.5" /> {(menuSemuaText as any).chip2 || "Aman"}</span>
                            <span className="land-chip"><HeadphonesIcon className="w-3.5 h-3.5" /> {(menuSemuaText as any).chip3 || "Support Aktif"}</span>
                          </div>
                          <div className="hero-line"></div>
                        </section>

                        {/* 2. Quick Stats */}
                        <section className="land-stats-grid">
                          {(siteSettings.statsSection?.stats || [
                            { id: "support", icon: "🎧", value: "24/7", label: "Support", active: true },
                            { id: "fast", icon: "⚡", value: "Fast", label: "Response", active: true },
                            { id: "active", icon: "▰", value: "Aktif", label: "Layanan", active: true },
                            { id: "easy", icon: "✓", value: "Mudah", label: "Order", active: true }
                          ]).filter((s:any) => s.active).map((s: any) => (
                            <div className="stat-card" key={s.id}>
                              <span className="text-xl mb-2">{s.icon}</span>
                              <span className="stat-value">{s.value}</span>
                              <span className="stat-label">{s.label}</span>
                            </div>
                          ))}
                        </section>

                        {/* 3. Alur Layanan Timeline */}
                        <section className="land-timeline-section">
                          <div className="land-section-header">
                            <h3>{siteSettings.flowSection?.title || menuSemuaText.flowTitle}</h3>
                            <p>{siteSettings.flowSection?.description || menuSemuaText.flowSubtitle}</p>
                          </div>
                          <div className="land-timeline-grid">
                            {(siteSettings.flowSection?.steps || [
                              { step: "1", title: menuSemuaText.step1Title, desc: menuSemuaText.step1Desc },
                              { step: "2", title: menuSemuaText.step2Title, desc: menuSemuaText.step2Desc },
                              { step: "3", title: menuSemuaText.step3Title, desc: menuSemuaText.step3Desc },
                              { step: "4", title: menuSemuaText.step4Title, desc: menuSemuaText.step4Desc }
                            ]).map((s: any) => (
                              <div className="timeline-card" key={s.id || s.step}>
                                <div className="timeline-number">{s.number || s.step}</div>
                                <div className="timeline-text">
                                  <h4>{s.title}</h4>
                                  <p>{s.desc || s.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* 4. Trust Panel */}
                        <section className="land-trust-panel">
                          <div className="trust-left">
                            <h3>{siteSettings.benefitsSection?.title || menuSemuaText.trustTitle}</h3>
                            <p className="trust-subtitle">{siteSettings.benefitsSection?.description || (menuSemuaText as any).trustSubtitle || "Kami selalu memastikan setiap layanan yang Anda order aman, bergaransi, dan sesuai dengan deskripsi."}</p>
                          </div>
                          <div className="trust-right">
                            <ul className="trust-checklist">
                              {(siteSettings.benefitsSection?.benefits || [
                                { text: menuSemuaText.trustPoint1 },
                                { text: menuSemuaText.trustPoint2 },
                                { text: menuSemuaText.trustPoint3 },
                                { text: menuSemuaText.trustPoint4 },
                                { text: menuSemuaText.trustPoint5 }
                              ]).filter((b:any) => b.active !== false).map((b: any, i: number) => (
                                <li key={i}><CheckCircle2 className="w-5 h-5 trust-check" /> {b.text}</li>
                              ))}
                            </ul>
                          </div>
                        </section>

                        {/* 5. Highlight Banner */}
                        <section className="land-highlight-banner">
                          <div className="banner-strip"></div>
                          <div className="banner-content">
                            <Zap className="w-7 h-7 text-cyan-400 shrink-0" />
                            <p>{menuSemuaText.highlightText}</p>
                          </div>
                        </section>

                        {/* 6. Feature Grid Premium */}
                        <section className="land-feature-section">
                          <div className="land-section-header">
                            <h3>{menuSemuaText.featureTitle}</h3>
                            <p>{menuSemuaText.featureSubtitle}</p>
                          </div>
                          <div className="land-feature-grid-premium">
                            {[
                              { icon: "⚡", title: menuSemuaText.feature1Title, desc: menuSemuaText.feature1Desc },
                              { icon: "🛡️", title: menuSemuaText.feature2Title, desc: menuSemuaText.feature2Desc },
                              { icon: "✨", title: menuSemuaText.feature3Title, desc: menuSemuaText.feature3Desc },
                              { icon: "💬", title: menuSemuaText.feature4Title, desc: menuSemuaText.feature4Desc },
                              { icon: "💎", title: menuSemuaText.feature5Title, desc: menuSemuaText.feature5Desc },
                              { icon: "📦", title: menuSemuaText.feature6Title, desc: menuSemuaText.feature6Desc },
                              { icon: "🤖", title: menuSemuaText.feature7Title, desc: menuSemuaText.feature7Desc },
                              { icon: "🤝", title: menuSemuaText.feature8Title, desc: menuSemuaText.feature8Desc }
                            ].map((f, i) => (
                              <div className="feature-item-premium" key={i}>
                                <div className="feature-icon">{f.icon}</div>
                                <div className="feature-text">
                                  <h4>{f.title}</h4>
                                  <p>{f.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* 7. Mini FAQ */}
                        <section className="land-faq-section">
                          <div className="land-section-header">
                            <h3>Info Singkat</h3>
                            <p>Pertanyaan umum seputar layanan</p>
                          </div>
                          <div className="faq-grid">
                            <div className="faq-card">
                              <h4>Bagaimana cara order?</h4>
                              <p>Pilih kategori, pilih produk, lalu klik tombol Beli Sekarang.</p>
                            </div>
                            <div className="faq-card">
                              <h4>Apakah harga bisa berubah?</h4>
                              <p>Harga mengikuti update admin dan kategori masing-masing.</p>
                            </div>
                            <div className="faq-card">
                              <h4>Kalau ada kendala?</h4>
                              <p>Hubungi admin melalui tombol order/kontak yang tersedia.</p>
                            </div>
                          </div>
                        </section>

                        {/* 8. CTA Akhir */}
                        <section className="land-cta-premium">
                          <h3>Siap mulai pilih layanan?</h3>
                          <p>Gunakan tab kategori di atas untuk melihat produk sesuai kebutuhan.</p>
                          <button 
                            className="cta-secondary-btn" 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          >
                            Lihat Kategori
                          </button>
                        </section>

                      </div>
                    ) : (
                      <div className="pretty-products-grid products-grid grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-4 bg-transparent">
                        {(() => {
                          const productsToShow = localCategories
                            .flatMap((c) => c.products)
                            .filter((p) => {
                              const normalizedActive = normalizeCategory(selectedCategory);
                              
                              // Check all possible category fields of the product using aliases
                              const productValues = [
                                p.category,
                                p.categoryId,
                                p.categorySlug,
                                p.type
                              ];

                              return productValues.some(val => categoryMatches(val || "", selectedCategory));
                            });
                          // Deduplicate products based on ID
                          let uniqueProducts = Array.from(new Map(productsToShow.map((item: any) => [item.id, item])).values()) as any[];
                          
                          if (searchQuery.trim()) {
                            uniqueProducts = uniqueProducts.filter(p => 
                              p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
                            );
                          }

                          if (uniqueProducts.length === 0) {
                            return (
                              <div className="pretty-products-empty">
                                <div className="pretty-products-empty-icon">📦</div>
                                <h3>Produk belum tersedia</h3>
                                <p>Produk untuk kategori ini belum ditambahkan. Silakan cek kategori lain.</p>
                              </div>
                            );
                          }

                          return uniqueProducts.map((product: any) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              onBuy={handleDirectOrder}
                              onDetail={openProductDetail}
                            />
                          ));
                        })()}
                      </div>
                    )}
                    <div className="h-10" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Suspense>

            {isProductDetailOpen && selectedProductDetail && (
              <div className="product-detail-overlay" onClick={closeProductDetail}>
                <div
                  className="product-detail-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="product-detail-close"
                    onClick={closeProductDetail}
                  >
                    ✕
                  </button>

                  <div className="product-detail-image-wrap">
                    {getProductImage(selectedProductDetail) ? (
                      <img
                        src={getProductImage(selectedProductDetail)}
                        alt={getProductName(selectedProductDetail)}
                        className="product-detail-image"
                      />
                    ) : (
                      <div className="product-detail-placeholder">
                        ✦
                      </div>
                    )}
                  </div>

                  <div className="product-detail-content">
                    <div className="product-detail-meta">
                      <span className="product-detail-category">
                        {getProductCategory(selectedProductDetail)}
                      </span>

                      <span className="product-detail-rating">
                        ⭐ {selectedProductDetail.rating || "5.0"}
                      </span>
                    </div>

                    <h2 className="product-detail-title">
                      {getProductName(selectedProductDetail)}
                    </h2>

                    <p className="product-detail-description">
                      {getProductDescription(selectedProductDetail)}
                    </p>

                    <div className="product-detail-price-box">
                      <span>Total Harga</span>
                      <strong>
                        <span className="text-[14px] mr-1">Rp</span>
                        {getProductPrice(selectedProductDetail)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="product-detail-buy-button"
                      onClick={() => {
                        closeProductDetail();
                        handleDirectOrder(selectedProductDetail);
                      }}
                    >
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isRatingOpen && (
              <div className="rating-overlay" onClick={closeRatingMenu}>
                <div className="rating-panel" onClick={(e) => e.stopPropagation()}>
                  <div className="rating-header">
                    <div>
                      <h2>Rating Store</h2>
                      <p>Berikan penilaian kamu untuk store ini.</p>
                    </div>

                    <button
                      type="button"
                      className="rating-close"
                      onClick={closeRatingMenu}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="rating-form">
                    <label>
                      Nama
                      <input
                        type="text"
                        value={ratingName}
                        onChange={(e) => setRatingName(e.target.value)}
                        placeholder="Masukkan nama kamu"
                        maxLength={25}
                      />
                    </label>

                    <label>
                      Kasih Bintang
                      <div className="rating-stars-picker">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`rating-star-button ${ratingStars >= star ? "active" : ""}`}
                            onClick={() => setRatingStars(star)}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </label>

                    <label>
                      Komentar
                      <textarea
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        placeholder="Tulis komentar kamu..."
                        maxLength={300}
                        rows={4}
                      />
                    </label>

                    {ratingError && (
                      <div className="rating-error">
                        {ratingError}
                      </div>
                    )}

                    {ratingSuccess && (
                      <div className="rating-success">
                        {ratingSuccess}
                      </div>
                    )}

                    <button
                      type="button"
                      className="rating-submit"
                      onClick={submitRating}
                      disabled={ratingLoading}
                    >
                      {ratingLoading ? "Mengirim..." : "Kirim Rating"}
                    </button>
                  </div>

                  <div className="rating-list-section">
                    <div className="rating-list-header">
                      <h3>Rating Terbaru</h3>
                      <span>{ratings.length} ulasan</span>
                    </div>

                    <div className="rating-list">
                      {ratings.length === 0 ? (
                        <div className="rating-empty">
                          Belum ada rating. Jadilah yang pertama memberi penilaian.
                        </div>
                      ) : (
                        ratings.map((item) => (
                          <div key={item.id} className="rating-item">
                            <div className="rating-item-top">
                              <strong>{item.name}</strong>
                              <span>
                                {"★".repeat(Number(item.stars || 0))}
                                {"☆".repeat(5 - Number(item.stars || 0))}
                              </span>
                            </div>

                            <p>{item.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="bg-theme-card border-t border-theme-border pt-[50px] pb-[40px] px-6 relative z-10 mt-auto">
            <div className="max-w-7xl mx-auto flex gap-4 flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-theme-surface rounded-2xl flex items-center justify-center border border-theme-border mb-4">
                <Bot className="w-6 h-6 text-theme-accent" />
              </div>
              <p className="text-theme-text text-base font-bold">
                {siteSettings.branding.footerName || siteSettings.branding.storeName || siteSettings.branding.siteName}
              </p>
              {siteSettings.branding.footerDescription && (
                <p className="text-theme-muted text-sm max-w-sm">
                  {siteSettings.branding.footerDescription}
                </p>
              )}
              <div className="flex items-center gap-6 mt-4">
                <span className="text-xs text-theme-muted uppercase tracking-widest font-bold">
                  Secure
                </span>
                <span className="w-1 h-1 rounded-full bg-theme-border" />
                <span className="text-xs text-theme-muted uppercase tracking-widest font-bold">
                  Fast
                </span>
                <span className="w-1 h-1 rounded-full bg-theme-border" />
                <span className="text-xs text-theme-muted uppercase tracking-widest font-bold">
                  Reliable
                </span>
              </div>
              <p className="text-xs text-theme-muted/50 mt-8 font-mono">
                {siteSettings.branding.copyrightText || siteSettings.branding.copyright}
              </p>
            </div>
          </footer>
            </>
          )}
        </>
      )}

      {/* Heavy Modals lazy loaded */}
      <Suspense fallback={null}>
        {selectedPopupCategory && (
          <CategoryPopup
            category={selectedPopupCategory}
            isOpen={!!selectedPopupCategory}
            onClose={() => setSelectedPopupCategory(null)}
            siteSettings={siteSettings}
          />
        )}

        {isAdminLoggedIn && (
          <AdminPanel
            isAdminLoggedIn={isAdminLoggedIn}
            adminMode={adminMode}
            setAdminMode={setAdminMode}
            localCategories={localCategories}
            handleAdminLogout={handleLogoutInit}
            siteSettings={siteSettings}
            products={storeProducts}
            slides={slides}
          />
        )}
        <GlobalChatDrawer 
          isOpen={isAiChatOpen} 
          onClose={() => setIsAiChatOpen(false)} 
        />
      </Suspense>
    </div>
  );
}
