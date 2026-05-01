import React, { useState } from "react";
import { collection, doc, deleteDoc, updateDoc, setDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { ensureFirebaseReady, slugify, safeToastError } from "../utils/helpers";
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
      if (!ensureFirebaseReady()) return;

      const payload = {
        title: form.title.trim(),
        desc: form.desc.trim(),
        image: form.image.trim(),
        buttonText: form.buttonText.trim(),
        buttonTarget: form.buttonTarget.trim(),
        order: Number(form.order) || 0,
        enabled: form.enabled
      };

      if (editingId && editingId !== "new") {
        await updateDoc(doc(db, "slides", editingId), payload);
        toast.success("Slide diupdate");
      } else {
        const newRef = doc(collection(db, "slides"));
        await setDoc(newRef, { ...payload, id: newRef.id });
        toast.success("Slide ditambahkan");
      }
      setEditingId(null);
    } catch (err) {
      safeToastError(err, "Gagal save slide");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus slide ini?")) return;
    try {
      if (!ensureFirebaseReady()) return;
      await deleteDoc(doc(db, "slides", id));
      toast.success("Slide dihapus");
    } catch (err) {
      safeToastError(err, "Gagal menghapus slide");
    }
  };

  if (editingId) {
    return (
      <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">{editingId === "new" ? "Tambah" : "Edit"} Slide</h2>
        
        {form.image && (
          <div className="mb-6 aspect-video bg-[#020617] rounded-xl overflow-hidden border border-[#334155] max-w-lg mx-auto relative">
             <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
             <div className="absolute inset-0 flex items-center justify-center text-[#64748b] bg-[#020617] -z-10 text-sm">Preview Gambar</div>
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
            <input type="checkbox" id="slideActive" checked={form.enabled} onChange={e => setForm({...form, enabled: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
            <label htmlFor="slideActive" className="checkbox-label text-white cursor-pointer select-none">Aktif (Tampil di Frontend)</label>
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
          <h2 className="text-xl font-bold text-white">Banner Slider</h2>
          <AdminButton onClick={() => startEdit()}>+ Tambah Slide</AdminButton>
       </div>

       <div className="overflow-x-auto">
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="border-b border-[#334155] text-[#94a3b8] text-sm">
                <th className="pb-3 px-2 font-medium">Gambar</th>
                <th className="pb-3 px-2 font-medium">Urutan</th>
                <th className="pb-3 px-2 font-medium">Info</th>
                <th className="pb-3 px-2 font-medium">Status</th>
                <th className="pb-3 px-2 font-medium text-right">Aksi</th>
             </tr>
           </thead>
           <tbody>
             {slides.length === 0 ? (
               <tr><td colSpan={5} className="text-center py-6 text-[#94a3b8]">Belum ada slide</td></tr>
             ) : slides.map(slide => (
               <tr key={slide.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                 <td className="py-3 px-2">
                   <div className="w-20 h-11 bg-black rounded overflow-hidden border border-white/10 shrink-0">
                     <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                   </div>
                 </td>
                 <td className="py-3 px-2 text-white">{slide.order || 0}</td>
                 <td className="py-3 px-2">
                   <div className="text-white font-medium text-sm truncate max-w-[150px]">{slide.title || '(Tanpa Judul)'}</div>
                   <div className="text-[#94a3b8] text-xs truncate max-w-[150px]">{slide.desc || '-'}</div>
                 </td>
                 <td className="py-3 px-2">
                   {slide.enabled === false ? <span className="text-red-400 text-sm">Nonaktif</span> : <span className="text-emerald-400 text-sm">Aktif</span>}
                 </td>
                 <td className="py-3 px-2 text-right">
                   <div className="flex items-center justify-end gap-2">
                     <button type="button" onClick={() => startEdit(slide)} className="text-[#94a3b8] hover:text-[#22d3ee] text-sm font-medium px-2 py-1">Edit</button>
                     <button type="button" onClick={() => handleDelete(slide.id)} className="text-[#94a3b8] hover:text-red-400 text-sm font-medium px-2 py-1">Hapus</button>
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
