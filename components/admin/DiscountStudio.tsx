
import React from 'react';
import { AppState, DiscountConfig } from '../../types';
import { Gift, Percent, Zap, Save, CheckCircle, AlertTriangle } from 'lucide-react';

interface DiscountStudioProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const DiscountStudio: React.FC<DiscountStudioProps> = ({ state, setState }) => {
  const updateDiscount = (updates: Partial<DiscountConfig>) => {
    setState(p => ({ ...p, discount: { ...p.discount, ...updates } }));
  };

  return (
    <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-12 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-600 shadow-xl shadow-rose-600/10">
            <Gift className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Recovery Engine</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Exit-Intent Conversion Protocol</p>
          </div>
        </div>
        <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-rose-600 transition-all shadow-xl">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-rose-600" />
                <h4 className="text-sm font-black uppercase text-slate-900">Master Switch</h4>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={state.discount.isEnabled}
                  onChange={e => updateDiscount({ isEnabled: e.target.checked })}
                  className="sr-only peer" 
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Discount Magnitude (%)</label>
                <div className="relative">
                  <Percent className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="number"
                    className="w-full pl-14 pr-8 py-5 bg-white border border-slate-200 rounded-2xl font-black text-lg outline-none"
                    value={state.discount.percentage}
                    onChange={e => updateDiscount({ percentage: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex gap-6">
            <div className="w-12 h-12 bg-amber-400 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 mb-1 uppercase tracking-tight">System Constraint</p>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                The recovery popup is throttled to appear only once per session/IP to maintain exclusivity and prevent reward exploitation.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Marketing Copy</label>
            <div className="space-y-4">
              <input 
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none"
                placeholder="Headline"
                value={state.discount.title}
                onChange={e => updateDiscount({ title: e.target.value })}
              />
              <textarea 
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-medium text-sm h-32 resize-none outline-none"
                placeholder="Persuasive Subtitle"
                value={state.discount.subtitle}
                onChange={e => updateDiscount({ subtitle: e.target.value })}
              />
            </div>
          </div>

          <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
               <Gift className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-4">
               <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.5em]">Live Preview</p>
               <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                 <h4 className="text-xl font-black uppercase mb-2">{state.discount.title}</h4>
                 <p className="text-xs text-white/60 font-medium leading-relaxed">{state.discount.subtitle}</p>
                 <div className="mt-6 flex items-center gap-3">
                   <div className="px-4 py-2 bg-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Apply {state.discount.percentage}% Off</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountStudio;
