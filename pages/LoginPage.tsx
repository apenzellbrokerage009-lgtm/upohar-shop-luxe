
import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: isAdmin ? 'admin-1' : 'user-' + Math.random().toString(36).substr(2, 5),
      email: email || 'admin@upoharluxe.com',
      name: isAdmin ? 'Admin Manager' : 'Valued Customer',
      role: isAdmin ? 'admin' : 'customer'
    });
  };

  const quickAdminLogin = () => {
    onLogin({
      id: 'admin-1',
      email: 'admin@upoharluxe.com',
      name: 'Admin Manager',
      role: 'admin'
    });
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500">Sign in to your premium account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <input 
              required
              type="email"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 transition-all font-medium"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-rose-200 transition-colors">
            <input 
              type="checkbox" 
              checked={isAdmin}
              onChange={e => setIsAdmin(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-rose-800 focus:ring-rose-800"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">Login as Administrator</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Full Access to Dashboard</span>
            </div>
          </label>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-full font-bold text-lg shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white px-4 text-slate-400">Quick Access</span></div>
        </div>

        <button 
          onClick={quickAdminLogin}
          className="w-full py-4 border-2 border-rose-800 text-rose-800 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors"
        >
          <ShieldCheck className="w-5 h-5" /> Quick Admin Login
        </button>

        <p className="mt-10 text-center text-xs text-slate-400">
          First time here? <button className="text-rose-800 font-bold hover:underline">Create an account</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
