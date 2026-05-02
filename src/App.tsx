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
} from "lucide-react";
import {
  CATEGORIES,
  WHATSAPP_NUMBER,
  Category,
  Product,
  VIDEO_DATA,
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
} from "./constants";

import { db, firebaseReady } from "./lib/firebase";
import { doc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
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

const ViewFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

const ProductCard = memo(
  ({
    product,
    onDetail,
  }: {
    product: Product;
    onDetail?: (p: Product) => void;
  }) => {
    // Generate a dynamic badge if none exists
    const getDynamicBadge = () => {
      if (product.badge)
        return {
          text: product.badge,
          color: "bg-theme-surface",
          textCol: "text-theme-text",
        };
      if (
        product.category.includes("Panel") ||
        product.category.includes("VPS")
      )
        return {
          text: "Best Performance",
          color: "bg-blue-600",
          textCol: "text-white",
        };
      if (product.category.includes("Bot"))
        return {
          text: "Smart Auto",
          color: "bg-emerald-500",
          textCol: "text-white",
        };
      if (product.category.includes("Reseller"))
        return {
          text: "Best Seller",
          color: "bg-amber-500",
          textCol: "text-white",
        };
      return { text: "Premium", color: "bg-purple-600", textCol: "text-white" };
    };
    const badgeInfo = getDynamicBadge();

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="group relative bg-theme-card border border-theme-border rounded-[24px] p-2.5 flex flex-col h-full hover:border-[#334155] transition-all duration-500 overflow-hidden"
        style={{
          boxShadow:
            "0 8px 30px -4px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-theme-surface/80 to-theme-card opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative aspect-[16/9] w-full rounded-[18px] overflow-hidden bg-theme-bg mb-4 isolate shadow-inner">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div
            className={`absolute top-2 left-2 md:top-3 md:left-3 px-2.5 py-1 ${badgeInfo.color} ${badgeInfo.textCol} text-[8px] font-black uppercase tracking-widest rounded-md shadow-md z-10 block`}
          >
            {badgeInfo.text}
          </div>

          <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden md:flex justify-center">
            <span className="bg-theme-surface/95 backdrop-blur-sm text-theme-text border border-theme-border text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 w-full justify-center transform active:scale-95 transition-transform">
              <ShoppingCart className="w-4 h-4 text-theme-accent" /> Pesan
            </span>
          </div>
        </div>

        <div className="px-2 pb-2 flex flex-col flex-1 relative z-10">
          <div className="flex justify-between items-center gap-2 mb-2">
            <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-theme-accent bg-theme-accent/10 border border-theme-accent/20 px-2 py-0.5 rounded flex items-center gap-1">
              <Package className="w-2.5 h-2.5" />
              {product.category}
            </p>
            <div className="flex items-center gap-1 text-theme-muted">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span className="text-[9px] font-bold text-theme-text">
                {product.rating}
              </span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-theme-text leading-snug line-clamp-2 mb-1.5 group-hover:text-theme-accent transition-colors">
            {product.name}
          </h3>

          <p className="text-[10px] md:text-[11px] text-theme-muted line-clamp-2 leading-relaxed mb-4 flex-1">
            {product.description ||
              "Layanan digital premium dan bergaransi resmi."}
          </p>

          <div className="pt-3 border-t border-theme-border border-dashed mt-auto shrink-0 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-theme-muted uppercase tracking-widest leading-none mb-1">
                Total Harga
              </span>
              <span className="text-base md:text-lg font-display font-black text-theme-text tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-theme-accent to-theme-accent-sec">
                Rp {product.price}
              </span>
            </div>
            <button
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-theme-accent text-theme-bg font-bold text-[10px] md:text-xs hover:bg-white transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transform border border-transparent whitespace-nowrap"
              onClick={(e) => {
                e.stopPropagation();
                onDetail?.(product);
              }}
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </motion.div>
    );
  },
);

import CategoryPopup from "./components/views/CategoryPopup";

// Components removed to clear unused code

import LoginModal from "./components/views/LoginModal";
import { useStoreData } from "./hooks/useStoreData";

export default function App() {
  // --- Core State ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("sanz_admin_logged_in") === "true";
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const {
    loading: storeLoading,
    siteSettings,
    categories: rawCategories,
    products: storeProducts,
    slides,
  } = useStoreData();

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
    
    if (selectedCategory !== "Semua") {
      const exists = localCategories.some((cat) => cat.id === selectedCategory || (cat as any).name === selectedCategory || (cat as any).title === selectedCategory);
      if (!exists) {
        setSelectedCategory("Semua");
      }
    }
  }, [rawCategories, localCategories, selectedCategory]);

  const handleDirectOrder = useCallback(
    (product: Product) => {
      const name = siteSettings?.branding?.siteName || "Admin";
      const phone = siteSettings?.contact?.whatsapp || WHATSAPP_NUMBER;

      let defaultMsg =
        siteSettings?.contact?.orderMessage ||
        `Halo ${name}, saya ingin memesan:\n\n*Produk:* {product_name}\n*Harga:* Rp{product_price}\n\nMohon info selanjutnya.`;

      const catLower = product.category.toLowerCase();
      if (catLower.includes("panel") && siteSettings?.contact?.panelMessage) {
        defaultMsg = siteSettings.contact.panelMessage;
      } else if (
        catLower.includes("bot") &&
        siteSettings?.contact?.botMessage
      ) {
        defaultMsg = siteSettings.contact.botMessage;
      }

      const message = defaultMsg
        .replace(/{product_name}/g, product.name)
        .replace(/{product_price}/g, product.price.toString());

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    },
    [siteSettings],
  );

  useEffect(() => {
    if (!siteSettings?.theme) return;
    const root = document.documentElement;

    root.style.setProperty(
      "--bg-main",
      siteSettings.theme.backgroundColor || "#050816",
    );
    root.style.setProperty(
      "--bg-card",
      siteSettings.theme.cardColor || "#0b1220",
    );
    root.style.setProperty(
      "--bg-surface",
      siteSettings.theme.surfaceColor || "#111827",
    );
    root.style.setProperty(
      "--text-main",
      siteSettings.theme.textColor || "#f8fafc",
    );
    root.style.setProperty(
      "--text-muted",
      siteSettings.theme.mutedColor || "#94a3b8",
    );
    root.style.setProperty(
      "--accent",
      siteSettings.theme.primaryColor || "#22d3ee",
    );
    root.style.setProperty(
      "--accent-sec",
      siteSettings.theme.accentSecColor || "#2dd4bf",
    );
    root.style.setProperty(
      "--accent-glow",
      `${siteSettings.theme.primaryColor || "#22d3ee"}33`,
    ); // add 20% opacity
    root.style.setProperty(
      "--border-refined",
      siteSettings.theme.borderColor ||
        siteSettings.theme.surfaceColor ||
        "#1f2937",
    );
    root.style.setProperty(
      "--footer-bg",
      siteSettings.theme.footerColor ||
        siteSettings.theme.backgroundColor ||
        "#03050c",
    );
  }, [siteSettings?.theme]);

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
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

  const handleAdminLoginInit = () => {
    localStorage.setItem("sanz_admin_logged_in", "true");
    setIsAdminLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogoutInit = () => {
    localStorage.removeItem("sanz_admin_logged_in");
    setIsAdminLoggedIn(false);
    setAdminMode(null);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (siteSettings.theme) {
      root.style.setProperty(
        "--site-primary",
        siteSettings.theme.primaryColor || "#22d3ee",
      );
      root.style.setProperty(
        "--site-bg",
        siteSettings.theme.backgroundColor || "#050816",
      );
      root.style.setProperty(
        "--site-card",
        siteSettings.theme.cardColor || "#0b1220",
      );
      root.style.setProperty(
        "--site-text",
        siteSettings.theme.textColor || "#f8fafc",
      );

      root.style.setProperty(
        "--bg-main",
        siteSettings.theme.backgroundColor || "#050816",
      );
      root.style.setProperty(
        "--bg-card",
        siteSettings.theme.cardColor || "#0b1220",
      );
      root.style.setProperty(
        "--bg-surface",
        siteSettings.theme.surfaceColor || "#111827",
      );
      root.style.setProperty(
        "--text-main",
        siteSettings.theme.textColor || "#f8fafc",
      );
      root.style.setProperty(
        "--text-muted",
        siteSettings.theme.mutedColor || "#94a3b8",
      );
      root.style.setProperty(
        "--accent",
        siteSettings.theme.primaryColor || "#22d3ee",
      );
      root.style.setProperty(
        "--accent-sec",
        siteSettings.theme.accentSecColor || "#2dd4bf",
      );
      root.style.setProperty("--accent-glow", `rgba(255,255,255,0.1)`); // Will refactor this later if needed
      root.style.setProperty(
        "--border-refined",
        siteSettings.theme.borderColor || "#1f2937",
      );
      root.style.setProperty(
        "--footer-bg",
        siteSettings.theme.footerColor || "#03050c",
      );
    }
  }, [siteSettings.theme]);

  useEffect(() => {
    if ((loading && !storeLoading) || activeCategory || adminMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [loading, storeLoading, activeCategory, adminMode]);

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
          <nav className="navbar fixed top-0 left-0 right-0 z-50 h-[72px] md:h-[76px] transition-all">
            <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
              <div className="header-brand cursor-pointer" onClick={() => setCurrentTab("home")}>
                <div className="flex-shrink-0">
                  {siteSettings.branding.logoUrl ? (
                    <img
                      src={siteSettings.branding.logoUrl}
                      alt="Logo"
                      className="w-[46px] h-[46px] rounded-[14px] object-cover ring-1 ring-white/10 shadow-[0_4px_12px_rgba(34,211,238,0.25)] brand-logo"
                    />
                  ) : (
                    <div className="w-[46px] h-[46px] bg-gradient-to-br from-[#22d3ee] to-[#0ea5e9] rounded-[14px] flex items-center justify-center shadow-[0_4px_12px_rgba(34,211,238,0.3)] brand-logo">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="brand-text">
                  <div className="store-name">
                    {siteSettings.branding.headerName || siteSettings.branding.storeName || siteSettings.branding.siteName || "SANZ STORE"}
                  </div>
                  <div className="store-slogan">
                    {siteSettings.branding.slogan || "Infrastruktur Terpadu & Modern"}
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-6 mx-4">
                {["home", "produk", "app", "game", "video", "script"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setCurrentTab(tab as any);
                        if (tab === "app") setSelectedCategory("App Premium");
                        else setSelectedCategory("Semua");
                      }}
                      className={`text-[12px] font-bold uppercase tracking-widest transition-all ${currentTab === tab ? "text-[#22d3ee]" : "text-[rgba(255,255,255,0.5)] hover:text-white"}`}
                    >
                      {tab === "script" ? "Bot" : tab}
                    </button>
                  ),
                )}
              </div>

              <div className="flex items-center gap-[10px] flex-shrink-0">
                <button
                  onClick={() =>
                    isAdminLoggedIn
                      ? setAdminMode("dashboard")
                      : setShowLoginModal(true)
                  }
                  className="w-[44px] h-[44px] rounded-[14px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] flex items-center justify-center text-[rgba(255,255,255,0.78)] hover:bg-[rgba(34,211,238,0.12)] hover:border-[#22d3ee]/50 hover:text-[#22d3ee] active:scale-[0.98] transition-all"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  className="lg:hidden w-[44px] h-[44px] rounded-[14px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] flex items-center justify-center text-[rgba(255,255,255,0.78)] hover:bg-[rgba(34,211,238,0.12)] hover:border-[#22d3ee]/50 hover:text-[#22d3ee] active:scale-[0.98] transition-all"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden border-t border-[rgba(255,255,255,0.08)] bg-[rgba(8,13,28,0.96)] backdrop-blur-md"
                >
                  <div className="flex flex-col px-4 py-4 gap-2">
                    {["home", "produk", "app", "game", "video", "script"].map(
                      (tab) => (
                        <button
                          key={tab}
                          onClick={() => {
                            setCurrentTab(tab as any);
                            if (tab === "app")
                              setSelectedCategory("App Premium");
                            else setSelectedCategory("Semua");
                            setIsMenuOpen(false);
                          }}
                          className={`p-4 text-sm font-bold uppercase tracking-widest text-left rounded-xl transition-all ${currentTab === tab ? "bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20" : "text-[rgba(255,255,255,0.5)] hover:bg-white/5 border border-transparent"}`}
                        >
                          {tab === "script" ? "Bot" : tab}
                        </button>
                      ),
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

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

                    <div
                      className="overflow-x-auto no-scrollbar py-2 mb-4 md:mb-6 select-none relative"
                      style={{ WebkitOverflowScrolling: "touch" }}
                    >
                      <div className="flex gap-2 min-w-max px-4">
                        {[{ id: "Semua", title: "Semua", name: "Semua" }, ...localCategories].map((cat) => (
                          <button
                            key={cat.id || cat.name || cat.title}
                            onClick={() => setSelectedCategory(cat.id || (cat as any).name || (cat as any).title || "Semua")}
                            className={`relative px-4 md:px-6 py-2.5 rounded-xl text-[11px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                              selectedCategory === (cat.id || (cat as any).name || (cat as any).title || "Semua")
                                ? "text-theme-bg bg-theme-accent shadow-lg shadow-theme-accent/20 scale-105 transform"
                                : "text-theme-muted bg-theme-surface border border-theme-border hover:border-theme-muted hover:text-theme-text"
                            }`}
                          >
                            {(cat.title || (cat as any).name || cat.id).replace(/-/g, " ")}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedCategory === "Semua" ? (
                      <div className="flex flex-col gap-10 md:gap-14 pb-12 w-full max-w-6xl mx-auto">
                        {/* Header Ringkasan */}
                        <div className="px-4 text-center mt-6">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-accent/10 border border-theme-accent/20 text-theme-accent text-[10px] font-bold uppercase tracking-wider mb-5">
                            <LayoutGrid className="w-3.5 h-3.5" />
                            Katalog Kategori
                          </div>
                          <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
                            Semua Layanan Digital
                          </h2>
                          <p className="text-slate-400 text-[13px] md:text-sm max-w-lg mx-auto leading-relaxed">
                            Pilih kategori layanan sesuai kebutuhan Anda. Produk
                            dan pembelian tersedia di masing-masing menu
                            kategori.
                          </p>
                        </div>

                        {/* Statistik Toko */}
                        <div className="px-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
                            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:border-theme-accent/30 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-theme-accent/10 flex items-center justify-center">
                                <LayoutGrid className="w-5 h-5 text-theme-accent" />
                              </div>
                              <div>
                                <h4 className="text-xl md:text-2xl font-black text-white">
                                  {
                                    localCategories.filter(
                                      (c) =>
                                        c.products && c.products.length > 0,
                                    ).length
                                  }
                                </h4>
                                <span className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                  Kategori
                                </span>
                              </div>
                            </div>
                            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:border-theme-accent/30 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-theme-accent/10 flex items-center justify-center">
                                <Package className="w-5 h-5 text-theme-accent" />
                              </div>
                              <div>
                                <h4 className="text-xl md:text-2xl font-black text-white">
                                  {localCategories.reduce(
                                    (acc, c) => acc + (c.products?.length || 0),
                                    0,
                                  )}
                                </h4>
                                <span className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                  Produk Aktif
                                </span>
                              </div>
                            </div>
                            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:border-theme-accent/30 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-theme-accent/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-theme-accent" />
                              </div>
                              <div>
                                <h4 className="text-xl md:text-2xl font-black text-white">
                                  Cepat
                                </h4>
                                <span className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                  Proses Order
                                </span>
                              </div>
                            </div>
                            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:border-theme-accent/30 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-theme-accent/10 flex items-center justify-center">
                                <HeadphonesIcon className="w-5 h-5 text-theme-accent" />
                              </div>
                              <div>
                                <h4 className="text-xl md:text-2xl font-black text-white">
                                  24/7
                                </h4>
                                <span className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                  Support Aktif
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Kategori Utama */}
                        <div className="px-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                            {localCategories
                              .filter(
                                (c) => c.products && c.products.length > 0,
                              )
                              .map((cat) => {
                                const prices = cat.products.map((p) => {
                                  if (typeof p.price === 'number') return p.price;
                                  if (typeof p.price === 'string') {
                                    const numStr = p.price.replace(/[^0-9]/g, "");
                                    return parseInt(numStr) || 0;
                                  }
                                  return 0;
                                });
                                const minPrice =
                                  prices.length > 0 ? Math.min(...prices) : 0;
                                const formatLowest =
                                  minPrice > 0
                                    ? minPrice.toLocaleString("id-ID")
                                    : "0";

                                return (
                                  <div
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id || (cat as any).name || (cat as any).title || "")}
                                    className="group cursor-pointer bg-[#0f172a]/80 backdrop-blur-sm border border-theme-accent/10 rounded-[20px] p-5 shadow-sm hover:shadow-lg hover:shadow-theme-accent/5 hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[140px] md:min-h-[160px]"
                                  >
                                    <div className="flex items-start gap-4 mb-3">
                                      <div className="w-12 h-12 rounded-full bg-theme-accent/10 border border-theme-accent/20 flex flex-shrink-0 items-center justify-center">
                                        <LayoutGrid className="w-5 h-5 text-theme-accent" />
                                      </div>
                                      <div className="flex-1">
                                        <h3 className="text-[15px] font-black text-white mb-1 group-hover:text-theme-accent transition-colors">
                                          {cat.title || (cat as any).name}
                                        </h3>
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                                          <Package className="w-3 h-3 text-slate-400" />
                                          <span className="text-[10px] font-bold text-slate-400">
                                            {cat.products.length} Produk
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
                                      {cat.description ||
                                        `Layanan ${
                                          cat.title || (cat as any).name
                                        } premium bergaransi terbaik dan terpercaya.`}
                                    </p>

                                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-auto">
                                      <div className="flex flex-col">
                                        <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">
                                          Mulai dari
                                        </span>
                                        <span className="text-[13px] md:text-[14px] font-black text-theme-accent leading-none">
                                          Rp {formatLowest}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() =>
                                          setSelectedCategory(cat.id || (cat as any).name || (cat as any).title || "")
                                        }
                                        className="px-4 py-2 bg-theme-accent/10 border border-theme-accent/20 text-theme-accent text-[11px] font-bold rounded-xl group-hover:bg-theme-accent group-hover:text-theme-bg transition-colors flex items-center gap-1.5"
                                      >
                                        Buka Kategori
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        {/* Keunggulan Layanan */}
                        <div className="px-4">
                          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
                            <h3 className="text-lg md:text-xl font-black text-white mb-6 text-center">
                              Kenapa Pilih Kami?
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                                <span className="text-[13px] font-bold text-slate-300">
                                  Aman & Terpercaya
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                  <Zap className="w-4 h-4 text-blue-500" />
                                </div>
                                <span className="text-[13px] font-bold text-slate-300">
                                  Proses Cepat
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                                  <DollarSign className="w-4 h-4 text-amber-500" />
                                </div>
                                <span className="text-[13px] font-bold text-slate-300">
                                  Harga Transparan
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                  <RefreshCcw className="w-4 h-4 text-purple-500" />
                                </div>
                                <span className="text-[13px] font-bold text-slate-300">
                                  Produk Selalu Update
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                                  <Clock className="w-4 h-4 text-rose-500" />
                                </div>
                                <span className="text-[13px] font-bold text-slate-300">
                                  Support Responsif
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cara Order */}
                        <div className="px-4">
                          <h3 className="text-lg md:text-xl font-black text-white mb-6 text-center">
                            Cara Order Layanan
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-4xl mx-auto relative">
                            {/* Connector line for desktop */}
                            <div className="hidden sm:block absolute top-6 left-10 right-10 h-[1px] bg-slate-800 -z-10" />

                            <div className="flex flex-col sm:items-center text-left sm:text-center gap-3 bg-[#0f172a] sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-[#1e293b] sm:border-none">
                              <div className="w-12 h-12 rounded-full bg-[#1e293b] border-2 border-[#0f172a] flex items-center justify-center text-white font-black shrink-0 relative">
                                1
                              </div>
                              <div>
                                <h4 className="text-[13px] font-bold text-white mb-1">
                                  Pilih Kategori
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                  Temukan layanan yang sesuai.
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:items-center text-left sm:text-center gap-3 bg-[#0f172a] sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-[#1e293b] sm:border-none">
                              <div className="w-12 h-12 rounded-full bg-[#1e293b] border-2 border-[#0f172a] flex items-center justify-center text-white font-black shrink-0 relative">
                                2
                              </div>
                              <div>
                                <h4 className="text-[13px] font-bold text-white mb-1">
                                  Pilih Produk
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                  Cek detail dan harga produk.
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:items-center text-left sm:text-center gap-3 bg-[#0f172a] sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-[#1e293b] sm:border-none">
                              <div className="w-12 h-12 rounded-full bg-[#1e293b] border-2 border-[#0f172a] flex items-center justify-center text-white font-black shrink-0 relative">
                                3
                              </div>
                              <div>
                                <h4 className="text-[13px] font-bold text-white mb-1">
                                  Beli Sekarang
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                  Tekan tombol order pada produk.
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:items-center text-left sm:text-center gap-3 bg-[#0f172a] sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-[#1e293b] sm:border-none">
                              <div className="w-12 h-12 rounded-full bg-theme-accent flex items-center justify-center text-theme-bg font-black shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)] relative">
                                4
                              </div>
                              <div>
                                <h4 className="text-[13px] font-bold text-white mb-1">
                                  Kirim Bukti
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                  Konfirmasi order via WhatsApp.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* CTA Menu Semua */}
                        <div className="px-4 flex justify-center mt-2">
                          <button
                            onClick={() => {
                              const firstCat = localCategories.filter(
                                (c) => c.products?.length > 0,
                              )[0];
                              if (firstCat)
                                setSelectedCategory(firstCat.id || (firstCat as any).name || (firstCat as any).title || "");
                            }}
                            className="px-8 py-4 bg-theme-accent text-theme-bg font-black rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:-translate-y-1 flex items-center gap-2"
                          >
                            Mulai Pilih Kategori
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-4 bg-transparent">
                        {(() => {
                          const productsToShow = localCategories
                            .flatMap((c) => c.products)
                            .filter((p) => {
                              const targetCat = localCategories.find(c => c.id === selectedCategory || (c as any).name === selectedCategory || c.title === selectedCategory);
                              if (!targetCat) return false;
                              return p.categoryId === targetCat.id || p.categoryId === targetCat.slug || p.category === targetCat.title || p.category === (targetCat as any).name || (targetCat.id && p.category && p.category.toLowerCase().includes(targetCat.id.toLowerCase()));
                            });
                          // Deduplicate products based on ID
                          const uniqueProducts = Array.from(new Map(productsToShow.map((item: any) => [item.id, item])).values());
                          return uniqueProducts.map((product: any) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              onDetail={handleDirectOrder}
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
      </Suspense>
    </div>
  );
}
