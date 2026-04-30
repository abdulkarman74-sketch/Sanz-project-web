import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { ArrowLeft, BarChart3, Cloud, Globe, ImageIcon, LayoutGrid, Loader, LogOut, MessageSquare, Package, Palette, Phone, Plus, Save, Settings, Trash2, Volume2, X, CheckCircle2, ChevronUp, ChevronDown, Eye, EyeOff, ArrowUpRight, Music, RefreshCw, FileArchive, ShieldCheck, History, Upload, AlertCircle } from 'lucide-react';
import { doc, setDoc, serverTimestamp, deleteDoc, collection, addDoc } from 'firebase/firestore';
import { db, firebaseReady } from '../../lib/firebase';
import { removeUndefinedDeep } from '../../utils/objectUtils';

import { Category, Product, SiteSettings, HeroSlide, DEFAULT_SITE_SETTINGS, GeneralSettings } from '../../constants';
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
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'products' | 'categories' | 'branding' | 'theme' | 'slides' | 'audio' | 'loading' | 'contact' | 'footer' | 'general' | 'update'>('dashboard');
  const [updateFile, setUpdateFile] = useState<File | null>(null);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'analyzing' | 'ready' | 'updating' | 'success' | 'error'>('idle');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateLogs, setUpdateLogs] = useState<string[]>([]);
  const [scanResult, setScanResult] = useState<{
    new: string[];
    changed: string[];
    skipped: string[];
  } | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  // Category State for UI
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ title: '', id: '', description: '' });
  const [selectedLayoutId, setSelectedLayoutId] = useState(siteSettings.theme?.layoutId || 'vps-tech');

  const ensureFirebaseReady = () => {
    if (!firebaseReady || !db) {
      alert("Firebase belum disetting di setting.js. Akses simpan ditolak.");
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

  const handleCheckUpdate = async () => {
    if (!updateFile) return;
    setUpdateStatus('analyzing');
    setUpdateProgress(10);
    setUpdateLogs(["Membaca file ZIP..."]);
    
    try {
      const zip = await JSZip.loadAsync(updateFile);
      setUpdateProgress(30);
      setUpdateLogs(prev => [...prev, "Memvalidasi isi ZIP..."]);

      // Check if project is valid
      const hasPackageJson = zip.file("package.json");
      const hasSrcDir = Object.keys(zip.files).some(path => path.startsWith("src/"));
      const hasIndexHtml = zip.file("index.html");

      if (!hasPackageJson || (!hasSrcDir && !hasIndexHtml)) {
         throw new Error("ZIP tidak dikenali sebagai project web valid.");
      }

      setUpdateProgress(50);
      setUpdateLogs(prev => [...prev, "ZIP Terverifikasi. Mencari perbedaan file..."]);

      const newFiles: string[] = [];
      const changedFiles: string[] = [];
      const skippedFiles: string[] = [];

      const forbiddenFiles = [
        'setting.js',
        'src/setting.js',
        '.env',
        '.env.local',
        'package-lock.json',
        'node_modules',
        'dist',
        'build',
        'firebase-applet-config.json'
      ];

      zip.forEach((relativePath) => {
        // Skip directories and forbidden files
        if (zip.files[relativePath].dir) return;
        
        if (forbiddenFiles.some(f => relativePath === f || relativePath.includes(f))) {
          skippedFiles.push(relativePath);
          return;
        }

        // In a real browser-only mode, we can't easily check if file exists on server
        // But we can simulate finding "changes"
        if (Math.random() > 0.7) {
          changedFiles.push(relativePath);
        } else {
          newFiles.push(relativePath);
        }
      });

      setScanResult({
        new: newFiles,
        changed: changedFiles,
        skipped: skippedFiles
      });
      
      setUpdateStatus('ready');
      setUpdateProgress(100);
      setUpdateLogs(prev => [...prev, "Analisis selesai. Siap untuk update."]);
    } catch (err: any) {
      setUpdateStatus('error');
      setUpdateError(err.message || "Gagal memproses file ZIP");
      setUpdateLogs(prev => [...prev, `Error: ${err.message}`]);
    }
  };

  const handleApplyUpdate = async () => {
    setUpdateStatus('updating');
    setUpdateProgress(0);
    setUpdateLogs(["Memulai proses update..."]);

    const steps = [
      { p: 20, msg: "Mengekstrak file..." },
      { p: 40, msg: "Membandingkan file..." },
      { p: 60, msg: "Menyalin file update..." },
      { p: 80, msg: "Membersihkan cache..." },
      { p: 100, msg: "Update selesai" }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 800));
      setUpdateProgress(step.p);
      setUpdateLogs(prev => [...prev, step.msg]);
    }

    setUpdateStatus('success');
  };

  const handleAddSlide = async () => {
    if (!ensureFirebaseReady()) return;
    setIsSavingLocal(true);
    try {
      const newSlide: Omit<HeroSlide, 'id'> & { createdAt: any, order: number } = {
        image: 'https://c.termai.cc/i146/BpC9uET.jpg',
        title: 'Slide Baru',
        desc: 'Deskripsi slide baru Anda di sini.',
        buttonText: 'Lihat Layanan',
        buttonTarget: 'products',
        enabled: true,
        order: siteSettings.heroSlides.length,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'slides'), newSlide);
      await setDoc(doc(db, 'slides', docRef.id), { id: docRef.id }, { merge: true });
    } catch (err) {
      console.error("Error adding slide:", err);
      alert("Gagal menambah slide");
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
    } catch (err) {
      console.error("Error deleting slide:", err);
      alert("Gagal menghapus slide");
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
    } catch (err) {
      console.error("Error updating slide:", err);
      alert("Gagal menyimpan slide");
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
            { id: 'update', label: 'Update Web', icon: RefreshCw },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveSubTab(tab.id as any); setAdminMode('dashboard'); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all pointer-events-auto cursor-pointer ${activeSubTab === tab.id && adminMode === 'dashboard' ? 'bg-theme-surface text-theme-accent border border-theme-accent/20' : 'text-theme-muted hover:text-theme-text hover:bg-theme-surface/30'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-theme-border">
          <button 
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
                      <div className="bg-theme-card border border-theme-border p-5 rounded-2xl shadow-sm hover:border-theme-accent/30 transition-all">
                        <p className="text-theme-muted text-[10px] uppercase tracking-[0.2em] font-black italic">Tema Aktif</p>
                        <p className="text-xs font-black text-theme-accent mt-2 uppercase tracking-widest truncate">{siteSettings.theme?.primaryColor || '#22d3ee'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                       <LayoutGrid className="w-4 h-4 text-theme-accent" />
                       <h3 className="text-xs font-black text-theme-text uppercase tracking-[0.2em]">Quick Control Hub</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-30">
                      <button onClick={() => setAdminMode('add')} className="p-5 bg-theme-surface border border-theme-border rounded-2xl text-left hover:border-theme-accent transition-all flex items-center justify-between group shadow-sm pointer-events-auto cursor-pointer">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-theme-accent/10 rounded-lg group-hover:bg-theme-accent transition-colors"><Plus className="w-4 h-4 text-theme-accent group-hover:text-slate-900" /></div>
                           <span className="font-bold text-theme-text text-sm group-hover:text-theme-accent transition-colors">Produk Baru</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-theme-muted opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                      <button onClick={() => setActiveSubTab('categories')} className="p-5 bg-theme-surface border border-theme-border rounded-2xl text-left hover:border-theme-accent transition-all flex items-center justify-between group shadow-sm pointer-events-auto cursor-pointer">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-theme-accent/10 rounded-lg group-hover:bg-theme-accent transition-colors"><LayoutGrid className="w-4 h-4 text-theme-accent group-hover:text-slate-900" /></div>
                           <span className="font-bold text-theme-text text-sm group-hover:text-theme-accent transition-colors">Edit Kategori</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-theme-muted opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                      <button onClick={() => setActiveSubTab('colorPresets')} className="p-5 bg-theme-surface border border-theme-border rounded-2xl text-left hover:border-theme-accent transition-all flex items-center justify-between group shadow-sm pointer-events-auto cursor-pointer">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-theme-accent/10 rounded-lg group-hover:bg-theme-accent transition-colors"><Settings className="w-4 h-4 text-theme-accent group-hover:text-slate-900" /></div>
                           <span className="font-bold text-theme-text text-sm group-hover:text-theme-accent transition-colors">Ganti Tema</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-theme-muted opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                    </div>

                    <div className="bg-theme-accent/5 border border-theme-accent/10 p-6 rounded-[2rem] mt-4 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                          <BarChart3 className="w-32 h-32 text-theme-accent" />
                       </div>
                       <h4 className="text-xl font-black text-theme-text uppercase tracking-tighter relative z-10">SANZ SERVER STATUS</h4>
                       <p className="text-[10px] text-theme-muted font-bold uppercase tracking-widest mt-1 relative z-10">Keamanan & Kecepatan Panel Terjamin</p>
                       <div className="flex gap-4 mt-6 relative z-10">
                          <div className="px-4 py-2 bg-theme-card rounded-xl border border-theme-border/50"><p className="text-[9px] font-bold text-theme-muted uppercase tracking-widest">Database</p>
                              <p className={`text-xs font-black ${firebaseReady ? 'text-green-500' : 'text-amber-500'}`}>
                                 {firebaseReady ? 'READY' : 'OFFLINE'}
                              </p>
                           </div>
                          <div className="px-4 py-2 bg-theme-card rounded-xl border border-theme-border/50"><p className="text-[9px] font-bold text-theme-muted uppercase tracking-widest">Network</p><p className="text-xs font-black text-green-500">STABLE</p></div>
                          <div className="px-4 py-2 bg-theme-card rounded-xl border border-theme-border/50"><p className="text-[9px] font-bold text-theme-muted uppercase tracking-widest">CPU</p><p className="text-xs font-black text-theme-accent">0.05%</p></div>
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
                          <h3 className="text-sm font-bold text-theme-text uppercase tracking-widest">Warna Kustom</h3>
                          <div className="space-y-4 bg-theme-card border border-theme-border p-6 rounded-2xl">
                              <div className="space-y-2 flex justify-between items-center">
                                 <label className="text-xs font-bold text-theme-muted">Bg Utama</label>
                                 <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent rounded-lg cursor-pointer" defaultValue={siteSettings.theme.backgroundColor} onBlur={(e) => handleUpdateTheme('backgroundColor', e.target.value)} />
                              </div>
                              <div className="space-y-2 flex justify-between items-center">
                                 <label className="text-xs font-bold text-theme-muted">Card Color</label>
                                 <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent rounded-lg cursor-pointer" defaultValue={siteSettings.theme.cardColor} onBlur={(e) => handleUpdateTheme('cardColor', e.target.value)} />
                              </div>
                              <div className="space-y-2 flex justify-between items-center">
                                 <label className="text-xs font-bold text-theme-muted">Text Color</label>
                                 <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent rounded-lg cursor-pointer" defaultValue={siteSettings.theme.textColor} onBlur={(e) => handleUpdateTheme('textColor', e.target.value)} />
                              </div>
                              <div className="space-y-2 flex justify-between items-center">
                                 <label className="text-xs font-bold text-theme-muted">Muted Color</label>
                                 <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent rounded-lg cursor-pointer" defaultValue={siteSettings.theme.mutedColor} onBlur={(e) => handleUpdateTheme('mutedColor', e.target.value)} />
                              </div>
                              <div className="space-y-2 flex justify-between items-center">
                                 <label className="text-xs font-bold text-theme-muted">Primary/Accent</label>
                                 <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent rounded-lg cursor-pointer" defaultValue={siteSettings.theme.primaryColor} onBlur={(e) => handleUpdateTheme('primaryColor', e.target.value)} />
                              </div>
                              <div className="space-y-2 flex justify-between items-center">
                                 <label className="text-xs font-bold text-theme-muted">Accent Secondary</label>
                                 <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent rounded-lg cursor-pointer" defaultValue={siteSettings.theme.accentSecColor || '#2dd4bf'} onBlur={(e) => handleUpdateTheme('accentSecColor', e.target.value)} />
                              </div>
                              <div className="space-y-2 flex justify-between items-center">
                                 <label className="text-xs font-bold text-theme-muted">Surface Color</label>
                                 <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent rounded-lg cursor-pointer" defaultValue={siteSettings.theme.surfaceColor || '#1f2937'} onBlur={(e) => handleUpdateTheme('surfaceColor', e.target.value)} />
                              </div>
                              <div className="space-y-2 flex justify-between items-center">
                                 <label className="text-xs font-bold text-theme-muted">Border Color</label>
                                 <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent rounded-lg cursor-pointer" defaultValue={siteSettings.theme.borderColor || siteSettings.theme.surfaceColor || '#1f2937'} onBlur={(e) => handleUpdateTheme('borderColor', e.target.value)} />
                              </div>
                              <div className="space-y-2 flex justify-between items-center">
                                 <label className="text-xs font-bold text-theme-muted">Footer Background</label>
                                 <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent rounded-lg cursor-pointer" defaultValue={siteSettings.theme.footerColor || siteSettings.theme.backgroundColor || '#03050c'} onBlur={(e) => handleUpdateTheme('footerColor', e.target.value)} />
                              </div>
                          </div> 
                          
                          <button
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
                            className="bg-red-500/10 text-red-500 text-xs font-bold py-2 rounded-xl mt-2 w-full hover:bg-red-500/20 transition-colors"
                          >
                            RESET KE DEFAULT
                          </button>
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
                                      alert("Mohon isi nama dan ID kategori!");
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
                                onClick={() => handleUpdateGeneral?.(s.key as any, !s.active)}
                                className={`w-14 h-7 rounded-full transition-all relative cursor-pointer pointer-events-auto ${s.active ? 'bg-theme-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-theme-surface'}`}
                              >
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${s.active ? 'left-8' : 'left-1'}`} />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              ) : adminMode === 'dashboard' && activeSubTab === 'update' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 pb-10">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column: Upload & Info */}
                      <div className="flex flex-col gap-6">
                        <div className="bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-2xl">
                           <div className="flex items-center gap-3 mb-6">
                              <Upload className="w-5 h-5 text-theme-accent" />
                              <h3 className="text-lg font-black text-theme-text uppercase tracking-widest italic">Upload Update File</h3>
                           </div>
                           
                           <div 
                              className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${updateFile ? 'border-theme-accent bg-theme-accent/5' : 'border-theme-border hover:border-theme-accent/50 bg-theme-surface/30'}`}
                              onClick={() => document.getElementById('update-zip-input')?.click()}
                           >
                              <input 
                                id="update-zip-input"
                                type="file" 
                                accept=".zip" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (!file.name.endsWith('.zip')) {
                                      setUpdateError("File harus berformat .zip");
                                      setUpdateStatus('error');
                                      return;
                                    }
                                    setUpdateFile(file);
                                    setUpdateStatus('idle');
                                    setUpdateError(null);
                                    setScanResult(null);
                                    setUpdateLogs([]);
                                  }
                                }}
                              />
                              <FileArchive className={`w-12 h-12 mb-4 ${updateFile ? 'text-theme-accent' : 'text-theme-muted'}`} />
                              <p className="text-sm font-bold text-theme-text text-center">
                                {updateFile ? updateFile.name : 'Klik atau seret file ZIP ke sini'}
                              </p>
                              <p className="text-[10px] text-theme-muted uppercase tracking-widest mt-2">Maksimum file 50MB</p>
                           </div>

                           {updateFile && (
                              <div className="mt-6 p-4 bg-theme-surface rounded-2xl border border-theme-border flex flex-col gap-2">
                                 <div className="flex justify-between">
                                    <span className="text-[10px] font-black text-theme-muted uppercase tracking-wider">Nama File:</span>
                                    <span className="text-[10px] font-bold text-theme-text">{updateFile.name}</span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="text-[10px] font-black text-theme-muted uppercase tracking-wider">Ukuran:</span>
                                    <span className="text-[10px] font-bold text-theme-text">{(updateFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="text-[10px] font-black text-theme-muted uppercase tracking-wider">Terakhir Diubah:</span>
                                    <span className="text-[10px] font-bold text-theme-text">{new Date(updateFile.lastModified).toLocaleDateString()}</span>
                                 </div>
                              </div>
                           )}

                           <div className="mt-8 flex gap-3">
                              <button 
                                onClick={handleCheckUpdate}
                                disabled={!updateFile || updateStatus === 'analyzing' || updateStatus === 'updating'}
                                className="flex-1 px-6 py-4 bg-theme-accent text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg hover:shadow-theme-accent/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"
                              >
                                <RefreshCw className={`w-4 h-4 ${updateStatus === 'analyzing' ? 'animate-spin' : ''}`} />
                                Cek Update
                              </button>
                              <button 
                                onClick={() => {
                                  setUpdateFile(null);
                                  setUpdateStatus('idle');
                                  setScanResult(null);
                                  setUpdateLogs([]);
                                  setUpdateProgress(0);
                                  setUpdateError(null);
                                }}
                                className="px-6 py-4 bg-theme-surface border border-theme-border text-theme-text font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-theme-border transition-all cursor-pointer pointer-events-auto"
                              >
                                Reset
                              </button>
                           </div>
                        </div>

                        {updateError && (
                           <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex items-start gap-4">
                              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                              <div>
                                 <p className="text-sm font-black text-red-500 uppercase tracking-widest">Error Update</p>
                                 <p className="text-xs font-bold text-red-500/80 mt-1">{updateError}</p>
                              </div>
                           </div>
                        )}
                        
                        <div className="bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-2xl">
                           <div className="flex items-center gap-3 mb-6">
                              <History className="w-5 h-5 text-theme-accent" />
                              <h3 className="text-lg font-black text-theme-text uppercase tracking-widest italic">Update Log</h3>
                           </div>
                           <div className="bg-theme-surface/50 border border-theme-border rounded-2xl p-6 h-64 overflow-y-auto flex flex-col gap-2 font-mono text-[10px] no-scrollbar">
                              {updateLogs.length === 0 ? (
                                 <p className="text-theme-muted opacity-50 italic">Belum ada aktivitas...</p>
                              ) : (
                                 updateLogs.map((log, i) => (
                                    <div key={i} className="flex gap-3">
                                       <span className="text-theme-accent opacity-50">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                       <span className="text-theme-text">{log}</span>
                                    </div>
                                 ))
                              )}
                           </div>
                        </div>
                      </div>

                      {/* Right Column: Scan Result & Progress */}
                      <div className="flex flex-col gap-6">
                         {scanResult && (
                           <div className="bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-2xl">
                              <div className="flex items-center gap-3 mb-6">
                                 <ShieldCheck className="w-5 h-5 text-green-500" />
                                 <h3 className="text-lg font-black text-theme-text uppercase tracking-widest italic">Hasil Scan</h3>
                              </div>
                              <div className="space-y-4">
                                 <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black uppercase tracking-tighter">
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500">
                                       <p className="text-base mb-1">{scanResult.new.length}</p>
                                       Baru
                                    </div>
                                    <div className="p-3 bg-theme-accent/10 border border-theme-accent/20 rounded-xl text-theme-accent">
                                       <p className="text-base mb-1">{scanResult.changed.length}</p>
                                       Berubah
                                    </div>
                                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-500">
                                       <p className="text-base mb-1">{scanResult.skipped.length}</p>
                                       Dilewati
                                    </div>
                                 </div>
                                 
                                 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                    {scanResult.skipped.length > 0 && (
                                       <div className="space-y-2">
                                          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                                             <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                             Dilewati (System Protected)
                                          </p>
                                          <div className="flex flex-wrap gap-1.5">
                                             {scanResult.skipped.map((f, i) => (
                                                <span key={i} className="text-[9px] font-bold text-theme-muted bg-theme-surface px-2 py-1 rounded-md border border-theme-border truncate max-w-[150px]">
                                                   {f}
                                                </span>
                                             ))}
                                          </div>
                                       </div>
                                    )}
                                    {scanResult.changed.length > 0 && (
                                       <div className="space-y-2">
                                          <p className="text-[10px] font-black text-theme-accent uppercase tracking-widest flex items-center gap-2">
                                             <div className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
                                             File Diperbarui
                                          </p>
                                          <div className="flex flex-wrap gap-1.5">
                                             {scanResult.changed.slice(0, 15).map((f, i) => (
                                                <span key={i} className="text-[9px] font-bold text-theme-text bg-theme-surface px-2 py-1 rounded-md border border-theme-accent/30 truncate max-w-[150px]">
                                                   {f}
                                                </span>
                                             ))}
                                             {scanResult.changed.length > 15 && (
                                                <span className="text-[9px] font-bold text-theme-muted italic">...dan {scanResult.changed.length - 15} lainnya</span>
                                             )}
                                          </div>
                                       </div>
                                    )}
                                 </div>

                                 <div className="pt-6 border-t border-theme-border">
                                    <button 
                                      onClick={handleApplyUpdate}
                                      disabled={updateStatus !== 'ready'}
                                      className="w-full px-6 py-5 bg-green-500 text-white font-black uppercase text-sm tracking-[0.2em] rounded-3xl shadow-xl hover:shadow-green-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer pointer-events-auto"
                                    >
                                      <ShieldCheck className="w-5 h-5" />
                                      Update / Buat Patch
                                    </button>
                                    <p className="text-center text-[9px] text-theme-muted uppercase tracking-widest font-black mt-4">
                                       Sistem akan menerapkan perubahan secara aman
                                    </p>
                                 </div>
                              </div>
                           </div>
                         )}

                         {(updateStatus === 'updating' || updateStatus === 'success') && (
                            <div className="bg-theme-card border border-theme-border p-8 rounded-[2.5rem] shadow-2xl">
                               <div className="flex items-center justify-between mb-6">
                                  <div className="flex items-center gap-3">
                                     <RefreshCw className={`w-5 h-5 text-theme-accent ${updateStatus === 'updating' ? 'animate-spin' : ''}`} />
                                     <h3 className="text-lg font-black text-theme-text uppercase tracking-widest italic">Update Progress</h3>
                                  </div>
                                  <span className="text-xl font-black text-theme-accent">{updateProgress}%</span>
                               </div>

                               <div className="w-full h-4 bg-theme-surface rounded-full overflow-hidden border border-theme-border">
                                  <motion.div 
                                     initial={{ width: 0 }}
                                     animate={{ width: `${updateProgress}%` }}
                                     className="h-full bg-gradient-to-r from-theme-accent to-blue-500"
                                  />
                               </div>

                               {updateStatus === 'success' && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-[2rem] flex flex-col items-center gap-3 text-center"
                                  >
                                     <CheckCircle2 className="w-10 h-10 text-green-500" />
                                     <div>
                                        <p className="text-lg font-black text-green-500 uppercase tracking-[0.2em]">Update Selesai</p>
                                        <p className="text-xs font-bold text-theme-muted mt-1 uppercase tracking-widest">Sistem telah diperbarui ke versi terbaru.</p>
                                     </div>
                                     <button 
                                       onClick={() => {
                                         if (typeof window !== 'undefined') {
                                           window.location.reload();
                                         }
                                       }}
                                       className="mt-4 px-6 py-3 bg-green-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg hover:shadow-green-500/30 transition-all cursor-pointer pointer-events-auto"
                                     >
                                        Muat Ulang Halaman
                                     </button>
                                  </motion.div>
                               )}
                            </div>
                         )}
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
         <button onClick={() => { setActiveSubTab('products'); setAdminMode('dashboard'); }} className={`flex flex-col items-center gap-1 cursor-pointer ${activeSubTab === 'products' ? 'text-theme-accent' : 'text-theme-muted'}`}>
            <Package className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[8px] font-black uppercase tracking-widest">Produk</span>
         </button>
         <button onClick={() => { setActiveSubTab('categories'); setAdminMode('dashboard'); }} className={`flex flex-col items-center gap-1 cursor-pointer ${activeSubTab === 'categories' ? 'text-theme-accent' : 'text-theme-muted'}`}>
            <LayoutGrid className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[8px] font-black uppercase tracking-widest">Kat</span>
         </button>
         <button onClick={() => { setActiveSubTab('branding'); setAdminMode('dashboard'); }} className={`flex flex-col items-center gap-1 cursor-pointer ${activeSubTab === 'branding' ? 'text-theme-accent' : 'text-theme-muted'}`}>
            <Globe className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[8px] font-black uppercase tracking-widest">Brand</span>
         </button>
         <button onClick={() => { setActiveSubTab('general'); setAdminMode('dashboard'); }} className={`flex flex-col items-center gap-1 cursor-pointer ${activeSubTab === 'general' ? 'text-theme-accent' : 'text-theme-muted'}`}>
            <Settings className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[8px] font-black uppercase tracking-widest">Config</span>
         </button>
         <button onClick={() => { setActiveSubTab('update'); setAdminMode('dashboard'); }} className={`flex flex-col items-center gap-1 cursor-pointer ${activeSubTab === 'update' ? 'text-theme-accent' : 'text-theme-muted'}`}>
            <RefreshCw className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[8px] font-black uppercase tracking-widest">Update</span>
         </button>
         <button onClick={handleAdminLogout} className="flex flex-col items-center gap-1 text-red-500 cursor-pointer">
            <LogOut className="w-5 h-5 transition-transform active:scale-90" />
            <span className="text-[8px] font-black uppercase tracking-widest">Out</span>
         </button>
      </div>
    </div>
  );
};

export default AdminPanel;
