
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Minus, Plus, ShoppingBag, Heart, Shield, Truck, Star, ChevronRight, Share2, Clock, MessageCircle } from 'lucide-react';

interface ProductPageProps {
  product: Product;
  onOrderNow: (product: Product, quantity: number) => void;
  onNavigate: (page: string) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onOrderNow, onNavigate }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images?.[0] || product.image);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  const allImages = product.images?.length ? product.images : [product.image];

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(`Hi, I would like to order ${quantity} unit(s) of "${product.name}". Please let me know the process.`);
    window.open(`https://wa.me/8801681149497?text=${message}`, '_blank');
  };

  useEffect(() => {
    const handleScroll = () => {
      const mainBuyBtn = document.getElementById('main-buy-btn');
      if (mainBuyBtn) {
        const rect = mainBuyBtn.getBoundingClientRect();
        setShowStickyBar(rect.top < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
          <span className="cursor-pointer hover:text-slate-900" onClick={() => onNavigate('landing')}>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="cursor-pointer hover:text-slate-900" onClick={() => onNavigate('shop')}>Shop</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 line-clamp-1">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="lg:w-1/2">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="aspect-[4/5] bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
                <img src={activeImage} className="w-full h-full object-cover" alt={product.name} />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(img)} 
                    className={`w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? 'border-rose-600 scale-95' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="relative">
              <div className="pt-2 pb-6 mb-8 border-b border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[9px] font-black tracking-widest uppercase rounded-full">{product.category}</span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all"><Heart className="w-5 h-5" /></button>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6 leading-[1.1]">{product.name}</h1>
                <div className="flex items-baseline gap-4">
                  <p className="text-5xl font-black text-rose-800 tracking-tighter">{product.price.toLocaleString()}৳</p>
                  <span className="text-lg font-bold text-slate-300 line-through">{(product.price * 1.2).toLocaleString()}৳</span>
                </div>
              </div>

              <div className="space-y-10">
                <div id="main-buy-btn" className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Quantity Selection</p>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center bg-white border border-slate-200 rounded-full p-1.5 w-full sm:w-auto shadow-sm">
                          <button onClick={decrement} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-full active:scale-90 transition-all"><Minus className="w-5 h-5" /></button>
                          <span className="w-14 text-center font-black text-xl text-slate-900">{quantity}</span>
                          <button onClick={increment} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-full active:scale-90 transition-all"><Plus className="w-5 h-5" /></button>
                        </div>
                        <button 
                          onClick={() => onOrderNow(product, quantity)} 
                          className="flex-grow w-full py-5 bg-slate-900 hover:bg-rose-800 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                          <ShoppingBag className="w-5 h-5" /> Buy Now
                        </button>
                      </div>
                      
                      {/* WhatsApp Button */}
                      <button 
                        onClick={handleWhatsAppOrder}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95"
                      >
                        <MessageCircle className="w-5 h-5" /> WhatsApp এ অর্ডার করুন
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-around text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-rose-600" /> Free Delivery</span>
                    <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-rose-600" /> Guaranteed</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-rose-600" /> Fast Ship</span>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none bg-white p-2">
                   <p className="text-slate-600 leading-relaxed font-medium text-xl italic">{product.shortDescription}</p>
                </div>

                <div className="pt-12 border-t border-slate-100">
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 uppercase">The Story</h3>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-[1.8] space-y-8 text-lg font-light">
                    {product.fullDescription}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`fixed bottom-0 left-0 right-0 z-[250] bg-white/95 backdrop-blur-xl border-t border-slate-100 p-4 px-6 md:px-12 shadow-[0_-15px_50px_rgba(0,0,0,0.1)] transition-all duration-500 transform ${showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="relative group shrink-0">
               <img src={product.image} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" />
               <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[9px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-md">{quantity}</span>
            </div>
            <div className="hidden sm:block">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight line-clamp-1">{product.name}</h4>
              <p className="text-rose-800 font-black text-lg">{(product.price * quantity).toLocaleString()}৳</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-grow justify-end">
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-full p-1 shadow-sm">
              <button onClick={decrement} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-all active:scale-90"><Minus className="w-3.5 h-3.5" /></button>
              <span className="w-8 text-center font-black text-sm">{quantity}</span>
              <button onClick={increment} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-all active:scale-90"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            
            <button 
              onClick={handleWhatsAppOrder}
              className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all shadow-lg active:scale-95 md:hidden"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            
            <button 
              onClick={handleWhatsAppOrder}
              className="hidden md:flex px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg items-center gap-2 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>

            <button 
              onClick={() => onOrderNow(product, quantity)} 
              className="px-8 md:px-12 py-4 md:py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-black uppercase text-[10px] md:text-xs tracking-widest shadow-2xl flex items-center gap-3 transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" /> <span className="hidden sm:inline">Order Now</span> <span className="sm:hidden">Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
