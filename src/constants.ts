export interface Product {
  id: string;
  name: string;
  price: string;
  duration?: string;
  details?: string[];
  benefits: string[];
  badge?: string;
}

export interface Category {
  id: 'panel' | 'bot' | 'app';
  title: string;
  description: string;
  subtext: string;
  status: string;
  products: Product[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'panel',
    title: 'Panel Server',
    description: 'Server stabil, anti lemot, dan fast response untuk kebutuhan bot atau panel Anda.',
    subtext: 'Solusi server stabil untuk kebutuhan bot dan panel.',
    status: 'Stable',
    products: [
      { id: 'p1', name: 'Panel 1GB', price: '1.000', duration: 'bulan', benefits: ['Server Stabil', 'Anti Lemot', 'Fast Response', 'Cocok untuk Bot', 'Harga Hemat'], badge: 'Fast Access' },
      { id: 'p2', name: 'Panel 2GB', price: '2.000', duration: 'bulan', benefits: ['Server Stabil', 'Anti Lemot', 'Fast Response', 'Cocok untuk Bot', 'Harga Hemat'] },
      { id: 'p3', name: 'Panel 3GB', price: '3.000', duration: 'bulan', benefits: ['Server Stabil', 'Anti Lemot', 'Fast Response', 'Cocok untuk Bot', 'Harga Hemat'] },
      { id: 'p4', name: 'Panel 4GB', price: '4.000', duration: 'bulan', benefits: ['Server Stabil', 'Anti Lemot', 'Fast Response', 'Cocok untuk Bot', 'Harga Hemat'] },
      { id: 'p5', name: 'Panel 5GB', price: '5.000', duration: 'bulan', benefits: ['Server Stabil', 'Anti Lemot', 'Fast Response', 'Cocok untuk Bot', 'Harga Hemat'] },
      { id: 'p6', name: 'Panel 6GB', price: '6.000', duration: 'bulan', benefits: ['Server Stabil', 'Anti Lemot', 'Fast Response', 'Cocok untuk Bot', 'Harga Hemat'] },
      { id: 'p7', name: 'Panel 7GB', price: '7.000', duration: 'bulan', benefits: ['Server Stabil', 'Anti Lemot', 'Fast Response', 'Cocok untuk Bot', 'Harga Hemat'] },
      { id: 'punli', name: 'Panel UNLI', price: '15.000', duration: 'bulan', benefits: ['Server Stabil', 'Anti Lemot', 'Fast Response', 'Cocok untuk Bot', 'Harga Hemat'], badge: 'Best Seller' },
    ]
  },
  {
    id: 'bot',
    title: 'Sewa Bot',
    description: 'Bot automation cerdas untuk grup atau penggunaan personal dengan uptime 24/7.',
    subtext: 'Bot automation siap pakai dengan sistem respons cepat.',
    status: 'Popular',
    products: [
      { id: 'be1', name: 'Bot Elaina 1 Bulan', price: '10.000', duration: 'bulan', benefits: ['Auto Respon Cepat', 'Stabil 24 Jam', 'Fitur Lengkap', 'Cocok untuk Grup'] },
      { id: 'be2', name: 'Bot Elaina 2 Bulan', price: '17.000', duration: 'bulan', benefits: ['Auto Respon Cepat', 'Stabil 24 Jam', 'Fitur Lengkap', 'Cocok untuk Grup'] },
      { id: 'be4', name: 'Bot Elaina 4 Bulan', price: '25.000', duration: 'bulan', benefits: ['Auto Respon Cepat', 'Stabil 24 Jam', 'Fitur Lengkap', 'Cocok untuk Grup'] },
      { id: 'be5', name: 'Bot Elaina 5 Bulan', price: '35.000', duration: 'bulan', benefits: ['Auto Respon Cepat', 'Stabil 24 Jam', 'Fitur Lengkap', 'Cocok untuk Grup'] },
      { id: 'be6', name: 'Bot Elaina 6 Bulan', price: '45.000', duration: 'bulan', benefits: ['Auto Respon Cepat', 'Stabil 24 Jam', 'Fitur Lengkap', 'Cocok untuk Grup'] },
      { id: 'beperm', name: 'Bot Elaina Permanen', price: '50.000', duration: 'lifetime', benefits: ['Auto Respon Cepat', 'Stabil 24 Jam', 'Fitur Lengkap', 'Cocok untuk Grup'], badge: 'Best Seller' },
      { id: 'bk1', name: 'Bot Kobo 1 Bulan', price: '8.000', duration: 'bulan', benefits: ['Ringan & Stabil', 'Cocok Personal', 'Hemat Biaya', 'Fast Setup'] },
      { id: 'bk2', name: 'Bot Kobo 2 Bulan', price: '15.000', duration: 'bulan', benefits: ['Ringan & Stabil', 'Cocok Personal', 'Hemat Biaya', 'Fast Setup'] },
      { id: 'bk4', name: 'Bot Kobo 4 Bulan', price: '20.000', duration: 'bulan', benefits: ['Ringan & Stabil', 'Cocok Personal', 'Hemat Biaya', 'Fast Setup'] },
      { id: 'bk5', name: 'Bot Kobo 5 Bulan', price: '25.000', duration: 'bulan', benefits: ['Ringan & Stabil', 'Cocok Personal', 'Hemat Biaya', 'Fast Setup'] },
      { id: 'bk6', name: 'Bot Kobo 30.000', price: '30.000', duration: 'bulan', benefits: ['Ringan & Stabil', 'Cocok Personal', 'Hemat Biaya', 'Fast Setup'] },
      { id: 'bkperm', name: 'Bot Kobo Permanen', price: '40.000', duration: 'lifetime', benefits: ['Ringan & Stabil', 'Cocok Personal', 'Hemat Biaya', 'Fast Setup'], badge: 'Premium Feature' },
    ]
  },
  {
    id: 'app',
    title: 'App Premium',
    description: 'Akses fitur premium aplikasi populer dengan harga yang sangat terjangkau.',
    subtext: 'Akses fitur premium tanpa watermark dan batasan.',
    status: 'Best Value',
    products: [
      { id: 'am-sh', name: 'Alight Motion Premium Shering', price: '1.000', duration: '1 tahun', benefits: ['Semua fitur premium aktif', 'Tanpa watermark', 'Bisa digunakan langsung', 'Keamanan pasti aman'], badge: '⚡ Shared Access' },
      { id: 'am-pr', name: 'Alight Motion Premium Private', price: '5.000', duration: '1 tahun', benefits: ['Akses premium private', 'Semua fitur terbuka', 'Tanpa watermark', 'Update fitur premium', 'Keamanan terjamin'], badge: '🔒 Private Access' },
      { id: 'wk7', name: 'Wink Premium 7 Hari', price: '4.000', duration: '7 hari', benefits: ['Filter Premium Unlocked', 'Tanpa Batas Edit', 'Kualitas Maksimal'] },
      { id: 'wk28', name: 'Wink Premium 28 Hari', price: '33.000', duration: '28 hari', benefits: ['Filter Premium Unlocked', 'Tanpa Batas Edit', 'Kualitas Maksimal'] },
      { id: 'cc7', name: 'CapCut Pro 7 Hari', price: '4.000', duration: '7 hari', benefits: ['No Watermark', 'Efek Premium Aktif', 'Export Kualitas Tinggi'] },
      { id: 'cc30', name: 'CapCut Pro 30 Day', price: '12.000', duration: '30 hari', details: ['Akses CapCut Pro selama 30 hari', 'Fitur premium aktif', 'Aman digunakan'], benefits: ['No Watermark', 'Efek Premium Aktif', 'Export Kualitas Tinggi'], badge: 'Best Seller' },
      { id: 'ce', name: 'Canva Edu Lifetime', price: '3.000', duration: 'lifetime', benefits: ['Akses Fitur Premium', 'Template Lengkap', 'Cocok untuk Pelajar'], badge: 'High Performance' },
      { id: 'cp', name: 'Canva Pro 1 Bulan', price: '2.000', duration: '1 bulan', benefits: ['Semua Template Premium', 'Background Remover', 'Brand Kit Aktif'] },
    ]
  }
];

export const WHATSAPP_NUMBER = '6285814369350';
