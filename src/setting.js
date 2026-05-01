/**
 * KONFIGURASI SANZ STORE
 *
 * File ini adalah pusat pengaturan project.
 *
 * Cara pakai:
 * 1. Ubah adminPassword untuk mengganti sandi login admin.
 * 2. Firebase config diambil dari Firebase Console > Project Settings > Web App.
 * 3. Jangan menaruh initializeApp di file ini.
 * 4. Jika firebaseConfig kosong/tidak lengkap, fitur simpan admin harus ditolak dengan pesan jelas.
 */

export const APP_SETTINGS = {
  // Sandi/PIN login admin
  adminPassword: "6285814369350",

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

