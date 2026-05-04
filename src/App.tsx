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
const GlobalChatDrawer = lazy(() => import("./components/views/GlobalChatDrawer").then(module => ({ default: module.GlobalChatDrawer })));

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
          {image ? (
            <img
              src={image}
              alt={title}
              className="new-product-image"
              loading="lazy"
            />
          ) : (
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
            <div className="store-brand-text-only" onClick={() => setCurrentTab("home")}>
              <h1 className="store-name-beauty">
                {siteSettings.branding.headerName || siteSettings.branding.storeName || siteSettings.branding.siteName || "SANZ STORE"}
              </h1>
              {siteSettings.branding.slogan && (
                <p className="store-tagline">
                  {siteSettings.branding.slogan}
                </p>
              )}
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
                      <div className="products-grid grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-4 bg-transparent">
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
        <GlobalChatDrawer 
          isOpen={isAiChatOpen} 
          onClose={() => setIsAiChatOpen(false)} 
        />
      </Suspense>
    </div>
  );
}
