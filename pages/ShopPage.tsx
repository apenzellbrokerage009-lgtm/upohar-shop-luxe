
import React, { useState } from 'react';
import { Product, Category } from '../types';
import { CATEGORIES } from '../constants';
import { Star, ShoppingBag, Eye, SlidersHorizontal, ChevronRight } from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  onProductClick: (id: string) => void;
  onOrderNow: (product: Product) => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ products, onProductClick, onOrderNow }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-32">
              <div className="flex items-center gap-3 mb-8">
                <SlidersHorizontal className="w-5 h-5 text-slate-900" />
                <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900">Filters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">Collections</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setSelectedCategory('All')}
                      className={`w-full flex justify-between items-center text-left text-sm font-bold tracking-tight transition-colors ${selectedCategory === 'All' ? 'text-rose-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      All Creation <ChevronRight className={`w-4 h-4 ${selectedCategory === 'All' ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex justify-between items-center text-left text-sm font-bold tracking-tight transition-colors ${selectedCategory === cat ? 'text-rose-600' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        {cat} <ChevronRight className={`w-4 h-4 ${selectedCategory === cat ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                      <span>1,000৳</span>
                      <span>50,000৳</span>
                    </div>
                    <input type="range" className="w-full accent-rose-600 h-1 bg-slate-100 rounded-full appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            <div className="flex items-center justify-between mb-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Displaying <span className="text-slate-900 font-black">{filteredProducts.length}</span> Masterpieces
              </p>
              <select className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-900 focus:ring-0 cursor-pointer">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map(product => (
                <div key={product.id} className="group flex flex-col">
                  <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-50 mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => onProductClick(product.id)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-transform"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onOrderNow(product)}
                        className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="px-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600 mb-1 block">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 leading-tight group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-1" onClick={() => onProductClick(product.id)}>
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-black text-slate-900">{product.price.toLocaleString()}৳</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span className="text-[10px] font-bold text-slate-400">({product.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-24 text-center">
                <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No items found</h3>
                <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or collection choice.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
