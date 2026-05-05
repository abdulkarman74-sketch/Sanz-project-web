/**
 * KONFIGURASI SANZ STORE
 *
 * File ini adalah pusat pengaturan project.
 *
 * Cara pakai:
 * 1. Firebase config diambil dari Firebase Console > Project Settings > Web App.
 * 2. Jangan menaruh initializeApp di file ini.
 * 3. Jika firebaseConfig kosong/tidak lengkap, fitur simpan admin harus ditolak dengan pesan jelas.
 */

export const adminLoginConfig = {
  username: "Sanz_1701",
  password: "sanzstore"
};

globalThis.adminLogin = adminLoginConfig;
globalThis.adminUsername = adminLoginConfig.username;
globalThis.adminPassword = adminLoginConfig.password;

export const APP_SETTINGS = {
  // Sandi/PIN fallback (tidak disarankan pakai ini lagi)
  adminPassword: "sanzstore",

  // Firebase config project baru: sanzstore-6398b
  firebaseConfig: {
    apiKey: "AIzaSyDPeo-MlxteD1Z1Mph2NoraDV1a41wbHzo",
    authDomain: "sanzstore-6398b.firebaseapp.com",
    projectId: "sanzstore-6398b",
    storageBucket: "sanzstore-6398b.firebasestorage.app",
    messagingSenderId: "329330854142",
    appId: "1:329330854142:web:c4ba16311d5b557ecbfdaf",
    measurementId: ""
  }
};

