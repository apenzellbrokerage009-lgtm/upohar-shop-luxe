
import React, { useState } from 'react';
import { AppState } from '../../types';
import { Plus, Trash2, Edit3, FileText, Save, X, Eye } from 'lucide-react';

interface PagesProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const PagesModule: React.FC<PagesProps> = ({ state, setState }) => {
  const [editing, setEditing] = useState<any | null>(null);

  const savePage = () => {
    if (!editing?.title) return;
    const page = {
      id: editing.id || Date.now().toString(),
      title: editing.title,
      slug: editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      content: editing.content || '',
      updatedAt: new Date().toISOString()
    };

    setState(p => ({
      ...p,
      customPages: p.customPages.find((pg: any) => pg.id === page.id)
        ? p.customPages.map((pg: any) => pg.id === page.id ? page : pg)
        : [...p.customPages, page]
    }));
    setEditing(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Static Pages</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage corporate information and legal docs</p>
        </div>
        <button onClick={() => setEditing({ title: '', content: '', slug: '' })} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-rose-600 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.customPages.map((page: any) => (
          <div key={page.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-6 group hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start">
               <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                 <FileText className="w-6 h-6" />
               </div>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => setEditing(page)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl"><Edit3 className="w-4 h-4"/></button>
                 <button onClick={() => setState(p => ({...p, customPages: p.customPages.filter((pg: any) => pg.id !== page.id)}))} className="p-3 bg-slate-50 text-slate-300 hover:text-rose-600 rounded-xl"><Trash2 className="w-4 h-4"/></button>
               </div>
            </div>
            <div>
              <h4 className="text-base font-black uppercase text-slate-900 tracking-tight">{page.title}</h4>
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-1 italic">/{page.slug}</p>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{page.content}</p>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-lg" onClick={() => setEditing(null)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[4rem] p-12 shadow-2xl space-y-8 animate-in zoom-in duration-300 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center shrink-0">
               <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tighter">Content Editor</h3>
               <button onClick={() => setEditing(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-full transition-all"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-6 pr-4 scrollbar-hide">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Page Title</label>
                  <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-black text-sm outline-none" value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">URL Slug</label>
                  <input className="w-full px-8 py-5 bg-slate-50 rounded-2xl font-black text-sm outline-none" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Page Content (HTML/Markdown Supported)</label>
                <textarea className="w-full px-8 py-5 bg-slate-50 rounded-3xl font-medium text-sm h-64 resize-none outline-none border border-transparent focus:border-rose-500" value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})} />
              </div>
            </div>

            <div className="shrink-0 pt-6">
              <button onClick={savePage} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-rose-600 transition-all flex items-center justify-center gap-3 shadow-2xl">
                <Save className="w-5 h-5" /> Finalize Publication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesModule;
