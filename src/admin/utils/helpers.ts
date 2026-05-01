import { toast } from "react-hot-toast";
import { db, firebaseReady } from "../../lib/firebase";

export const ensureFirebaseReady = () => {
  if (!firebaseReady || !db) {
    toast.error("Firebase belum disetting di setting.js");
    return false;
  }
  return true;
};

export const removeUndefinedDeep = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedDeep);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc: any, key) => {
      const val = removeUndefinedDeep(obj[key]);
      if (val !== undefined) {
        acc[key] = val;
      }
      return acc;
    }, {});
  }
  return obj;
};

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

export const formatPrice = (price: number | string) => {
  const num = Number(price) || 0;
  return `Rp ${num.toLocaleString("id-ID")}`;
};

export const safeToastError = (err: any, fallbackMessage: string = "Terjadi kesalahan") => {
  console.error(err);
  if (err?.code === "permission-denied") {
    toast.error("Akses ditolak. Cek Firestore Rules.");
  } else if (err?.code === "unavailable") {
    toast.error("Koneksi ke Firebase gagal.");
  } else {
    toast.error(err?.message || fallbackMessage);
  }
};
