
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
// Added Clock to the imports from lucide-react to fix "Cannot find name 'Clock'" error
import { Minus, Plus, ShoppingBag, Heart, Shield, Truck, Star, ChevronRight, Share2, Clock } from 'lucide-react';

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

  // Logic to show sticky bottom bar when user scrolls past the main buy button
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
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
          <span className="cursor-pointer hover:text-slate-900" onClick={() => onNavigate('landing')}>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="cursor-pointer hover:text-slate-900" onClick={() => onNavigate('shop')}>Shop</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 line-clamp-1">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left Side: STICKY GALLERY */}
          <div className="lg:w-1/2">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="aspect-[4/5] bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
                <img 
                  src={activeImage} 
                  className="w-full h-full object-cover" 
                  alt={product.name} 
                />
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

          {/* Right Side: SCROLLABLE CONTENT (Title & Headers also scroll now) */}
          <div className="lg:w-1/2">
            <div className="relative">
              {/* Product Header - NOT STICKY AS REQUESTED */}
              <div className="pt-2 pb-6 mb-8 border-b border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[9px] font-black tracking-widest uppercase rounded-full">
                    {product.category}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6 leading-[1.1]">
                  {product.name}
                </h1>
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'fill-current' : 'text-slate-200'}`} />)}
                  </div>
                  <div className="h-4 w-px bg-slate-200"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.reviews} Verified Reviews</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <p className="text-5xl font-black text-rose-800 tracking-tighter">{product.price.toLocaleString()}৳</p>
                  <span className="text-lg font-bold text-slate-300 line-through">{(product.price * 1.2).toLocaleString()}৳</span>
                </div>
              </div>

              {/* Main Buy Section */}
              <div className="space-y-10">
                <div id="main-buy-btn" className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Quantity Selection</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex items-center bg-white border border-slate-200 rounded-full p-1.5 w-full sm:w-auto shadow-sm">
                        <button onClick={decrement} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-full active:scale-90 transition-all"><Minus className="w-5 h-5" /></button>
                        <span className="w-14 text-center font-black text-xl text-slate-900">{quantity}</span>
                        <button onClick={increment} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-full active:scale-90 transition-all"><Plus className="w-5 h-5" /></button>
                      </div>
                      <button 
                        onClick={() => onOrderNow(product, quantity)} 
                        className="flex-grow w-full py-5 bg-slate-900 hover:bg-rose-800 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 transform hover:-translate-y-0.5"
                      >
                        <ShoppingBag className="w-5 h-5" /> Buy Now
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-around text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-rose-600" /> Free Delivery</span>
                    <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-rose-600" /> Luxe Insured</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-rose-600" /> Fast Shipping</span>
                  </div>
                </div>

                {/* Short Highlights */}
                <div className="prose prose-slate max-w-none bg-white p-2">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-800 mb-6 flex items-center gap-3">
                     <span className="w-8 h-px bg-rose-200"></span> Highlights
                   </h4>
                   <p className="text-slate-600 leading-relaxed font-medium text-xl italic">
                    {product.shortDescription}
                   </p>
                </div>

                {/* Artisan Detailed Story */}
                <div className="pt-12 border-t border-slate-100">
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 uppercase tracking-tight">The Story Behind The Craft</h3>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-[1.8] space-y-8 text-lg font-light">
                    {product.fullDescription.split('\n').map((para, i) => para.trim() && (
                      <p key={i} className="first-letter:text-4xl first-letter:font-serif first-letter:text-rose-800 first-letter:float-left first-letter:mr-3">{para}</p>
                    ))}
                  </div>
                </div>

                {/* Specifications List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-t border-slate-100">
                   <div className="space-y-4">
                     <h5 className="text-xs font-black uppercase tracking-widest text-slate-900">Specifications</h5>
                     <ul className="space-y-3">
                        <li className="flex justify-between border-b pb-2 text-sm"><span className="text-slate-400">Collection</span><span className="font-bold">{product.category}</span></li>
                        <li className="flex justify-between border-b pb-2 text-sm"><span className="text-slate-400">Material</span><span className="font-bold">Premium Grade</span></li>
                        <li className="flex justify-between border-b pb-2 text-sm"><span className="text-slate-400">Authenticity</span><span className="font-bold">Hand-Crafted</span></li>
                     </ul>
                   </div>
                   <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                      <Shield className="w-8 h-8 text-rose-800 mb-4" />
                      <p className="text-xs font-bold text-rose-900 uppercase tracking-widest mb-2">Signature Guarantee</p>
                      <p className="text-xs text-rose-700 leading-relaxed">Every Upohar Luxe creation comes with our lifetime authenticity seal and luxury gift packaging.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR - FOR CONVERSION */}
      <div className={`fixed bottom-0 left-0 right-0 z-[250] bg-white/95 backdrop-blur-xl border-t border-slate-100 p-4 px-6 md:px-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-500 transform ${showStickyBar ? 'translate-y-0' : 'translate-y-full'} lg:block hidden`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={product.image} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
              <p className="text-rose-800 font-black">{product.price.toLocaleString()}৳</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full p-1 shadow-sm">
              <button onClick={decrement} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-all active:scale-90"><Minus className="w-4 h-4" /></button>
              <span className="w-12 text-center font-black text-lg">{quantity}</span>
              <button onClick={increment} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-all active:scale-90"><Plus className="w-4 h-4" /></button>
            </div>
            <button 
              onClick={() => onOrderNow(product, quantity)} 
              className="px-12 py-4 bg-slate-900 hover:bg-rose-800 text-white rounded-full font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-3 transition-all"
            >
              <ShoppingBag className="w-4 h-4" /> Order Now
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className={`fixed bottom-0 left-0 right-0 z-[250] lg:hidden bg-white border-t border-slate-100 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full p-1 flex-shrink-0">
            <button onClick={decrement} className="w-10 h-10 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
            <span className="w-10 text-center font-black text-lg">{quantity}</span>
            <button onClick={increment} className="w-10 h-10 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
          </div>
          <button 
            onClick={() => onOrderNow(product, quantity)} 
            className="flex-grow py-4 bg-slate-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Checkout { (product.price * quantity).toLocaleString() }৳
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
