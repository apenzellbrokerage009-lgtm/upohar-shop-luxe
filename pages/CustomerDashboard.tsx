
import React from 'react';
import { User, Order, Product } from '../types';
import { Package, Clock, CheckCircle, MapPin, ShoppingBag, CreditCard, User as UserIcon, Calendar, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface CustomerDashboardProps {
  user: User;
  orders: Order[];
  products: Product[];
  onNavigate: (page: string, id?: string) => void;
}

const statusColorMap: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  processing: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  shipped: 'bg-blue-50 text-blue-600 border-blue-100',
  delivered: 'bg-slate-900 text-white border-slate-900',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-100'
};

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, orders, products, onNavigate }) => {
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Profile Section */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black italic shadow-2xl shadow-slate-900/20 group-hover:scale-105 transition-transform duration-500">
                {user.avatar || user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-rose-600 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                 <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 uppercase tracking-tighter">{user.name}</h1>
                 <span className="px-4 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-100 w-fit mx-auto md:mx-0">Luxe Member</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400">
                 <div className="flex items-center gap-2"><UserIcon className="w-4 h-4 text-rose-600" /><p className="text-xs font-bold uppercase tracking-widest">{user.phone || user.email}</p></div>
                 <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-rose-600" /><p className="text-xs font-bold uppercase tracking-widest italic">Member Since {new Date(user.createdAt || '').toLocaleDateString()}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Orders Placed', value: orders.length, icon: ShoppingBag, color: 'text-rose-600' },
            { label: 'Total Investment', value: `${totalSpent.toLocaleString()}৳`, icon: CreditCard, color: 'text-slate-900' },
            { label: 'Luxe Status', value: totalSpent > 5000 ? 'Platinum' : 'Gold', icon: Zap, color: 'text-amber-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 animate-in fade-in slide-in-from-bottom-5 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">{stat.label}</p>
              <div className="flex items-center justify-between">
                <h4 className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</h4>
                <div className="p-3 bg-slate-50 rounded-2xl"><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
              <Package className="w-6 h-6 text-rose-600" /> Your Purchase History
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm animate-in fade-in duration-700">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">No masterpieces discovered yet</h3>
              <p className="text-slate-400 max-w-xs mx-auto text-sm mb-8">Start your journey with Upohar Luxe today.</p>
              <button onClick={() => onNavigate('shop')} className="px-10 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-rose-600 transition-all">Browse Collections</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order, idx) => (
                <div key={order.id} className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-xl shadow-slate-200/30 animate-in fade-in slide-in-from-bottom-5 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="bg-slate-50/50 px-10 py-6 flex flex-wrap justify-between items-center gap-6 border-b border-slate-50">
                    <div className="flex gap-10">
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Order Ref</p>
                        <p className="text-sm font-black text-slate-900 tracking-tight">#{order.id}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Execution Date</p>
                        <p className="text-sm font-black text-slate-900 tracking-tight">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-2xl font-black text-rose-800 tracking-tighter">{order.total.toLocaleString()}৳</p>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColorMap[order.status] || 'bg-slate-50'}`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                  <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-4">
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2">Asset Details</p>
                          {order.items.map((item, i) => {
                            const p = products.find(prod => prod.id === item.productId);
                            return (
                              <div key={i} className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                                <img src={p?.image} className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                <div className="flex-grow">
                                  <p className="font-black text-slate-900 text-sm uppercase tracking-tight line-clamp-1">{p?.name || 'Luxe Product'}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Quantity: {item.quantity} × {item.price.toLocaleString()}৳</p>
                                </div>
                              </div>
                            );
                          })}
                       </div>
                       <div className="space-y-6">
                          <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Shipping Destination</p>
                            <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                               <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
                               <p className="text-sm font-bold text-slate-600 leading-relaxed italic">{order.shippingAddress}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => onNavigate('track', order.id)}
                            className="w-full py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3"
                          >
                             Track Live Order <ArrowRight className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
