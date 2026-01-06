
import React from 'react';
import { AppState, TrackingConfig, SteadfastConfig, PathaoConfig } from '../../types';
import { Shield, Globe, Truck, Facebook, Code, ExternalLink, Activity } from 'lucide-react';

interface IntegrationsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const IntegrationsModule: React.FC<IntegrationsProps> = ({ state, setState }) => {
  const updateTracking = (updates: Partial<TrackingConfig>) => {
    setState(p => ({ ...p, tracking: { ...p.tracking, ...updates } }));
  };

  const updateSteadfast = (updates: Partial<SteadfastConfig>) => {
    setState(p => ({ ...p, steadfast: { ...p.steadfast, ...updates } }));
  };

  const updatePathao = (updates: Partial<PathaoConfig>) => {
    setState(p => ({ ...p, pathao: { ...p.pathao, ...updates } }));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Marketing Tracking Matrix */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Tracking Matrix</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pixel, GTM & Conversions API</p>
            </div>
          </div>

          <div className="space-y-6">
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <input 
                type="checkbox" 
                checked={state.tracking.isEnabled}
                onChange={e => updateTracking({ isEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm font-black text-slate-900 uppercase">Enable Global Tracking</span>
            </label>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">FB Pixel ID</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-xl text-xs font-mono font-bold outline-none" placeholder="1234567890" value={state.tracking.fbPixelId} onChange={e => updateTracking({ fbPixelId: e.target.value })} />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">FB Conversion Access Token (CAPI)</label>
                <textarea className="w-full px-6 py-4 bg-slate-50 rounded-xl text-xs font-mono font-bold outline-none h-20 resize-none" placeholder="EAAB..." value={state.tracking.fbAccessToken} onChange={e => updateTracking({ fbAccessToken: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">GTM Container ID</label>
                  <input className="w-full px-6 py-4 bg-slate-50 rounded-xl text-xs font-mono font-bold outline-none" placeholder="GTM-XXXX" value={state.tracking.gtmId} onChange={e => updateTracking({ gtmId: e.target.value })} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">TikTok Pixel ID</label>
                  <input className="w-full px-6 py-4 bg-slate-50 rounded-xl text-xs font-mono font-bold outline-none" placeholder="CXXXXX" value={state.tracking.tiktokId} onChange={e => updateTracking({ tiktokId: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Dispatch Center */}
        <div className="space-y-8">
          {/* Steadfast Panel */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 font-black italic">SF</div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Steadfast API</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={state.steadfast.isEnabled} onChange={e => updateSteadfast({ isEnabled: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input className="px-6 py-4 bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="API Key" value={state.steadfast.apiKey} onChange={e => updateSteadfast({ apiKey: e.target.value })} />
              <input className="px-6 py-4 bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Secret Key" value={state.steadfast.secretKey} onChange={e => updateSteadfast({ secretKey: e.target.value })} />
            </div>
          </div>

          {/* Pathao Panel */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 font-black italic">PH</div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Pathao Aladdin</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={state.pathao.isEnabled} onChange={e => updatePathao({ isEnabled: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input className="px-6 py-4 bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Client ID" value={state.pathao.clientId} onChange={e => updatePathao({ clientId: e.target.value })} />
              <input className="px-6 py-4 bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Client Secret" value={state.pathao.clientSecret} onChange={e => updatePathao({ clientSecret: e.target.value })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsModule;
