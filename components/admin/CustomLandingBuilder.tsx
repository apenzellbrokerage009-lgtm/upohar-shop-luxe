
import React, { useState } from 'react';
import { AppState, CustomLandingPage } from '../../types';
import { Plus, Trash2, Edit3, Code, Eye, Save, X, ExternalLink, Sparkles, FileCode } from 'lucide-react';

interface BuilderProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const CustomLandingBuilder: React.FC<BuilderProps> = ({ state, setState }) => {
  const [editing, setEditing] = useState<Partial<CustomLandingPage> | null>(null);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'preview'>('html');

  const saveLanding = () => {
    if (!editing?.title || !editing?.slug) {
      alert("Title and Slug are mandatory.");
      return;
    }
    const page: CustomLandingPage = {
      id: editing.id || Date.now().toString(),
      title: editing.title,
      slug: editing.slug.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      html: editing.html || '',
      css: editing.css || '',
      js: editing.js || '',
      productId: editing.productId,
      createdAt: editing.createdAt || new Date().toISOString()
    };

    setState(p => ({
      ...p,
      customLandings: p.customLandings.find(l => l.id === page.id)
        ? p.customLandings.map(l => l.id === page.id ? page : l)
        : [...p.customLandings, page]
    }));
    setEditing(null);
  };

  const getPreviewHtml = () => {
    if (!editing) return '';
    return `
      <html>
        <head>
          <style>${editing.css || ''}</style>
        </head>
        <body>
          ${editing.html || ''}
          <script>${editing.js || ''}</script>
        </body>
      </html>
    `;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Landing Studio</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Design bespoke product experience funnels</p>
        </div>
        <button onClick={() => setEditing({ title: '', slug: '', html: '<!-- Write your HTML here -->', css: '/* Write your CSS here */', js: '// Write your JS here' })} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl hover:bg-rose-600 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Experience
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.customLandings.map((page) => (
          <div key={page.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-6 group hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <FileCode className="w-20 h-20" />
            </div>
            <div className="flex justify-between items-start">
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                 <Code className="w-6 h-6" />
               </div>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => setEditing(page)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl"><Edit3 className="w-4 h-4"/></button>
                 <button onClick={() => setState(p => ({...p, customLandings: p.customLandings.filter(l => l.id !== page.id)}))} className="p-3 bg-slate-50 text-slate-300 hover:text-rose-600 rounded-xl"><Trash2 className="w-4 h-4"/></button>
               </div>
            </div>
            <div>
              <h4 className="text-base font-black uppercase text-slate-900 tracking-tight">{page.title}</h4>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1 italic flex items-center gap-1">
                /landing/{page.slug} <ExternalLink className="w-2 h-2" />
              </p>
            </div>
            <button onClick={() => setEditing(page)} className="w-full py-3 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-slate-900 hover:text-white transition-all">Launch Editor</button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-lg" onClick={() => setEditing(null)}></div>
          <div className="relative bg-white w-full max-w-[95vw] h-[90vh] rounded-[4rem] p-12 shadow-2xl flex flex-col animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8 shrink-0">
               <div>
                 <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tighter">Experience Orchestrator</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low-level control for high-level conversion</p>
               </div>
               <div className="flex items-center gap-4">
                 <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                    {['html', 'css', 'js', 'preview'].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-900'}`}>{tab}</button>
                    ))}
                 </div>
                 <button onClick={() => setEditing(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-full transition-all"><X className="w-5 h-5"/></button>
               </div>
            </div>
            
            <div className="flex-grow flex gap-8 overflow-hidden">
               {/* Left Panel: Settings */}
               <div className="w-80 space-y-6 shrink-0 overflow-y-auto pr-4 scrollbar-hide">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Page Identity</label>
                    <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-black text-sm outline-none border border-transparent focus:border-rose-500" placeholder="Page Title" value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Reference (Slug)</label>
                    <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-black text-sm outline-none border border-transparent focus:border-rose-500" placeholder="my-custom-product" value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Connect Product (Optional)</label>
                    <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-black text-sm outline-none" value={editing.productId} onChange={e => setEditing({...editing, productId: e.target.value})}>
                      <option value="">No Product Linked</option>
                      {state.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="pt-8">
                     <button onClick={saveLanding} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-rose-600 transition-all shadow-2xl flex items-center justify-center gap-3">
                        <Save className="w-4 h-4" /> Deploy Script
                     </button>
                  </div>
                  <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 mt-6">
                    <div className="flex items-center gap-2 mb-2">
                       <Sparkles className="w-3 h-3 text-indigo-600" />
                       <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Pro Tip</span>
                    </div>
                    <p className="text-[10px] font-bold text-indigo-800 leading-relaxed">
                      You can use standard HTML here. For JS interactivity, use simple DOM manipulation. All code is isolated to the landing container.
                    </p>
                  </div>
               </div>

               {/* Right Panel: Code / Preview */}
               <div className="flex-grow bg-slate-950 rounded-[3rem] overflow-hidden border border-white/5 relative">
                  {activeTab === 'html' && (
                    <textarea className="w-full h-full p-12 bg-transparent text-emerald-400 font-mono text-sm outline-none resize-none scrollbar-hide" value={editing.html} onChange={e => setEditing({...editing, html: e.target.value})} spellCheck={false} />
                  )}
                  {activeTab === 'css' && (
                    <textarea className="w-full h-full p-12 bg-transparent text-blue-400 font-mono text-sm outline-none resize-none scrollbar-hide" value={editing.css} onChange={e => setEditing({...editing, css: e.target.value})} spellCheck={false} />
                  )}
                  {activeTab === 'js' && (
                    <textarea className="w-full h-full p-12 bg-transparent text-amber-400 font-mono text-sm outline-none resize-none scrollbar-hide" value={editing.js} onChange={e => setEditing({...editing, js: e.target.value})} spellCheck={false} />
                  )}
                  {activeTab === 'preview' && (
                    <div className="w-full h-full bg-white">
                       <iframe className="w-full h-full border-none" srcDoc={getPreviewHtml()} title="Preview" />
                    </div>
                  )}
                  <div className="absolute top-6 right-10 flex gap-4 text-[10px] font-black uppercase text-white/20 tracking-widest pointer-events-none">
                    {activeTab === 'html' && 'HTML Structure'}
                    {activeTab === 'css' && 'CSS Styling'}
                    {activeTab === 'js' && 'Runtime Logic'}
                    {activeTab === 'preview' && 'Rendering Engine'}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomLandingBuilder;
