
import React, { useState, useMemo, useEffect } from 'react';
import { AppState, CourierStats, Order, IncompleteOrder, UserRole, User as UserType } from '../types';
import { 
  Calculator, ShoppingBag, UserCheck, Package, FolderTree, 
  Wallet, Users, Palette, PanelTop, Layout, Settings, 
  Clock, Receipt, AlertCircle, TrendingUp, Printer, ShieldAlert, Cpu, CheckCircle2, XCircle, Edit, FileText, Download, Save, PhoneCall, CheckCircle, Ban, Truck, Search, Filter, Eye, Globe, Trash2, Send, ExternalLink,
  BarChart3, RefreshCw, ChevronRight, MoreHorizontal, User, MapPin, CreditCard, Hash, Check, Scissors, SearchCode, CheckSquare, Square, Menu as MenuIcon, FileEdit, Zap, ListChecks, Heart, Contact, UserCog, Mail, Navigation, Star, Fingerprint, LocateFixed, MessageSquare
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
import DeliveryDispatch from '../components/admin/DeliveryDispatch';
import LiveSupportModule from '../components/admin/LiveSupportModule';

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
  const [customerFilter, setCustomerFilter] = useState<'all' | 'purchasers' | 'browsers'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<UserType | null>(null);
  const [courierLoading, setCourierLoading] = useState<string | null>(null);
  const [courierResult, setCourierResult] = useState<CourierStats | null>(null);
  const [isCheckingCourier, setIsCheckingCourier] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [printMode, setPrintMode] = useState<'invoice' | 'manifest'>('invoice');

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const [leadScores, setLeadScores] = useState<Record<string, CourierStats>>({});
  const [loadingScores, setLoadingScores] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCourierResult(null);
  }, [selectedOrder?.id]);

  const businessStats = useMemo(() => {
    const revenue = state.orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + (o.total || 0), 0);
    const expenses = state.expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const totalOrders = state.orders.length;
    const pendingOrders = state.orders.filter(o => o.status === 'pending').length;
    const inventoryCount = state.products.length;
    const customerCount = state.customers.length;
    
    return { revenue, expenses, profit: revenue - expenses, totalOrders, pendingOrders, inventoryCount, customerCount };
  }, [state]);

  const filteredOrders = useMemo(() => {
    let result = state.orders;
    if (orderFilter !== 'all') result = result.filter(o => o.status === orderFilter);
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      result = result.filter(o => o.id.toLowerCase().includes(q) || o.customerPhone.includes(q) || o.customerName.toLowerCase().includes(q));
    }
    return result;
  }, [state.orders, orderFilter, orderSearch]);

  const unifiedCustomers = useMemo(() => {
    const list = [...state.customers];
    state.orders.forEach(order => {
      const exists = list.some(c => c.phone === order.customerPhone || (order.customerEmail && c.email === order.customerEmail));
      if (!exists) {
        list.push({
          id: 'GUEST-' + order.customerPhone,
          name: order.customerName,
          phone: order.customerPhone,
          email: order.customerEmail,
          role: 'customer',
          createdAt: order.createdAt
        });
      }
    });
    return list;
  }, [state.customers, state.orders]);

  const getCustomerStats = (customer: UserType) => {
    const customerOrders = state.orders.filter(o => 
      o.customerId === customer.id || 
      (customer.phone && o.customerPhone === customer.phone) ||
      (customer.email && o.customerEmail === customer.email)
    );
    const totalSpent = customerOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
    return { orderCount: customerOrders.length, totalSpent };
  };

  const filteredCustomers = useMemo(() => {
    let result = unifiedCustomers;
    if (customerFilter === 'purchasers') result = result.filter(c => getCustomerStats(c).orderCount > 0);
    else if (customerFilter === 'browsers') result = result.filter(c => getCustomerStats(c).orderCount === 0);
    if (customerSearch) {
      const q = customerSearch.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || (c.email && c.email.toLowerCase().includes(q)) || (c.phone && c.phone.includes(q)));
    }
    return result;
  }, [unifiedCustomers, state.orders, customerSearch, customerFilter]);

  const toggleSelectOrder = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedOrderIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) setSelectedOrderIds([]);
    else setSelectedOrderIds(filteredOrders.map(o => o.id));
  };

  const handleBulkStatusUpdate = (newStatus: Order['status']) => {
    if (selectedOrderIds.length === 0) return;
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => selectedOrderIds.includes(o.id) ? { ...o, status: newStatus } : o)
    }));
    setSelectedOrderIds([]);
    alert(`Bulk update successful: ${selectedOrderIds.length} orders moved to ${newStatus}`);
  };

  const handleBulkDispatch = async (courier: 'steadfast' | 'pathao' | 'local') => {
    if (isBulkProcessing || selectedOrderIds.length === 0) return;
    
    if (!confirm(`Deploy logistics for ${selectedOrderIds.length} selected entities?`)) return;

    const ordersToDispatch = state.orders.filter(o => selectedOrderIds.includes(o.id));
    setIsBulkProcessing(true);
    
    let successCount = 0;
    let failCount = 0;

    for (const order of ordersToDispatch) {
      try {
        let result;
        if (courier === 'steadfast' && state.steadfast.isEnabled) {
          result = await dispatchToSteadfast(order, state.steadfast);
        } else if (courier === 'pathao' && state.pathao.isEnabled) {
          result = await dispatchToPathao(order, state.pathao);
        } else {
          result = { success: true, message: 'Status updated locally' };
        }
        
        if (result.success) {
          successCount++;
          // Progressive update to UI
          setState(prev => ({
            ...prev,
            orders: prev.orders.map(o => o.id === order.id ? { ...o, status: 'shipped' as const } : o)
          }));
        } else {
          failCount++;
        }
      } catch (e) {
        failCount++;
        console.error(`Dispatch error for ${order.id}:`, e);
      }
    }

    setIsBulkProcessing(false);
    setSelectedOrderIds([]);
    alert(`Bulk Routing Finalized.\n\nValidated Successful: ${successCount}\nRouting Anomalies: ${failCount}`);
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

  const checkLeadScore = async (leadId: string, phone: string) => {
    setLoadingScores(prev => ({ ...prev, [leadId]: true }));
    try {
      const data = await checkCustomerReliability(phone);
      if (data) {
        setLeadScores(prev => ({ ...prev, [leadId]: data }));
      }
    } catch (err) {
    } finally {
      setLoadingScores(prev => ({ ...prev, [leadId]: false }));
    }
  };

  const handleConfirmLead = (lead: IncompleteOrder) => {
    const address = lead.shippingAddress || prompt("Enter shipping address for this order:");
    if (address === null) return;
    
    const deliveryCharge = 60;
    const subtotal = lead.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    
    const newOrder: Order = {
      id: lead.id.replace('DRAFT-', '') || Math.random().toString(36).substr(2, 6).toUpperCase(),
      customerName: lead.customerName,
      customerPhone: lead.customerPhone,
      items: lead.items,
      subtotal: subtotal,
      deliveryCharge: deliveryCharge,
      total: subtotal + deliveryCharge,
      status: 'processing',
      createdAt: new Date().toISOString(),
      shippingAddress: address || 'No Address Provided'
    };

    setState(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      incompleteOrders: prev.incompleteOrders.filter(l => l.id !== lead.id)
    }));
    
    alert("Lead confirmed and converted to Order!");
  };

  const handlePrintInvoice = () => {
    setPrintMode('invoice');
    setTimeout(() => {
      window.print();
    }, 500);
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

  const handleSaveCustomer = () => {
    if (!editingCustomer) return;
    setState(prev => {
      const isGuest = editingCustomer.id.startsWith('GUEST-');
      let newCustomers = [...prev.customers];
      if (isGuest) {
        newCustomers.push({ ...editingCustomer, id: 'C-' + Math.random().toString(36).substr(2, 6).toUpperCase() });
      } else {
        newCustomers = newCustomers.map(c => c.id === editingCustomer.id ? editingCustomer : c);
      }
      const newOrders = prev.orders.map(o => o.customerPhone === editingCustomer.phone ? { ...o, customerName: editingCustomer.name, customerEmail: editingCustomer.email } : o);
      return { ...prev, customers: newCustomers, orders: newOrders };
    });
    setEditingCustomer(null);
    alert('Member profile updated successfully.');
  };

  const handleConfirmOrder = (order: Order) => {
    const updated = { ...order, status: 'processing' as const };
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === order.id ? updated : o)
    }));
    setSelectedOrder(null);
  };

  const navGroups = useMemo(() => {
    const groups = [
      { label: 'Strategy', roles: ['admin'], items: [{ id: 'dashboard', label: 'Admin Overview', icon: BarChart3 }] },
      { label: 'Operations', roles: ['admin', 'call_center', 'support_agent'], items: [
        { id: 'pos', label: 'POS Terminal', icon: Calculator, roles: ['admin'] },
        { id: 'support', label: 'Live Support', icon: MessageSquare, count: state.chatSessions.filter(s => s.status === 'open').length },
        { id: 'orders', label: 'Order Stream', icon: ShoppingBag, count: state.orders.length },
        { id: 'leads', label: 'Lead Recovery', icon: UserCheck, count: state.incompleteOrders.length },
        { id: 'dispatch', label: 'Delivery Dispatch', icon: Truck, count: state.orders.filter(o => o.status === 'processing').length },
        { id: 'courier-checker', label: 'Courier Checker', icon: SearchCode },
      ]},
      { label: 'Collective', roles: ['admin'], items: [
        { id: 'customers', label: 'Customer CRM', icon: Contact, count: unifiedCustomers.length },
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
      { label: 'Intelligence', roles: ['admin'], items: [
        { id: 'categories', label: 'Collections', icon: FolderTree },
        { id: 'accounts', label: 'Financials', icon: Wallet },
        { id: 'hrm', label: 'Personnel & Access', icon: Users },
        { id: 'integrations', label: 'Integrations', icon: Cpu },
      ]}
    ];

    return groups.filter(g => g.roles.includes(userRole)).map(g => ({
      ...g,
      items: g.items.filter(i => !i.roles || i.roles.includes(userRole))
    }));
  }, [userRole, state.orders.length, state.incompleteOrders.length, unifiedCustomers.length, state.orders.filter(o => o.status === 'processing').length, state.chatSessions]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter selection:bg-rose-100 selection:text-rose-900">
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
                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black">{state.currentUser?.name?.charAt(0)}</div>
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
                    { label: 'Database Entities', value: unifiedCustomers.length, icon: Contact, sub: 'Unified Reach', color: 'text-rose-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                      <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><stat.icon className="w-32 h-32" /></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">{stat.label}</p>
                      <h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{stat.value}</h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${stat.color}`}>{stat.sub}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'support' && <LiveSupportModule state={state} setState={setState} />}
          {activeTab === 'dispatch' && <DeliveryDispatch state={state} setState={setState} />}
          {activeTab === 'leads' && (
             <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                   <div>
                      <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Abandoned Intelligence</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">High-intent prospects who exited the checkout flow</p>
                   </div>
                   <div className="bg-rose-50 px-6 py-3 rounded-2xl border border-rose-100 flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{state.incompleteOrders.length} Potential Recoveries</span>
                   </div>
                </div>

                <div className="bg-white rounded-[4rem] border border-slate-100 overflow-hidden shadow-sm">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <th className="px-10 py-8">Prospect Identity</th>
                            <th className="px-10 py-8">Courier Score</th>
                            <th className="px-10 py-8">Abandoned Assets</th>
                            <th className="px-10 py-8">Last Seen</th>
                            <th className="px-10 py-8 text-right">Recovery Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {state.incompleteOrders.map(lead => (
                           <tr key={lead.id} className="hover:bg-slate-50/50 transition-all group">
                              <td className="px-10 py-8">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">?</div>
                                    <div>
                                       <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{lead.customerName}</p>
                                       <div className="flex items-center gap-2 mt-1">
                                          <p className="text-[11px] font-black text-rose-600 flex items-center gap-2">
                                             <PhoneCall className="w-3 h-3" /> {lead.customerPhone}
                                          </p>
                                          <button onClick={() => checkLeadScore(lead.id, lead.customerPhone)} className="p-1 hover:bg-slate-100 rounded transition-all">
                                             {loadingScores[lead.id] ? <RefreshCw className="w-3 h-3 animate-spin text-slate-400" /> : <SearchCode className="w-3 h-3 text-slate-300" />}
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-8">
                                 {leadScores[lead.id] ? (
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${leadScores[lead.id].isRisk ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                       {leadScores[lead.id].isRisk ? <Ban className="w-3 h-3"/> : <CheckCircle className="w-3 h-3"/>}
                                       <span className="text-[10px] font-black uppercase">{Math.round(leadScores[lead.id].successRate)}% Rate</span>
                                    </div>
                                 ) : (
                                    <span className="text-[10px] font-bold text-slate-300 uppercase italic">Not Scanned</span>
                                 )}
                              </td>
                              <td className="px-10 py-8">
                                 <div className="flex flex-wrap gap-2">
                                    {lead.items.map((it, i) => (
                                       <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200">
                                          {state.products.find(p => p.id === it.productId)?.name || 'Asset'} (x{it.quantity})
                                       </span>
                                    ))}
                                 </div>
                              </td>
                              <td className="px-10 py-8">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(lead.createdAt).toLocaleString()}</p>
                              </td>
                              <td className="px-10 py-8 text-right">
                                 <div className="flex justify-end gap-3">
                                    <button 
                                      onClick={() => handleConfirmLead(lead)}
                                      title="Confirm Order"
                                      className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg"
                                    >
                                       <CheckCircle className="w-4 h-4"/>
                                    </button>
                                    <a 
                                      href={`tel:${lead.customerPhone}`}
                                      className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg"
                                    >
                                       <PhoneCall className="w-4 h-4"/>
                                    </a>
                                    <button 
                                      onClick={() => setState(prev => ({ ...prev, incompleteOrders: prev.incompleteOrders.filter(l => l.id !== lead.id) }))}
                                      className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"
                                    >
                                       <Trash2 className="w-4 h-4"/>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                   {state.incompleteOrders.length === 0 && (
                      <div className="py-32 text-center">
                         <UserCheck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">No abandoned sessions detected</p>
                      </div>
                   )}
                </div>
             </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                 <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                    <button onClick={() => setCustomerFilter('all')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${customerFilter === 'all' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-900'}`}>All Unified</button>
                    <button onClick={() => setCustomerFilter('purchasers')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${customerFilter === 'purchasers' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-900'}`}>Purchasers</button>
                    <button onClick={() => setCustomerFilter('browsers')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${customerFilter === 'browsers' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-900'}`}>Accounts Only</button>
                 </div>
                 <div className="relative w-full lg:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      className="w-full pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-3xl text-[11px] font-black uppercase outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all shadow-sm" 
                      placeholder="Search CRM Database..." 
                      value={customerSearch}
                      onChange={e => setCustomerSearch(e.target.value)}
                    />
                 </div>
              </div>

              <div className="bg-white rounded-[4rem] border border-slate-100 overflow-hidden shadow-sm">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                          <th className="px-10 py-8">Entity Identity</th>
                          <th className="px-10 py-8">Contact Nodes</th>
                          <th className="px-10 py-8 text-center">Lifetime Engagement</th>
                          <th className="px-10 py-8">First Discovered</th>
                          <th className="px-10 py-8 text-right">Master Control</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredCustomers.map(c => {
                         const stats = getCustomerStats(c);
                         const isGuest = c.id.startsWith('GUEST-');
                         return (
                           <tr key={c.id} className="hover:bg-slate-50/50 transition-all group">
                              <td className="px-10 py-8">
                                 <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm ${isGuest ? 'bg-slate-100 text-slate-400' : 'bg-rose-50 text-rose-600'}`}>{c.name.charAt(0)}</div>
                                    <div>
                                       <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{c.name}</p>
                                       <div className="flex items-center gap-2 mt-1">
                                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Type: {isGuest ? 'Guest Entry' : 'Verified Member'}</p>
                                          {stats.orderCount > 0 && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-lg">Purchaser</span>}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-8">
                                 <div className="space-y-1">
                                    {c.email && <div className="flex items-center gap-2 text-xs font-black text-slate-600"><Mail className="w-3.5 h-3.5 text-slate-300"/> {c.email}</div>}
                                    <div className="flex items-center gap-2 text-xs font-black text-rose-600"><PhoneCall className="w-3.5 h-3.5 text-rose-300"/> {c.phone}</div>
                                 </div>
                              </td>
                              <td className="px-10 py-8 text-center">
                                 <div className="inline-flex flex-col items-center">
                                    <p className="text-lg font-black text-slate-900 tracking-tighter">{stats.orderCount} Orders</p>
                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">LTV: {stats.totalSpent.toLocaleString()}৳</p>
                                 </div>
                              </td>
                              <td className="px-10 py-8">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</p>
                              </td>
                              <td className="px-10 py-8 text-right">
                                 <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => setEditingCustomer(c)} className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg"><UserCog className="w-4 h-4"/></button>
                                 </div>
                              </td>
                           </tr>
                         );
                       })}
                    </tbody>
                 </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
             <div className="space-y-10 animate-in fade-in duration-500 pb-32">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                   <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/50 rounded-3xl w-fit">
                     {['all', 'pending', 'processing', 'call_not_received', 'shipped', 'delivered', 'cancelled'].map(f => (
                       <button key={f} onClick={() => setOrderFilter(f)} className={`px-8 py-3.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${orderFilter === f ? `bg-white text-rose-600 shadow-md` : `text-slate-400 hover:text-slate-900`}`}>
                         {f === 'all' ? 'Master Log' : statusMap[f]?.label || f} <span className="ml-2 opacity-40">{f === 'all' ? state.orders.length : state.orders.filter(o => o.status === f).length}</span>
                       </button>
                     ))}
                   </div>
                   <div className="relative group w-full lg:w-96">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input className="w-full pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-[1.8rem] text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all shadow-sm" placeholder="Search Transactions..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
                   </div>
                </div>

                <div className="bg-white rounded-[4rem] border border-slate-100 overflow-hidden shadow-sm">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50/80 text-[10px] font-black uppercase text-slate-400 tracking-[0.25em]">
                            <th className="px-6 py-8 text-center"><button onClick={toggleSelectAll}>{selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0 ? <CheckSquare className="text-rose-600 w-5 h-5"/> : <Square className="w-5 h-5 text-slate-300"/>}</button></th>
                            <th className="px-8 py-8">Reference</th>
                            <th className="px-8 py-8">Identity</th>
                            <th className="px-8 py-8">Liability</th>
                            <th className="px-8 py-8">Execution</th>
                            <th className="px-12 py-8 text-right">Control</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {filteredOrders.map(o => (
                           <tr key={o.id} className={`hover:bg-slate-50/40 transition-all group ${selectedOrderIds.includes(o.id) ? 'bg-rose-50/30' : ''}`}>
                              <td className="px-6 py-10 text-center"><button onClick={(e) => toggleSelectOrder(o.id, e)}>{selectedOrderIds.includes(o.id) ? <CheckSquare className="text-rose-600 w-5 h-5"/> : <Square className="w-5 h-5 text-slate-300"/></button></td>
                              <td className="px-8 py-10"><div><p className="text-[11px] font-black text-slate-900 tracking-tight">#{o.id}</p><p className="text-[9px] font-black text-slate-400 uppercase mt-1">{new Date(o.createdAt).toLocaleDateString()}</p></div></td>
                              <td className="px-8 py-10"><p className="text-[13px] font-black uppercase text-slate-900">{o.customerName}</p><p className="text-[11px] font-black text-rose-600 mt-1 flex items-center gap-2 cursor-pointer"><PhoneCall className="w-3 h-3" /> {o.customerPhone}</p></td>
                              <td className="px-8 py-10"><p className="text-xl font-black text-slate-950 tracking-tighter">{(o.total || 0).toLocaleString()}৳</p></td>
                              <td className="px-8 py-10"><span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 ring-1 ${statusMap[o.status]?.color} ${statusMap[o.status]?.ring}`}>{statusMap[o.status]?.label || o.status}</span></td>
                              <td className="px-12 py-10 text-right"><button onClick={() => setSelectedOrder(o)} className="w-12 h-12 bg-white text-slate-900 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Eye className="w-5 h-5"/></button></td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                {/* BULK ACTION BAR */}
                {selectedOrderIds.length > 0 && (
                  <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-950/95 backdrop-blur-2xl px-10 py-6 rounded-[3rem] border border-white/10 shadow-2xl flex items-center gap-10 animate-in slide-in-from-bottom-10">
                    <div className="flex items-center gap-4 border-r border-white/10 pr-10">
                      <div className="w-10 h-10 bg-rose-600 text-white rounded-2xl flex items-center justify-center font-black text-sm">{selectedOrderIds.length}</div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Bulk Actions</p>
                    </div>
                    
                    <div className="flex gap-2">
                       <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 mr-4">
                         {['processing', 'shipped', 'delivered', 'cancelled'].map(st => (
                           <button key={st} onClick={() => handleBulkStatusUpdate(st as any)} className="px-5 py-2.5 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">{statusMap[st]?.label}</button>
                         ))}
                       </div>
                       
                       <button 
                         disabled={isBulkProcessing} 
                         onClick={() => handleBulkDispatch(state.steadfast.isEnabled ? 'steadfast' : state.pathao.isEnabled ? 'pathao' : 'local')} 
                         className="px-6 py-3 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-2 disabled:opacity-30"
                       >
                         {isBulkProcessing ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Send className="w-3 h-3"/>} 
                         {state.steadfast.isEnabled ? 'Bulk SF Dispatch' : state.pathao.isEnabled ? 'Bulk PH Dispatch' : 'Bulk Ship Local'}
                       </button>
                    </div>

                    <button onClick={() => setSelectedOrderIds([])} className="p-3 text-slate-500 hover:text-white"><XCircle className="w-6 h-6"/></button>
                  </div>
                )}
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
        </div>
      </main>

      {/* PRINT CONTAINERS (Hidden in UI, Shown in @media print) */}
      <div className="hidden print:block absolute inset-0 bg-white" id="master-print-target">
         {selectedOrder && printMode === 'invoice' && (
             <div className="p-20 w-full text-slate-900 font-sans">
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
                    <p className="text-[11px] font-black text-slate-400 mb-4 tracking-widest">Constituent Target</p>
                    <p className="text-3xl font-black">{selectedOrder.customerName}</p>
                    <p className="text-xl font-bold">{selectedOrder.customerPhone}</p>
                    <p className="mt-6 text-base italic leading-relaxed">{selectedOrder.shippingAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black text-slate-400 mb-4 tracking-widest">Issuance Node</p>
                    <p className="text-xl font-black">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    <p className="text-xl font-black">{new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>

                <table className="w-full mb-24 border-collapse">
                  <thead>
                    <tr className="border-b-4 border-slate-950 text-[10px] font-black uppercase tracking-widest">
                      <th className="py-8 text-left uppercase">Asset Classification</th>
                      <th className="py-8 text-center uppercase">Quantity</th>
                      <th className="py-8 text-right uppercase">Unit Liability</th>
                      <th className="py-8 text-right uppercase">Total Liability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="font-bold uppercase">
                        <td className="py-10 text-lg">{state.products.find(p => p.id === item.productId)?.name || 'Premium Asset'}</td>
                        <td className="py-10 text-center text-xl">{item.quantity}</td>
                        <td className="py-10 text-right">{item.price.toLocaleString()}৳</td>
                        <td className="py-10 text-right text-xl font-black">{(item.price * item.quantity).toLocaleString()}৳</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end pt-12 border-t-4 border-slate-950">
                  <div className="text-right">
                    <p className="text-xs font-black uppercase text-slate-400 tracking-[0.5em] mb-4">Final Settlement</p>
                    <p className="text-7xl font-black tracking-tighter">{selectedOrder.total.toLocaleString()}৳</p>
                  </div>
                </div>

                <div className="mt-48 text-center border-t-2 border-slate-100 pt-12">
                   <p className="text-[9px] font-black uppercase tracking-[0.8em] text-slate-300 italic">Authenticity Guaranteed by Upohar Luxe Matrix</p>
                </div>
             </div>
         )}
      </div>

      {/* MODALS (Order Card) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-8 overflow-hidden no-print">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white w-full max-w-7xl h-full md:h-auto md:max-h-[95vh] rounded-none md:rounded-[4.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in slide-in-from-bottom duration-500 flex flex-col border border-white/10">
             
             <div className="flex justify-between items-center px-12 md:px-16 py-8 md:py-12 border-b border-slate-50 bg-white/50 backdrop-blur-md sticky top-0 z-[10]">
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
                   <button onClick={handlePrintInvoice} className="px-4 md:px-8 py-3 md:py-4 bg-emerald-600 text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-2 md:gap-3 hover:bg-emerald-700 transition-all shadow-lg active:scale-95"><Printer className="w-4 h-4 md:w-5 md:h-5"/> <span className="hidden sm:inline">Print Invoice</span></button>
                   <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 md:w-14 md:h-14 bg-rose-50 rounded-xl md:rounded-2xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"><XCircle className="w-5 h-5 md:w-6 md:h-6"/></button>
                </div>
             </div>

             <div className="flex-grow overflow-y-auto scrollbar-hide p-12 md:p-16">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3"><User className="w-5 h-5 text-rose-600" /><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Entity Data Log</h4></div>
                        <div className="grid grid-cols-1 gap-6">
                           <div className="group space-y-2"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Recipient Identity</label><input disabled={userRole === 'packaging'} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] font-black text-sm outline-none" value={selectedOrder.customerName} onChange={e => handleUpdateOrder({ customerName: e.target.value })} /></div>
                           <div className="group space-y-2"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Digital Comms (Phone)</label><div className="flex gap-3"><input disabled={userRole === 'packaging'} className="flex-grow px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] font-black text-sm outline-none" value={selectedOrder.customerPhone} onChange={e => handleUpdateOrder({ customerPhone: e.target.value })} /><button onClick={() => handleCourierCheck(selectedOrder.customerPhone)} className="w-16 bg-slate-950 text-white rounded-[1.5rem] flex items-center justify-center transition-all hover:bg-rose-600">{isCheckingCourier ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}</button></div></div>
                           <div className="group space-y-2"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Shipping Destination</label><textarea disabled={userRole === 'packaging'} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-black text-sm outline-none h-40 resize-none" value={selectedOrder.shippingAddress} onChange={e => handleUpdateOrder({ shippingAddress: e.target.value })} /></div>
                        </div>
                     </div>

                     {/* DIGITAL METADATA SECTION */}
                     <div className="space-y-6 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-3"><Fingerprint className="w-5 h-5 text-rose-600" /><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Digital Metadata</h4></div>
                        <div className="space-y-4">
                           <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                              <div>
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Origin IP Node</p>
                                 <p className="text-sm font-black text-slate-900">{selectedOrder.ipAddress || 'Not Captured'}</p>
                              </div>
                              <Globe className="w-6 h-6 text-slate-200" />
                           </div>
                           {selectedOrder.location && (
                              <a 
                                href={`https://www.google.com/maps?q=${selectedOrder.location.lat},${selectedOrder.location.lng}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center justify-between hover:bg-emerald-100 transition-all group"
                              >
                                 <div>
                                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Geo-Location Terminal</p>
                                    <p className="text-sm font-black text-emerald-900">{selectedOrder.location.lat.toFixed(4)}, {selectedOrder.location.lng.toFixed(4)}</p>
                                 </div>
                                 <LocateFixed className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                              </a>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-12 lg:border-x lg:border-slate-50 lg:px-16">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3"><Hash className="w-5 h-5 text-rose-600" /><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Asset Breakdown (Packing List)</h4></div>
                        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Package className="w-24 h-24" /></div>
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
                                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Subtotal</span><span>{(selectedOrder.total - (selectedOrder.deliveryCharge || 0)).toLocaleString()}৳</span></div>
                                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Logistics</span><span>+{selectedOrder.deliveryCharge?.toLocaleString()}৳</span></div>
                                 <div className="mt-4 flex justify-between items-center">
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500">Total Liability</span>
                                    <span className="text-3xl font-black text-white tracking-tighter">{selectedOrder.total.toLocaleString()}৳</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-2"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Operational State</label><select disabled={userRole === 'packaging'} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] font-black text-sm outline-none appearance-none cursor-pointer" value={selectedOrder.status} onChange={e => handleUpdateOrder({ status: e.target.value as any })}>{Object.keys(statusMap).map(key => <option key={key} value={key}>{statusMap[key].label}</option>)}</select></div>
                     </div>
                  </div>
                  
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3"><Truck className="w-5 h-5 text-rose-600" /><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Logistics Integration</h4></div>
                        {courierResult ? (<div className={`p-10 rounded-[3rem] border animate-in slide-in-from-top-4 duration-500 relative overflow-hidden group ${courierResult.isRisk ? 'bg-rose-950 text-rose-100 border-rose-800 shadow-2xl shadow-rose-900/40' : 'bg-emerald-950 text-emerald-100 border-emerald-800 shadow-2xl shadow-emerald-900/40'}`}><div className="absolute top-0 right-0 p-8 opacity-10"><ShieldAlert className="w-32 h-32" /></div><div className="relative z-10"><h5 className="text-4xl font-black tracking-tighter mt-1">{Math.round(courierResult.successRate)}% Trust</h5><div className="p-4 bg-white/5 rounded-2xl text-[9px] font-bold leading-relaxed italic opacity-80 mb-4">{courierResult.history}</div></div></div>) : (<div className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-center"><ShieldAlert className="w-8 h-8 text-slate-200 mb-2" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Verify history</p></div>)}
                        {userRole === 'admin' && (<div className="grid grid-cols-1 gap-6"><button disabled={!!courierLoading || !state.steadfast.isEnabled} onClick={() => handleDispatch('steadfast')} className="w-full py-5 bg-rose-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-30">{courierLoading === 'steadfast' ? <RefreshCw className="animate-spin w-4 h-4"/> : <Send className="w-4 h-4"/>} Dispatch Steadfast</button></div>)}
                     </div>
                  </div>
               </div>
             </div>

             <div className="px-16 py-10 border-t border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
                <button onClick={handlePrintInvoice} className="px-12 py-6 border-2 border-slate-900 rounded-full font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-6 hover:bg-slate-950 hover:text-white transition-all"><Printer className="w-6 h-6" /> Invoice</button>
                {selectedOrder.status === 'pending' && userRole !== 'packaging' ? (
                  <button onClick={() => handleConfirmOrder(selectedOrder)} className="px-20 py-6 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-[0.5em] hover:bg-emerald-700 transition-all shadow-2xl flex items-center justify-center gap-3"><CheckCircle className="w-5 h-5"/> OK / Confirm Order</button>
                ) : (
                  <button onClick={() => setSelectedOrder(null)} className="px-20 py-6 bg-slate-950 text-white rounded-full font-black text-xs uppercase tracking-[0.5em] hover:bg-rose-600 transition-all shadow-2xl flex items-center justify-center gap-3"><Check className="w-5 h-5"/> OK / Done</button>
                )}
             </div>
          </div>
        </div>
      )}

      {/* GLOBAL PRINT CSS ENGINE */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Force hide all standard UI elements */
          body * { display: none !important; }
          html, body { background: white !important; padding: 0 !important; margin: 0 !important; }
          
          /* Show specifically targeted print containers */
          #master-print-target, #master-print-target *,
          .manifest-print-area, .manifest-print-area *,
          #dispatch-print-engine, #dispatch-print-engine * {
            display: block !important;
            visibility: visible !important; 
          }

          /* Correct positioning for print */
          #master-print-target, .manifest-print-area, #dispatch-print-engine {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            z-index: 9999999 !important;
          }

          /* Ensure table rows don't break mid-air */
          tr { page-break-inside: avoid !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          
          /* Specific typography for print */
          .font-black { font-weight: 900 !important; }
          .uppercase { text-transform: uppercase !important; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

export default AdminDashboard;
