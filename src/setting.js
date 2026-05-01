/**
 * KONFIGURASI SANZ STORE
 * 
 * Sesuai instruksi:
 * 1. Ubah adminPassword untuk mengganti sandi login admin.
 * 2. Isi firebaseConfig dengan data dari Firebase Console (Project Settings).
 * 3. Jika firebaseConfig kosong atau tidak lengkap, fitur simpan data akan dinonaktifkan (Mode Lokal).
 */

export const APP_SETTINGS = {
  // Sandi/PIN Toko (Default: 6285814369350)
  adminPassword: "6285814369350",

  // Konfigurasi Firebase (Ambil dari Firebase Console)
  firebaseConfig: {
    apiKey: "AIzaSyBkWHSFmJEJHVdyU1-s9n7NU6NoMMaYnSU",
    authDomain: "sanzstore-b8048.firebaseapp.com",
    projectId: "sanzstore-b8048",
    storageBucket: "sanzstore-b8048.firebasestorage.app",
    messagingSenderId: "1053913103182",
    appId: "1:1053913103182:web:5423d380ad07f06dfdfc1f",
    measurementId: ""
  }
};

