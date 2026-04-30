export const PRODUCT_TYPES = [
  { id: 'panel', name: 'Panel / Hosting', icon: 'server' },
  { id: 'bot', name: 'Sewa Bot', icon: 'bot' },
  { id: 'script', name: 'Source Code / Script', icon: 'code' },
  { id: 'reseller', name: 'Reseller Panel', icon: 'users' },
  { id: 'app', name: 'App Premium', icon: 'crown' },
  { id: 'custom', name: 'Jasa / Custom', icon: 'briefcase' }
];

export const generateProductTemplate = (type: string, name: string) => {
  switch (type) {
    case 'panel':
      return `${name || 'Panel'} cocok untuk menjalankan bot WhatsApp, website ringan, dan kebutuhan hosting digital dengan performa stabil.`;
    case 'bot':
      return `${name || 'Bot'} - Bot WhatsApp otomatis yang siap membantu tugas digital Anda 24/7.`;
    case 'script':
      return `Source code ${name || 'Script'} dengan fitur lengkap, mudah dikembangkan, dan minim bug.`;
    case 'reseller':
      return `Paket reseller ${name || 'Panel'} untuk mulai bisnis jualan panel dengan keuntungan maksimal.`;
    case 'app':
      return `Akun premium ${name || 'App'} siap pakai dengan masa aktif sesuai paket, aman dan praktis.`;
    case 'custom':
      return `Layanan ${name || 'Custom'} profesional, pengerjaan cepat dan bergaransi sesuai request.`;
    default:
      return `${name || 'Produk'} berkualitas premium dan siap digunakan.`;
  }
};

export const getBadgeForType = (type: string) => {
  switch (type) {
    case 'panel': return 'Hosting Panel';
    case 'bot': return 'Bot Service';
    case 'script': return 'Developer Script';
    case 'reseller': return 'Reseller Plan';
    case 'app': return 'Premium Account';
    case 'custom': return 'Custom Service';
    default: return 'Best Choice';
  }
};
