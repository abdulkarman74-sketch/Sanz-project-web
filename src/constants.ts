export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  desc: string;
  buttonText: string;
  buttonTarget: string;
  enabled: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
}

export interface AudioSettings {
  url: string;
  autoplay: boolean;
  loop: boolean;
  showButton: boolean;
}

export interface BrandingSettings {
  siteName: string;
  slogan: string;
  logoUrl: string;
  faviconUrl: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
}

export interface SiteSettings {
  heroSlides: HeroSlide[];
  theme: ThemeSettings;
  audio: AudioSettings;
  branding: BrandingSettings;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroSlides: [
    {
      id: "slide1",
      image: "https://c.termai.cc/i146/BpC9uET.jpg",
      title: "Sanz Store Premium",
      desc: "Layanan digital cepat, aman, dan terpercaya untuk kebutuhan server, bot, dan aplikasi premium.",
      buttonText: "Lihat Layanan",
      buttonTarget: "products",
      enabled: true
    },
    {
      id: "slide2",
      image: "https://c.termai.cc/i140/Chh8r.jpg",
      title: "Cloud VPS Berkualitas",
      desc: "Performa stabil untuk panel, website, bot WhatsApp, dan sistem digital Anda.",
      buttonText: "Lihat Layanan",
      buttonTarget: "products",
      enabled: true
    },
    {
      id: "slide3",
      image: "https://c.termai.cc/i147/9rxld4I.jpg",
      title: "Bot WhatsApp Otomatis",
      desc: "Solusi otomatisasi WhatsApp yang praktis, modern, dan siap membantu bisnis digital.",
      buttonText: "Lihat Layanan",
      buttonTarget: "products",
      enabled: true
    },
    {
      id: "slide4",
      image: "https://c.termai.cc/i122/eO18Zyc.jpg",
      title: "Aplikasi Premium",
      desc: "Akses aplikasi premium dengan harga terjangkau dan proses aktivasi mudah.",
      buttonText: "Lihat Layanan",
      buttonTarget: "products",
      enabled: true
    },
    {
      id: "slide5",
      image: "https://c.termai.cc/i142/uwSV.jpg",
      title: "Support Cepat",
      desc: "Bantuan order, aktivasi, dan kendala layanan dengan respons yang cepat.",
      buttonText: "Lihat Layanan",
      buttonTarget: "products",
      enabled: true
    }
  ],
  theme: {
    primaryColor: "#2563eb",
    backgroundColor: "#0f172a",
    cardColor: "#1e293b",
    textColor: "#f8fafc",
  },
  audio: {
    url: "https://rahmad-elaina.my.id/file/cd38fe1d6b.mp3",
    autoplay: true,
    loop: true,
    showButton: true
  },
  branding: {
    siteName: "SANZ STORE",
    slogan: "Infrastruktur Terpadu & Modern",
    logoUrl: "",
    faviconUrl: "",
    whatsapp: "6283813098270",
    telegram: "",
    instagram: ""
  }
};

export interface Product {
  id: string;
  name: string;
  price: string;
  duration?: string;
  description?: string;
  details?: string[];
  benefits: string[];
  badge?: string;
  category: string;
  rating: number;
  stock: string;
  image: string;
}

export interface Category {
  id: 'all' | 'panel' | 'bot' | 'app' | 'source' | 'reseller';
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
      { 
        id: 'p1', 
        name: 'Panel 1GB', 
        price: '1.000', 
        duration: 'bulan', 
        description: '✔ Server stabil 24/7 (anti down)\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl',
        benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], 
        badge: 'PANEL', 
        category: 'Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'p2', 
        name: 'Panel 2GB', 
        price: '2.000', 
        duration: 'bulan', 
        description: '✔ Server stabil 24/7 (anti down)\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl',
        benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], 
        badge: 'PANEL', 
        category: 'Panel', 
        rating: 4.9, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'p3', 
        name: 'Panel 3GB', 
        price: '3.000', 
        duration: 'bulan', 
        description: '✔ Server stabil 24/7 (anti down)\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl',
        benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], 
        badge: 'PANEL', 
        category: 'Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'p4', 
        name: 'Panel 4GB', 
        price: '4.000', 
        duration: 'bulan', 
        description: '✔ Server stabil 24/7 (anti down)\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl',
        benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], 
        badge: 'PANEL', 
        category: 'Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'p5', 
        name: 'Panel 5GB', 
        price: '5.000', 
        duration: 'bulan', 
        description: '✔ Server stabil 24/7 (anti down)\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl',
        benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], 
        badge: 'PANEL', 
        category: 'Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'p6', 
        name: 'Panel 6GB', 
        price: '6.000', 
        duration: 'bulan', 
        description: '✔ Server stabil 24/7 (anti down)\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl',
        benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], 
        badge: 'PANEL', 
        category: 'Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'p7', 
        name: 'Panel 7GB', 
        price: '7.000', 
        duration: 'bulan', 
        description: '✔ Server stabil 24/7 (anti down)\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl',
        benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], 
        badge: 'PANEL', 
        category: 'Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'p8', 
        name: 'Panel 8GB', 
        price: '8.000', 
        duration: 'bulan', 
        description: '✔ Server stabil 24/7 (anti down)\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl',
        benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], 
        badge: 'PANEL', 
        category: 'Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'p9', 
        name: 'Panel 9GB', 
        price: '9.000', 
        duration: 'bulan', 
        description: '✔ Server stabil 24/7 (anti down)\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl',
        benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], 
        badge: 'PANEL', 
        category: 'Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'p10', 
        name: 'Panel 10GB', 
        price: '10.000', 
        duration: 'bulan', 
        description: '✔ Server stabil 24/7 (anti down)\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl',
        benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], 
        badge: 'PANEL', 
        category: 'Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'punli', 
        name: 'Panel Unlimited', 
        price: '12.000', 
        duration: 'bulan', 
        description: '✔ Server stabil 24/7 (anti down)\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl',
        benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], 
        badge: 'BEST SELLER', 
        category: 'Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
    ]
  },
  {
    id: 'reseller',
    title: 'Reseller - TK Panel',
    description: 'Kesempatan bisnis reseller panel dengan keuntungan maksimal dan sistem yang mudah.',
    subtext: 'Mulai bisnis reseller panel Anda sendiri dengan dukungan penuh.',
    status: 'Business',
    products: [
      { 
        id: 'res1', 
        name: 'Reseller Panel Legal', 
        price: '10.000', 
        duration: 'lifetime', 
        description: '✔ Bisa create panel sepuasnya\n✔ Akses Reseller Panel\n✔ Server stabil & legal\n✔ Full garansi\n✔ Tipe: Reseller',
        benefits: ['Create Panel Unli', 'Akses Reseller', 'Server Legal', 'Full Garansi'], 
        badge: 'RESELLER', 
        category: 'Reseller - TK Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'res2', 
        name: 'Partner Panel Legal', 
        price: '15.000', 
        duration: 'lifetime', 
        description: '✔ Bisa create panel sepuasnya\n✔ Bisa create admin panel\n✔ Akses Partner Panel\n✔ Server stabil & legal\n✔ Full garansi\n✔ Tipe: Partner',
        benefits: ['Create Panel Unli', 'Create Admin Panel', 'Akses Partner', 'Full Garansi'], 
        badge: 'PARTNER', 
        category: 'Reseller - TK Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'res3', 
        name: 'Owner Panel Legal', 
        price: '20.000', 
        duration: 'lifetime', 
        description: '✔ Bisa create panel sepuasnya\n✔ Bisa create admin panel\n✔ Bisa jual reseller panel\n✔ Bisa jual partner panel\n✔ Akses Owner Panel\n✔ Server stabil & legal\n✔ Full garansi\n✔ Tipe: Owner',
        benefits: ['Create Panel Unli', 'Jual Reseller', 'Jual Partner', 'Full Garansi'], 
        badge: 'OWNER', 
        category: 'Reseller - TK Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
      { 
        id: 'res4', 
        name: 'TK Panel Legal', 
        price: '30.000', 
        duration: 'lifetime', 
        description: '✔ Bisa create panel sepuasnya\n✔ Bisa create admin panel\n✔ Bisa jual reseller panel\n✔ Bisa jual partner panel\n✔ Bisa jual owner panel\n✔ Akses TK Panel\n✔ Server stabil & legal\n✔ Full garansi\n✔ Tipe: TK Panel',
        benefits: ['Create Panel Unli', 'Jual Semua Level', 'Akses TK Panel', 'Full Garansi'], 
        badge: 'TK PANEL', 
        category: 'Reseller - TK Panel', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/a7ljii.jpeg' 
      },
    ]
  },
  {
    id: 'bot',
    title: 'Sewa Bot',
    description: 'Bot automation cerdas untuk grup or penggunaan personal dengan uptime 24/7.',
    subtext: 'Bot automation siap pakai dengan sistem respons cepat.',
    status: 'Popular',
    products: [
      { 
        id: 'be1', 
        name: 'Bot Elaina 1 Bulan', 
        price: '10.000', 
        duration: 'bulan', 
        description: '✔ Bot aktif 24 jam nonstop\n✔ Fitur sangat lengkap (stiker, ai, downloader, dll)\n✔ Bisa digunakan di grup maupun pribadi\n✔ Respon cepat & stabil\n✔ Bisa request fitur tambahan\n✔ Anti error & maintenance rutin\n✔ Cocok untuk admin grup / bisnis\n✔ Support full selama masa sewa\n✔ Update fitur terus menerus\n✔ Tipe: Sewa Bot',
        benefits: ['Aktif 24 Jam', 'Fitur Lengkap', 'Respon Cepat', 'Support Full'], 
        badge: 'BOT', 
        category: 'Sewa Bot', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/x7hqja.jpg' 
      },
      { 
        id: 'beperm', 
        name: 'Bot Elaina Permanen', 
        price: '50.000', 
        duration: 'lifetime', 
        description: '✔ Bot aktif 24 jam nonstop\n✔ Fitur sangat lengkap (stiker, ai, downloader, dll)\n✔ Bisa digunakan di grup maupun pribadi\n✔ Respon cepat & stabil\n✔ Bisa request fitur tambahan\n✔ Anti error & maintenance rutin\n✔ Cocok untuk admin grup / bisnis\n✔ Support full selama masa sewa\n✔ Update fitur terus menerus\n✔ Tipe: Sewa Bot Permanen',
        benefits: ['Aktif 24 Jam', 'Fitur Lengkap', 'Respon Cepat', 'Support Full'], 
        badge: 'BEST SELLER', 
        category: 'Sewa Bot', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/x7hqja.jpg' 
      },
      { 
        id: 'bk1', 
        name: 'Bot Kobo 1 Bulan', 
        price: '8.000', 
        duration: 'bulan', 
        description: '✔ Bot aktif 24 jam\n✔ Fitur lengkap\n✔ Bisa untuk grup & pribadi\n✔ Stabil dan ringan\n✔ Support selama masa sewa\n✔ Tipe: Sewa Bot',
        benefits: ['Aktif 24 Jam', 'Fitur Lengkap', 'Stabil & Ringan', 'Support Sewa'], 
        badge: 'BOT', 
        category: 'Sewa Bot', 
        rating: 4.8, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/x7hqja.jpg' 
      },
    ]
  },
  {
    id: 'source',
    title: 'Source Code',
    description: 'Source code script bot WhatsApp dan aplikasi lainnya.',
    subtext: 'Script bot WhatsApp premium dengan fitur lengkap.',
    status: 'New',
    products: [
      { 
        id: 'sc1', 
        name: 'Script Bot WhatsApp Cyrene', 
        price: '70.000', 
        duration: 'lifetime', 
        description: '✔ 1800+ Fitur Lengkap (Include Premium Apikey)\n✔ Menu Stiker, Maker, ToFigure & Tools Lengkap\n✔ Sewa Bot & Premium Bot Full Otomatis\n✔ 3 Tampilan Menu Berbeda (Bisa Diganti)\n✔ Auto Downloader All Social Media\n✔ Menu Store dengan Sistem Katalog\n✔ Smart Auto AI (Text & Voice Note) Pakai Sessions\n✔ Kode Rapi & Bersih — Semua Setting di 1 File\n✔ Update Rutin & Maintenance Terjaga\n✔ Anti Over-Limit & Anti Bad Session\n✔ Siap Online 24/7\n✔ Tipe: Source Code Script',
        benefits: ['Free Update Selamanya', 'Support 24/7', 'Free Rename Script', 'Akses Grup Update', 'Request Fitur'], 
        badge: 'BARU', 
        category: 'Source Code', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/npyyb6.jpg' 
      },
    ]
  },
  {
    id: 'app',
    title: 'App Premium',
    description: 'Akses fitur premium aplikasi populer dengan harga yang sangat terjangkau.',
    subtext: 'Akses fitur premium tanpa watermark dan batasan.',
    status: 'Best Value',
    products: [
      { 
        id: 'am-sh', 
        name: 'Alight Motion Premium Sharing', 
        price: '1.000', 
        duration: '1 tahun', 
        description: '✔ Semua fitur premium terbuka\n✔ Tanpa watermark\n✔ Harga lebih hemat\n✔ Keamanan tetap aman\n✔ Bisa digunakan langsung\n✔ Tipe: Sharing',
        benefits: ['Fitur Premium', 'No Watermark', 'Harga Hemat', 'Aman'], 
        badge: 'APP', 
        category: 'App Premium', 
        rating: 4.7, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/7ukiba.jpeg' 
      },
      { 
        id: 'am-pr', 
        name: 'Alight Motion Premium Private', 
        price: '5.000', 
        duration: '1 tahun', 
        description: '✔ Akun private full akses\n✔ Tanpa watermark\n✔ Semua efek terbuka\n✔ Aman 100% (private account)\n✔ Tidak berbagi dengan user lain\n✔ Login stabil & anti logout\n✔ Tipe: Private',
        benefits: ['Akun Private', 'No Watermark', 'Full Efek', 'Aman 100%'], 
        badge: 'APP', 
        category: 'App Premium', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/7ukiba.jpeg' 
      },
      { 
        id: 'cc7', 
        name: 'CapCut Pro 7 Hari', 
        price: '5.000', 
        duration: '7 hari', 
        description: '✔ Semua fitur pro terbuka\n✔ Tanpa watermark\n✔ Export kualitas tinggi (HD/4K)\n✔ Template premium terbuka\n✔ Cocok untuk editor video\n✔ Tipe: Private',
        benefits: ['Fitur Pro', 'No Watermark', 'Export HD/4K', 'Template Pro'], 
        badge: 'APP', 
        category: 'App Premium', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/npyyb6.jpg' 
      },
      { 
        id: 'cc30', 
        name: 'CapCut Pro 30 Hari', 
        price: '12.000', 
        duration: '30 hari', 
        description: '✔ Semua fitur pro terbuka\n✔ Tanpa watermark\n✔ Export kualitas tinggi (HD/4K)\n✔ Template premium terbuka\n✔ Cocok untuk editor video\n✔ Tipe: Private',
        benefits: ['Fitur Pro', 'No Watermark', 'Export HD/4K', 'Template Pro'], 
        badge: 'BEST SELLER', 
        category: 'App Premium', 
        rating: 5.0, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/npyyb6.jpg' 
      },
      { 
        id: 'cpt', 
        name: 'Canva Pro Tim', 
        price: '5.000', 
        duration: '1 bulan', 
        description: '✔ Akses Canva Pro full fitur\n✔ Bisa digunakan dalam tim\n✔ Template premium terbuka\n✔ Cocok untuk kerja tim / konten creator\n✔ Update fitur terbaru\n✔ Tipe: Private',
        benefits: ['Canva Pro Full', 'Tim Access', 'Template Pro', 'Update Rutin'], 
        badge: 'APP', 
        category: 'App Premium', 
        rating: 4.8, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/npyyb6.jpg' 
      },
      { 
        id: 'ce', 
        name: 'Canva Lifetime', 
        price: '7.000', 
        duration: 'lifetime', 
        description: '✔ Akses premium seumur hidup\n✔ Template premium terbuka\n✔ Tanpa watermark\n✔ Bisa untuk desain profesional\n✔ Aman & jarang error\n✔ Tipe: Lifetime',
        benefits: ['Lifetime Access', 'Template Premium', 'No Watermark', 'Aman'], 
        badge: 'APP', 
        category: 'App Premium', 
        rating: 4.9, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/npyyb6.jpg' 
      },
      { 
        id: 'wink7', 
        name: 'Wink Premium 7 Hari', 
        price: '7.000', 
        duration: '7 hari', 
        description: '✔ Akses semua filter premium\n✔ Tanpa watermark\n✔ Edit foto jadi lebih aesthetic\n✔ Fitur AI terbuka\n✔ Cocok untuk konten sosial media\n✔ Tipe: Private',
        benefits: ['Filter Premium', 'No Watermark', 'Aesthetic Edit', 'Fitur AI'], 
        badge: 'APP', 
        category: 'App Premium', 
        rating: 4.9, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/fexjh0.jpg' 
      },
      { 
        id: 'wink30', 
        name: 'Wink Premium 30 Hari', 
        price: '20.000', 
        duration: '30 hari', 
        description: '✔ Akses semua filter premium\n✔ Tanpa watermark\n✔ Edit foto jadi lebih aesthetic\n✔ Fitur AI terbuka\n✔ Cocok untuk konten sosial media\n✔ Tipe: Private',
        benefits: ['Filter Premium', 'No Watermark', 'Aesthetic Edit', 'Fitur AI'], 
        badge: 'APP', 
        category: 'App Premium', 
        rating: 4.9, 
        stock: 'Unlimited', 
        image: 'https://files.catbox.moe/fexjh0.jpg' 
      },
    ]
  }
];

export const BANNER_SLIDES = [
  {
    id: 1,
    title: "PANEL PTERODACTYL",
    subtext: "Online 24 Jam VPS Legal",
    image: "https://picsum.photos/seed/elaina1/1200/400",
    buttonText: "Lihat"
  },
  {
    id: 2,
    title: "SCRIPT BOT WA",
    subtext: "Cyrene MD v10.5.0 Premium",
    image: "https://picsum.photos/seed/elaina2/1200/400",
    buttonText: "Beli Sekarang"
  },
  {
    id: 3,
    title: "APP PREMIUM",
    subtext: "Netflix, Spotify, Canva Murah",
    image: "https://picsum.photos/seed/elaina3/1200/400",
    buttonText: "Cek Produk"
  }
];

export const WHATSAPP_NUMBER = '6285814369350';

export const VIDEO_DATA = [
  { id: 1, url: "https://files.catbox.moe/bavncz.mp4", title: "Anime Quote #1" },
  { id: 2, url: "https://files.catbox.moe/6hdxcp.mp4", title: "Anime Quote #2" },
  { id: 3, url: "https://files.catbox.moe/09lt24.mp4", title: "Anime Quote #3" },
  { id: 4, url: "https://files.catbox.moe/foa8dv.mp4", title: "Anime Quote #4" },
  { id: 5, url: "https://files.catbox.moe/nu8n9p.mp4", title: "Anime Quote #5" },
];
