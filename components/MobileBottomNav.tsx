
import React from 'react';
import { Home, ShoppingBag, User, Search, Heart, LayoutDashboard, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPage, onNavigate, userRole }) => {
  const isAdmin = userRole === 'admin';
  
  // Custom navigation items based on role
  const navItems = isAdmin ? [
    { id: 'landing', label: 'Store', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'admin', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Inventory', icon: Settings },
  ] : [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'dashboard', label: 'Account', icon: User },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[200] bg-white/95 backdrop-blur-xl border-t border-slate-100 px-2 pb-safe-area-inset-bottom shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentPage === item.id || (item.id === 'dashboard' && currentPage === 'admin');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all relative ${
                isActive ? 'text-rose-600' : 'text-slate-400'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-1 h-1 bg-rose-600 rounded-full"></span>
              )}
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-rose-50' : ''}`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
