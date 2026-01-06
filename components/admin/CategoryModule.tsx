
import React, { useState } from 'react';
import { AppState, Category } from '../../types';
import { Plus, Edit3, Trash2, FolderOpen, Save, X } from 'lucide-react';

interface CategoryProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const CategoryModule: React.FC<CategoryProps> = ({ state, setState }) => {
  const [editing, setEditing] = useState<Partial<Category> | null>(null);

  const saveCategory = () => {
    if (!editing?.name) return;
    const cat: Category = {
      id: editing.id || 'CAT-' + Date.now(),
      name: editing.name,
      slug: editing.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      image: editing.image
    };
    
    setState(prev => ({
      ...prev,
      categories: prev.categories.find(c => c.id === cat.id)
        ? prev.categories.map(c => c.id === cat.id ? cat : c)
        : [...prev.categories, cat]
    }));
    setEditing(null);
  };

  const removeCategory = (id: string) => {
    if (confirm("Are you sure? Products in this category will need updating.")) {
      setState(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id) }));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Collection Vault</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Manage product segments and store aisles</p>
        </div>
        <button onClick={() => setEditing({ name: '' })} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-rose-600 transition-all shadow-xl">
          <Plus className="w-4 h-4" /> Add Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.categories.map(cat => (
          <div key={cat.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-xl hover:border-rose-100 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{cat.name}</h4>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{cat.slug}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditing(cat)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => removeCategory(cat.id)} className="p-3 bg-slate-50 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-lg" onClick={() => setEditing(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tighter">Collection Profile</h3>
              <button onClick={() => setEditing(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-full transition-all"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Collection Name</label>
                <input 
                  autoFocus
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-rose-600/20" 
                  placeholder="e.g. Premium Florals" 
                  value={editing.name} 
                  onChange={e => setEditing({...editing, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Banner Image URL (Optional)</label>
                <input 
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-rose-600/20" 
                  placeholder="https://images.unsplash.com/..." 
                  value={editing.image} 
                  onChange={e => setEditing({...editing, image: e.target.value})} 
                />
              </div>
              <button onClick={saveCategory} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-rose-600 transition-all flex items-center justify-center gap-3">
                <Save className="w-5 h-5" /> Commit to Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryModule;
