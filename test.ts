fetch('https://api.siputzx.my.id/api/d/tiktok?url=https://www.tiktok.com/@tiktok/video/7106594312292453675').then(async r => console.log(r.status, await r.text())).catch(console.error);
