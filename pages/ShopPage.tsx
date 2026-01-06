
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { Star, ShoppingBag, Eye, SlidersHorizontal, ChevronRight, XCircle, Search } from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  onClearSearch: () => void;
  onProductClick: (slug: string) => void;
  onOrderNow: (product: Product) => void;
  initialCategory?: string;
}

const ShopPage: React.FC<ShopPageProps> = ({ products, categories, searchQuery, onClearSearch, onProductClick, onOrderNow, initialCategory = 'All' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

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
                    {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full flex justify-between items-center text-left text-sm font-bold tracking-tight transition-colors ${selectedCategory === cat.name ? 'text-rose-600' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        {cat.name} <ChevronRight className={`w-4 h-4 ${selectedCategory === cat.name ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {searchQuery && (
                <div className="mt-12 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Active Search</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-900 truncate">"{searchQuery}"</span>
                    <button onClick={onClearSearch} className="text-rose-600 hover:text-rose-700 transition-colors">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Displaying <span className="text-slate-900 font-black">{filteredProducts.length}</span> Masterpieces
                </p>
                {searchQuery && (
                   <h2 className="text-2xl font-serif font-bold text-slate-900 mt-2">Results for "<span className="text-rose-600">{searchQuery}</span>"</h2>
                )}
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 animate-in fade-in duration-500">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group flex flex-col">
                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-50 mb-4 cursor-pointer" onClick={() => onProductClick(product.slug)}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onProductClick(product.slug); }}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-transform"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="px-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600 mb-1 block">
                        {product.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mb-2 leading-tight group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-1" onClick={() => onProductClick(product.slug)}>
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-base font-black text-slate-900">{product.price.toLocaleString()}৳</p>
                        <button 
                          onClick={() => onOrderNow(product)}
                          className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">No items found</h3>
                <p className="text-slate-400 max-w-xs mx-auto text-sm">We couldn't find any masterpieces matching your search criteria.</p>
                <button 
                  onClick={onClearSearch}
                  className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl"
                >
                  Clear Search & View All
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
