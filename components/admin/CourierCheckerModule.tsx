
import React, { useState } from 'react';
import { CourierStats } from '../../types';
import { checkCustomerReliability } from '../../courierService';
import { SearchCode, PhoneCall, RefreshCw, Search, Ban, CheckCircle, ShieldAlert } from 'lucide-react';

const CourierCheckerModule: React.FC = () => {
  const [checkPhone, setCheckPhone] = useState('');
  const [result, setResult] = useState<CourierStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    if (!checkPhone || checkPhone.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await checkCustomerReliability(checkPhone);
      setResult(data);
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="bg-white p-12 md:p-16 rounded-[4.5rem] border border-slate-100 shadow-sm space-y-10">
        <div className="flex items-center gap-6 mb-4">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-2xl">
            <SearchCode className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Entity Reliability Scan</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Cross-Reference Central BD courier Database</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <PhoneCall className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input
              className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-3xl font-black text-lg outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all"
              placeholder="Recipient Phone (e.g. 017...)"
              value={checkPhone}
              onChange={e => setCheckPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            />
          </div>
          <button
            onClick={handleScan}
            disabled={isLoading}
            className="px-12 py-6 sm:py-0 bg-slate-950 text-white rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-xl"
          >
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />} Perform Scan
          </button>
        </div>

        {result && (
          <div className={`p-10 md:p-12 rounded-[3.5rem] border-2 animate-in zoom-in duration-500 ${result.isRisk ? 'bg-rose-950 text-rose-100 border-rose-800 shadow-2xl shadow-rose-900/40' : 'bg-emerald-950 text-emerald-100 border-emerald-800 shadow-2xl shadow-emerald-900/40'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-50 mb-4">Security Trust Metric</p>
                  <div className="flex items-end gap-4">
                    <h5 className="text-7xl font-black tracking-tighter">{Math.round(result.successRate)}%</h5>
                    <span className="text-xl font-black opacity-50 mb-2 uppercase tracking-widest">Confidence</span>
                  </div>
                </div>
                <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                  <p className="text-[11px] font-bold leading-relaxed italic">
                    {result.history}
                  </p>
                </div>
              </div>
              <div className="space-y-6 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Total Logs</p>
                    <p className="text-2xl font-black">{result.totalOrders}</p>
                  </div>
                  <div className={`p-6 bg-white/5 rounded-2xl border border-white/10 ${result.isRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Breaches</p>
                    <p className="text-2xl font-black">{result.totalCancel}</p>
                  </div>
                </div>
                <div className={`w-full py-6 rounded-2xl flex items-center justify-center gap-4 font-black uppercase text-xs tracking-[0.3em] border-2 shadow-2xl ${result.isRisk ? 'bg-rose-600 text-white border-rose-400 shadow-rose-600/30' : 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/30'}`}>
                  {result.isRisk ? <Ban className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                  {result.isRisk ? 'CRITICAL RISK ALERT' : 'SECURE IDENTITY VERIFIED'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {!result && !isLoading && (
        <div className="text-center py-10 opacity-30">
          <ShieldAlert className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">System standby. Waiting for input.</p>
        </div>
      )}
    </div>
  );
};

export default CourierCheckerModule;
