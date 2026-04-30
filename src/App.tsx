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

const GameView = lazy(() => import("./components/views/GameView"));
const VideoView = lazy(() => import("./components/views/VideoView"));
const ScriptBotView = lazy(() => import("./components/views/ScriptBotView"));
const AdminPanel = lazy(() => import("./components/views/AdminPanel"));
const HeroSection = lazy(() => import("./components/common/HeroSection"));
const LoadingScreen = lazy(() => import("./components/common/LoadingScreen"));
const ProductDetailModal = lazy(
  () => import("./components/views/ProductDetailModal"),
);
const VpsStatusShowcase = lazy(
  () => import("./components/common/VpsStatusShowcase"),
);
const TimeDateCard = lazy(
  () => import("./components/common/TimeDateCard"),
);


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
        onClick={() => onDetail?.(product)}
        className="group relative bg-theme-card border border-theme-border rounded-[24px] p-2.5 flex flex-col h-full cursor-pointer hover:border-[#334155] transition-all duration-500 overflow-hidden"
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

          <p className="text-[10px] md:text-[11px] text-theme-muted line-clamp-3 leading-relaxed mb-4 flex-1">
            {product.description ||
              "Layanan digital premium dan bergaransi resmi."}
          </p>

          <div className="pt-3 border-t border-theme-border border-dashed mt-auto shrink-0 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-theme-muted uppercase tracking-widest leading-none mb-1">
                Total Harga
              </span>
              <span className="text-lg font-display font-black text-theme-text tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-theme-accent to-theme-accent-sec">
                Rp {product.price}
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-theme-surface flex items-center justify-center group-hover:bg-theme-accent transition-all border border-theme-border group-hover:border-theme-accent shadow-sm group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transform group-hover:rotate-[-5deg] shrink-0">
              <ChevronRight className="w-4 h-4 text-theme-muted group-hover:text-theme-card transition-colors" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

// Components removed to clear unused code

import LoginModal from "./components/views/LoginModal";
import { useStoreData } from "./hooks/useStoreData";

export default function App() {
  // --- Core State ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("sanz_admin_logged_in") === "true";
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const {
    loading: storeLoading,
    siteSettings,
    categories: rawCategories,
    products: storeProducts,
    slides,
  } = useStoreData();

  const localCategories = useMemo(() => {
    const baseCategories =
      rawCategories.length > 0 ? rawCategories : CATEGORIES;
    return baseCategories.map((cat) => {
      const dbProducts = storeProducts.filter(
        (p) =>
          p.categoryId === cat.id ||
          p.category === cat.title ||
          (p.category &&
            p.category.toLowerCase().includes(cat.id.toLowerCase())),
      );
      return {
        ...cat,
        products: dbProducts.length > 0 ? dbProducts : cat.products,
      };
    });
  }, [rawCategories, storeProducts]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!siteSettings?.theme) return;
    const root = document.documentElement;

    root.style.setProperty('--bg-main', siteSettings.theme.backgroundColor || '#050816');
    root.style.setProperty('--bg-card', siteSettings.theme.cardColor || '#0b1220');
    root.style.setProperty('--bg-surface', siteSettings.theme.surfaceColor || '#111827');
    root.style.setProperty('--text-main', siteSettings.theme.textColor || '#f8fafc');
    root.style.setProperty('--text-muted', siteSettings.theme.mutedColor || '#94a3b8');
    root.style.setProperty('--accent', siteSettings.theme.primaryColor || '#22d3ee');
    root.style.setProperty('--accent-sec', siteSettings.theme.accentSecColor || '#2dd4bf');
    root.style.setProperty('--accent-glow', `${siteSettings.theme.primaryColor || '#22d3ee'}33`); // add 20% opacity
    root.style.setProperty('--border-refined', siteSettings.theme.borderColor || siteSettings.theme.surfaceColor || '#1f2937');
    root.style.setProperty('--footer-bg', siteSettings.theme.footerColor || siteSettings.theme.backgroundColor || '#03050c');
  }, [siteSettings?.theme]);

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [currentTab, setCurrentTab] = useState<
    "home" | "produk" | "app" | "game" | "video" | "script"
  >("home");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const saveToFirebase = async (data: Category[]) => {
    if (!isAdminLoggedIn) {
      alert("Akses ditolak: Anda bukan admin store.");
      return false;
    }
    setIsSaving(true);
    try {
      // Logic handled via subcollections now
      return true;
    } catch (e: any) {
      alert("Gagal menyimpan ke Firestore: " + e.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = handleLogoutInit;

  const ensureFirebaseReady = () => {
    if (!firebaseReady || !db) {
      alert("⚠️ FIREBASE BELUM TERHUBUNG\n\nSilakan isi Firebase Config di src/setting.js agar fitur simpan berfungsi.");
      return false;
    }
    return true;
  };

  const updateProduct = async (catId: string, updatedProduct: Product) => {
    if (!isAdminLoggedIn) return;
    if (!ensureFirebaseReady()) return;

    const rawPriceDigits = updatedProduct.price.replace(/\D/g, "");
    if (!rawPriceDigits || isNaN(Number(rawPriceDigits))) {
      alert("Harga harus berupa angka valid!");
      return;
    }

    setIsSaving(true);
    try {
      const cleanProduct = removeUndefinedDeep({
        ...updatedProduct,
        price: Number(rawPriceDigits).toLocaleString("id-ID"),
        updatedAt: Date.now(),
      });

      await setDoc(doc(db, "products", cleanProduct.id), cleanProduct, {
        merge: true,
      });
      setEditingProduct(null);
      setAdminMode("dashboard");
    } catch (e: any) {
      console.error("Update Product Error:", e);
      alert("Gagal memperbarui produk: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (catId: string, productId: string) => {
    if (!isAdminLoggedIn) return;
    if (!ensureFirebaseReady()) return;

    if (confirm("Yakin ngilangin produk ini bang?")) {
      setIsSaving(true);
      try {
        await deleteDoc(doc(db, "products", productId));
      } catch (e: any) {
        console.error("Delete Product Error:", e);
        alert("Gagal menghapus produk: " + e.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const addProduct = async (catId: string, newProduct: Omit<Product, "id">) => {
    if (!isAdminLoggedIn) return;
    if (!ensureFirebaseReady()) return;

    const rawPriceDigits = newProduct.price.replace(/\D/g, "");
    const cleanPrice = rawPriceDigits
      ? Number(rawPriceDigits).toLocaleString("id-ID")
      : "0";

    setIsSaving(true);
    try {
      const newId = Math.random().toString(36).substring(2, 11);
      const payload = removeUndefinedDeep({
        ...newProduct,
        categoryId: catId,
        price: cleanPrice,
        id: newId,
        createdAt: Date.now(),
      });
      await setDoc(doc(db, "products", newId), payload);
      alert("Berhasil ditambahin bg!");
      setAdminMode("dashboard");
    } catch (e: any) {
      console.error("Add Product Error:", e);
      alert("Gagal menambah produk: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if ((loading && !storeLoading) || activeCategory || selectedProduct || adminMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [loading, storeLoading, activeCategory, selectedProduct, adminMode]);

  const addCategory = async (cat: Omit<Category, 'products'>) => {
    if (!isAdminLoggedIn) return;
    if (!ensureFirebaseReady()) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "categories", cat.id), removeUndefinedDeep(cat));
      alert("Kategori berhasil ditambahkan!");
    } catch (e: any) {
      console.error("Add Category Error:", e);
      alert("Gagal menambah kategori: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateCategory = async (cat: Omit<Category, 'products'>) => {
    if (!isAdminLoggedIn) return;
    if (!ensureFirebaseReady()) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "categories", cat.id), removeUndefinedDeep(cat), { merge: true });
      alert("Kategori berhasil diperbarui!");
    } catch (e: any) {
      console.error("Update Category Error:", e);
      alert("Gagal memperbarui kategori: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!isAdminLoggedIn) return;
    if (!ensureFirebaseReady()) return;
    setIsSaving(true);
    try {
      await deleteDoc(doc(db, "categories", id));
      alert("Kategori berhasil dihapus!");
    } catch (e: any) {
      console.error("Delete Category Error:", e);
      alert("Gagal menghapus kategori: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSiteSettings = async (newSettings: SiteSettings) => {
    if (!isAdminLoggedIn) return;
    if (!firebaseReady || !db) {
      alert("⚠️ FIREBASE BELUM TERHUBUNG\n\nSilakan isi Firebase Config di src/setting.js dan deploy ulang ke Netlify agar fitur simpan berfungsi.");
      return;
    }
    
    setIsSaving(true);
    console.log("Saving site settings to Firebase...", newSettings);
    
    try {
      // 1. Save core branding/main settings
      const mainData = {
        storeName: newSettings.branding.siteName,
        slogan: newSettings.branding.slogan,
        contact: newSettings.contact,
        updatedAt: Date.now()
      };
      await setDoc(doc(db, "settings", "main"), removeUndefinedDeep(mainData), { merge: true });

      // 2. Save individual modules if they changed (targeted updates)
      const tasks = [];
      
      if (newSettings.theme) {
        tasks.push(setDoc(doc(db, "settings", "theme"), removeUndefinedDeep(newSettings.theme), { merge: true }));
      }
      if (newSettings.audio) {
        tasks.push(setDoc(doc(db, "settings", "audio"), removeUndefinedDeep(newSettings.audio), { merge: true }));
      }
      if (newSettings.branding) {
        tasks.push(setDoc(doc(db, "settings", "branding"), removeUndefinedDeep(newSettings.branding), { merge: true }));
      }
      if (newSettings.contact) {
        tasks.push(setDoc(doc(db, "settings", "contact"), removeUndefinedDeep(newSettings.contact), { merge: true }));
      }
      if (newSettings.loading) {
        tasks.push(setDoc(doc(db, "settings", "loading"), removeUndefinedDeep(newSettings.loading), { merge: true }));
      }
      if (newSettings.footer) {
        tasks.push(setDoc(doc(db, "settings", "footer"), removeUndefinedDeep(newSettings.footer), { merge: true }));
      }
      if (newSettings.general) {
        tasks.push(setDoc(doc(db, "settings", "general"), removeUndefinedDeep(newSettings.general), { merge: true }));
      }

      if (tasks.length > 0) {
        await Promise.all(tasks);
      }

      // Handle Hero Slides separately if they are part of the object
      if (newSettings.heroSlides && newSettings.heroSlides.length > 0) {
        const slidePromises = newSettings.heroSlides.map((slide) =>
          setDoc(doc(db, "slides", slide.id), removeUndefinedDeep(slide), { merge: true }),
        );
        await Promise.all(slidePromises);
      }

      console.log("✅ Semua pengaturan berhasil disinkronkan ke Firebase.");
    } catch (e: any) {
      console.error("❌ Firebase Write Error:", e);
      alert(`Gagal menyimpan ke Firebase: ${e.message}\n\nPastikan Firestore Rules Anda mengizinkan akses tulis.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text selection:bg-theme-accent/20 font-sans overflow-x-hidden">
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
              storeName={siteSettings.branding.siteName}
              settings={siteSettings.loading}
            />
          )}
        </AnimatePresence>
      </Suspense>

      {(!loading || siteSettings.loading?.enabled === false) && (
        <>
          <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(8,13,28,0.92)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.08)] h-[72px] md:h-[76px] transition-all">
            <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0">
                  {siteSettings.branding.logoUrl ? (
                    <img
                      src={siteSettings.branding.logoUrl}
                      alt="Logo"
                      className="w-[46px] h-[46px] rounded-[14px] object-cover ring-1 ring-white/10 shadow-[0_4px_12px_rgba(34,211,238,0.25)]"
                    />
                  ) : (
                    <div className="w-[46px] h-[46px] bg-gradient-to-br from-[#22d3ee] to-[#0ea5e9] rounded-[14px] flex items-center justify-center shadow-[0_4px_12px_rgba(34,211,238,0.3)]">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div
                  className="flex flex-col cursor-pointer min-w-0"
                  onClick={() => setCurrentTab("home")}
                >
                  <h1 className="text-[18px] md:text-[20px] font-[800] text-white tracking-[-0.02em] leading-[1.1] truncate">
                    {siteSettings.branding.siteName}
                  </h1>
                  {siteSettings.branding.slogan && (
                    <p className="text-[12px] text-[rgba(255,255,255,0.62)] mt-[3px] truncate font-medium">
                      {siteSettings.branding.slogan}
                    </p>
                  )}
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
                    storeName={siteSettings.branding.siteName}
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
                        
                        {siteSettings.general?.infoDisplayMode === "hidden" ? null : 
                         siteSettings.general?.infoDisplayMode === "datetime" ? (
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

                    <div className="overflow-x-auto no-scrollbar py-2 mb-4 md:mb-6 select-none relative"
                        style={{ WebkitOverflowScrolling: "touch" }}
                      >
                        <div className="flex gap-2 min-w-max px-4">
                          {[
                            "Semua",
                            "Panel",
                            "Sewa Bot",
                            "Source Code",
                            "Reseller",
                            "App Premium",
                          ].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`relative px-4 md:px-6 py-2.5 rounded-xl text-[11px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                selectedCategory === cat
                                  ? "text-theme-bg bg-theme-accent shadow-lg shadow-theme-accent/20 scale-105 transform"
                                  : "text-theme-muted bg-theme-surface border border-theme-border hover:border-theme-muted hover:text-theme-text"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-4">
                      {(() => {
                        const productsToShow = localCategories
                          .flatMap((c) => c.products)
                          .filter((p) => {
                            if (selectedCategory === "Semua") return true;
                            if (selectedCategory === "Reseller")
                              return p.category
                                .toLowerCase()
                                .includes("reseller");
                            if (selectedCategory === "Panel")
                              return p.category.toLowerCase().includes("panel");
                            if (selectedCategory === "Sewa Bot")
                              return p.category
                                .toLowerCase()
                                .includes("sewa bot");
                            if (selectedCategory === "App Premium")
                              return (
                                p.category
                                  .toLowerCase()
                                  .includes("app premium") ||
                                p.category.toLowerCase().includes("premium")
                              );
                            if (selectedCategory === "Source Code")
                              return (
                                p.category
                                  .toLowerCase()
                                  .includes("source code") ||
                                p.category.toLowerCase().includes("script")
                              );
                            return p.category === selectedCategory;
                          });
                        return productsToShow.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onDetail={setSelectedProduct}
                          />
                        ));
                      })()}
                    </div>
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
              <p className="text-theme-text text-sm font-medium">
                {siteSettings.branding.footerText}
              </p>
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
                {siteSettings.branding.copyright}
              </p>
            </div>
          </footer>
        </>
      )}

      {/* Heavy Modals lazy loaded */}
      <Suspense fallback={null}>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            allProducts={localCategories.flatMap((c) => c.products)}
            onClose={() => setSelectedProduct(null)}
            settings={siteSettings}
          />
        )}

        {isAdminLoggedIn && (
          <AdminPanel
            isAdminLoggedIn={isAdminLoggedIn}
            adminMode={adminMode}
            setAdminMode={setAdminMode}
            localCategories={localCategories}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addProduct={addProduct}
            isSaving={isSaving}
            handleAdminLogout={handleLogoutInit}
            siteSettings={siteSettings}
            updateSiteSettings={updateSiteSettings}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
          />
        )}
      </Suspense>
    </div>
  );
}
