import React, { useState } from 'react';
import { Save, Wand2 } from 'lucide-react';
import { Product, Category } from '../../constants';
import { PRODUCT_TYPES, generateProductTemplate, getBadgeForType } from '../../utils/productUtils';
import { motion } from 'motion/react';

interface Props {
  initialData: any;
  categories: Category[];
  isSaving: boolean;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const AdminProductForm: React.FC<Props> = ({ initialData, categories, isSaving, onSave, onCancel }) => {
  const [formData, setFormData] = useState<any>(initialData || { type: 'panel', rating: 5, stock: '99', active: true });

  const handleTypeChange = (type: string) => {
    setFormData({
      ...formData,
      type,
      badge: getBadgeForType(type),
      description: generateProductTemplate(type, formData.name || ''),
      typeDetails: {}
    });
  };

  const handleNameChange = (name: string) => {
    if (!formData.description) {
      setFormData({ ...formData, name, description: generateProductTemplate(formData.type || 'panel', name) });
    } else {
      setFormData({ ...formData, name });
    }
  };

  const updateTypeDetails = (field: string, value: any) => {
    setFormData({
      ...formData,
      typeDetails: {
        ...(formData.typeDetails || {}),
        [field]: value
      }
    });
  };

  const renderTypeSpecificFields = () => {
    const t = formData.type || 'panel';
    const td = formData.typeDetails || {};

    if (t === 'panel') {
      return (
        <div className="space-y-4 pt-4 border-t border-theme-border">
          <h4 className="text-xs font-bold text-theme-text uppercase tracking-widest">Spesifikasi Panel</h4>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="RAM (e.g. 10GB)" className="admin-input" value={td.ram || ''} onChange={e => updateTypeDetails('ram', e.target.value)} />
            <input placeholder="CPU (e.g. 300%)" className="admin-input" value={td.cpu || ''} onChange={e => updateTypeDetails('cpu', e.target.value)} />
            <input placeholder="Disk (e.g. 10GB)" className="admin-input" value={td.disk || ''} onChange={e => updateTypeDetails('disk', e.target.value)} />
            <input placeholder="Server Region" className="admin-input" value={td.region || ''} onChange={e => updateTypeDetails('region', e.target.value)} />
          </div>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-xs text-theme-muted">
              <input type="checkbox" checked={td.antiDown || false} onChange={e => updateTypeDetails('antiDown', e.target.checked)} className="accent-theme-accent w-4 h-4" />
              Anti Down Feature
            </label>
          </div>
        </div>
      );
    }

    if (t === 'bot') {
      return (
        <div className="space-y-4 pt-4 border-t border-theme-border">
          <h4 className="text-xs font-bold text-theme-text uppercase tracking-widest">Spesifikasi Bot</h4>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Durasi Sewa" className="admin-input" value={td.duration || ''} onChange={e => updateTypeDetails('duration', e.target.value)} />
            <input placeholder="Jumlah Fitur" className="admin-input" value={td.featuresCount || ''} onChange={e => updateTypeDetails('featuresCount', e.target.value)} />
            <select className="admin-input" value={td.botType || 'group'} onChange={e => updateTypeDetails('botType', e.target.value)}>
              <option value="group">Hanya Grup</option>
              <option value="private">Hanya Private</option>
              <option value="full">Full Akses</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="flex items-center gap-2 text-xs text-theme-muted"><input type="checkbox" checked={td.autoReply || false} onChange={e => updateTypeDetails('autoReply', e.target.checked)} className="accent-theme-accent" /> Auto Reply</label>
            <label className="flex items-center gap-2 text-xs text-theme-muted"><input type="checkbox" checked={td.antiLink || false} onChange={e => updateTypeDetails('antiLink', e.target.checked)} className="accent-theme-accent" /> Anti Link</label>
            <label className="flex items-center gap-2 text-xs text-theme-muted"><input type="checkbox" checked={td.welcome || false} onChange={e => updateTypeDetails('welcome', e.target.checked)} className="accent-theme-accent" /> Welcome Group</label>
            <label className="flex items-center gap-2 text-xs text-theme-muted"><input type="checkbox" checked={td.ai || false} onChange={e => updateTypeDetails('ai', e.target.checked)} className="accent-theme-accent" /> AI Feature</label>
          </div>
        </div>
      );
    }
    
    if (t === 'script') {
      return (
        <div className="space-y-4 pt-4 border-t border-theme-border">
          <h4 className="text-xs font-bold text-theme-text uppercase tracking-widest">Detail Source Code</h4>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Versi Script" className="admin-input" value={td.version || ''} onChange={e => updateTypeDetails('version', e.target.value)} />
            <input placeholder="Bahasa/Framework" className="admin-input" value={td.framework || ''} onChange={e => updateTypeDetails('framework', e.target.value)} />
            <input placeholder="Lisensi" className="admin-input" value={td.license || ''} onChange={e => updateTypeDetails('license', e.target.value)} />
            <input placeholder="Metode Pengiriman" className="admin-input" value={td.delivery || ''} onChange={e => updateTypeDetails('delivery', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="flex items-center gap-2 text-xs text-theme-muted"><input type="checkbox" checked={td.freeUpdate || false} onChange={e => updateTypeDetails('freeUpdate', e.target.checked)} className="accent-theme-accent" /> Free Update</label>
            <label className="flex items-center gap-2 text-xs text-theme-muted"><input type="checkbox" checked={td.tutorial || false} onChange={e => updateTypeDetails('tutorial', e.target.checked)} className="accent-theme-accent" /> Include Tutorial</label>
          </div>
        </div>
      );
    }

    if (t === 'app') {
      return (
        <div className="space-y-4 pt-4 border-t border-theme-border">
          <h4 className="text-xs font-bold text-theme-text uppercase tracking-widest">Aplikasi Premium</h4>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Durasi Akun" className="admin-input" value={td.duration || ''} onChange={e => updateTypeDetails('duration', e.target.value)} />
            <select className="admin-input" value={td.accountType || 'private'} onChange={e => updateTypeDetails('accountType', e.target.value)}>
              <option value="private">Private Account</option>
              <option value="sharing">Sharing Account</option>
            </select>
            <input placeholder="Region" className="admin-input" value={td.region || ''} onChange={e => updateTypeDetails('region', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="flex items-center gap-2 text-xs text-theme-muted"><input type="checkbox" checked={td.privateLogin || false} onChange={e => updateTypeDetails('privateLogin', e.target.checked)} className="accent-theme-accent" /> Private Login</label>
          </div>
        </div>
      );
    }

    if (t === 'reseller') {
      return (
        <div className="space-y-4 pt-4 border-t border-theme-border">
          <h4 className="text-xs font-bold text-theme-text uppercase tracking-widest">Detail Reseller</h4>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Paket Reseller" className="admin-input" value={td.package || ''} onChange={e => updateTypeDetails('package', e.target.value)} />
            <input placeholder="Limit Create Panel" className="admin-input" value={td.createLimit || ''} onChange={e => updateTypeDetails('createLimit', e.target.value)} />
            <input placeholder="Masa Aktif" className="admin-input" value={td.expiry || ''} onChange={e => updateTypeDetails('expiry', e.target.value)} />
          </div>
        </div>
      );
    }

    if (t === 'jasa') {
      return (
        <div className="space-y-4 pt-4 border-t border-theme-border">
          <h4 className="text-xs font-bold text-theme-text uppercase tracking-widest">Detail Jasa / Custom</h4>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Estimasi Pengerjaan" className="admin-input" value={td.duration || ''} onChange={e => updateTypeDetails('duration', e.target.value)} />
            <input placeholder="Revisi (e.g. 3x)" className="admin-input" value={td.revisions || ''} onChange={e => updateTypeDetails('revisions', e.target.value)} />
            <input placeholder="Sistem Pembayaran" className="admin-input" value={td.payment || ''} onChange={e => updateTypeDetails('payment', e.target.value)} />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <motion.form 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      onSubmit={(e) => { e.preventDefault(); onSave(formData); }}
      className="bg-theme-card border border-theme-border p-8 rounded-3xl flex flex-col gap-6 shadow-xl"
    >
      <div className="flex justify-between gap-4 mb-2">
        <div className="space-y-4 flex-1">
          <label className="text-xs font-bold text-theme-muted uppercase tracking-widest">Tipe Produk</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PRODUCT_TYPES.map(pt => (
              <button 
                key={pt.id} 
                type="button"
                onClick={() => handleTypeChange(pt.id)}
                className={`p-3 text-xs font-bold rounded-xl border transition-all ${formData.type === pt.id ? 'bg-theme-accent/20 border-theme-accent text-theme-accent' : 'bg-theme-surface border-theme-border text-theme-muted hover:border-theme-muted'}`}
              >
                {pt.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-theme-muted">Nama Produk</label>
            <input required className="admin-input" value={formData.name || ''} onChange={e => handleNameChange(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-theme-muted">Harga Normal</label>
              <input required className="admin-input" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Misal: 15.000" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-theme-accent">Harga Promo (Opsional)</label>
              <input className="admin-input border-theme-accent/30" value={formData.promoPrice || ''} onChange={e => setFormData({...formData, promoPrice: e.target.value})} placeholder="Diskon" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-theme-muted">Kategori Utama</label>
            <select className="admin-input" value={formData.categoryId || ''} onChange={e => {
                const cat = categories.find(c => c.id === e.target.value);
                setFormData({...formData, categoryId: e.target.value, category: cat?.title || ''});
            }}>
              <option value="">Pilih Kategori</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-theme-muted">Stok Produk</label>
              <input type="number" className="admin-input" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="e.g. 99" />
            </div>
            <div className="space-y-2 pt-6">
              <label className="flex items-center gap-3 text-xs font-bold text-theme-text cursor-pointer">
                <input type="checkbox" checked={formData.active !== false} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-5 h-5 accent-theme-accent" />
                Produk Aktif / Dijual
              </label>
            </div>
          </div>
          
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-theme-muted">Image URL</label>
            <input required className="admin-input" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-theme-muted">Badge (Label pada gambar)</label>
            <input className="admin-input" value={formData.badge || ''} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="e.g. Best Match" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-theme-muted">Deskripsi</label>
              <button type="button" onClick={() => setFormData({...formData, description: generateProductTemplate(formData.type || 'panel', formData.name || '')})} className="text-[10px] flex items-center gap-1 text-theme-accent hover:underline">
                <Wand2 className="w-3 h-3" /> Auto Generate
              </button>
            </div>
            <textarea className="admin-input min-h-[100px]" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
        </div>
      </div>

      {renderTypeSpecificFields()}

      <div className="flex gap-4 pt-6 border-t border-theme-border mt-4">
        <button type="submit" disabled={isSaving} className="flex-1 bg-theme-accent text-slate-900 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90">
          <Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Produk'}
        </button>
        <button type="button" onClick={onCancel} className="px-8 bg-theme-surface border border-theme-border text-theme-muted hover:text-red-400 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">
          Batal
        </button>
      </div>
    </motion.form>
  );
};

export default AdminProductForm;
