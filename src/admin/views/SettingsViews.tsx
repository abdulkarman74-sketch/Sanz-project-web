import React, { useState, useEffect } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { safeToastError, removeUndefinedDeep, ensureFirebaseReady } from "../utils/helpers";
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
      if (!ensureFirebaseReady()) return;

      const clean = removeUndefinedDeep(payload);
      await setDoc(doc(db, "settings", "branding"), clean, { merge: true });
      
      // Also update settings/main for storeName
      await setDoc(doc(db, "settings", "main"), { storeName: clean.siteName, slogan: clean.slogan }, { merge: true });

      toast.success("Branding berhasil disimpan");
    } catch (err) {
      safeToastError(err, "Gagal menyimpan branding");
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
      if (!ensureFirebaseReady()) return;

      const clean = removeUndefinedDeep({
        ...payload,
        minDuration: Number(payload.minDuration) || 1500
      });
      await setDoc(doc(db, "settings", "loading"), clean, { merge: true });
      toast.success("Loading screen berhasil disimpan");
    } catch (err) {
      safeToastError(err, "Gagal menyimpan loading screen");
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
      if (!ensureFirebaseReady()) return;
      const clean = removeUndefinedDeep(payload);
      await setDoc(doc(db, "settings", "theme"), clean, { merge: true });
      toast.success("Tema berhasil disimpan");
    } catch (err) {
      safeToastError(err, "Gagal menyimpan tema");
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
      if (!ensureFirebaseReady()) return;
      const clean = removeUndefinedDeep({
        ...payload,
        volume: Number(payload.volume) || 50
      });
      await setDoc(doc(db, "settings", "audio"), clean, { merge: true });
      toast.success("Audio berhasil disimpan");
    } catch (err) {
      safeToastError(err, "Gagal menyimpan audio");
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
    whatsappNumber: "",
    whatsappMessageTemplate: "",
    whatsappButtonText: "",
    telegramUrl: "",
    instagramUrl: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPayload({
      whatsappNumber: settings?.contact?.whatsappNumber || "",
      whatsappMessageTemplate: settings?.contact?.whatsappMessageTemplate || "",
      whatsappButtonText: settings?.contact?.whatsappButtonText || "",
      telegramUrl: settings?.contact?.telegramUrl || "",
      instagramUrl: settings?.contact?.instagramUrl || "",
      email: settings?.contact?.email || "",
    });
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    if (!payload.whatsappNumber.trim()) {
      toast.error("Nomor WhatsApp wajib diisi as fallback");
      return;
    }
    try {
      setSaving(true);
      if (!ensureFirebaseReady()) return;
      const clean = removeUndefinedDeep(payload);
      // clean mobile number structure
      let cleanedWA = clean.whatsappNumber.replace(/[^0-9]/g, '');
      if (cleanedWA.startsWith('0')) cleanedWA = '62' + cleanedWA.substring(1);
      clean.whatsappNumber = cleanedWA;

      await setDoc(doc(db, "settings", "contact"), clean, { merge: true });
      toast.success("Kontak berhasil disimpan");
    } catch (err) {
      safeToastError(err, "Gagal menyimpan kontak");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Kontak & Order</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminInput label="Nomor WhatsApp Order" placeholder="6281234567890" value={payload.whatsappNumber} onChange={e => setPayload({...payload, whatsappNumber: e.target.value})} />
        <AdminInput label="Teks Tombol Order" value={payload.whatsappButtonText} onChange={e => setPayload({...payload, whatsappButtonText: e.target.value})} />
        <AdminInput label="Template Pesan WA" value={payload.whatsappMessageTemplate} onChange={e => setPayload({...payload, whatsappMessageTemplate: e.target.value})} className="md:col-span-2" />
        
        <AdminInput label="URL Telegram" value={payload.telegramUrl} onChange={e => setPayload({...payload, telegramUrl: e.target.value})} />
        <AdminInput label="URL Instagram" value={payload.instagramUrl} onChange={e => setPayload({...payload, instagramUrl: e.target.value})} />
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
      if (!ensureFirebaseReady()) return;
      
      const p = { ...payload };
      const copyright = p.copyright;
      delete p.copyright;

      const cleanFooter = removeUndefinedDeep(p);
      await setDoc(doc(db, "settings", "footer"), cleanFooter, { merge: true });
      await setDoc(doc(db, "settings", "branding"), { copyright: copyright || "© Copyright" }, { merge: true });
      
      toast.success("Footer berhasil disimpan");
    } catch (err) {
      safeToastError(err, "Gagal menyimpan footer");
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

// --- GENERAL VIEW ---
export const GeneralView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    websiteEnabled: true,
    maintenanceMode: false,
    maintenanceText: "",
    infoDisplayMode: "runtime",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPayload({
      websiteEnabled: settings?.general?.websiteEnabled !== false,
      maintenanceMode: !!settings?.general?.maintenanceMode,
      maintenanceText: settings?.general?.maintenanceText || "",
      infoDisplayMode: settings?.general?.infoDisplayMode || "runtime",
    });
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      if (!ensureFirebaseReady()) return;
      const clean = removeUndefinedDeep(payload);
      await setDoc(doc(db, "settings", "general"), clean, { merge: true });
      toast.success("Pengaturan web berhasil disimpan");
    } catch (err) {
      safeToastError(err, "Gagal menyimpan pengaturan umum");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Pengaturan Web</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="flex flex-col gap-4 p-4 border border-[#334155] bg-[#020617] rounded-xl col-span-2">
           <label className="flex items-center gap-3 cursor-pointer text-white">
            <input type="checkbox" checked={payload.websiteEnabled} onChange={e => setPayload({...payload, websiteEnabled: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded" />
            Website Aktif (Akses Publik)
          </label>
        </div>

        <div className="flex flex-col gap-4 p-4 border border-red-500/20 bg-red-500/5 rounded-xl col-span-2">
           <label className="flex items-center gap-3 cursor-pointer text-white">
            <input type="checkbox" checked={payload.maintenanceMode} onChange={e => setPayload({...payload, maintenanceMode: e.target.checked})} className="w-5 h-5 accent-red-500 rounded" />
            Mode Maintenance (Maintenance Page)
          </label>
          {payload.maintenanceMode && (
            <AdminInput label="Pesan Maintenance" value={payload.maintenanceText} onChange={e => setPayload({...payload, maintenanceText: e.target.value})} />
          )}
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
          className="col-span-2"
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
