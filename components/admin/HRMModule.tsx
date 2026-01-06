
import React, { useState } from 'react';
import { AppState, Employee } from '../../types';
import { Plus, Edit3, Trash2, Users } from 'lucide-react';

interface HRMProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const HRMModule: React.FC<HRMProps> = ({ state, setState }) => {
  const [editing, setEditing] = useState<Partial<Employee> | null>(null);

  const saveEmployee = () => {
    if (!editing?.name) return;
    const emp: Employee = {
      id: editing.id || 'EMP-' + Date.now(),
      name: editing.name || '', designation: editing.designation || 'Specialist',
      salary: Number(editing.salary || 0), email: editing.email || '', phone: editing.phone || '',
      joinedDate: editing.joinedDate || new Date().toISOString().split('T')[0], status: (editing.status as any) || 'Active'
    };
    setState(p => ({
      ...p,
      employees: p.employees.find(e => e.id === emp.id) ? p.employees.map(e => e.id === emp.id ? emp : e) : [emp, ...p.employees]
    }));
    setEditing(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black uppercase text-slate-900 tracking-widest">Corporate Capital</h3>
        <button onClick={() => setEditing({ status: 'Active' })} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-rose-600 transition-all"><Plus className="w-4 h-4"/> Onboard Talent</button>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {state.employees.map(emp => (
          <div key={emp.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative group hover:shadow-2xl transition-all">
            <div className="flex justify-between items-center mb-8">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl italic shadow-xl shadow-slate-900/20">{emp.name.charAt(0)}</div>
              <div className="flex gap-2">
                 <button onClick={() => setEditing(emp)} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"><Edit3 className="w-4 h-4"/></button>
                 <button onClick={() => setState(p => ({...p, employees: p.employees.filter(e => e.id !== emp.id)}))} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
            <h4 className="font-black text-slate-900 uppercase text-sm mb-1 tracking-tight">{emp.name}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">{emp.designation}</p>
            <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
               <div className="space-y-1">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Compensation</p>
                 <p className="font-black text-slate-900 text-lg">{emp.salary.toLocaleString()}৳</p>
               </div>
               <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{emp.status}</span>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-lg" onClick={() => setEditing(null)}></div>
           <div className="relative bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl space-y-6 animate-in zoom-in duration-300">
              <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tighter mb-8">Personnel Profile</h3>
              <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold text-sm" placeholder="Full Name" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
              <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold text-sm" placeholder="Designation" value={editing.designation} onChange={e => setEditing({...editing, designation: e.target.value})} />
              <input type="number" className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold text-sm" placeholder="Salary (৳)" value={editing.salary} onChange={e => setEditing({...editing, salary: Number(e.target.value)})} />
              <button onClick={saveEmployee} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-rose-600 transition-all mt-4">Confirm Personnel Record</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default HRMModule;
