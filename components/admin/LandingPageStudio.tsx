
import React from 'react';
import { AppState, HeroSection } from '../../types';
import { Layout, Type, Image as ImageIcon, MousePointer2, Save } from 'lucide-react';

interface LandingStudioProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const LandingPageStudio: React.FC<LandingStudioProps> = ({ state, setState }) => {
  const updateHero = (updates: Partial<HeroSection>) => {
    setState(p => ({ ...p, hero: { ...p.hero, ...updates } }));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Layout className="w-6 h-6 text-rose-600" />
            <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Hero Experience</h3>
          </div>
          <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-rose-600 transition-all">
            <Save className="w-4 h-4 mr-2 inline" /> Save Brand Assets
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Hero Headline</label>
              <input 
                className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-black text-lg outline-none border border-transparent focus:border-rose-500" 
                value={state.hero.title} 
                onChange={e => updateHero({ title: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Hero Subtitle</label>
              <textarea 
                className="w-full px-8 py-5 bg-slate-50 rounded-3xl font-bold text-sm h-32 resize-none outline-none border border-transparent focus:border-rose-500" 
                value={state.hero.subtitle} 
                onChange={e => updateHero({ subtitle: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">CTA Button Text</label>
                <div className="relative">
                  <MousePointer2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-600" />
                  <input 
                    className="w-full pl-14 pr-8 py-5 bg-slate-50 rounded-2xl font-black text-xs outline-none uppercase tracking-widest" 
                    value={state.hero.ctaText} 
                    onChange={e => updateHero({ ctaText: e.target.value })} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Brand Logo URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-600" />
                  <input 
                    className="w-full pl-14 pr-8 py-5 bg-slate-50 rounded-2xl font-bold text-xs outline-none" 
                    placeholder="Logo link..." 
                    value={state.hero.logo} 
                    onChange={e => updateHero({ logo: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Background Canvas URL</label>
              <input 
                className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold text-xs outline-none" 
                value={state.hero.image} 
                onChange={e => updateHero({ image: e.target.value })} 
              />
            </div>
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border-4 border-slate-50 shadow-2xl">
              <img src={state.hero.image} className="w-full h-full object-cover" alt="Hero Preview" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 text-center">
                 <h4 className="text-white font-serif font-bold text-3xl mb-2">{state.hero.title}</h4>
                 <p className="text-white/70 text-sm max-w-xs">{state.hero.subtitle}</p>
                 <div className="mt-4 px-6 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{state.hero.ctaText}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageStudio;
