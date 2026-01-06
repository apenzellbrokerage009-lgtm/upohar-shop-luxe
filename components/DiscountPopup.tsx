
import React from 'react';
import { AppState } from '../types';
import { Gift, X, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

interface DiscountPopupProps {
  config: AppState['discount'];
  onAccept: () => void;
  onReject: () => void;
}

const DiscountPopup: React.FC<DiscountPopupProps> = ({ config, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={onReject}></div>
      
      <div className="relative bg-white w-full max-w-lg rounded-[4rem] overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom duration-500 flex flex-col border border-white/10">
        <div className="h-2 w-full bg-rose-600"></div>
        
        <button onClick={onReject} className="absolute top-8 right-8 p-3 text-slate-400 hover:text-rose-600 transition-colors z-20 bg-slate-50 rounded-full shadow-sm">
          <X className="w-5 h-5" />
        </button>

        <div className="p-12 text-center space-y-8 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-600 rounded-full blur-[100px]"></div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10">
            <div className="w-24 h-24 bg-slate-950 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <Gift className="w-12 h-12 text-rose-500" />
            </div>
            
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">
              {config.title}
            </h2>
            <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto leading-relaxed">
              {config.subtitle}
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">One-Time Protocol</span>
            </div>
            <div className="text-6xl font-black text-rose-600 tracking-tighter">
              {config.percentage}% OFF
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={onAccept}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 hover:bg-rose-600 transition-all active:scale-95 group"
            >
              Apply Discount <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={onReject}
              className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] hover:text-slate-500 transition-colors"
            >
              No thanks, I'll pay full price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountPopup;
