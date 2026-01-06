
import React, { useState, useRef } from 'react';
import { AppState, Product } from '../../types';
import { Plus, Edit3, Trash2, Check, X, Star, Sparkles, Loader2, Image as ImageIcon, Upload, Crown } from 'lucide-react';
import { generateProductDescription } from '../../geminiService';

interface InventoryProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const InventoryModule: React.FC<InventoryProps> = ({ state, setState }) => {
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAiDescription = async () => {
    if (!editing?.name) {
      alert("Please enter a product name first!");
      return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(editing.name, editing.category || 'Gift');
    setEditing(prev => prev ? ({ ...prev, fullDescription: desc }) : null);
    setIsGenerating(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      addImageToGallery(base64String);
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  };

  const addImageToGallery = (url: string) => {
    if (!url) return;
    setEditing(prev => {
      if (!prev) return null;
      const currentImages = prev.images || [];
      // If no main image exists, set this as main
      const updates: Partial<Product> = {
        images: [...currentImages, url]
      };
      if (!prev.image) {
        updates.image = url;
      }
      return { ...prev, ...updates };
    });
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    setEditing(prev => {
      if (!prev || !prev.images) return null;
      const newImages = [...prev.images];
      const removedUrl = newImages[index];
      newImages.splice(index, 1);
      
      let newMain = prev.image;
      if (newMain === removedUrl) {
        newMain = newImages.length > 0 ? newImages[0] : '';
      }
      
      return { ...prev, images: newImages, image: newMain };
    });
  };

  const setAsMain = (url: string) => {
    setEditing(prev => prev ? ({ ...prev, image: url }) : null);
  };

  const saveProduct = () => {
    if (!editing?.name || !editing?.price) {
      alert("Name and Price are mandatory.");
      return;
    }
    const prod: Product = {
      id: editing.id || 'P-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      slug: editing.slug || (editing.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || ''),
      name: editing.name || '',
      price: Number(editing.price),
      buyingPrice: Number(editing.buyingPrice || 0),
      category: editing.category || state.categories[0]?.name || 'Uncategorized',
      shortDescription: editing.shortDescription || '',
      fullDescription: editing.fullDescription || '',
      image: editing.image || '',
      images: editing.images || [editing.image || ''],
      stock: Number(editing.stock || 0),
      rating: editing.rating || 5, 
      reviews: editing.reviews || 0, 
      isFeatured: editing.isFeatured || false,
      createdAt: editing.createdAt || new Date().toISOString()
    };
    
    setState(prev => ({
      ...prev,
      products: prev.products.find(p => p.id === prod.id) 
        ? prev.products.map(p => p.id === prod.id ? prod : p) 
        : [prod, ...prev.products]
    }));
    setEditing(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Asset Inventory</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Manage your premium product catalog</p>
        </div>
        <button onClick={() => setEditing({ category: state.categories[0]?.name, isFeatured: false, stock: 0, images: [] })} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl hover:bg-rose-600 transition-all"><Plus className="w-4 h-4"/> New Asset</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {state.products.map(p => (
          <div key={p.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 group shadow-sm hover:shadow-xl transition-all relative">
            {p.isFeatured && (
              <div className="absolute top-8 left-8 z-10 bg-amber-400 text-white p-1.5 rounded-full shadow-lg">
                <Star className="w-3 h-3 fill-current" />
              </div>
            )}
            <div className="relative aspect-square mb-4 overflow-hidden rounded-[1.8rem]">
              <img src={p.image} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => setEditing(p)} className="p-2.5 bg-white/90 rounded-xl text-slate-900 hover:bg-slate-900 hover:text-white shadow-lg transition-all"><Edit3 className="w-4 h-4"/></button>
                 <button onClick={() => setState(pr => ({...pr, products: pr.products.filter(item => item.id !== p.id)}))} className="p-2.5 bg-white/90 rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white shadow-lg transition-all"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
            <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-1">{p.category}</p>
            <h4 className="text-[11px] font-black uppercase truncate mb-1 text-slate-900">{p.name}</h4>
            <div className="flex justify-between items-center">
               <span className="text-sm font-black text-slate-900">{p.price.toLocaleString()}৳</span>
               <span className={`text-[9px] font-black px-3 py-1 rounded-full ${p.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>Stock: {p.stock}</span>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-lg" onClick={() => setEditing(null)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[3.5rem] p-8 md:p-12 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tighter">Edit Product Details</h3>
               <button onClick={() => setEditing(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-full transition-all"><X className="w-5 h-5"/></button>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Side: General Info */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Product Name</label>
                      <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-rose-600/20" placeholder="Product Title" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Collection</label>
                      <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none" value={editing.category} onChange={e => setEditing({...editing, category: e.target.value})}>
                        {state.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Price (৳)</label>
                      <input type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none" value={editing.price} onChange={e => setEditing({...editing, price: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Cost (৳)</label>
                      <input type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none" value={editing.buyingPrice} onChange={e => setEditing({...editing, buyingPrice: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Stock</label>
                      <input type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none" value={editing.stock} onChange={e => setEditing({...editing, stock: Number(e.target.value)})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Short Description</label>
                    <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none" value={editing.shortDescription} onChange={e => setEditing({...editing, shortDescription: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Story</label>
                      <button onClick={handleAiDescription} disabled={isGenerating} className="flex items-center gap-2 text-[10px] font-black text-rose-600 uppercase tracking-widest disabled:opacity-50">
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} AI Generate
                      </button>
                    </div>
                    <textarea className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl font-medium text-sm h-32 resize-none outline-none focus:ring-2 focus:ring-rose-600/20" value={editing.fullDescription} onChange={e => setEditing({...editing, fullDescription: e.target.value})} />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-rose-200 transition-colors">
                    <input type="checkbox" checked={editing.isFeatured} onChange={e => setEditing({...editing, isFeatured: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-rose-800" />
                    <span className="text-sm font-bold text-slate-900">Featured Asset</span>
                  </label>
                </div>

                {/* Right Side: Image Gallery */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Gallery Assets</label>
                    
                    {/* Image Controls */}
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-2">
                        <input 
                          className="flex-grow px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none" 
                          placeholder="Paste image URL here..." 
                          value={newImageUrl} 
                          onChange={e => setNewImageUrl(e.target.value)}
                        />
                        <button onClick={() => addImageToGallery(newImageUrl)} className="px-6 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-rose-600 transition-colors">
                          Add
                        </button>
                      </div>
                      
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          ref={fileInputRef} 
                          onChange={handleFileUpload} 
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-[10px] font-black uppercase flex items-center justify-center gap-3 hover:border-rose-400 hover:text-rose-600 transition-all"
                        >
                          <Upload className="w-4 h-4" /> Upload Local File
                        </button>
                      </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                      {(editing.images || []).map((img, idx) => {
                        const isMain = editing.image === img;
                        return (
                          <div key={idx} className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${isMain ? 'border-rose-600 ring-2 ring-rose-600/20' : 'border-slate-100'}`}>
                            <img src={img} className="w-full h-full object-cover" />
                            {isMain && (
                              <div className="absolute top-2 left-2 bg-rose-600 text-white p-1 rounded-lg shadow-lg">
                                <Crown className="w-3 h-3" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                              {!isMain && (
                                <button onClick={() => setAsMain(img)} className="w-full py-1.5 bg-white text-slate-900 rounded-lg text-[8px] font-black uppercase hover:bg-rose-600 hover:text-white transition-colors">Set Main</button>
                              )}
                              <button onClick={() => removeImage(idx)} className="w-full py-1.5 bg-rose-600 text-white rounded-lg text-[8px] font-black uppercase flex items-center justify-center gap-1"><Trash2 className="w-3 h-3"/> Remove</button>
                            </div>
                          </div>
                        );
                      })}
                      {(!editing.images || editing.images.length === 0) && (
                        <div className="col-span-3 py-12 flex flex-col items-center justify-center text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                          <ImageIcon className="w-8 h-8 text-slate-200 mb-2" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gallery Empty</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button onClick={saveProduct} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-rose-600 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95">
                      <Check className="w-5 h-5" /> Commit to Catalog
                    </button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryModule;
