
import React, { useState, useEffect } from 'react';
import { Order, Product } from '../types';
import { 
  Search, Package, CheckCircle, Truck, MapPin, 
  ShoppingBag, Clock, ArrowRight, ShieldCheck, 
  Phone, Hash, AlertCircle, Calendar, ChevronRight
} from 'lucide-react';

interface OrderTrackingPageProps {
  orders: Order[];
  products: Product[];
  initialOrderId?: string | null;
}

const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ orders, products, initialOrderId }) => {
  const [searchId, setSearchId] = useState(initialOrderId || '');
  const [searchPhone, setSearchPhone] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialOrderId) {
      const order = orders.find(o => o.id === initialOrderId);
      if (order) setTrackedOrder(order);
    }
  }, [initialOrderId, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const order = orders.find(o => 
      o.id.toUpperCase() === searchId.toUpperCase() && 
      o.customerPhone.includes(searchPhone)
    );

    if (order) {
      setTrackedOrder(order);
    } else {
      setError('No order found with these credentials. Please check your Reference ID and Phone.');
      setTrackedOrder(null);
    }
  };

  const steps = [
    { status: 'pending', label: 'Order Placed', icon: ShoppingBag, desc: 'We have received your order request.' },
    { status: 'processing', label: 'Confirmed', icon: CheckCircle, desc: 'Our concierge has verified and accepted your order.' },
    { status: 'shipped', label: 'Dispatched', icon: Truck, desc: 'Your gift has been handed over to our courier partner.' },
    { status: 'delivered', label: 'Delivered', icon: ShieldCheck, desc: 'The masterpiece has reached its destination.' }
  ];

  const getStatusIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    if (status === 'delivered') return 3;
    if (status === 'shipped') return 2;
    if (status === 'processing') return 1;
    return 0; // pending
  };

  const currentIndex = trackedOrder ? getStatusIndex(trackedOrder.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Search Section */}
        {!trackedOrder && (
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <Search className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight uppercase">Track Your Masterpiece</h1>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">Enter your credentials to monitor progress</p>
            </div>

            <form onSubmit={handleSearch} className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  required
                  placeholder="ORDER ID (E.G. A1B2C3)" 
                  className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all uppercase"
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  required
                  placeholder="MOBILE NUMBER" 
                  className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all"
                  value={searchPhone}
                  onChange={e => setSearchPhone(e.target.value)}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-widest bg-rose-50 p-4 rounded-xl">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}
              <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-rose-600 transition-all active:scale-95">
                Retrieve Status <ArrowRight className="ml-2 w-4 h-4 inline" />
              </button>
            </form>
          </div>
        )}

        {/* Tracking Result View */}
        {trackedOrder && (
          <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
            <button 
              onClick={() => setTrackedOrder(null)} 
              className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Search
            </button>

            {/* Header Status Card */}
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10"></div>
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-4 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-100">
                      Order {trackedOrder.status}
                    </span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                      Ref: #{trackedOrder.id}
                    </span>
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-slate-900">Hello, {trackedOrder.customerName}</h2>
                  <p className="text-slate-400 text-sm font-medium mt-1">Your order is currently in the <span className="text-rose-600 font-black uppercase tracking-widest text-[10px]">{trackedOrder.status}</span> stage.</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected Liability</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">{trackedOrder.total.toLocaleString()}৳</p>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="mt-16 relative">
                {trackedOrder.status === 'cancelled' ? (
                  <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl flex items-center gap-6 text-rose-600">
                    <AlertCircle className="w-12 h-12" />
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-tight">Order Cancelled</h4>
                      <p className="text-sm font-medium opacity-80">This transaction has been terminated. Please contact concierge for details.</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex justify-between items-start">
                    {/* Line */}
                    <div className="absolute top-6 left-0 right-0 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-600 transition-all duration-1000 ease-out" 
                        style={{ width: `${(currentIndex / 3) * 100}%` }}
                      ></div>
                    </div>

                    {steps.map((step, idx) => {
                      const isActive = idx <= currentIndex;
                      const isCompleted = idx < currentIndex;
                      const isCurrent = idx === currentIndex;

                      return (
                        <div key={idx} className="relative z-10 flex flex-col items-center group w-1/4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-white shadow-xl ${isActive ? 'bg-rose-600 text-white scale-110' : 'bg-slate-100 text-slate-300'}`}>
                            <step.icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                          </div>
                          <div className="text-center mt-6 px-2">
                             <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>{step.label}</p>
                             <p className={`text-[9px] font-bold leading-relaxed hidden md:block ${isActive ? 'text-slate-400' : 'text-slate-200'}`}>{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Items Summary */}
              <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-3">
                  <Package className="w-5 h-5 text-rose-600" /> Manifest Breakdown
                </h3>
                <div className="space-y-4">
                  {trackedOrder.items.map((item, i) => {
                    const p = products.find(prod => prod.id === item.productId);
                    return (
                      <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                        <img src={p?.image} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                        <div className="flex-grow">
                          <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[180px]">{p?.name || 'Luxe Product'}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-rose-600">{(item.price * item.quantity).toLocaleString()}৳</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-xl text-white space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <MapPin className="w-32 h-32" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white/50 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-rose-500" /> Logistics Destination
                </h3>
                <div className="space-y-6 relative z-10">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10"><MapPin className="w-5 h-5 text-rose-500" /></div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Shipping To</p>
                       <p className="text-sm font-bold leading-relaxed italic text-white/80">{trackedOrder.shippingAddress}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10"><Calendar className="w-5 h-5 text-rose-500" /></div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Execution Date</p>
                       <p className="text-sm font-bold text-white/80 uppercase">{new Date(trackedOrder.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/5">
                     <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Support & Concierge</p>
                     <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-3">
                        Reach Concierge Terminal <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
