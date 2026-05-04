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
const ChatDrawer = lazy(() => import("./components/views/ChatDrawer").then(module => ({ default: module.ChatDrawer })));

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

import MainMenuDrawer from "./components/views/MainMenuDrawer";
import LoginModal from "./components/views/LoginModal";
import { useStoreData } from "./hooks/useStoreData";

export default function App() {
  // --- Core State ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("sanz_admin_logged_in") === "true";
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

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
    
    import('./utils/theme').then(({ applyGlobalTheme }) => {
      // Map old standard colors if new structure is absent
      const themeData = siteSettings.theme;
      applyGlobalTheme(themeData);
    });
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

  const openAdminFromMainMenu = () => {
    console.log("OPEN ADMIN FROM MAIN MENU");
    setIsMenuOpen(false);
    setIsAiChatOpen(false);

    setTimeout(() => {
      const savedAdmin = localStorage.getItem("sanz_admin_logged_in") === "true" || localStorage.getItem("isAdminLoggedIn") === "true";
      
      if (savedAdmin || isAdminLoggedIn) {
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
    localStorage.setItem("sanz_admin_logged_in", "true");
    localStorage.setItem("isAdminLoggedIn", "true");
    setIsAdminLoggedIn(true);
    setShowLoginModal(false);
    setAdminMode("dashboard");
  };

  const handleLogoutInit = () => {
    localStorage.removeItem("sanz_admin_logged_in");
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminLoggedIn");
    setIsAdminLoggedIn(false);
    setAdminMode(null);
  };

  useEffect(() => {
    // This unused old effect is now replaced by the one above.
  }, [siteSettings.theme]);

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
          <header className="store-header">
            <div className="flex items-center gap-3 lg:gap-4">
              <button
                className="main-menu-button"
                onClick={() => setIsAiChatOpen(true)}
              >
                <Bot className="w-5 h-5" />
              </button>
              <div className="store-brand" onClick={() => setCurrentTab("home")}>
                <div className="store-logo">
                  {siteSettings.branding.logoUrl ? (
                    <img
                      src={siteSettings.branding.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Bot className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="store-brand-text hidden sm:block">
                  <h1 className="store-brand-title">
                    {siteSettings.branding.headerName || siteSettings.branding.storeName || siteSettings.branding.siteName || "SANZ STORE"}
                  </h1>
                  <p className="store-brand-subtitle">
                    {siteSettings.branding.slogan || "Infrastruktur Terpadu & Modern"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-[10px] flex-shrink-0">
              <button
                className="main-menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>

            <MainMenuDrawer
              open={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onLoginAdmin={openAdminFromMainMenu}
              onChatAi={() => setIsAiChatOpen(true)}
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
                        {[{ id: "Semua", title: "Semua", name: "Semua" }, ...localCategories].map((cat) => (
                          <button
                            key={cat.id || cat.name || cat.title}
                            onClick={() => setSelectedCategory(cat.id || (cat as any).name || (cat as any).title || "Semua")}
                            className={`home-category-pill ${
                              selectedCategory === (cat.id || (cat as any).name || (cat as any).title || "Semua")
                                ? "active"
                                : ""
                            }`}
                          >
                            <span className="home-category-pill-label">{(cat.title || (cat as any).name || cat.id).replace(/-/g, " ")}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedCategory === "Semua" ? (
                      <div className="menu-semua-premium">
                        {/* 1. Hero Premium */}
                        <section className="land-hero-premium">
                          <div className="hero-orb"></div>
                          <span className="land-badge">{menuSemuaText.badgeText}</span>
                          <h2 className="land-title">{menuSemuaText.heroTitle}</h2>
                          <p className="land-subtitle">{menuSemuaText.heroSubtitle}</p>
                          <div className="land-chips">
                            <span className="land-chip"><Zap className="w-3.5 h-3.5" /> {(menuSemuaText as any).chip1 || "Cepat"}</span>
                            <span className="land-chip"><ShieldCheck className="w-3.5 h-3.5" /> {(menuSemuaText as any).chip2 || "Aman"}</span>
                            <span className="land-chip"><HeadphonesIcon className="w-3.5 h-3.5" /> {(menuSemuaText as any).chip3 || "Support Aktif"}</span>
                          </div>
                          <div className="hero-line"></div>
                        </section>

                        {/* 2. Quick Stats */}
                        <section className="land-stats-grid">
                          <div className="stat-card">
                            <HeadphonesIcon className="stat-icon" />
                            <span className="stat-value">24/7</span>
                            <span className="stat-label">Support</span>
                          </div>
                          <div className="stat-card">
                            <Zap className="stat-icon" />
                            <span className="stat-value">Fast</span>
                            <span className="stat-label">Response</span>
                          </div>
                          <div className="stat-card">
                            <Server className="stat-icon" />
                            <span className="stat-value">Aktif</span>
                            <span className="stat-label">Layanan</span>
                          </div>
                          <div className="stat-card">
                            <CheckCircle2 className="stat-icon" />
                            <span className="stat-value">Mudah</span>
                            <span className="stat-label">Order</span>
                          </div>
                        </section>

                        {/* 3. Alur Layanan Timeline */}
                        <section className="land-timeline-section">
                          <div className="land-section-header">
                            <h3>{menuSemuaText.flowTitle}</h3>
                            <p>{menuSemuaText.flowSubtitle}</p>
                          </div>
                          <div className="land-timeline-grid">
                            {[
                              { step: "1", title: menuSemuaText.step1Title, desc: menuSemuaText.step1Desc },
                              { step: "2", title: menuSemuaText.step2Title, desc: menuSemuaText.step2Desc },
                              { step: "3", title: menuSemuaText.step3Title, desc: menuSemuaText.step3Desc },
                              { step: "4", title: menuSemuaText.step4Title, desc: menuSemuaText.step4Desc }
                            ].map((s) => (
                              <div className="timeline-card" key={s.step}>
                                <div className="timeline-number">{s.step}</div>
                                <div className="timeline-text">
                                  <h4>{s.title}</h4>
                                  <p>{s.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* 4. Trust Panel */}
                        <section className="land-trust-panel">
                          <div className="trust-left">
                            <h3>{menuSemuaText.trustTitle}</h3>
                            <p className="trust-subtitle">{(menuSemuaText as any).trustSubtitle || "Kami selalu memastikan setiap layanan yang Anda order aman, bergaransi, dan sesuai dengan deskripsi."}</p>
                          </div>
                          <div className="trust-right">
                            <ul className="trust-checklist">
                              <li><CheckCircle2 className="w-5 h-5 trust-check" /> {menuSemuaText.trustPoint1}</li>
                              <li><CheckCircle2 className="w-5 h-5 trust-check" /> {menuSemuaText.trustPoint2}</li>
                              <li><CheckCircle2 className="w-5 h-5 trust-check" /> {menuSemuaText.trustPoint3}</li>
                              <li><CheckCircle2 className="w-5 h-5 trust-check" /> {menuSemuaText.trustPoint4}</li>
                              <li><CheckCircle2 className="w-5 h-5 trust-check" /> {menuSemuaText.trustPoint5}</li>
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
        <ChatDrawer 
          isOpen={isAiChatOpen} 
          onClose={() => setIsAiChatOpen(false)} 
          elainaSettings={siteSettings?.elainaChat} 
        />
      </Suspense>
    </div>
  );
}
