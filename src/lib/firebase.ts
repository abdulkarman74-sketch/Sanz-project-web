import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { APP_SETTINGS } from '../setting';

/**
 * Validasi apakah Firebase sudah dikonfigurasi dengan benar di setting.js
 */
export function isFirebaseConfigured(config: any) {
  if (!config) return false;
  
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];
  
  return requiredFields.every(field => 
    config[field] && 
    typeof config[field] === 'string' && 
    config[field].trim() !== ''
  );
}

const firebaseConfig = APP_SETTINGS.firebaseConfig;
export const firebaseReady = isFirebaseConfigured(firebaseConfig);

let app: any = null;
let db: any = null;

if (firebaseReady) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase belum disetting di setting.js. Aplikasi berjalan dalam Mode Lokal.");
}

export { app, db };

