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
    return obj.map(removeUndefinedDeep).filter((v: any) => v !== undefined);
  }
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => [k, removeUndefinedDeep(v)])
    );
  }
  return obj;
};

export const withTimeout = <T>(promise: Promise<T>, ms: number = 15000): Promise<T> => {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error("Timeout: simpan terlalu lama")), ms)
  );
  return Promise.race([promise, timeout]);
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
  } else if (err?.message?.includes("Timeout")) {
    toast.error("Timeout. Periksa koneksi internet / rules.");
  } else {
    toast.error(err?.message || fallbackMessage);
  }
};
