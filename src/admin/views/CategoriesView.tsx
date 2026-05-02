import React, { useState } from "react";
import { collection, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { db, firebaseReady } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { ensureFirebaseReady, slugify, safeToastError, removeUndefinedDeep , withTimeout } from "../utils/helpers";
import { Category } from "../../constants";
import { AdminButton, AdminInput } from "../components/ui-elements";

export const CategoriesView = ({ categories }: { categories: Category[] }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", order: 0, active: true });
  const [saving, setSaving] = useState(false);

  const startEdit = (cat?: Category) => {
    if (cat) {
      setEditingId(cat.id);
      setForm({ name: cat.name, slug: cat.slug || "", order: cat.order || 0, active: cat.active !== false });
    } else {
      setEditingId("new");
      setForm({ name: "", slug: "", order: categories.length + 1, active: true });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async () => {
    if (saving) return;
    if (!form.name.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }
    
    try {
      setSaving(true);
      
      console.log("SAVE CLICKED");
      console.log("firebaseReady:", firebaseReady);
      console.log("db:", db);

      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek src/setting.js");
        return;
      }

      const slug = form.slug.trim() ? slugify(form.slug) : slugify(form.name);
      const cleanPayload = removeUndefinedDeep({
        name: form.name.trim(),
        slug,
        order: Number(form.order) || 0,
        active: form.active
      });
      console.log("payload:", cleanPayload);

      if (editingId && editingId !== "new") {
        await withTimeout(setDoc(doc(db, "categories", editingId), cleanPayload, { merge: true }));
        toast.success("Kategori diupdate");
      } else {
        const newRef = doc(collection(db, "categories"));
        await withTimeout(setDoc(newRef, { ...cleanPayload, id: newRef.id }));
        toast.success("Kategori ditambahkan");
      }
      setEditingId(null);
    } catch (error: any) {
      console.error("SAVE ERROR:", error);
      safeToastError(error, "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, productCount: number) => {
    if (productCount > 0) {
      if (!window.confirm(`Kategori ini memiliki ${productCount} produk. Apakah Anda yakin ingin menghapusnya? (Produk tidak akan otomatis terhapus)`)) {
         return;
      }
    } else {
      if (!window.confirm("Hapus kategori ini?")) return;
    }

    try {
      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }
      await withTimeout(deleteDoc(doc(db, "categories", id)));
      toast.success("Kategori dihapus");
    } catch (error: any) {
      console.error("DELETE ERROR:", error);
      safeToastError(error, "Gagal menghapus");
    }
  };

  if (editingId) {
    return (
      <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Edit Kategori</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <AdminInput label="Nama Kategori" value={form.name} onChange={e => setForm({...form, name: e.target.value})} autoFocus />
           <AdminInput label="URL Slug (Otomatis jika kosong)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
           <AdminInput label="Urutan" type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)})} />
           
           <div className="flex items-center gap-3 mt-8">
            <input type="checkbox" id="catActive" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
            <label htmlFor="catActive" className="checkbox-label text-white cursor-pointer select-none">Aktif (Tampil di Frontend)</label>
           </div>
           
           <div className="md:col-span-2 pt-4 flex gap-4">
             <AdminButton type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</AdminButton>
             <AdminButton variant="ghost" onClick={cancelEdit} disabled={saving}>Batal</AdminButton>
           </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Kelola Kategori</h2>
       </div>

       <div className="overflow-x-auto">
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="border-b border-[#334155] text-[#94a3b8] text-sm">
                <th className="pb-3 px-2 font-medium">Urutan</th>
                <th className="pb-3 px-2 font-medium">Nama</th>
                <th className="pb-3 px-2 font-medium hidden sm:table-cell">Slug</th>
                <th className="pb-3 px-2 font-medium">Produk</th>
                <th className="pb-3 px-2 font-medium">Status</th>
                <th className="pb-3 px-2 font-medium text-right">Aksi</th>
             </tr>
           </thead>
           <tbody>
             {categories.length === 0 ? (
               <tr><td colSpan={6} className="text-center py-6 text-[#94a3b8]">Belum ada data</td></tr>
             ) : categories.map(cat => (
               <tr key={cat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                 <td className="py-3 px-2 text-white">{cat.order || 0}</td>
                 <td className="py-3 px-2 font-medium text-white">{cat.name}</td>
                 <td className="py-3 px-2 text-[#94a3b8] text-sm hidden sm:table-cell">{cat.slug}</td>
                 <td className="py-3 px-2">
                   <span className="bg-[#020617] text-[#22d3ee] border border-[#22d3ee]/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {cat.products?.length || 0}
                   </span>
                 </td>
                 <td className="py-3 px-2">
                   {cat.active === false ? <span className="text-red-400 text-sm">Nonaktif</span> : <span className="text-emerald-400 text-sm">Aktif</span>}
                 </td>
                 <td className="py-3 px-2 text-right">
                   <div className="flex items-center justify-end gap-2">
                     <button type="button" onClick={() => startEdit(cat)} className="text-[#94a3b8] hover:text-[#22d3ee] text-sm font-medium px-2 py-1">Edit</button>
                     <button type="button" onClick={() => handleDelete(cat.id, cat.products?.length || 0)} className="text-[#94a3b8] hover:text-red-400 text-sm font-medium px-2 py-1">Hapus</button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};
