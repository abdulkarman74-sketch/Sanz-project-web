import React, { useState } from "react";
import { collection, doc, deleteDoc, updateDoc, setDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import { db, firebaseReady } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { ensureFirebaseReady, slugify, safeToastError, removeUndefinedDeep , withTimeout } from "../utils/helpers";
import { HeroSlide } from "../../constants";
import { AdminButton, AdminInput, AdminTextarea } from "../components/ui-elements";

export const SlidesView = ({ slides }: { slides: HeroSlide[] }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    title: "", 
    desc: "", 
    image: "", 
    buttonText: "", 
    buttonTarget: "", 
    order: 0, 
    enabled: true 
  });
  const [saving, setSaving] = useState(false);

  const startEdit = (slide?: HeroSlide) => {
    if (slide) {
      setEditingId(slide.id);
      setForm({ 
        title: slide.title || "", 
        desc: slide.desc || "", 
        image: slide.image || "", 
        buttonText: slide.buttonText || "", 
        buttonTarget: slide.buttonTarget || "", 
        order: slide.order || 0, 
        enabled: slide.enabled !== false 
      });
    } else {
      setEditingId("new");
      setForm({ 
        title: "", 
        desc: "", 
        image: "", 
        buttonText: "", 
        buttonTarget: "", 
        order: slides.length + 1, 
        enabled: true 
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async () => {
    if (saving) return;
    if (!form.image.trim()) {
      toast.error("URL gambar wajib diisi");
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

      const cleanPayload = removeUndefinedDeep({
        title: form.title.trim(),
        desc: form.desc.trim(),
        image: form.image.trim(),
        buttonText: form.buttonText.trim(),
        buttonTarget: form.buttonTarget.trim(),
        order: Number(form.order) || 0,
        enabled: form.enabled
      });
      console.log("payload:", cleanPayload);

      if (editingId && editingId !== "new") {
        await withTimeout(setDoc(doc(db, "slides", editingId), cleanPayload, { merge: true }));
        toast.success("Slide diupdate");
      } else {
        const newRef = doc(collection(db, "slides"));
        await withTimeout(setDoc(newRef, { ...cleanPayload, id: newRef.id }));
        toast.success("Slide ditambahkan");
      }
      setEditingId(null);
    } catch (error: any) {
      console.error("SAVE ERROR:", error);
      safeToastError(error, "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus slide ini?")) return;
    try {
      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }
      await withTimeout(deleteDoc(doc(db, "slides", id)));
      toast.success("Slide dihapus");
    } catch (error: any) {
      console.error("DELETE ERROR:", error);
      safeToastError(error, "Gagal menghapus");
    }
  };

  if (editingId) {
    return (
      <div className="admin-card">
        <h2 className="text-xl font-bold text-[var(--theme-text-main)] mb-6">{editingId === "new" ? "Tambah" : "Edit"} Slide</h2>
        
        {form.image && (
          <div className="mb-6 aspect-video bg-[var(--theme-bg-main)] rounded-xl overflow-hidden border border-[var(--theme-border)] max-w-lg mx-auto relative">
             <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
             <div className="absolute inset-0 flex items-center justify-center text-[#64748b] bg-[var(--theme-bg-main)] -z-10 text-sm">Preview Gambar</div>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <AdminInput label="URL Gambar (Wajib)" value={form.image} onChange={e => setForm({...form, image: e.target.value})} autoFocus className="md:col-span-2" />
           <AdminInput label="Judul" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
           <AdminInput label="Deskripsi (Baris ke-2)" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
           <AdminInput label="Teks Tombol" placeholder="Beli Sekarang" value={form.buttonText} onChange={e => setForm({...form, buttonText: e.target.value})} />
           <AdminInput label="Target URL Tombol" placeholder="#produk" value={form.buttonTarget} onChange={e => setForm({...form, buttonTarget: e.target.value})} />
           <AdminInput label="Urutan" type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)})} />
           
           <div className="flex items-center gap-3 md:mt-8">
            <input type="checkbox" id="slideActive" checked={form.enabled} onChange={e => setForm({...form, enabled: e.target.checked})} className="w-5 h-5 accent-[var(--theme-primary)] rounded" />
            <label htmlFor="slideActive" className="checkbox-label text-[var(--theme-text-main)] cursor-pointer select-none">Aktif (Tampil di Frontend)</label>
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
    <div className="admin-page">
       <div className="admin-page-header flex justify-between items-center" style={{ flexDirection: 'row' }}>
          <div>
            <h1>Banner Slider</h1>
            <p>Atur gambar promo di atas web</p>
          </div>
          <button className="bg-[var(--theme-primary)] text-[var(--theme-bg-main)] px-4 py-2 rounded-xl text-sm font-bold" onClick={() => startEdit()}>+ Tambah Slide</button>
       </div>

       <div className="admin-section-card">
         <div className="overflow-x-auto">
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="border-b border-[var(--theme-border)] text-[var(--theme-text-soft)] text-sm">
                <th className="pb-3 px-2 font-medium">Gambar</th>
                <th className="pb-3 px-2 font-medium">Urutan</th>
                <th className="pb-3 px-2 font-medium">Info</th>
                <th className="pb-3 px-2 font-medium">Status</th>
                <th className="pb-3 px-2 font-medium text-right">Aksi</th>
             </tr>
           </thead>
           <tbody>
             {slides.length === 0 ? (
               <tr><td colSpan={5} className="text-center py-6 text-[var(--theme-text-soft)]">Belum ada slide</td></tr>
             ) : slides.map(slide => (
               <tr key={slide.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                 <td className="py-3 px-2">
                   <div className="w-20 h-11 bg-black rounded overflow-hidden border border-white/10 shrink-0">
                     <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                   </div>
                 </td>
                 <td className="py-3 px-2 text-[var(--theme-text-main)]">{slide.order || 0}</td>
                 <td className="py-3 px-2">
                   <div className="text-[var(--theme-text-main)] font-medium text-sm truncate max-w-[150px]">{slide.title || '(Tanpa Judul)'}</div>
                   <div className="text-[var(--theme-text-soft)] text-xs truncate max-w-[150px]">{slide.desc || '-'}</div>
                 </td>
                 <td className="py-3 px-2">
                   {slide.enabled === false ? <span className="text-red-400 text-sm">Nonaktif</span> : <span className="text-emerald-400 text-sm">Aktif</span>}
                 </td>
                 <td className="py-3 px-2 text-right">
                   <div className="flex items-center justify-end gap-2">
                     <button type="button" onClick={() => startEdit(slide)} className="text-[var(--theme-text-soft)] hover:text-[var(--theme-primary)] text-sm font-medium px-2 py-1">Edit</button>
                     <button type="button" onClick={() => handleDelete(slide.id)} className="text-[var(--theme-text-soft)] hover:text-red-400 text-sm font-medium px-2 py-1">Hapus</button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
      </div>
    </div>
  );
};
