import React, { useState } from "react";
import { Category, Product, SiteSettings } from "../../constants";

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

  const activeProducts = products.filter(p => p.active !== false).length;
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-[#94a3b8]">Ringkasan data toko dan status website Anda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Cards */}
        <div className="bg-[#111827] border border-[#334155] rounded-2xl p-5 flex flex-col gap-2 shadow-sm relative overflow-hidden">
          <span className="text-[#94a3b8] font-medium text-sm">Total Produk</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{products.length}</span>
            <span className="text-[#22d3ee] text-sm font-semibold selection:bg-transparent">{activeProducts} Aktif</span>
          </div>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#22d3ee] opacity-5 rounded-full -mr-8 -mb-8 blur-2xl pointer-events-none"></div>
        </div>
        
        <div className="bg-[#111827] border border-[#334155] rounded-2xl p-5 flex flex-col gap-2 shadow-sm relative overflow-hidden">
          <span className="text-[#94a3b8] font-medium text-sm">Target Kategori</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{categories.length}</span>
          </div>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#a855f7] opacity-5 rounded-full -mr-8 -mb-8 blur-2xl pointer-events-none"></div>
        </div>
        
        <div className="bg-[#111827] border border-[#334155] rounded-2xl p-5 flex flex-col gap-2 shadow-sm relative overflow-hidden">
          <span className="text-[#94a3b8] font-medium text-sm">Banner Slide</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{slides.length}</span>
          </div>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#f59e0b] opacity-5 rounded-full -mr-8 -mb-8 blur-2xl pointer-events-none"></div>
        </div>

        <div className="bg-[#111827] border border-[#334155] rounded-2xl p-5 flex flex-col gap-2 shadow-sm relative overflow-hidden">
          <span className="text-[#94a3b8] font-medium text-sm">Status Website</span>
          <div className="flex items-baseline gap-2">
            {settings?.general?.websiteEnabled === false ? (
               <span className="text-lg font-bold text-red-400 mt-1.5">Offline</span>
            ) : settings?.general?.maintenanceMode ? (
               <span className="text-lg font-bold text-amber-400 mt-1.5">Maintenance</span>
            ) : (
               <span className="text-lg font-bold text-emerald-400 mt-1.5">Online</span>
            )}
          </div>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500 opacity-5 rounded-full -mr-8 -mb-8 blur-2xl pointer-events-none"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
         <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6">
           <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
           <div className="grid grid-cols-2 gap-3">
             <button onClick={() => setActiveMenu('products')} className="bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] p-4 rounded-xl text-left transition-colors flex flex-col gap-1 cursor-pointer">
               <span className="text-white font-semibold">Kelola Produk</span>
               <span className="text-xs text-[#94a3b8]">Tambah atau edit daftar produk</span>
             </button>
             <button onClick={() => setActiveMenu('branding')} className="bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] p-4 rounded-xl text-left transition-colors flex flex-col gap-1 cursor-pointer">
               <span className="text-white font-semibold">Edit Branding</span>
               <span className="text-xs text-[#94a3b8]">Ubah logo & identitas web</span>
             </button>
             <button onClick={() => setActiveMenu('slides')} className="bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] p-4 rounded-xl text-left transition-colors flex flex-col gap-1 cursor-pointer">
               <span className="text-white font-semibold">Ganti Banner</span>
               <span className="text-xs text-[#94a3b8]">Atur slider promosi</span>
             </button>
             <button onClick={() => setActiveMenu('general')} className="bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] p-4 rounded-xl text-left transition-colors flex flex-col gap-1 cursor-pointer">
               <span className="text-white font-semibold">Pengaturan Web</span>
               <span className="text-xs text-[#94a3b8]">On/Off site & jam server</span>
             </button>
           </div>
         </div>
         
         <div className="bg-[#111827] border border-[#334155] rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-[#22d3ee]/10 rounded-full flex items-center justify-center mb-4 border border-[#22d3ee]/20">
              <svg className="w-8 h-8 text-[#22d3ee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Firebase Connected</h3>
            <p className="text-sm text-[#94a3b8] mt-2 max-w-[250px]">Website Anda sudah terhubung secara real-time. Semua perubahan akan langsung tersimpan secara otomatis jika anda menekan tombol simpan.</p>
         </div>
      </div>
    </div>
  );
};
