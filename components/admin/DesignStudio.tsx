
import React from 'react';
import { AppState, ThemeConfig, HomeSection, Category } from '../../types';
import { Palette, Layout, Type, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { CATEGORIES } from '../../constants';

interface DesignStudioProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const DesignStudio: React.FC<DesignStudioProps> = ({ state, setState }) => {
  const updateTheme = (key: keyof ThemeConfig, value: any) => {
    setState(p => ({ ...p, theme: { ...p.theme, [key]: value } }));
  };

  const addSection = () => {
    const newSection: HomeSection = {
      id: Date.now().toString(),
      type: 'new_arrivals',
      title: 'New Section',
      limit: 4,
      isActive: true
    };
    setState(p => ({ ...p, homeSections: [...p.homeSections, newSection] }));
  };

  const updateSection = (id: string, updates: Partial<HomeSection>) => {
    setState(p => ({
      ...p,
      homeSections: p.homeSections.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const removeSection = (id: string) => {
    setState(p => ({ ...p, homeSections: p.homeSections.filter(s => s.id !== id) }));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Theme Controls */}
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
        <div className="flex items-center gap-4">
          <Palette className="w-6 h-6 text-rose-600" />
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Visual Identity</h3>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Primary Brand Color</label>
            <div className="flex gap-3">
              <input type="color" className="w-14 h-14 rounded-2xl border-none p-0 cursor-pointer" value={state.theme.primaryColor} onChange={e => updateTheme('primaryColor', e.target.value)} />
              <input className="flex-grow px-6 py-4 bg-slate-50 rounded-2xl font-mono text-xs font-bold" value={state.theme.primaryColor} onChange={e => updateTheme('primaryColor', e.target.value)} />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Accent/Action Color</label>
            <div className="flex gap-3">
              <input type="color" className="w-14 h-14 rounded-2xl border-none p-0 cursor-pointer" value={state.theme.accentColor} onChange={e => updateTheme('accentColor', e.target.value)} />
              <input className="flex-grow px-6 py-4 bg-slate-50 rounded-2xl font-mono text-xs font-bold" value={state.theme.accentColor} onChange={e => updateTheme('accentColor', e.target.value)} />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Typography Suite</label>
            <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none" value={state.theme.fontFamily} onChange={e => updateTheme('fontFamily', e.target.value)}>
              <option value="Inter">Modern (Inter)</option>
              <option value="Playfair Display">Luxury (Playfair)</option>
              <option value="Montserrat">Classic (Montserrat)</option>
              <option value="Poppins">Friendly (Poppins)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Home Page Layout Controls */}
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Layout className="w-6 h-6 text-rose-600" />
            <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Home Experience Engine</h3>
          </div>
          <button onClick={addSection} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-rose-600 transition-all">
            <Plus className="w-4 h-4" /> Add Section
          </button>
        </div>

        <div className="space-y-4">
          {state.homeSections.map((section, idx) => (
            <div key={section.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group hover:border-rose-200 transition-all">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-300 text-xs">
                {idx + 1}
              </div>
              
              <div className="flex-grow grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1 ml-1">Title</label>
                  <input className="w-full px-4 py-3 bg-white rounded-xl text-xs font-bold outline-none border border-transparent focus:border-rose-500" value={section.title} onChange={e => updateSection(section.id, { title: e.target.value })} />
                </div>
                <div className="col-span-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1 ml-1">Type</label>
                  <select className="w-full px-4 py-3 bg-white rounded-xl text-xs font-bold outline-none" value={section.type} onChange={e => updateSection(section.id, { type: e.target.value as any })}>
                    <option value="new_arrivals">New Arrivals</option>
                    <option value="best_sellers">Best Sellers</option>
                    <option value="category_showcase">Category Showcase</option>
                  </select>
                </div>
                {section.type === 'category_showcase' && (
                  <div className="col-span-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-1 ml-1">Category</label>
                    {/* Fixed: cast e.target.value to string (as inferred) instead of Category interface */}
                    <select className="w-full px-4 py-3 bg-white rounded-xl text-xs font-bold outline-none" value={section.category} onChange={e => updateSection(section.id, { category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
                <div className="col-span-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1 ml-1">Product Limit</label>
                  <input type="number" className="w-full px-4 py-3 bg-white rounded-xl text-xs font-bold outline-none" value={section.limit} onChange={e => updateSection(section.id, { limit: Number(e.target.value) })} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <button onClick={() => removeSection(section.id)} className="p-3 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignStudio;
