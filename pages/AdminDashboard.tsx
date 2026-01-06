
import React, { useState, useMemo, useEffect } from 'react';
import { AppState, CourierStats, Order, IncompleteOrder } from '../types';
import { 
  Calculator, ShoppingBag, UserCheck, Package, FolderTree, 
  Wallet, Users, Palette, PanelTop, Layout, Settings, 
  Clock, Receipt, AlertCircle, TrendingUp, Printer, ShieldAlert, Cpu, CheckCircle2, XCircle, Edit, FileText, Download, Save, PhoneCall, CheckCircle, Ban, Truck, Search, Filter, Eye, Globe, Trash2, Send, ExternalLink,
  BarChart3, RefreshCw, ChevronRight, MoreHorizontal, User, MapPin, CreditCard, Hash, Check, Scissors, SearchCode, CheckSquare, Square
} from 'lucide-react';
import { checkCustomerReliability } from '../courierService';
import { dispatchToSteadfast, dispatchToPathao } from '../courierIntegrationService';

// Modular Imports
import POSModule from '../components/admin/POSModule';
import InventoryModule from '../components/admin/InventoryModule';
import CategoryModule from '../components/admin/CategoryModule';
import HRMModule from '../components/admin/HRMModule';
import AccountsModule from '../components/admin/AccountsModule';
import FooterStudio from '../components/admin/FooterStudio';
import HeaderStudio from '../components/admin/HeaderStudio';
import DesignStudio from '../components/admin/DesignStudio';
import IntegrationsModule from '../components/admin/IntegrationsModule';
import CourierCheckerModule from '../components/admin/CourierCheckerModule';

interface AdminProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AdminDashboard: React.FC<AdminProps> = ({ state, setState }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [courierLoading, setCourierLoading] = useState<string | null>(null);
  const [courierResult, setCourierResult] = useState<CourierStats | null>(null);
  const [isCheckingCourier, setIsCheckingCourier] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [printMode, setPrintMode] = useState<'invoice' | 'slip'>('invoice');

  // Bulk Selection State
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Reset courier result when order changes to avoid stale data display
  useEffect(() => {
    setCourierResult(null);
  }, [selectedOrder?.id]);

  const businessStats = useMemo(() => {
    const revenue = state.orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + (o.total || 0), 0);
    const expenses = state.expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const totalOrders = state.orders.length;
    const pendingOrders = state.orders.filter(o => o.status === 'pending').length;
    const inventoryCount = state.products.length;
    const leadCount = state.incompleteOrders.length;
    
    return { revenue, expenses, profit: revenue - expenses, totalOrders, pendingOrders, inventoryCount, leadCount };
  }, [state]);

  const filteredOrders = useMemo(() => {
    let result = state.orders;
    if (orderFilter !== 'all') {
      result = result.filter(o => o.status === orderFilter);
    }
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.customerPhone.includes(q) || 
        o.customerName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [state.orders, orderFilter, orderSearch]);

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  const handleBulkStatusUpdate = (newStatus: Order['status']) => {
    if (selectedOrderIds.length === 0) return;
    
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => 
        selectedOrderIds.includes(o.id) ? { ...o, status: newStatus } : o
      )
    }));
    setSelectedOrderIds([]);
    alert(`Updated ${selectedOrderIds.length} orders to ${newStatus}`);
  };

  const handleBulkDispatch = async (courier: 'steadfast' | 'pathao') => {
    if (selectedOrderIds.length === 0) return;
    const confirmDispatch = confirm(`Dispatch ${selectedOrderIds.length} orders to ${courier}?`);
    if (!confirmDispatch) return;

    setIsBulkProcessing(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedOrderIds) {
      const order = state.orders.find(o => o.id === id);
      if (!order) continue;

      try {
        let result;
        if (courier === 'steadfast') {
          result = await dispatchToSteadfast(order, state.steadfast);
        } else {
          result = await dispatchToPathao(order, state.pathao);
        }
        
        if (result.success) {
          successCount++;
          setState(prev => ({
            ...prev,
            orders: prev.orders.map(o => o.id === id ? { ...o, status: 'shipped' } : o)
          }));
        }
      } catch (err) {
        console.error(`Failed to dispatch order ${id}:`, err);
        failCount++;
      }
    }

    setIsBulkProcessing(false);
    setSelectedOrderIds([]);
    alert(`Bulk Dispatch Complete!\nSuccess: ${successCount}\nFailed: ${failCount}`);
  };

  const handleCourierCheck = async (phone: string) => {
    if (!phone) return;
    setIsCheckingCourier(true);
    try {
      const result = await checkCustomerReliability(phone);
      setCourierResult(result);
    } catch (error) {
      console.error("Courier Check Error", error);
    } finally {
      setIsCheckingCourier(false);
    }
  };

  const handlePrint = (mode: 'invoice' | 'slip') => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDispatch = async (courier: 'steadfast' | 'pathao') => {
    if (!selectedOrder) return;
    setCourierLoading(courier);
    try {
      let result;
      if (courier === 'steadfast') {
        result = await dispatchToSteadfast(selectedOrder, state.steadfast);
      } else {
        result = await dispatchToPathao(selectedOrder, state.pathao);
      }
      
      if (result.success) {
        alert(`Successfully dispatched to ${courier}! Tracking: ${result.trackingCode}`);
        const updatedOrder = { ...selectedOrder, status: 'shipped' as const };
        setState(prev => ({
          ...prev,
          orders: prev.orders.map(o => o.id === selectedOrder.id ? updatedOrder : o)
        }));
        setSelectedOrder(updatedOrder);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCourierLoading(null);
    }
  };

  const handleUpdateOrder = (updates: Partial<Order>) => {
    if (!selectedOrder) return;
    const updated = { ...selectedOrder, ...updates };
    setSelectedOrder(updated);
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === selectedOrder.id ? updated : o)
    }));
  };

  const handleConfirmOrder = (order: Order) => {
    // If pending, move to processing (confirmed)
    const updated = { ...order, status: 'processing' as const };
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === order.id ? updated : o)
    }));
    setSelectedOrder(null);
  };

  const handleConvertLead = (lead: IncompleteOrder) => {
    if (!lead) return;
    const subtotal = lead.items.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
    const orderId = 'REC-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const newOrder: Order = {
      id: orderId,
      customerName: lead.customerName,
      customerPhone: lead.customerPhone,
      items: lead.items,
      deliveryCharge: 60,
      total: subtotal + 60,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress: 'Recovered Lead - Update Address'
    };

    setState(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      incompleteOrders: prev.incompleteOrders.filter(o => o.id !== lead.id)
    }));
    
    alert(`Success! Lead converted to Order #${orderId}`);
  };

  const handleCancelLead = (id: string) => {
    if(confirm("Discard this abandoned lead fragment?")) {
      setState(prev => ({ ...prev, incompleteOrders: prev.incompleteOrders.filter(o => o.id !== id) }));
    }
  };

  const statusMap: Record<string, { label: string, color: string, ring: string }> = {
    pending: { label: 'Pending', color: 'bg-blue-50 text-blue-600', ring: 'ring-blue-100' },
    processing: { label: 'Confirmed', color: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-100' },
    call_not_received: { label: 'No Answer', color: 'bg-amber-50 text-amber-600', ring: 'ring-amber-100' },
    shipped: { label: 'Shipped', color: 'bg-indigo-50 text-indigo-600', ring: 'ring-indigo-100' },
    delivered: { label: 'Delivered', color: 'bg-green-50 text-green-600', ring: 'ring-green-100' },
    cancelled: { label: 'Cancelled', color: 'bg-rose-50 text-rose-600', ring: 'ring-rose-100' },
    partial: { label: 'Partial', color: 'bg-purple-50 text-purple-600', ring: 'ring-purple-100' },
  };

  const navGroups = [
    { label: 'Strategy', items: [{ id: 'dashboard', label: 'Admin Overview', icon: BarChart3 }] },
    { label: 'Operations', items: [
      { id: 'pos', label: 'POS Terminal', icon: Calculator },
      { id: 'orders', label: 'Order Stream', icon: ShoppingBag, count: state.orders.length },
      { id: 'leads', label: 'Lead Recovery', icon: UserCheck, count: state.incompleteOrders.length },
      { id: 'courier-checker', label: 'Courier Checker', icon: SearchCode },
    ]},
    { label: 'Asset Management', items: [
      { id: 'inventory', label: 'Inventory Vault', icon: Package },
      { id: 'categories', label: 'Collections', icon: FolderTree },
      { id: 'design-studio', label: 'Visual Studio', icon: Palette },
      { id: 'header-design', label: 'Header Studio', icon: PanelTop },
      { id: 'footer-design', label: 'Footer Studio', icon: Layout },
    ]},
    { label: 'Intelligence', items: [
      { id: 'accounts', label: 'Financials', icon: Wallet },
      { id: 'hrm', label: 'Personnel', icon: Users },
      { id: 'integrations', label: 'Integrations', icon: Cpu },
    ]}
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter selection:bg-rose-100 selection:text-rose-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-slate-950 flex flex-col z-[100] shadow-2xl border-r border-white/5 no-print">
        <div className="p-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-[0_0_20px_rgba(225,29,72,0.4)]">U</div>
            <div>
              <h1 className="text-white font-black tracking-tighter text-xl uppercase leading-none">Console<span className="text-rose-500 italic">Luxe</span></h1>
              <p className="text-[9px] text-slate-500 font-black tracking-[0.3em] uppercase mt-2">v6.5 Enterprise</p>
            </div>
          </div>
          <nav className="space-y-8 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-4">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-4">{group.label}</p>
                <div className="flex flex-col gap-1">
                  {group.items.map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-rose-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
                      <div className="flex items-center gap-4"><item.icon className="w-4 h-4" /> {item.label}</div>
                      {item.count !== undefined && <span className={`px-2 py-0.5 rounded-full text-[9px] ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-900 border border-white/5 text-slate-400'}`}>{item.count}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow pl-80 min-h-screen bg-slate-50 no-print">
        <header className="sticky top-0 z-[90] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-16 py-8 flex justify-between items-center shadow-sm">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Infrastructure / {activeTab.replace('-', ' ')}</p>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{activeTab.replace('-', ' ')}</h2>
           </div>
           <div className="flex items-center gap-8">
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Revenue</p>
                 <p className="text-2xl font-black text-emerald-600 tracking-tighter">{businessStats.revenue.toLocaleString()}৳</p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <button className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg"><Settings className="w-5 h-5" /></button>
           </div>
        </header>

        <div className="p-16 max-w-[1600px] mx-auto space-y-12">
          {activeTab === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
               <div className="grid grid-cols-4 gap-8">
                  {[
                    { label: 'Total Revenue', value: `${businessStats.revenue.toLocaleString()}৳`, icon: BarChart3, sub: `Profit: ${businessStats.profit.toLocaleString()}৳`, color: 'text-emerald-600' },
                    { label: 'Active Orders', value: businessStats.totalOrders, icon: ShoppingBag, sub: `${businessStats.pendingOrders} Processing`, color: 'text-blue-600' },
                    { label: 'Inventory SKU', value: businessStats.inventoryCount, icon: Package, sub: 'Unique Units', color: 'text-purple-600' },
                    { label: 'Conversion Leads', value: businessStats.leadCount, icon: UserCheck, sub: 'Abandoned Carts', color: 'text-rose-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                      <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <stat.icon className="w-32 h-32" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">{stat.label}</p>
                      <h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{stat.value}</h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${stat.color}`}>{stat.sub}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'pos' && <POSModule state={state} setState={setState} />}
          {activeTab === 'inventory' && <InventoryModule state={state} setState={setState} />}
          {activeTab === 'categories' && <CategoryModule state={state} setState={setState} />}
          {activeTab === 'hrm' && <HRMModule state={state} setState={setState} />}
          {activeTab === 'accounts' && <AccountsModule state={state} setState={setState} />}
          {activeTab === 'header-design' && <HeaderStudio state={state} setState={setState} />}
          {activeTab === 'footer-design' && <FooterStudio state={state} setState={setState} />}
          {activeTab === 'design-studio' && <DesignStudio state={state} setState={setState} />}
          {activeTab === 'integrations' && <IntegrationsModule state={state} setState={setState} />}
          {activeTab === 'courier-checker' && <CourierCheckerModule />}
          
          {activeTab === 'orders' && (
             <div className="space-y-10 animate-in fade-in duration-500 pb-32">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                   <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/50 rounded-3xl w-fit">
                     {[
                       { id: 'all', label: 'Master Log' },
                       { id: 'pending', label: 'Pending' },
                       { id: 'processing', label: 'Confirmed' },
                       { id: 'call_not_received', label: 'No Answer' },
                       { id: 'shipped', label: 'Shipped' },
                       { id: 'delivered', label: 'Delivered' },
                       { id: 'cancelled', label: 'Cancelled' }
                     ].map(f => (
                       <button key={f.id} onClick={() => setOrderFilter(f.id)} className={`px-8 py-3.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${orderFilter === f.id ? `bg-white text-rose-600 shadow-md` : `text-slate-400 hover:text-slate-900`}`}>
                         {f.label} <span className="ml-2 opacity-40">{f.id === 'all' ? state.orders.length : state.orders.filter(o => o.status === f.id).length}</span>
                       </button>
                     ))}
                   </div>
                   <div className="relative group w-full lg:w-96">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-rose-600 transition-colors" />
                      <input 
                        className="w-full pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-[1.8rem] text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all shadow-sm" 
                        placeholder="Search ID, Name or Phone..." 
                        value={orderSearch}
                        onChange={e => setOrderSearch(e.target.value)}
                      />
                   </div>
                </div>

                <div className="bg-white rounded-[4rem] border border-slate-100 overflow-hidden shadow-sm relative">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-slate-50/80 text-[10px] font-black uppercase text-slate-400 tracking-[0.25em]">
                            <th className="px-6 py-8 text-center">
                              <button onClick={toggleSelectAll} className="w-6 h-6 flex items-center justify-center">
                                {selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0 ? <CheckSquare className="text-rose-600 w-5 h-5"/> : <Square className="w-5 h-5"/>}
                              </button>
                            </th>
                            <th className="px-8 py-8">Reference</th>
                            <th className="px-8 py-8">Identity</th>
                            <th className="px-8 py-8">Liability</th>
                            <th className="px-8 py-8">Execution</th>
                            <th className="px-12 py-8 text-right">Master Control</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {filteredOrders.length > 0 ? filteredOrders.map(o => (
                           <tr key={o.id} className={`hover:bg-slate-50/40 transition-all group cursor-default ${selectedOrderIds.includes(o.id) ? 'bg-rose-50/30' : ''}`}>
                              <td className="px-6 py-10 text-center">
                                <button onClick={() => toggleSelectOrder(o.id)} className="w-6 h-6 flex items-center justify-center">
                                  {selectedOrderIds.includes(o.id) ? <CheckSquare className="text-rose-600 w-5 h-5"/> : <Square className="w-5 h-5 text-slate-300"/>}
                                </button>
                              </td>
                              <td className="px-8 py-10">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black italic text-xs shadow-lg shadow-slate-900/10">U</div>
                                    <div>
                                       <p className="text-[11px] font-black text-slate-900 tracking-tight">#{o.id}</p>
                                       <p className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">{new Date(o.createdAt).toLocaleDateString()}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-10">
                                 <p className="text-[13px] font-black uppercase text-slate-900 tracking-tight">{o.customerName}</p>
                                 <p className="text-[11px] font-black text-rose-600 mt-1 flex items-center gap-2 group-hover:translate-x-1 transition-transform cursor-pointer"><PhoneCall className="w-3 h-3" /> {o.customerPhone}</p>
                              </td>
                              <td className="px-8 py-10">
                                 <p className="text-xl font-black text-slate-950 tracking-tighter">{(o.total || 0).toLocaleString()}৳</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">{o.items.length} Unique Assets</p>
                              </td>
                              <td className="px-8 py-10">
                                 <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 ring-1 ${statusMap[o.status]?.color} ${statusMap[o.status]?.ring}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                    {statusMap[o.status]?.label || o.status}
                                 </span>
                              </td>
                              <td className="px-12 py-10 text-right">
                                <button onClick={() => setSelectedOrder(o)} className="w-12 h-12 bg-white text-slate-900 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm group-hover:scale-110 active:scale-95">
                                   <Eye className="w-5 h-5"/>
                                </button>
                              </td>
                           </tr>
                         )) : (
                           <tr>
                              <td colSpan={6} className="px-12 py-32 text-center">
                                 <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                                       <ShoppingBag className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">No matching transactions found</p>
                                 </div>
                              </td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </div>

                {/* Floating Bulk Action Bar */}
                {selectedOrderIds.length > 0 && (
                  <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-950/95 backdrop-blur-2xl px-10 py-6 rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex items-center gap-10 animate-in slide-in-from-bottom-10 duration-500 min-w-max">
                    <div className="flex items-center gap-4 border-r border-white/10 pr-10">
                      <div className="w-10 h-10 bg-rose-600 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-2xl">{selectedOrderIds.length}</div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Active Selections</p>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Bulk Operation Matrix</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mr-2">Transition To:</p>
                      <div className="flex gap-2">
                        {['processing', 'call_not_received', 'shipped', 'delivered', 'cancelled'].map(st => (
                          <button 
                            key={st} 
                            onClick={() => handleBulkStatusUpdate(st as any)}
                            className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
                          >
                            {statusMap[st]?.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-l border-white/10 pl-10">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mr-2">Dispatch Courier:</p>
                      <div className="flex gap-3">
                        <button 
                          disabled={isBulkProcessing}
                          onClick={() => handleBulkDispatch('steadfast')}
                          className="px-6 py-3 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-2"
                        >
                          {isBulkProcessing ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Send className="w-3 h-3"/>} Steadfast
                        </button>
                        <button 
                          disabled={isBulkProcessing}
                          onClick={() => handleBulkDispatch('pathao')}
                          className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center gap-2"
                        >
                          {isBulkProcessing ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Truck className="w-3 h-3"/>} Pathao
                        </button>
                      </div>
                    </div>

                    <button onClick={() => setSelectedOrderIds([])} className="p-3 text-slate-500 hover:text-white transition-colors">
                      <XCircle className="w-5 h-5"/>
                    </button>
                  </div>
                )}
             </div>
          )}

          {activeTab === 'leads' && (
             <div className="bg-white rounded-[4rem] border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/80 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 tracking-[0.25em]">
                        <th className="px-12 py-8">Prospect ID</th>
                        <th className="px-12 py-8">Entity Details</th>
                        <th className="px-12 py-8">Session Created</th>
                        <th className="px-12 py-8 text-right">Operational Recovery</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {state.incompleteOrders.length > 0 ? state.incompleteOrders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50/40 transition-all group">
                           <td className="px-12 py-10">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black text-xs">L</div>
                                 <p className="text-[11px] font-black text-slate-400 tracking-widest">#{o.id}</p>
                              </div>
                           </td>
                           <td className="px-12 py-10">
                              <p className="text-[13px] font-black uppercase text-slate-900 tracking-tight">{o.customerName || 'Anonymous Prospect'}</p>
                              <p className="text-[11px] font-black text-blue-600 mt-1 flex items-center gap-2 group-hover:translate-x-1 transition-all"><PhoneCall className="w-3 h-3"/> {o.customerPhone}</p>
                           </td>
                           <td className="px-12 py-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">{new Date(o.createdAt).toLocaleString()}</td>
                           <td className="px-12 py-10 text-right">
                            <div className="flex justify-end gap-4">
                              <button 
                                onClick={() => handleConvertLead(o)}
                                className="px-10 py-4 bg-slate-900 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-emerald-600 transition-all shadow-xl active:scale-95 flex items-center gap-3"
                              >
                                <RefreshCw className="w-4 h-4" /> Recover Session
                              </button>
                              <button onClick={() => handleCancelLead(o.id)} className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                            </div>
                           </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="px-12 py-32 text-center text-slate-300 font-black uppercase tracking-[0.4em] text-[10px]">Lead Acquisition Database is Empty</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          )}
        </div>
      </main>

      {/* MASTER ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500 no-print" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white w-full max-w-7xl h-full md:h-auto md:max-h-[95vh] rounded-none md:rounded-[4.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in slide-in-from-bottom duration-500 flex flex-col border border-white/10">
             
             {/* Modal Header */}
             <div className="flex justify-between items-center px-12 md:px-16 py-8 md:py-12 border-b border-slate-50 bg-white/50 backdrop-blur-md sticky top-0 z-[10] no-print">
                <div className="flex items-center gap-4 md:gap-8">
                   <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-600 text-white rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl font-black italic shadow-2xl shadow-rose-600/30">U</div>
                   <div>
                      <h1 className="text-2xl md:text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">Order Master Console</h1>
                      <div className="flex items-center gap-4 mt-1 md:mt-3">
                        <span className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">REF: #{selectedOrder.id}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        <span className="text-[9px] md:text-[11px] font-black text-rose-600 uppercase tracking-[0.5em]">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                      </div>
                   </div>
                </div>
                <div className="flex gap-2 md:gap-4">
                   <button onClick={() => handlePrint('invoice')} className="px-4 md:px-8 py-3 md:py-4 bg-emerald-600 text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-2 md:gap-3 hover:bg-emerald-700 transition-all shadow-lg active:scale-95">
                     <Printer className="w-4 h-4 md:w-5 md:h-5"/> <span className="hidden sm:inline">Print Invoice</span>
                   </button>
                   <button onClick={() => handlePrint('slip')} className="px-4 md:px-8 py-3 md:py-4 bg-blue-600 text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-2 md:gap-3 hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                     <Scissors className="w-4 h-4 md:w-5 md:h-5"/> <span className="hidden sm:inline">Courier Slip</span>
                   </button>
                   <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 md:w-14 md:h-14 bg-rose-50 rounded-xl md:rounded-2xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"><XCircle className="w-5 h-5 md:w-6 md:h-6"/></button>
                </div>
             </div>

             <div className="flex-grow overflow-y-auto scrollbar-hide no-print">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 p-16">
                  {/* Entity Information */}
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <User className="w-5 h-5 text-rose-600" />
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Entity Data Log</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                           <div className="group space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Recipient Identity</label>
                              <input className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] font-black text-sm outline-none" value={selectedOrder.customerName} onChange={e => handleUpdateOrder({ customerName: e.target.value })} />
                           </div>
                           <div className="group space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Digital Comms (Phone)</label>
                              <div className="flex gap-3">
                                 <input className="flex-grow px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] font-black text-sm outline-none" value={selectedOrder.customerPhone} onChange={e => handleUpdateOrder({ customerPhone: e.target.value })} />
                                 <button onClick={() => handleCourierCheck(selectedOrder.customerPhone)} className="w-16 bg-slate-950 text-white rounded-[1.5rem] flex items-center justify-center transition-all hover:bg-rose-600">
                                    {isCheckingCourier ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}
                                 </button>
                              </div>
                           </div>
                           <div className="group space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Shipping Destination</label>
                              <textarea className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none h-40 resize-none" value={selectedOrder.shippingAddress} onChange={e => handleUpdateOrder({ shippingAddress: e.target.value })} />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Operational Flow */}
                  <div className="space-y-12 lg:border-x lg:border-slate-50 lg:px-16">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <Hash className="w-5 h-5 text-rose-600" />
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Asset Breakdown</h4>
                        </div>
                        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                              <Package className="w-24 h-24" />
                           </div>
                           <div className="space-y-4 relative z-10">
                              {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs font-black pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-[10px]">{item.quantity}</div>
                                      <span className="uppercase text-white/90 truncate max-w-[150px]">{state.products.find(p => p.id === item.productId)?.name || 'Premium Asset'}</span>
                                   </div>
                                   <span className="text-rose-500">{(item.price * item.quantity).toLocaleString()}৳</span>
                                </div>
                              ))}
                              <div className="pt-6 flex flex-col gap-2">
                                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Subtotal</span>
                                    <span>{(selectedOrder.total - selectedOrder.deliveryCharge).toLocaleString()}৳</span>
                                 </div>
                                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Logistics</span>
                                    <span>+{selectedOrder.deliveryCharge.toLocaleString()}৳</span>
                                 </div>
                                 <div className="mt-4 flex justify-between items-center">
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500">Total Liability</span>
                                    <span className="text-3xl font-black text-white tracking-tighter">{selectedOrder.total.toLocaleString()}৳</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Operational State</label>
                           <select className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] font-black text-sm outline-none appearance-none cursor-pointer" value={selectedOrder.status} onChange={e => handleUpdateOrder({ status: e.target.value as any })}>
                             {Object.keys(statusMap).map(key => <option key={key} value={key}>{statusMap[key].label}</option>)}
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* External Integrations */}
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <Truck className="w-5 h-5 text-rose-600" />
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Logistics Integration</h4>
                        </div>
                        
                        {/* Courier Score Card */}
                        {courierResult ? (
                          <div className={`p-10 rounded-[3rem] border animate-in slide-in-from-top-4 duration-500 relative overflow-hidden group ${courierResult.isRisk ? 'bg-rose-950 text-rose-100 border-rose-800' : 'bg-emerald-950 text-emerald-100 border-emerald-800'}`}>
                             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <ShieldAlert className="w-32 h-32" />
                             </div>
                             <div className="relative z-10">
                                <div className="flex justify-between items-center mb-8">
                                   <div>
                                      <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${courierResult.isRisk ? 'text-rose-400' : 'text-emerald-400'}`}>Trust Rating</p>
                                      <h5 className="text-4xl font-black tracking-tighter mt-1">{Math.round(courierResult.successRate)}%</h5>
                                   </div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl text-[9px] font-bold leading-relaxed italic opacity-80 mb-4">
                                   {courierResult.history}
                                </div>
                                <div className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase text-center tracking-widest border ${courierResult.isRisk ? 'bg-rose-600 border-rose-500' : 'bg-emerald-600 border-emerald-500'}`}>
                                   {courierResult.isRisk ? 'CRITICAL RISK - ADVANCE REQUIRED' : 'SECURE ENTITY - PROCEED'}
                                </div>
                             </div>
                          </div>
                        ) : (
                          <div className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white transition-all" onClick={() => handleCourierCheck(selectedOrder.customerPhone)}>
                             <ShieldAlert className="w-8 h-8 text-slate-200 mb-2" />
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Verify history</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                           <button disabled={!!courierLoading || !state.steadfast.isEnabled} onClick={() => handleDispatch('steadfast')} className="w-full py-5 bg-rose-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-30">
                              {courierLoading === 'steadfast' ? <RefreshCw className="animate-spin w-4 h-4"/> : <Send className="w-4 h-4"/>} Dispatch Steadfast
                           </button>
                           <button disabled={!!courierLoading || !state.pathao.isEnabled} onClick={() => handleDispatch('pathao')} className="w-full py-5 bg-orange-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-30">
                              {courierLoading === 'pathao' ? <RefreshCw className="animate-spin w-4 h-4"/> : <Truck className="w-4 h-4"/>} Dispatch Pathao
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
             </div>

             {/* Modal Footer Controls */}
             <div className="px-16 py-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 no-print bg-white/50 backdrop-blur-md">
                <div className="flex gap-4 w-full md:w-auto">
                   <button onClick={() => handlePrint('invoice')} className="flex-grow md:flex-none px-12 py-6 border-2 border-slate-900 rounded-full font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-6 hover:bg-slate-950 hover:text-white transition-all">
                      <Printer className="w-6 h-6" /> Invoice
                   </button>
                   <button onClick={() => handlePrint('slip')} className="flex-grow md:flex-none px-12 py-6 border-2 border-blue-600 text-blue-600 rounded-full font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-6 hover:bg-blue-600 hover:text-white transition-all">
                      <Scissors className="w-6 h-6" /> Courier Slip
                   </button>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                   {selectedOrder.status === 'pending' ? (
                     <button onClick={() => handleConfirmOrder(selectedOrder)} className="flex-grow md:flex-none px-20 py-6 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-[0.5em] hover:bg-emerald-700 transition-all shadow-2xl flex items-center justify-center gap-3">
                        <CheckCircle className="w-5 h-5"/> OK / Confirm Order
                     </button>
                   ) : (
                     <button onClick={() => setSelectedOrder(null)} className="flex-grow md:flex-none px-20 py-6 bg-slate-950 text-white rounded-full font-black text-xs uppercase tracking-[0.5em] hover:bg-rose-600 transition-all shadow-2xl flex items-center justify-center gap-3">
                        <Check className="w-5 h-5"/> OK / Done
                     </button>
                   )}
                </div>
             </div>

             {/* PRINT LAYOUTS (Hidden normally, shown during print) */}
             <div className="hidden print:block absolute inset-0 bg-white" id="master-print-container">
                {printMode === 'invoice' ? (
                  <div className="p-20 w-full" id="invoice-print">
                    <div className="flex justify-between items-start mb-24 pb-12 border-b-8 border-slate-900">
                       <div>
                          <h1 className="text-5xl font-black italic tracking-tighter text-slate-950 uppercase">Upohar Luxe</h1>
                          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-600 mt-4">High-End Gifting Infrastructure</p>
                       </div>
                       <div className="text-right">
                          <h2 className="text-6xl font-black text-slate-950 tracking-tighter">OFFICIAL INVOICE</h2>
                          <p className="text-sm font-black mt-2 uppercase text-slate-400 tracking-widest">Master ID: #{selectedOrder.id}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-24 mb-24">
                       <div className="space-y-6">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4">Constituent Target</p>
                          <div className="space-y-2">
                            <p className="text-3xl font-black text-slate-950 uppercase">{selectedOrder.customerName}</p>
                            <p className="text-xl font-bold text-slate-500">{selectedOrder.customerPhone}</p>
                          </div>
                          <div className="pt-6 space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Protocol Address</p>
                            <p className="text-base text-slate-900 leading-relaxed font-bold italic">{selectedOrder.shippingAddress}</p>
                          </div>
                       </div>
                       <div className="text-right space-y-10">
                          <div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4">Chronology</p>
                            <p className="text-lg font-black uppercase text-slate-950">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="pt-6">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4">Liabilities Method</p>
                            <p className="text-lg font-black text-rose-600 uppercase">Cash on Delivery Authorized</p>
                          </div>
                       </div>
                    </div>

                    <table className="w-full mb-24 border-collapse">
                       <thead>
                          <tr className="border-b-4 border-slate-950">
                             <th className="py-8 text-[12px] font-black text-slate-400 uppercase text-left tracking-widest">Asset Classification</th>
                             <th className="py-8 text-[12px] font-black text-slate-400 uppercase text-center tracking-widest">Quantity</th>
                             <th className="py-8 text-[12px] font-black text-slate-400 uppercase text-right tracking-widest">Unit Liability</th>
                             <th className="py-8 text-[12px] font-black text-slate-400 uppercase text-right tracking-widest">Total Liability</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y-2 divide-slate-100">
                          {selectedOrder.items.map((item, idx) => (
                            <tr key={idx}>
                               <td className="py-10">
                                  <p className="font-black text-slate-950 text-lg uppercase">{state.products.find(p => p.id === item.productId)?.name || 'Premium Asset'}</p>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Luxe SKU Identified</p>
                               </td>
                               <td className="py-10 text-center font-black text-xl">{item.quantity}</td>
                               <td className="py-10 text-right font-black text-lg">{item.price.toLocaleString()}৳</td>
                               <td className="py-10 text-right font-black text-xl text-slate-950">{(item.price * item.quantity).toLocaleString()}৳</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>

                    <div className="flex justify-end">
                       <div className="w-[450px] space-y-6">
                          <div className="flex justify-between text-[12px] font-black text-slate-400 uppercase tracking-[0.3em]">
                             <span>Sub-Total Liability</span>
                             <span className="text-slate-950">{(selectedOrder.total - selectedOrder.deliveryCharge).toLocaleString()}৳</span>
                          </div>
                          <div className="flex justify-between text-[12px] font-black text-slate-400 uppercase tracking-[0.3em]">
                             <span>Logistics Surcharge</span>
                             <span className="text-slate-950">{selectedOrder.deliveryCharge.toLocaleString()}৳</span>
                          </div>
                          <div className="h-1 bg-slate-950"></div>
                          <div className="flex justify-between items-end pt-6">
                             <div>
                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em]">Consolidated Total</p>
                                <p className="text-[9px] font-black text-rose-600 uppercase tracking-[0.2em] mt-1">Authorized for Dispatch</p>
                             </div>
                             <p className="text-7xl font-black text-slate-950 tracking-tighter">{selectedOrder.total.toLocaleString()}৳</p>
                          </div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 w-[400px] border-2 border-black border-dashed mx-auto" id="slip-print">
                    <div className="text-center border-b-2 border-black pb-4 mb-4">
                       <h1 className="text-2xl font-black uppercase tracking-widest">Upohar Luxe</h1>
                       <p className="text-[10px] font-bold uppercase tracking-widest">Premium Gifting Protocol</p>
                    </div>
                    <div className="space-y-4 mb-6">
                       <div className="flex justify-between items-center bg-black text-white px-3 py-1">
                          <span className="text-[10px] font-black uppercase tracking-widest">Reference</span>
                          <span className="text-sm font-black italic">#{selectedOrder.id}</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient</p>
                          <p className="text-lg font-black uppercase">{selectedOrder.customerName}</p>
                          <p className="text-base font-black italic">{selectedOrder.customerPhone}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</p>
                          <p className="text-xs font-bold leading-tight uppercase">{selectedOrder.shippingAddress}</p>
                       </div>
                    </div>
                    <div className="border-t border-black pt-4 mb-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Item Logs</p>
                       {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-[10px] font-bold uppercase mb-1">
                             <span>{item.quantity}x {state.products.find(p => p.id === item.productId)?.name || 'Asset'}</span>
                             <span>{(item.price * item.quantity).toLocaleString()}৳</span>
                          </div>
                       ))}
                    </div>
                    <div className="bg-slate-100 p-4 border-2 border-black text-center">
                       <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-rose-600">Total COD Collection</p>
                       <p className="text-4xl font-black tracking-tighter">{selectedOrder.total.toLocaleString()}৳</p>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, html { height: auto !important; overflow: visible !important; background-color: white !important; margin: 0 !important; padding: 0 !important; }
          .no-print, nav, header, aside, .fixed, .absolute:not(#master-print-container) { display: none !important; }
          #root > :not(main), main > :not(.min-h-screen) { display: none !important; }
          #master-print-container { display: block !important; visibility: visible !important; position: relative !important; width: 100% !important; background: white !important; z-index: 1000000 !important; margin: 0 !important; padding: 0 !important; }
          #master-print-container * { visibility: visible !important; }
          @page { margin: 0; size: auto; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default AdminDashboard;
