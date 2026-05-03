import React, { useState, useEffect } from "react";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { safeToastError, removeUndefinedDeep, ensureFirebaseReady , withTimeout } from "../utils/helpers";
import { AdminInput, AdminButton, AdminSelect } from "../components/ui-elements";

// --- BRANDING VIEW ---
export const BrandingView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    loadingName: "",
    loadingSubtitle: "",
    storeName: "",
    shortName: "",
    slogan: "",
    headerName: "",
    footerName: "",
    footerDescription: "",
    copyrightText: "",
    badgeText: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPayload({
      loadingName: settings?.branding?.loadingName || "",
      loadingSubtitle: settings?.branding?.loadingSubtitle || "",
      storeName: settings?.branding?.storeName || settings?.branding?.siteName || "",
      shortName: settings?.branding?.shortName || "",
      slogan: settings?.branding?.slogan || "",
      headerName: settings?.branding?.headerName || "",
      footerName: settings?.branding?.footerName || "",
      footerDescription: settings?.branding?.footerDescription || "",
      copyrightText: settings?.branding?.copyrightText || "",
      badgeText: settings?.branding?.badgeText || "",
    });
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    if (!payload.storeName?.trim()) {
      toast.error("Nama Website / Store wajib diisi");
      return;
    }

    try {
      setSaving(true);
      
      console.log("SAVE BRANDING CLICKED");

      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }

      const cleanPayload = removeUndefinedDeep({
        loadingName: payload.loadingName || payload.storeName,
        loadingSubtitle: payload.loadingSubtitle,
        storeName: payload.storeName,
        shortName: payload.shortName,
        slogan: payload.slogan,
        headerName: payload.headerName || payload.storeName,
        footerName: payload.footerName || payload.storeName,
        footerDescription: payload.footerDescription,
        copyrightText: payload.copyrightText || `© ${new Date().getFullYear()} ${payload.storeName}. All rights reserved.`,
        badgeText: payload.badgeText,
        updatedAt: serverTimestamp()
      });

      await withTimeout(setDoc(doc(db, "settings", "branding"), cleanPayload, { merge: true }));
      
      toast.success("Nama website berhasil disimpan");
    } catch (error: any) {
      console.error("SAVE BRANDING ERROR:", error);
      toast.error("Gagal menyimpan branding: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm("Kembalikan semua nama ke pengaturan standar?")) return;
    setPayload({
      loadingName: "SANZ STORE",
      loadingSubtitle: "Memuat layanan digital...",
      storeName: "SANZ STORE",
      shortName: "SANZ",
      slogan: "Infrastruktur Terpadu & Modern",
      headerName: "SANZ STORE",
      footerName: "Sanz Official Store",
      footerDescription: "Layanan digital cepat, aman, dan terpercaya.",
      copyrightText: "© 2026 SANZ STORE. All rights reserved.",
      badgeText: "VERIFIED",
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Branding Website</h1>
        <p>Edit identitas dan teks website</p>
      </div>

      <div className="admin-help-box">
        <strong>Info Nama Web</strong>
        <p>Atur nama yang muncul di header, footer, loading screen, dan seluruh teks di website.</p>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Identitas Toko</h2>
          <p>Teks utama website</p>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Nama Website / Store (Utama)</label>
            <input value={payload.storeName} onChange={(e) => setPayload({ ...payload, storeName: e.target.value })} placeholder="Contoh: SANZ STORE" />
            <small>Nama ini akan dipakai sebagai default di semua tempat jika yang lain kosong.</small>
          </div>
          <div className="admin-form-field">
            <label>Nama Pendek (Short Name)</label>
            <input value={payload.shortName} onChange={(e) => setPayload({ ...payload, shortName: e.target.value })} placeholder="Contoh: SANZ" />
            <small>Dipakai untuk tampilan layar kecil atau badge.</small>
          </div>
          <div className="admin-form-field full">
            <label>Slogan Singkat</label>
            <input value={payload.slogan} onChange={(e) => setPayload({ ...payload, slogan: e.target.value })} placeholder="Contoh: Termurah & Terpercaya" />
          </div>
        </div>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Teks Header & Loading</h2>
          <p>Teks yang pertama kali dilihat user</p>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Teks Logo Header</label>
            <input value={payload.headerName} onChange={(e) => setPayload({ ...payload, headerName: e.target.value })} placeholder="Nama di pojok kiri atas" />
          </div>
          <div className="admin-form-field">
            <label>Badge Navbar (Di sebelah nama)</label>
            <input value={payload.badgeText} onChange={(e) => setPayload({ ...payload, badgeText: e.target.value })} placeholder="Contoh: VERIFIED" />
          </div>
          <div className="admin-form-field">
            <label>Nama di Loading Screen</label>
            <input value={payload.loadingName} onChange={(e) => setPayload({ ...payload, loadingName: e.target.value })} placeholder="Tampil saat web dimuat" />
          </div>
          <div className="admin-form-field">
            <label>Subtitle Loading Screen</label>
            <input value={payload.loadingSubtitle} onChange={(e) => setPayload({ ...payload, loadingSubtitle: e.target.value })} placeholder="Status load" />
          </div>
        </div>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Teks Footer</h2>
          <p>Teks untuk bagian bawah website</p>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Nama Footer</label>
            <input value={payload.footerName} onChange={(e) => setPayload({ ...payload, footerName: e.target.value })} placeholder="Nama brand di bawah" />
          </div>
          <div className="admin-form-field">
            <label>Copyright Text</label>
            <input value={payload.copyrightText} onChange={(e) => setPayload({ ...payload, copyrightText: e.target.value })} placeholder="© 2026 SANZ STORE" />
          </div>
          <div className="admin-form-field full">
            <label>Deskripsi Footer</label>
            <textarea value={payload.footerDescription} onChange={(e) => setPayload({ ...payload, footerDescription: e.target.value })} rows={3} placeholder="Deskripsi pendek tentang toko" />
          </div>
        </div>
      </div>

      <div className="admin-save-row">
        <button className="admin-reset-button" onClick={handleReset} type="button">Reset ke Default</button>
        <button className="admin-save-button" onClick={handleSave} disabled={saving} type="button">
          {saving ? "Menyimpan..." : "Simpan Branding"}
        </button>
      </div>
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
    <div className="admin-card">
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
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Tema Warna</h1>
        <p>Sesuaikan warna utama dan latar web</p>
      </div>

      <div className="admin-help-box">
        <strong>Info Tema Warna</strong>
        <p>Ganti warna utama dan background dari website tanpa perlu koding. Gunakan format HEX (contoh: #0f172a).</p>
      </div>

      <div className="admin-two-column-grid">
        {/* KOLOM KIRI = FORM WARNA */}
        <div>
          <div className="admin-section-card" style={{ marginBottom: "20px" }}>
            <div className="admin-section-header">
              <h2>Warna Utama (Primary)</h2>
              <p>Warna dominan untuk tombol dan aksen</p>
            </div>
            <div className="admin-form-grid full">
              <div className="admin-form-field full">
                <label>Warna Aksen / Primary</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={payload.primaryColor} onChange={e => setPayload({...payload, primaryColor: e.target.value})} style={{ height: '48px', padding: '4px', width: "60px", flexShrink: 0 }} />
                  <input type="text" value={payload.primaryColor} onChange={e => setPayload({...payload, primaryColor: e.target.value})} placeholder="#000000" />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-section-card" style={{ marginBottom: "20px" }}>
            <div className="admin-section-header">
              <h2>Warna Latar (Background)</h2>
              <p>Warna dasar untuk berbagai bagian website</p>
            </div>
            <div className="admin-form-grid full">
              <div className="admin-form-field full">
                <label>Background Main (Web)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={payload.backgroundColor} onChange={e => setPayload({...payload, backgroundColor: e.target.value})} style={{ height: '48px', padding: '4px', width: "60px", flexShrink: 0 }} />
                  <input type="text" value={payload.backgroundColor} onChange={e => setPayload({...payload, backgroundColor: e.target.value})} placeholder="#000000" />
                </div>
              </div>
              <div className="admin-form-field full">
                <label>Background Card (Kotak)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={payload.cardColor} onChange={e => setPayload({...payload, cardColor: e.target.value})} style={{ height: '48px', padding: '4px', width: "60px", flexShrink: 0 }} />
                  <input type="text" value={payload.cardColor} onChange={e => setPayload({...payload, cardColor: e.target.value})} placeholder="#000000" />
                </div>
              </div>
              <div className="admin-form-field full">
                <label>Background Surface</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={payload.surfaceColor} onChange={e => setPayload({...payload, surfaceColor: e.target.value})} style={{ height: '48px', padding: '4px', width: "60px", flexShrink: 0 }} />
                  <input type="text" value={payload.surfaceColor} onChange={e => setPayload({...payload, surfaceColor: e.target.value})} placeholder="#000000" />
                </div>
              </div>
              <div className="admin-form-field full">
                <label>Background Footer</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={payload.footerColor} onChange={e => setPayload({...payload, footerColor: e.target.value})} style={{ height: '48px', padding: '4px', width: "60px", flexShrink: 0 }} />
                  <input type="text" value={payload.footerColor} onChange={e => setPayload({...payload, footerColor: e.target.value})} placeholder="#000000" />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-section-card" style={{ marginBottom: "0" }}>
            <div className="admin-section-header">
              <h2>Warna Teks & Garis</h2>
              <p>Warna tulisan dan pembatas</p>
            </div>
            <div className="admin-form-grid full">
              <div className="admin-form-field full">
                <label>Text Utama</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={payload.textColor} onChange={e => setPayload({...payload, textColor: e.target.value})} style={{ height: '48px', padding: '4px', width: "60px", flexShrink: 0 }} />
                  <input type="text" value={payload.textColor} onChange={e => setPayload({...payload, textColor: e.target.value})} placeholder="#000000" />
                </div>
              </div>
              <div className="admin-form-field full">
                <label>Text Redup (Muted)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={payload.mutedColor} onChange={e => setPayload({...payload, mutedColor: e.target.value})} style={{ height: '48px', padding: '4px', width: "60px", flexShrink: 0 }} />
                  <input type="text" value={payload.mutedColor} onChange={e => setPayload({...payload, mutedColor: e.target.value})} placeholder="#000000" />
                </div>
              </div>
              <div className="admin-form-field full">
                <label>Warna Border/Garis</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={payload.borderColor} onChange={e => setPayload({...payload, borderColor: e.target.value})} style={{ height: '48px', padding: '4px', width: "60px", flexShrink: 0 }} />
                  <input type="text" value={payload.borderColor} onChange={e => setPayload({...payload, borderColor: e.target.value})} placeholder="#000000" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN = PREVIEW & ACTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: "20px" }}>
          
          <div className="admin-section-card" style={{
            backgroundColor: payload.backgroundColor || '#020617',
            borderColor: payload.borderColor || '#334155',
            margin: 0
          }}>
            <div className="admin-section-header">
              <h2 style={{ color: payload.textColor || '#ffffff' }}>Live Preview</h2>
              <p style={{ color: payload.mutedColor || '#94a3b8' }}>Melihat hasil kombinasi warna</p>
            </div>
            
            <div style={{
              backgroundColor: payload.cardColor || '#0f172a',
              padding: '24px',
              borderRadius: '20px',
              border: `1px solid ${payload.borderColor || '#334155'}`,
              marginTop: '16px'
            }}>
              <h3 style={{ color: payload.textColor || '#ffffff', marginBottom: '8px', fontSize: '18px', fontWeight: 800 }}>Sample Content Card</h3>
              <p style={{ color: payload.mutedColor || '#94a3b8', fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
                Ini adalah contoh tulisan redup yang sering digunakan pada deksripsi sebuah list barang atau produk.
              </p>
              
              <button style={{
                  backgroundColor: payload.primaryColor || '#22d3ee',
                  color: '#020617',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: 900,
                  width: '100%',
                  cursor: 'pointer',
                  textAlign: 'center'
              }}>
                Simulasi Action Primary
              </button>
            </div>
          </div>

          <div className="admin-save-row" style={{ border: 'none', padding: 0, margin: 0, justifyContent: 'flex-start', flexDirection: 'column' }}>
            <button className="admin-save-button" onClick={handleSave} disabled={saving} type="button" style={{ width: '100%' }}>
              {saving ? "Menyimpan..." : "Simpan Tema Web"}
            </button>
          </div>

        </div>
      </div>
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
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Background Audio</h1>
        <p>Atur musik latar pada website</p>
      </div>

      <div className="admin-help-box">
        <strong>Info Background Audio</strong>
        <p>Tambahkan musik latar yang bisa diputar pengunjung (atau otomatis jika diizinkan browser).</p>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Tingkah Laku Audio</h2>
          <p>Pengaturan putar otomatis dan perulangan</p>
        </div>
        <div className="admin-toggle-grid">
          <label className="admin-toggle-card cursor-pointer">
            <div>
              <h4>Autoplay Audio</h4>
              <p>Mulai memutar saat website dibuka</p>
            </div>
            <input type="checkbox" checked={payload.autoplay} onChange={e => setPayload({...payload, autoplay: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded cursor-pointer" />
          </label>
          <label className="admin-toggle-card cursor-pointer">
            <div>
              <h4>Loop Audio</h4>
              <p>Ulangi lagu saat sudah selesai</p>
            </div>
            <input type="checkbox" checked={payload.loop} onChange={e => setPayload({...payload, loop: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded cursor-pointer" />
          </label>
        </div>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Sumber Lagu</h2>
          <p>Detail sumber file musik (.mp3)</p>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-field full">
            <label>URL Audio Mp3</label>
            <input value={payload.url} onChange={e => setPayload({...payload, url: e.target.value})} placeholder="https://contoh.com/lagu.mp3" />
          </div>
          <div className="admin-form-field">
            <label>Nama Track/Artis</label>
            <input value={payload.name} onChange={e => setPayload({...payload, name: e.target.value})} placeholder="Contoh: Relaxing Lofi" />
          </div>
          <div className="admin-form-field">
            <label>Volume (0-100)</label>
            <input type="number" min="0" max="100" value={payload.volume} onChange={e => setPayload({...payload, volume: parseInt(e.target.value)})} />
          </div>
        </div>
      </div>

      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving} type="button">
          {saving ? "Menyimpan..." : "Simpan Audio"}
        </button>
      </div>
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
    <div className="admin-page contact-order-admin">
      <div className="admin-page-header">
        <h1>Kontak & Order</h1>
        <p>Pengaturan nomor penerima pesanan dan kontak sosial media</p>
      </div>

      <div className="admin-help-box">
        <strong>Info Kontak & Order</strong>
        <p>Atur nomor penerima pesanan dan link kontak lainnya.</p>
      </div>

      <div className="admin-two-column-grid">
        <section className="admin-section-card" style={{ marginBottom: 0 }}>
          <div className="admin-section-header">
            <h2>Order WhatsApp</h2>
            <p>Tujuan tombol beli</p>
          </div>
          <div className="admin-form-grid full">
            <div className="admin-form-field full">
              <label>Nomor WhatsApp Order</label>
              <input value={payload.whatsapp} onChange={e => setPayload({...payload, whatsapp: e.target.value})} placeholder="Misal: 6281234567890" />
              <small>Awali dengan angka 62.</small>
            </div>
            <div className="admin-form-field full">
              <label>Teks Tombol Order</label>
              <input value={payload.btnBuyText} onChange={e => setPayload({...payload, btnBuyText: e.target.value})} />
            </div>
            <div className="admin-form-field full">
              <label>Template Pesan WA</label>
              <textarea value={payload.orderMessage} onChange={e => setPayload({...payload, orderMessage: e.target.value})} rows={3} />
            </div>
          </div>
        </section>

        <section className="admin-section-card" style={{ marginBottom: 0 }}>
          <div className="admin-section-header">
            <h2>Kontak Sosial Sosial Media</h2>
            <p>Akan muncul di footer website</p>
          </div>
          <div className="admin-form-grid full">
            <div className="admin-form-field full">
              <label>URL Telegram</label>
              <input value={payload.telegram} onChange={e => setPayload({...payload, telegram: e.target.value})} />
            </div>
            <div className="admin-form-field full">
              <label>URL Instagram</label>
              <input value={payload.instagram} onChange={e => setPayload({...payload, instagram: e.target.value})} />
            </div>
            <div className="admin-form-field full">
              <label>Email Support</label>
              <input value={payload.email} onChange={e => setPayload({...payload, email: e.target.value})} />
            </div>
          </div>
        </section>
      </div>

      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving} type="button">
          {saving ? "Menyimpan..." : "Simpan Kontak"}
        </button>
      </div>
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
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Footer Utama</h1>
        <p>Edit bagian bawah website Anda</p>
      </div>

      <div className="admin-help-box">
        <strong>Info Footer Web</strong>
        <p>Sesuaikan bagian kaki bawah website Anda, seperti teks copyright, dan url kebijakan privasi.</p>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Tampilan Footer</h2>
          <p>Tampilkan atau sembunyikan footer</p>
        </div>
        <div className="admin-toggle-grid" style={{ gridTemplateColumns: '1fr' }}>
          <label className="admin-toggle-card cursor-pointer">
            <div>
              <h4>Tampilkan Footer Utama</h4>
              <p>Aktifkan agar bagian footer terlihat di bawah halaman utama.</p>
            </div>
            <input type="checkbox" checked={payload.showFooter} onChange={e => setPayload({...payload, showFooter: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded cursor-pointer" />
          </label>
        </div>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Konten Footer</h2>
          <p>Judul, deskripsi dan copyright</p>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Footer Title</label>
            <input value={payload.title} onChange={e => setPayload({...payload, title: e.target.value})} placeholder="Contoh: Store Kami" />
          </div>
          <div className="admin-form-field">
            <label>Detail/Deskripsi Singkat</label>
            <input value={payload.description} onChange={e => setPayload({...payload, description: e.target.value})} placeholder="Terbaik dan Terpercaya" />
          </div>
          <div className="admin-form-field full">
            <label>Teks Copyright</label>
            <input value={payload.copyright} onChange={e => setPayload({...payload, copyright: e.target.value})} placeholder="© 2024 Nama Store. All rights reserved." />
          </div>
        </div>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Link Tambahan</h2>
          <p>Syarat ketentuan dan Kebijakan privasi</p>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>URL Kebijakan Privasi</label>
            <input value={payload.privacyUrl} onChange={e => setPayload({...payload, privacyUrl: e.target.value})} placeholder="https://..." />
          </div>
          <div className="admin-form-field">
            <label>URL Syarat & Ketentuan</label>
            <input value={payload.termsUrl} onChange={e => setPayload({...payload, termsUrl: e.target.value})} placeholder="https://..." />
          </div>
        </div>
      </div>

      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving} type="button">
          {saving ? "Menyimpan..." : "Simpan Footer"}
        </button>
      </div>
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
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Mode Maintenance</h1>
        <p>Tutup sementara toko Anda</p>
      </div>

      <div className="admin-help-box">
        <strong>Info Mode Maintenance</strong>
        <p>Aktifkan mode ini jika Anda akan melakukan perombakan besar di website sehingga pengunjung tidak mendapat error.</p>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Buka / Tutup Toko</h2>
          <p>Kontrol akses publik ke website</p>
        </div>
        <div className="admin-toggle-grid" style={{ gridTemplateColumns: '1fr' }}>
          <label className="admin-toggle-card cursor-pointer" style={{ border: payload.maintenanceMode ? '1px solid rgba(244, 63, 94, 0.4)' : '' }}>
            <div>
              <h4 style={{ color: payload.maintenanceMode ? '#f43f5e' : '#fff' }}>Aktifkan Mode Maintenance</h4>
              <p>Situs ditutup untuk umum (hanya Admin yang bisa lihat halaman utama setelah login)</p>
            </div>
            <input type="checkbox" checked={payload.maintenanceMode} onChange={e => setPayload({...payload, maintenanceMode: e.target.checked})} className="w-6 h-6 accent-red-500 rounded cursor-pointer" />
          </label>
        </div>
      </div>

      {payload.maintenanceMode && (
        <div className="admin-section-card">
          <div className="admin-section-header">
            <h2>Pesan Tampilan</h2>
            <p>Apa yang akan dilihat pengunjung</p>
          </div>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label>Judul Maintenance</label>
              <input value={payload.maintenanceTitle} onChange={(e) => setPayload({ ...payload, maintenanceTitle: e.target.value })} placeholder="Contoh: Kami Sedang Maintenance" />
            </div>
            <div className="admin-form-field">
              <label>Estimasi Selesai (Opsional)</label>
              <input value={payload.maintenanceEstimate} onChange={(e) => setPayload({ ...payload, maintenanceEstimate: e.target.value })} placeholder="Contoh: 1 Jam Lagi" />
            </div>
            <div className="admin-form-field full">
              <label>Pesan/Penjelasan</label>
              <textarea value={payload.maintenanceText} onChange={(e) => setPayload({ ...payload, maintenanceText: e.target.value })} rows={3} placeholder="Mohon maaf atas ketidaknyamanannya" />
            </div>
            <div className="admin-form-field full" style={{ marginTop: '10px' }}>
              <label className="flex items-center gap-3 cursor-pointer text-white">
                <input type="checkbox" checked={payload.contactButton} onChange={e => setPayload({...payload, contactButton: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded cursor-pointer" />
                Tampilkan Tombol Kontak Admin Saat Maintenance
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving} type="button">
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
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
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Pengaturan Web</h1>
        <p>Fitur on/off utama website</p>
      </div>

      <div className="admin-help-box">
        <strong>Info Pengaturan Web</strong>
        <p>Atur fitur yang ingin ditampilkan atau disembunyikan di front-end website secara instan.</p>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Toggle Fitur Utama</h2>
          <p>Fitur on/off untuk publik</p>
        </div>
        <div className="admin-toggle-grid">
          
          <label className="admin-toggle-card cursor-pointer">
            <div>
              <h4>Website Aktif</h4>
              <p>Biarkan user mengakses web</p>
            </div>
            <input type="checkbox" checked={payload.websiteEnabled} onChange={e => setPayload({...payload, websiteEnabled: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded cursor-pointer" />
          </label>

          <label className="admin-toggle-card cursor-pointer">
            <div>
              <h4>Tampilkan Slider</h4>
              <p>Banner promosi di beranda</p>
            </div>
            <input type="checkbox" checked={payload.showSlider} onChange={e => setPayload({...payload, showSlider: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded cursor-pointer" />
          </label>

          <label className="admin-toggle-card cursor-pointer">
            <div>
              <h4>Tampilkan Audio</h4>
              <p>Tombol musik di pojok kanan</p>
            </div>
            <input type="checkbox" checked={payload.showAudioBtn} onChange={e => setPayload({...payload, showAudioBtn: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded cursor-pointer" />
          </label>

          <label className="admin-toggle-card cursor-pointer">
            <div>
              <h4>Tampilkan Footer</h4>
              <p>Info di paling bawah website</p>
            </div>
            <input type="checkbox" checked={payload.showFooter} onChange={e => setPayload({...payload, showFooter: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded cursor-pointer" />
          </label>

          <label className="admin-toggle-card cursor-pointer">
            <div>
              <h4>Tombol WhatsApp</h4>
              <p>Tombol share/order ke WA</p>
            </div>
            <input type="checkbox" checked={payload.showWaBtn} onChange={e => setPayload({...payload, showWaBtn: e.target.checked})} className="w-5 h-5 accent-[#22d3ee] rounded cursor-pointer" />
          </label>

        </div>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Mode Info Homepage</h2>
          <p>Teks info kecil di bawah nama store</p>
        </div>
        <div className="admin-form-grid full">
          <div className="admin-form-field full">
            <select
              value={payload.infoDisplayMode}
              onChange={e => setPayload({...payload, infoDisplayMode: e.target.value})}
              className="admin-panel mt-1"
            >
              <option value="runtime">Tampilkan Server Status Saja</option>
              <option value="datetime">Tampilkan Jam & Waktu Saja</option>
              <option value="both">Tampilkan Keduannya</option>
              <option value="hidden">Sembunyikan Semua Info</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving} type="button">
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
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
    <div className="admin-card">
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

