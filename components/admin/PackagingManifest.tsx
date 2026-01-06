
import React, { useMemo } from 'react';
import { AppState, Order, Product } from '../../types';
import { Printer, Package, ListCheck, CheckCircle, Clock, FileText } from 'lucide-react';

interface PackagingManifestProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const PackagingManifest: React.FC<PackagingManifestProps> = ({ state, setState }) => {
  // Only show processing (Confirmed) orders that need packaging
  const confirmedOrders = useMemo(() => 
    state.orders.filter(o => o.status === 'processing'), 
  [state.orders]);

  // Aggregate items needed across all confirmed orders for a "Pick List"
  const pickList = useMemo(() => {
    const items: Record<string, { product: Product | undefined, quantity: number }> = {};
    confirmedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!items[item.productId]) {
          items[item.productId] = { 
            product: state.products.find(p => p.id === item.productId), 
            quantity: 0 
          };
        }
        items[item.productId].quantity += item.quantity;
      });
    });
    return Object.values(items).filter(i => i.product);
  }, [confirmedOrders, state.products]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center no-print">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Packaging Protocol</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Manifest Generation for Confirmed Assets Only</p>
        </div>
        <button onClick={handlePrint} className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center gap-4 hover:bg-rose-600 transition-all shadow-2xl">
          <Printer className="w-5 h-5"/> Generate Packing Manifest
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 no-print">
         {/* Master Pick List */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
               <div className="flex items-center gap-4">
                  <ListCheck className="w-6 h-6 text-rose-600" />
                  <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight">Consolidated Pick-List</h4>
               </div>
               <div className="space-y-4">
                  {pickList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group">
                       <img src={item.product?.image} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform" />
                       <div className="flex-grow">
                          <p className="text-[10px] font-black uppercase text-slate-900 line-clamp-1">{item.product?.name}</p>
                          <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest">{item.product?.category}</p>
                       </div>
                       <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
                          {item.quantity}
                       </div>
                    </div>
                  ))}
                  {pickList.length === 0 && (
                    <div className="py-20 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">No confirmed orders requiring picking</div>
                  )}
               </div>
            </div>
         </div>

         {/* Order Manifest Cards */}
         <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {confirmedOrders.map(order => (
                 <div key={order.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:border-rose-200 transition-all group">
                    <div className="bg-emerald-50 p-8 border-b border-emerald-100 flex justify-between items-center">
                       <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Confirmed Protocol</p>
                          <h5 className="text-lg font-black text-slate-900">#{order.id}</h5>
                       </div>
                       <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    <div className="p-8 flex-grow space-y-6">
                       <div className="space-y-3">
                          {order.items.map((item, i) => (
                             <div key={i} className="flex justify-between items-center text-[11px] font-bold text-slate-600">
                                <span className="uppercase">{state.products.find(p => p.id === item.productId)?.name || 'Asset'}</span>
                                <span className="px-2 py-0.5 bg-slate-900 text-white rounded font-black">x{item.quantity}</span>
                             </div>
                          ))}
                       </div>
                       <div className="pt-6 border-t border-slate-50">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination Address</p>
                          <p className="text-[10px] font-bold text-slate-900 uppercase leading-relaxed line-clamp-2 italic">{order.shippingAddress}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setState(p => ({...p, orders: p.orders.map(o => o.id === order.id ? {...o, status: 'shipped'} : o)}))}
                      className="w-full py-5 bg-slate-50 text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      <Package className="w-4 h-4"/> Seal & Dispatch
                    </button>
                 </div>
               ))}
               {confirmedOrders.length === 0 && (
                 <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border border-dashed border-slate-200">
                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">No confirmed orders awaiting package seal</p>
                 </div>
               )}
            </div>
         </div>
      </div>

      {/* MANIFEST PRINT CONTENT */}
      <div className="hidden print:block manifest-print-area p-16 text-slate-900 font-sans">
         <div className="text-center mb-16 border-b-4 border-slate-900 pb-8">
            <h1 className="text-5xl font-black uppercase tracking-tighter italic">Upohar Luxe</h1>
            <h2 className="text-2xl font-bold uppercase tracking-[0.4em] mt-2">Warehouse Dispatch Manifest</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4">Node Generation: {new Date().toLocaleString()}</p>
         </div>
         
         <div className="grid grid-cols-1 gap-12">
            <div>
               <h3 className="text-xl font-black uppercase mb-6 bg-slate-900 text-white px-6 py-2 rounded-lg inline-block">Consolidated Pick List</h3>
               <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  {pickList.map((item, i) => (
                    <div key={i} className="flex justify-between border-b-2 border-slate-100 py-3">
                       <span className="font-bold uppercase text-sm">{item.product?.name}</span>
                       <span className="font-black text-xl px-4 bg-slate-50 rounded-lg">x{item.quantity}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="mt-8">
               <h3 className="text-xl font-black uppercase mb-6 bg-slate-900 text-white px-6 py-2 rounded-lg inline-block">Order Unit Breakdowns</h3>
               <div className="space-y-12">
                  {confirmedOrders.map((order, idx) => (
                     <div key={order.id} className="p-8 border-2 border-slate-100 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 bg-slate-50 text-slate-400 font-black text-xs">CONFIRMED PROTOCOL #{idx + 1}</div>
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Identity</p>
                              <h4 className="text-xl font-black uppercase">#{order.id} - {order.customerName}</h4>
                              <p className="text-sm font-bold text-rose-600">{order.customerPhone}</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 mb-6">
                           {order.items.map((it, i) => (
                             <div key={i} className="text-sm font-bold uppercase flex justify-between">
                                <span>{state.products.find(p => p.id === it.productId)?.name}</span>
                                <span className="font-black">Qty: {it.quantity}</span>
                             </div>
                           ))}
                        </div>
                        <div className="pt-6 border-t border-slate-50">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Destination Node</p>
                           <p className="text-sm font-bold italic leading-relaxed">{order.shippingAddress}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PackagingManifest;
