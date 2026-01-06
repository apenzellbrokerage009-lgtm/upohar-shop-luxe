
import React from 'react';
import { ShoppingCart, User, Search, Heart, Menu, LogOut } from 'lucide-react';
import { User as UserType, NavMenu, HeaderConfig } from '../types';

interface NavbarProps {
  user: UserType | null;
  onNavigate: (page: string, id?: string) => void;
  cartCount: number;
  onLogout: () => void;
  logo?: string;
  menus: NavMenu[];
  onSearch: (query: string) => void;
  config: HeaderConfig;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, cartCount, onLogout, logo, menus, onSearch, config }) => {
  return (
    <div className="sticky top-0 z-50">
      {/* Announcement Bar */}
      {config.isAnnouncementEnabled && (
        <div 
          className="h-9 overflow-hidden flex items-center"
          style={{ backgroundColor: config.announcementBgColor, color: config.announcementTextColor }}
        >
          <div className="whitespace-nowrap flex animate-marquee">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] px-8 py-2">
              {config.announcementText}
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] px-8 py-2">
              {config.announcementText}
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] px-8 py-2">
              {config.announcementText}
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] px-8 py-2">
              {config.announcementText}
            </span>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 20s linear infinite;
            }
          `}} />
        </div>
      )}

      {/* Main Navbar */}
      <nav className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-4 lg:gap-12">
              <button className="lg:hidden p-2 text-slate-600">
                <Menu className="w-6 h-6" />
              </button>
              <div onClick={() => onNavigate('landing')} className="cursor-pointer">
                {(config.logoUrl || logo) ? <img src={config.logoUrl || logo} alt="Upohar Luxe" className="h-8 md:h-12 w-auto object-contain" /> : (
                  <h1 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded italic">U</span>UPOHAR<span className="text-rose-600">LUXE</span>
                  </h1>
                )}
              </div>
              
              <div className="hidden lg:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                {menus.map((item) => (
                  <button key={item.id} onClick={() => item.isExternal ? window.open(item.href, '_blank') : onNavigate(item.href)} className="hover:text-rose-600 transition-colors">
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 mr-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search gifts..." 
                  className="bg-transparent border-none outline-none text-xs ml-2 w-32 focus:w-48 transition-all"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
              
              <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Heart className="w-5 h-5" /></button>
              <div className="relative group p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>
              </div>

              {user ? (
                <div className="flex items-center gap-2 ml-2">
                  <button onClick={() => onNavigate(user.role === 'admin' ? 'admin' : 'dashboard')} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-900 text-[11px] font-bold uppercase tracking-wider hover:bg-slate-50">
                    <User className="w-4 h-4" /> Account
                  </button>
                  <button onClick={onLogout} className="p-2 text-slate-400 hover:text-rose-600"><LogOut className="w-5 h-5" /></button>
                </div>
              ) : <button onClick={() => onNavigate('login')} className="ml-2 px-6 py-2.5 bg-slate-900 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">Sign In</button>}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
