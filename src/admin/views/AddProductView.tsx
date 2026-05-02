import React, { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, firebaseReady } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { removeUndefinedDeep, withTimeout } from "../utils/helpers";
import { Product, Category } from "../../constants";
import { AdminButton, AdminInput, AdminSelect, AdminTextarea } from "../components/ui-elements";

export const AddProductView = ({ categories, onComplete }: { categories: Category[], onComplete?: () => void }) => {
  const [form, setForm] = useState<Partial<Product>>({
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
     order: 0,
  });
  
  const [benefitInput, setBenefitInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddBenefit = () => {
    if (!benefitInput.trim()) return;
    setForm({ ...form, benefits: [...(form.benefits || []), benefitInput.trim()] });
    setBenefitInput("");
  };

  const handleRemoveBenefit = (index: number) => {
    const newB = [...(form.benefits || [])];
    newB.splice(index, 1);
    setForm({ ...form, benefits: newB });
  };

  const handleSave = async () => {
    if (saving) return;
    if (!form.name?.trim() || !form.categoryId) {
      toast.error("Format tidak lengkap: Nama dan Kategori wajib diisi");
      return;
    }
    
    try {
      setSaving(true);
      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }

      const newRef = doc(collection(db, "products"));
      const cleanPayload = removeUndefinedDeep({
        ...form,
        id: newRef.id, // For product to self-reference if needed, optional
      });
      console.log("Saving new product:", cleanPayload);

      await withTimeout(setDoc(newRef, cleanPayload));
      toast.success("Produk baru berhasil ditambahkan!");
      
      // Kosongkan form
      setForm({
         name: "", price: 0, originalPrice: 0, image: "",
         categoryId: categories[0]?.id || "", badge: "",
         rating: 5, stock: 999, shortDesc: "", description: "",
         benefits: [], active: true, order: 0
      });
      setBenefitInput("");
      
      if(onComplete) onComplete();

    } catch(err: any) {
      console.error(err);
      toast.error("Gagal menambah produk: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Tambah Produk Baru</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <AdminInput label="Nama Produk *" value={form.name || ""} onChange={e => setForm({...form, name: e.target.value})} autoFocus className="lg:col-span-2" />
         <AdminSelect label="Kategori *" value={form.categoryId || ""} onChange={e => setForm({...form, categoryId: e.target.value})} options={categories.map(c => ({ value: c.id, label: c.name }))} />
         
         <AdminInput label="Harga Jual *" type="number" value={form.price || ""} onChange={e => setForm({...form, price: e.target.value ? parseInt(e.target.value) : 0})} />
         <AdminInput label="Harga Coret (Promo)" type="number" value={form.originalPrice || ""} onChange={e => setForm({...form, originalPrice: e.target.value ? parseInt(e.target.value) : 0})} />
         <AdminInput label="Stok" type="number" value={form.stock || ""} onChange={e => setForm({...form, stock: e.target.value ? parseInt(e.target.value) : 0})} />
         
         <AdminInput label="URL Gambar" value={form.image || ""} onChange={e => setForm({...form, image: e.target.value})} className="lg:col-span-2" />
         <AdminInput label="Teks Label (Contoh: BEST SELLER)" value={form.badge || ""} onChange={e => setForm({...form, badge: e.target.value})} />
         
         <AdminInput label="Rating Bintang (1-5)" type="number" step="0.1" max="5" value={form.rating || ""} onChange={e => setForm({...form, rating: e.target.value ? parseFloat(e.target.value) : 0})} />
         <AdminInput label="Urutan Produk (Terkecil tampil duluan)" type="number" value={form.order || 0} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} className="lg:col-span-2"/>
         
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
           <AdminButton type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Produk Baru"}</AdminButton>
           <AdminButton variant="ghost" type="button" onClick={() => setForm({
               name: "", price: 0, originalPrice: 0, image: "",
               categoryId: categories[0]?.id || "", badge: "",
               rating: 5, stock: 999, shortDesc: "", description: "",
               benefits: [], active: true, order: 0
           })} disabled={saving}>Kosongkan Form</AdminButton>
         </div>
      </form>
    </div>
  );
};
