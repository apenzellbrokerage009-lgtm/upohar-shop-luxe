
import React, { useMemo } from 'react';
import { HeroSection, Product, HomeSection, Category } from '../types';
import { ArrowRight, Star, ShoppingBag, Truck, ShieldCheck, Clock, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  hero: HeroSection;
  products: Product[];
  categories: Category[];
  sections: HomeSection[];
  onProductClick: (slug: string) => void;
  onNavigate: (page: string, id?: string) => void;
  onOrderNow: (product: Product) => void; 
}

const LandingPage: React.FC<LandingPageProps> = ({ hero, products, categories, sections, onProductClick, onNavigate, onOrderNow }) => {
  
  const renderProductGrid = (title: string, items: Product[]) => (
    <section key={title} className="py-24 max-w-7xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4 tracking-tight uppercase">{title}</h2>
        <div className="w-20 h-1 bg-var-accent mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {items.map(product => (
          <div key={product.id} className="group flex flex-col">
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-50 mb-6 cursor-pointer" onClick={() => onProductClick(product.slug)}>
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute top-6 left-6">
                 <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-900 rounded-full shadow-lg">
                   {product.category}
                 </span>
              </div>
            </div>
            
            <div className="px-1 flex-grow">
              <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-var-accent transition-colors truncate uppercase tracking-tight cursor-pointer" onClick={() => onProductClick(product.slug)}>
                {product.name}
              </h3>
              <div className="flex items-center justify-between mb-6">
                <p className="text-xl font-black text-slate-900">{product.price.toLocaleString()}৳</p>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span className="text-[11px] font-bold text-slate-400">({product.reviews})</span>
                </div>
              </div>
              
              <button onClick={() => onOrderNow(product)} className="w-full py-4 bg-var-primary text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:opacity-90 transition-all active:scale-95 group/btn">
                <ShoppingBag className="w-4 h-4" /> Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="bg-var-bg">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src={hero.image} className="w-full h-full object-cover" alt="Hero" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] border border-white/20 text-white">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.5em] mb-4 text-var-accent">Luxe Edition</h4>
            <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 leading-tight tracking-tight">{hero.title}</h1>
            <p className="text-xl mb-10 text-slate-100 font-light leading-relaxed">{hero.subtitle}</p>
            <button onClick={() => onNavigate('shop')} className="px-12 py-5 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-var-accent hover:text-white transition-all shadow-2xl">
              Explore Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Side-Scrolling Category Section */}
      <section className="bg-white py-12 border-b border-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Discover Collections</h3>
            <button onClick={() => onNavigate('shop')} className="text-[9px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-all">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x">
            {categories.map((cat, idx) => {
              // Find first product in this category to use its image if cat.image is missing
              const representativeProduct = products.find(p => p.category === cat.name);
              const displayImage = cat.image || representativeProduct?.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=300';

              return (
                <button 
                  key={cat.id} 
                  onClick={() => onNavigate('shop', cat.name)}
                  className="flex flex-col items-center gap-4 group flex-shrink-0 snap-start animate-in fade-in slide-in-from-right-4"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-slate-50 group-hover:border-rose-600 transition-all duration-500 p-1.5 bg-slate-50 group-hover:scale-105 shadow-sm group-hover:shadow-xl">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                       <img 
                        src={displayImage} 
                        alt={cat.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                      />
                      <div className="absolute inset-0 bg-rose-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-rose-600 transition-colors">
                    {cat.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
      </section>

      {/* Trust Badges */}
      <div className="bg-white py-12 border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: 'Safe Delivery', desc: 'Islandwide Logistics' },
            { icon: ShieldCheck, title: 'Luxe Quality', desc: 'Handcrafted Goods' },
            { icon: Clock, title: 'Same Day', desc: 'Fast Processing' },
            { icon: ShoppingBag, title: 'Premium Box', desc: 'Signature Wrapping' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="p-3 bg-slate-50 rounded-2xl text-var-accent"><item.icon className="w-6 h-6" /></div>
              <div><h5 className="text-[10px] font-black uppercase text-slate-900">{item.title}</h5><p className="text-[9px] text-slate-400 uppercase tracking-widest">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Sections */}
      {sections.filter(s => s.isActive).map(section => {
        let items: Product[] = [];
        if (section.type === 'new_arrivals') {
          items = [...products].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()).slice(0, section.limit);
        } else if (section.type === 'best_sellers') {
          items = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, section.limit);
        } else if (section.type === 'category_showcase') {
          items = products.filter(p => p.category === section.category).slice(0, section.limit);
        }
        return renderProductGrid(section.title, items);
      })}

      <div className="pb-24 flex justify-center">
        <button onClick={() => onNavigate('shop')} className="px-16 py-6 border-2 border-var-primary text-var-primary rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-var-primary hover:text-white transition-all">View Complete Gallery</button>
      </div>
    </div>
  );
};

export default LandingPage;
