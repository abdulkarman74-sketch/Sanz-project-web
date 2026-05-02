import React, { useState, useEffect } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db, firebaseReady } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { safeToastError, removeUndefinedDeep, ensureFirebaseReady , withTimeout } from "../utils/helpers";
import { AdminInput, AdminButton, AdminSelect } from "../components/ui-elements";

// --- BRANDING VIEW ---
export const BrandingView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    siteName: "",
    slogan: "",
    logoUrl: "",
    faviconUrl: "",
    badgeText: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPayload({
      siteName: settings?.branding?.siteName || "",
      slogan: settings?.branding?.slogan || "",
      logoUrl: settings?.branding?.logoUrl || "",
      faviconUrl: settings?.branding?.faviconUrl || "",
      badgeText: settings?.branding?.badgeText || "",
    });
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    if (!payload.siteName.trim()) {
      toast.error("Nama store wajib diisi");
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

      const cleanPayload = removeUndefinedDeep(payload);
      console.log("payload:", cleanPayload);

      await withTimeout(setDoc(doc(db, "settings", "branding"), cleanPayload, { merge: true }));
      
      // Also update settings/main for storeName
      await withTimeout(setDoc(doc(db, "settings", "main"), { storeName: cleanPayload.siteName, slogan: cleanPayload.slogan }, { merge: true }));

      toast.success("Branding berhasil disimpan");
    } catch (error: any) {
      console.error("SAVE ERROR:", error);
      safeToastError(error, "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Branding</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminInput label="Nama Store" value={payload.siteName} onChange={e => setPayload({...payload, siteName: e.target.value})} />
        <AdminInput label="Nama Pendek (Opsional)" value={payload.badgeText} onChange={e => setPayload({...payload, badgeText: e.target.value})} />
        <AdminInput label="Slogan" value={payload.slogan} onChange={e => setPayload({...payload, slogan: e.target.value})} />
        <AdminInput label="Logo URL" value={payload.logoUrl} onChange={e => setPayload({...payload, logoUrl: e.target.value})} />
        <AdminInput label="Favicon URL" value={payload.faviconUrl} onChange={e => setPayload({...payload, faviconUrl: e.target.value})} />
        
        <div className="md:col-span-2 pt-4">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Branding"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

// --- LOADING VIEW ---
export const LoadingView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    title: "",
    subtitle: "",
    logoUrl: "",
    enabled: true,
    minDuration: 1500,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPayload({
      title: settings?.loading?.title || "",
      subtitle: settings?.loading?.subtitle || "",
      logoUrl: settings?.loading?.logoUrl || "",
      enabled: settings?.loading?.enabled !== false,
      minDuration: settings?.loading?.minDuration || 1500,
    });
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      
      console.log("SAVE CLICKED");
      console.log("firebaseReady:", firebaseReady);
      console.log("db:", db);

      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }

      const cleanPayload = removeUndefinedDeep({
        ...payload,
        minDuration: Number(payload.minDuration) || 1500
      });
      console.log("payload:", cleanPayload);

      await withTimeout(setDoc(doc(db, "settings", "loading"), cleanPayload, { merge: true }));
      toast.success("Loading screen berhasil disimpan");
    } catch (error: any) {
      console.error("SAVE ERROR:", error);
      safeToastError(error, "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Loading Screen</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex items-center gap-3 cursor-pointer md:col-span-2 text-white">
          <input type="checkbox" checked={payload.enabled} onChange={e => setPayload({...payload, enabled: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
          Aktifkan Loading Screen
        </label>
        
        <AdminInput label="Loading Title" value={payload.title} onChange={e => setPayload({...payload, title: e.target.value})} />
        <AdminInput label="Loading Subtitle" value={payload.subtitle} onChange={e => setPayload({...payload, subtitle: e.target.value})} />
        <AdminInput label="Logo URL" value={payload.logoUrl} onChange={e => setPayload({...payload, logoUrl: e.target.value})} />
        <AdminInput label="Minimum Duration (ms)" type="number" min="0" value={payload.minDuration} onChange={e => setPayload({...payload, minDuration: parseInt(e.target.value)})} />
        
        <div className="md:col-span-2 pt-4">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Loading"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

// --- THEME VIEW ---
export const ThemeView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    primaryColor: "",
    backgroundColor: "",
    cardColor: "",
    surfaceColor: "",
    textColor: "",
    mutedColor: "",
    borderColor: "",
    footerColor: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPayload({
      primaryColor: settings?.theme?.primaryColor || "",
      backgroundColor: settings?.theme?.backgroundColor || "",
      cardColor: settings?.theme?.cardColor || "",
      surfaceColor: settings?.theme?.surfaceColor || "",
      textColor: settings?.theme?.textColor || "",
      mutedColor: settings?.theme?.mutedColor || "",
      borderColor: settings?.theme?.borderColor || "",
      footerColor: settings?.theme?.footerColor || "",
    });
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      
      console.log("SAVE CLICKED");
      console.log("firebaseReady:", firebaseReady);
      console.log("db:", db);

      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }

      const cleanPayload = removeUndefinedDeep(payload);
      console.log("payload:", cleanPayload);
      await setDoc(doc(db, "settings", "theme"), cleanPayload, { merge: true });
      toast.success("Tema berhasil disimpan");
    } catch (error: any) {
      console.error("SAVE ERROR:", error);
      safeToastError(error, "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Tema Warna</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminInput type="color" label="Warna Aksen (Primary)" value={payload.primaryColor} onChange={e => setPayload({...payload, primaryColor: e.target.value})} />
        <AdminInput type="color" label="Background Main" value={payload.backgroundColor} onChange={e => setPayload({...payload, backgroundColor: e.target.value})} />
        <AdminInput type="color" label="Background Card" value={payload.cardColor} onChange={e => setPayload({...payload, cardColor: e.target.value})} />
        <AdminInput type="color" label="Background Surface" value={payload.surfaceColor} onChange={e => setPayload({...payload, surfaceColor: e.target.value})} />
        <AdminInput type="color" label="Text Utama" value={payload.textColor} onChange={e => setPayload({...payload, textColor: e.target.value})} />
        <AdminInput type="color" label="Text Muted" value={payload.mutedColor} onChange={e => setPayload({...payload, mutedColor: e.target.value})} />
        <AdminInput type="color" label="Warna Border" value={payload.borderColor} onChange={e => setPayload({...payload, borderColor: e.target.value})} />
        <AdminInput type="color" label="Background Footer" value={payload.footerColor} onChange={e => setPayload({...payload, footerColor: e.target.value})} />
        
        <div className="md:col-span-3 pt-4">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Tema"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

// --- AUDIO VIEW ---
export const AudioView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    url: "",
    name: "",
    autoplay: false,
    loop: true,
    volume: 50,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPayload({
      url: settings?.audio?.url || "",
      name: settings?.audio?.name || "",
      autoplay: !!settings?.audio?.autoplay,
      loop: settings?.audio?.loop !== false,
      volume: typeof settings?.audio?.volume === 'number' ? settings?.audio?.volume : 50,
    });
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      
      console.log("SAVE CLICKED");
      console.log("firebaseReady:", firebaseReady);
      console.log("db:", db);

      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }

      const cleanPayload = removeUndefinedDeep({
        ...payload,
        volume: Number(payload.volume) || 50
      });
      console.log("payload:", cleanPayload);
      await setDoc(doc(db, "settings", "audio"), cleanPayload, { merge: true });
      toast.success("Audio berhasil disimpan");
    } catch (error: any) {
      console.error("SAVE ERROR:", error);
      safeToastError(error, "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Background Audio</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex items-center gap-3 cursor-pointer text-white">
          <input type="checkbox" checked={payload.autoplay} onChange={e => setPayload({...payload, autoplay: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
          Autoplay Audio
        </label>
        <label className="flex items-center gap-3 cursor-pointer text-white">
          <input type="checkbox" checked={payload.loop} onChange={e => setPayload({...payload, loop: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
          Loop Audio
        </label>
        
        <AdminInput label="URL Audio Mp3" value={payload.url} onChange={e => setPayload({...payload, url: e.target.value})} className="md:col-span-2" />
        <AdminInput label="Nama Track/Artis" value={payload.name} onChange={e => setPayload({...payload, name: e.target.value})} />
        <AdminInput label="Volume (0-100)" type="number" min="0" max="100" value={payload.volume} onChange={e => setPayload({...payload, volume: parseInt(e.target.value)})} />
        
        <div className="md:col-span-2 pt-4">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Audio"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

// --- CONTACT VIEW ---
export const ContactView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    whatsapp: "",
    orderMessage: "",
    btnBuyText: "",
    telegram: "",
    instagram: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPayload({
      whatsapp: settings?.contact?.whatsapp || "",
      orderMessage: settings?.contact?.orderMessage || "",
      btnBuyText: settings?.contact?.btnBuyText || "",
      telegram: settings?.contact?.telegram || "",
      instagram: settings?.contact?.instagram || "",
      email: settings?.contact?.email || "",
    });
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    if (!payload.whatsapp.trim()) {
      toast.error("Nomor WhatsApp wajib diisi as fallback");
      return;
    }
    try {
      setSaving(true);
      
      console.log("SAVE CLICKED");
      console.log("firebaseReady:", firebaseReady);
      console.log("db:", db);

      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }

      const cleanPayload = removeUndefinedDeep(payload);
      // clean mobile number structure
      let cleanedWA = cleanPayload.whatsapp.replace(/[^0-9]/g, '');
      if (cleanedWA.startsWith('0')) cleanedWA = '62' + cleanedWA.substring(1);
      cleanPayload.whatsapp = cleanedWA;

      console.log("payload:", cleanPayload);

      await setDoc(doc(db, "settings", "contact"), cleanPayload, { merge: true });
      toast.success("Kontak berhasil disimpan");
    } catch (error: any) {
      console.error("SAVE ERROR:", error);
      safeToastError(error, "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Kontak & Order</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminInput label="Nomor WhatsApp Order" placeholder="6281234567890" value={payload.whatsapp} onChange={e => setPayload({...payload, whatsapp: e.target.value})} />
        <AdminInput label="Teks Tombol Order" value={payload.btnBuyText} onChange={e => setPayload({...payload, btnBuyText: e.target.value})} />
        <AdminInput label="Template Pesan WA" value={payload.orderMessage} onChange={e => setPayload({...payload, orderMessage: e.target.value})} className="md:col-span-2" />
        
        <AdminInput label="URL Telegram" value={payload.telegram} onChange={e => setPayload({...payload, telegram: e.target.value})} />
        <AdminInput label="URL Instagram" value={payload.instagram} onChange={e => setPayload({...payload, instagram: e.target.value})} />
        <AdminInput label="Email Support" value={payload.email} onChange={e => setPayload({...payload, email: e.target.value})} className="md:col-span-2" />
        
        <div className="md:col-span-2 pt-4">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Kontak"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

// --- FOOTER VIEW ---
export const FooterView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    title: "",
    description: "",
    copyright: "",
    privacyUrl: "",
    termsUrl: "",
    showFooter: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPayload({
      title: settings?.footer?.title || "",
      description: settings?.footer?.description || "",
      copyright: settings?.branding?.copyright || "",
      privacyUrl: settings?.footer?.privacyUrl || "",
      termsUrl: settings?.footer?.termsUrl || "",
      showFooter: settings?.footer?.showFooter !== false,
    });
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      
      console.log("SAVE CLICKED");
      console.log("firebaseReady:", firebaseReady);
      console.log("db:", db);

      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }
      
      const p = { ...payload };
      const copyright = p.copyright;
      delete p.copyright;

      const cleanPayload = removeUndefinedDeep(p);
      console.log("payload:", cleanPayload);
      await withTimeout(setDoc(doc(db, "settings", "footer"), cleanPayload, { merge: true }));
      await withTimeout(setDoc(doc(db, "settings", "branding"), { copyright: copyright || "© Copyright" }, { merge: true }));
      
      toast.success("Footer berhasil disimpan");
    } catch (error: any) {
      console.error("SAVE ERROR:", error);
      safeToastError(error, "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Footer Utama</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex items-center gap-3 cursor-pointer text-white md:col-span-2">
          <input type="checkbox" checked={payload.showFooter} onChange={e => setPayload({...payload, showFooter: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
          Tampilkan Footer
        </label>
        
        <AdminInput label="Footer Title" value={payload.title} onChange={e => setPayload({...payload, title: e.target.value})} />
        <AdminInput label="Detail/Deskripsi Singkat" value={payload.description} onChange={e => setPayload({...payload, description: e.target.value})} />
        <AdminInput label="Teks Copyright" value={payload.copyright} onChange={e => setPayload({...payload, copyright: e.target.value})} className="md:col-span-2" />
        <AdminInput label="URL Kebijakan Privasi" value={payload.privacyUrl} onChange={e => setPayload({...payload, privacyUrl: e.target.value})} />
        <AdminInput label="URL Syarat & Ketentuan" value={payload.termsUrl} onChange={e => setPayload({...payload, termsUrl: e.target.value})} />
        
        <div className="md:col-span-2 pt-4">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Footer"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

// --- MAINTENANCE VIEW ---
export const MaintenanceView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    maintenanceMode: false,
    maintenanceTitle: "",
    maintenanceText: "",
    maintenanceEstimate: "",
    contactButton: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPayload({
      maintenanceMode: !!settings?.general?.maintenanceMode,
      maintenanceTitle: settings?.general?.maintenanceTitle || "",
      maintenanceText: settings?.general?.maintenanceText || "",
      maintenanceEstimate: settings?.general?.maintenanceEstimate || "",
      contactButton: settings?.general?.contactButton !== false,
    });
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }
      const cleanPayload = removeUndefinedDeep(payload);
      await setDoc(doc(db, "settings", "general"), cleanPayload, { merge: true });
      toast.success("Pengaturan Maintenance berhasil disimpan");
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal menyimpan: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Mode Maintenance</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="flex flex-col gap-4 p-4 border border-red-500/20 bg-red-500/5 rounded-xl col-span-2">
           <label className="flex items-center gap-3 cursor-pointer text-white">
            <input type="checkbox" checked={payload.maintenanceMode} onChange={e => setPayload({...payload, maintenanceMode: e.target.checked})} className="w-5 h-5 accent-red-500 rounded" />
            Aktifkan Mode Maintenance (Situs ditutup untuk umum)
          </label>
        </div>

        {payload.maintenanceMode && (
          <>
            <AdminInput label="Judul Maintenance" placeholder="Contoh: Sedang Perbaikan" value={payload.maintenanceTitle} onChange={e => setPayload({...payload, maintenanceTitle: e.target.value})} />
            <AdminInput label="Estimasi Selesai" placeholder="Contoh: 2 Jam Lagi" value={payload.maintenanceEstimate} onChange={e => setPayload({...payload, maintenanceEstimate: e.target.value})} />
            <AdminInput label="Pesan Kembalian" value={payload.maintenanceText} onChange={e => setPayload({...payload, maintenanceText: e.target.value})} className="md:col-span-2" />
            <label className="flex items-center gap-3 cursor-pointer text-white md:col-span-2">
              <input type="checkbox" checked={payload.contactButton} onChange={e => setPayload({...payload, contactButton: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
              Tampilkan Tombol Kontak Admin Saat Maintenance
            </label>
          </>
        )}
        
        <div className="md:col-span-2 pt-4">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Maintenance"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

// --- GENERAL VIEW ---
export const GeneralView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    websiteEnabled: true,
    infoDisplayMode: "runtime",
    showSlider: true,
    showAudioBtn: true,
    showFooter: true,
    showWaBtn: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPayload({
      websiteEnabled: settings?.general?.websiteEnabled !== false,
      infoDisplayMode: settings?.general?.infoDisplayMode || "runtime",
      showSlider: settings?.general?.showSlider !== false,
      showAudioBtn: settings?.general?.showAudioBtn !== false,
      showFooter: settings?.general?.showFooter !== false,
      showWaBtn: settings?.general?.showWaBtn !== false,
    });
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }

      const cleanPayload = removeUndefinedDeep(payload);
      await setDoc(doc(db, "settings", "general"), cleanPayload, { merge: true });
      toast.success("Pengaturan web berhasil disimpan");
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal menyimpan: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Pengaturan Web</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="flex flex-col gap-4 p-4 border border-[#334155] bg-[#020617] rounded-xl md:col-span-2">
           <label className="flex items-center gap-3 cursor-pointer text-white">
            <input type="checkbox" checked={payload.websiteEnabled} onChange={e => setPayload({...payload, websiteEnabled: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
            Website Aktif (Akses Publik)
          </label>
           <label className="flex items-center gap-3 cursor-pointer text-white">
            <input type="checkbox" checked={payload.showSlider} onChange={e => setPayload({...payload, showSlider: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
            Tampilkan Slider
          </label>
           <label className="flex items-center gap-3 cursor-pointer text-white">
            <input type="checkbox" checked={payload.showAudioBtn} onChange={e => setPayload({...payload, showAudioBtn: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
            Tampilkan Audio Button
          </label>
           <label className="flex items-center gap-3 cursor-pointer text-white">
            <input type="checkbox" checked={payload.showFooter} onChange={e => setPayload({...payload, showFooter: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
            Tampilkan Footer
          </label>
           <label className="flex items-center gap-3 cursor-pointer text-white">
            <input type="checkbox" checked={payload.showWaBtn} onChange={e => setPayload({...payload, showWaBtn: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
            Tampilkan Tombol WhatsApp
          </label>
        </div>

        <AdminSelect
          label="Tampilan Info Server (Beranda Utama)"
          value={payload.infoDisplayMode}
          onChange={e => setPayload({...payload, infoDisplayMode: e.target.value})}
          options={[
            { value: "runtime", label: "Tampilkan Server Status Saja" },
            { value: "datetime", label: "Tampilkan Jam Saja" },
            { value: "both", label: "Tampilkan Keduanya" },
            { value: "hidden", label: "Sembunyikan Keduanya" }
          ]}
          className="md:col-span-2"
        />
        
        <div className="md:col-span-2 pt-4">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

// --- DEBUG FIREBASE VIEW ---
export const DebugFirebaseView = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleTestSave = async () => {
    if (testing) return;
    try {
      setTesting(true);
      setTestResult(null);
      if (!firebaseReady || !db) {
        setTestResult("Firebase belum aktif. Cek src/setting.js");
        return;
      }
      
      const testRef = doc(db, "test", "connection");
      await setDoc(testRef, {
        ok: true,
        time: new Date().toISOString()
      }, { merge: true });

      setTestResult("Firebase berhasil tersambung dan data berhasil disimpan di test/connection.");
      toast.success("Test koneksi berhasil");
    } catch (error: any) {
      console.error(error);
      setTestResult("Error: " + error.message);
      toast.error("Test koneksi gagal");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Debug Firebase</h2>
      <div className="flex flex-col gap-4">
        <div className="p-4 bg-[#0f172a] rounded-xl border border-[#1e293b] flex flex-col gap-2">
           <div className="flex justify-between items-center text-sm">
             <span className="text-slate-400">Firebase Ready</span>
             <span className={`font-bold ${firebaseReady ? 'text-emerald-400' : 'text-red-400'}`}>
               {firebaseReady ? 'TRUE' : 'FALSE'}
             </span>
           </div>
           <div className="flex justify-between items-center text-sm">
             <span className="text-slate-400">Firestore Instance</span>
             <span className={`font-bold ${db ? 'text-emerald-400' : 'text-red-400'}`}>
               {db ? 'INITIALIZED' : 'NULL'}
             </span>
           </div>
        </div>

        <AdminButton type="button" onClick={handleTestSave} disabled={testing}>
          {testing ? "Testing Connection..." : "Test Firebase Save"}
        </AdminButton>

        {testResult && (
          <div className={`p-4 rounded-xl border text-sm mt-4 ${testResult.startsWith("Error") ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
};

