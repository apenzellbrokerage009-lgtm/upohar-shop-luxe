
import React, { useState } from 'react';
import { User, AppState } from '../types';
import { ShieldCheck, ArrowRight, Lock, Mail, AlertCircle, User as UserIcon, Loader2 } from 'lucide-react';
import { getDb, saveDb } from '../db';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');

    try {
      const state = await getDb();
      
      // Ensure arrays exist before searching
      const adminList = state.adminUsers || [];
      const customerList = state.customers || [];

      if (mode === 'login') {
        const trimmedID = identifier.trim().toLowerCase();
        
        // 1. Check admins first
        const admin = adminList.find(u => 
          (u.email?.toLowerCase() === trimmedID || u.phone?.trim() === trimmedID) && 
          u.password === password
        );

        if (admin) {
          setIsLoading(false); // Reset loading before calling redirect
          onLogin(admin);
          return;
        }

        // 2. Check customers
        const customer = customerList.find(u => 
          (u.email?.toLowerCase() === trimmedID || u.phone?.trim() === trimmedID) && 
          u.password === password
        );

        if (customer) {
          setIsLoading(false);
          onLogin(customer);
        } else {
          setError('Wrong credentials. Please check your email/phone and password.');
          setIsLoading(false);
        }
      } else {
        // Registration Logic
        if (!name.trim()) {
          setError('Name is required for registration.');
          setIsLoading(false);
          return;
        }

        const trimmedID = identifier.trim();
        const isEmail = trimmedID.includes('@');
        
        // Check if exists in customers
        const exists = customerList.some(c => 
          (c.email && c.email.toLowerCase() === trimmedID.toLowerCase()) || 
          (c.phone && c.phone === trimmedID)
        );

        if (exists) {
          setError('An account with this email/phone already exists.');
          setIsLoading(false);
          return;
        }

        const newUser: User = {
          id: 'C-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          name: name.trim(),
          email: isEmail ? trimmedID.toLowerCase() : undefined,
          phone: !isEmail ? trimmedID : undefined,
          password,
          role: 'customer',
          createdAt: new Date().toISOString()
        };

        // Update state and save
        const newState = { 
          ...state, 
          customers: [...customerList, newUser] 
        };
        
        await saveDb(newState);
        setIsLoading(false);
        onRegister(newUser);
      }
    } catch (err) {
      console.error("Auth Exception:", err);
      setError('System encountered an error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-rose-600"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center text-3xl font-black italic mx-auto mb-6 shadow-2xl shadow-slate-900/20">U</div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">
            {mode === 'login' ? 'Access' : 'Create'}<span className="text-rose-600 italic">Luxe</span>
          </h2>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em]">Corporate & Customer Portal</p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
           <button 
             type="button"
             disabled={isLoading}
             onClick={() => { setMode('login'); setError(''); }} 
             className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Secure Entry
           </button>
           <button 
             type="button"
             disabled={isLoading}
             onClick={() => { setMode('register'); setError(''); }} 
             className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Join Collective
           </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Your Name</label>
              <div className="relative">
                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  required
                  disabled={isLoading}
                  className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-sm"
                  placeholder="Full Legal Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email or Mobile</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                required
                disabled={isLoading}
                className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-sm"
                placeholder="name@mail.com or 017..."
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secret Key</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                required
                disabled={isLoading}
                type="password"
                className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-sm"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 hover:bg-rose-600 disabled:opacity-70"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...</>
            ) : (
              <>{mode === 'login' ? 'Unlock Terminal' : 'Establish Account'} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400">
           <ShieldCheck className="w-4 h-4" />
           <p className="text-[9px] font-black uppercase tracking-widest">End-to-End Encryption Active</p>
        </div>
      </div>
      
      <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
         Issues with access? <button className="text-rose-600 hover:underline">Contact Concierge</button>
      </p>
    </div>
  );
};

export default LoginPage;
