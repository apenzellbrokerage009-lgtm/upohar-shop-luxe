
import React, { useState } from 'react';
import { AppState, Order, Product } from '../../types';
import { Printer, FileText, Truck, X, Check, Phone, MapPin, User, Hash, Download, Eye, ArrowLeft, ClipboardList, PackageCheck } from 'lucide-react';

interface DeliveryDispatchProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const DeliveryDispatch: React.FC<DeliveryDispatchProps> = ({ state, setState }) => {
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);
  const [previewType, setPreviewType] = useState<'invoice' | 'slip' | 'packing_list'>('invoice');

  const confirmedOrders = state.orders.filter(o => o.status === 'processing');

  const openPreview = (order: Order, type: 'invoice' | 'slip' | 'packing_list') => {
    setPreviewOrder(order);
    setPreviewType(type);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center no-print">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Delivery Dispatch Center</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Confirmed orders awaiting documentation</p>
        </div>
        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
           <Check className="w-4 h-4 text-emerald-600" />
           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{confirmedOrders.length} Protocols Confirmed</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-6 no-print">
        {confirmedOrders.map(order => (
          <div key={order.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row justify-between items-center gap-8 group hover:border-rose-200 transition-all hover:shadow-xl">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center font-black italic shadow-xl group-hover:scale-105 transition-transform">
                {order.customerName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <p className="text-sm font-black uppercase text-slate-900 tracking-tight">{order.customerName}</p>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">#{order.id}</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs"><Phone className="w-3 h-3"/> {order.customerPhone}</div>
                   <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs"><MapPin className="w-3 h-3"/> {order.shippingAddress.slice(0, 35)}...</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => openPreview(order, 'invoice')}
                className="px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
              >
                <Eye className="w-4 h-4" /> Invoice
              </button>
              <button 
                onClick={() => openPreview(order, 'slip')}
                className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 hover:text-white transition-all active:scale-95"
              >
                <Truck className="w-4 h-4" /> Slip
              </button>
              <button 
                onClick={() => openPreview(order, 'packing_list')}
                className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
              >
                <ClipboardList className="w-4 h-4" /> Packing List
              </button>
              <button 
                onClick={() => setState(p => ({...p, orders: p.orders.map(o => o.id === order.id ? {...o, status: 'shipped'} : o)}))}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
              >
                <Check className="w-4 h-4" /> Ship Now
              </button>
            </div>
          </div>
        ))}

        {confirmedOrders.length === 0 && (
          <div className="py-32 text-center bg-white rounded-[4rem] border border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-slate-200" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">No confirmed orders awaiting dispatch</p>
          </div>
        )}
      </div>

      {/* PREVIEW MODAL */}
      {previewOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 no-print">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setPreviewOrder(null)}></div>
          
          <div className="relative bg-white w-full max-w-5xl h-full flex flex-col rounded-[4rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="px-12 py-8 bg-slate-50/50 backdrop-blur-md border-b border-slate-100 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-6">
                  <button onClick={() => setPreviewOrder(null)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h4 className="text-xl font-black uppercase text-slate-900 tracking-tight">Document Preview</h4>
                    <p className="text-[9px] font-black text-rose-600 uppercase tracking-[0.3em] mt-1">{previewType.replace('_', ' ')} Mode • Order #{previewOrder.id}</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={handlePrint} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-rose-600 transition-all shadow-xl active:scale-95">
                    <Printer className="w-5 h-5" /> Execute Print Protocol
                  </button>
                  <button onClick={() => setPreviewOrder(null)} className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all">
                    <X className="w-6 h-6" />
                  </button>
               </div>
            </div>

            {/* Document Content */}
            <div className="flex-grow overflow-y-auto p-12 bg-slate-100/30 scrollbar-hide">
               <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] mx-auto print-target-content">
                  
                  {previewType === 'invoice' && (
                    <div className="p-16 text-slate-900 font-sans border-t-[12px] border-slate-900">
                      <div className="flex justify-between items-start mb-20">
                        <div>
                          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Upohar Luxe</h1>
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-rose-600 mt-2">Premium Gifting Infrastructure</p>
                        </div>
                        <div className="text-right">
                          <h2 className="text-5xl font-black tracking-tighter text-slate-900">INVOICE</h2>
                          <p className="text-sm font-black mt-4 text-slate-400 uppercase tracking-widest">ID: #{previewOrder.id}</p>
                        </div>
                      </div>
                      {/* ...rest of invoice UI same as before... */}
                      <div className="grid grid-cols-2 gap-20 mb-20">
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Constituent Target</p>
                          <p className="text-2xl font-black uppercase text-slate-900">{previewOrder.customerName}</p>
                          <p className="text-lg font-black text-rose-600 mt-1">{previewOrder.customerPhone}</p>
                          <p className="mt-6 text-sm font-medium italic text-slate-500 leading-relaxed">{previewOrder.shippingAddress}</p>
                        </div>
                        <div className="text-right flex flex-col justify-end">
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</p>
                           <p className="text-sm font-black uppercase text-emerald-600">Verified Protocol</p>
                        </div>
                      </div>
                      <table className="w-full mb-20 border-collapse">
                        <thead>
                          <tr className="border-b-4 border-slate-900 text-[10px] font-black uppercase tracking-widest text-left">
                            <th className="py-6">Asset Classification</th>
                            <th className="py-6 text-center">Qty</th>
                            <th className="py-6 text-right">Total Liab.</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {previewOrder.items.map((item, i) => (
                            <tr key={i}>
                              <td className="py-8"><p className="text-sm font-black uppercase text-slate-900">{state.products.find(p => p.id === item.productId)?.name || 'Luxe Asset'}</p></td>
                              <td className="py-8 text-center text-sm font-black">{item.quantity}</td>
                              <td className="py-8 text-right text-lg font-black">{(item.price * item.quantity).toLocaleString()}৳</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex justify-end pt-10 border-t-2 border-slate-100">
                         <div className="text-right">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600">Final Settlement</span>
                           <p className="text-4xl font-black tracking-tighter text-slate-900">{previewOrder.total.toLocaleString()}৳</p>
                         </div>
                      </div>
                    </div>
                  )}

                  {previewType === 'slip' && (
                    <div className="p-16 text-slate-900 font-sans border-[16px] border-slate-900 relative overflow-hidden">
                       <div className="text-center mb-16">
                          <h1 className="text-4xl font-black uppercase italic tracking-tight">Upohar Luxe</h1>
                          <p className="text-[10px] font-black uppercase tracking-[0.6em] mt-6 text-slate-400">Logistics Dispatch Node</p>
                       </div>
                       <div className="space-y-10">
                          <div className="p-10 bg-slate-950 text-white rounded-[3rem] shadow-2xl">
                             <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Recipient Identity</p>
                             <p className="text-5xl font-black uppercase tracking-tighter">{previewOrder.customerName}</p>
                          </div>
                          <div className="p-10 bg-white border-4 border-slate-100 rounded-[3rem] shadow-sm">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Contact</p>
                             <p className="text-5xl font-black tracking-tighter text-rose-600">{previewOrder.customerPhone}</p>
                          </div>
                          <div className="p-10 bg-slate-50 rounded-[3rem] border-2 border-slate-100">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Logistics Destination</p>
                             <p className="text-2xl font-black text-slate-900 uppercase leading-tight italic">{previewOrder.shippingAddress}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-8">
                             <div className="p-10 bg-white border-4 border-slate-900 rounded-[3rem] text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Payable COD</p>
                                <p className="text-5xl font-black">{previewOrder.total.toLocaleString()}৳</p>
                             </div>
                             <div className="p-10 bg-slate-900 text-white rounded-[3rem] text-center">
                                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Order Ref</p>
                                <p className="text-3xl font-black">#{previewOrder.id}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {previewType === 'packing_list' && (
                    /* PACKING LIST PREVIEW (New Checklist View) */
                    <div className="p-16 text-slate-900 font-sans border-t-[16px] border-indigo-600">
                       <div className="flex justify-between items-center mb-16 pb-8 border-b-2 border-slate-100">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center">
                                <ClipboardList className="w-8 h-8" />
                             </div>
                             <div>
                                <h1 className="text-3xl font-black uppercase tracking-tight">Warehouse Packing Protocol</h1>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verification Node: Order #{previewOrder.id}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100`}>
                                Verified Strategy
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-10 mb-16">
                          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Constituent</p>
                             <p className="text-2xl font-black uppercase text-slate-900">{previewOrder.customerName}</p>
                             <p className="text-sm font-bold text-slate-500 mt-1">{previewOrder.customerPhone}</p>
                          </div>
                          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Logistics Destination</p>
                             <p className="text-base font-bold text-slate-700 italic line-clamp-2">{previewOrder.shippingAddress}</p>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 border-l-4 border-indigo-600 pl-4">Required Assets (Checklist)</h3>
                          <div className="grid grid-cols-1 gap-4">
                             {previewOrder.items.map((item, i) => {
                               const p = state.products.find(prod => prod.id === item.productId);
                               return (
                                 <div key={i} className="flex items-center gap-8 p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] group hover:border-indigo-200 transition-all">
                                    <div className="w-10 h-10 border-4 border-slate-200 rounded-xl flex items-center justify-center group-hover:border-indigo-600 transition-all">
                                       <div className="w-4 h-4 rounded-sm bg-white border-2 border-slate-100"></div>
                                    </div>
                                    <img src={p?.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                                    <div className="flex-grow">
                                       <h4 className="text-xl font-black uppercase text-slate-900">{p?.name || 'Premium Asset'}</h4>
                                       <p className="text-xs font-bold text-slate-400 mt-1 tracking-widest uppercase italic">SKU-ID: {item.productId.slice(0, 10)}</p>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Required Quantity</p>
                                       <div className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-2xl font-black shadow-lg">
                                          × {item.quantity}
                                       </div>
                                    </div>
                                 </div>
                               );
                             })}
                          </div>
                       </div>

                       <div className="mt-20 p-10 bg-slate-950 text-white rounded-[3rem] relative overflow-hidden flex items-center justify-between">
                          <div className="absolute top-0 right-0 p-10 opacity-5">
                             <PackageCheck className="w-40 h-40" />
                          </div>
                          <div className="relative z-10">
                             <h5 className="text-2xl font-black uppercase tracking-tight">Final Manifest Verification</h5>
                             <p className="text-slate-400 text-xs mt-1 font-bold">Ensure all items above are secured with signature gift-wrapping before seal.</p>
                          </div>
                          <div className="relative z-10 w-40 h-12 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center">
                             <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic">Stamp Hub</p>
                          </div>
                       </div>
                    </div>
                  )}

               </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="px-12 py-8 bg-white border-t border-slate-100 flex justify-between items-center shrink-0 no-print">
               <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">System Node: DISPATCH_RENDER_v4</div>
               <button onClick={handlePrint} className="px-20 py-6 bg-rose-600 text-white rounded-full text-xs font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-rose-700 transition-all flex items-center gap-4 active:scale-95">
                 <Printer className="w-5 h-5" /> Generate Document
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS to handle the printing of the modal content specifically */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden !important; display: none !important; }
          .print-target-content, .print-target-content * { 
            visibility: visible !important; 
            display: block !important; 
          }
          .print-target-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            z-index: 99999999 !important;
            box-shadow: none !important;
            border: none !important;
          }
          table { width: 100% !important; border-collapse: collapse !important; }
          tr { page-break-inside: avoid !important; }
        }
      `}} />
    </div>
  );
};

export default DeliveryDispatch;
