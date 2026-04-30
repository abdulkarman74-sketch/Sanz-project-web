/**
 * KONFIGURASI SANZ STORE
 * 
 * Sesuai instruksi:
 * 1. Ubah adminPassword untuk mengganti sandi login admin.
 * 2. Isi firebaseConfig dengan data dari Firebase Console (Project Settings).
 * 3. Jika firebaseConfig kosong atau tidak lengkap, fitur simpan data akan dinonaktifkan (Mode Lokal).
 */

export const APP_SETTINGS = {
  // Sandi/PIN Toko (Default: 8381309827)
  adminPassword: "8381309827",

  // Konfigurasi Firebase (Ambil dari Firebase Console)
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  }
};
