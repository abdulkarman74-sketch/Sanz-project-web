import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Category, Product, SiteSettings } from "../constants";
import { doc, setDoc } from "firebase/firestore";
import { db, firebaseReady } from "../lib/firebase";

import { DashboardView } from "./views/DashboardView";
import { ProductsView } from "./views/ProductsView";
import { CategoriesView } from "./views/CategoriesView";
import { SlidesView } from "./views/SlidesView";
import { BrandingView, LoadingView, ThemeView, AudioView, ContactView, FooterView, GeneralView, MaintenanceView, DebugFirebaseView, HeaderView, HeroView, CategoryTabsView, ServiceSectionView, StatsView, FlowView, BenefitsView } from "./views/SettingsViews";
import { MenuSemuaView } from "./views/MenuSemuaView";
import { SettingsAiView } from "./views/SettingsAiView";
import { AddProductView } from "./views/AddProductView";
import { AddCategoryView } from "./views/AddCategoryView";

interface AdminPanelProps {
  isAdminLoggedIn: boolean;
  adminMode: 'dashboard' | 'edit' | 'add' | null;
  setAdminMode: (mode: 'dashboard' | 'edit' | 'add' | null) => void;
  localCategories: Category[];
  handleAdminLogout: () => void;
  siteSettings: SiteSettings;
  products: Product[]; 
  slides: any[]; 
}

export default function AdminPanel({
  isAdminLoggedIn,
  adminMode,
  setAdminMode,
  localCategories,
  handleAdminLogout,
  siteSettings,
  products,
  slides
}: AdminPanelProps) {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Debug scroll
    const timeout = setTimeout(() => {
      const adminMain = document.querySelector(".admin-main");
      if (adminMain) {
        console.log("ADMIN MAIN SCROLL:", {
          scrollHeight: adminMain.scrollHeight,
          clientHeight: adminMain.clientHeight,
          overflowY: window.getComputedStyle(adminMain).overflowY
        });
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isAdminLoggedIn || !adminMode) return null;

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    setMobileMenuOpen(false);
  };

  async function testFirebaseSave() {
    try {
      if (!firebaseReady || !db) {
        alert("Firebase belum aktif. Cek src/setting.js");
        return;
      }

      await setDoc(doc(db, "test", "connection"), {
        ok: true,
        projectId: "sanzstore-6398b",
        time: new Date().toISOString()
      });

      alert("Firebase project baru berhasil tersambung");
    } catch (error: any) {
      console.error("TEST FIREBASE ERROR:", error);
      alert("Firebase gagal: " + error.message);
    }
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard": return <DashboardView categories={localCategories} products={products} slides={slides} settings={siteSettings} setActiveMenu={handleMenuClick} />;
      case "branding": return <BrandingView settings={siteSettings} />;
      case "header": return <HeaderView settings={siteSettings} />;
      case "hero": return <HeroView settings={siteSettings} slides={slides} />;
      case "menu-semua": return <MenuSemuaView settings={siteSettings} />;
      case "category-tabs": return <CategoryTabsView settings={siteSettings} />;
      case "section-layanan": return <ServiceSectionView settings={siteSettings} />;
      case "stats": return <StatsView settings={siteSettings} />;
      case "flow": return <FlowView settings={siteSettings} />;
      case "benefits": return <BenefitsView settings={siteSettings} />;
      case "products": return <ProductsView products={products} categories={localCategories} />;
      case "add-product": return <AddProductView categories={localCategories} onComplete={() => setActiveMenu("products")} />;
      case "categories": return <CategoriesView categories={localCategories} />;
      case "add-category": return <AddCategoryView onComplete={() => setActiveMenu("categories")} />;
      case "contact": return <ContactView settings={siteSettings} />;
      case "theme": return <ThemeView settings={siteSettings} />;
      case "loading": return <LoadingView settings={siteSettings} />;
      case "audio": return <AudioView settings={siteSettings} />;
      case "settings-ai": return <SettingsAiView settings={siteSettings} />;
      case "footer": return <FooterView settings={siteSettings} />;
      case "maintenance": return <MaintenanceView settings={siteSettings} />;
      case "general": return <GeneralView settings={siteSettings} />;
      case "debug": return <DebugFirebaseView />;
      default: return <DashboardView categories={localCategories} products={products} slides={slides} settings={siteSettings} setActiveMenu={handleMenuClick} />;
    }
  };

  const MENU_GROUPS = [
    {
      label: "Utama",
      items: [
        { id: "dashboard", label: "Dashboard", desc: "Ringkasan web", icon: "📊" },
        { id: "branding", label: "Branding Website", desc: "Nama & Logo", icon: "🏷️" },
        { id: "header", label: "Header Atas", desc: "Tampilan atas", icon: "🔝" },
        { id: "hero", label: "Hero / Banner", desc: "Teks & Gambar hero", icon: "🖼️" },
        { id: "menu-semua", label: "Menu Semua", desc: "Service hub", icon: "🧩" },
        { id: "category-tabs", label: "Tab Kategori", desc: "Filter kategori", icon: "📑" },
        { id: "section-layanan", label: "Section Layanan", desc: "Pusat layanan", icon: "📂" },
        { id: "stats", label: "Statistik Website", desc: "Card angka hemat", icon: "📈" },
        { id: "flow", label: "Alur Layanan", desc: "Langkah order", icon: "🛤️" },
        { id: "benefits", label: "Keunggulan / Benefit", desc: "Kenapa pilih kami", icon: "💎" }
      ]
    },
    {
      label: "Produk & Kategori",
      items: [
        { id: "products", label: "Produk", desc: "Daftar produk", icon: "📦" },
        { id: "add-product", label: "Tambah Produk", desc: "Produk baru", icon: "➕" },
        { id: "categories", label: "Kategori", desc: "Daftar kategori", icon: "🗂️" },
        { id: "add-category", label: "Tambah Kategori", desc: "Kategori baru", icon: "➕" }
      ]
    },
    {
      label: "Sistem & Tampilan",
      items: [
        { id: "contact", label: "Kontak & Order", desc: "WA & Pesan", icon: "☎️" },
        { id: "theme", label: "Tema Seluruh Web", desc: "Warna & Mode", icon: "🎨" },
        { id: "loading", label: "Loading Screen", desc: "Animasi masuk", icon: "✨" },
        { id: "audio", label: "Audio & Musik", desc: "Suara latar", icon: "🎧" },
        { id: "settings-ai", label: "Chat AI / Elaina", desc: "Assistant Bot", icon: "💬" },
        { id: "footer", label: "Footer", desc: "Bagian bawah", icon: "🧱" },
        { id: "maintenance", label: "Maintenance", desc: "Mode perbaikan", icon: "🛡️" },
        { id: "general", label: "Pengaturan Web", desc: "Server & Sistem", icon: "⚙️" },
        { id: "debug", label: "Debug Firebase", desc: "Cek database", icon: "🔥" }
      ]
    }
  ];

  const flatMenuItems = MENU_GROUPS.flatMap(g => g.items);

  return (
    <div className="admin-shell admin-panel">
      
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
           className="admin-sidebar-backdrop md:hidden"
           onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
         
         {/* Sidebar Header */}
         <div className="admin-sidebar-header">
           <h2>CONTROL CENTER</h2>
           <p>Kelola semua fitur web</p>
           {mobileMenuOpen && (
             <button type="button" onClick={() => setMobileMenuOpen(false)} className="md:hidden text-white absolute top-4 right-4">&times;</button>
           )}
         </div>

         {/* Sidebar Navigation */}
         <nav className="admin-nav" style={{ flex: '1 1 auto', overflowY: 'auto', paddingBottom: '100px' }}>
            {MENU_GROUPS.map((group, groupIdx) => (
               <div key={groupIdx}>
                  <div className="admin-menu-group-label">{group.label}</div>
                  {group.items.map(m => {
                     const active = activeMenu === m.id;
                     return (
                        <button
                           key={m.id}
                           type="button"
                           onClick={() => handleMenuClick(m.id)}
                           className={`admin-nav-item ${active ? "active" : ""}`}
                           style={{ display: 'flex', visibility: 'visible', opacity: 1, pointerEvents: 'auto' }}
                        >
                           <span className="admin-nav-item-icon">{m.icon}</span>
                           <span className="admin-nav-item-text">
                             <span className="admin-nav-item-label">{m.label}</span>
                             <span className="admin-nav-item-desc">{m.desc}</span>
                           </span>
                        </button>
                     );
                  })}
               </div>
            ))}
         </nav>

         {/* Sidebar Footer */}
         <div className="admin-sidebar-actions" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
               type="button"
               onClick={() => {
                 setAdminMode(null);
                 toast.success("Berhasil keluar dari mode edit");
               }}
               className="admin-btn-close"
               style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.2)', color: '#cbd5e1', background: 'transparent', fontWeight: 'bold' }}
            >
               Tutup Admin
            </button>
            <button
               type="button"
               onClick={() => {
                 handleAdminLogout();
                 setAdminMode(null);
                 toast.success("Berhasil logout");
               }}
               className="admin-btn-logout"
               style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: 'none', color: '#020617', background: '#fb7185', fontWeight: 'bold' }}
            >
               Logout Akun
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
         {/* Top Header Mobile Toggle */}
         <div className="md:hidden mb-4 flex items-center gap-3">
            <button
               type="button"
               onClick={() => setMobileMenuOpen(true)}
               className="admin-mobile-toggle"
               style={{ background: '#22d3ee', color: '#020617', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold' }}
            >
               &#9776; Menu
            </button>
            <span className="text-white font-bold truncate">Admin {siteSettings?.branding?.storeName || siteSettings?.branding?.siteName || "Store"}</span>
         </div>
         
         <div className="admin-main-header">
           <div>
             <h1>{flatMenuItems.find(m => m.id === activeMenu)?.label || "Dashboard Admin"}</h1>
             <p>{flatMenuItems.find(m => m.id === activeMenu)?.desc || "Pengaturan website"}</p>
           </div>
         </div>

         {/* Content Scrollable Area */}
         <div className="admin-content">
            {renderContent()}
         </div>
      </main>

    </div>
  );
}
