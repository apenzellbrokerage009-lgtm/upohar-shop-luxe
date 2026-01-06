
import React, { useState, useMemo, useEffect } from 'react';
import { AppState, CourierStats, Order, IncompleteOrder, UserRole } from '../types';
import { 
  Calculator, ShoppingBag, UserCheck, Package, FolderTree, 
  Wallet, Users, Palette, PanelTop, Layout, Settings, 
  Clock, Receipt, AlertCircle, TrendingUp, Printer, ShieldAlert, Cpu, CheckCircle2, XCircle, Edit, FileText, Download, Save, PhoneCall, CheckCircle, Ban, Truck, Search, Filter, Eye, Globe, Trash2, Send, ExternalLink,
  BarChart3, RefreshCw, ChevronRight, MoreHorizontal, User, MapPin, CreditCard, Hash, Check, Scissors, SearchCode, CheckSquare, Square, Menu as MenuIcon, FileEdit, Zap, ListChecks
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
import LandingPageStudio from '../components/admin/LandingPageStudio';
import MenuStudio from '../components/admin/MenuStudio';
import PagesModule from '../components/admin/PagesModule';
import CustomLandingBuilder from '../components/admin/CustomLandingBuilder';
import PackagingManifest from '../components/admin/PackagingManifest';

// Fix: Defined statusMap to resolve reference errors
const statusMap: Record<string, { label: string, color: string, ring: string }> = {
  pending: { label: 'Pending', color: 'text-amber-600', ring: 'ring-amber-100' },
  processing: { label: 'Confirmed', color: 'text-emerald-600', ring: 'ring-emerald-100' },
  shipped: { label: 'Shipped', color: 'text-blue-600', ring: 'ring-blue-100' },
  delivered: { label: 'Delivered', color: 'text-slate-900', ring: 'ring-slate-100' },
  cancelled: { label: 'Cancelled', color: 'text-rose-600', ring: 'ring-rose-100' },
  call_not_received: { label: 'No Answer', color: 'text-purple-600', ring: 'ring-purple-100' },
  partial: { label: 'Partial', color: 'text-orange-600', ring: 'ring-orange-100' }
};

interface AdminProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AdminDashboard: React.FC<AdminProps> = ({ state, setState }) => {
  const userRole = state.currentUser?.role || 'admin';
  const [activeTab, setActiveTab] = useState(userRole === 'packaging' ? 'packaging' : 'dashboard');
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
  };

  const handleBulkDispatch = async (courier: 'steadfast' | 'pathao') => {
    if (selectedOrderIds.length === 0) return;
    const confirmDispatch = confirm(`Dispatch ${selectedOrderIds.length} orders to ${courier}?`);
    if (!confirmDispatch) return;

    setIsBulkProcessing(true);
    let successCount = 0;
    for (const id of selectedOrderIds) {
      const order = state.orders.find(o => o.id === id);
      if (!order) continue;
      try {
        let result;
        if (courier === 'steadfast') result = await dispatchToSteadfast(order, state.steadfast);
        else result = await dispatchToPathao(order, state.pathao);
        
        if (result.success) {
          successCount++;
          setState(prev => ({
            ...prev,
            orders: prev.orders.map(o => o.id === id ? { ...o, status: 'shipped' } : o)
          }));
        }
      } catch (err) {}
    }
    setIsBulkProcessing(false);
    setSelectedOrderIds([]);
    alert(`Bulk Dispatch Complete! Success: ${successCount}`);
  };

  const handleCourierCheck = async (phone: string) => {
    if (!phone) return;
    setIsCheckingCourier(true);
    try {
      const result = await checkCustomerReliability(phone);
      setCourierResult(result);
    } catch (error) {
    } finally {
      setIsCheckingCourier(false);
    }
  };

  const handlePrint = (mode: 'invoice' | 'slip') => {
    setPrintMode(mode);
    setTimeout(() => window.print(), 300);
  };

  const handleDispatch = async (courier: 'steadfast' | 'pathao') => {
    if (!selectedOrder) return;
    setCourierLoading(courier);
    try {
      let result;
      if (courier === 'steadfast') result = await dispatchToSteadfast(selectedOrder, state.steadfast);
      else result = await dispatchToPathao(selectedOrder, state.pathao);
      
      if (result.success) {
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
    const updated = { ...order, status: 'processing' as const };
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === order.id ? updated : o)
    }));
    setSelectedOrder(null);
  };

  const handleConvertLead = (lead: IncompleteOrder) => {
    const subtotal = lead.items.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
    const orderId = 'REC-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const newOrder: Order = {
      id: orderId, customerName: lead.customerName, customerPhone: lead.customerPhone,
      items: lead.items, deliveryCharge: 60, total: subtotal + 60, status: 'pending',
      createdAt: new Date().toISOString(), shippingAddress: 'Recovered Lead'
    };
    setState(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      incompleteOrders: prev.incompleteOrders.filter(o => o.id !== lead.id)
    }));
  };

  // ROLE-BASED NAVIGATION LOGIC
  const navGroups = useMemo(() => {
    const groups = [
      { label: 'Strategy', roles: ['admin'], items: [{ id: 'dashboard', label: 'Admin Overview', icon: BarChart3 }] },
      { label: 'Operations', roles: ['admin', 'call_center'], items: [
        { id: 'pos', label: 'POS Terminal', icon: Calculator, roles: ['admin'] },
        { id: 'orders', label: 'Order Stream', icon: ShoppingBag, count: state.orders.length },
        { id: 'leads', label: 'Lead Recovery', icon: UserCheck, count: state.incompleteOrders.length },
        { id: 'courier-checker', label: 'Courier Checker', icon: SearchCode },
      ]},
      { label: 'Logistics', roles: ['admin', 'packaging'], items: [
        { id: 'packaging', label: 'Pack Manifest', icon: ListChecks },
        { id: 'inventory', label: 'Inventory Access', icon: Package, roles: ['admin', 'packaging'] },
      ]},
      { label: 'Content & Branding', roles: ['admin'], items: [
        { id: 'custom-builder', label: 'Landing Studio', icon: Zap },
        { id: 'landing-studio', label: 'Hero Studio', icon: Layout },
        { id: 'menu-studio', label: 'Menu Matrix', icon: MenuIcon },
        { id: 'pages', label: 'Custom Pages', icon: FileEdit },
        { id: 'header-design', label: 'Header Studio', icon: PanelTop },
        { id: 'footer-design', label: 'Footer Studio', icon: Layout },
        { id: 'design-studio', label: 'Visual Engine', icon: Palette },
      ]},
      { label: 'Asset Management', roles: ['admin'], items: [
        { id: 'categories', label: 'Collections', icon: FolderTree },
      ]},
      { label: 'Intelligence', roles: ['admin'], items: [
        { id: 'accounts', label: 'Financials', icon: Wallet },
        { id: 'hrm', label: 'Personnel & Access', icon: Users },
        { id: 'integrations', label: 'Integrations', icon: Cpu },
      ]}
    ];

    return groups.filter(g => g.roles.includes(userRole)).map(g => ({
      ...g,
      items: g.items.filter(i => !i.roles || i.roles.includes(userRole))
    }));
  }, [userRole, state.orders.length, state.incompleteOrders.length]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter selection:bg-rose-100 selection:text-rose-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-slate-950 flex flex-col z-[100] shadow-2xl border-r border-white/5 no-print">
        <div className="p-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-[0_0_20px_rgba(225,29,72,0.4)]">U</div>
            <div>
              <h1 className="text-white font-black tracking-tighter text-xl uppercase leading-none">Console<span className="text-rose-500 italic">Luxe</span></h1>
              <p className="text-[9px] text-slate-500 font-black tracking-[0.3em] uppercase mt-2">{userRole.replace('_', ' ')} Terminal</p>
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Upohar Luxe / {activeTab.replace('-', ' ')}</p>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{activeTab.replace('-', ' ')}</h2>
           </div>
           <div className="flex items-center gap-8">
              {userRole === 'admin' && (
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Revenue</p>
                   <p className="text-2xl font-black text-emerald-600 tracking-tighter">{businessStats.revenue.toLocaleString()}৳</p>
                </div>
              )}
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-900 uppercase">{state.currentUser?.name}</p>
                    <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest">{userRole.replace('_', ' ')}</p>
                 </div>
                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black">
                    {state.currentUser?.name?.charAt(0)}
                 </div>
              </div>
           </div>
        </header>

        <div className="p-16 max-w-[1600px] mx-auto space-y-12">
          {activeTab === 'dashboard' && userRole === 'admin' && (
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
          {activeTab === 'landing-studio' && <LandingPageStudio state={state} setState={setState} />}
          {activeTab === 'menu-studio' && <MenuStudio state={state} setState={setState} />}
          {activeTab === 'pages' && <PagesModule state={state} setState={setState} />}
          {activeTab === 'custom-builder' && <CustomLandingBuilder state={state} setState={setState} />}
          {activeTab === 'packaging' && <PackagingManifest state={state} setState={setState} />}
          
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
                              <td colSpan={6} className="px-12 py-32 text-center text-slate-300 font-black uppercase tracking-[0.4em] text-[10px]">No matching transactions found</td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </div>

                {/* Floating Bulk Action Bar */}
                {selectedOrderIds.length > 0 && userRole !== 'packaging' && (
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

                    {userRole === 'admin' && (
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
                    )}

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
                              <button onClick={() => setState(prev => ({ ...prev, incompleteOrders: prev.incompleteOrders.filter(lead => lead.id !== o.id) }))} className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
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

      {/* MASTER ORDER DETAIL MODAL - RESTRICTED ACTIONS BASED ON ROLE */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500 no-print" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white w-full max-w-7xl h-full md:h-auto md:max-h-[95vh] rounded-none md:rounded-[4.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in slide-in-from-bottom duration-500 flex flex-col border border-white/10">
             
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
                   <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 md:w-14 md:h-14 bg-rose-50 rounded-xl md:rounded-2xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"><XCircle className="w-5 h-5 md:w-6 md:h-6"/></button>
                </div>
             </div>

             <div className="flex-grow overflow-y-auto scrollbar-hide no-print">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 p-16">
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <User className="w-5 h-5 text-rose-600" />
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Entity Data Log</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                           <div className="group space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Recipient Identity</label>
                              <input disabled={userRole === 'packaging'} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] font-black text-sm outline-none" value={selectedOrder.customerName} onChange={e => handleUpdateOrder({ customerName: e.target.value })} />
                           </div>
                           <div className="group space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Digital Comms (Phone)</label>
                              <div className="flex gap-3">
                                 <input disabled={userRole === 'packaging'} className="flex-grow px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] font-black text-sm outline-none" value={selectedOrder.customerPhone} onChange={e => handleUpdateOrder({ customerPhone: e.target.value })} />
                                 {userRole !== 'packaging' && <button onClick={() => handleCourierCheck(selectedOrder.customerPhone)} className="w-16 bg-slate-950 text-white rounded-[1.5rem] flex items-center justify-center transition-all hover:bg-rose-600">
                                    {isCheckingCourier ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}
                                 </button>}
                              </div>
                           </div>
                           <div className="group space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Shipping Destination</label>
                              <textarea disabled={userRole === 'packaging'} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none h-40 resize-none" value={selectedOrder.shippingAddress} onChange={e => handleUpdateOrder({ shippingAddress: e.target.value })} />
                           </div>
                        </div>
                     </div>
                  </div>

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
                           <select disabled={userRole === 'packaging'} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] font-black text-sm outline-none appearance-none cursor-pointer" value={selectedOrder.status} onChange={e => handleUpdateOrder({ status: e.target.value as any })}>
                             {Object.keys(statusMap).map(key => <option key={key} value={key}>{statusMap[key].label}</option>)}
                           </select>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <Truck className="w-5 h-5 text-rose-600" />
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Logistics Integration</h4>
                        </div>
                        
                        {courierResult ? (
                          <div className={`p-10 rounded-[3rem] border animate-in slide-in-from-top-4 duration-500 relative overflow-hidden group ${courierResult.isRisk ? 'bg-rose-950 text-rose-100 border-rose-800 shadow-2xl shadow-rose-900/40' : 'bg-emerald-950 text-emerald-100 border-emerald-800 shadow-2xl shadow-emerald-900/40'}`}>
                             <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShieldAlert className="w-32 h-32" />
                             </div>
                             <div className="relative z-10">
                                <h5 className="text-4xl font-black tracking-tighter mt-1">{Math.round(courierResult.successRate)}% Trust</h5>
                                <div className="p-4 bg-white/5 rounded-2xl text-[9px] font-bold leading-relaxed italic opacity-80 mb-4">{courierResult.history}</div>
                             </div>
                          </div>
                        ) : (
                          <div className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-center">
                             <ShieldAlert className="w-8 h-8 text-slate-200 mb-2" />
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Verify history</p>
                          </div>
                        )}

                        {userRole === 'admin' && (
                          <div className="grid grid-cols-1 gap-6">
                             <button disabled={!!courierLoading || !state.steadfast.isEnabled} onClick={() => handleDispatch('steadfast')} className="w-full py-5 bg-rose-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-30">
                                {courierLoading === 'steadfast' ? <RefreshCw className="animate-spin w-4 h-4"/> : <Send className="w-4 h-4"/>} Dispatch Steadfast
                             </button>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
             </div>

             <div className="px-16 py-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 no-print bg-white/50 backdrop-blur-md">
                <div className="flex gap-4">
                   <button onClick={() => handlePrint('invoice')} className="px-12 py-6 border-2 border-slate-900 rounded-full font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-6 hover:bg-slate-950 hover:text-white transition-all">
                      <Printer className="w-6 h-6" /> Invoice
                   </button>
                </div>
                <div className="flex items-center gap-4">
                   {selectedOrder.status === 'pending' && userRole !== 'packaging' ? (
                     <button onClick={() => handleConfirmOrder(selectedOrder)} className="px-20 py-6 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-[0.5em] hover:bg-emerald-700 transition-all shadow-2xl flex items-center justify-center gap-3">
                        <CheckCircle className="w-5 h-5"/> OK / Confirm Order
                     </button>
                   ) : (
                     <button onClick={() => setSelectedOrder(null)} className="px-20 py-6 bg-slate-950 text-white rounded-full font-black text-xs uppercase tracking-[0.5em] hover:bg-rose-600 transition-all shadow-2xl flex items-center justify-center gap-3">
                        <Check className="w-5 h-5"/> OK / Done
                     </button>
                   )}
                </div>
             </div>

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
                    <div className="grid grid-cols-2 gap-24 mb-24 text-slate-900 font-bold uppercase">
                       <div>
                          <p className="text-[11px] font-black text-slate-400 mb-4">Constituent Target</p>
                          <p className="text-3xl">{selectedOrder.customerName}</p>
                          <p className="text-xl">{selectedOrder.customerPhone}</p>
                          <p className="mt-6 text-base italic">{selectedOrder.shippingAddress}</p>
                       </div>
                    </div>
                    <table className="w-full mb-24 border-collapse">
                       <thead><tr className="border-b-4 border-slate-950"><th className="py-8 text-left uppercase">Asset Classification</th><th className="py-8 text-center uppercase">Quantity</th><th className="py-8 text-right uppercase">Unit Liability</th><th className="py-8 text-right uppercase">Total Liability</th></tr></thead>
                       <tbody className="divide-y-2 divide-slate-100">
                          {selectedOrder.items.map((item, idx) => (
                            <tr key={idx}><td className="py-10 text-lg uppercase">{state.products.find(p => p.id === item.productId)?.name}</td><td className="py-10 text-center text-xl">{item.quantity}</td><td className="py-10 text-right">{item.price}৳</td><td className="py-10 text-right text-xl">{item.price * item.quantity}৳</td></tr>
                          ))}
                       </tbody>
                    </table>
                    <div className="flex justify-end pt-12 border-t-4 border-slate-950">
                       <p className="text-7xl font-black tracking-tighter">{selectedOrder.total.toLocaleString()}৳</p>
                    </div>
                  </div>
                ) : null}
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
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

export default AdminDashboard;
