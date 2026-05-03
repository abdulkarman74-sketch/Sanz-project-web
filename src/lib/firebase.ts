import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, initializeFirestore } from "firebase/firestore";
import { APP_SETTINGS } from "../setting";

const firebaseConfig = APP_SETTINGS.firebaseConfig;

export function isFirebaseConfigured(config: any) {
  const required = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId"
  ];

  return required.every(
    key => typeof config?.[key] === "string" && config[key].trim() !== ""
  );
}

export const firebaseReady = isFirebaseConfigured(firebaseConfig);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (firebaseReady) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    try {
      db = initializeFirestore(app, {
        experimentalForceLongPolling: true
      });
    } catch (e: any) {
      if (e.message?.includes('already initialized')) {
        db = getFirestore(app);
      } else {
        throw e;
      }
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase belum lengkap. Cek src/setting.js");
}

export { app, db };

