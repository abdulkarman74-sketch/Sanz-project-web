/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, 
  Bot, 
  Smartphone, 
  ChevronLeft, 
  CheckCircle2, 
  ExternalLink,
  Shield,
  Zap,
  DollarSign,
  Users,
  Volume2,
  VolumeX,
  Music,
  Music2,
  MessageSquare,
  Info,
  Rocket as RocketIcon,
  Database,
  Cpu,
  Layers,
  Flame,
  Video,
  Lock
} from 'lucide-react';
import { CATEGORIES, WHATSAPP_NUMBER, Category, Product } from './constants';

// --- Components ---

const Meteor = () => {
  const [style, setStyle] = useState<any>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const reset = () => {
      const top = Math.random() * -100;
      const left = Math.random() * 100;
      const duration = 2 + Math.random() * 3;
      const delay = Math.random() * 10;
      setStyle({
        top: `${top}%`,
        left: `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      });
    };
    reset();
  }, []);

  if (isMobile) return null;

  return (
    <div className="meteor will-change-transform" style={style} />
  );
};

const Planet = ({ size, color, top, left, delay, rotateDir = 1 }: { size: string, color: string, top: string, left: string, delay: string, rotateDir?: number }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isMobile ? 0.3 : 0.6, 
        scale: 1,
        rotate: isMobile ? 0 : 360 * rotateDir
      }}
      transition={{ 
        opacity: { duration: 2 },
        rotate: { duration: 120, repeat: Infinity, ease: "linear" }
      }}
      className={`absolute rounded-full blur-[1px] shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(59,130,246,0.2)] ${size} ${color} will-change-transform`}
      style={{ top, left, transitionDelay: delay }}
    >
      {/* Planet Surface Detail */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] rounded-full" />
      {/* Atmosphere Glow */}
      {!isMobile && <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.1)]" />}
    </motion.div>
  );
};

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTrail(pos);
    }, 50);
    return () => clearTimeout(timeout);
  }, [pos]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none z-[60] hidden md:block will-change-transform"
        animate={{ x: pos.x - 128, y: pos.y - 128 }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 bg-blue-400/20 blur-[10px] rounded-full pointer-events-none z-[60] hidden md:block will-change-transform"
        animate={{ x: trail.x - 16, y: trail.y - 16 }}
        transition={{ type: "spring", damping: 40, stiffness: 300, mass: 0.8 }}
      />
    </>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020205] overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Lightweight Galaxy Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a0a2a_0%,#020205_100%)]" />
        
        {/* Minimal Nebula */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_70%)] opacity-50" />

        {/* Few Twinkling Stars */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-[70%] max-w-xl flex flex-col items-center">
        {/* Store Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-8"
        >
          <h1 className="text-white font-sans text-sm md:text-base font-light uppercase tracking-[0.6em] text-center drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
            Sanz Official Store
          </h1>
        </motion.div>

        {/* Progress Bar Container */}
        <div className="relative w-full h-2 bg-zinc-800/80 rounded-full overflow-hidden border border-white/5">
          {/* Progress Fill */}
          <motion.div 
            className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            style={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          >
            {/* Light Streak Effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>

        {/* Completion Glow */}
        <AnimatePresence>
          {progress === 100 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 -m-10 bg-cyan-500/10 blur-[40px] rounded-full -z-10"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ProductCard = ({ product, categoryId }: { product: Product, categoryId: string }) => {
  const handleOrder = () => {
    let message = `min mau order ${product.name} ${product.duration ? `[${product.duration}]` : ''} [${product.price}]`;
    if (categoryId === 'panel') {
      message = `min mau order panel [${product.name}] [${product.price}]`;
    } else if (categoryId === 'bot') {
      const botName = product.name.toLowerCase().includes('elaina') ? 'elaina' : 'kobo';
      message = `min mau order sewa bot ${botName} [${product.duration}] [${product.price}]`;
    } else if (categoryId === 'app') {
      message = `Min mau order ${product.name}`;
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getIcon = () => {
    if (product.name.toLowerCase().includes('alight motion')) return <Video className="w-6 h-6" />;
    if (categoryId === 'panel') return <Database className="w-6 h-6" />;
    if (categoryId === 'bot') return <Bot className="w-6 h-6" />;
    return <Layers className="w-6 h-6" />;
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative bg-[#111827]/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] overflow-hidden will-change-transform"
    >
      {/* Glass Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-0 right-0 z-20">
          <div className="bg-blue-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-tighter flex items-center gap-1 shadow-lg">
            {product.badge === 'Best Seller' && <Flame className="w-3 h-3" />}
            {product.badge === 'Fast Access' && <Zap className="w-3 h-3" />}
            {product.badge.includes('Private') && <Lock className="w-3 h-3" />}
            {product.badge.includes('Shared') && <Zap className="w-3 h-3" />}
            {product.badge}
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-colors"
          >
            {getIcon()}
          </motion.div>
        </div>

        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-100 transition-colors">{product.name}</h3>
        {product.details && (
          <div className="mb-3 space-y-0.5">
            {product.details.map((detail, idx) => (
              <p key={idx} className="text-[10px] text-gray-500 font-medium leading-tight">{detail}</p>
            ))}
          </div>
        )}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-black text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">Rp {product.price}</span>
          {product.duration && <span className="text-gray-500 text-xs font-mono uppercase tracking-tighter">/ {product.duration}</span>}
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-blue-500/50 via-blue-500/10 to-transparent mb-4" />

        <ul className="space-y-2 mb-6">
          {product.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-2.5 text-[13px] text-gray-400 group-hover:text-gray-300 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-500 transition-colors" />
              {benefit}
            </li>
          ))}
        </ul>

        <button
          onClick={handleOrder}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-95"
        >
          ORDER SEKARANG
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

const DetailView = ({ category, onBack, onCategoryChange }: { category: Category, onBack: () => void, onCategoryChange: (cat: Category) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 bg-[#0b0f19] overflow-y-auto"
    >
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 tech-grid opacity-[0.03]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Menu Utama
          </button>

          {/* Category Switcher */}
          <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  category.id === cat.id 
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-mono uppercase tracking-widest mb-2">
            <span>Home</span>
            <span className="opacity-50">/</span>
            <span>{category.title}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            {category.title}
          </h2>
          <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">{category.description}</p>
        </div>

        {category.id === 'bot' ? (
          <div className="space-y-20">
            {/* Bot Kobo Section */}
            <section>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Bot className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    SEWA BOT KOBO KANAERU
                  </h3>
                </div>
                <p className="text-gray-400 text-sm max-w-xl">
                  Bot WhatsApp dengan fitur otomatis lengkap dan performa stabil untuk kebutuhan personal maupun grup.
                </p>
                <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-blue-500/50 via-blue-500/10 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.products.filter(p => p.id.startsWith('bk')).map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} categoryId={category.id} />
                  </div>
                ))}
              </div>
            </section>

            {/* Visual Divider */}
            <div className="relative py-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]"></div>
              </div>
              <div className="relative px-4 bg-[#0b0f19]">
                <div className="p-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <Cpu className="w-4 h-4 text-blue-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Bot Elaina Section */}
            <section>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Flame className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    SEWA BOT ELAINA MD
                  </h3>
                </div>
                <p className="text-gray-400 text-sm max-w-xl">
                  Bot WhatsApp dengan fitur premium dan sistem respons cepat, dirancang untuk efisiensi maksimal.
                </p>
                <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-purple-500/50 via-purple-500/10 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.products.filter(p => p.id.startsWith('be')).map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} categoryId={category.id} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {category.products.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} categoryId={category.id} />
              </div>
            ))}
          </motion.div>
        )}

        {/* Footer in Detail */}
        <footer className="mt-24 pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-white/80 text-sm font-medium mb-1">© 2026 Sanz Official Store</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">All Rights Reserved</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="https://chat.whatsapp.com/H4IQh2FeNEtJb8II2ZNJfd?mode=gi_t" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors group"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-400/60 group-hover:text-blue-400" />
                <span className="group-hover:underline underline-offset-4">Join Group Bot</span>
              </a>
              <a 
                href="https://whatsapp.com/channel/0029Vb73N7dId7nVhxB4wu3R" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors group"
              >
                <Info className="w-3.5 h-3.5 text-blue-400/60 group-hover:text-blue-400" />
                <span className="group-hover:underline underline-offset-4">Channel Info & Testimoni</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fadeAudio = (targetVolume: number, duration: number) => {
    if (!audioRef.current) return;
    const startVolume = audioRef.current.volume;
    const steps = 20;
    const interval = duration / steps;
    const volumeStep = (targetVolume - startVolume) / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      if (audioRef.current) {
        const nextVolume = audioRef.current.volume + volumeStep;
        audioRef.current.volume = Math.max(0, Math.min(1, nextVolume));
      }
      currentStep++;
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        if (targetVolume === 0 && audioRef.current) {
          audioRef.current.pause();
        }
      }
    }, interval);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isAudioPlaying) {
      fadeAudio(0, 1000);
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.log("Playback blocked", e));
      fadeAudio(0.25, 1000);
      setIsAudioPlaying(true);
    }
  };

  useEffect(() => {
    if (!loading && audioRef.current) {
      // Set volume to 25% as requested
      audioRef.current.volume = 0.25;
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
      }).catch(() => {
        console.log("Autoplay blocked by browser - waiting for interaction");
        setIsAudioPlaying(false);
      });
    }
  }, [loading]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (loading || activeCategory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [loading, activeCategory]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <main className="relative min-h-screen flex flex-col">
          {/* Cinematic Background */}
          <div className="fixed inset-0 z-0 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=60&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-40 will-change-transform"
              style={{
                x: mousePos.x,
                y: mousePos.y,
              }}
            />
            {/* Brighter Galaxy Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-purple-900/10 to-[#050505]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_0%,transparent_60%)]" />
            
            {/* Twinkling Stars */}
            <div className="stars-container absolute inset-0 opacity-40"></div>
            
            {/* Meteors */}
            {[...Array(3)].map((_, i) => (
              <Meteor key={i} />
            ))}

            {/* Large Planets */}
            <Planet 
              size="w-64 h-64 md:w-96 md:h-96" 
              color="bg-gradient-to-br from-blue-600 via-indigo-900 to-black" 
              top="-10%" 
              left="-5%" 
              delay="0s"
            />
            <Planet 
              size="w-48 h-48 md:w-80 md:h-80" 
              color="bg-gradient-to-br from-purple-600 via-pink-900 to-black" 
              top="60%" 
              left="80%" 
              delay="1s"
              rotateDir={-1}
            />

            {/* Tech Grid Background */}
            <div className="absolute inset-0 tech-grid opacity-[0.08]" />
            
            {/* Nebula Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <CursorGlow />

          {/* Hero Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 md:py-0">
            <div className="max-w-4xl w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-16 text-center md:text-left"
              >
                <div className="relative inline-block mb-6">
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] italic">
                    SANZ OFFICIAL STORE
                  </h1>
                  <div className="absolute -inset-1 bg-blue-500/20 blur-xl -z-10 rounded-full opacity-50" />
                </div>
                
                <p className="text-blue-400 font-mono text-sm tracking-[0.3em] uppercase mb-8 flex items-center justify-center md:justify-start gap-3">
                  <span className="w-8 h-[1px] bg-blue-500/50" />
                  Digital Future Interface
                  <span className="w-8 h-[1px] bg-blue-500/50" />
                </p>
                
                <div className="relative p-6 bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl max-w-3xl">
                  <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                    Sanz Official Store adalah platform digital masa depan yang menyediakan layanan <span className="text-blue-400 font-bold">Panel Pterodactyl</span>, <span className="text-blue-400 font-bold">Sewa Bot WhatsApp</span>, dan <span className="text-blue-400 font-bold">Aplikasi Premium</span> dengan performa tinggi, harga terjangkau, dan kualitas terbaik di kelasnya.
                  </p>
                  {/* Decorative Corner */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/40 rounded-tl-lg" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/40 rounded-br-lg" />
                </div>
              </motion.div>

              {/* Launcher Menu */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-center justify-center"
              >
                {CATEGORIES.map((cat, idx) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{
                      y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.5
                      }
                    }}
                    onClick={() => setActiveCategory(cat)}
                    className="group relative w-full aspect-square sm:aspect-auto sm:h-64 p-8 bg-blue-500/[0.02] backdrop-blur-xl border border-blue-500/10 rounded-[20px] text-left overflow-hidden transition-all duration-500 hover:border-blue-500/60 hover:bg-blue-500/[0.08] hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] flex flex-col justify-between"
                  >
                    {/* Hologram Scanlines */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(59,130,246,0.5)_3px,rgba(59,130,246,0.5)_3px)] bg-[length:100%_4px] animate-scan" />
                    </div>

                    {/* Moving Light Beam */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-blue-400/10 to-transparent skew-x-12 animate-shimmer" />
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                        {cat.status}
                      </span>
                    </div>

                    {/* Background Icon Decoration */}
                    <div className="absolute -bottom-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
                      {cat.id === 'panel' && <Server className="w-32 h-32" />}
                      {cat.id === 'bot' && <Bot className="w-32 h-32" />}
                      {cat.id === 'app' && <Smartphone className="w-32 h-32" />}
                    </div>
                    
                    <div className="relative z-10">
                      <motion.div 
                        className="w-14 h-14 bg-blue-500/5 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-300 relative"
                        whileHover={{ rotate: 5, scale: 1.05 }}
                      >
                        {cat.id === 'panel' && <Server className="w-7 h-7 text-blue-400/80 group-hover:text-blue-400" />}
                        {cat.id === 'bot' && <Bot className="w-7 h-7 text-blue-400/80 group-hover:text-blue-400" />}
                        {cat.id === 'app' && <Smartphone className="w-7 h-7 text-blue-400/80 group-hover:text-blue-400" />}
                        
                        {/* Pulse Effect */}
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-md -z-10"
                        />
                      </motion.div>
                      
                      <h3 className="text-xl font-display font-bold text-white mb-2 tracking-wide group-hover:text-blue-100 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-gray-400/70 text-xs leading-relaxed max-w-[200px] group-hover:text-gray-300 transition-colors">
                        {cat.subtext}
                      </p>

                      {/* Neon Line Under */}
                      <div className="mt-4 h-[2px] w-0 bg-blue-500 group-hover:w-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-[10px] font-mono text-blue-400/50 group-hover:text-blue-400 transition-colors mt-4">
                      <span className="w-1 h-1 bg-current rounded-full animate-pulse" />
                      EXPLORE INTERFACE
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Why Choose Us Section (Mini) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="relative z-10 py-12 px-6 border-t border-white/5 bg-black/20 backdrop-blur-sm"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Zap, label: "Fast Response" },
                { icon: Shield, label: "Secure System" },
                { icon: DollarSign, label: "Affordable Pricing" },
                { icon: Users, label: "Trusted Platform" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center md:items-start gap-3 group">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                    <item.icon className="w-5 h-5 text-blue-400/60 group-hover:text-blue-400" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Footer */}
          <footer className="relative z-10 bg-[#0b0f19] border-t border-white/5 py-12 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                  <h4 className="text-lg font-display font-bold text-white mb-2">SANZ OFFICIAL STORE</h4>
                  <p className="text-gray-500 text-sm max-w-xs">Professional Digital Service Platform providing premium server solutions and automation.</p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-4">
                  <div className="flex flex-wrap justify-center gap-6">
                    <a 
                      href="https://chat.whatsapp.com/H4IQh2FeNEtJb8II2ZNJfd?mode=gi_t" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors group"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400/60 group-hover:text-blue-400" />
                      <span className="group-hover:underline underline-offset-4">Join Group Bot</span>
                    </a>
                    <a 
                      href="https://whatsapp.com/channel/0029Vb73N7dId7nVhxB4wu3R" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors group"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-400/60 group-hover:text-blue-400" />
                      <span className="group-hover:underline underline-offset-4">Channel Info & Testimoni</span>
                    </a>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-white/80 text-xs font-medium">© 2026 Sanz Official Store</p>
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest mt-1">All Rights Reserved</p>
                  </div>
                </div>
              </div>
            </div>
          </footer>

          {/* Audio Controls - Top Right */}
          <div className="fixed top-6 right-6 z-[70]">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAudio}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border transition-all duration-500 ${
                isAudioPlaying 
                  ? 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3),0_0_10px_rgba(168,85,247,0.2)] bg-cyan-500/5' 
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="relative flex items-center justify-center">
                {isAudioPlaying ? (
                  <div className="flex items-end gap-[2px] h-3 w-4">
                    <motion.div animate={{ height: [4, 12, 6, 10, 4] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1 bg-cyan-400 rounded-full" />
                    <motion.div animate={{ height: [8, 4, 12, 6, 8] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-1 bg-blue-400 rounded-full" />
                    <motion.div animate={{ height: [6, 10, 4, 12, 6] }} transition={{ duration: 0.7, repeat: Infinity }} className="w-1 bg-purple-400 rounded-full" />
                  </div>
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.2em] ${isAudioPlaying ? 'text-cyan-400' : 'text-gray-500'}`}>
                {isAudioPlaying ? 'Ambient ON' : 'Ambient OFF'}
              </span>
            </motion.button>
          </div>

          {/* Hidden Audio Element */}
          <audio 
            ref={audioRef}
            src="https://files.catbox.moe/p88v1t.mp3"
            loop
            preload="auto"
          />
        </main>
      )}

      <AnimatePresence>
        {activeCategory && (
          <DetailView 
            category={activeCategory} 
            onBack={() => setActiveCategory(null)} 
            onCategoryChange={(cat) => setActiveCategory(cat)}
          />
        )}
      </AnimatePresence>

      <style>{`
        .stars-container {
          background-image: 
            radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 160px 120px, #ddd, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: twinkle 5s ease-in-out infinite;
          opacity: 0.4;
        }

        @media (min-width: 768px) {
          .stars-container {
            animation: stars-move 150s linear infinite, twinkle 5s ease-in-out infinite;
          }
        }

        .tech-grid {
          background-image: 
            linear-gradient(to right, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .meteor {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px #fff, 0 0 20px #fff;
          animation: meteor-anim linear infinite;
          opacity: 0;
          pointer-events: none;
        }

        .meteor::after {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, #fff, transparent);
        }

        @keyframes meteor-anim {
          0% { transform: rotate(215deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(215deg) translateX(-1000px); opacity: 0; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        @keyframes scan {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }

        @keyframes shimmer {
          from { left: -100%; }
          to { left: 200%; }
        }

        .animate-scan {
          animation: scan 8s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes stars-move {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }

        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
}
