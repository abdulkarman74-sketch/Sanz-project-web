import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { ArrowLeft, BarChart3, Cloud, Globe, ImageIcon, LayoutGrid, Loader, LogOut, MessageSquare, Package, Palette, Phone, Plus, Save, Settings, Trash2, Volume2, X, CheckCircle2, ChevronUp, ChevronDown, Eye, EyeOff, ArrowUpRight, Music, RefreshCw, FileArchive, ShieldCheck, History, Upload, AlertCircle } from 'lucide-react';
import { doc, setDoc, serverTimestamp, deleteDoc, collection, addDoc } from 'firebase/firestore';
import { db, firebaseReady } from '../../lib/firebase';
import { removeUndefinedDeep } from '../../utils/objectUtils';

import { Category, Product, SiteSettings, HeroSlide, DEFAULT_SITE_SETTINGS, GeneralSettings } from '../../constants';
import toast from 'react-hot-toast';
import { PRODUCT_TYPES, generateProductTemplate, getBadgeForType } from '../../utils/productUtils';
import AdminProductForm from './AdminProductForm';

interface AdminPanelProps {
  isAdminLoggedIn: boolean;
  adminMode: 'dashboard' | 'edit' | 'add' | null;
  setAdminMode: (mode: 'dashboard' | 'edit' | 'add' | null) => void;
  localCategories: Category[];
  editingProduct: {catId: string, product: Product} | null;
  setEditingProduct: (data: {catId: string, product: Product} | null) => void;
  updateProduct: (catId: string, product: Product) => void;
  deleteProduct: (catId: string, productId: string) => void;
  addProduct: (catId: string, product: Omit<Product, 'id'>) => void;
  isSaving: boolean;
  handleAdminLogout: () => void;
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: SiteSettings) => void;
  addCategory?: (cat: Omit<Category, 'products'>) => void;
  updateCategory?: (cat: Omit<Category, 'products'>) => void;
  deleteCategory?: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  adminMode,
  setAdminMode,
  localCategories,
  editingProduct,
  setEditingProduct,
  updateProduct,
  deleteProduct,
  addProduct,
  isSaving,
  handleAdminLogout,
  siteSettings,
  updateSiteSettings,
  addCategory,
  updateCategory,
  deleteCategory,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'products' | 'categories' | 'branding' | 'theme' | 'slides' | 'audio' | 'loading' | 'contact' | 'footer' | 'general'>('dashboard');
  const [formData, setFormData] = useState<any>(null);
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const [selectedInfoMode, setSelectedInfoMode] = useState<string>(siteSettings.general?.infoDisplayMode || 'runtime');

  // Update selectedInfoMode when siteSettings changes
  React.useEffect(() => {
    if (siteSettings.general?.infoDisplayMode) {
      setSelectedInfoMode(siteSettings.general?.infoDisplayMode);
    }
  }, [siteSettings.general?.infoDisplayMode]);

  // Category State for UI
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ title: '', id: '', description: '' });
  const [selectedLayoutId, setSelectedLayoutId] = useState(siteSettings.theme?.layoutId || 'vps-tech');

  const ensureFirebaseReady = () => {
    if (!firebaseReady || !db) {
      toast.error("Firebase belum disetting di setting.js");
      return false;
    }
    return true;
  };

  const handleUpdateBranding = (field: keyof SiteSettings['branding'], value: string) => {
    if (!ensureFirebaseReady()) return;
    updateSiteSettings({
      ...siteSettings,
      branding: { ...siteSettings.branding, [field]: value }
    });
  };

  const handleUpdateTheme = (field: keyof SiteSettings['theme'], value: string) => {
    if (!ensureFirebaseReady()) return;
    updateSiteSettings({
      ...siteSettings,
      theme: { ...siteSettings.theme, [field]: value }
    });
  };

  const handleUpdateAudio = (field: keyof SiteSettings['audio'], value: any) => {
    if (!ensureFirebaseReady()) return;
    updateSiteSettings({
      ...siteSettings,
      audio: { ...siteSettings.audio, [field]: value }
    });
  };

  const handleSaveInfoMode = async () => {
    if (!ensureFirebaseReady()) return;
    setIsSavingLocal(true);
    console.log("Saving info mode:", selectedInfoMode);
    
    try {
      const newSettings = {
        ...siteSettings,
        general: { 
          ...(siteSettings.general || DEFAULT_SITE_SETTINGS.general), 
          infoDisplayMode: selectedInfoMode as any 
        }
      };
      
      // Update local state first for immediate UI feedback
      updateSiteSettings(newSettings);
      
      // Persist to Firestore
      const settingsRef = doc(db, 'settings', 'general');
      const payload = removeUndefinedDeep({
        infoDisplayMode: selectedInfoMode,
        updatedAt: serverTimestamp()
      });
      await setDoc(settingsRef, payload, { merge: true });
      
      console.log("Info mode saved successfully");
      toast.success("Berhasil disimpan");
    } catch (error: any) {
      console.error("Error saving info mode:", error);
      toast.error("Gagal menyimpan pengaturan: " + error.message);
    } finally {
      setIsSavingLocal(false);
    }
  };

  const handleUpdateContact = (field: keyof SiteSettings['contact'], value: string) => {
    if (!ensureFirebaseReady()) return;
    updateSiteSettings({
      ...siteSettings,
      contact: { ...(siteSettings.contact || DEFAULT_SITE_SETTINGS.contact), [field]: value } as any
    });
  };

  const handleUpdateLoading = (field: keyof SiteSettings['loading'], value: string | boolean | number) => {
    if (!ensureFirebaseReady()) return;
    updateSiteSettings({
      ...siteSettings,
      loading: { ...(siteSettings.loading || DEFAULT_SITE_SETTINGS.loading), [field]: value } as any
    });
  };

  const handleUpdateFooter = (field: keyof SiteSettings['footer'], value: string) => {
    if (!ensureFirebaseReady()) return;
    updateSiteSettings({
      ...siteSettings,
      footer: { ...(siteSettings.footer || DEFAULT_SITE_SETTINGS.footer), [field]: value } as any
    });
  };

  const handleUpdateGeneral = (field: keyof SiteSettings['general'], value: string | boolean) => {
    if (!ensureFirebaseReady()) return;
    updateSiteSettings({
      ...siteSettings,
      general: { ...(siteSettings.general || DEFAULT_SITE_SETTINGS.general), [field]: value } as any
    });
  };

  const handleAddSlide = async () => {
    if (!ensureFirebaseReady()) return;
    setIsSavingLocal(true);
    try {
      const newSlide = removeUndefinedDeep({
        image: 'https://c.termai.cc/i146/BpC9uET.jpg',
        title: 'Slide Baru',
        desc: 'Deskripsi slide baru Anda di sini.',
        buttonText: 'Lihat Layanan',
        buttonTarget: 'products',
        enabled: true,
        order: siteSettings.heroSlides.length,
        createdAt: serverTimestamp()
      });
      const docRef = await addDoc(collection(db, 'slides'), newSlide);
      await setDoc(doc(db, 'slides', docRef.id), { id: docRef.id }, { merge: true });
      toast.success("Berhasil disimpan");
    } catch (err: any) {
      console.error("Error adding slide:", err);
      toast.error("Gagal menambah slide: " + err.message);
    } finally {
      setIsSavingLocal(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Hapus slide ini?')) return;
    if (!ensureFirebaseReady()) return;
    setIsSavingLocal(true);
    try {
      await deleteDoc(doc(db, 'slides', id));
      toast.success("Berhasil dihapus");
    } catch (err: any) {
      console.error("Error deleting slide:", err);
      toast.error("Gagal menghapus slide: " + err.message);
    } finally {
      setIsSavingLocal(false);
    }
  };

  const handleUpdateSlide = async (id: string, updates: Partial<HeroSlide>) => {
    if (!ensureFirebaseReady()) return;
    setIsSavingLocal(true);
    try {
      const payload = removeUndefinedDeep({
        ...updates,
        updatedAt: serverTimestamp()
      });
      await setDoc(doc(db, 'slides', id), payload, { merge: true });
      toast.success("Berhasil disimpan");
    } catch (err: any) {
      console.error("Error updating slide:", err);
      toast.error("Gagal menyimpan slide: " + err.message);
    } finally {
      setIsSavingLocal(false);
    }
  };

  const handleMoveSlide = async (id: string, direction: 'up' | 'down') => {
    const sortedSlides = [...siteSettings.heroSlides].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    const index = sortedSlides.findIndex(s => s.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sortedSlides.length) return;

    const otherSlide = sortedSlides[newIndex];
    
    if (!ensureFirebaseReady()) return;
    setIsSavingLocal(true);
    try {
      await Promise.all([
        setDoc(doc(db, 'slides', id), { order: newIndex, updatedAt: serverTimestamp() }, { merge: true }),
        setDoc(doc(db, 'slides', otherSlide.id), { order: index, updatedAt: serverTimestamp() }, { merge: true })
      ]);
    } catch (err) {
      console.error("Error moving slide:", err);
    } finally {
      setIsSavingLocal(false);
    }
  };

  React.useEffect(() => {
    if (editingProduct) {
      setFormData({ ...editingProduct.product });
    } else if (adminMode === 'add') {
      setFormData({
        name: '',
        price: '',
        description: '',
        category: localCategories[0]?.name || '',
        categoryId: localCategories[0]?.id || '',
        image: '',
        rating: 4.8,
        badge: ''
      });
    }
  }, [editingProduct, adminMode, localCategories]);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureFirebaseReady()) return;
    if (adminMode === 'edit' && editingProduct) {
      updateProduct(editingProduct.catId, formData);
    } else if (adminMode === 'add') {
      addProduct(formData.categoryId, formData);
    }
  };

  if (!adminMode) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-theme-bg overflow-hidden md:flex-row pointer-events-auto">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex flex-col w-72 bg-theme-card border-r border-theme-border p-6 gap-8 relative z-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-theme-surface border border-theme-border rounded-xl flex items-center justify-center">
             <Settings className="w-5 h-5 text-theme-accent animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-lg font-black text-theme-text tracking-tight">Admin Panel</h2>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-theme-muted uppercase tracking-widest font-bold">Single Management</p>
              {!firebaseReady && (
                <span className="bg-red-500/10 text-red-500 text-[8px] px-1.5 py-0.5 rounded border border-red-500/20 font-black uppercase tracking-widest">MODE LOKAL</span>
              )}
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto pr-2 no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'products', label: 'Produk', icon: Package },
            { id: 'categories', label: 'Kategori', icon: LayoutGrid },
            { id: 'slides', label: 'Banner Slider', icon: ImageIcon },
            { id: 'branding', label: 'Branding Website', icon: Globe },
            { id: 'loading', label: 'Loading Screen', icon: Loader },
            { id: 'contact', label: 'Kontak & Order', icon: Phone },
            { id: 'audio', label: 'Audio / Musik', icon: Volume2 },
            { id: 'theme', label: 'Tema Warna', icon: Palette },
            { id: 'footer', label: 'Footer Settings', icon: MessageSquare },
            { id: 'general', label: 'Pengaturan Umum', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveSubTab(tab.id as any); setAdminMode('dashboard'); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all pointer-events-auto cursor-pointer ${activeSubTab === tab.id && adminMode === 'dashboard' ? 'bg-theme-surface text-theme-accent border border-theme-accent/20' : 'text-theme-muted hover:text-theme-text hover:bg-theme-surface/30'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-theme-border">
          <button 
            type="button"
            onClick={handleAdminLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Keluar Panel
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-theme-bg pb-20 md:pb-0 relative z-10">
        {/* Header Mobile / Title */}
        <div className="p-6 md:p-10 border-b border-theme-border flex justify-between items-center bg-theme-card/50 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-theme-text tracking-tight">
               {adminMode === 'edit' ? 'Edit Produk' : adminMode === 'add' ? 'Tambah Produk' : 
                activeSubTab === 'dashboard' ? 'Ringkasan Sistem' :
                activeSubTab === 'products' ? 'Manajemen Produk' : 
                activeSubTab === 'categories' ? 'Kategori Produk' :
                activeSubTab === 'branding' ? 'Branding & Info' :
                activeSubTab === 'loading' ? 'Loading Screen' :
                activeSubTab === 'theme' ? 'Tema Warna' :
                activeSubTab === 'contact' ? 'Kontak & Order' :
                activeSubTab === 'audio' ? 'Audio / Musik' : 
                activeSubTab === 'footer' ? 'Footer Settings' :
                activeSubTab === 'general' ? 'Pengaturan Umum' : 'Banner Slider'}
            </h1>
            <p className="text-theme-muted text-xs md:text-sm mt-1">
               {adminMode !== 'dashboard' ? 'Harap isi data dengan benar' : 'Kelola elemen website Anda dalam satu tempat'}
            </p>
          </div>
          
          <button 
            onClick={() => setAdminMode(null)}
            className="p-3 bg-theme-surface border border-theme-border rounded-2xl text-theme-muted hover:text-theme-text transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
           <AnimatePresence mode="wait">
              {adminMode === 'dashboard' && activeSubTab === 'dashboard' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-theme-card border border-theme-border p-5 rounded-2xl shadow-sm hover:border-theme-accent/30 transition-all">
                        <p className="text-theme-muted text-[10px] uppercase tracking-[0.2em] font-black italic">Produk Store</p>
                        <p className="text-3xl font-black text-theme-text mt-1">{localCategories.flatMap(c => c.products).length}</p>
                      </div>
                      <div className="bg-theme-card border border-theme-border p-5 rounded-2xl shadow-sm hover:border-theme-accent/30 transition-all">
                        <p className="text-theme-muted text-[10px] uppercase tracking-[0.2em] font-black italic">Total Kategori</p>
                        <p className="text-3xl font-black text-theme-text mt-1">{localCategories.length}</p>
                      </div>
                      <div className="bg-theme-card border border-theme-border p-5 rounded-2xl shadow-sm hover:border-theme-accent/30 transition-all">
                        <p className="text-theme-muted text-[10px] uppercase tracking-[0.2em] font-black italic">Banner Promo</p>
                        <p className="text-3xl font-black text-theme-text mt-1">{siteSettings.heroSlides.length}</p>
                      </div>
                      <div className="bg-theme-card border border-theme-border p-5 rounded-2xl shadow-sm hover:border-theme-accent/30 transition-all relative overflow-hidden">
                        <p className="text-theme-muted text-[10px] uppercase tracking-[0.2em] font-black italic">Firebase Status</p>
                        <div className="flex items-center gap-2 mt-2">
                           <div className={`w-2 h-2 rounded-full ${firebaseReady ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                           <p className={`text-[10px] font-black uppercase tracking-widest ${firebaseReady ? 'text-green-500' : 'text-red-500'}`}>
                             {firebaseReady ? 'READY' : 'LOCAL'}
                           </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 px-1">
                       <LayoutGrid className="w-4 h-4 text-theme-accent" />
                       <h3 className="text-xs font-black text-theme-text uppercase tracking-[0.2em] italic">Quick Control Center</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-30">
                      <button type="button" onClick={() => setAdminMode('add')} className="p-6 bg-theme-surface border border-theme-border rounded-[2rem] text-left hover:border-theme-accent transition-all flex items-center justify-between group shadow-xl pointer-events-auto cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-theme-accent/10 rounded-2xl group-hover:bg-theme-accent transition-colors"><Plus className="w-5 h-5 text-theme-accent group-hover:text-slate-900" /></div>
                           <div>
                              <span className="font-black text-theme-text text-sm uppercase tracking-widest block">Produk Baru</span>
                              <span className="text-[9px] text-theme-muted font-bold uppercase italic">Tambah Item Jualan</span>
                           </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-theme-muted opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                      <button type="button" onClick={() => setActiveSubTab('categories')} className="p-6 bg-theme-surface border border-theme-border rounded-[2rem] text-left hover:border-theme-accent transition-all flex items-center justify-between group shadow-xl pointer-events-auto cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-theme-accent/10 rounded-2xl group-hover:bg-theme-accent transition-colors"><LayoutGrid className="w-5 h-5 text-theme-accent group-hover:text-slate-900" /></div>
                           <div>
                              <span className="font-black text-theme-text text-sm uppercase tracking-widest block">Kategori</span>
                              <span className="text-[9px] text-theme-muted font-bold uppercase italic">Kelola Kelompok</span>
                           </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-theme-muted opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                      <button type="button" onClick={() => setActiveSubTab('theme')} className="p-6 bg-theme-surface border border-theme-border rounded-[2rem] text-left hover:border-theme-accent transition-all flex items-center justify-between group shadow-xl pointer-events-auto cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-theme-accent/10 rounded-2xl group-hover:bg-theme-accent transition-colors"><Palette className="w-5 h-5 text-theme-accent group-hover:text-slate-900" /></div>
                           <div>
                              <span className="font-black text-theme-text text-sm uppercase tracking-widest block">Ganti Tema</span>
                              <span className="text-[9px] text-theme-muted font-bold uppercase italic">Visual Branding</span>
                           </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-theme-muted opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                    </div>

                    <div className="bg-theme-accent/5 border border-theme-accent/10 p-8 rounded-[2.5rem] mt-4 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                          <BarChart3 className="w-32 h-32 text-theme-accent" />
                       </div>
                       <h4 className="text-xl font-black text-theme-text uppercase tracking-widest relative z-10 italic">SYSTEM SECURITY PANEL</h4>
                       <p className="text-[10px] text-theme-muted font-bold uppercase tracking-[0.3em] mt-1 relative z-10">Integrity Check: PASSED</p>
                       <div className="flex gap-4 mt-8 relative z-10">
                          <div className="px-5 py-3 bg-theme-card/80 backdrop-blur-sm rounded-2xl border border-theme-border/50"><p className="text-[9px] font-black text-theme-muted uppercase tracking-[0.2em] mb-1">Database</p>
                              <p className={`text-xs font-black tracking-widest ${firebaseReady ? 'text-green-500' : 'text-amber-500'}`}>
                                 {firebaseReady ? 'SECURE' : 'OFFLINE'}
                              </p>
                           </div>
                          <div className="px-5 py-3 bg-theme-card/80 backdrop-blur-sm rounded-2xl border border-theme-border/50"><p className="text-[9px] font-black text-theme-muted uppercase tracking-[0.2em] mb-1">Network</p><p className="text-xs font-black text-green-400 tracking-widest">ACTIVE</p></div>
                          <div className="px-5 py-3 bg-theme-card/80 backdrop-blur-sm rounded-2xl border border-theme-border/50"><p className="text-[9px] font-black text-theme-muted uppercase tracking-[0.2em] mb-1">Performance</p><p className="text-xs font-black text-theme-accent tracking-widest">ULTRA-FAST</p></div>
                       </div>
                    </div>
                </motion.div>
             ) : adminMode === 'dashboard' && activeSubTab === 'products' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                   <div className="flex flex-wrap gap-4 justify-between items-center">
                       <div className="bg-theme-surface border border-theme-border px-4 py-2 rounded-xl text-xs font-bold text-theme-accent uppercase tracking-widest">
                         {localCategories.flatMap(c => c.products).length} Produk Aktif
                       </div>
                       <button 
                         type="button"
                         onClick={() => setAdminMode('add')}
                         className="flex items-center gap-2 bg-theme-accent text-slate-900 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                       >
                         <Plus className="w-4 h-4" /> Tambah Produk
                       </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {localCategories.flatMap(c => c.products).map(product => (
                         <div key={product.id} className="bg-theme-card border border-theme-border p-4 rounded-2xl flex items-center gap-4 group hover:border-theme-accent/50 transition-all">
                            <img src={product.image} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-theme-border" />
                            <div className="flex-1 min-w-0">
                               <h3 className="text-theme-text font-bold truncate">{product.name}</h3>
                               <p className="text-theme-accent font-black text-sm">Rp {product.price}</p>
                               <p className="text-[10px] text-theme-muted uppercase tracking-widest font-bold mt-1 line-clamp-1">{product.category}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                               <button 
                                 onClick={() => { setEditingProduct({catId: product.categoryId, product}); setAdminMode('edit'); }}
                                 className="p-2 bg-theme-surface rounded-lg text-theme-muted hover:text-theme-accent transition-colors"
                               >
                                 <Settings className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => deleteProduct(product.categoryId, product.id)}
                                 className="p-2 bg-theme-surface rounded-lg text-red-500/50 hover:text-red-500 transition-colors"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                       ))}
                   </div>
                </motion.div>
              ) : adminMode === 'dashboard' && activeSubTab === 'branding' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 px-1">
                             <Globe className="w-4 h-4 text-theme-accent" />
                             <h3 className="text-sm font-black text-theme-text uppercase tracking-[0.2em] italic">Identitas Utama</h3>
                          </div>
                          <div className="space-y-4 bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-xl">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Store Name</label>
                                <input 
                                  type="text" 
                                  className="admin-input font-black uppercase tracking-tight" 
                                  defaultValue={siteSettings.branding.siteName}
                                  onBlur={(e) => handleUpdateBranding('siteName', e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Short Name / Initials</label>
                                <input 
                                  type="text" 
                                  className="admin-input font-bold" 
                                  defaultValue={siteSettings.branding.shortName || ''}
                                  onBlur={(e) => handleUpdateBranding('shortName', e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Store Slogan</label>
                                <input 
                                  type="text" 
                                  className="admin-input font-bold italic" 
                                  defaultValue={siteSettings.branding.slogan}
                                  onBlur={(e) => handleUpdateBranding('slogan', e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Logo URL (PNG/SVG)</label>
                                <input 
                                  type="text" 
                                  className="admin-input font-mono text-sm" 
                                  defaultValue={siteSettings.branding.logoUrl}
                                  onBlur={(e) => handleUpdateBranding('logoUrl', e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Favicon URL (.ico/.png)</label>
                                <input 
                                  type="text" 
                                  className="admin-input font-mono text-sm" 
                                  defaultValue={siteSettings.branding.faviconUrl || ''}
                                  onBlur={(e) => handleUpdateBranding('faviconUrl', e.target.value)}
                                />
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 px-1">
                             <ImageIcon className="w-4 h-4 text-theme-accent" />
                             <h3 className="text-sm font-black text-theme-text uppercase tracking-[0.2em] italic">Aset & UI</h3>
                          </div>
                          <div className="space-y-4 bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-xl">
                             <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Badge Text</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-[11px]" 
                                    defaultValue={siteSettings.branding.badgeText || ''}
                                    onBlur={(e) => handleUpdateBranding('badgeText', e.target.value)}
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Hero Sub Title</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-[11px]" 
                                    defaultValue={siteSettings.branding.heroSubTitle || ''}
                                    onBlur={(e) => handleUpdateBranding('heroSubTitle', e.target.value)}
                                  />
                               </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Visual Theme Helper</label>
                                <div className="flex items-center gap-3 bg-theme-surface/30 p-3 rounded-xl border border-theme-border">
                                   <div className="w-8 h-8 rounded-full border border-white/20 shadow-lg" style={{ backgroundColor: siteSettings.theme.primaryColor || '#14b8a6' }}></div>
                                   <span className="text-[10px] font-black text-theme-text uppercase tracking-widest">Warna Utama Aktif</span>
                                </div>
                             </div>
                          </div>
                       </div>
                   </div>
                   <div className="bg-theme-surface/50 border border-theme-border p-4 rounded-xl flex items-center gap-3">
                      <Save className="w-5 h-5 text-theme-accent" />
                      <p className="text-theme-muted text-xs font-medium">Perubahan Branding disimpan otomatis.</p>
                   </div>
                </motion.div>
             ) : adminMode === 'dashboard' && activeSubTab === 'contact' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 px-1">
                             <Phone className="w-4 h-4 text-theme-accent" />
                             <h3 className="text-sm font-black text-theme-text uppercase tracking-[0.2em] italic">Media Sosial & WhatsApp</h3>
                          </div>
                          <div className="space-y-5 bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-xl">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">WhatsApp Utama (628...)</label>
                                <input 
                                  type="text" 
                                  className="admin-input font-black" 
                                  defaultValue={siteSettings.contact?.whatsapp || ''}
                                  onBlur={(e) => handleUpdateContact('whatsapp', e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Link Grup WhatsApp</label>
                                <input 
                                  type="text" 
                                  className="admin-input text-xs" 
                                  defaultValue={siteSettings.contact?.whatsappGroup || ''}
                                  onBlur={(e) => handleUpdateContact('whatsappGroup', e.target.value)}
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Link Telegram</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-[11px]" 
                                    defaultValue={siteSettings.contact?.telegram || ''}
                                    onBlur={(e) => handleUpdateContact('telegram', e.target.value)}
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Link Instagram</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-[11px]" 
                                    defaultValue={siteSettings.contact?.instagram || ''}
                                    onBlur={(e) => handleUpdateContact('instagram', e.target.value)}
                                  />
                               </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Email Kontak</label>
                                <input 
                                  type="text" 
                                  className="admin-input text-xs font-mono" 
                                  defaultValue={siteSettings.contact?.email || ''}
                                  onBlur={(e) => handleUpdateContact('email', e.target.value)}
                                />
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 px-1">
                             <MessageSquare className="w-4 h-4 text-theme-accent" />
                             <h3 className="text-sm font-black text-theme-text uppercase tracking-[0.2em] italic">Tombol & Pesan Otomatis</h3>
                          </div>
                          <div className="space-y-4 bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-xl">
                             <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Teks Tombol Beli</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-[11px] font-bold" 
                                    defaultValue={siteSettings.contact?.btnBuyText || 'BELI SEKARANG'}
                                    onBlur={(e) => handleUpdateContact('btnBuyText', e.target.value)}
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Teks Tombol Kontak</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-[11px] font-bold" 
                                    defaultValue={siteSettings.contact?.btnContactText || 'HUBUNGI ADMIN'}
                                    onBlur={(e) => handleUpdateContact('btnContactText', e.target.value)}
                                  />
                               </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Pesan Order WhatsApp</label>
                                <textarea 
                                  className="admin-input text-xs italic h-24" 
                                  defaultValue={siteSettings.contact?.orderMessage || ''}
                                  onBlur={(e) => handleUpdateContact('orderMessage', e.target.value)}
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Link QRIS (Opsional)</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-[10px] font-mono" 
                                    defaultValue={siteSettings.contact?.qrisUrl || ''}
                                    onBlur={(e) => handleUpdateContact('qrisUrl', e.target.value)}
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Link DANA (Opsional)</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-[10px] font-mono" 
                                    defaultValue={siteSettings.contact?.danaUrl || ''}
                                    onBlur={(e) => handleUpdateContact('danaUrl', e.target.value)}
                                  />
                               </div>
                             </div>
                          </div>
                       </div>
                   </div>
                </motion.div>
              ) : adminMode === 'dashboard' && activeSubTab === 'loading' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 px-1">
                             <Loader className="w-4 h-4 text-theme-accent" />
                             <h3 className="text-sm font-black text-theme-text uppercase tracking-[0.2em] italic">Konfigurasi Loader</h3>
                          </div>
                          <div className="space-y-4 bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-xl">
                              <div className="space-y-2 flex items-center justify-between bg-theme-surface/30 p-4 rounded-2xl border border-theme-border">
                                 <div>
                                    <label className="text-[10px] font-black text-theme-text uppercase tracking-widest block">Aktifkan Loading</label>
                                    <p className="text-[9px] text-theme-muted font-bold uppercase mt-1">Tampilkan layar saat web dimuat</p>
                                 </div>
                                 <input 
                                   type="checkbox" 
                                   className="w-6 h-6 accent-theme-accent cursor-pointer" 
                                   defaultChecked={siteSettings.loading?.enabled ?? true}
                                   onChange={(e) => handleUpdateLoading('enabled', e.target.checked)}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Loading Text (Main)</label>
                                 <input 
                                   type="text" 
                                   className="admin-input font-black uppercase" 
                                   defaultValue={siteSettings.loading?.mainText || ''}
                                   onBlur={(e) => handleUpdateLoading('mainText', e.target.value)}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Loading Description (Sub)</label>
                                 <input 
                                   type="text" 
                                   className="admin-input font-bold italic" 
                                   defaultValue={siteSettings.loading?.subText || ''}
                                   onBlur={(e) => handleUpdateLoading('subText', e.target.value)}
                                 />
                              </div>
                          </div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 px-1">
                             <Palette className="w-4 h-4 text-theme-accent" />
                             <h3 className="text-sm font-black text-theme-text uppercase tracking-[0.2em] italic">Visual Loader</h3>
                          </div>
                          <div className="space-y-4 bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-xl">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Logo URL (Loading)</label>
                                 <input 
                                   type="text" 
                                   className="admin-input font-mono text-[10px]" 
                                   defaultValue={siteSettings.loading?.logoUrl || ''}
                                   onBlur={(e) => handleUpdateLoading('logoUrl', e.target.value)}
                                 />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Min Duration (ms)</label>
                                   <input 
                                     type="number" 
                                     className="admin-input font-bold" 
                                     defaultValue={siteSettings.loading?.minDuration || 1500}
                                     onBlur={(e) => handleUpdateLoading('minDuration', parseInt(e.target.value))}
                                   />
                                </div>
                                <div className="space-y-2 flex flex-col justify-end">
                                   <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1 mb-1">Warna Teks</label>
                                   <div className="flex items-center gap-2">
                                      <input 
                                        type="color" 
                                        className="w-10 h-10 p-0 border-0 bg-transparent rounded-lg cursor-pointer" 
                                        defaultValue={siteSettings.loading?.textColor || '#ffffff'} 
                                        onBlur={(e) => handleUpdateLoading('textColor', e.target.value)} 
                                      />
                                      <span className="text-[10px] font-mono text-theme-text uppercase">{siteSettings.loading?.textColor || '#ffffff'}</span>
                                   </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Background Color</label>
                                 <div className="flex items-center gap-4 bg-theme-surface/30 p-3 rounded-2xl border border-theme-border">
                                    <input 
                                      type="color" 
                                      className="w-12 h-12 p-0 border-0 bg-transparent rounded-lg cursor-pointer" 
                                      defaultValue={siteSettings.loading?.bgColor || '#000000'} 
                                      onBlur={(e) => handleUpdateLoading('bgColor', e.target.value)} 
                                    />
                                    <div className="flex flex-col">
                                       <span className="text-xs font-black text-theme-text uppercase tracking-widest">{siteSettings.loading?.bgColor || '#000000'}</span>
                                       <span className="text-[9px] text-theme-muted font-bold uppercase">Background Screen</span>
                                    </div>
                                 </div>
                              </div>
                          </div>
                       </div>
                   </div>
                  </motion.div>
               ) : adminMode === 'dashboard' && activeSubTab === 'theme' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="flex flex-col gap-4">
                          <h3 className="text-sm font-bold text-theme-text uppercase tracking-widest italic">Kustom Tema Warna</h3>
                          <div className="space-y-4 bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-xl">
                              <div className="space-y-4">
                                {['primaryColor', 'backgroundColor', 'cardColor', 'textColor', 'surfaceColor', 'borderColor'].map((field) => (
                                  <div key={field} className="flex items-center justify-between bg-theme-surface/30 p-4 rounded-xl border border-theme-border">
                                     <label className="text-xs font-bold text-theme-text uppercase tracking-widest">{field.replace('Color', '')}</label>
                                     <input 
                                       type="color" 
                                       defaultValue={(siteSettings.theme as any)[field] || '#ffffff'} 
                                       onBlur={(e) => handleUpdateTheme(field as any, e.target.value)}
                                       className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                                     />
                                  </div>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  if (!ensureFirebaseReady()) return;
                                  updateSiteSettings({
                                    ...siteSettings,
                                    theme: {
                                      primaryColor: "#22d3ee",
                                      backgroundColor: "#050816",
                                      cardColor: "#0b1220",
                                      textColor: "#ffffff",
                                      surfaceColor: "#1f2937",
                                      mutedColor: "#9ca3af",
                                      accentSecColor: "#2dd4bf",
                                      borderColor: "#1f2937",
                                      footerColor: "#03050c"
                                    }
                                  });
                                }}
                                className="w-full bg-red-500/10 text-red-500 font-black py-4 rounded-2xl mt-4 uppercase tracking-[0.2em] text-[10px] hover:bg-red-500/20 transition-all border border-red-500/20"
                              >
                                RESET TEMA DEFAULT
                              </button>
                          </div>
                       </div>

                       <div className="flex flex-col gap-4">
                          <h3 className="text-sm font-bold text-theme-text uppercase tracking-widest italic">Preset Pilihan</h3>
                          <div className="grid grid-cols-1 gap-3">
                             {[
                               { name: 'Classic Blue', primary: '#22d3ee', bg: '#050816' },
                               { name: 'Neon Purple', primary: '#a855f7', bg: '#0f0720' },
                               { name: 'Cyber Mint', primary: '#14b8a6', bg: '#06100f' }
                             ].map((p) => (
                               <button
                                 key={p.name}
                                 type="button"
                                 onClick={() => {
                                   handleUpdateTheme('primaryColor', p.primary);
                                   handleUpdateTheme('backgroundColor', p.bg);
                                 }}
                                 className="p-5 bg-theme-card border border-theme-border rounded-2xl text-left hover:border-theme-accent transition-all group flex items-center justify-between"
                               >
                                 <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: p.primary }} />
                                    <span className="font-bold text-theme-text uppercase tracking-widest text-xs">{p.name}</span>
                                 </div>
                                 <div className="w-8 h-4 rounded-full border border-white/10" style={{ backgroundColor: p.bg }} />
                               </button>
                             ))}
                          </div>
                       </div>
                   </div>
                </motion.div>
              ) : adminMode === 'dashboard' && activeSubTab === 'audio' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="flex flex-col gap-4">
                          <h3 className="text-sm font-bold text-theme-text uppercase tracking-widest">Pengaturan Audio</h3>
                          <div className="space-y-4 bg-theme-card border border-theme-border p-6 rounded-2xl">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-theme-muted uppercase tracking-widest pl-1">URL Audio Mp3</label>
                                 <input 
                                   type="text" 
                                   className="admin-input" 
                                   defaultValue={siteSettings.audio.url}
                                   onBlur={(e) => handleUpdateAudio('url', e.target.value)}
                                 />
                              </div>
                              <div className="space-y-2 flex items-center justify-between">
                                 <label className="text-[10px] font-bold text-theme-muted uppercase tracking-widest pl-1">Autoplay</label>
                                 <input 
                                   type="checkbox" 
                                   className="w-5 h-5 accent-theme-accent" 
                                   defaultChecked={siteSettings.audio.autoplay}
                                   onChange={(e) => handleUpdateAudio('autoplay', e.target.checked)}
                                 />
                              </div>
                              <div className="space-y-2 flex items-center justify-between">
                                 <label className="text-[10px] font-bold text-theme-muted uppercase tracking-widest pl-1">Looping</label>
                                 <input 
                                   type="checkbox" 
                                   className="w-5 h-5 accent-theme-accent" 
                                   defaultChecked={siteSettings.audio.loop}
                                   onChange={(e) => handleUpdateAudio('loop', e.target.checked)}
                                 />
                              </div>
                              <div className="space-y-2 flex items-center justify-between">
                                 <label className="text-[10px] font-bold text-theme-muted uppercase tracking-widest pl-1">Tampilkan Tombol Mute</label>
                                 <input 
                                   type="checkbox" 
                                   className="w-5 h-5 accent-theme-accent" 
                                   defaultChecked={siteSettings.audio.showButton}
                                   onChange={(e) => handleUpdateAudio('showButton', e.target.checked)}
                                 />
                              </div>
                          </div>
                       </div>
                   </div>
                </motion.div>
              ) : adminMode === 'dashboard' && activeSubTab === 'slides' ? (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                    <div className="flex justify-between items-center mb-2">
                       <div>
                          <p className="text-theme-muted text-xs font-bold uppercase tracking-widest">Banner Utama</p>
                          <p className="text-[10px] text-theme-muted mt-1 italic">Slide Enabled: {siteSettings.heroSlides.filter(s => s.enabled).length}</p>
                       </div>
                       <button 
                         onClick={handleAddSlide}
                         disabled={isSavingLocal}
                         className="flex items-center gap-2 bg-theme-accent text-slate-900 px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all disabled:opacity-50"
                       >
                         <Plus className="w-4 h-4" /> Tambah Slide
                       </button>
                    </div>

                    <div className="flex flex-col gap-6">
                       {siteSettings.heroSlides.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((slide, idx, arr) => (
                         <div key={slide.id} className="bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-xl flex flex-col lg:flex-row">
                            {/* Preview */}
                            <div className="lg:w-72 shrink-0 relative aspect-video lg:aspect-auto bg-theme-surface border-b lg:border-b-0 lg:border-r border-theme-border group">
                               <img src={slide.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <ImageIcon className="w-10 h-10 text-theme-accent opacity-20" />
                               </div>
                               <div className="absolute top-3 left-3 bg-theme-bg/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg text-[10px] font-black text-theme-text uppercase tracking-widest">
                                  Slide #{idx + 1}
                               </div>
                            </div>

                            {/* Form */}
                            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-theme-muted uppercase tracking-widest pl-1">Image URL</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-xs" 
                                    defaultValue={slide.image}
                                    onBlur={(e) => handleUpdateSlide(slide.id, { image: e.target.value })}
                                  />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-theme-muted uppercase tracking-widest pl-1">Slide Title</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-xs" 
                                    defaultValue={slide.title}
                                    onBlur={(e) => handleUpdateSlide(slide.id, { title: e.target.value })}
                                  />
                               </div>
                               <div className="space-y-1 md:col-span-2">
                                  <label className="text-[9px] font-bold text-theme-muted uppercase tracking-widest pl-1">Description</label>
                                  <textarea 
                                    className="admin-input text-xs h-16 py-2" 
                                    defaultValue={slide.desc}
                                    onBlur={(e) => handleUpdateSlide(slide.id, { desc: e.target.value })}
                                  />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-theme-muted uppercase tracking-widest pl-1">Button Text</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-xs" 
                                    defaultValue={slide.buttonText}
                                    onBlur={(e) => handleUpdateSlide(slide.id, { buttonText: e.target.value })}
                                  />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-theme-muted uppercase tracking-widest pl-1">Button Target (ID)</label>
                                  <input 
                                    type="text" 
                                    className="admin-input text-xs font-mono" 
                                    defaultValue={slide.buttonTarget}
                                    onBlur={(e) => handleUpdateSlide(slide.id, { buttonTarget: e.target.value })}
                                  />
                               </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 bg-theme-surface/30 border-t lg:border-t-0 lg:border-l border-theme-border flex lg:flex-col items-center justify-between gap-4 shrink-0">
                               <div className="flex lg:flex-col gap-2">
                                  <button 
                                    onClick={() => handleMoveSlide(slide.id, 'up')}
                                    disabled={idx === 0 || isSavingLocal}
                                    className="p-2.5 bg-theme-surface hover:bg-theme-border rounded-xl text-theme-text disabled:opacity-20 transition-all border border-theme-border shadow-sm"
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleMoveSlide(slide.id, 'down')}
                                    disabled={idx === arr.length - 1 || isSavingLocal}
                                    className="p-2.5 bg-theme-surface hover:bg-theme-border rounded-xl text-theme-text disabled:opacity-20 transition-all border border-theme-border shadow-sm"
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </button>
                               </div>

                               <div className="flex lg:flex-col gap-2">
                                  <button 
                                    onClick={() => handleUpdateSlide(slide.id, { enabled: !slide.enabled })}
                                    className={`p-2.5 rounded-xl transition-all border shadow-sm ${slide.enabled ? 'bg-theme-accent/20 border-theme-accent/50 text-theme-accent' : 'bg-theme-card border-theme-border text-theme-muted'}`}
                                  >
                                    {slide.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteSlide(slide.id)}
                                    disabled={isSavingLocal}
                                    className="p-2.5 bg-theme-surface hover:bg-red-500/10 rounded-xl text-red-500/50 hover:text-red-500 transition-all border border-theme-border hover:border-red-500/30 shadow-sm"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>

                    {isSavingLocal && (
                       <div className="fixed bottom-10 right-10 z-[110] bg-theme-accent text-slate-900 px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl">
                          <Loader className="w-4 h-4 animate-spin" /> Menyimpan Perubahan...
                       </div>
                    )}
                 </motion.div>
             ) : adminMode === 'dashboard' && activeSubTab === 'categories' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                    <div className="flex justify-between items-center bg-theme-surface/30 p-4 rounded-xl border border-theme-border">
                       <h3 className="text-[10px] font-bold text-theme-muted uppercase tracking-widest pl-1 italic">Kategori Produk</h3>
                       <button onClick={() => setIsAddingCategory(true)} className="flex items-center gap-2 bg-theme-accent text-slate-900 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-glow hover:scale-105 transition-transform">
                          <Plus className="w-4 h-4" /> Tambah Kategori
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {localCategories.map(cat => (
                         <div key={cat.id} className="bg-theme-card border border-theme-border p-5 rounded-2xl group flex flex-col justify-between hover:border-theme-accent/50 transition-all">
                            <div>
                               <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-theme-text uppercase tracking-widest text-sm">{cat.title}</h4>
                                  <span className="text-[9px] font-bold text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded border border-theme-accent/20 uppercase tracking-[0.1em]">ACTIVE</span>
                               </div>
                               <p className="text-[10px] text-theme-muted mt-2 line-clamp-2 leading-relaxed italic opacity-80">{cat.description || 'Tidak ada deskripsi.'}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-theme-border/30">
                               <p className="mr-auto text-[9px] font-bold text-theme-muted uppercase tracking-widest">{cat.products?.length || 0} ITEMS</p>
                               <button 
                                 onClick={() => {
                                   console.log("Edit kategori clicked", cat);
                                   setEditingCategory(cat);
                                   setCategoryForm({ title: cat.title, id: cat.id, description: cat.description || '' });
                                   setIsAddingCategory(true);
                                 }}
                                 className="p-2 bg-theme-surface rounded-lg text-theme-muted hover:text-theme-accent transition-all cursor-pointer pointer-events-auto"
                               >
                                 <Settings className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => {
                                   if(confirm(`Yakin hapus kategori ${cat.title}? Produk di dalamnya mungkin tidak akan muncul lagi.`)) {
                                     deleteCategory?.(cat.id);
                                   }
                                 }}
                                 className="p-2 bg-theme-surface rounded-lg text-red-500/50 hover:text-red-500 transition-all"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>

                    {isAddingCategory && (
                       <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-theme-bg/95 backdrop-blur-md">
                          <div className="bg-theme-card border border-theme-border p-8 rounded-3xl w-full max-w-md shadow-2xl shadow-theme-accent/20 relative">
                             <div className="flex justify-between items-center mb-6">
                                <div>
                                   <h3 className="text-xl font-bold text-theme-text uppercase tracking-widest">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                                   <p className="text-[10px] text-theme-muted font-bold uppercase tracking-widest mt-1">{editingCategory ? 'Perbarui Data Kategori' : 'Kategori Produk Baru'}</p>
                                </div>
                                <button onClick={() => { setIsAddingCategory(false); setEditingCategory(null); setCategoryForm({ title: '', id: '', description: '' }); }} className="p-2 bg-theme-surface rounded-xl border border-theme-border text-theme-muted hover:text-theme-text"><X className="w-5 h-5" /></button>
                             </div>
                             <div className="space-y-4 text-left">
                                <div className="space-y-1.5">
                                   <label className="text-[10px] font-bold text-theme-muted uppercase tracking-widest pl-1">Nama Kategori</label>
                                   <input 
                                     type="text" 
                                     className="admin-input font-bold" 
                                     placeholder="Misal: PANEL VVIP" 
                                     value={categoryForm.title}
                                     onChange={(e) => setCategoryForm({...categoryForm, title: e.target.value})}
                                   />
                                </div>
                                <div className="space-y-1.5">
                                   <label className="text-[10px] font-bold text-theme-muted uppercase tracking-widest pl-1">ID Unik (Lowercase)</label>
                                   <input 
                                     type="text" 
                                     className={`admin-input font-mono text-sm ${editingCategory ? 'opacity-50 cursor-not-allowed' : ''}`}
                                     placeholder="panel-vvip" 
                                     value={categoryForm.id}
                                     readOnly={!!editingCategory}
                                     onChange={(e) => !editingCategory && setCategoryForm({...categoryForm, id: e.target.value})}
                                   />
                                   {editingCategory && <p className="text-[9px] text-theme-muted font-bold mt-1">ID tidak bisa diubah.</p>}
                                </div>
                                <div className="space-y-1.5">
                                   <label className="text-[10px] font-bold text-theme-muted uppercase tracking-widest pl-1">Deskripsi Singkat</label>
                                   <textarea 
                                     className="admin-input h-24 py-3 leading-relaxed" 
                                     placeholder="Jelaskan apa yang dijual di sini..." 
                                     value={categoryForm.description}
                                     onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                                   />
                                </div>
                                <button 
                                  onClick={() => {
                                    if(categoryForm.title && categoryForm.id) {
                                      if (editingCategory && updateCategory) {
                                        console.log("Saving category update", categoryForm);
                                        updateCategory({ title: categoryForm.title, id: categoryForm.id, description: categoryForm.description || '' });
                                      } else if (addCategory) {
                                        console.log("Adding new category", categoryForm);
                                        addCategory({ title: categoryForm.title, id: categoryForm.id, description: categoryForm.description || '' });
                                      }
                                      setIsAddingCategory(false);
                                      setEditingCategory(null);
                                      setCategoryForm({ title: '', id: '', description: '' });
                                    } else {
                                      toast.error("Mohon isi nama dan ID kategori!");
                                    }
                                  }}
                                  className="w-full bg-theme-accent text-slate-900 font-bold py-4 rounded-xl mt-4 uppercase tracking-[0.2em] text-xs shadow-glow cursor-pointer pointer-events-auto relative z-50"
                                >
                                  {editingCategory ? 'SIMPAN PERUBAHAN' : 'SIMPAN KATEGORI'}
                                </button>
                             </div>
                          </div>
                       </div>
                    )}
                 </motion.div>
              ) : adminMode === 'dashboard' && activeSubTab === 'audio' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 px-1">
                             <Music className="w-4 h-4 text-theme-accent" />
                             <h3 className="text-sm font-black text-theme-text uppercase tracking-[0.2em] italic">Background Music</h3>
                          </div>
                          <div className="space-y-4 bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-xl">
                             <div className="space-y-2 flex items-center justify-between bg-theme-surface/30 p-4 rounded-2xl border border-theme-border">
                                <div>
                                   <label className="text-[10px] font-black text-theme-text uppercase tracking-widest block">Auto Play Audio</label>
                                   <p className="text-[9px] text-theme-muted font-bold uppercase mt-1">Gunakan interaksi pertama user</p>
                                </div>
                                <input 
                                  type="checkbox" 
                                  className="w-6 h-6 accent-theme-accent cursor-pointer" 
                                  defaultChecked={siteSettings.audio?.autoplay ?? false}
                                  onChange={(e) => handleUpdateAudio?.('autoplay', e.target.checked)}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Link Audio File (MP3)</label>
                                <input 
                                  type="text" 
                                  className="admin-input font-mono text-sm" 
                                  defaultValue={siteSettings.audio?.url || ''}
                                  onBlur={(e) => handleUpdateAudio?.('url', e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Volume (0 - 1)</label>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="1" 
                                  step="0.1" 
                                  className="w-full h-2 bg-theme-surface rounded-lg appearance-none cursor-pointer accent-theme-accent" 
                                  defaultValue={siteSettings.audio?.volume ?? 0.5}
                                  onChange={(e) => handleUpdateAudio?.('volume', parseFloat(e.target.value))}
                                />
                                <div className="flex justify-between text-[10px] font-bold text-theme-muted uppercase tracking-widest px-1">
                                   <span>Mute</span>
                                   <span>50%</span>
                                   <span>Max</span>
                                </div>
                             </div>
                          </div>
                       </div>
                   </div>
                </motion.div>
              ) : adminMode === 'dashboard' && activeSubTab === 'footer' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 px-1">
                             <Globe className="w-4 h-4 text-theme-accent" />
                             <h3 className="text-sm font-black text-theme-text uppercase tracking-[0.2em] italic">Footer Appearance</h3>
                          </div>
                          <div className="space-y-4 bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-xl">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Footer Text / Deskripsi</label>
                                <textarea 
                                  className="admin-input text-xs h-24" 
                                  defaultValue={siteSettings.branding.footerText || ''}
                                  onBlur={(e) => handleUpdateBranding('footerText', e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] pl-1">Copyright Text</label>
                                <input 
                                  type="text" 
                                  className="admin-input text-sm" 
                                  defaultValue={siteSettings.branding.copyright || ''}
                                  onBlur={(e) => handleUpdateBranding('copyright', e.target.value)}
                                />
                             </div>
                             <div className="space-y-2 flex items-center justify-between bg-theme-surface/30 p-4 rounded-xl border border-theme-border">
                                <label className="text-[10px] font-black text-theme-text uppercase tracking-widest">Tampilkan Running Text</label>
                                <input 
                                  type="checkbox" 
                                  className="w-5 h-5 accent-theme-accent cursor-pointer" 
                                  defaultChecked={siteSettings.general?.showRunningText ?? true}
                                  onChange={(e) => handleUpdateGeneral?.('showRunningText', e.target.checked)}
                                />
                             </div>
                          </div>
                       </div>
                   </div>
                </motion.div>
              ) : adminMode === 'dashboard' && activeSubTab === 'colorPresets' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
                   <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-bold text-theme-text uppercase tracking-widest italic">Pilihan Warna Preset</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            id: "blue-tech",
                            name: "Blue Tech",
                            primary: "#2563eb",
                            secondary: "#38bdf8",
                            background: "#0b1220",
                            card: "#111827",
                            text: "#ffffff",
                            surface: "#1e293b",
                            muted: "#94a3b8",
                            border: "#1f2937",
                            footer: "#0f172a"
                          },
                          {
                            id: "purple-neon",
                            name: "Purple Neon",
                            primary: "#a855f7",
                            secondary: "#d946ef",
                            background: "#0a0612",
                            card: "#140c24",
                            text: "#ffffff",
                            surface: "#1f123d",
                            muted: "#a78bfa",
                            border: "#2e1a5a",
                            footer: "#0d0918"
                          },
                          {
                            id: "green-cyber",
                            name: "Green Cyber",
                            primary: "#10b981",
                            secondary: "#34d399",
                            background: "#02120b",
                            card: "#062416",
                            text: "#ffffff",
                            surface: "#043321",
                            muted: "#6ee7b7",
                            border: "#064e3b",
                            footer: "#03170e"
                          },
                          {
                            id: "orange-sunset",
                            name: "Orange Sunset",
                            primary: "#f97316",
                            secondary: "#fb923c",
                            background: "#180a02",
                            card: "#2c1304",
                            text: "#ffffff",
                            surface: "#431c05",
                            muted: "#fdba74",
                            border: "#7c2d12",
                            footer: "#200e03"
                          },
                          {
                            id: "pink-soft",
                            name: "Pink Soft",
                            primary: "#ec4899",
                            secondary: "#f472b6",
                            background: "#1a0b12",
                            card: "#2e1420",
                            text: "#ffffff",
                            surface: "#461e31",
                            muted: "#fbcfe8",
                            border: "#831843",
                            footer: "#220e18"
                          },
                          {
                            id: "dark-elegant",
                            name: "Dark Elegant",
                            primary: "#ffffff",
                            secondary: "#e2e8f0",
                            background: "#000000",
                            card: "#0f0f0f",
                            text: "#ffffff",
                            surface: "#1a1a1a",
                            muted: "#94a3b8",
                            border: "#262626",
                            footer: "#0a0a0a"
                          }
                        ].map((c) => {
                          const isActive = siteSettings.theme.primaryColor === c.primary && siteSettings.theme.backgroundColor === c.background;
                          return (
                            <button
                              key={c.id}
                              onClick={() => {
                                if (!ensureFirebaseReady()) return;
                                updateSiteSettings({ 
                                  ...siteSettings, 
                                  theme: {
                                    primaryColor: c.primary,
                                    backgroundColor: c.background,
                                    cardColor: c.card,
                                    textColor: c.text,
                                    surfaceColor: c.surface,
                                    mutedColor: c.muted,
                                    accentSecColor: c.secondary,
                                    borderColor: c.border,
                                    footerColor: c.footer
                                  }
                                });
                              }}
                              className={`p-4 rounded-2xl border text-left transition-all pointer-events-auto cursor-pointer flex flex-col gap-2 ${isActive ? 'bg-theme-accent/10 border-theme-accent shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-theme-card border-theme-border hover:bg-theme-surface/30'}`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <p className={`font-black text-sm uppercase tracking-tighter ${isActive ? 'text-theme-accent' : 'text-theme-text'}`}>{c.name}</p>
                                {isActive && <div className="p-1 rounded-full bg-theme-accent"></div>}
                              </div>
                              <div className="flex gap-2 w-full mt-2">
                                 <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: c.background }}></div>
                                 <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: c.card }}></div>
                                 <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: c.primary }}></div>
                                 <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: c.secondary }}></div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                   </div>
                </motion.div>
              ) : adminMode === 'dashboard' && activeSubTab === 'general' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                   <div className="bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-2xl">
                      <div className="flex items-center gap-3 mb-8">
                         <Settings className="w-6 h-6 text-theme-accent" />
                         <h3 className="text-xl font-bold text-theme-text uppercase tracking-[0.2em] italic">Main Controller</h3>
                      </div>
                      <div className="space-y-4">
                         {[
                           { label: 'Cloud Optimizer', sub: 'Cache resources and lazy load system', key: 'cloudOptimizer' as keyof GeneralSettings, active: siteSettings.general?.cloudOptimizer ?? true },
                           { label: 'Floating Cart WA', sub: 'Enable floating WhatsApp action button', key: 'floatingCart' as keyof GeneralSettings, active: siteSettings.general?.floatingCart ?? true },
                           { label: 'System Recovery', sub: 'Auto fix configuration on mismatch', key: 'systemRecovery' as keyof GeneralSettings, active: siteSettings.general?.systemRecovery ?? false },
                           { label: 'Deep Analytics', sub: 'Collect real-time engagement data', key: 'analytics' as keyof GeneralSettings, active: siteSettings.general?.analytics ?? true },
                           { label: 'Developer Mode', sub: 'Display layout debugging info', key: 'devMode' as keyof GeneralSettings, active: siteSettings.general?.devMode ?? false }
                         ].map((s, i) => (
                           <div key={i} className="flex items-center justify-between p-5 bg-theme-surface/50 rounded-[2rem] border border-theme-border/30 hover:border-theme-accent/50 transition-all">
                              <div>
                                 <p className="font-black text-sm text-theme-text uppercase tracking-widest">{s.label}</p>
                                 <p className="text-[9px] text-theme-muted uppercase tracking-widest font-black mt-1 opacity-60">{s.sub}</p>
                              </div>
                              <button 
                                type="button" onClick={(e) => { e.stopPropagation(); handleUpdateGeneral?.(s.key as any, !s.active); }}
                                className={`w-14 h-7 rounded-full transition-all relative cursor-pointer pointer-events-auto ${s.active ? 'bg-theme-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-theme-surface'}`}
                              >
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${s.active ? 'left-8' : 'left-1'}`} />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-2xl mt-8 relative z-20">
                      <div className="flex items-center gap-3 mb-8">
                         <LayoutGrid className="w-6 h-6 text-theme-accent" />
                         <h3 className="text-xl font-bold text-theme-text uppercase tracking-[0.2em] italic">Tampilan Informasi Homepage</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {[
                           { id: 'runtime', label: 'Runtime VPS', icon: Cloud },
                           { id: 'datetime', label: 'Jam & Tanggal', icon: History },
                           { id: 'both', label: 'Runtime + Jam & Tanggal', icon: LayoutGrid },
                           { id: 'hidden', label: 'Sembunyikan', icon: EyeOff }
                         ].map((mode) => (
                           <button
                             key={mode.id}
                             type="button"
                             onClick={(e) => {
                               e.stopPropagation();
                               console.log("info mode clicked:", mode.id);
                               setSelectedInfoMode(mode.id);
                             }}
                             className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all text-left relative z-10 cursor-pointer pointer-events-auto ${selectedInfoMode === mode.id ? 'bg-theme-accent border-theme-accent text-slate-900 shadow-lg scale-[1.02]' : 'bg-theme-surface/50 border-theme-border/30 text-theme-text hover:border-theme-accent/50'}`}
                           >
                             <div className={`p-3 rounded-2xl ${selectedInfoMode === mode.id ? 'bg-slate-900/10' : 'bg-theme-surface'}`}>
                               <mode.icon className="w-6 h-6" />
                             </div>
                             <div>
                               <p className="font-black text-sm uppercase tracking-widest">{mode.label}</p>
                               <p className={`text-[9px] uppercase tracking-widest font-black mt-1 opacity-60 ${selectedInfoMode === mode.id ? 'text-slate-900' : 'text-theme-muted'}`}>
                                 {mode.id === 'runtime' ? 'Hanya tampilkan masa aktif server' : 
                                  mode.id === 'datetime' ? 'Hanya tampilkan Jam WIB & Kalender' :
                                  mode.id === 'both' ? 'Tampilkan keduanya sekaligus' : 'Sembunyikan semua informasi'}
                               </p>
                             </div>
                           </button>
                         ))}
                      </div>

                      <div className="mt-8 pt-6 border-t border-theme-border flex justify-end relative z-10">
                         <button
                           type="button" onClick={(e) => { e.stopPropagation(); handleSaveInfoMode(); }}
                           disabled={isSavingLocal}
                           className="flex items-center gap-3 px-10 py-5 bg-theme-accent text-slate-900 font-extrabold uppercase text-sm tracking-[0.2em] rounded-3xl shadow-xl hover:shadow-theme-accent/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer pointer-events-auto disabled:opacity-50"
                         >
                           {isSavingLocal ? (
                             <Loader className="w-5 h-5 animate-spin" />
                           ) : (
                             <Save className="w-5 h-5" />
                           )}
                           Simpan Pengaturan
                         </button>
                      </div>
                   </div>
                </motion.div>
              ) : (adminMode === 'edit' || adminMode === 'add') ? (
                <AdminProductForm
                  initialData={formData}
                  categories={localCategories}
                  isSaving={isSaving}
                  onSave={(data) => {
                    setFormData(data);
                    if (adminMode === 'edit' && editingProduct) {
                      updateProduct(editingProduct.catId, data);
                    } else if (adminMode === 'add') {
                      addProduct(data.categoryId, data);
                    }
                  }}
                  onCancel={() => { setAdminMode('dashboard'); setEditingProduct(null); }}
                />
             ) : (
                <div className="py-20 text-center text-theme-muted bg-theme-surface/30 border border-dashed border-theme-border rounded-3xl">
                   <p className="font-bold uppercase tracking-widest text-xs">Modul Sedang Dikembangkan</p>
                   <p className="text-[10px] mt-2">Gunakan modul Produk & Info Toko untuk saat ini.</p>
                </div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Floating Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-theme-card border-t border-theme-border flex items-center justify-around px-2 z-[60] backdrop-blur-xl shrink-0 pointer-events-auto">
         <button type="button" onClick={() => { setActiveSubTab('products'); setAdminMode('dashboard'); }} className={`flex flex-col items-center gap-1 cursor-pointer pointer-events-auto ${activeSubTab === 'products' ? 'text-theme-accent' : 'text-theme-muted'}`}>
            <Package className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[8px] font-black uppercase tracking-widest">Produk</span>
         </button>
         <button type="button" onClick={() => { setActiveSubTab('categories'); setAdminMode('dashboard'); }} className={`flex flex-col items-center gap-1 cursor-pointer pointer-events-auto ${activeSubTab === 'categories' ? 'text-theme-accent' : 'text-theme-muted'}`}>
            <LayoutGrid className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[8px] font-black uppercase tracking-widest">Kat</span>
         </button>
         <button type="button" onClick={() => { setActiveSubTab('theme'); setAdminMode('dashboard'); }} className={`flex flex-col items-center gap-1 cursor-pointer pointer-events-auto ${activeSubTab === 'theme' ? 'text-theme-accent' : 'text-theme-muted'}`}>
            <Palette className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[8px] font-black uppercase tracking-widest">Tema</span>
         </button>
         <button type="button" onClick={() => { setActiveSubTab('general'); setAdminMode('dashboard'); }} className={`flex flex-col items-center gap-1 cursor-pointer pointer-events-auto ${activeSubTab === 'general' ? 'text-theme-accent' : 'text-theme-muted'}`}>
            <Settings className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[8px] font-black uppercase tracking-widest">Config</span>
         </button>
         <button type="button" onClick={handleAdminLogout} className="flex flex-col items-center gap-1 text-red-500 cursor-pointer pointer-events-auto">
            <LogOut className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[8px] font-black uppercase tracking-widest">Out</span>
         </button>
      </div>
    </div>
  );
};

export default AdminPanel;
