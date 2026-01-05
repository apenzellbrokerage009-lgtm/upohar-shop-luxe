
import React from 'react';
import { User, Order, Product } from '../types';
import { Package, Clock, CheckCircle, MapPin } from 'lucide-react';

interface CustomerDashboardProps {
  user: User;
  orders: Order[];
  products: Product[];
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, orders, products }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-3xl">
          {user.avatar || '👤'}
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold">Welcome back, {user.name}</h1>
          <p className="text-slate-500">Manage your orders and account settings.</p>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Package className="w-5 h-5" /> Your Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-8 py-4 flex justify-between items-center border-b border-slate-100">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Order ID</p>
                      <p className="text-sm font-semibold">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Placed on</p>
                      <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Status</p>
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 text-right">Total Amount</p>
                    <p className="text-lg font-bold text-rose-800">{order.total.toLocaleString()}৳</p>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    {order.items.map((item, idx) => {
                      const p = products.find(prod => prod.id === item.productId);
                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <img src={p?.image} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-grow">
                            <p className="font-semibold text-sm">{p?.name || 'Unknown Product'}</p>
                            <p className="text-xs text-slate-400">Qty: {item.quantity} x {item.price.toLocaleString()}৳</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2 text-slate-500 text-xs">
                    <MapPin className="w-3.5 h-3.5" />
                    Shipping to: {order.shippingAddress}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
