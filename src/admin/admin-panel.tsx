import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Category, Product, SiteSettings } from "../constants";
import { doc, setDoc } from "firebase/firestore";
import { db, firebaseReady } from "../lib/firebase";

import { DashboardView } from "./views/DashboardView";
import { ProductsView } from "./views/ProductsView";
import { CategoriesView } from "./views/CategoriesView";
import { SlidesView } from "./views/SlidesView";
import { BrandingView, LoadingView, ThemeView, AudioView, ContactView, FooterView, GeneralView, MaintenanceView, DebugFirebaseView } from "./views/SettingsViews";
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
    // Hide body scroll when admin is open
    if (isAdminLoggedIn && adminMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAdminLoggedIn, adminMode]);

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
      case "loading": return <LoadingView settings={siteSettings} />;
      case "branding": return <BrandingView settings={siteSettings} />;
      case "slides": return <SlidesView slides={slides} />;
      case "products": return <ProductsView products={products} categories={localCategories} />;
      case "add-product": return <AddProductView categories={localCategories} onComplete={() => setActiveMenu("products")} />;
      case "categories": return <CategoriesView categories={localCategories} />;
      case "add-category": return <AddCategoryView onComplete={() => setActiveMenu("categories")} />;
      case "contact": return <ContactView settings={siteSettings} />;
      case "theme": return <ThemeView settings={siteSettings} />;
      case "audio": return <AudioView settings={siteSettings} />;
      case "footer": return <FooterView settings={siteSettings} />;
      case "general": return <GeneralView settings={siteSettings} />;
      case "maintenance": return <MaintenanceView settings={siteSettings} />;
      case "debug": return <DebugFirebaseView />;
      default: return <DashboardView categories={localCategories} products={products} slides={slides} settings={siteSettings} setActiveMenu={handleMenuClick} />;
    }
  };

  const MENU_ITEMS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "loading", label: "Loading Screen" },
    { id: "branding", label: "Branding Website" },
    { id: "slides", label: "Banner Slider" },
    { id: "products", label: "Produk" },
    { id: "add-product", label: "Tambah Produk" },
    { id: "categories", label: "Kategori" },
    { id: "add-category", label: "Tambah Kategori" },
    { id: "contact", label: "Kontak & Order" },
    { id: "theme", label: "Tema Warna" },
    { id: "audio", label: "Audio & Musik" },
    { id: "footer", label: "Footer" },
    { id: "general", label: "Pengaturan Web" },
    { id: "maintenance", label: "Maintenance" },
    { id: "debug", label: "Debug Firebase" }
  ];

  return (
    <div className="admin-panel fixed inset-0 z-[9999] bg-[#020617] flex font-sans overflow-hidden">
      
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
           className="fixed inset-0 bg-black/60 z-40 lg:hidden"
           onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#0f172a] border-r border-[#334155] flex flex-col transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
         
         {/* Sidebar Header */}
         <div className="h-16 flex items-center justify-between px-6 border-b border-[#334155] bg-[#0f172a] shrink-0">
           <span className="text-white font-black tracking-widest text-lg">PANEL ADMIN</span>
           <button type="button" onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-white p-2">✕</button>
         </div>

         {/* Sidebar Navigation */}
         <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 scrollbar-hide">
            {MENU_ITEMS.map(m => {
               const active = activeMenu === m.id;
               return (
                 <button
                   key={m.id}
                   type="button"
                   onClick={() => handleMenuClick(m.id)}
                   className={`w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer font-medium text-sm ${
                     active 
                     ? "bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20 ring-1 ring-[#22d3ee]/10" 
                     : "text-[#94a3b8] hover:bg-[#1e293b] hover:text-white border border-transparent"
                   }`}
                 >
                   {m.label}
                 </button>
               );
            })}
         </div>

         {/* Sidebar Footer */}
         <div className="p-4 border-t border-[#334155] shrink-0 flex flex-col gap-2">
            <button
               type="button"
               onClick={testFirebaseSave}
               className="w-full py-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 text-sm font-medium transition-colors mb-2"
            >
               TEST FIREBASE SAVE
            </button>
            <button
               type="button"
               onClick={() => {
                 setAdminMode(null);
                 toast.success("Berhasil keluar dari mode edit");
               }}
               className="w-full py-2.5 rounded-xl border border-[#334155] hover:bg-[#1e293b] text-white text-sm font-medium transition-colors"
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
               className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-sm font-medium transition-colors"
            >
               Logout Akun
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#020617]">
         {/* Top Header Mobile Toggle */}
         <header className="h-16 lg:h-0 lg:border-none border-b border-[#334155] bg-[#0f172a] flex items-center px-4 shrink-0 lg:hidden">
            <button
               type="button"
               onClick={() => setMobileMenuOpen(true)}
               className="p-2 text-white bg-[#1e293b] rounded-lg border border-[#334155]"
            >
               ☰ Menu
            </button>
            <span className="ml-4 text-white font-bold truncate">Admin {siteSettings?.branding?.storeName || siteSettings?.branding?.siteName || "Store"}</span>
         </header>

         {/* Content Scrollable Area */}
         <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-7xl mx-auto custom-admin-scroll pb-24 lg:pb-8">
            {renderContent()}
         </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-admin-scroll::-webkit-scrollbar { width: 8px; }
        .custom-admin-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-admin-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-admin-scroll::-webkit-scrollbar-thumb:hover { background: #475569; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}} />
    </div>
  );
}
