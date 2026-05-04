import React, { useState } from "react";
import { collection, doc, deleteDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { ensureFirebaseReady, slugify, safeToastError, removeUndefinedDeep , withTimeout } from "../utils/helpers";
import { Category } from "../../constants";
import { AdminButton, AdminInput } from "../components/ui-elements";

export const CategoriesView = ({ categories }: { categories: Category[] }) => {
  function getCategoryName(category: any) {
    function prettyCategoryName(value: string) {
      if (!value) return "Tanpa Nama";
      return String(value)
        .replace(/-/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    const raw =
      category?.name ||
      category?.title ||
      category?.label ||
      category?.category ||
      category?.slug ||
      category?.id;

    return raw ? prettyCategoryName(raw) : "Tanpa Nama";
  }

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", order: 0, active: true });
  const [saving, setSaving] = useState(false);

  const startEdit = (cat?: Category) => {
    if (cat) {
      setEditingId(cat.id);
      setForm({ name: getCategoryName(cat), slug: cat.slug || "", order: cat.order || 0, active: cat.active !== false });
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
        await withTimeout(setDoc(doc(db, "categories", editingId), { ...cleanPayload, updatedAt: serverTimestamp() }, { merge: true }));
        toast.success("Kategori diupdate");
      } else {
        const newRef = doc(db, "categories", cleanPayload.slug);
        await withTimeout(setDoc(newRef, { ...cleanPayload, id: newRef.id, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
        console.log("Added category:", cleanPayload.slug);
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

  const handleDeleteCategory = async (category: any) => {
    try {
      if (!category) {
        toast.error("Data kategori tidak ditemukan");
        return;
      }

      const categoryId = category.id || category.slug;

      if (!categoryId) {
        toast.error("ID kategori tidak ditemukan");
        console.error("CATEGORY WITHOUT ID:", category);
        return;
      }

      const productCount = category.products?.length || 0;
      let ok = false;

      if (productCount > 0) {
        ok = window.confirm(
          `Yakin ingin menghapus kategori ini? Kategori akan hilang dari website. Kategori ini memiliki ${productCount} produk (Produk tidak akan otomatis terhapus).`
        );
      } else {
        ok = window.confirm(
          `Yakin ingin menghapus kategori "${category.name || category.slug || categoryId}"? Kategori akan hilang dari website.`
        );
      }

      if (!ok) return;

      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }

      console.log("DELETE CATEGORY CLICKED:", category);
      console.log("DELETE CATEGORY ID:", categoryId);

      await withTimeout(deleteDoc(doc(db, "categories", categoryId)));

      console.log("Deleted category:", categoryId);
      toast.success("Kategori berhasil dihapus");
    } catch (error: any) {
      console.error("DELETE CATEGORY ERROR:", error);
      toast.error("Gagal menghapus kategori: " + error.message);
    }
  };

  if (editingId) {
    return (
      <div className="admin-card">
        <h2 className="text-xl font-bold text-[var(--theme-text-main)] mb-6">Edit Kategori</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <AdminInput label="Nama Kategori" value={form.name} onChange={e => setForm({...form, name: e.target.value})} autoFocus />
           <AdminInput label="URL Slug (Otomatis jika kosong)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
           <AdminInput label="Urutan" type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)})} />
           
           <div className="flex items-center gap-3 mt-8">
            <input type="checkbox" id="catActive" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="w-5 h-5 accent-[var(--theme-primary)] rounded" />
            <label htmlFor="catActive" className="checkbox-label text-[var(--theme-text-main)] cursor-pointer select-none">Aktif (Tampil di Frontend)</label>
           </div>
           
           <div className="md:col-span-2 pt-4 flex gap-4">
             <AdminButton type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</AdminButton>
             <AdminButton variant="ghost" onClick={cancelEdit} disabled={saving}>Batal</AdminButton>
           </div>
        </form>
      </div>
    );
  }

  const defaultCategories = [
    { id: "panel", name: "Panel", slug: "panel", order: 1, active: true },
    { id: "sewa-bot", name: "Sewa Bot", slug: "sewa-bot", order: 2, active: true },
    { id: "source-code", name: "Source Code", slug: "source-code", order: 3, active: true },
    { id: "reseller", name: "Reseller", slug: "reseller", order: 4, active: true },
    { id: "app-premium", name: "App Premium", slug: "app-premium", order: 5, active: true }
  ];

  const visibleCategories = categories && categories.length > 0 ? categories : defaultCategories as any[];
  console.log("CATEGORIES DATA:", categories);
  console.log("CATEGORY NAME:", categories.map(getCategoryName));

  return (
    <div className="admin-card">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--theme-text-main)]">Kelola Kategori</h2>
          <AdminButton onClick={() => startEdit()} className="py-2.5">
             Tambah Kategori
          </AdminButton>
       </div>

       <div className="overflow-x-auto">
         <table className="w-full text-left border-collapse category-table">
           <thead>
             <tr className="border-b border-[var(--theme-border)] text-[var(--theme-text-soft)] text-sm">
                <th className="pb-3 px-2 font-medium">Urutan</th>
                <th className="pb-3 px-2 font-medium">Nama</th>
                <th className="pb-3 px-2 font-medium hidden sm:table-cell">Slug</th>
                <th className="pb-3 px-2 font-medium">Produk</th>
                <th className="pb-3 px-2 font-medium">Status</th>
                <th className="pb-3 px-2 font-medium text-right">Aksi</th>
             </tr>
           </thead>
           <tbody>
             {visibleCategories.length === 0 ? (
               <tr><td colSpan={6} className="text-center py-6 text-[var(--theme-text-soft)]">Belum ada data</td></tr>
             ) : visibleCategories.map(cat => (
               <tr key={cat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors category-row">
                 <td className="py-3 px-2 text-[var(--theme-text-main)]">{cat.order || 0}</td>
                 <td className="py-3 px-2 font-medium text-[var(--theme-text-main)] category-name">{getCategoryName(cat)}</td>
                 <td className="py-3 px-2 text-[var(--theme-text-soft)] text-sm hidden sm:table-cell">{cat.slug}</td>
                 <td className="py-3 px-2">
                   <span className="bg-[var(--theme-bg-main)] text-[var(--theme-primary)] border border-[var(--theme-primary)]/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {cat.products?.length || 0}
                   </span>
                 </td>
                 <td className="py-3 px-2">
                   {cat.active === false ? <span className="text-red-400 text-sm">Nonaktif</span> : <span className="text-emerald-400 text-sm">Aktif</span>}
                 </td>
                 <td className="py-3 px-2 text-right">
                   <div className="flex items-center justify-end gap-2 category-actions">
                     <button type="button" onClick={() => startEdit(cat)} className="text-[var(--theme-text-soft)] hover:text-[var(--theme-primary)] text-sm font-medium px-2 py-1">Edit</button>
                     <button type="button" onClick={() => handleDeleteCategory(cat)} className="text-[var(--theme-text-soft)] hover:text-red-400 text-sm font-medium px-2 py-1 btn-danger">Hapus</button>
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
