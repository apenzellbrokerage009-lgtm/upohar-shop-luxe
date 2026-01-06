
import React, { useState } from 'react';
import { AppState, NavMenu } from '../../types';
import { Plus, Trash2, Edit3, MoveUp, MoveDown, Link as LinkIcon, Save, X } from 'lucide-react';

interface MenuStudioProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const MenuStudio: React.FC<MenuStudioProps> = ({ state, setState }) => {
  const [editing, setEditing] = useState<Partial<NavMenu> | null>(null);

  const saveMenu = () => {
    if (!editing?.label || !editing?.href) return;
    const newItem: NavMenu = {
      id: editing.id || Date.now().toString(),
      label: editing.label,
      href: editing.href,
      isExternal: editing.isExternal || false
    };

    setState(p => ({
      ...p,
      navMenus: p.navMenus.find(m => m.id === newItem.id)
        ? p.navMenus.map(m => m.id === newItem.id ? newItem : m)
        : [...p.navMenus, newItem]
    }));
    setEditing(null);
  };

  const removeMenu = (id: string) => {
    setState(p => ({ ...p, navMenus: p.navMenus.filter(m => m.id !== id) }));
  };

  const move = (index: number, direction: 'up' | 'down') => {
    const newMenus = [...state.navMenus];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newMenus.length) return;
    [newMenus[index], newMenus[target]] = [newMenus[target], newMenus[index]];
    setState(p => ({ ...p, navMenus: newMenus }));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <LinkIcon className="w-6 h-6 text-rose-600" />
            <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Navigation Matrix</h3>
          </div>
          <button onClick={() => setEditing({ label: '', href: '', isExternal: false })} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-rose-600 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Link
          </button>
        </div>

        <div className="space-y-4">
          {state.navMenus.map((menu, idx) => (
            <div key={menu.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group hover:border-rose-200 transition-all">
              <div className="flex flex-col gap-1">
                <button onClick={() => move(idx, 'up')} className="p-1 text-slate-300 hover:text-slate-900"><MoveUp className="w-4 h-4"/></button>
                <button onClick={() => move(idx, 'down')} className="p-1 text-slate-300 hover:text-slate-900"><MoveDown className="w-4 h-4"/></button>
              </div>
              
              <div className="flex-grow">
                <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight">{menu.label}</h4>
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{menu.href} {menu.isExternal && '• External'}</p>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(menu)} className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-xl shadow-sm"><Edit3 className="w-4 h-4"/></button>
                <button onClick={() => removeMenu(menu.id)} className="p-3 bg-white text-slate-300 hover:text-rose-600 rounded-xl shadow-sm"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
          {state.navMenus.length === 0 && (
            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Navigation is currently empty</p>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-lg" onClick={() => setEditing(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl space-y-8 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tighter">Edit Nav Link</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Link Label</label>
                <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-black text-sm outline-none" value={editing.label} onChange={e => setEditing({...editing, label: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Target Path / URL</label>
                <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-black text-sm outline-none" value={editing.href} onChange={e => setEditing({...editing, href: e.target.value})} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl">
                <input type="checkbox" checked={editing.isExternal} onChange={e => setEditing({...editing, isExternal: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-rose-600" />
                <span className="text-sm font-bold text-slate-900">Open in New Tab</span>
              </label>
            </div>
            <button onClick={saveMenu} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-rose-600 transition-all flex items-center justify-center gap-3">
              <Save className="w-4 h-4" /> Commit to Matrix
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuStudio;
