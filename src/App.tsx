/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, memo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Star
} from 'lucide-react';
import { CATEGORIES, WHATSAPP_NUMBER, Category, Product, VIDEO_DATA } from './constants';

const GameView = lazy(() => import('./components/views/GameView'));
const VideoView = lazy(() => import('./components/views/VideoView'));
const ScriptBotView = lazy(() => import('./components/views/ScriptBotView'));
const DetailView = lazy(() => import('./components/views/DetailView'));
const OwnerMenu = lazy(() => import('./components/views/OwnerMenu'));
const HeroSection = lazy(() => import('./components/common/HeroSection'));
const LoadingScreen = lazy(() => import('./components/common/LoadingScreen'));
const ProductDetailModal = lazy(() => import('./components/views/ProductDetailModal'));

const ViewFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

const ProductCard = memo(({ product, onDetail }: { product: Product; onDetail?: (p: Product) => void }) => {
  // Generate a dynamic badge if none exists
  const getDynamicBadge = () => {
    if (product.badge) return { text: product.badge, color: 'bg-slate-900', textCol: 'text-white' };
    if (product.category.includes('Panel') || product.category.includes('VPS')) return { text: 'Best Performance', color: 'bg-blue-600', textCol: 'text-white' };
    if (product.category.includes('Bot')) return { text: 'Smart Auto', color: 'bg-emerald-500', textCol: 'text-white' };
    if (product.category.includes('Reseller')) return { text: 'Best Seller', color: 'bg-amber-500', textCol: 'text-white' };
    return { text: 'Premium', color: 'bg-purple-600', textCol: 'text-white' };
  };
  const badgeInfo = getDynamicBadge();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={() => onDetail?.(product)}
      className="group relative bg-white border border-slate-100 rounded-[24px] p-2.5 flex flex-col h-full cursor-pointer hover:border-slate-300 transition-all duration-500 overflow-hidden"
      style={{ boxShadow: '0 8px 30px -4px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(255,255,255,0.5)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-slate-100 mb-4 isolate shadow-inner">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className={`absolute top-2 left-2 md:top-3 md:left-3 px-2.5 py-1 ${badgeInfo.color} ${badgeInfo.textCol} text-[8px] font-black uppercase tracking-widest rounded-md shadow-md z-10 block`}>
          {badgeInfo.text}
        </div>

        <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden md:flex justify-center">
          <span className="bg-white/95 backdrop-blur-sm text-slate-900 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 w-full justify-center transform active:scale-95 transition-transform">
            <ShoppingCart className="w-4 h-4" /> Pesan
          </span>
        </div>
      </div>
      
      <div className="px-2 pb-2 flex flex-col flex-1 relative z-10">
        <div className="flex justify-between items-center gap-2 mb-2">
           <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1">
             <Package className="w-2.5 h-2.5" />
             {product.category}
           </p>
           <div className="flex items-center gap-1 text-slate-400">
             <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
             <span className="text-[9px] font-bold text-slate-600">{product.rating}</span>
           </div>
        </div>

        <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 md:line-clamp-1 mb-1.5 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-[10px] md:text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.description || "Layanan digital premium dan bergaransi resmi."}
        </p>

        <div className="pt-3 border-t border-slate-100 border-dashed mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Harga</span>
            <span className="text-lg font-display font-black text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Rp {product.price}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-all border border-slate-200 group-hover:border-blue-600 shadow-sm group-hover:shadow-md transform group-hover:rotate-[-5deg]">
             <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'produk' | 'app' | 'game' | 'video' | 'script'>('home');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- Owner Menu States ---
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerMode, setOwnerMode] = useState<'dashboard' | 'edit' | 'add' | null>(null);
  const [localCategories, setLocalCategories] = useState<Category[]>(CATEGORIES);
  const [editingProduct, setEditingProduct] = useState<{catId: string, product: Product} | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Unified Data Fetching (Fixing the DB sync issue)
  const isSavingRef = useRef(false);

  const fetchAPI = async (isManual = false) => {
    if (isSavingRef.current && !isManual) return;
    
    console.group(`[SYNC] Fetching Data - ${new Date().toLocaleTimeString()}`);
    try {
      const res = await fetch('/api/categories?t=' + Date.now(), { 
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        // Critical: Only update if we actually got an array
        if (Array.isArray(data) && data.length > 0) {
          setLocalCategories(data);
          console.log("Success: Received latest data from server", data);
        } else {
          console.warn("Warning: Server returned empty/invalid categories. Keeping current state.");
        }
      } else {
        console.error("Error: Server responded with status", res.status);
      }
    } catch (e) {
      console.error("Critical: API load failed. Check server connection.", e);
    } finally {
      console.groupEnd();
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('sanz_owner_logged_in');
    if (loggedIn === 'true') setIsOwnerLoggedIn(true);
    
    // Initial Load
    fetchAPI(true);

    // Poll data periodically to keep devices in sync
    const interval = setInterval(() => fetchAPI(false), 8000);
    return () => clearInterval(interval);
  }, []);

  const saveToAPI = async (data: Category[]) => {
    isSavingRef.current = true;
    setIsSaving(true);
    
    // Backup for rollback
    const previousCategories = [...localCategories];
    
    // 1. Optimistic Update (Functional for latest state)
    setLocalCategories(data); 

    console.group(`[PERSIST] Saving Data - ${new Date().toLocaleTimeString()}`);
    
    try {
      const res = await fetch('/api/categories', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
      });
      
      if (!res.ok) throw new Error(`Server returned error ${res.status}`);
      
      const result = await res.json();
      console.log("Success: Data saved to server", result);
      
      // 2. Immediate Re-fetch to confirm server state and force sync
      await fetchAPI(true);
      
    } catch (e) {
      console.error('Critical: Failed to save to server. Rolling back UI.', e);
      setLocalCategories(previousCategories);
      alert('Gagal menyimpan ke server. Perubahan dibatalkan demi keamanan data.');
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
      console.groupEnd();
    }
  };

  // Auth Handlers
  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerPassword === '8381309827') {
      setIsOwnerLoggedIn(true);
      localStorage.setItem('sanz_owner_logged_in', 'true');
      setShowOwnerLogin(false);
      setOwnerPassword('');
      setOwnerMode('dashboard');
    } else {
      alert('Akses ditolak');
    }
  };

  const handleOwnerLogout = () => {
    setIsOwnerLoggedIn(false);
    localStorage.removeItem('sanz_owner_logged_in');
    setOwnerMode(null);
  };

  // CRUD modified to use saveToAPI
  const updateProduct = (catId: string, updatedProduct: Product) => {
    // FIX: Strip ALL non-digits to handle Indonesian formatting (1.000 -> 1000)
    const rawPriceDigits = updatedProduct.price.replace(/\D/g, '');
    
    if (!rawPriceDigits || isNaN(Number(rawPriceDigits))) {
      alert("Harga harus berupa angka valid!");
      return;
    }

    const cleanProduct = { 
      ...updatedProduct, 
      price: Number(rawPriceDigits).toLocaleString('id-ID') 
    };
    
    console.log(`[DEBUG] Updating Product: ${updatedProduct.name}, New Price: ${cleanProduct.price}`);

    setLocalCategories(prev => {
      const newData = prev.map(cat => 
        cat.id === catId 
        ? { ...cat, products: cat.products.map(p => p.id === updatedProduct.id ? cleanProduct : p) } 
        : cat
      );
      saveToAPI(newData);
      return newData;
    });
    
    setEditingProduct(null);
    setOwnerMode('dashboard');
  };

  const deleteProduct = (catId: string, productId: string) => {
    if (!confirm('Hapus produk?')) return;
    setLocalCategories(prev => {
      const newData = prev.map(cat => cat.id === catId ? { ...cat, products: cat.products.filter(p => p.id !== productId) } : cat);
      saveToAPI(newData);
      return newData;
    });
  };

  const addProduct = (catId: string, newProduct: Product) => {
    // FIX: Strip dots for new products too
    const rawPriceDigits = newProduct.price.replace(/\D/g, '');
    const cleanPrice = rawPriceDigits ? Number(rawPriceDigits).toLocaleString('id-ID') : '0';
    
    setLocalCategories(prev => {
      const newData = prev.map(cat => cat.id === catId ? { ...cat, products: [...cat.products, { ...newProduct, price: cleanPrice, id: `p-${Date.now()}` }] } : cat);
      saveToAPI(newData);
      return newData;
    });
    setOwnerMode('dashboard');
  };

  useEffect(() => {
    if (loading || activeCategory || selectedProduct) { document.body.style.overflow = 'hidden'; } 
    else { document.body.style.overflow = 'auto'; }
  }, [loading, activeCategory, selectedProduct]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/20 font-sans overflow-x-hidden">
      <Suspense fallback={null}>
        <AnimatePresence>
          {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
        </AnimatePresence>
      </Suspense>

      {!loading && (
        <main className="relative z-10 flex flex-col min-h-screen">
          {/* Optimal Clean Navbar */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 transition-all shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
              <div 
                className="flex items-center gap-3 cursor-pointer" 
                onClick={() => { setCurrentTab('home'); setSelectedCategory('Semua'); }}
              >
                <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-md shadow-slate-900/10"><Bot className="w-5 h-5 text-white" /></div>
                <div className="hidden sm:block"><h1 className="text-xl font-display font-black tracking-tighter text-slate-900">SANZ</h1></div>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'produk', label: 'Produk' },
                  { id: 'app', label: 'Apps' },
                  { id: 'game', label: 'Game' },
                  { id: 'video', label: 'Video' },
                  { id: 'script', label: 'Bot' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                        setCurrentTab(tab.id as any);
                        if (tab.id === 'app') setSelectedCategory('App Premium');
                        else setSelectedCategory('Semua');
                    }}
                    className={`text-[11px] font-bold uppercase tracking-widest transition-all ${currentTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => isOwnerLoggedIn ? setOwnerMode('dashboard') : setShowOwnerLogin(true)} className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-full transition-all group">
                  <Settings className={`w-4 h-4 ${isOwnerLoggedIn ? 'text-blue-600' : 'text-slate-400'} group-hover:rotate-90 transition-transform`} />
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden bg-white border-b border-slate-100 overflow-hidden shadow-lg">
                  <div className="p-6 flex flex-col gap-6">
                    {['home', 'produk', 'app', 'game', 'video', 'script'].map((tab) => (
                      <button key={tab} onClick={() => { setCurrentTab(tab as any); setSelectedCategory(tab === 'app' ? 'App Premium' : 'Semua'); setIsMenuOpen(false); }} className={`text-xl font-display font-black uppercase tracking-widest text-left ${currentTab === tab ? 'text-slate-900' : 'text-slate-400'}`}>{tab}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 mt-16 md:mt-20">
            <Suspense fallback={<ViewFallback />}>
              <AnimatePresence mode="wait">
                {(currentTab === 'home' || currentTab === 'produk' || currentTab === 'app') ? (
                  <motion.div key="market" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-24">
                    {currentTab === 'home' && <HeroSection />}
                    
                    <div id="products" className="max-w-7xl mx-auto px-4 md:px-6 mt-12 md:mt-16">
                      {/* Marketplace Filter */}
                      <div className="flex items-center gap-3 overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
                        {['Semua', 'Panel', 'Sewa Bot', 'Source Code', 'Reseller', 'App Premium'].map((cat) => (
                          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-800'}`}>{cat}</button>
                        ))}
                      </div>

                      {/* Product Grid - Efficient Render */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
                        {localCategories.flatMap(cat => cat.products)
                          .filter(p => {
                            if (selectedCategory === 'Semua') return true;
                            if (selectedCategory === 'Reseller') return p.category.includes('Reseller');
                            // Fix for 'Panel' mismatch with 'Panel Server'
                            if (selectedCategory === 'Panel') return p.category.includes('Panel');
                            return p.category === selectedCategory;
                          })
                          .map(product => <ProductCard key={product.id} product={product} onDetail={setSelectedProduct} />)}
                      </div>
                    </div>
                  </motion.div>
                ) : currentTab === 'game' ? (
                  <GameView key="game" />
                ) : currentTab === 'video' ? (
                  <VideoView key="video" videoData={VIDEO_DATA} />
                ) : (
                  <ScriptBotView key="script" product={localCategories.find(c => c.id === 'sc')?.products.find(p => p.id === 'sc1')} />
                )}
              </AnimatePresence>
            </Suspense>
          </div>

          {/* Persistent Clean Footer */}
          <footer className="bg-white border-t border-slate-100 py-16 px-6 relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left flex flex-col gap-2">
                <h4 className="font-display font-black text-slate-900 tracking-tight text-xl">SANZ OFFICIAL</h4>
                <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Premium Digital Solutions © 2026</p>
              </div>
              <div className="flex gap-6">
                <a href="#" className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"><MessageSquare className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"><Video className="w-5 h-5" /></a>
              </div>
            </div>
          </footer>
        </main>
      )}

      {/* Heavy Modals lazy loaded */}
      <Suspense fallback={null}>
        {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        
        <OwnerMenu 
          isOwnerLoggedIn={isOwnerLoggedIn}
          showOwnerLogin={showOwnerLogin}
          setShowOwnerLogin={setShowOwnerLogin}
          ownerPassword={ownerPassword}
          setOwnerPassword={setOwnerPassword}
          handleOwnerLogin={handleOwnerLogin}
          ownerMode={ownerMode}
          setOwnerMode={setOwnerMode}
          localCategories={localCategories}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          addProduct={addProduct}
          isSaving={isSaving}
          handleOwnerLogout={handleOwnerLogout}
        />
      </Suspense>
    </div>
  );
}
