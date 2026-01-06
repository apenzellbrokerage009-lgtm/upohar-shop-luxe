
import React from 'react';
import { AppState, HeaderConfig } from '../../types';
import { Type, Layout, Palette, Image as ImageIcon } from 'lucide-react';

interface HeaderStudioProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const HeaderStudio: React.FC<HeaderStudioProps> = ({ state, setState }) => {
  const updateHeader = (key: keyof HeaderConfig, value: any) => {
    setState(p => ({ ...p, header: { ...p.header, [key]: value } }));
  };

  return (
    <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-12 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
         <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Header Designer</h3>
         <button className="px-8 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-rose-700 transition-all">Save Changes</button>
      </div>

      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                 <Type className="w-4 h-4" /> Announcement Bar
              </h4>
              
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-white rounded-2xl border border-slate-200 hover:border-rose-200 transition-colors">
                <input 
                  type="checkbox" 
                  checked={state.header.isAnnouncementEnabled}
                  onChange={e => updateHeader('isAnnouncementEnabled', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-rose-800 focus:ring-rose-800"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">Enable Announcement Bar</span>
                </div>
              </label>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Announcement Text</label>
                <input 
                  className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none" 
                  value={state.header.announcementText} 
                  onChange={e => updateHeader('announcementText', e.target.value)}
                  placeholder="e.g. 50% discount this month!"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Bg Color</label>
                  <div className="flex gap-3">
                    <input type="color" className="w-12 h-12 rounded-xl border-none p-0 bg-transparent cursor-pointer" value={state.header.announcementBgColor} onChange={e => updateHeader('announcementBgColor', e.target.value)} />
                    <input className="flex-grow px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono" value={state.header.announcementBgColor} onChange={e => updateHeader('announcementBgColor', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Text Color</label>
                  <div className="flex gap-3">
                    <input type="color" className="w-12 h-12 rounded-xl border-none p-0 bg-transparent cursor-pointer" value={state.header.announcementTextColor} onChange={e => updateHeader('announcementTextColor', e.target.value)} />
                    <input className="flex-grow px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono" value={state.header.announcementTextColor} onChange={e => updateHeader('announcementTextColor', e.target.value)} />
                  </div>
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-10">
           <div className="p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                 <ImageIcon className="w-4 h-4" /> Brand Assets
              </h4>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Navigation Logo URL</label>
                <input 
                  className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none" 
                  value={state.header.logoUrl} 
                  onChange={e => updateHeader('logoUrl', e.target.value)}
                  placeholder="Paste direct image link..."
                />
              </div>
              {state.header.logoUrl && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-center">
                   <img src={state.header.logoUrl} className="h-12 object-contain" alt="Logo Preview" />
                </div>
              )}
           </div>

           <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Editor Note</p>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Changes made here will affect the global navigation experience. The announcement bar uses a hardware-accelerated marquee effect for smooth scrolling across all devices.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderStudio;
