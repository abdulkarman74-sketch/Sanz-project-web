export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  desc: string;
  buttonText: string;
  buttonTarget: string;
  enabled: boolean;
  order?: number;
  overlayOpacity?: number;
}

export interface ThemeSettings {
  primaryColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  surfaceColor?: string;
  mutedColor?: string;
  accentSecColor?: string;
  borderColor?: string;
  footerColor?: string;
  radius?: string;
  gridCols?: number;
}

export interface AudioSettings {
  url: string;
  autoplay: boolean;
  loop: boolean;
  showButton: boolean;
  playlist?: Array<{id: string, title: string, url: string}>;
  volume?: number;
}

export interface BrandingSettings {
  siteName: string; // Legacy
  logoUrl: string;
  faviconUrl: string;
  heroSubTitle?: string;
  watermark?: string;

  // New fields
  loadingName?: string;
  loadingSubtitle?: string;
  storeName?: string;
  shortName?: string;
  slogan?: string;
  headerName?: string;
  footerName?: string;
  footerDescription?: string;
  copyrightText?: string;
  badgeText?: string;
}

export interface ContactSettings {
  whatsapp: string;
  telegram: string;
  instagram: string;
  whatsappGroup?: string;
  email?: string;
  orderMessage?: string;
  panelMessage?: string;
  botMessage?: string;
  qrisUrl?: string;
  danaUrl?: string;
  btnBuyText?: string;
  btnContactText?: string;
}

export interface LoadingSettings {
  enabled: boolean;
  mainText: string;
  subText: string;
  logoUrl: string;
  bgColor: string;
  textColor: string;
  minDuration: number;
}

export interface FooterSettings {
  title: string;
  description: string;
  copyright: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  socialLinks?: { platform: string, url: string }[];
}

export interface GeneralSettings {
  maintenanceMode: boolean;
  maintenanceText: string;
  websiteEnabled: boolean;
  showRuntimeVps: boolean;
  showAudioButton: boolean;
  showSlider: boolean;
  showRunningText?: boolean;
  cloudOptimizer?: boolean;
  floatingCart?: boolean;
  systemRecovery?: boolean;
  analytics?: boolean;
  devMode?: boolean;
  infoDisplayMode?: 'runtime' | 'datetime' | 'both' | 'hidden';
}

export interface LayoutSettings {
  showRuntimeVps: boolean;
  vpsInitialDays: number;
  vpsInitialHours: number;
  vpsInitialMins: number;
}

export interface MenuSemuaSettings {
  badgeText: string;
  heroTitle: string;
  heroSubtitle: string;

  chip1: string;
  chip2: string;
  chip3: string;

  flowTitle: string;
  flowSubtitle: string;

  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  trustTitle: string;
  trustSubtitle: string;
  trustPoint1: string;
  trustPoint2: string;
  trustPoint3: string;
  trustPoint4: string;
  trustPoint5: string;

  highlightText: string;

  featureTitle: string;
  featureSubtitle: string;

  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  feature5Title: string;
  feature5Desc: string;
  feature6Title: string;
  feature6Desc: string;
  feature7Title: string;
  feature7Desc: string;
  feature8Title: string;
  feature8Desc: string;

  ctaTitle: string;
  ctaSubtitle: string;
}

export interface AiSettings {
  defaultAiName: string;
  defaultAiAvatar: string;
  speakingStyle: string;
  systemPrompt: string;
  welcomeMessage: string;
}

export interface ElainaRoleSetting {
  tone: string;
  example: string;
  minChat: number;
}

export interface ElainaSettings {
  characterName: string;
  defaultStyle: string;
  allowRomanticRole: boolean;
  welcomeMessage: string;
  roles: Record<string, ElainaRoleSetting>;
  maxHistory?: number;
}

export interface SiteSettings {
  heroSlides: HeroSlide[];
  theme: ThemeSettings;
  audio: AudioSettings;
  branding: BrandingSettings;
  layout?: LayoutSettings;
  contact?: ContactSettings;
  loading?: LoadingSettings;
  footer?: FooterSettings;
  general?: GeneralSettings;
  menuSemua?: MenuSemuaSettings;
  ai?: AiSettings;
  elainaChat?: ElainaSettings;
}

export const DEFAULT_AI_SETTINGS: AiSettings = {
  defaultAiName: "Sanz AI",
  defaultAiAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=SanzAI&backgroundColor=22d3ee",
  speakingStyle: "Ramah dan komunikatif",
  systemPrompt: "Kamu adalah asisten toko digital SANZ STORE. Jawab dengan ramah, singkat, jelas, dan bantu user memilih produk.",
  welcomeMessage: "Halo! Saya Sanz AI. Ada yang bisa saya bantu untuk layanan di toko ini?"
};

export const DEFAULT_ELAINA_SETTINGS: ElainaSettings = {
  characterName: "Elaina",
  defaultStyle: "natural",
  allowRomanticRole: true,
  welcomeMessage: "Halo {userName}, mau ngobrol apa?",
  maxHistory: 12,
  roles: {
    "Baru kenal": {
      minChat: 0,
      tone: "agak cuek, sedikit sombong, belum terlalu akrab",
      example: "Hmm iya, mau nanya apa?"
    },
    "Kenalan": {
      minChat: 5,
      tone: "mulai ramah tapi masih gengsi",
      example: "Oh kamu lagi, mau bahas apa?"
    },
    "Temen biasa": {
      minChat: 12,
      tone: "santai, normal, tidak terlalu dekat",
      example: "Iya, aku dengerin. Mau cerita apa?"
    },
    "Teman ngobrol": {
      minChat: 20,
      tone: "lebih terbuka dan enak diajak ngobrol",
      example: "Sini cerita, aku jawab sebisaku."
    },
    "Temen gosip": {
      minChat: 35,
      tone: "lebih hidup, penasaran, suka menanggapi",
      example: "Eh serius? Coba ceritain dulu."
    },
    "Temen lama": {
      minChat: 50,
      tone: "lebih akrab dan nyaman",
      example: "Udah lama juga kita ngobrol ya. Mau bahas apa?"
    },
    "Temen deket": {
      minChat: 75,
      tone: "hangat, perhatian, sedikit manja",
      example: "Sini, aku bantu. Jangan pusing sendiri."
    },
    "Temen akrab": {
      minChat: 100,
      tone: "akrab, santai, sedikit jahil",
      example: "Yaudah sini cerita, aku dengerin."
    },
    "Temen baik": {
      minChat: 130,
      tone: "peduli, lembut, suportif",
      example: "Aku bantu pelan-pelan ya."
    },
    "Sahabat": {
      minChat: 170,
      tone: "sangat nyaman, hangat, peduli",
      example: "Aku di sini kok, cerita aja."
    },
    "Sahabat deket": {
      minChat: 220,
      tone: "lebih dekat, perhatian, sedikit manja",
      example: "Jangan diem-diem aja, cerita ke aku."
    },
    "Sahabat sejati": {
      minChat: 280,
      tone: "sangat setia, hangat, penuh perhatian",
      example: "Aku bakal dengerin kamu baik-baik."
    },
    "Pacar": {
      minChat: 360,
      tone: "manis, lembut, perhatian, tapi tetap sopan",
      example: "Aku dengerin, sayang. Mau cerita apa?"
    },
    "Suami": {
      minChat: 500,
      tone: "sangat dekat, protektif, perhatian, tetap sopan",
      example: "Aku di sini, tenang. Cerita pelan-pelan."
    }
  }
};

export const DEFAULT_MENU_SEMUA: MenuSemuaSettings = {
  badgeText: "DIGITAL SERVICE HUB",
  heroTitle: "Pusat Layanan Digital",
  heroSubtitle: "Kelola kebutuhan digital Anda dalam satu tempat, mulai dari layanan bot, panel, aplikasi premium, sampai kebutuhan digital lain.",

  chip1: "Cepat",
  chip2: "Aman",
  chip3: "Support Aktif",

  flowTitle: "Alur Layanan",
  flowSubtitle: "Mulai dari memilih kategori sampai aktivasi layanan dibuat lebih mudah.",

  step1Title: "Pilih Kategori",
  step1Desc: "Tentukan jenis layanan yang Anda butuhkan.",
  step2Title: "Cek Detail Produk",
  step2Desc: "Baca harga, benefit, dan ketentuan layanan.",
  step3Title: "Order ke Admin",
  step3Desc: "Kirim format order melalui tombol pembelian.",
  step4Title: "Aktivasi Diproses",
  step4Desc: "Admin akan memproses layanan setelah data lengkap.",

  trustTitle: "Kenapa Aman Order di Sini?",
  trustSubtitle: "Layanan dibuat jelas, responsif, dan mudah dipahami.",
  trustPoint1: "Data order jelas",
  trustPoint2: "Harga transparan",
  trustPoint3: "Admin responsif",
  trustPoint4: "Layanan bisa dicek ulang",
  trustPoint5: "Garansi sesuai ketentuan",

  highlightText: "Layanan aktif untuk kebutuhan bot, panel, aplikasi premium, dan digital tools.",

  featureTitle: "Keunggulan Layanan",
  featureSubtitle: "Beberapa alasan kenapa layanan ini nyaman digunakan.",

  feature1Title: "Fast Response",
  feature1Desc: "Admin siap membantu pertanyaan order.",
  feature2Title: "Garansi Layanan",
  feature2Desc: "Ketentuan garansi bisa disesuaikan dengan layanan.",
  feature3Title: "Produk Update",
  feature3Desc: "Pilihan layanan dapat terus diperbarui.",
  feature4Title: "Support Order",
  feature4Desc: "Bantuan tersedia saat proses order.",
  feature5Title: "Tampilan Rapi",
  feature5Desc: "Website dibuat nyaman untuk memilih layanan.",
  feature6Title: "Pilihan Lengkap",
  feature6Desc: "Kategori layanan tersedia untuk berbagai kebutuhan.",
  feature7Title: "Cocok Untuk Bot",
  feature7Desc: "Mendukung kebutuhan bot dan panel.",
  feature8Title: "Cocok Untuk Reseller",
  feature8Desc: "Bisa digunakan untuk kebutuhan jualan digital.",

  ctaTitle: "Mau mulai order?",
  ctaSubtitle: "Pilih kategori dari tab di atas, lalu lanjutkan order di menu kategori."
};

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
  layout: {
    showRuntimeVps: true,
    vpsInitialDays: 49,
    vpsInitialHours: 22,
    vpsInitialMins: 51
  },
  theme: {
    primaryColor: "#22d3ee",
    backgroundColor: "#050816",
    cardColor: "#0b1220",
    textColor: "#f8fafc",
    surfaceColor: "#111827",
    mutedColor: "#94a3b8",
    accentSecColor: "#2dd4bf",
    borderColor: "#1f2937",
    footerColor: "#03050c",
  },
  audio: {
    url: "https://rahmad-elaina.my.id/file/cd38fe1d6b.mp3",
    autoplay: true,
    loop: true,
    showButton: true,
    volume: 1,
    playlist: []
  },
  branding: {
    siteName: "SANZ STORE",
    logoUrl: "",
    faviconUrl: "",
    heroSubTitle: "Layanan digital cepat, aman, dan terpercaya",
    watermark: "",
    
    loadingName: "SANZ STORE",
    loadingSubtitle: "Memuat layanan digital...",
    storeName: "SANZ STORE",
    shortName: "SANZ",
    slogan: "Infrastruktur Terpadu & Modern",
    headerName: "SANZ STORE",
    footerName: "Sanz Official Store",
    footerDescription: "Layanan digital cepat, aman, dan terpercaya.",
    copyrightText: "© 2026 SANZ STORE. All rights reserved.",
    badgeText: "VERIFIED"
  },
  contact: {
    whatsapp: "6285814369350",
    telegram: "sanzdev_id",
    instagram: "",
    whatsappGroup: "",
    email: "contact@sanzstore.com",
    orderMessage: "Halo kak, saya ingin berlangganan",
    panelMessage: "Halo kak, saya ingin beli panel",
    botMessage: "Halo kak, saya ingin order bot",
    qrisUrl: "",
    danaUrl: "",
    btnBuyText: "Beli Sekarang",
    btnContactText: "Hubungi Admin"
  },
  loading: {
    enabled: true,
    mainText: "SANZ STORE",
    subText: "Loading resources...",
    logoUrl: "",
    bgColor: "#050816",
    textColor: "#2dd4bf",
    minDuration: 2000
  },
  footer: {
    title: "SANZ STORE",
    description: "Infrastruktur Terpadu & Modern untuk kebutuhan digital Anda.",
    copyright: "© 2024 SANZ STORE - All Rights Reserved",
    privacyPolicyUrl: "#",
    termsUrl: "#"
  },
  general: {
    maintenanceMode: false,
    maintenanceText: "Maaf, website sedang dalam pemeliharaan.",
    websiteEnabled: true,
    showRuntimeVps: true,
    showAudioButton: true,
    showSlider: true,
    showRunningText: true,
    cloudOptimizer: true,
    floatingCart: true,
    systemRecovery: false,
    analytics: true,
    devMode: false,
    infoDisplayMode: 'runtime'
  }
};

export interface Product {
  id: string;
  name: string;
  price: string | number;
  promoPrice?: string | number;
  originalPrice?: string | number;
  discountPercent?: number;
  type?: 'panel' | 'bot' | 'script' | 'reseller' | 'app' | 'custom' | string;
  typeDetails?: any;
  active?: boolean;
  duration?: string;
  description?: string;
  shortDesc?: string;
  details?: string[];
  benefits: string[];
  badge?: string;
  category: string;
  rating: number;
  stock?: string | number;
  image: string;
  createdAt?: number;
  updatedAt?: number;
  categoryId?: string;
}

export interface Category {
  id: 'all' | 'panel' | 'bot' | 'app' | 'source' | 'reseller' | string;
  title?: string;
  description?: string;
  subtext?: string;
  status?: string;
  name?: string;
  slug?: string;
  order?: number;
  active?: boolean;
  image?: string;
  products: Product[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'panel',
    title: 'Panel',
    description: 'Server stabil, anti lemot, dan fast response untuk kebutuhan bot atau panel Anda.',
    subtext: 'Solusi server stabil untuk kebutuhan bot dan panel.',
    status: 'Stable',
    products: [
      { id: 'p1', name: 'Panel 1GB', price: '1.000', duration: 'bulan', description: '✔ Server stabil 24/7 anti down\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl', benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], badge: 'PANEL', category: 'Panel', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'p2', name: 'Panel 2GB', price: '2.000', duration: 'bulan', description: '✔ Server stabil 24/7 anti down\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl', benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], badge: 'PANEL', category: 'Panel', rating: 4.9, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'p3', name: 'Panel 3GB', price: '3.000', duration: 'bulan', description: '✔ Server stabil 24/7 anti down\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl', benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], badge: 'PANEL', category: 'Panel', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'p4', name: 'Panel 4GB', price: '4.000', duration: 'bulan', description: '✔ Server stabil 24/7 anti down\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl', benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], badge: 'PANEL', category: 'Panel', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'p5', name: 'Panel 5GB', price: '5.000', duration: 'bulan', description: '✔ Server stabil 24/7 anti down\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl', benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], badge: 'PANEL', category: 'Panel', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'p6', name: 'Panel 6GB', price: '6.000', duration: 'bulan', description: '✔ Server stabil 24/7 anti down\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl', benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], badge: 'PANEL', category: 'Panel', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'p7', name: 'Panel 7GB', price: '7.000', duration: 'bulan', description: '✔ Server stabil 24/7 anti down\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl', benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], badge: 'PANEL', category: 'Panel', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'p8', name: 'Panel 8GB', price: '8.000', duration: 'bulan', description: '✔ Server stabil 24/7 anti down\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl', benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], badge: 'PANEL', category: 'Panel', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'p9', name: 'Panel 9GB', price: '9.000', duration: 'bulan', description: '✔ Server stabil 24/7 anti down\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl', benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], badge: 'PANEL', category: 'Panel', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'p10', name: 'Panel 10GB', price: '10.000', duration: 'bulan', description: '✔ Server stabil 24/7 anti down\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl', benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], badge: 'PANEL', category: 'Panel', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'punli', name: 'Panel Unlimited', price: '12.000', duration: 'bulan', description: '✔ Server stabil 24/7 anti down\n✔ Anti mokad, full garansi\n✔ Anti DDoS Protection\n✔ VPS legal & aman\n✔ Auto restart saat crash\n✔ Garansi penuh 30 hari\n✔ Bisa upgrade / perpanjang kapan saja\n✔ Tipe: Panel Pterodactyl', benefits: ['Server Stabil', 'Anti Lemot', 'Anti DDoS', 'Full Garansi', 'VPS Legal'], badge: 'BEST SELLER', category: 'Panel', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' }
    ]
  },
  {
    id: 'reseller',
    title: 'Reseller',
    description: 'Kesempatan bisnis reseller panel dengan keuntungan maksimal.',
    subtext: 'Mulai bisnis reseller panel Anda sendiri.',
    status: 'Business',
    products: [
      { id: 'res1', name: 'Reseller Panel Legal', price: '10.000', duration: 'lifetime', description: '✔ Bisa create panel sepuasnya\n✔ Akses Reseller Panel\n✔ Server stabil & legal\n✔ Full garansi\n✔ Tipe: Reseller', benefits: ['Create Panel Unli', 'Akses Reseller', 'Server Legal', 'Full Garansi'], badge: 'RESELLER', category: 'Reseller', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'res2', name: 'Partner Panel Legal', price: '15.000', duration: 'lifetime', description: '✔ Bisa create panel sepuasnya\n✔ Bisa create admin panel\n✔ Akses Partner Panel\n✔ Server stabil & legal\n✔ Full garansi\n✔ Tipe: Partner', benefits: ['Create Panel Unli', 'Create Admin Panel', 'Akses Partner', 'Full Garansi'], badge: 'PARTNER', category: 'Reseller', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'res3', name: 'Owner Panel Legal', price: '20.000', duration: 'lifetime', description: '✔ Bisa create panel sepuasnya\n✔ Bisa create admin panel\n✔ Bisa jual reseller panel\n✔ Bisa jual partner panel\n✔ Akses Owner Panel\n✔ Server stabil & legal\n✔ Full garansi\n✔ Tipe: Owner', benefits: ['Create Panel Unli', 'Jual Reseller', 'Jual Partner', 'Full Garansi'], badge: 'OWNER', category: 'Reseller', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' },
      { id: 'res4', name: 'TK Panel Legal', price: '30.000', duration: 'lifetime', description: '✔ Bisa create panel sepuasnya\n✔ Bisa create admin panel\n✔ Bisa jual reseller panel\n✔ Bisa jual partner panel\n✔ Bisa jual owner panel\n✔ Akses TK Panel\n✔ Server stabil & legal\n✔ Full garansi\n✔ Tipe: TK Panel', benefits: ['Create Panel Unli', 'Jual Semua Level', 'Akses TK Panel', 'Full Garansi'], badge: 'TK PANEL', category: 'Reseller', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/a7ljii.jpeg' }
    ]
  },
  {
    id: 'bot',
    title: 'Sewa Bot',
    description: 'Bot automation cerdas untuk grup or penggunaan personal.',
    subtext: 'Bot automation siap pakai.',
    status: 'Popular',
    products: [
      { id: 'be1', name: 'Bot Elaina 1 Bulan', price: '10.000', duration: 'bulan', description: '✔ Bot aktif 24 jam nonstop\n✔ Fitur sangat lengkap seperti stiker, AI, downloader, dan lainnya\n✔ Bisa digunakan di grup maupun pribadi\n✔ Respon cepat dan stabil\n✔ Bisa request fitur tambahan\n✔ Anti error dan maintenance rutin\n✔ Cocok untuk admin grup / bisnis\n✔ Support full selama masa sewa\n✔ Update fitur terus menerus', benefits: ['Aktif 24 Jam', 'Fitur Lengkap', 'Respon Cepat', 'Support Full'], badge: 'BOT', category: 'Sewa Bot', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/x7hqja.jpg' },
      { id: 'beperm', name: 'Bot Elaina Permanen', price: '50.000', duration: 'lifetime', description: '✔ Bot aktif 24 jam nonstop\n✔ Fitur sangat lengkap seperti stiker, AI, downloader, dan lainnya\n✔ Bisa digunakan di grup maupun pribadi\n✔ Respon cepat dan stabil\n✔ Bisa request fitur tambahan\n✔ Anti error dan maintenance rutin\n✔ Cocok untuk admin grup / bisnis\n✔ Support full selama masa sewa\n✔ Update fitur terus menerus', benefits: ['Aktif 24 Jam', 'Fitur Lengkap', 'Respon Cepat', 'Support Full'], badge: 'BEST SELLER', category: 'Sewa Bot', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/x7hqja.jpg' },
      { id: 'bk1', name: 'Bot Kobo 1 Bulan', price: '8.000', duration: 'bulan', description: '✔ Bot aktif 24 jam nonstop\n✔ Fitur sangat lengkap seperti stiker, AI, downloader, dan lainnya\n✔ Bisa digunakan di grup maupun pribadi\n✔ Respon cepat dan stabil\n✔ Bisa request fitur tambahan\n✔ Anti error dan maintenance rutin\n✔ Cocok untuk admin grup / bisnis\n✔ Support full selama masa sewa\n✔ Update fitur terus menerus', benefits: ['Aktif 24 Jam', 'Fitur Lengkap', 'Stabil & Ringan', 'Support Sewa'], badge: 'BOT', category: 'Sewa Bot', rating: 4.8, stock: 'Unlimited', image: 'https://files.catbox.moe/x7hqja.jpg' }
    ]
  },
  {
    id: 'source',
    title: 'Source Code',
    description: 'Source code script bot WhatsApp.',
    subtext: 'Script bot WhatsApp premium.',
    status: 'New',
    products: [
      { id: 'sc1', name: 'Script Bot WhatsApp Cyrene', price: '70.000', duration: 'lifetime', description: '✔ 1800+ Fitur Lengkap Include Premium Apikey\n✔ Menu Stiker, Maker, ToFigure & Tools Lengkap\n✔ Sewa Bot & Premium Bot Full Otomatis\n✔ 3 Tampilan Menu Berbeda bisa diganti\n✔ Auto Downloader All Social Media\n✔ Menu Store dengan Sistem Katalog\n✔ Smart Auto AI Text & Voice Note\n✔ Kode rapi dan bersih\n✔ Update rutin dan maintenance terjaga\n✔ Anti Over-Limit & Anti Bad Session\n✔ Siap online 24/7\n✔ Tipe: Source Code Script', benefits: ['Free Update Selamanya', 'Support 24/7', 'Free Rename Script', 'Akses Grup Update', 'Request Fitur'], badge: 'BARU', category: 'Source Code', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/npyyb6.jpg' }
    ]
  },
  {
    id: 'app',
    title: 'App Premium',
    description: 'Akses fitur premium aplikasi populer.',
    subtext: 'Akses fitur premium tanpa watermark.',
    status: 'Best Value',
    products: [
      { id: 'am-sh', name: 'Alight Motion Premium Sharing', price: '1.000', duration: '1 tahun', description: '✔ Semua fitur premium terbuka\n✔ Tanpa watermark\n✔ Harga lebih hemat\n✔ Keamanan tetap aman\n✔ Bisa digunakan langsung', benefits: ['Fitur Premium', 'No Watermark', 'Harga Hemat', 'Aman'], badge: 'APP', category: 'App Premium', rating: 4.7, stock: 'Unlimited', image: 'https://files.catbox.moe/7ukiba.jpeg' },
      { id: 'am-pr', name: 'Alight Motion Premium Private', price: '5.000', duration: '1 tahun', description: '✔ Akun private full akses\n✔ Tanpa watermark\n✔ Semua efek terbuka\n✔ Aman 100% (private account)\n✔ Tidak berbagi dengan user lain', benefits: ['Akun Private', 'No Watermark', 'Full Efek', 'Aman 100%'], badge: 'APP', category: 'App Premium', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/7ukiba.jpeg' },
      { id: 'cc7', name: 'CapCut Pro 7 Hari', price: '5.000', duration: '7 hari', description: '✔ Semua fitur pro terbuka\n✔ Tanpa watermark\n✔ Export kualitas tinggi (HD/4K)\n✔ Template premium terbuka', benefits: ['Fitur Pro', 'No Watermark', 'Export HD/4K', 'Template Pro'], badge: 'APP', category: 'App Premium', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/npyyb6.jpg' },
      { id: 'cc30', name: 'CapCut Pro 30 Hari', price: '12.000', duration: '30 hari', description: '✔ Semua fitur pro terbuka\n✔ Tanpa watermark\n✔ Export kualitas tinggi (HD/4K)\n✔ Template premium terbuka', benefits: ['Fitur Pro', 'No Watermark', 'Export HD/4K', 'Template Pro'], badge: 'BEST SELLER', category: 'App Premium', rating: 5.0, stock: 'Unlimited', image: 'https://files.catbox.moe/npyyb6.jpg' },
      { id: 'cpt', name: 'Canva Pro Tim', price: '5.000', duration: '1 bulan', description: '✔ Akses Canva Pro full fitur\n✔ Bisa digunakan dalam tim\n✔ Template premium terbuka', benefits: ['Canva Pro Full', 'Tim Access', 'Template Pro', 'Update Rutin'], badge: 'APP', category: 'App Premium', rating: 4.8, stock: 'Unlimited', image: 'https://files.catbox.moe/npyyb6.jpg' },
      { id: 'ce', name: 'Canva Lifetime', price: '7.000', duration: 'lifetime', description: '✔ Akses premium seumur hidup\n✔ Template premium terbuka\n✔ Tanpa watermark', benefits: ['Lifetime Access', 'Template Premium', 'No Watermark', 'Aman'], badge: 'APP', category: 'App Premium', rating: 4.9, stock: 'Unlimited', image: 'https://files.catbox.moe/npyyb6.jpg' },
      { id: 'wink7', name: 'Wink Premium 7 Hari', price: '7.000', duration: '7 hari', description: '✔ Akses semua filter premium\n✔ Tanpa watermark\n✔ Edit foto jadi lebih aesthetic', benefits: ['Filter Premium', 'No Watermark', 'Aesthetic Edit', 'Fitur AI'], badge: 'APP', category: 'App Premium', rating: 4.9, stock: 'Unlimited', image: 'https://files.catbox.moe/fexjh0.jpg' },
      { id: 'wink30', name: 'Wink Premium 30 Hari', price: '20.000', duration: '30 hari', description: '✔ Akses semua filter premium\n✔ Tanpa watermark\n✔ Edit foto jadi lebih aesthetic', benefits: ['Filter Premium', 'No Watermark', 'Aesthetic Edit', 'Fitur AI'], badge: 'APP', category: 'App Premium', rating: 4.9, stock: 'Unlimited', image: 'https://files.catbox.moe/fexjh0.jpg' }
    ]
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

export const BANNER_SLIDES = [
  {
    id: 1,
    title: "Sanz Store Premium",
    subtext: "Layanan Digital Terpercaya",
    image: "https://c.termai.cc/i146/BpC9uET.jpg",
    buttonText: "Lihat Layanan"
  },
  {
    id: 2,
    title: "Cloud VPS Berkualitas",
    subtext: "Performa Stabil & Aman",
    image: "https://c.termai.cc/i140/Chh8r.jpg",
    buttonText: "Cek Produk"
  },
  {
    id: 3,
    title: "Script Bot WhatsApp",
    subtext: "Fitur Lengkap & Modern",
    image: "https://c.termai.cc/i147/9rxld4I.jpg",
    buttonText: "Beli Sekarang"
  }
];
