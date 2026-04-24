import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Plus, Edit3, Trash2, LogOut, X, 
  ImageIcon, Palette, Music, Megaphone, Package, Save, Check, ShieldCheck 
} from 'lucide-react';
import { Category, Product, SiteSettings, HeroSlide } from '../../constants';

interface OwnerMenuProps {
  isOwnerLoggedIn: boolean;
  showOwnerLogin: boolean;
  setShowOwnerLogin: (v: boolean) => void;
  ownerPassword: string;
  setOwnerPassword: (v: string) => void;
  handleOwnerLogin: (e: React.FormEvent) => void;
  ownerMode: 'dashboard' | 'edit' | 'add' | null;
  setOwnerMode: (v: any) => void;
  localCategories: Category[];
  editingProduct: {catId: string, product: Product} | null;
  setEditingProduct: (v: any) => void;
  updateProduct: (catId: string, updatedProduct: Product) => void;
  deleteProduct: (catId: string, productId: string) => void;
  addProduct: (catId: string, newProduct: Product) => void;
  isSaving: boolean;
  handleOwnerLogout: () => void;
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: SiteSettings) => void;
}

const OwnerMenu: React.FC<OwnerMenuProps> = ({
  showOwnerLogin, setShowOwnerLogin, ownerPassword, setOwnerPassword, handleOwnerLogin,
  ownerMode, setOwnerMode, localCategories, editingProduct, setEditingProduct,
  updateProduct, deleteProduct, addProduct, isSaving, handleOwnerLogout,
  siteSettings, updateSiteSettings
}) => {
  const [activeTab, setActiveTab] = useState<'produk' | 'slider' | 'tema' | 'musik' | 'branding'>('produk');
  const [localSettings, setLocalSettings] = useState<SiteSettings>(siteSettings);

  // Sync when props change but user hasn't touched the form (if needed), otherwise let's just use localSettings until saved.
  React.useEffect(() => {
    if (!isSaving && ownerMode === 'dashboard') {
      setLocalSettings(siteSettings);
    }
  }, [siteSettings, isSaving, ownerMode]);

  if (!showOwnerLogin && !ownerMode) return null;

  const handleSaveSettings = () => {
    updateSiteSettings(localSettings);
  };

  const handleSlideChange = (id: string, field: keyof HeroSlide, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const addSlide = () => {
    setLocalSettings(prev => ({
      ...prev,
      heroSlides: [
        ...prev.heroSlides,
        {
          id: `slide_${Date.now()}`,
          image: '',
          title: 'New Slide',
          desc: 'Slide description',
          buttonText: 'Lihat Layanan',
          buttonTarget: 'products',
          enabled: true
        }
      ]
    }));
  };

  const removeSlide = (id: string) => {
    if (!confirm("Hapus slide ini?")) return;
    setLocalSettings(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.filter(s => s.id !== id)
    }));
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const slides = [...localSettings.heroSlides];
    if (direction === 'up' && index > 0) {
      [slides[index - 1], slides[index]] = [slides[index], slides[index - 1]];
    } else if (direction === 'down' && index < slides.length - 1) {
      [slides[index + 1], slides[index]] = [slides[index], slides[index + 1]];
    }
    setLocalSettings(prev => ({ ...prev, heroSlides: slides }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 w-full max-w-5xl max-h-[95vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-display font-black text-slate-900 uppercase tracking-widest leading-none">
              {showOwnerLogin ? 'Authentication' : 'Owner Control Panel'}
            </h2>
          </div>
          <button onClick={() => { setShowOwnerLogin(false); setOwnerMode(null); }} className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-all"><X className="w-5 h-5" /></button>
        </div>

        {showOwnerLogin ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white flex items-center justify-center">
            <div className="max-w-xs mx-auto space-y-6 text-center w-full">
              <div className="mb-8">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Secure Access</p>
                <p className="text-[10px] text-slate-400">Masukkan PIN Admin untuk mengakses Panel CMS.</p>
              </div>
              
              <form onSubmit={handleOwnerLogin} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">PIN ADMIN</label>
                  <input 
                    type="password" 
                    value={ownerPassword} 
                    onChange={(e) => setOwnerPassword(e.target.value)} 
                    placeholder="•••••••••" 
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 text-center text-2xl tracking-[0.3em] font-mono focus:border-blue-500 transition-all outline-none text-slate-900" 
                  />
                </div>
                <button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-md mt-4 active:scale-95">Buka Dashboard</button>
              </form>
            </div>
          </div>
        ) : ownerMode === 'dashboard' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 flex-shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto hide-scrollbar border-b md:border-b-0">
              <div className="p-4 flex flex-row md:flex-col gap-2 min-w-max md:min-w-0">
                {[
                  { id: 'produk', label: 'Produk', icon: Package },
                  { id: 'slider', label: 'Slider Hero', icon: ImageIcon },
                  { id: 'tema', label: 'Tema Warna', icon: Palette },
                  { id: 'musik', label: 'Musik', icon: Music },
                  { id: 'branding', label: 'Branding', icon: Megaphone },
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all w-full text-left
                      ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-auto p-4 hidden md:block">
                 <button onClick={handleOwnerLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors w-full px-4 py-3"><LogOut className="w-4 h-4" /> Logout</button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-6 md:p-8">
              
              {/* === TAB: PRODUK (Legacy Logic) === */}
              {activeTab === 'produk' && (
                <div className="space-y-8 pb-12">
                  <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Kelola Daftar Produk</span>
                  </div>
                  {localCategories.map(cat => (
                    <div key={cat.id} className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase">{cat.title}</h3>
                        <button onClick={() => { setEditingProduct({ catId: cat.id, product: { id: '', name: '', price: '0', description: '', benefits: [], category: cat.title, rating: 5, stock: 'Unlimited', image: '' }}); setOwnerMode('edit'); }} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all"><Plus className="w-3.5 h-3.5" /> Tambah</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {cat.products.map(p => (
                          <div key={p.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-3 items-center group transition-all">
                            <img src={p.image} className="w-12 h-12 rounded-lg object-cover border border-slate-200" alt="" loading="lazy" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-slate-800 font-bold text-xs truncate">{p.name}</h4>
                              <p className="text-slate-500 font-mono text-[10px] mt-0.5">Rp {p.price}</p>
                            </div>
                            <div className="flex gap-1.5">
                              <button onClick={() => { setEditingProduct({ catId: cat.id, product: p }); setOwnerMode('edit'); }} className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 shadow-sm"><Edit3 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => deleteProduct(cat.id, p.id)} className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-red-500 shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* === TAB: SLIDER HERO === */}
              {activeTab === 'slider' && (
                <div className="space-y-6 pb-24">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-black font-display uppercase tracking-widest text-slate-900">Hero Slider</h3>
                      <p className="text-xs text-slate-500">Edit gambar dan teks banner utama.</p>
                    </div>
                    <button onClick={addSlide} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest"><Plus className="w-4 h-4" /> Tambah Slide</button>
                  </div>

                  {localSettings.heroSlides.map((slide, i) => (
                    <div key={slide.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-6 relative">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => moveSlide(i, 'up')} disabled={i===0} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30">↑</button>
                        <button onClick={() => moveSlide(i, 'down')} disabled={i===localSettings.heroSlides.length-1} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-30">↓</button>
                        <button onClick={() => removeSlide(slide.id)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                      </div>

                      <div className="w-full md:w-48 shrink-0">
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Image Preview</div>
                        <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden border border-slate-300">
                          {slide.image ? <img src={slide.image} alt="preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon /></div>}
                        </div>
                        <label className="flex items-center gap-2 mt-3 cursor-pointer">
                          <input type="checkbox" checked={slide.enabled} onChange={e => handleSlideChange(slide.id, 'enabled', e.target.checked)} className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-bold text-slate-700">Slide Aktif</span>
                        </label>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase text-slate-500">Image URL</label>
                             <input value={slide.image} onChange={e => handleSlideChange(slide.id, 'image', e.target.value)} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-blue-500 outline-none" />
                           </div>
                           <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase text-slate-500">Judul Slide</label>
                             <input value={slide.title} onChange={e => handleSlideChange(slide.id, 'title', e.target.value)} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-blue-500 outline-none" />
                           </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Deskripsi Pendek</label>
                          <textarea value={slide.desc} onChange={e => handleSlideChange(slide.id, 'desc', e.target.value)} rows={2} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none resize-none" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase text-slate-500">Button Text</label>
                             <input value={slide.buttonText} onChange={e => handleSlideChange(slide.id, 'buttonText', e.target.value)} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-blue-500 outline-none" />
                           </div>
                           <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase text-slate-500">Button Scroll Target (ID)</label>
                             <input value={slide.buttonTarget} onChange={e => handleSlideChange(slide.id, 'buttonTarget', e.target.value)} className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-blue-500 outline-none" />
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* === TAB: TEMA WARNA === */}
              {activeTab === 'tema' && (
                <div className="space-y-6 pb-24">
                  <div className="mb-4">
                    <h3 className="text-lg font-black font-display uppercase tracking-widest text-slate-900">Warna Tema</h3>
                    <p className="text-xs text-slate-500">Ubah warna dasar dan teks website.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-600 block">Primary Color (Tombol, Aksen)</label>
                       <div className="flex items-center gap-3">
                         <input type="color" value={localSettings.theme.primaryColor} onChange={e => setLocalSettings({...localSettings, theme: {...localSettings.theme, primaryColor: e.target.value}})} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                         <input type="text" value={localSettings.theme.primaryColor} onChange={e => setLocalSettings({...localSettings, theme: {...localSettings.theme, primaryColor: e.target.value}})} className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm font-mono" />
                       </div>
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-600 block">Background Utama</label>
                       <div className="flex items-center gap-3">
                         <input type="color" value={localSettings.theme.backgroundColor} onChange={e => setLocalSettings({...localSettings, theme: {...localSettings.theme, backgroundColor: e.target.value}})} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                         <input type="text" value={localSettings.theme.backgroundColor} onChange={e => setLocalSettings({...localSettings, theme: {...localSettings.theme, backgroundColor: e.target.value}})} className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm font-mono" />
                       </div>
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-600 block">Text Color (Gelap untuk Light Theme)</label>
                       <div className="flex items-center gap-3">
                         <input type="color" value={localSettings.theme.textColor} onChange={e => setLocalSettings({...localSettings, theme: {...localSettings.theme, textColor: e.target.value}})} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                         <input type="text" value={localSettings.theme.textColor} onChange={e => setLocalSettings({...localSettings, theme: {...localSettings.theme, textColor: e.target.value}})} className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm font-mono" />
                       </div>
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-600 block">Card Background</label>
                       <div className="flex items-center gap-3">
                         <input type="color" value={localSettings.theme.cardColor} onChange={e => setLocalSettings({...localSettings, theme: {...localSettings.theme, cardColor: e.target.value}})} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                         <input type="text" value={localSettings.theme.cardColor} onChange={e => setLocalSettings({...localSettings, theme: {...localSettings.theme, cardColor: e.target.value}})} className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm font-mono" />
                       </div>
                     </div>
                  </div>
                </div>
              )}

              {/* === TAB: MUSIK === */}
              {activeTab === 'musik' && (
                <div className="space-y-6 pb-24">
                  <div className="mb-4">
                    <h3 className="text-lg font-black font-display uppercase tracking-widest text-slate-900">Audio / Musik</h3>
                    <p className="text-xs text-slate-500">Ubah background music MP3.</p>
                  </div>
                  <div className="space-y-4 max-w-xl">
                    <div className="space-y-1">
                       <label className="text-xs font-bold uppercase text-slate-600">URL Lagu (MP3)</label>
                       <input value={localSettings.audio.url} onChange={e => setLocalSettings({...localSettings, audio: {...localSettings.audio, url: e.target.value}})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:border-blue-500 outline-none" />
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                       <label className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" checked={localSettings.audio.autoplay} onChange={e => setLocalSettings({...localSettings, audio: {...localSettings.audio, autoplay: e.target.checked}})} className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300" />
                         <span className="text-sm font-medium text-slate-700">Autoplay Music (Jika diizinkan browser)</span>
                       </label>
                       <label className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" checked={localSettings.audio.loop} onChange={e => setLocalSettings({...localSettings, audio: {...localSettings.audio, loop: e.target.checked}})} className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300" />
                         <span className="text-sm font-medium text-slate-700">Loop Music</span>
                       </label>
                       <label className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" checked={localSettings.audio.showButton} onChange={e => setLocalSettings({...localSettings, audio: {...localSettings.audio, showButton: e.target.checked}})} className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300" />
                         <span className="text-sm font-medium text-slate-700">Tampilkan Tombol Nyalakan/Matikan Musik</span>
                       </label>
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB: BRANDING === */}
              {activeTab === 'branding' && (
                <div className="space-y-6 pb-24">
                  <div className="mb-4">
                    <h3 className="text-lg font-black font-display uppercase tracking-widest text-slate-900">Branding Website</h3>
                    <p className="text-xs text-slate-500">Identitas dan link sosial media website.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-600">Nama Website</label>
                        <input value={localSettings.branding.siteName} onChange={e => setLocalSettings({...localSettings, branding: {...localSettings.branding, siteName: e.target.value}})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:border-blue-500 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-600">Slogan / Footer Text</label>
                        <input value={localSettings.branding.slogan} onChange={e => setLocalSettings({...localSettings, branding: {...localSettings.branding, slogan: e.target.value}})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:border-blue-500 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-600">Logo Image URL</label>
                        <input value={localSettings.branding.logoUrl} onChange={e => setLocalSettings({...localSettings, branding: {...localSettings.branding, logoUrl: e.target.value}})} placeholder="Kosongkan jika ingin icon bawaan" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:border-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-600">Nomor WhatsApp</label>
                        <input value={localSettings.branding.whatsapp} onChange={e => setLocalSettings({...localSettings, branding: {...localSettings.branding, whatsapp: e.target.value}})} placeholder="62812345678" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:border-blue-500 outline-none font-mono" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-600">Link Telegram Group/Channel</label>
                        <input value={localSettings.branding.telegram} onChange={e => setLocalSettings({...localSettings, branding: {...localSettings.branding, telegram: e.target.value}})} placeholder="https://t.me/..." className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:border-blue-500 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-600">Link Instagram</label>
                        <input value={localSettings.branding.instagram} onChange={e => setLocalSettings({...localSettings, branding: {...localSettings.branding, instagram: e.target.value}})} placeholder="https://instagram.com/..." className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:border-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SAVE BUTTON FOR SETTINGS TABS (Slider, Tema, Musik, Branding) */}
              {activeTab !== 'produk' && (
                <div className="absolute bottom-0 left-0 md:left-64 right-0 p-4 bg-white border-t border-slate-200 flex justify-end z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                   <button 
                     onClick={handleSaveSettings} 
                     disabled={isSaving}
                     className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                   >
                     {isSaving ? <Check className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />}
                     {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                   </button>
                </div>
              )}

            </div>
          </div>
        ) : (ownerMode === 'edit' && editingProduct) ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
            {/* Edit Product Legacy UI */}
            <div className="max-w-2xl mx-auto space-y-6 pb-12 bg-white p-6 sm:p-8 border border-slate-200 rounded-[2rem] shadow-sm">
              <div className="text-left mb-6">
                 <h3 className="text-xl font-display font-black text-slate-900 uppercase tracking-tighter">
                   {editingProduct.product.id ? 'Edit Data Produk' : 'Tambah Produk Baru'}
                 </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama Produk</label>
                  <input value={editingProduct.product.name} onChange={(e) => setEditingProduct({...editingProduct, product: {...editingProduct.product, name: e.target.value}})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none text-sm focus:border-blue-500" placeholder="Product Name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Harga (Tanpa Rp)</label>
                  <input value={editingProduct.product.price} onChange={(e) => setEditingProduct({...editingProduct, product: {...editingProduct.product, price: e.target.value}})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none text-sm focus:border-blue-500" placeholder="Price (Numbers only)" />
                </div>
                <div className="space-y-1.5 col-span-full">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Image URL</label>
                  <input value={editingProduct.product.image} onChange={(e) => setEditingProduct({...editingProduct, product: {...editingProduct.product, image: e.target.value}})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none text-sm focus:border-blue-500" placeholder="Image URL" />
                </div>
                <div className="space-y-1.5 col-span-full">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Deskripsi Khusus</label>
                  <textarea rows={5} value={editingProduct.product.description} onChange={(e) => setEditingProduct({...editingProduct, product: {...editingProduct.product, description: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none text-sm focus:border-blue-500 resize-none" placeholder="Description" />
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button onClick={() => setOwnerMode('dashboard')} className="flex-1 h-12 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold uppercase tracking-widest rounded-xl transition-all text-xs">Batalkan</button>
                <button 
                  onClick={() => editingProduct.product.id ? updateProduct(editingProduct.catId, editingProduct.product) : addProduct(editingProduct.catId, editingProduct.product)} 
                  disabled={isSaving}
                  className="flex-1 h-12 bg-slate-900 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-md disabled:opacity-50 text-xs hover:bg-black"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default memo(OwnerMenu);
