import React, { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, firebaseReady } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { removeUndefinedDeep, slugify, withTimeout } from "../utils/helpers";
import { AdminButton, AdminInput } from "../components/ui-elements";

export const AddCategoryView = ({ onComplete }: { onComplete?: () => void }) => {
  const [form, setForm] = useState({ name: "", slug: "", order: 1, active: true });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    if (!form.name.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }
    
    try {
      setSaving(true);
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

      const newRef = doc(collection(db, "categories"));
      await withTimeout(setDoc(newRef, cleanPayload));
      toast.success("Kategori baru ditambahkan");
      
      setForm({ name: "", slug: "", order: 1, active: true });
      if(onComplete) onComplete();

    } catch (error: any) {
      console.error(error);
      toast.error("Gagal menambah kategori: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="text-xl font-bold text-[var(--theme-text-main)] mb-6">Tambah Kategori Baru</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <AdminInput label="Nama Kategori *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} autoFocus />
         <AdminInput label="Slug (Otomatis jika kosong)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
         <AdminInput label="Urutan (Terkecil tampil duluan)" type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} />
         
         <div className="col-span-1 md:col-span-2 flex items-center gap-3">
          <input type="checkbox" id="catActive" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="w-5 h-5 accent-[var(--theme-primary)] rounded" />
          <label htmlFor="catActive" className="text-[var(--theme-text-main)] cursor-pointer select-none">Kategori Aktif (Ditampilkan)</label>
         </div>
         
         <div className="col-span-1 md:col-span-2 pt-4 flex gap-4">
           <AdminButton type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Kategori Baru"}</AdminButton>
           <AdminButton variant="ghost" type="button" onClick={() => setForm({ name: "", slug: "", order: 1, active: true })} disabled={saving}>Kosongkan Form</AdminButton>
         </div>
      </form>
    </div>
  );
};
