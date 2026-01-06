
import React from 'react';
import { AppState, FooterConfig } from '../../types';
import { Facebook } from 'lucide-react';

interface FooterStudioProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const FooterStudio: React.FC<FooterStudioProps> = ({ state, setState }) => {
  const updateFooter = (key: keyof FooterConfig, value: any) => {
    setState(p => ({ ...p, footer: { ...p.footer, [key]: value } }));
  };

  return (
    <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-12 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
         <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Footer Designer</h3>
         <button className="px-8 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-rose-700 transition-all">Publish Layout</button>
      </div>
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Brand Narrative</label>
              <textarea 
                className="w-full px-8 py-5 bg-slate-50 rounded-3xl font-bold text-sm h-40 resize-none leading-relaxed outline-none" 
                value={state.footer.aboutText} 
                onChange={e => updateFooter('aboutText', e.target.value)}
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Address</label>
              <input 
                className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold text-sm" 
                value={state.footer.address} 
                onChange={e => updateFooter('address', e.target.value)}
              />
           </div>
        </div>
        <div className="space-y-10">
           <div className="p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Social Connections</h4>
              {state.footer.socials.map((social, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-24 text-[10px] font-black uppercase text-rose-600 flex items-center gap-2">
                    {social.platform === 'Facebook' && <Facebook className="w-3 h-3"/>}
                    {social.platform}
                  </div>
                  <input 
                    className="flex-grow px-6 py-3.5 bg-white rounded-2xl text-xs font-bold border border-slate-100 outline-none" 
                    value={social.url} 
                    onChange={e => {
                      const newSocials = [...state.footer.socials];
                      newSocials[idx].url = e.target.value;
                      updateFooter('socials', newSocials);
                    }}
                  />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default FooterStudio;
