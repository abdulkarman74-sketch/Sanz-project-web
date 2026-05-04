import React from "react";
import { Category, Product, SiteSettings } from "../../constants";
import { firebaseReady } from "../../lib/firebase";

export const DashboardView = ({ 
  categories, 
  products, 
  slides, 
  settings, 
  setActiveMenu 
}: { 
  categories: Category[]; 
  products: Product[]; 
  slides: any[]; 
  settings: SiteSettings;
  setActiveMenu: (menu: string) => void;
}) => {

  const storeName = settings?.branding?.storeName || settings?.branding?.siteName || "Belum diset";
  const isMaintenance = settings?.general?.maintenanceMode;
  const infoMode = settings?.general?.infoDisplayMode || "runtime";
  const waNumber = settings?.contact?.whatsapp || "Belum diset";

  return (
    <div className="admin-dashboard-view">
      
      <div className="admin-dashboard-hero">
        <h1 style={{ margin: "0 0 8px", color: "#fff", fontSize: "28px", fontWeight: 950, letterSpacing: "-0.02em" }}>Welcome to Control Center ✨</h1>
        <p style={{ margin: 0, color: "#cbd5e1", fontSize: "14px", lineHeight: 1.5 }}>
          Pantau statistik toko dan kelola semua fitur website Anda dengan mudah dari satu tempat.
        </p>
      </div>

      <div className="admin-section-header">
        <h2>Ringkasan Web</h2>
        <p>Statistik dan status fitur website</p>
      </div>
      <div className="admin-dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Produk</div>
          <div className="admin-stat-value">{products.length} <span className="text-sm font-normal ml-1">Items</span></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Kategori</div>
          <div className="admin-stat-value">{categories.length} <span className="text-sm font-normal ml-1">Kategori</span></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Mode Maintenance</div>
          <div className={`admin-stat-value ${isMaintenance ? "text-amber-400" : "success"}`}>
            {isMaintenance ? "Aktif" : "Online"}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Tema Warna</div>
          <div className="admin-stat-value truncate" style={{ color: settings?.theme?.primaryColor || '#22d3ee' }}>
             {settings?.theme?.primaryColor ? "Kustom" : "Default"}
          </div>
        </div>
      </div>

      <div className="admin-section-header">
        <h2>Aksi Cepat</h2>
        <p>Jalan pintas ke pengaturan yang sering digunakan</p>
      </div>
      <div className="admin-quick-grid" style={{ marginBottom: '32px' }}>
        <div className="admin-quick-card" onClick={() => setActiveMenu('branding-header')}>
           <div className="admin-quick-card-icon" style={{ background: "rgba(236, 72, 153, 0.12)", color: "#f472b6" }}>🏷️</div>
           <h3>Branding Web</h3>
           <p>Ganti nama toko dan logo</p>
        </div>
        <div className="admin-quick-card" onClick={() => setActiveMenu('menu-semua')}>
           <div className="admin-quick-card-icon" style={{ background: "rgba(52, 211, 153, 0.12)", color: "#34d399" }}>🧩</div>
           <h3>Menu Semua</h3>
           <p>Atur section layanan</p>
        </div>
        <div className="admin-quick-card" onClick={() => setActiveMenu('produk')}>
           <div className="admin-quick-card-icon" style={{ background: "rgba(250, 204, 21, 0.12)", color: "#facc15" }}>📦</div>
           <h3>Kelola Produk</h3>
           <p>Upload produk baru</p>
        </div>
        <div className="admin-quick-card" onClick={() => setActiveMenu('kategori')}>
           <div className="admin-quick-card-icon" style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8" }}>🗂️</div>
           <h3>Kelola Kategori</h3>
           <p>Atur filter kategori</p>
        </div>
        <div className="admin-quick-card" onClick={() => setActiveMenu('tema')}>
           <div className="admin-quick-card-icon" style={{ background: "rgba(167, 139, 250, 0.12)", color: "#a78bfa" }}>🎨</div>
           <h3>Ubah Tema Warna</h3>
           <p>Ganti warna web instan</p>
        </div>
        <div className="admin-quick-card" onClick={() => setActiveMenu('maintenance')}>
           <div className="admin-quick-card-icon" style={{ background: "rgba(251, 146, 60, 0.12)", color: "#fb923c" }}>🛡️</div>
           <h3>Maintenance</h3>
           <p>Aktifkan mode perbaikan</p>
        </div>
      </div>

      <div className="admin-section-header">
        <h2>Status Sistem Terkini</h2>
        <p>Kondisi integrasi server dan database</p>
      </div>
      <div className="admin-dashboard-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Koneksi Firebase</div>
          <div className={`admin-stat-value ${firebaseReady ? "success" : "text-red-400"}`}>
            {firebaseReady ? "Connected" : "Not Built"}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Admin Sesi</div>
          <div className="admin-stat-value success">
            Terverifikasi
          </div>
        </div>
        <div className="admin-stat-card" onClick={() => setActiveMenu('debug')} style={{ cursor: 'pointer' }}>
          <div className="admin-stat-label">Pusat Debug</div>
          <div className="admin-stat-value">
            Buka &rarr;
          </div>
        </div>
      </div>

    </div>
  );
};
