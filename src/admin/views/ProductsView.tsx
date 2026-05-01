import React, { useState } from "react";
import { collection, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { ensureFirebaseReady, slugify, safeToastError, formatPrice, removeUndefinedDeep } from "../utils/helpers";
import { Product, Category } from "../../constants";
import { AdminButton, AdminInput, AdminSelect, AdminTextarea } from "../components/ui-elements";

export const ProductsView = ({ products, categories }: { products: Product[], categories: Category[] }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Product>>({
     name: "",
     price: 0,
     originalPrice: 0,
     image: "",
     categoryId: "",
     badge: "",
     rating: 5,
     stock: 999,
     shortDesc: "",
     description: "",
     benefits: [],
     active: true,
  });
  
  const [benefitInput, setBenefitInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setForm({
         ...product,
         active: product.active !== false
      });
    } else {
      setEditingId("new");
      setForm({
         name: "",
         price: 0,
         originalPrice: 0,
         image: "",
         categoryId: categories[0]?.id || "",
         badge: "",
         rating: 5,
         stock: 999,
         shortDesc: "",
         description: "",
         benefits: [],
         active: true,
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setForm(prev => ({ ...prev, benefits: [...(prev.benefits || []), benefitInput.trim()] }));
      setBenefitInput("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setForm(prev => ({ ...prev, benefits: (prev.benefits || []).filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    if (saving) return;
    if (!form.name?.trim()) {
      toast.error("Nama produk wajib diisi");
      return;
    }
    if (!form.categoryId) {
      toast.error("Kategori wajib dipilih");
      return;
    }
    
    try {
      setSaving(true);
      if (!ensureFirebaseReady()) return;

      const payload = removeUndefinedDeep({
        name: form.name.trim(),
        price: Number(form.price) || 0,
        originalPrice: Number(form.originalPrice) || 0,
        image: form.image?.trim() || "",
        categoryId: form.categoryId,
        badge: form.badge?.trim() || "",
        rating: Number(form.rating) || 5,
        stock: Number(form.stock) || 0,
        shortDesc: form.shortDesc?.trim() || "",
        description: form.description?.trim() || "",
        benefits: form.benefits || [],
        active: form.active !== false
      });

      if (editingId && editingId !== "new") {
        await updateDoc(doc(db, "products", editingId), payload);
        toast.success("Produk diupdate");
      } else {
        const newRef = doc(collection(db, "products"));
        await setDoc(newRef, { ...payload, id: newRef.id });
        toast.success("Produk ditambahkan");
      }
      setEditingId(null);
    } catch (err) {
      safeToastError(err, "Gagal save produk");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus produk ini?")) return;
    try {
      if (!ensureFirebaseReady()) return;
      await deleteDoc(doc(db, "products", id));
      toast.success("Produk dihapus");
    } catch (err) {
      safeToastError(err, "Gagal menghapus produk");
    }
  };

  const handleDuplicate = (product: Product) => {
     const newProduct = { ...product };
     delete (newProduct as any).id;
     newProduct.name = `${newProduct.name} (Copy)`;
     startEdit(newProduct as Product);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCat ? p.categoryId === filterCat : true;
    return matchesSearch && matchesCat;
  });

  if (editingId) {
    return (
      <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">{editingId === "new" ? "Tambah" : "Edit"} Produk</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <AdminInput label="Nama Produk *" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} autoFocus className="lg:col-span-2" />
           <AdminSelect label="Kategori *" value={form.categoryId || ""} onChange={e => setForm({...form, categoryId: e.target.value})} options={categories.map(c => ({ value: c.id, label: c.name }))} />
           
           <AdminInput label="Harga Jual *" type="number" value={form.price || ""} onChange={e => setForm({...form, price: e.target.value ? parseInt(e.target.value) : 0})} />
           <AdminInput label="Harga Coret (Promo)" type="number" value={form.originalPrice || ""} onChange={e => setForm({...form, originalPrice: e.target.value ? parseInt(e.target.value) : 0})} />
           <AdminInput label="Stok" type="number" value={form.stock || ""} onChange={e => setForm({...form, stock: e.target.value ? parseInt(e.target.value) : 0})} />
           
           <AdminInput label="URL Gambar" value={form.image || ""} onChange={e => setForm({...form, image: e.target.value})} className="lg:col-span-2" />
           <AdminInput label="Teks Label (Contoh: BEST SELLER)" value={form.badge || ""} onChange={e => setForm({...form, badge: e.target.value})} />
           
           <AdminInput label="Rating Bintang (1-5)" type="number" step="0.1" max="5" value={form.rating || ""} onChange={e => setForm({...form, rating: e.target.value ? parseFloat(e.target.value) : 0})} />
           
           <div className="lg:col-span-3">
             <AdminInput label="Deskripsi Singkat" value={form.shortDesc || ""} onChange={e => setForm({...form, shortDesc: e.target.value})} />
           </div>
           
           <div className="lg:col-span-3">
             <AdminTextarea label="Deskripsi Lengkap" value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} />
           </div>

           <div className="lg:col-span-3">
             <label className="text-sm font-medium text-white block mb-1.5">Daftar Benefit / Keuntungan</label>
             <div className="flex flex-col gap-2 bg-[#020617] border border-[#334155] rounded-xl p-4">
                {(form.benefits || []).map((b, idx) => (
                   <div key={idx} className="benefit-item flex justify-between items-center bg-[#111827] px-3 py-2 rounded-lg border border-[#334155]">
                      <span className="text-[#f8fafc] text-sm">{b}</span>
                      <button type="button" onClick={() => handleRemoveBenefit(idx)} className="benefit-delete text-red-400 hover:text-red-300 px-2 py-1 text-sm font-bold">X</button>
                   </div>
                ))}
                <div className="flex gap-2 mt-2">
                   <input type="text" value={benefitInput} onChange={e => setBenefitInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())} placeholder="Ketik benefit baru lalu tambah..." className="w-full bg-[#111827] text-[#f8fafc] border border-[#334155] rounded-lg px-3 py-2 outline-none focus:border-[#22d3ee] text-sm" />
                   <button type="button" onClick={handleAddBenefit} className="bg-[#22d3ee] text-slate-900 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap">Tambah</button>
                </div>
             </div>
           </div>
           
           <div className="lg:col-span-3 flex items-center gap-3">
            <input type="checkbox" id="prodActive" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
            <label htmlFor="prodActive" className="checkbox-label text-white cursor-pointer select-none">Produk Aktif (Bisa Dibeli)</label>
           </div>
           
           <div className="lg:col-span-3 pt-4 flex gap-4">
             <AdminButton type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Produk"}</AdminButton>
             <AdminButton variant="ghost" onClick={cancelEdit} disabled={saving}>Batal</AdminButton>
           </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-white">Kelola Produk</h2>
          <AdminButton onClick={() => startEdit()}>+ Tambah Produk</AdminButton>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
         <input type="text" placeholder="Cari nama produk..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-[#020617] text-white border border-[#334155] rounded-xl px-4 py-2.5 outline-none focus:border-[#22d3ee]" />
         <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="w-full bg-[#020617] text-white border border-[#334155] rounded-xl px-4 py-2.5 outline-none focus:border-[#22d3ee]">
           <option value="">Semua Kategori</option>
           {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
           ))}
         </select>
       </div>

       <div className="overflow-x-auto min-h-[300px]">
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="border-b border-[#334155] text-[#94a3b8] text-sm">
                <th className="pb-3 px-2 font-medium">Gambar</th>
                <th className="pb-3 px-2 font-medium">Nama Produk</th>
                <th className="pb-3 px-2 font-medium">Harga</th>
                <th className="pb-3 px-2 font-medium hidden md:table-cell">Kategori</th>
                <th className="pb-3 px-2 font-medium">Status</th>
                <th className="pb-3 px-2 font-medium text-right">Aksi</th>
             </tr>
           </thead>
           <tbody>
             {filteredProducts.length === 0 ? (
               <tr><td colSpan={6} className="text-center py-6 text-[#94a3b8]">Belum ada produk ditemukan</td></tr>
             ) : filteredProducts.map(p => {
               const cat = categories.find(c => c.id === p.categoryId);
               return (
               <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                 <td className="py-2 px-2">
                   <div className="w-12 h-12 bg-[#020617] rounded-lg overflow-hidden border border-white/10 shrink-0">
                     <img src={p.image} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/111827/334155?text=No+Img')} />
                   </div>
                 </td>
                 <td className="py-2 px-2 font-medium text-white truncate max-w-[200px] sm:max-w-xs">{p.name}</td>
                 <td className="py-2 px-2 text-[#22d3ee] font-semibold text-sm">{formatPrice(p.price)}</td>
                 <td className="py-2 px-2 text-[#94a3b8] text-sm hidden md:table-cell">{cat?.name || "Unknown"}</td>
                 <td className="py-2 px-2">
                   {p.active === false ? <span className="text-red-400 text-xs font-semibold px-2 py-1 bg-red-400/10 rounded-full">Nonaktif</span> : <span className="text-emerald-400 text-xs font-semibold px-2 py-1 bg-emerald-400/10 rounded-full">Aktif</span>}
                 </td>
                 <td className="py-2 px-2 text-right">
                   <div className="flex items-center justify-end gap-1">
                     <button type="button" onClick={() => startEdit(p)} className="text-[#94a3b8] hover:text-[#22d3ee] text-xs font-medium px-2 py-1">Edit</button>
                     <button type="button" onClick={() => handleDuplicate(p)} className="text-[#94a3b8] hover:text-white text-xs font-medium px-2 py-1">Copy</button>
                     <button type="button" onClick={() => handleDelete(p.id)} className="text-[#94a3b8] hover:text-red-400 text-xs font-medium px-2 py-1">Hapus</button>
                   </div>
                 </td>
               </tr>
             )})}
           </tbody>
         </table>
       </div>
    </div>
  );
};
