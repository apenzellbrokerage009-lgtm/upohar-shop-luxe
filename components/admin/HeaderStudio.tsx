
import React, { useRef } from 'react';
import { AppState, HeaderConfig } from '../../types';
import { Type, Layout, Palette, Image as ImageIcon, Upload, Globe } from 'lucide-react';

interface HeaderStudioProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const HeaderStudio: React.FC<HeaderStudioProps> = ({ state, setState }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateHeader = (key: keyof HeaderConfig, value: any) => {
    setState(p => ({ ...p, header: { ...p.header, [key]: value } }));
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateHeader('faviconUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-12 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
         <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Header & Identity</h3>
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

              {/* Favicon Section */}
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Browser Favicon (16x16 or 32x32)</label>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-2 overflow-hidden">
                    {state.header.faviconUrl ? <img src={state.header.faviconUrl} className="w-full h-full object-contain" /> : <Globe className="w-6 h-6 text-slate-200" />}
                  </div>
                  <div className="flex-grow flex flex-col gap-2">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFaviconUpload} />
                    <button onClick={() => fileInputRef.current?.click()} className="flex-grow py-3 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-rose-600 transition-all">
                      <Upload className="w-3 h-3" /> Upload Favicon
                    </button>
                    <button onClick={() => updateHeader('faviconUrl', '')} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors">Reset Default</button>
                  </div>
                </div>
              </div>
           </div>

           <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Technical Insight</p>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Upload your brand favicon here to see it in the browser tab. Use a PNG or ICO file for the best results.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderStudio;
