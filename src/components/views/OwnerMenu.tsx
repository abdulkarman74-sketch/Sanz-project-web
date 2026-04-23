/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Settings, Plus, Edit3, Trash2, LogOut, X } from 'lucide-react';
import { Category, Product } from '../../constants';

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
}

const OwnerMenu: React.FC<OwnerMenuProps> = ({
  showOwnerLogin, setShowOwnerLogin, ownerPassword, setOwnerPassword, handleOwnerLogin,
  ownerMode, setOwnerMode, localCategories, editingProduct, setEditingProduct,
  updateProduct, deleteProduct, addProduct, isSaving, handleOwnerLogout
}) => {
  if (!showOwnerLogin && !ownerMode) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 w-full max-w-4xl max-h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-display font-black text-slate-900 uppercase tracking-widest">
              {showOwnerLogin ? 'Authentication' : 'Owner Dashboard'}
            </h2>
          </div>
          <button onClick={() => { setShowOwnerLogin(false); setOwnerMode(null); }} className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-all"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
          {showOwnerLogin ? (
            <div className="max-w-xs mx-auto space-y-6 py-12 text-center">
              <div className="mb-8">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Secure Access</p>
                <p className="text-[10px] text-slate-400">Gunakan email admin untuk mengelola store</p>
              </div>
              
              <button 
                type="button"
                onClick={() => handleOwnerLogin()}
                className="w-full h-14 bg-white border border-slate-200 hover:border-slate-300 text-slate-900 font-bold px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="" />
                <span>Login with Google</span>
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-white px-4 text-slate-300">Or with Password</span></div>
              </div>

              <form onSubmit={handleOwnerLogin} className="space-y-4">
                <input type="password" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} placeholder="•••••••••" title="Access Password" className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-6 text-center text-xl tracking-[0.5em] focus:border-blue-500 transition-all outline-none text-slate-900 placeholder:text-slate-300" />
                <button type="submit" className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-md">Login with Password</button>
              </form>
            </div>
          ) : ownerMode === 'dashboard' ? (
            <div className="space-y-12">
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                <span className="text-xs text-blue-600 font-bold uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Admin Access</span>
                <button onClick={handleOwnerLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors"><LogOut className="w-4 h-4" /> Logout</button>
              </div>
              
              {localCategories.map(cat => (
                <div key={cat.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight uppercase">{cat.title}</h3>
                    <button onClick={() => { setEditingProduct({ catId: cat.id, product: { id: '', name: '', price: '0', description: '', benefits: [], category: cat.title, rating: 5, stock: 'Unlimited', image: '' }}); setOwnerMode('edit'); }} className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"><Plus className="w-3.5 h-3.5" /> Tambah Baru</button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {cat.products.map(p => (
                      <div key={p.id} className="bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-2xl p-4 flex gap-4 items-center group transition-all">
                        <img src={p.image} className="w-16 h-16 rounded-xl object-cover border border-slate-200" alt="" loading="lazy" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-slate-800 font-bold text-sm truncate">{p.name}</h4>
                          <p className="text-slate-500 font-mono text-xs mt-1">Rp {p.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingProduct({ catId: cat.id, product: p }); setOwnerMode('edit'); }} className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-all shadow-sm"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => deleteProduct(cat.id, p.id)} className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-red-500 transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (ownerMode === 'edit' && editingProduct) ? (
            <div className="max-w-2xl mx-auto space-y-8 pb-12">
              <div className="text-center"><h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tighter">{editingProduct.product.id ? 'Edit Produk' : 'Tambah Produk'}</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama Produk</label>
                  <input value={editingProduct.product.name} onChange={(e) => setEditingProduct({...editingProduct, product: {...editingProduct.product, name: e.target.value}})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none text-sm focus:border-slate-400" placeholder="Product Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Harga (Tanpa Rp)</label>
                  <input value={editingProduct.product.price} onChange={(e) => setEditingProduct({...editingProduct, product: {...editingProduct.product, price: e.target.value}})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none text-sm focus:border-slate-400" placeholder="Price (Numbers only)" />
                </div>
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Image URL</label>
                  <input value={editingProduct.product.image} onChange={(e) => setEditingProduct({...editingProduct, product: {...editingProduct.product, image: e.target.value}})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none text-sm focus:border-slate-400" placeholder="Image URL" />
                </div>
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Deskripsi</label>
                  <textarea rows={5} value={editingProduct.product.description} onChange={(e) => setEditingProduct({...editingProduct, product: {...editingProduct.product, description: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none text-sm focus:border-slate-400 resize-none" placeholder="Description" />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setOwnerMode('dashboard')} className="flex-1 h-14 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold uppercase tracking-widest rounded-xl transition-all text-sm">Batal</button>
                <button 
                  onClick={() => editingProduct.product.id ? updateProduct(editingProduct.catId, editingProduct.product) : addProduct(editingProduct.catId, editingProduct.product)} 
                  disabled={isSaving}
                  className="flex-1 h-14 bg-slate-900 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-md disabled:opacity-50 text-sm hover:bg-black"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default memo(OwnerMenu);
