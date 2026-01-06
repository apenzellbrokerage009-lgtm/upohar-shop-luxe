
import React, { useState } from 'react';
import { AppState, Product, Order, OrderItem } from '../../types';
import { Search, ShoppingBag, Plus, Trash2 } from 'lucide-react';

interface POSProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const POSModule: React.FC<POSProps> = ({ state, setState }) => {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);

  const addToCart = (p: Product) => {
    if (p.stock <= 0) {
      alert("Asset Out of Stock!");
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.productId === p.id);
      if (existing) return prev.map(i => i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: p.id, productName: p.name, price: p.price, quantity: 1 }];
    });
  };

  const completeSale = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const newOrder: Order = {
      id: 'POS-' + Date.now().toString().slice(-6),
      customerId: 'pos-walkin',
      customerName: 'Counter Customer',
      customerPhone: '0000000000',
      items: [...cart],
      subtotal: total, deliveryCharge: 0, total: total,
      status: 'delivered', createdAt: new Date().toISOString(),
      shippingAddress: 'Counter Sale', paymentMethod: 'Cash'
    };
    
    setState(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      products: prev.products.map(p => {
        const cartItem = cart.find(ci => ci.productId === p.id);
        return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.quantity) } : p;
      })
    }));
    setCart([]);
    alert("Transaction Successful!");
  };

  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in zoom-in duration-300">
      <div className="col-span-8 space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4 shadow-sm">
          <Search className="w-5 h-5 text-slate-300" />
          <input 
            placeholder="Scan asset or type name..." 
            className="flex-grow outline-none font-bold text-lg" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="grid grid-cols-4 gap-4 max-h-[65vh] overflow-y-auto pr-2 scrollbar-hide">
          {state.products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
            <button key={p.id} onClick={() => addToCart(p)} className="bg-white p-4 rounded-3xl border border-slate-100 hover:shadow-xl hover:border-rose-100 transition-all text-left group">
              <div className="relative aspect-square mb-3 overflow-hidden rounded-2xl">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-[10px] font-black uppercase truncate text-slate-900">{p.name}</h4>
              <p className="text-xs font-black text-rose-600 mt-1">{p.price}৳</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[8px] font-bold text-slate-400 uppercase">Stock: {p.stock}</p>
                <div className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center"><Plus className="w-3 h-3"/></div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="col-span-4 bg-slate-900 rounded-[3.5rem] p-10 text-white flex flex-col h-[75vh] shadow-2xl">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10">Asset Cart</h3>
        <div className="flex-grow overflow-y-auto space-y-4 pr-2 scrollbar-hide">
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl group">
              <div className="truncate pr-4">
                <p className="text-[10px] font-black uppercase truncate text-rose-500">{item.productName}</p>
                <p className="text-xs font-bold">{item.price}৳ x {item.quantity}</p>
              </div>
              <button onClick={() => setCart(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-600 group-hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/10 mt-6">
          <div className="flex justify-between items-center mb-8">
            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Grand Total</span>
            <span className="text-3xl font-black text-white">{cart.reduce((a, b) => a + (b.price * b.quantity), 0)}৳</span>
          </div>
          <button onClick={completeSale} className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-rose-700 transition-all">Execute Transaction</button>
        </div>
      </div>
    </div>
  );
};

export default POSModule;
