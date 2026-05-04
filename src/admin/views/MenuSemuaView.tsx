import React, { useState, useEffect } from "react";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../../lib/firebase";
import { toast } from "react-hot-toast";
import { removeUndefinedDeep } from "../utils/helpers";
import { AdminInput, AdminButton } from "../components/ui-elements";
import { DEFAULT_MENU_SEMUA } from "../../constants";

export const MenuSemuaView = ({ settings }: { settings: any }) => {
  const [payload, setPayload] = useState(DEFAULT_MENU_SEMUA);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      if (settings?.menuSemua) {
        setPayload({ ...DEFAULT_MENU_SEMUA, ...settings.menuSemua });
      } else {
        setPayload(DEFAULT_MENU_SEMUA);
      }
    }
  }, [settings, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsEditing(true);
    const { name, value } = e.target;
    setPayload(prev => ({ ...prev, [name]: value as any }));
  };

  const handleReset = () => {
    setIsEditing(true);
    setPayload(DEFAULT_MENU_SEMUA);
    toast.success("Form direset ke default. Klik Simpan untuk menerapkan ke website.");
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

      await setDoc(doc(db, "settings", "menuSemua"), cleanPayload, { merge: true });

      toast.success("Menu Semua berhasil disimpan");
      setIsEditing(false);
    } catch (error: any) {
      console.error("SAVE MENU SEMUA ERROR:", error);
      toast.error("Gagal menyimpan Menu Semua: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const renderInputGroup = (label: string, name: keyof typeof DEFAULT_MENU_SEMUA, isTextarea: boolean = false) => (
    <div className="mb-4" key={name}>
      <label className="block text-sm font-medium text-[var(--theme-text-muted)] mb-1">{label}</label>
      {isTextarea ? (
        <textarea
          name={name}
          value={payload[name] || ""}
          onChange={handleChange}
          rows={3}
          className="w-full bg-[var(--theme-bg-surface)] border border-[var(--theme-border)] rounded-xl px-4 py-2.5 text-[var(--theme-text-main)] placeholder-[var(--theme-text-soft)] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
        />
      ) : (
        <AdminInput
          name={name}
          value={payload[name] || ""}
          onChange={handleChange}
          placeholder={label}
        />
      )}
    </div>
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--theme-text-main)]">Edit Menu Semua</h2>
          <p className="text-sm text-[var(--theme-text-soft)] mt-1">Ubah semua teks yang tampil di layar utama (Tab Semua).</p>
        </div>
        <div className="flex gap-2">
          <AdminButton onClick={handleReset} variant="outline">Reset Default</AdminButton>
          <AdminButton onClick={handleSave} saving={saving}>Simpan Menu Semua</AdminButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Hero */}
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-[var(--theme-text-main)] mb-4 border-b border-[var(--theme-border)] pb-2">1. Hero Menu Semua</h3>
          {renderInputGroup("Badge Text", "badgeText")}
          {renderInputGroup("Judul Hero", "heroTitle")}
          {renderInputGroup("Subtitle Hero", "heroSubtitle", true)}
          <div className="grid grid-cols-3 gap-2">
            {renderInputGroup("Chip 1", "chip1")}
            {renderInputGroup("Chip 2", "chip2")}
            {renderInputGroup("Chip 3", "chip3")}
          </div>
        </div>

        {/* Card 2: Alur Layanan */}
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-[var(--theme-text-main)] mb-4 border-b border-[var(--theme-border)] pb-2">2. Alur Layanan</h3>
          {renderInputGroup("Judul Section", "flowTitle")}
          {renderInputGroup("Subtitle Section", "flowSubtitle", true)}
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Step 1</span>
              {renderInputGroup("Title", "step1Title")}
              {renderInputGroup("Deskripsi", "step1Desc", true)}
            </div>
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Step 2</span>
              {renderInputGroup("Title", "step2Title")}
              {renderInputGroup("Deskripsi", "step2Desc", true)}
            </div>
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Step 3</span>
              {renderInputGroup("Title", "step3Title")}
              {renderInputGroup("Deskripsi", "step3Desc", true)}
            </div>
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Step 4</span>
              {renderInputGroup("Title", "step4Title")}
              {renderInputGroup("Deskripsi", "step4Desc", true)}
            </div>
          </div>
        </div>

        {/* Card 3: Trust */}
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-[var(--theme-text-main)] mb-4 border-b border-[var(--theme-border)] pb-2">3. Trust / Keamanan</h3>
          {renderInputGroup("Judul Trust", "trustTitle")}
          {renderInputGroup("Subtitle Trust", "trustSubtitle", true)}
          {renderInputGroup("Point 1", "trustPoint1")}
          {renderInputGroup("Point 2", "trustPoint2")}
          {renderInputGroup("Point 3", "trustPoint3")}
          {renderInputGroup("Point 4", "trustPoint4")}
          {renderInputGroup("Point 5", "trustPoint5")}
        </div>

        {/* Card 4, 6: Highlight & CTA */}
        <div className="flex flex-col gap-6">
          <div className="admin-card">
            <h3 className="text-lg font-semibold text-[var(--theme-text-main)] mb-4 border-b border-[var(--theme-border)] pb-2">4. Highlight Banner</h3>
            {renderInputGroup("Teks Highlight", "highlightText", true)}
          </div>

          <div className="admin-card">
            <h3 className="text-lg font-semibold text-[var(--theme-text-main)] mb-4 border-b border-[var(--theme-border)] pb-2">6. CTA Penutup</h3>
            {renderInputGroup("CTA Title", "ctaTitle")}
            {renderInputGroup("CTA Subtitle", "ctaSubtitle", true)}
          </div>
        </div>

        {/* Card 5: Feature Grid */}
        <div className="admin-card md:col-span-2">
          <h3 className="text-lg font-semibold text-[var(--theme-text-main)] mb-4 border-b border-[var(--theme-border)] pb-2">5. Feature Grid (8 Item)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {renderInputGroup("Judul Feature", "featureTitle")}
            {renderInputGroup("Subtitle Feature", "featureSubtitle")}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Feature 1</span>
              {renderInputGroup("Title 1", "feature1Title")}
              {renderInputGroup("Desc 1", "feature1Desc", true)}
            </div>
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Feature 2</span>
              {renderInputGroup("Title 2", "feature2Title")}
              {renderInputGroup("Desc 2", "feature2Desc", true)}
            </div>
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Feature 3</span>
              {renderInputGroup("Title 3", "feature3Title")}
              {renderInputGroup("Desc 3", "feature3Desc", true)}
            </div>
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Feature 4</span>
              {renderInputGroup("Title 4", "feature4Title")}
              {renderInputGroup("Desc 4", "feature4Desc", true)}
            </div>
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Feature 5</span>
              {renderInputGroup("Title 5", "feature5Title")}
              {renderInputGroup("Desc 5", "feature5Desc", true)}
            </div>
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Feature 6</span>
              {renderInputGroup("Title 6", "feature6Title")}
              {renderInputGroup("Desc 6", "feature6Desc", true)}
            </div>
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Feature 7</span>
              {renderInputGroup("Title 7", "feature7Title")}
              {renderInputGroup("Desc 7", "feature7Desc", true)}
            </div>
            <div className="bg-[var(--theme-bg-surface)] p-3 rounded-xl border border-[var(--theme-border)]">
              <span className="text-xs font-bold text-cyan-400 mb-2 block">Feature 8</span>
              {renderInputGroup("Title 8", "feature8Title")}
              {renderInputGroup("Desc 8", "feature8Desc", true)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
