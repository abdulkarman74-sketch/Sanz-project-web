export const formatProductTypeDetails = (typeDetails: any, type: string) => {
  if (!typeDetails) return [];
  
  const items: {label: string, value: string}[] = [];
  const map: any = {
    panel: { ram: 'RAM', cpu: 'CPU', disk: 'Disk', region: 'Region', duration: 'Durasi', featuresCount: 'Fitur', antiDown: 'Anti Down', suitableFor: 'Cocok Untuk', limitUser: 'User Limit', warranty: 'Garansi' },
    bot: { duration: 'Durasi', featuresCount: 'Total Fitur', autoReply: 'Auto Reply', antiLink: 'Anti Link', welcome: 'Welcome Msg', downloader: 'Downloader', ai: 'AI Powered', warranty: 'Garansi', support: 'Support', botType: 'Tipe' },
    script: { version: 'Versi', framework: 'Framework', featuresCount: 'Total Fitur', freeUpdate: 'Update Gratis', tutorial: 'Termasuk Tutorial', apiKey: 'Termasuk API', license: 'Lisensi', bugWarranty: 'Garansi Bug', delivery: 'Pengiriman' },
    reseller: { package: 'Paket', limitCreate: 'Limit Create', access: 'Akses', commission: 'Komisi', warranty: 'Garansi', activePeriod: 'Masa Aktif', suitableFor: 'Cocok Untuk', supportSetup: 'Support Setup' },
    app: { duration: 'Durasi', accountType: 'Tipe Akun', warranty: 'Garansi', region: 'Region', privateLogin: 'Private Login', inviteSystem: 'Invite System', rules: 'Ketentuan', stock: 'Stok Akun' },
    custom: { serviceType: 'Layanan', estimate: 'Estimasi', revision: 'Revisi', warranty: 'Garansi Hasil', details: 'Detail Request', payment: 'Sistem Pembayaran', notes: 'Catatan' },
  };

  const keyMap = map[type || 'panel'] || {};

  Object.keys(typeDetails).forEach(key => {
    if (typeDetails[key] !== undefined && typeDetails[key] !== '' && keyMap[key]) {
      let val = typeDetails[key];
      if (typeof val === 'boolean') val = val ? 'Ya' : 'Tidak';
      items.push({ label: keyMap[key], value: String(val) });
    }
  });

  return items;
};

export const getSmartStockLabel = (stock: any) => {
  if (stock === undefined || stock === null || stock === '') return null;
  const num = Number(stock);
  if (isNaN(num)) return { text: stock, color: 'text-theme-accent-sec bg-theme-accent-sec/10 border-theme-accent-sec/20' };
  if (num <= 0) return { text: 'Habis', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
  if (num < 5) return { text: `Hampir Habis (${num})`, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
  return { text: `Tersedia (${num})`, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
};
