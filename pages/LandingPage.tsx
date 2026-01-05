
import React from 'react';
import { HeroSection, Product } from '../types';
import { ArrowRight, Star, ShoppingBag, Truck, ShieldCheck, Clock, Zap } from 'lucide-react';

interface LandingPageProps {
  hero: HeroSection;
  featuredProducts: Product[];
  onProductClick: (id: string) => void;
  onNavigate: (page: string) => void;
  onOrderNow: (product: Product) => void; // New: Added order trigger prop
}

const LandingPage: React.FC<LandingPageProps> = ({ hero, featuredProducts, onProductClick, onNavigate, onOrderNow }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src={hero.image} className="w-full h-full object-cover" alt="Hero" />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-[2rem] border border-white/20 text-white">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-4 text-rose-400">Exclusive Collection</h4>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight tracking-tight">{hero.title}</h1>
            <p className="text-lg md:text-xl mb-10 text-slate-100 font-light max-w-lg">{hero.subtitle}</p>
            <button 
              onClick={() => onNavigate('shop')} 
              className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-rose-600 hover:text-white transition-all shadow-2xl"
            >
              Explore Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-slate-50 py-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: 'Islandwide Delivery', desc: 'Fast & Secure' },
            { icon: ShieldCheck, title: 'Premium Quality', desc: 'Curated Artisan Goods' },
            { icon: Clock, title: 'Same Day Dispatch', desc: 'Dhaka Metropolitan' },
            { icon: ShoppingBag, title: 'Luxury Packaging', desc: 'Signature Gift Boxes' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-rose-600"><item.icon className="w-6 h-6" /></div>
              <div>
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-900">{item.title}</h5>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4 tracking-tight uppercase">Bestsellers Collection</h2>
          <div className="w-20 h-1 bg-rose-600 mx-auto rounded-full"></div>
          <p className="text-slate-500 mt-6 max-w-lg mx-auto uppercase text-[10px] font-bold tracking-[0.3em]">Handpicked creations for your loved ones</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {featuredProducts.map(product => (
            <div 
              key={product.id} 
              className="group flex flex-col" 
            >
              <div 
                className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-50 mb-6 cursor-pointer"
                onClick={() => onProductClick(product.id)}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute top-6 left-6">
                   <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-900 rounded-full shadow-lg">
                     {product.category}
                   </span>
                </div>
              </div>
              
              <div className="px-1 flex-grow">
                <h3 
                  className="text-sm font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-1 uppercase tracking-tight cursor-pointer"
                  onClick={() => onProductClick(product.id)}
                >
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xl font-black text-slate-900">{product.price.toLocaleString()}৳</p>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span className="text-[11px] font-bold text-slate-400">({product.reviews})</span>
                  </div>
                </div>
                
                {/* Buy Now Button - Persistent for each product */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOrderNow(product);
                  }}
                  className="w-full py-4 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:bg-rose-800 transition-all active:scale-95 group/btn"
                >
                  <ShoppingBag className="w-4 h-4 group-hover/btn:animate-bounce" /> Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 flex justify-center">
          <button 
            onClick={() => onNavigate('shop')} 
            className="px-16 py-5 border-2 border-slate-900 text-slate-900 rounded-full font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all active:scale-95 flex items-center gap-3"
          >
            Explore Masterpieces <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Mini Banners Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative h-[28rem] rounded-[3.5rem] overflow-hidden group cursor-pointer shadow-2xl">
          <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-12 flex flex-col justify-end text-white">
            <h3 className="text-4xl font-serif font-bold mb-4 leading-tight">Gourmet Collections</h3>
            <p className="text-slate-200 text-sm mb-8 max-w-xs font-light">Artisan chocolates and rare sweets for the connoisseur.</p>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 group-hover:gap-6 transition-all">Explore Collection <ArrowRight className="w-4 h-4 text-rose-500" /></span>
          </div>
        </div>
        <div className="relative h-[28rem] rounded-[3.5rem] overflow-hidden group cursor-pointer shadow-2xl">
          <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-12 flex flex-col justify-end text-white">
            <h3 className="text-4xl font-serif font-bold mb-4 leading-tight">Preserved Florals</h3>
            <p className="text-slate-200 text-sm mb-8 max-w-xs font-light">Ecuadorian roses that maintain their beauty for over a year.</p>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 group-hover:gap-6 transition-all">Explore Collection <ArrowRight className="w-4 h-4 text-rose-500" /></span>
          </div>
        </div>
      </section>
    </div>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default LandingPage;
