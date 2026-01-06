
import React, { useState } from 'react';
import { User, AppState } from '../types';
import { ShieldCheck, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { getDb } from '../db';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Fetch current state to check users
    const state = await getDb();
    const user = state.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (user) {
      onLogin(user);
    } else {
      setError('Invalid digital credentials detected. Access denied.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-rose-600"></div>
        
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center text-3xl font-black italic mx-auto mb-6 shadow-2xl shadow-slate-900/20">U</div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">Gateway<span className="text-rose-600 italic">Luxe</span></h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">Corporate Access Terminal</p>
        </div>
        
        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Digital Identity (Email)</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                required
                type="email"
                className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-sm"
                placeholder="name@upoharluxe.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secret Key (Password)</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                required
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
            className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 hover:bg-rose-600"
          >
            {isLoading ? 'Verifying...' : 'Unlock Terminal'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400">
           <ShieldCheck className="w-4 h-4" />
           <p className="text-[9px] font-black uppercase tracking-widest">Secured by Biometric Encryption</p>
        </div>
      </div>
      
      <p className="text-center mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
         Forgot access code? <button className="text-rose-600 hover:underline">Contact System Admin</button>
      </p>
    </div>
  );
};

export default LoginPage;
