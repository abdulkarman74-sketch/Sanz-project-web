import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, orderBy, getDocs, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, firebaseReady } from '../lib/firebase';
import { SiteSettings, Category, Product, HeroSlide, DEFAULT_SITE_SETTINGS, CATEGORIES } from '../constants';

export function useStoreData() {
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    // Jika Firebase belum disetting, gunakan data default dan berhenti loading
    if (!firebaseReady || !db) {
      setLoading(false);
      setCategories(CATEGORIES);
      setProducts(CATEGORIES.flatMap(c => c.products.map(p => ({ ...p, categoryId: c.id }))));
      setSlides(DEFAULT_SITE_SETTINGS.heroSlides);
      return;
    }

    let unsubMain: any;
    let unsubTheme: any;
    let unsubBranding: any;
    let unsubAudio: any;
    let unsubContact: any;
    let unsubLoading: any;
    let unsubFooter: any;
    let unsubGeneral: any;
    let unsubProducts: any;
    let unsubSlides: any;
    let unsubCats: any;

    const init = async () => {
      setLoading(true);

      try {
        // --- SEEDER LOGIC ---
        const productsSnap = await getDocs(collection(db, 'products'));
        if (productsSnap.empty) {
          console.log('Firestore empty, seeding default data...');
          // Seed Settings
          await setDoc(doc(db, 'settings', 'main'), {
            storeName: DEFAULT_SITE_SETTINGS.branding.siteName,
            slogan: DEFAULT_SITE_SETTINGS.branding.slogan,
            contact: DEFAULT_SITE_SETTINGS.contact
          }, { merge: true });
          
          await setDoc(doc(db, 'settings', 'branding'), DEFAULT_SITE_SETTINGS.branding, { merge: true });
          await setDoc(doc(db, 'settings', 'audio'), DEFAULT_SITE_SETTINGS.audio, { merge: true });
          await setDoc(doc(db, 'settings', 'theme'), DEFAULT_SITE_SETTINGS.theme, { merge: true });
          await setDoc(doc(db, 'settings', 'footer'), DEFAULT_SITE_SETTINGS.footer, { merge: true });
          await setDoc(doc(db, 'settings', 'general'), DEFAULT_SITE_SETTINGS.general, { merge: true });
          await setDoc(doc(db, 'settings', 'loading'), DEFAULT_SITE_SETTINGS.loading, { merge: true });
          
          // Seed Slides
          for (const slide of DEFAULT_SITE_SETTINGS.heroSlides) {
            await setDoc(doc(db, 'slides', slide.id), slide, { merge: true });
          }
          
          // Seed Categories
          for (const cat of CATEGORIES) {
            const { products, ...catData } = cat;
            await setDoc(doc(db, 'categories', cat.id), { ...catData, slug: cat.id, active: true }, { merge: true });
            
            // Seed initially products to products collection
            for (const prod of products) {
              await setDoc(doc(db, 'products', prod.id), { ...prod, categoryId: cat.id }, { merge: true });
            }
          }
          
          console.log('Seeding complete.');
        }

        // Subscribe to settings (Global)
        onSnapshot(doc(db, 'settings', 'layout'), (snap) => {
           if (snap.exists()) {
              setSiteSettings(prev => ({
                 ...prev,
                 theme: { ...prev.theme, layoutId: snap.data().layoutId },
                 layout: { ...prev.layout, ...snap.data() } as any
              }));
           }
        });

        unsubMain = onSnapshot(doc(db, 'settings', 'main'), (snap) => {
           if (snap.exists()) {
             const data = snap.data();
             setSiteSettings(prev => ({
               ...prev, 
               branding: { 
                 ...prev.branding, 
                 siteName: data.storeName || prev.branding.siteName,
                 slogan: data.slogan || prev.branding.slogan
               },
               contact: {
                 ...prev.contact,
                 ...data.contact
               }
             } as any));
           }
        });
        unsubTheme = onSnapshot(doc(db, 'settings', 'theme'), (snap) => {
           if (snap.exists()) {
             const data = snap.data();
             setSiteSettings(prev => ({
               ...prev, 
               theme: {
                 ...prev.theme, 
                 ...data,
                 // Preserve layoutId if it came from the separate layout listener
                 layoutId: data.layoutId || prev.theme.layoutId 
               }
             } as any));
           }
        });
        unsubBranding = onSnapshot(doc(db, 'settings', 'branding'), (snap) => {
           if (snap.exists()) {
             const data = snap.data();
             setSiteSettings(prev => ({...prev, branding: { ...prev.branding, ...data } as any}));
           }
        });
        unsubAudio = onSnapshot(doc(db, 'settings', 'audio'), (snap) => {
           if (snap.exists()) setSiteSettings(prev => ({...prev, audio: {...prev.audio, ...snap.data()}} as any));
        });
        unsubContact = onSnapshot(doc(db, 'settings', 'contact'), (snap) => {
           if (snap.exists()) {
             setSiteSettings(prev => ({...prev, contact: { ...(prev.contact || DEFAULT_SITE_SETTINGS.contact), ...snap.data() } as any}));
           }
        });
        unsubLoading = onSnapshot(doc(db, 'settings', 'loading'), (snap) => {
           if (snap.exists()) {
             setSiteSettings(prev => ({...prev, loading: { ...(prev.loading || DEFAULT_SITE_SETTINGS.loading), ...snap.data() } as any}));
           }
        });
        unsubFooter = onSnapshot(doc(db, 'settings', 'footer'), (snap) => {
           if (snap.exists()) {
             setSiteSettings(prev => ({...prev, footer: { ...(prev.footer || DEFAULT_SITE_SETTINGS.footer), ...snap.data() } as any}));
           }
        });
        unsubGeneral = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
           if (snap.exists()) {
             setSiteSettings(prev => ({...prev, general: { ...(prev.general || DEFAULT_SITE_SETTINGS.general), ...snap.data() } as any}));
           }
        });

        // Subscribe to collections (Global)
        unsubCats = onSnapshot(collection(db, 'categories'), (snap) => {
           const cats: Category[] = [];
           snap.forEach(d => cats.push({ id: d.id, ...d.data(), products: [] } as Category));
           cats.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
           setCategories(cats);
        });

        unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
           const prods: Product[] = [];
           snap.forEach(d => prods.push({ id: d.id, ...d.data() } as Product));
           setProducts(prods);
           setLoading(false);
        });

        unsubSlides = onSnapshot(collection(db, 'slides'), (snap) => {
           const slds: HeroSlide[] = [];
           snap.forEach(d => slds.push({ id: d.id, ...d.data() } as HeroSlide));
           setSlides(slds.length > 0 ? slds : DEFAULT_SITE_SETTINGS.heroSlides);
           setSiteSettings(prev => ({...prev, heroSlides: slds.length > 0 ? slds : DEFAULT_SITE_SETTINGS.heroSlides}));
        });
      } catch (err) {
        console.error("Error initializing store data:", err);
        setLoading(false);
        // Fallback data
        setCategories(CATEGORIES);
        setProducts(CATEGORIES.flatMap(c => c.products.map(p => ({ ...p, categoryId: c.id }))));
        setSlides(DEFAULT_SITE_SETTINGS.heroSlides);
      }
    };

    init();

    return () => {
      if(unsubMain) unsubMain();
      if(unsubTheme) unsubTheme();
      if(unsubBranding) unsubBranding();
      if(unsubAudio) unsubAudio();
      if(unsubContact) unsubContact();
      if(unsubLoading) unsubLoading();
      if(unsubFooter) unsubFooter();
      if(unsubGeneral) unsubGeneral();
      if(unsubProducts) unsubProducts();
      if(unsubSlides) unsubSlides();
      if(unsubCats) unsubCats();
    };
  }, []);

  useEffect(() => {
    const titleName = siteSettings.branding.storeName || siteSettings.branding.siteName;
    if (titleName) {
      document.title = `${titleName}`;
    }
    if (siteSettings.branding.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = siteSettings.branding.faviconUrl;
    }
  }, [siteSettings.branding.siteName, siteSettings.branding.storeName, siteSettings.branding.faviconUrl]);

  return { loading, siteSettings, categories, products, slides };
}
