
import React, { useState, useEffect } from 'react';
import { AppState, Product, Order, IncompleteOrder, Category, CourierStats } from '../types';
import { checkCustomerReliability } from '../courierService';
import { dispatchToSteadfast, dispatchToPathao } from '../courierIntegrationService';
import { 
  Plus, Trash2, Edit3, Package, ShoppingBag, Truck, 
  UserCheck, Settings, Printer, X, Palette, 
  CheckCircle, AlertCircle, LayoutDashboard, ChevronRight,
  Globe, CreditCard, Save, Image as ImageIcon, Search,
  TrendingUp, AlertTriangle, BarChart3, Layers
} from 'lucide-react';
import { CATEGORIES } from '../constants';

interface AdminDashboardProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ state, setState }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'leads' | 'products' | 'courier' | 'design' | 'integrations'>('orders');
  
  // Local UI States
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [courierCache, setCourierCache] = useState<Record<string, CourierStats>>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Courier Hub Search State
  const [searchPhone, setSearchPhone] = useState('');
  const [hubResult, setHubResult] = useState<CourierStats | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Auto-fetch Trust Scores for existing orders/leads when tab changes
  useEffect(() => {
    const fetchTrust = async () => {
      const phones = new Set<string>();
      state.orders.forEach(o => phones.add(o.customerPhone));
      state.incompleteOrders.forEach(l => phones.add(l.phone));

      for (const phone of Array.from(phones)) {
        if (phone && phone.length >= 10 && !courierCache[phone]) {
          const res = await checkCustomerReliability(phone);
          if (res) setCourierCache(prev => ({ ...prev, [phone]: res }));
        }
      }
    };
    fetchTrust();
  }, [activeTab, state.orders.length, state.incompleteOrders.length]);

  const handleHubSearch = async () => {
    if (!searchPhone) return;
    setIsSearching(true);
    const res = await checkCustomerReliability(searchPhone);
    setHubResult(res);
    setIsSearching(false);
  };

  const handleConvertLeadToOrder = (lead: IncompleteOrder) => {
    const confirmConversion = window.confirm(`Convert this lead to a real order? Info: ${lead.name} (${lead.phone})`);
    if (!confirmConversion) return;

    const product = state.products.find(p => p.id === lead.productId);
    const unitPrice = product ? product.price : 0;
    const deliveryFee = lead.deliveryCharge || 80;
    const subtotal = unitPrice * lead.quantity;

    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      customerId: 'guest',
      customerName: lead.name || 'CAPI Customer',
      customerPhone: lead.phone,
      shippingAddress: lead.address,
      items: [{
        productId: lead.productId,
        productName: lead.productName,
        quantity: lead.quantity,
        price: unitPrice
      }],
      subtotal: subtotal,
      deliveryCharge: deliveryFee,
      total: subtotal + deliveryFee,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Update global state: Add to orders, remove from leads
    setState(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      incompleteOrders: prev.incompleteOrders.filter(l => l.id !== lead.id)
    }));

    alert(`✅ Success! Lead #${lead.id} is now Order #${newOrder.id}`);
  };

  const handleDispatch = async (order: Order, type: 'steadfast' | 'pathao') => {
    if (dispatchingId) return;
    setDispatchingId(`${order.id}-${type}`);
    try {
      const res = type === 'steadfast' 
        ? await dispatchToSteadfast(order, state.steadfast) 
        : await dispatchToPathao(order, state.pathao);
      
      if (res.success) {
        setState(prev => ({
          ...prev,
          orders: prev.orders.map(o => o.id === order.id ? { ...o, status: 'shipped', trackingCode: res.trackingCode, courierUsed: type.toUpperCase() } : o)
        }));
        alert(`Dispatched! Tracking: ${res.trackingCode}`);
      }
    } catch (e: any) {
      alert(`Dispatch Error: ${e.message}`);
    } finally {
      setDispatchingId(null);
    }
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === id ? { ...o, status } : o)
    }));
  };

  const totalRevenue = state.orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="lg:w-64 bg-slate-900 text-slate-400 p-6 flex flex-col gap-8 shadow-xl z-20">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-rose-600/20">U</div>
          <h1 className="text-white font-black tracking-tighter text-lg uppercase">Admin<span className="text-rose-500">Luxe</span></h1>
        </div>
        
        <nav className="flex flex-col gap-1.5">
          {[
            { id: 'orders', label: 'Orders', icon: ShoppingBag, count: state.orders.length },
            { id: 'leads', label: 'CAPI Leads', icon: UserCheck, count: state.incompleteOrders.length },
            { id: 'courier', label: 'Courier Hub', icon: BarChart3 },
            { id: 'products', label: 'Inventory', icon: Package, count: state.products.length },
            { id: 'design', label: 'Site Design', icon: Palette },
            { id: 'integrations', label: 'Integrations', icon: Settings },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/20' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" /> {item.label}
              </div>
              {item.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-md text-[9px] ${activeTab === item.id ? 'bg-white text-rose-600' : 'bg-slate-800 text-slate-500'}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6 lg:p-12 max-w-7xl mx-auto w-full space-y-10">
        
        {/* HEADER STATS (Visible on all tabs) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Revenue', value: `${totalRevenue.toLocaleString()}৳`, icon: TrendingUp, color: 'text-green-600' },
             { label: 'Active Orders', value: state.orders.filter(o=>o.status==='pending').length, icon: ShoppingBag, color: 'text-rose-600' },
             { label: 'Pending Leads', value: state.incompleteOrders.length, icon: UserCheck, color: 'text-amber-600' },
             { label: 'In Stock', value: state.products.length, icon: Package, color: 'text-blue-600' },
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                   <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
             </div>
           ))}
        </div>

        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
               <ShoppingBag className="w-6 h-6 text-rose-600" /> Live Pipelines
            </h2>
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
                     <tr>
                        <th className="px-8 py-5">Order</th>
                        <th className="px-8 py-5">Customer Info</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Actions</th>
                        <th className="px-8 py-5 text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {state.orders.map(o => (
                       <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 font-black text-slate-900 text-sm">#{o.id}</td>
                          <td className="px-8 py-6">
                             <p className="font-bold text-sm text-slate-900">{o.customerName}</p>
                             <p className="text-xs text-slate-400 font-bold">{o.customerPhone}</p>
                          </td>
                          <td className="px-8 py-6">
                             <select 
                               value={o.status} 
                               onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                               className="text-[10px] font-black bg-slate-100 border-none rounded-xl px-4 py-2 uppercase outline-none focus:ring-2 focus:ring-rose-500"
                             >
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                             </select>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex gap-2">
                                {!o.trackingCode ? (
                                   <button onClick={() => handleDispatch(o, 'steadfast')} className="px-4 py-2 bg-slate-900 text-white text-[10px] rounded-xl font-black uppercase hover:bg-rose-600 transition-all">Dispatch</button>
                                ) : (
                                   <span className="text-[10px] font-black text-rose-600 border border-rose-100 px-3 py-1.5 rounded-lg bg-rose-50">{o.trackingCode}</span>
                                )}
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right font-black text-slate-900">{o.total}৳</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* TAB: COURIER HUB */}
        {activeTab === 'courier' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
               <BarChart3 className="w-6 h-6 text-rose-600" /> Fraud & Trust Analytics
            </h2>
            
            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white space-y-10 border border-white/5">
               <div className="max-w-xl space-y-6">
                  <h3 className="text-xl font-black tracking-tight">Search Customer History</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Check order success rates across all major couriers (Pathao, Steadfast, Redx) before dispatching high-value items.</p>
                  <div className="flex gap-4">
                     <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input 
                          type="text" 
                          placeholder="Phone Number (e.g. 017...)" 
                          className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 text-white font-bold placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-inner"
                          value={searchPhone}
                          onChange={e => setSearchPhone(e.target.value)}
                        />
                     </div>
                     <button 
                       onClick={handleHubSearch}
                       disabled={isSearching}
                       className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-rose-600/20"
                     >
                       {isSearching ? 'Analyzing...' : 'Analyze'}
                     </button>
                  </div>
               </div>

               {hubResult && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in zoom-in duration-500">
                    <div className="bg-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 border border-white/5 shadow-xl">
                       <div className="relative w-32 h-32">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                             <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="10" />
                             <circle 
                               cx="50" cy="50" r="45" fill="none" 
                               stroke={hubResult.successRate > 70 ? "#10b981" : "#f43f5e"} 
                               strokeWidth="10" 
                               strokeDasharray="283" 
                               strokeDashoffset={283 - (283 * hubResult.successRate / 100)} 
                               className="transition-all duration-1000" 
                               strokeLinecap="round"
                             />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-2xl font-black">{hubResult.successRate.toFixed(0)}%</span>
                             <span className="text-[8px] font-black uppercase text-slate-500">Trust</span>
                          </div>
                       </div>
                       <h4 className="font-black uppercase tracking-widest text-[10px]">Reliability Ratio</h4>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                       <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 group hover:bg-slate-800 transition-colors">
                          <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total History</p>
                          <p className="text-3xl font-black">{hubResult.totalOrders}</p>
                       </div>
                       <div className="bg-green-500/10 p-6 rounded-3xl border border-green-500/10">
                          <p className="text-[10px] font-black text-green-500 uppercase mb-1">Success</p>
                          <p className="text-3xl font-black text-green-500">{hubResult.totalSuccess}</p>
                       </div>
                       <div className="bg-rose-500/10 p-6 rounded-3xl border border-rose-500/10">
                          <p className="text-[10px] font-black text-rose-500 uppercase mb-1">Cancelled</p>
                          <p className="text-3xl font-black text-rose-500">{hubResult.totalCancel}</p>
                       </div>
                       <div className="bg-slate-800 p-6 rounded-3xl flex items-center justify-center border border-white/5">
                          {hubResult.isRisk ? (
                            <div className="flex items-center gap-3 text-rose-500">
                               <AlertTriangle className="w-8 h-8" />
                               <span className="text-[10px] font-black uppercase leading-tight">High Risk<br/>Detected</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 text-green-500">
                               <CheckCircle className="w-8 h-8" />
                               <span className="text-[10px] font-black uppercase leading-tight">Safe<br/>Customer</span>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* TAB: RECOVERY LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
               <UserCheck className="w-6 h-6 text-rose-600" /> CAPI Recovery (Abandoned Cart)
            </h2>
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b text-[10px] uppercase font-black text-slate-400">
                     <tr>
                        <th className="px-8 py-5">Timestamp</th>
                        <th className="px-8 py-5">Lead Contact</th>
                        <th className="px-8 py-5">Product Intent</th>
                        <th className="px-8 py-5 text-center">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {state.incompleteOrders.map(lead => (
                       <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 text-[10px] font-black text-slate-400">{new Date(lead.timestamp).toLocaleString()}</td>
                          <td className="px-8 py-6">
                             <p className="font-bold text-sm text-slate-900">{lead.name || 'Visitor'}</p>
                             <p className="text-xs text-rose-600 font-black tracking-wider">{lead.phone}</p>
                             <p className="text-[10px] text-slate-400 truncate w-48 italic mt-1">{lead.address}</p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <img src={state.products.find(p=>p.id===lead.productId)?.image} className="w-10 h-10 rounded-xl object-cover" />
                                <div>
                                   <p className="text-xs font-black text-slate-700">{lead.productName}</p>
                                   <p className="text-[9px] font-bold uppercase text-slate-400">Qty: {lead.quantity}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <button 
                               onClick={() => handleConvertLeadToOrder(lead)}
                               className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase rounded-2xl shadow-lg active:scale-95 transition-all flex items-center gap-2 mx-auto"
                             >
                                <CheckCircle className="w-4 h-4" /> Approve Order
                             </button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
               {state.incompleteOrders.length === 0 && (
                 <div className="p-20 text-center space-y-4">
                    <UserCheck className="w-12 h-12 text-slate-100 mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">All leads processed</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* TAB: INVENTORY */}
        {activeTab === 'products' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                   <Package className="w-6 h-6 text-rose-600" /> Vault Inventory
                </h2>
                <button 
                  onClick={() => setEditingProduct({ id: Math.random().toString(36).substr(2, 6).toUpperCase(), name: '', price: 0, category: 'Floral', shortDescription: '', fullDescription: '', image: '', images: [], stock: 50, rating: 5, reviews: 0 })}
                  className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all shadow-xl active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                 {state.products.map(p => (
                   <div key={p.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm relative group">
                      <img src={p.image} className="w-full aspect-square object-cover rounded-3xl mb-4 group-hover:scale-105 transition-transform" />
                      <p className="text-[10px] font-black text-rose-600 uppercase mb-1">{p.category}</p>
                      <h4 className="text-xs font-black text-slate-900 truncate uppercase mb-2">{p.name}</h4>
                      <p className="text-lg font-black text-slate-900">{p.price}৳</p>
                      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-all rounded-[2.5rem]">
                        <button onClick={() => setEditingProduct(p)} className="px-6 py-2 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Edit</button>
                        <button onClick={() => { if(confirm('Delete product?')) setState(prev => ({...prev, products: prev.products.filter(x => x.id !== p.id)})); }} className="text-rose-400 text-[10px] font-black uppercase hover:text-white transition-colors">Delete</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {/* TAB: SITE DESIGN */}
        {activeTab === 'design' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                 <Palette className="w-6 h-6 text-rose-600" /> Store Aesthetics
              </h2>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10 max-w-2xl">
                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Hero Section Editor</h3>
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Title</label>
                          <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold" value={state.hero.title} onChange={e => setState(p => ({...p, hero: {...p.hero, title: e.target.value}}))} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Subtitle</label>
                          <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 font-medium h-24" value={state.hero.subtitle} onChange={e => setState(p => ({...p, hero: {...p.hero, subtitle: e.target.value}}))} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Button Text</label>
                            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold" value={state.hero.ctaText} onChange={e => setState(p => ({...p, hero: {...p.hero, ctaText: e.target.value}}))} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Image URL</label>
                            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100" value={state.hero.image} onChange={e => setState(p => ({...p, hero: {...p.hero, image: e.target.value}}))} />
                          </div>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => alert('Site design synced to database.')} className="w-full py-5 bg-rose-600 text-white rounded-full font-black uppercase tracking-widest shadow-xl shadow-rose-600/20 active:scale-95 transition-all">
                    Deploy Visual Changes
                 </button>
              </div>
           </div>
        )}

        {/* TAB: INTEGRATIONS */}
        {activeTab === 'integrations' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                 <Settings className="w-6 h-6 text-rose-600" /> Advanced Integrations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-600">Facebook Tracking</h3>
                    <div className="space-y-4">
                       <input placeholder="Pixel ID" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border border-slate-100 font-bold text-sm" value={state.tracking.fbPixelId} onChange={e => setState(p => ({...p, tracking: {...p.tracking, fbPixelId: e.target.value}}))} />
                       <input placeholder="Conversion API Access Token" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border border-slate-100 font-bold text-sm" type="password" value={state.tracking.fbAccessToken} onChange={e => setState(p => ({...p, tracking: {...p.tracking, fbAccessToken: e.target.value}}))} />
                    </div>
                 </div>
                 <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500">Steadfast Logistics</h3>
                    <div className="space-y-4">
                       <input placeholder="API Key" className="w-full px-5 py-3.5 bg-slate-800 rounded-xl border-none font-bold text-sm text-white" value={state.steadfast.apiKey} onChange={e => setState(p => ({...p, steadfast: {...p.steadfast, apiKey: e.target.value}}))} />
                       <input placeholder="Secret Key" className="w-full px-5 py-3.5 bg-slate-800 rounded-xl border-none font-bold text-sm text-white" value={state.steadfast.secretKey} onChange={e => setState(p => ({...p, steadfast: {...p.steadfast, secretKey: e.target.value}}))} />
                    </div>
                 </div>
              </div>
           </div>
        )}

      </div>

      {/* PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setEditingProduct(null)}></div>
           <div className="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-6">
                 <h3 className="text-2xl font-black uppercase tracking-tight">Product Vault</h3>
                 <button onClick={() => setEditingProduct(null)} className="p-2 bg-slate-100 rounded-full hover:bg-rose-100 transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Title</label>
                   <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border text-sm font-bold" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Price (BDT)</label>
                   <input type="number" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border text-sm font-bold" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Category</label>
                   <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl border text-sm font-bold" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as Category})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Stock</label>
                   <input type="number" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border text-sm font-bold" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Thumbnail URL</label>
                 <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border text-sm font-medium" value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} />
              </div>
              <button 
                onClick={() => {
                  setState(p => {
                    const exists = p.products.find(x => x.id === editingProduct.id);
                    if (exists) return {...p, products: p.products.map(x => x.id === editingProduct.id ? editingProduct : x)};
                    return {...p, products: [editingProduct, ...p.products]};
                  });
                  setEditingProduct(null);
                  alert('Vault Sync Successful.');
                }}
                className="w-full py-5 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest hover:bg-rose-800 transition-all shadow-xl active:scale-95"
              >
                Sync with Storefront
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
