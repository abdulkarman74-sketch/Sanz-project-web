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
      <h2 className="text-xl font-bold text-[var(--theme-text-main)] mb-6">Loading Screen</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex items-center gap-3 cursor-pointer md:col-span-2 text-[var(--theme-text-main)]">
          <input type="checkbox" checked={payload.enabled} onChange={e => setPayload({...payload, enabled: e.target.checked})} className="w-5 h-5 accent-[var(--theme-primary)] rounded" />
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
  const [themeForm, setThemeForm] = useState<any>({});
  const [savingTheme, setSavingTheme] = useState(false);

  useEffect(() => {
    // Import dynamically to avoid top-level import issues if not already there,
    // but assuming THEME_PRESETS can be imported or re-declared here for simplicity.
    // For now, I'll copy the THEME_PRESETS locally just for the UI choices,
    // though the real ones are in utils/theme.ts
    if (settings?.theme) {
      setThemeForm(settings.theme);
    } else {
      // Default fallback
      setThemeForm({
        themeName: "dark-cyan",
        mode: "dark",
        primary: "#22d3ee",
        secondary: "#67e8f9",
        backgroundMain: "#020617",
        backgroundSurface: "#0f172a",
        backgroundCard: "#111827",
        backgroundSoft: "#1e293b",
        textMain: "#f8fafc",
        textMuted: "#cbd5e1",
        textSoft: "#94a3b8",
        borderColor: "rgba(148, 163, 184, 0.18)",
        buttonText: "#020617",
        success: "#22c55e",
        danger: "#fb7185",
        warning: "#facc15",
        shadow: "rgba(0, 0, 0, 0.32)"
      });
    }
  }, [settings]);

  // Keep a local copy of presets for the grid
  const PRESETS: Record<string, any> = {
    "dark-cyan": {
      themeName: "dark-cyan", label: "Dark Cyan", mode: "dark", primary: "#22d3ee", secondary: "#67e8f9", backgroundMain: "#020617", backgroundSurface: "#0b1220", backgroundCard: "#111827", backgroundSoft: "#1e293b", textMain: "#f8fafc", textMuted: "#cbd5e1", textSoft: "#94a3b8", borderColor: "rgba(148, 163, 184, 0.18)", buttonText: "#020617", chipBg: "rgba(34, 211, 238, 0.12)", chipText: "#67e8f9", inputBg: "#020617", inputText: "#f8fafc", heroOverlayStart: "rgba(2, 6, 23, 0.76)", heroOverlayEnd: "rgba(2, 6, 23, 0.28)", shadow: "rgba(0, 0, 0, 0.34)"
    ,
      tabBg: "rgba(15, 23, 42, 0.92)", tabText: "#e2e8f0", tabBorder: "rgba(148, 163, 184, 0.22)", tabActiveBg: "rgba(34, 211, 238, 0.15)", tabActiveText: "#020617", tabActiveBorder: "#22d3ee"
    },
    "light-clean": {
      themeName: "light-clean", label: "Light Clean", mode: "light", primary: "#0f766e", secondary: "#0891b2", backgroundMain: "#f8fafc", backgroundSurface: "#ffffff", backgroundCard: "#ffffff", backgroundSoft: "#e2e8f0", textMain: "#0f172a", textMuted: "#334155", textSoft: "#64748b", borderColor: "rgba(15, 23, 42, 0.14)", buttonText: "#ffffff", chipBg: "rgba(15, 118, 110, 0.10)", chipText: "#0f766e", inputBg: "#ffffff", inputText: "#0f172a", heroOverlayStart: "rgba(255, 255, 255, 0.80)", heroOverlayEnd: "rgba(255, 255, 255, 0.28)", shadow: "rgba(15, 23, 42, 0.14)"
    ,
      tabBg: "#ffffff", tabText: "#0f172a", tabBorder: "rgba(15, 23, 42, 0.14)", tabActiveText: "#ffffff"
    },
    "soft-pink": {
      themeName: "soft-pink", label: "Soft Pink", mode: "light", primary: "#be185d", secondary: "#db2777", backgroundMain: "#fff7fb", backgroundSurface: "#ffffff", backgroundCard: "#ffffff", backgroundSoft: "#fce7f3", textMain: "#1f1720", textMuted: "#4a3340", textSoft: "#7a5a69", borderColor: "rgba(190, 24, 93, 0.18)", buttonText: "#ffffff", chipBg: "rgba(190, 24, 93, 0.10)", chipText: "#9d174d", inputBg: "#ffffff", inputText: "#1f1720", heroOverlayStart: "rgba(255, 247, 251, 0.82)", heroOverlayEnd: "rgba(255, 247, 251, 0.28)", shadow: "rgba(190, 24, 93, 0.13)"
    ,
      tabBg: "#ffffff", tabText: "#1f1720", tabBorder: "rgba(190, 24, 93, 0.18)", tabActiveText: "#ffffff"
    },
    "emerald-fresh": {
      themeName: "emerald-fresh", label: "Emerald Fresh", mode: "light", primary: "#047857", secondary: "#059669", backgroundMain: "#f0fdf4", backgroundSurface: "#ffffff", backgroundCard: "#ffffff", backgroundSoft: "#dcfce7", textMain: "#052e16", textMuted: "#14532d", textSoft: "#166534", borderColor: "rgba(4, 120, 87, 0.18)", buttonText: "#ffffff", chipBg: "rgba(4, 120, 87, 0.10)", chipText: "#047857", inputBg: "#ffffff", inputText: "#052e16", heroOverlayStart: "rgba(240, 253, 244, 0.82)", heroOverlayEnd: "rgba(240, 253, 244, 0.28)", shadow: "rgba(4, 120, 87, 0.13)"
    ,
      tabBg: "#ffffff", tabText: "#052e16", tabBorder: "rgba(4, 120, 87, 0.18)", tabActiveText: "#ffffff"
    },
    "purple-night": {
      themeName: "purple-night", label: "Purple Night", mode: "dark", primary: "#c084fc", secondary: "#a855f7", backgroundMain: "#0f0718", backgroundSurface: "#180f25", backgroundCard: "#211331", backgroundSoft: "#312047", textMain: "#faf5ff", textMuted: "#ddd6fe", textSoft: "#c4b5fd", borderColor: "rgba(192, 132, 252, 0.22)", buttonText: "#1f0b33", chipBg: "rgba(192, 132, 252, 0.14)", chipText: "#e9d5ff", inputBg: "#13091f", inputText: "#faf5ff", heroOverlayStart: "rgba(15, 7, 24, 0.80)", heroOverlayEnd: "rgba(15, 7, 24, 0.32)", shadow: "rgba(0, 0, 0, 0.36)"
    ,
      tabBg: "#211331", tabText: "#f3e8ff", tabBorder: "rgba(192, 132, 252, 0.22)", tabActiveText: "#1f0b33"
    },
    "red-velvet": {
      themeName: "red-velvet", label: "Red Velvet", mode: "dark", primary: "#fb7185", secondary: "#f43f5e", backgroundMain: "#16070b", backgroundSurface: "#240d13", backgroundCard: "#301018", backgroundSoft: "#4a1d2a", textMain: "#fff1f2", textMuted: "#fecdd3", textSoft: "#fda4af", borderColor: "rgba(251, 113, 133, 0.22)", buttonText: "#2a0a10", chipBg: "rgba(251, 113, 133, 0.14)", chipText: "#ffe4e6", inputBg: "#18070b", inputText: "#fff1f2", heroOverlayStart: "rgba(22, 7, 11, 0.80)", heroOverlayEnd: "rgba(22, 7, 11, 0.32)", shadow: "rgba(0, 0, 0, 0.36)"
    ,
      tabBg: "#301018", tabText: "#ffe4e6", tabBorder: "rgba(251, 113, 133, 0.22)", tabActiveText: "#2a0a10"
    },
    "blue-ocean": {
      themeName: "blue-ocean", label: "Blue Ocean", mode: "dark", primary: "#60a5fa", secondary: "#3b82f6", backgroundMain: "#061226", backgroundSurface: "#0b1d3a", backgroundCard: "#10284d", backgroundSoft: "#1e3a5f", textMain: "#eff6ff", textMuted: "#bfdbfe", textSoft: "#93c5fd", borderColor: "rgba(96, 165, 250, 0.22)", buttonText: "#061226", chipBg: "rgba(96, 165, 250, 0.14)", chipText: "#dbeafe", inputBg: "#07172e", inputText: "#eff6ff", heroOverlayStart: "rgba(6, 18, 38, 0.80)", heroOverlayEnd: "rgba(6, 18, 38, 0.32)", shadow: "rgba(0, 0, 0, 0.36)"
    ,
      tabBg: "#10284d", tabText: "#dbeafe", tabBorder: "rgba(96, 165, 250, 0.22)", tabActiveText: "#061226"
    },
    "gold-luxury": {
      themeName: "gold-luxury", label: "Gold Luxury", mode: "dark", primary: "#facc15", secondary: "#f59e0b", backgroundMain: "#120d05", backgroundSurface: "#1f1608", backgroundCard: "#2a1f0d", backgroundSoft: "#3b2a12", textMain: "#fffbeb", textMuted: "#fde68a", textSoft: "#fbbf24", borderColor: "rgba(250, 204, 21, 0.24)", buttonText: "#120d05", chipBg: "rgba(250, 204, 21, 0.14)", chipText: "#fef3c7", inputBg: "#171006", inputText: "#fffbeb", heroOverlayStart: "rgba(18, 13, 5, 0.80)", heroOverlayEnd: "rgba(18, 13, 5, 0.32)", shadow: "rgba(0, 0, 0, 0.36)"
    ,
      tabBg: "#2a1f0d", tabText: "#fef3c7", tabBorder: "rgba(250, 204, 21, 0.24)", tabActiveText: "#120d05"
    }
  };

  const handleSelectPreset = async (key: string) => {
    const preset = PRESETS[key] || PRESETS["dark-cyan"];
    setThemeForm({ ...preset });
    if (typeof window !== "undefined") {
      const { applyGlobalTheme } = await import("../../utils/theme");
      applyGlobalTheme(preset);
    }
  };

  const resetToSafeDefaultTheme = async () => {
    try {
      setSavingTheme(true);
      const safeTheme = PRESETS["dark-cyan"];

      if (firebaseReady && db) {
        await setDoc(doc(db, "settings", "theme"), {
          ...safeTheme,
          updatedAt: serverTimestamp()
        }, { merge: false });
      }

      setThemeForm(safeTheme);
      if (typeof window !== "undefined") {
        const { applyGlobalTheme } = await import("../../utils/theme");
        applyGlobalTheme(safeTheme);
      }

      toast.success("Tema dikembalikan ke Dark Cyan aman");
    } catch (error: any) {
      toast.error("Gagal reset tema: " + error.message);
    } finally {
      setSavingTheme(false);
    }
  };

  const handleSaveTheme = async () => {
    if (savingTheme) return;
    try {
      setSavingTheme(true);
      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif");
        return;
      }

      const presetBase = PRESETS[themeForm.themeName] || PRESETS["dark-cyan"];

      const tmpCleanTheme: any = {
        ...presetBase,
        ...themeForm,
        updatedAt: serverTimestamp()
      };

      const cleanTheme = removeUndefinedDeep(tmpCleanTheme);

      await setDoc(doc(db, "settings", "theme"), cleanTheme, { merge: false });

      // Apply dynamically so admin sees it right away
      if (typeof window !== "undefined") {
        const applyGlobalTheme = (await import("../../utils/theme")).applyGlobalTheme;
        applyGlobalTheme(cleanTheme);
      }

      toast.success("Tema seluruh web berhasil disimpan");
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal menyimpan tema: " + error.message);
    } finally {
      setSavingTheme(false);
    }
  };

  const previewTheme = async () => {
    if (typeof window !== "undefined") {
      const applyGlobalTheme = (await import("../../utils/theme")).applyGlobalTheme;
      applyGlobalTheme(themeForm);
      toast.success("Preview tema diterapkan sementara");
    }
  };

  const autoFixContrast = async () => {
    if (typeof window !== "undefined") {
      const { getAutoTextColor, getAutoMutedTextColor, getBrightness } = await import("../../utils/theme");
      setThemeForm((prev: any) => ({
        ...prev,
        textMain: getAutoTextColor(prev.backgroundMain),
        textMuted: getAutoMutedTextColor(prev.backgroundMain),
        buttonText: getBrightness(prev.primary) > 0.55 ? "#0f172a" : "#ffffff"
      }));
      toast.success("Kontras disesuaikan otomatis");
    }
  };

  const resetToDefault = () => {
    handleSelectPreset("dark-cyan");
  };

  return (
    <div className="web-settings-clean-page">
      <div className="web-settings-clean-header">
        <div>
          <span className="web-settings-clean-badge">TEMA & WARNA</span>
          <h1>Tema Seluruh Web</h1>
          <p>Ubah warna dan mode seluruh tampilan website.</p>
        </div>
      </div>

      <div className="web-settings-clean-info">
        Fitur ini mengubah tema global secara instan. Pastikan warna teks bisa dibaca di atas warna background.
      </div>

      {/* PRESETS GRID */}
      <section className="web-settings-clean-card">
        <div className="web-settings-clean-card-head">
          <h2>Preset Tema</h2>
          <p>Pilih kombinasi warna yang sudah disediakan.</p>
        </div>
        <div className="theme-preset-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {Object.entries(PRESETS).map(([key, preset]) => (
            <div 
              key={key} 
              className={`theme-preset-card ${themeForm.themeName === key ? 'active' : ''}`}
              onClick={() => handleSelectPreset(key)}
              style={{
                padding: '16px',
                borderRadius: '20px',
                background: 'var(--theme-bg-card)',
                border: themeForm.themeName === key ? '2px solid var(--theme-primary)' : '1px solid var(--theme-border)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800, color: 'var(--theme-text-main)' }}>{preset.label}</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--theme-text-muted)' }}>Mode: {preset.mode}</p>
              
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.backgroundMain, border: '1px solid rgba(255,255,255,0.2)' }} />
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.primary, border: '1px solid rgba(255,255,255,0.2)' }} />
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: preset.textMain, border: '1px solid rgba(255,255,255,0.2)' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOM EDITOR & PREVIEW */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <section className="web-settings-clean-card" style={{ flex: '1 1 500px' }}>
          <div className="web-settings-clean-card-head">
            <h2>Custom Theme Editor</h2>
            <p>Atur warna satuan sesuai keinginan.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {['primary', 'backgroundMain', 'backgroundSurface', 'backgroundCard', 'textMain', 'textMuted'].map((field) => (
              <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--theme-text-muted)', textTransform: 'capitalize' }}>
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="color" 
                    value={themeForm[field] || '#000000'} 
                    onChange={e => setThemeForm({ ...themeForm, [field]: e.target.value, themeName: 'custom' })}
                    style={{ width: '44px', height: '44px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  />
                  <input 
                    type="text" 
                    value={themeForm[field] || ''} 
                    onChange={e => setThemeForm({ ...themeForm, [field]: e.target.value, themeName: 'custom' })}
                    style={{ flex: 1, height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--theme-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--theme-text-main)' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
             <button type="button" onClick={autoFixContrast} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--theme-border)', borderRadius: '8px', color: 'var(--theme-text-main)', cursor: 'pointer', fontSize: '13px' }}>
               Sesuaikan Kontras Otomatis
             </button>
             <select 
                value={themeForm.mode || 'dark'} 
                onChange={e => setThemeForm({ ...themeForm, mode: e.target.value, themeName: 'custom' })}
                style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--theme-border)', borderRadius: '8px', color: 'var(--theme-text-main)', outline: 'none' }}
              >
               <option value="dark">Mode Gelap</option>
               <option value="light">Mode Terang</option>
             </select>
          </div>
        </section>

        <section className="web-settings-clean-card" style={{ flex: '1 1 300px' }}>
          <div className="web-settings-clean-card-head">
            <h2>Live Preview Warna</h2>
            <p>Contoh tampilan dengan warna saat ini.</p>
          </div>
          
          <div style={{
            background: themeForm.backgroundMain,
            padding: '24px',
            borderRadius: '16px',
            border: `1px solid ${themeForm.borderColor || 'transparent'}`
          }}>
             <div style={{
               background: themeForm.backgroundCard,
               padding: '20px',
               borderRadius: '16px',
               border: `1px solid ${themeForm.borderColor || 'transparent'}`,
               boxShadow: `0 10px 20px ${themeForm.shadow || 'rgba(0,0,0,0)'}`
             }}>
                <h4 style={{ color: themeForm.textMain, margin: '0 0 8px', fontSize: '18px' }}>Text Utama</h4>
                <p style={{ color: themeForm.textMuted, margin: '0 0 20px', fontSize: '14px', lineHeight: 1.5 }}>
                  Ini adalah contoh warna text redup / muted yang biasa dipakai untuk deskripsi agar tidak terlalu mencolok.
                </p>
                <button style={{
                  background: themeForm.primary,
                  color: themeForm.buttonText,
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  Contoh Tombol Primary
                </button>
             </div>
          </div>
        </section>
      </div>

      <div className="web-settings-clean-save-row" style={{ gap: '12px' }}>
        <button type="button" onClick={resetToSafeDefaultTheme} style={{ padding: '0 24px', background: 'transparent', border: '1px solid var(--theme-border)', borderRadius: '16px', color: 'var(--theme-text-muted)', cursor: 'pointer', fontWeight: 600 }}>
          Reset ke Dark Cyan Aman
        </button>
        <button type="button" onClick={previewTheme} style={{ padding: '0 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--theme-border)', borderRadius: '16px', color: 'var(--theme-text-main)', cursor: 'pointer', fontWeight: 600 }}>
          Preview Sementara
        </button>
        <button type="button" className="web-settings-clean-save-button" onClick={handleSaveTheme} disabled={savingTheme}>
          {savingTheme ? "Menyimpan..." : "Simpan Tema Web"}
        </button>
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
            <input type="checkbox" checked={payload.autoplay} onChange={e => setPayload({...payload, autoplay: e.target.checked})} className="w-5 h-5 accent-[var(--theme-primary)] rounded cursor-pointer" />
          </label>
          <label className="admin-toggle-card cursor-pointer">
            <div>
              <h4>Loop Audio</h4>
              <p>Ulangi lagu saat sudah selesai</p>
            </div>
            <input type="checkbox" checked={payload.loop} onChange={e => setPayload({...payload, loop: e.target.checked})} className="w-5 h-5 accent-[var(--theme-primary)] rounded cursor-pointer" />
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
            <input type="checkbox" checked={payload.showFooter} onChange={e => setPayload({...payload, showFooter: e.target.checked})} className="w-5 h-5 accent-[var(--theme-primary)] rounded cursor-pointer" />
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
              <label className="flex items-center gap-3 cursor-pointer text-[var(--theme-text-main)]">
                <input type="checkbox" checked={payload.contactButton} onChange={e => setPayload({...payload, contactButton: e.target.checked})} className="w-5 h-5 accent-[var(--theme-primary)] rounded cursor-pointer" />
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
    <div className="web-settings-clean-page">
      <div className="web-settings-clean-header">
        <div>
          <span className="web-settings-clean-badge">SERVER & WEB</span>
          <h1>Pengaturan Web</h1>
          <p>Atur fitur utama website yang ingin ditampilkan atau disembunyikan.</p>
        </div>
      </div>

      <div className="web-settings-clean-info">
        Pengaturan ini hanya mempengaruhi tampilan website publik. Admin Panel tetap harus selalu terlihat jelas dan bisa diedit.
      </div>

      <section className="web-settings-clean-card">
        <div className="web-settings-clean-card-head">
          <h2>Toggle Fitur Utama</h2>
          <p>Aktifkan atau nonaktifkan fitur utama di website.</p>
        </div>

        <div className="web-settings-clean-toggle-grid">
          <label className="web-settings-clean-toggle-card">
            <div>
              <h3>Website Aktif</h3>
              <p>Biarkan user mengakses website publik.</p>
            </div>
            <input
              type="checkbox"
              checked={payload.websiteEnabled}
              onChange={(e) => setPayload(prev => ({ ...prev, websiteEnabled: e.target.checked }))}
            />
          </label>

          <label className="web-settings-clean-toggle-card">
            <div>
              <h3>Tampilkan Slider</h3>
              <p>Banner promosi di beranda.</p>
            </div>
            <input
              type="checkbox"
              checked={payload.showSlider}
              onChange={(e) => setPayload(prev => ({ ...prev, showSlider: e.target.checked }))}
            />
          </label>

          <label className="web-settings-clean-toggle-card">
            <div>
              <h3>Tampilkan Audio</h3>
              <p>Tombol musik di pojok kanan.</p>
            </div>
            <input
              type="checkbox"
              checked={payload.showAudioBtn}
              onChange={(e) => setPayload(prev => ({ ...prev, showAudioBtn: e.target.checked }))}
            />
          </label>

          <label className="web-settings-clean-toggle-card">
            <div>
              <h3>Tampilkan Footer</h3>
              <p>Info di paling bawah website.</p>
            </div>
            <input
              type="checkbox"
              checked={payload.showFooter}
              onChange={(e) => setPayload(prev => ({ ...prev, showFooter: e.target.checked }))}
            />
          </label>

          <label className="web-settings-clean-toggle-card">
            <div>
              <h3>Tombol WhatsApp</h3>
              <p>Tombol share/order ke WA.</p>
            </div>
            <input
              type="checkbox"
              checked={payload.showWaBtn}
              onChange={(e) => setPayload(prev => ({ ...prev, showWaBtn: e.target.checked }))}
            />
          </label>
        </div>
      </section>

      <section className="web-settings-clean-card">
        <div className="web-settings-clean-card-head">
          <h2>Mode Info Homepage</h2>
          <p>Atur teks info kecil di halaman utama.</p>
        </div>

        <select
          value={payload.infoDisplayMode}
          onChange={e => setPayload({...payload, infoDisplayMode: e.target.value})}
        >
          <option value="runtime">Tampilkan Server Status Saja</option>
          <option value="datetime">Tampilkan Jam & Waktu Saja</option>
          <option value="both">Tampilkan Keduannya</option>
          <option value="hidden">Sembunyikan Semua Info</option>
        </select>
      </section>

      <div className="web-settings-clean-save-row">
        <button type="button" className="web-settings-clean-save-button" onClick={handleSave} disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
};

// --- HEADER VIEW ---
export const HeaderView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    showLogo: false,
    showStoreName: true,
    showTagline: true,
    headerStyle: "premium",
    headerHeight: "normal",
    leftDisplayMode: "text-only",
    menuButtonStyle: "rounded-cyan",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.header) {
      setPayload({
        showLogo: !!settings.header.showLogo,
        showStoreName: settings.header.showStoreName !== false,
        showTagline: settings.header.showTagline !== false,
        headerStyle: settings.header.headerStyle || "premium",
        headerHeight: settings.header.headerHeight || "normal",
        leftDisplayMode: settings.header.leftDisplayMode || "text-only",
        menuButtonStyle: settings.header.menuButtonStyle || "rounded-cyan",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif");
        return;
      }
      await setDoc(doc(db, "settings", "header"), removeUndefinedDeep({
        ...payload,
        updatedAt: serverTimestamp()
      }), { merge: true });
      toast.success("Pengaturan header berhasil disimpan");
    } catch (error: any) {
      toast.error("Gagal menyimpan header: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Header Atas</h1>
        <p>Atur tampilan navigasi atas website</p>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Tampilan Elemen</h2>
          <p>Toggle elemen yang ingin ditampilkan</p>
        </div>
        <div className="admin-toggle-grid">
          <label className="admin-toggle-card">
            <div>
              <h3>Tampilkan Logo</h3>
              <p>Munculkan logo brand</p>
            </div>
            <input type="checkbox" checked={payload.showLogo} onChange={e => setPayload({...payload, showLogo: e.target.checked})} />
          </label>
          <label className="admin-toggle-card">
            <div>
              <h3>Tampilkan Nama</h3>
              <p>Munculkan nama toko</p>
            </div>
            <input type="checkbox" checked={payload.showStoreName} onChange={e => setPayload({...payload, showStoreName: e.target.checked})} />
          </label>
          <label className="admin-toggle-card">
            <div>
              <h3>Tampilkan Tagline</h3>
              <p>Munculkan slogan header</p>
            </div>
            <input type="checkbox" checked={payload.showTagline} onChange={e => setPayload({...payload, showTagline: e.target.checked})} />
          </label>
        </div>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Gaya Header</h2>
          <p>Konfigurasi visual detail</p>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Mode Tampilan Kiri</label>
            <select value={payload.leftDisplayMode} onChange={e => setPayload({...payload, leftDisplayMode: e.target.value})}>
              <option value="text-only">Hanya Teks</option>
              <option value="logo-only">Hanya Logo</option>
              <option value="both">Logo & Teks</option>
            </select>
          </div>
          <div className="admin-form-field">
            <label>Style Header</label>
            <select value={payload.headerStyle} onChange={e => setPayload({...payload, headerStyle: e.target.value})}>
              <option value="premium">Premium Glass</option>
              <option value="minimal">Minimalist</option>
              <option value="bold">Bold Solid</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Header"}
        </button>
      </div>
    </div>
  );
};

// --- HERO VIEW ---
export const HeroView = ({ settings, slides }: { settings: any, slides: any[] }) => {
  const [payload, setPayload] = useState({
    badgeText: "Premium Digital Store",
    title: "Cloud VPS Berkualitas",
    titleAccent: "Berkualitas",
    description: "Performa stabil untuk panel, website, bot WhatsApp, dan sistem digital Anda.",
    imageUrl: "",
    overlayStrength: 45,
    showButton: false,
    buttonText: "Lihat Layanan",
    buttonTarget: "services",
    showFullscreenButton: true,
    sliderAutoplay: true,
    sliderDelay: 5000,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.hero) {
      setPayload({
        badgeText: settings.hero.badgeText || "",
        title: settings.hero.title || "",
        titleAccent: settings.hero.titleAccent || "",
        description: settings.hero.description || "",
        imageUrl: settings.hero.imageUrl || "",
        overlayStrength: settings.hero.overlayStrength || 45,
        showButton: !!settings.hero.showButton,
        buttonText: settings.hero.buttonText || "Lihat Layanan",
        buttonTarget: settings.hero.buttonTarget || "services",
        showFullscreenButton: settings.hero.showFullscreenButton !== false,
        sliderAutoplay: settings.hero.sliderAutoplay !== false,
        sliderDelay: settings.hero.sliderDelay || 5000,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif");
        return;
      }
      await setDoc(doc(db, "settings", "hero"), removeUndefinedDeep({
        ...payload,
        updatedAt: serverTimestamp()
      }), { merge: true });
      toast.success("Pengaturan hero berhasil disimpan");
    } catch (error: any) {
      toast.error("Gagal menyimpan hero: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Hero / Banner</h1>
        <p>Atur banner utama di halaman depan</p>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Teks Banner</h2>
          <p>Teks utama yang muncul di atas gambar</p>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Badge Kecil</label>
            <input value={payload.badgeText} onChange={e => setPayload({...payload, badgeText: e.target.value})} placeholder="Misal: Premium Digital Store" />
          </div>
          <div className="admin-form-field">
            <label>Judul Hero</label>
            <input value={payload.title} onChange={e => setPayload({...payload, title: e.target.value})} placeholder="Judul besar" />
          </div>
          <div className="admin-form-field">
            <label>Kata Accent Judul</label>
            <input value={payload.titleAccent} onChange={e => setPayload({...payload, titleAccent: e.target.value})} placeholder="Kata yang berwarna beda" />
          </div>
          <div className="admin-form-field full">
            <label>Deskripsi Hero</label>
            <textarea value={payload.description} onChange={e => setPayload({...payload, description: e.target.value})} rows={3} />
          </div>
        </div>
      </div>

      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2>Tampilan & Gambar</h2>
          <p>Wallpaper dan overlay</p>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-field full">
            <label>URL Gambar Banner (Fallback)</label>
            <input value={payload.imageUrl} onChange={e => setPayload({...payload, imageUrl: e.target.value})} placeholder="https://..." />
          </div>
          <div className="admin-form-field">
            <label>Kekuatan Overlay Gelap (%)</label>
            <input type="number" value={payload.overlayStrength} onChange={e => setPayload({...payload, overlayStrength: parseInt(e.target.value)})} />
          </div>
        </div>
      </div>

      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Hero"}
        </button>
      </div>
    </div>
  );
};

// --- CATEGORY TABS VIEW ---
export const CategoryTabsView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    tabsTitle: "",
    style: "cute-premium-pill",
    allowHorizontalScroll: true,
    showActiveIcon: true,
    activeIcon: "✦",
    tabs: [] as any[],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.categoryTabs) {
      setPayload({
        tabsTitle: settings.categoryTabs.tabsTitle || "",
        style: settings.categoryTabs.style || "cute-premium-pill",
        allowHorizontalScroll: settings.categoryTabs.allowHorizontalScroll !== false,
        showActiveIcon: settings.categoryTabs.showActiveIcon !== false,
        activeIcon: settings.categoryTabs.activeIcon || "✦",
        tabs: settings.categoryTabs.tabs || [],
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      await setDoc(doc(db, "settings", "categoryTabs"), removeUndefinedDeep({
        ...payload,
        updatedAt: serverTimestamp()
      }), { merge: true });
      toast.success("Tab kategori berhasil disimpan");
    } catch (error: any) {
      toast.error("Gagal menyimpan tab");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Tab Kategori</h1>
        <p>Atur navigasi filter produk di beranda</p>
      </div>

      <div className="admin-section-card">
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Style Tab</label>
            <select value={payload.style} onChange={e => setPayload({...payload, style: e.target.value})}>
              <option value="cute-premium-pill">Cute Premium Pill</option>
              <option value="glass-tab">Glass Tab</option>
              <option value="underline-bar">Underline Bar</option>
            </select>
          </div>
          <div className="admin-form-field">
            <label>Icon Aktif</label>
            <input value={payload.activeIcon} onChange={e => setPayload({...payload, activeIcon: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving}>Simpan Tab</button>
      </div>
    </div>
  );
};

// --- SERVICE SECTION VIEW ---
export const ServiceSectionView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState({
    badgeText: "Digital Service Hub",
    title: "Pusat Layanan Digital",
    description: "Kelola kebutuhan digital Anda dalam satu tempat.",
    showPlayButton: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.serviceSection) {
      setPayload({
        badgeText: settings.serviceSection.badgeText || "",
        title: settings.serviceSection.title || "",
        description: settings.serviceSection.description || "",
        showPlayButton: settings.serviceSection.showPlayButton !== false,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      await setDoc(doc(db, "settings", "serviceSection"), removeUndefinedDeep({
        ...payload,
        updatedAt: serverTimestamp()
      }), { merge: true });
      toast.success("Section layanan berhasil disimpan");
    } catch (error: any) {
      toast.error("Gagal menyimpan section");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Section Layanan</h1>
        <p>Edit teks di area "Pusat Layanan Digital"</p>
      </div>
      <div className="admin-section-card">
        <div className="admin-form-grid">
          <AdminInput label="Badge Text" value={payload.badgeText} onChange={e => setPayload({...payload, badgeText: e.target.value})} />
          <AdminInput label="Judul Section" value={payload.title} onChange={e => setPayload({...payload, title: e.target.value})} />
          <div className="admin-form-field full">
            <label>Deskripsi Section</label>
            <textarea value={payload.description} onChange={e => setPayload({...payload, description: e.target.value})} rows={3} />
          </div>
        </div>
      </div>
      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving}>Simpan</button>
      </div>
    </div>
  );
};

// --- STATS VIEW ---
export const StatsView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState<any[]>([
    { id: "support", icon: "🎧", value: "24/7", label: "Support", active: true },
    { id: "fast", icon: "⚡", value: "Fast", label: "Response", active: true },
    { id: "active", icon: "▰", value: "Aktif", label: "Layanan", active: true },
    { id: "easy", icon: "✓", value: "Mudah", label: "Order", active: true }
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.statsSection?.stats) {
      setPayload(settings.statsSection.stats);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, "settings", "statsSection"), removeUndefinedDeep({
        stats: payload,
        updatedAt: serverTimestamp()
      }), { merge: true });
      toast.success("Statistik berhasil disimpan");
    } catch (e) {
      toast.error("Gagal simpan statistik");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header"><h1>Statistik Website</h1><p>Edit card angka di beranda</p></div>
      <div className="admin-form-grid">
        {payload.map((s, idx) => (
          <div key={s.id} className="admin-section-card">
            <div className="flex gap-2 mb-2">
              <input style={{width: '40px'}} value={s.icon} onChange={e => {
                const n = [...payload];
                n[idx].icon = e.target.value;
                setPayload(n);
              }} />
              <input value={s.value} onChange={e => {
                const n = [...payload];
                n[idx].value = e.target.value;
                setPayload(n);
              }} />
            </div>
            <input value={s.label} onChange={e => {
              const n = [...payload];
              n[idx].label = e.target.value;
              setPayload(n);
            }} />
          </div>
        ))}
      </div>
      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving}>Simpan Statistik</button>
      </div>
    </div>
  );
};

// --- FLOW VIEW ---
export const FlowView = ({ settings }: { settings: any }) => {
  const [title, setTitle] = useState("Alur Layanan");
  const [desc, setDesc] = useState("");
  const [steps, setSteps] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.flowSection) {
      setTitle(settings.flowSection.title || "");
      setDesc(settings.flowSection.description || "");
      setSteps(settings.flowSection.steps || []);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, "settings", "flowSection"), removeUndefinedDeep({
        title, description: desc, steps, updatedAt: serverTimestamp()
      }), { merge: true });
      toast.success("Alur layanan disimpan");
    } catch (e) { toast.error("Gagal simpan alur"); } finally { setSaving(false); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header"><h1>Alur Layanan</h1><p>Edit langkah-langkah order</p></div>
      <div className="admin-section-card">
        <AdminInput label="Judul Section" value={title} onChange={e => setTitle(e.target.value)} />
        <AdminInput label="Deskripsi Section" value={desc} onChange={e => setDesc(e.target.value)} />
      </div>
      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving}>Simpan Alur</button>
      </div>
    </div>
  );
};

// --- BENEFITS VIEW ---
export const BenefitsView = ({ settings }: { settings: any }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [benefits, setBenefits] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.benefitsSection) {
      setTitle(settings.benefitsSection.title || "");
      setDesc(settings.benefitsSection.description || "");
      setBenefits(settings.benefitsSection.benefits || []);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, "settings", "benefitsSection"), removeUndefinedDeep({
        title, description: desc, benefits, updatedAt: serverTimestamp()
      }), { merge: true });
      toast.success("Benefit disimpan");
    } catch (e) { toast.error("Gagal simpan benefit"); } finally { setSaving(false); }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header"><h1>Keunggulan / Benefit</h1><p>Edit list keunggulan layanan</p></div>
      <div className="admin-section-card">
        <AdminInput label="Judul Section" value={title} onChange={e => setTitle(e.target.value)} />
        <AdminInput label="Deskripsi Section" value={desc} onChange={e => setDesc(e.target.value)} />
      </div>
      <div className="admin-save-row">
        <button className="admin-save-button" onClick={handleSave} disabled={saving}>Simpan Benefit</button>
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
      <h2 className="text-xl font-bold text-[var(--theme-text-main)] mb-6">Debug Firebase</h2>
      <div className="flex flex-col gap-4">
        <div className="p-4 bg-[var(--theme-bg-surface)] rounded-xl border border-[#1e293b] flex flex-col gap-2">
           <div className="flex justify-between items-center text-sm">
             <span className="text-[var(--theme-text-soft)]">Firebase Ready</span>
             <span className={`font-bold ${firebaseReady ? 'text-emerald-400' : 'text-red-400'}`}>
               {firebaseReady ? 'TRUE' : 'FALSE'}
             </span>
           </div>
           <div className="flex justify-between items-center text-sm">
             <span className="text-[var(--theme-text-soft)]">Firestore Instance</span>
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

