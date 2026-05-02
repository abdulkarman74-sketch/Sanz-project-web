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

  const storeName = settings?.branding?.siteName || "Belum diset";
  const isMaintenance = settings?.general?.maintenanceMode;
  const infoMode = settings?.general?.infoDisplayMode || "runtime";
  const waNumber = settings?.contact?.whatsapp || "Belum diset";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Dashboard Admin</h1>
        <p className="text-slate-400 text-sm">Ringkasan status dan pengaturan website Anda.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Nama Store</span>
          <span className="text-lg font-black text-white truncate" title={storeName}>{storeName}</span>
        </div>
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Status Firebase</span>
          <span className={`text-lg font-black ${firebaseReady ? "text-emerald-400" : "text-red-400"}`}>
            {firebaseReady ? "Connected" : "Not Ready"}
          </span>
        </div>
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Total Produk</span>
          <span className="text-lg font-black text-white">{products.length} <span className="text-xs text-theme-accent ml-1 font-bold">Produk</span></span>
        </div>
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Total Kategori</span>
          <span className="text-lg font-black text-white">{categories.length} <span className="text-xs text-theme-accent ml-1 font-bold">Kategori</span></span>
        </div>
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Total Slide</span>
          <span className="text-lg font-black text-white">{slides.length} <span className="text-xs text-theme-accent ml-1 font-bold">Banner</span></span>
        </div>
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Maintenance</span>
          <span className={`text-lg font-black ${isMaintenance ? "text-amber-400" : "text-emerald-400"}`}>
            {isMaintenance ? "Aktif (Sedang Maintenace)" : "Tidak (Online Publik)"}
          </span>
        </div>
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Info Display</span>
          <span className="text-lg font-black text-white truncate">
             {infoMode === 'hidden' ? "Sembunyikan" : infoMode === 'datetime' ? "Jam & Masehi" : infoMode === 'runtime' ? "Runtime VPS" : "Semua Info"}
          </span>
        </div>
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Kontak WA</span>
          <span className="text-lg font-black text-white truncate" title={waNumber}>{waNumber}</span>
        </div>
      </div>

      <div className="mt-2">
        <h2 className="text-lg font-bold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button onClick={() => setActiveMenu('loading')} className="p-4 bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] hover:border-theme-accent/50 rounded-xl text-[12px] font-bold text-white transition-colors flex flex-col items-center justify-center gap-2 text-center shadow-sm">
             Edit Loading Screen
          </button>
          <button onClick={() => setActiveMenu('branding')} className="p-4 bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] hover:border-theme-accent/50 rounded-xl text-[12px] font-bold text-white transition-colors flex flex-col items-center justify-center gap-2 text-center shadow-sm">
             Edit Branding
          </button>
          <button onClick={() => setActiveMenu('add-product')} className="p-4 bg-theme-accent/10 hover:bg-theme-accent/20 border border-theme-accent/30 rounded-xl text-[12px] font-bold text-theme-accent transition-colors flex flex-col items-center justify-center gap-2 text-center shadow-sm">
             + Tambah Produk
          </button>
          <button onClick={() => setActiveMenu('add-category')} className="p-4 bg-theme-accent/10 hover:bg-theme-accent/20 border border-theme-accent/30 rounded-xl text-[12px] font-bold text-theme-accent transition-colors flex flex-col items-center justify-center gap-2 text-center shadow-sm">
             + Tambah Kategori
          </button>
          <button onClick={() => setActiveMenu('contact')} className="col-span-2 md:col-span-1 p-4 bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] hover:border-theme-accent/50 rounded-xl text-[12px] font-bold text-white transition-colors flex flex-col items-center justify-center gap-2 text-center shadow-sm">
             Edit Kontak Order
          </button>
        </div>
      </div>

    </div>
  );
};
