import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  User as UserIcon, 
  Plane, 
  ChevronRight, 
  Phone,
  MapPin,
  Mail
} from 'lucide-react';
import { authService } from '../../services/authService';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile?: UserProfile | null) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    
    setLoading(true);
    try {
      const profile = await authService.login(name, email, phone, city);
      onSuccess(profile as any);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4">
            <Plane size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic mb-2">
            Welcome to AirclassPRO ✈️
          </h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Please enter your details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="FULL NAME"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-xs font-extrabold uppercase"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL ADDRESS"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-xs font-extrabold uppercase"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="PHONE NUMBER (OPTIONAL)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-xs font-extrabold uppercase"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="CITY (OPTIONAL)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-xs font-extrabold uppercase"
            />
          </div>

          <button 
            disabled={loading || !name.trim() || !email.trim()}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-50"
          >
            {loading ? 'STARTING...' : 'START LEARNING'}
            {!loading && <ChevronRight size={18} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
