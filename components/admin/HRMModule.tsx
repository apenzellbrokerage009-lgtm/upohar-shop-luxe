
import React, { useState } from 'react';
import { AppState, Employee, User, UserRole } from '../../types';
import { Plus, Edit3, Trash2, Users, ShieldCheck, Key, Mail, UserPlus, X } from 'lucide-react';

interface HRMProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const HRMModule: React.FC<HRMProps> = ({ state, setState }) => {
  const [tab, setTab] = useState<'employees' | 'access'>('employees');
  const [editingEmp, setEditingEmp] = useState<Partial<Employee> | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  const saveEmployee = () => {
    if (!editingEmp?.name) return;
    const emp: Employee = {
      id: editingEmp.id || 'EMP-' + Date.now(),
      name: editingEmp.name || '', designation: editingEmp.designation || 'Specialist',
      salary: Number(editingEmp.salary || 0), email: editingEmp.email || '', phone: editingEmp.phone || '',
      joinedDate: editingEmp.joinedDate || new Date().toISOString().split('T')[0], status: (editingEmp.status as any) || 'Active'
    };
    setState(p => ({
      ...p,
      employees: p.employees.find(e => e.id === emp.id) ? p.employees.map(e => e.id === emp.id ? emp : e) : [emp, ...p.employees]
    }));
    setEditingEmp(null);
  };

  const saveUser = () => {
    if (!editingUser?.email || !editingUser?.password) {
      alert("Credentials required.");
      return;
    }
    const newUser: User = {
      id: editingUser.id || 'USR-' + Date.now(),
      name: editingUser.name || 'Staff Member',
      email: editingUser.email,
      password: editingUser.password,
      role: editingUser.role as UserRole || 'call_center'
    };
    setState(p => ({
      ...p,
      adminUsers: p.adminUsers.find(u => u.id === newUser.id) 
        ? p.adminUsers.map(u => u.id === newUser.id ? newUser : u) 
        : [...p.adminUsers, newUser]
    }));
    setEditingUser(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="flex gap-4 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button onClick={() => setTab('employees')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${tab === 'employees' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-900'}`}>Human Resources</button>
        <button onClick={() => setTab('access')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${tab === 'access' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-900'}`}>Access Control</button>
      </div>

      {tab === 'employees' ? (
        <div className="space-y-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black uppercase text-slate-900 tracking-widest">Corporate Capital</h3>
            <button onClick={() => setEditingEmp({ status: 'Active' })} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-rose-600 transition-all"><Plus className="w-4 h-4"/> Onboard Talent</button>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {state.employees.map(emp => (
              <div key={emp.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative group hover:shadow-2xl transition-all">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl italic shadow-xl shadow-slate-900/20">{emp.name.charAt(0)}</div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingEmp(emp)} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"><Edit3 className="w-4 h-4"/></button>
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
        </div>
      ) : (
        <div className="space-y-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black uppercase text-slate-900 tracking-widest text-slate-900 flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-rose-600"/> Security Matrix</h3>
            <button onClick={() => setEditingUser({ role: 'call_center' })} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-rose-600 transition-all"><UserPlus className="w-4 h-4"/> Create Dept User</button>
          </div>
          <div className="bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <th className="px-10 py-6">Member Identity</th>
                    <th className="px-10 py-6">Credentials</th>
                    <th className="px-10 py-6">Department</th>
                    <th className="px-10 py-6 text-right">Operational State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {state.adminUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-10 py-6">
                        <p className="text-sm font-black text-slate-900 uppercase">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">ID: {u.id}</p>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-mono text-slate-500"><Mail className="w-3 h-3"/> {u.email}</div>
                           <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-mono text-slate-500"><Key className="w-3 h-3"/> ••••••••</div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ring-1 ${u.role === 'admin' ? 'bg-rose-50 text-rose-600 ring-rose-100' : u.role === 'packaging' ? 'bg-indigo-50 text-indigo-600 ring-indigo-100' : 'bg-emerald-50 text-emerald-600 ring-emerald-100'}`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditingUser(u)} className="p-2 text-slate-400 hover:text-slate-900"><Edit3 className="w-4 h-4"/></button>
                            {u.id !== 'master-1' && <button onClick={() => setState(p => ({...p, adminUsers: p.adminUsers.filter(usr => usr.id !== u.id)}))} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {editingEmp && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-lg" onClick={() => setEditingEmp(null)}></div>
           <div className="relative bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl space-y-6 animate-in zoom-in duration-300">
              <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tighter mb-8">Personnel Profile</h3>
              <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold text-sm outline-none" placeholder="Full Name" value={editingEmp.name} onChange={e => setEditingEmp({...editingEmp, name: e.target.value})} />
              <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold text-sm outline-none" placeholder="Designation" value={editingEmp.designation} onChange={e => setEditingEmp({...editingEmp, designation: e.target.value})} />
              <input type="number" className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-bold text-sm outline-none" placeholder="Salary (৳)" value={editingEmp.salary} onChange={e => setEditingEmp({...editingEmp, salary: Number(e.target.value)})} />
              <button onClick={saveEmployee} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-rose-600 transition-all mt-4">Confirm Personnel Record</button>
           </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-lg" onClick={() => setEditingUser(null)}></div>
           <div className="relative bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-2xl space-y-8 animate-in zoom-in duration-300">
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tighter">Login Authorization</h3>
                 <button onClick={() => setEditingUser(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-full transition-all"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-4">
                <input className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none" placeholder="Full Name" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                <input className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none" placeholder="Login Email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                <input className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none" placeholder="Department Password" value={editingUser.password} onChange={e => setEditingUser({...editingUser, password: e.target.value})} />
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Access Scope</label>
                   <select className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none appearance-none" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}>
                      <option value="call_center">Call Center (Orders & Leads Only)</option>
                      <option value="packaging">Packaging (Item Manifests Only)</option>
                      <option value="admin">Master Administrator (Full Access)</option>
                   </select>
                </div>
              </div>
              <button onClick={saveUser} className="w-full py-6 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl">Authorize Access</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default HRMModule;
