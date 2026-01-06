
import React, { useState } from 'react';
import { AppState, Expense } from '../../types';
import { Trash2, Receipt } from 'lucide-react';

interface AccountsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AccountsModule: React.FC<AccountsProps> = ({ state, setState }) => {
  const [newExp, setNewExp] = useState<Partial<Expense>>({ description: '', amount: 0, category: 'Stock' });
  const addExp = () => {
    if (!newExp.description || !newExp.amount) return;
    const exp: Expense = { id: 'EXP-' + Date.now(), description: newExp.description || '', amount: Number(newExp.amount), category: newExp.category || 'Stock', date: new Date().toISOString().split('T')[0] };
    setState(prev => ({ ...prev, expenses: [exp, ...prev.expenses] }));
    setNewExp({ description: '', amount: 0, category: 'Stock' });
    alert("Expense Posted to Ledger!");
  };
  return (
    <div className="grid grid-cols-2 gap-10 animate-in fade-in duration-300">
       <div className="bg-white p-12 rounded-[4rem] border border-slate-100 space-y-10 shadow-sm h-fit">
          <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Post Outflow</h3>
          <div className="space-y-4">
             <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold text-sm" placeholder="Transaction Description" value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} />
             <div className="grid grid-cols-2 gap-4">
               <input type="number" className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold text-sm" placeholder="Amount (৳)" value={newExp.amount || ''} onChange={e => setNewExp({...newExp, amount: Number(e.target.value)})} />
               <select className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold text-sm appearance-none" value={newExp.category} onChange={e => setNewExp({...newExp, category: e.target.value})}>
                 <option value="Stock">Asset Acquisition</option>
                 <option value="Marketing">Marketing/Ad-Spend</option>
                 <option value="HRM">Staff & Logistics</option>
                 <option value="Rent">Infrastructure/Rent</option>
               </select>
             </div>
             <button onClick={addExp} className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-rose-700 transition-all mt-6">Post Transaction</button>
          </div>
       </div>
       <div className="bg-white p-12 rounded-[4rem] border border-slate-100 flex flex-col h-[65vh] shadow-sm">
          <h3 className="text-xl font-black uppercase mb-10 tracking-tight text-slate-900">Financial Ledger</h3>
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 scrollbar-hide">
             {state.expenses.map(e => (
               <div key={e.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group">
                  <div className="space-y-1">
                    <p className="font-black text-xs uppercase tracking-tight text-slate-900">{e.description}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{e.date} • {e.category}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-black text-rose-600 text-lg">-{e.amount.toLocaleString()}৳</span>
                    <button onClick={() => setState(p => ({...p, expenses: p.expenses.filter(ex => ex.id !== e.id)}))} className="text-slate-300 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4"/></button>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default AccountsModule;
