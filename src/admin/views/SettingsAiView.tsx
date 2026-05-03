import React, { useState, useEffect } from "react";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { removeUndefinedDeep } from "../utils/helpers";
import { AdminInput, AdminButton } from "../components/ui-elements";
import { DEFAULT_ELAINA_SETTINGS } from "../../constants";

export const SettingsAiView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState(DEFAULT_ELAINA_SETTINGS);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      if (settings?.elainaChat) {
        setPayload({ ...DEFAULT_ELAINA_SETTINGS, ...settings.elainaChat });
      } else {
        setPayload(DEFAULT_ELAINA_SETTINGS);
      }
    }
  }, [settings, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsEditing(true);
    const { name, value } = e.target;
    setPayload(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (roleName: string, field: 'tone' | 'example' | 'minChat', value: string | number) => {
    setIsEditing(true);
    setPayload(prev => ({
      ...prev,
      roles: {
        ...prev.roles,
        [roleName]: {
          ...prev.roles[roleName],
          [field]: value
        }
      }
    }));
  };

  const handleReset = () => {
    setIsEditing(true);
    setPayload(DEFAULT_ELAINA_SETTINGS);
    toast.success("Form direset ke default. Klik Simpan untuk menerapkan.");
  };

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);
      if (!firebaseReady || !db) {
        toast.error("Firebase belum aktif. Cek setting.js");
        return;
      }

      const cleanPayload = removeUndefinedDeep({
        ...payload,
        updatedAt: serverTimestamp()
      });

      await setDoc(doc(db, "settings", "elainaChat"), cleanPayload, { merge: true });

      setIsEditing(false);
      toast.success("Pengaturan Elaina Chat berhasil disimpan");
    } catch (error: any) {
      console.error("SAVE ELAINA SETTINGS ERROR:", error);
      toast.error("Gagal menyimpan Pengaturan Elaina Chat: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const renderInputGroup = (label: string, name: keyof typeof DEFAULT_ELAINA_SETTINGS, isTextarea: boolean = false) => (
    <div className="mb-4" key={name}>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      {isTextarea ? (
        <textarea
          name={name}
          // @ts-ignore
          value={payload[name] || ""}
          onChange={handleChange}
          rows={3}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
        />
      ) : (
        <AdminInput
          name={name as string}
          // @ts-ignore
          value={payload[name] || ""}
          onChange={handleChange}
          placeholder={label}
        />
      )}
    </div>
  );

  const handleResetUsers = async () => {
    if (!firebaseReady || !db) {
      toast.error("Firebase belum aktif");
      return;
    }
    if (!confirm("Yakin ingin mereset chat count dan role semua user?")) return;
    
    try {
      setSaving(true);
      const { collection, getDocs, writeBatch } = await import("firebase/firestore");
      const usersRef = collection(db, "users");
      const snap = await getDocs(usersRef);
      
      const batch = writeBatch(db);
      let count = 0;
      snap.forEach(docSnap => {
        batch.update(docSnap.ref, {
          chatCount: 0,
          relationshipRole: "Baru kenal"
        });
        count++;
      });
      if (count > 0) {
        await batch.commit();
        toast.success(`Berhasil reset ${count} user.`);
      } else {
        toast.success("Tidak ada user untuk direset.");
      }
    } catch(err: any) {
      toast.error("Gagal reset user: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Pengaturan Elaina Chat</h1>
        <p>Atur gaya bicara karakter untuk tiap-tiap level kedekatan (role).</p>
      </div>

      <div className="admin-help-box">
        <strong>💬 Pengaturan Elaina Chat</strong>
        <p>Atur cara bicara Elaina dan role kedekatan user berdasarkan jumlah interaksi chat mereka.</p>
      </div>

      <div className="admin-two-column-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="admin-section-card" style={{ marginBottom: 0 }}>
            <div className="admin-section-header">
              <h2>Identitas Elaina</h2>
              <p>Informasi dasar karakter AI</p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", padding: "16px", backgroundColor: "rgba(15, 23, 42, 0.4)", borderRadius: "16px", border: "1px dashed rgba(34, 211, 238, 0.2)" }}>
               <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #22d3ee, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
                 ✨
               </div>
               <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "16px", fontWeight: "bold" }}>{payload.characterName || "Elaina"}</h3>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>Asisten Virtual</p>
               </div>
            </div>

            <div className="admin-form-grid full">
              <div className="admin-form-field">
                <label>Nama Karakter Output</label>
                <input 
                  name="characterName"
                  value={payload.characterName}
                  onChange={handleChange}
                  placeholder="Contoh: Elaina"
                />
              </div>
              <div className="admin-form-field">
                <label>Max History Chat (Memori Pokok)</label>
                <input
                  type="number"
                  name="maxHistory"
                  value={payload.maxHistory || 12}
                  onChange={handleChange}
                  min="2" max="20"
                />
                <small>Jumlah memori urutan chat yang diingat agar tetap nyambung.</small>
              </div>
              <div className="admin-form-field full">
                <label>Pesan Pembuka (Welcome Message)</label>
                <textarea
                  name="welcomeMessage"
                  value={payload.welcomeMessage}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Gunakan {userName} untuk memanggil nama pendaftar"
                />
              </div>
              <div className="admin-form-field full" style={{ marginTop: '5px' }}>
                 <label className="admin-toggle-card cursor-pointer" style={{ margin: 0 }}>
                    <div>
                      <h4 style={{ color: payload.allowRomanticRole ? '#22d3ee' : '#fff' }}>Aktifkan Role Romantis</h4>
                      <p>Role Pacar/Suami tersedia jika chat banyak</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={payload.allowRomanticRole} 
                      onChange={(e) => { setIsEditing(true); setPayload(p => ({ ...p, allowRomanticRole: e.target.checked })); }}
                      className="w-5 h-5 accent-[#22d3ee] rounded cursor-pointer" 
                    />
                  </label>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="admin-section-card" style={{ marginBottom: 0 }}>
            <div className="admin-section-header flex justify-between items-center" style={{ flexDirection: 'row' }}>
              <div>
                <h2>Role Kedekatan & Gaya Bicara</h2>
                <p>Sesuaikan tone berdasarkan role user</p>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {Object.entries(payload.roles).map(([roleName, roleData]: [string, any]) => (
                <div key={roleName} style={{ padding: "16px", borderRadius: "18px", backgroundColor: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold", color: "#67e8f9" }}>{roleName}</h4>
                    <span style={{ fontSize: "11px", fontWeight: "bold", color: "#94a3b8", backgroundColor: "rgba(2, 6, 23, 0.6)", padding: "4px 8px", borderRadius: "8px" }}>
                      Min: {roleData.minChat || 0} Chat
                    </span>
                  </div>
                  
                  <div className="admin-form-grid full" style={{ gap: "10px" }}>
                    <div className="admin-form-field">
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Gaya Bicara (Tone)</label>
                      <textarea
                        value={roleData.tone}
                        onChange={(e) => handleRoleChange(roleName, 'tone', e.target.value)}
                        rows={2}
                        style={{ minHeight: "60px", fontSize: "12px", padding: "8px 10px" }}
                      />
                    </div>
                    <div className="admin-form-field">
                      <label style={{ fontSize: "11px", color: "#64748b" }}>Contoh Ucapan</label>
                      <input
                        type="text"
                        value={roleData.example}
                        onChange={(e) => handleRoleChange(roleName, 'example', e.target.value)}
                        style={{ minHeight: "36px", fontSize: "12px", padding: "8px 10px" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-save-row">
        <button className="admin-reset-button" onClick={handleResetUsers} type="button" style={{ borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fb7185' }}>Reset Semua User Chat</button>
        <button className="admin-reset-button" onClick={handleReset} type="button">Reset Default</button>
        <button className="admin-save-button" onClick={handleSave} disabled={saving} type="button">
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
};
