import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserCog, Key, Server, Lock, Store } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db, firebaseReady } from '../../lib/firebase';
import { APP_SETTINGS } from '../../setting';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    
    const input = pin.trim();
    if (!input) {
      setError('Harap isi Password/PIN');
      return;
    }

    const correctPassword = String(APP_SETTINGS.adminPassword).trim();

    setLoading(true);
    try {
      if (input === correctPassword) {
        onLoginSuccess();
      } else {
        setError('Password/PIN salah');
      }
    } catch (e: any) {
      setError('Gagal login: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="bg-[#0b1220] border border-[#1f2937] rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden relative"
      >
        <div className="p-6">
           <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#050816] border border-[#1f2937] rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-[#2dd4bf]" />
              </div>
           </div>

           <h2 className="text-xl font-bold text-white mb-2 text-center">
             Admin Access
           </h2>
           <p className="text-slate-400 text-[10px] uppercase tracking-widest text-center mb-6">
             Kelola Data Store & Produk
           </p>

           {error && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center py-2 px-4 rounded-xl mb-4 font-medium uppercase tracking-widest">
               {error}
             </div>
           )}

           <div className="space-y-4 mb-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
                    Password / PIN Admin
                 </label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Key className="h-4 w-4 text-[#2dd4bf]" />
                    </div>
                    <input 
                      type="password" 
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="login-input py-3 pl-10 pr-4 text-lg tracking-widest transition-all" 
                      placeholder="••••••••"
                    />
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-3">
             <button 
               onClick={handleLogin}
               disabled={loading}
               className={`w-full py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors bg-[#2dd4bf] hover:bg-[#14b8a6] text-slate-900 shadow-[0_0_20px_rgba(45,212,191,0.2)]
                 ${loading ? 'opacity-50 cursor-not-allowed' : ''}
               `}
             >
               {loading ? 'Memproses...' : 'Masuk Panel Admin'}
             </button>
             <button 
               onClick={onClose}
               className="w-full bg-transparent hover:bg-[#111827] text-slate-500 hover:text-slate-300 border border-transparent py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors"
             >
               Batal
             </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
export default LoginModal;
