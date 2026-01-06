
import React, { useState, useMemo } from 'react';
import { AppState, Order, Product } from '../../types';
import { 
  Printer, FileText, Truck, X, Check, Phone, MapPin, User, Hash, 
  Download, Eye, ArrowLeft, ClipboardList, PackageCheck, CheckSquare, 
  Square, RefreshCw, Send, AlertCircle, Loader2
} from 'lucide-react';
import { dispatchToSteadfast, dispatchToPathao } from '../../courierIntegrationService';

interface DeliveryDispatchProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const DeliveryDispatch: React.FC<DeliveryDispatchProps> = ({ state, setState }) => {
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);
  const [previewType, setPreviewType] = useState<'invoice' | 'slip' | 'packing_list'>('invoice');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkPrintMode, setBulkPrintMode] = useState<'invoice' | 'slip' | 'packing_list' | null>(null);

  const confirmedOrders = useMemo(() => 
    state.orders.filter(o => o.status === 'processing'), 
  [state.orders]);

  const toggleSelect = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === confirmedOrders.length) setSelectedIds([]);
    else setSelectedIds(confirmedOrders.map(o => o.id));
  };

  const openPreview = (order: Order, type: 'invoice' | 'slip' | 'packing_list') => {
    setPreviewOrder(order);
    setPreviewType(type);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBulkPrint = (type: 'invoice' | 'slip' | 'packing_list') => {
    setBulkPrintMode(type);
    setTimeout(() => {
      window.print();
      setBulkPrintMode(null);
    }, 500);
  };

  const shipOrder = async (order: Order) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      let result;
      if (state.steadfast.isEnabled) {
        result = await dispatchToSteadfast(order, state.steadfast);
      } else if (state.pathao.isEnabled) {
        result = await dispatchToPathao(order, state.pathao);
      } else {
        result = { success: true, message: 'Local status updated' };
      }

      if (result.success) {
        setState(p => ({
          ...p,
          orders: p.orders.map(o => o.id === order.id ? { ...o, status: 'shipped' } : o)
        }));
      } else {
        alert(`Failed to ship #${order.id}: ${result.message}`);
      }
    } catch (e: any) {
      alert(`Error shipping #${order.id}: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkShip = async () => {
    if (isProcessing || selectedIds.length === 0) return;
    if (!confirm(`Initialize Dispatch Protocol for ${selectedIds.length} orders?`)) return;
    
    setIsProcessing(true);
    
    let successCount = 0;
    let failCount = 0;
    const ordersToShip = confirmedOrders.filter(o => selectedIds.includes(o.id));
    const processedIds: string[] = [];

    for (const order of ordersToShip) {
      try {
        let res;
        if (state.steadfast.isEnabled) {
          res = await dispatchToSteadfast(order, state.steadfast);
        } else if (state.pathao.isEnabled) {
          res = await dispatchToPathao(order, state.pathao);
        } else {
          res = { success: true, message: 'Local sync' };
        }

        if (res.success) {
          successCount++;
          processedIds.push(order.id);
          // Progressive UI update for better feedback
          setState(prev => ({
            ...prev,
            orders: prev.orders.map(o => o.id === order.id ? { ...o, status: 'shipped' as const } : o)
          }));
        } else {
          failCount++;
        }
      } catch (e) {
        failCount++;
        console.error(`Bulk ship failed for order ${order.id}:`, e);
      }
    }

    setIsProcessing(false);
    setSelectedIds([]);
    alert(`Logistics Dispatch Finalized.\n\nSuccessfully Routed: ${successCount}\nFailed Protocols: ${failCount}`);
  };

  const renderDocument = (order: Order, type: 'invoice' | 'slip' | 'packing_list', isBulk: boolean = false) => {
    const pClassName = isBulk ? "page-break-after-always" : "";
    
    if (type === 'invoice') {
      return (
        <div className={`p-16 text-slate-900 font-sans border-t-[12px] border-slate-900 bg-white ${pClassName}`}>
          <div className="flex justify-between items-start mb-20">
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">Upohar Luxe</h1>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-rose-600 mt-2">Premium Gifting Infrastructure</p>
            </div>
            <div className="text-right">
              <h2 className="text-5xl font-black tracking-tighter text-slate-900">INVOICE</h2>
              <p className="text-sm font-black mt-4 text-slate-400 uppercase tracking-widest">ID: #{order.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-20 mb-20">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Constituent Target</p>
              <p className="text-2xl font-black uppercase text-slate-900">{order.customerName}</p>
              <p className="text-lg font-black text-rose-600 mt-1">{order.customerPhone}</p>
              <p className="mt-6 text-sm font-medium italic text-slate-500 leading-relaxed">{order.shippingAddress}</p>
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
              {order.items.map((item, i) => (
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
               <p className="text-4xl font-black tracking-tighter text-slate-900">{order.total.toLocaleString()}৳</p>
             </div>
          </div>
        </div>
      );
    }

    if (type === 'slip') {
      return (
        <div className={`p-16 text-slate-900 font-sans border-[16px] border-slate-900 relative overflow-hidden bg-white ${pClassName}`}>
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black uppercase italic tracking-tight">Upohar Luxe</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.6em] mt-6 text-slate-400">Logistics Dispatch Node</p>
          </div>
          <div className="space-y-10">
            <div className="p-10 bg-slate-950 text-white rounded-[3rem] shadow-2xl">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Recipient Identity</p>
              <p className="text-5xl font-black uppercase tracking-tighter">{order.customerName}</p>
            </div>
            <div className="p-10 bg-white border-4 border-slate-100 rounded-[3rem] shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Contact</p>
              <p className="text-5xl font-black tracking-tighter text-rose-600">{order.customerPhone}</p>
            </div>
            <div className="p-10 bg-slate-50 rounded-[3rem] border-2 border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Logistics Destination</p>
              <p className="text-2xl font-black text-slate-900 uppercase leading-tight italic">{order.shippingAddress}</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-10 bg-white border-4 border-slate-900 rounded-[3rem] text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Payable COD</p>
                <p className="text-5xl font-black">{order.total.toLocaleString()}৳</p>
              </div>
              <div className="p-10 bg-slate-900 text-white rounded-[3rem] text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Order Ref</p>
                <p className="text-3xl font-black">#{order.id}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'packing_list') {
      return (
        <div className={`p-16 text-slate-900 font-sans border-t-[16px] border-indigo-600 bg-white ${pClassName}`}>
          <div className="flex justify-between items-center mb-16 pb-8 border-b-2 border-slate-100">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center">
                <ClipboardList className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">Warehouse Packing Protocol</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verification Node: Order #{order.id}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 mb-16">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Constituent</p>
              <p className="text-2xl font-black uppercase text-slate-900">{order.customerName}</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Logistics Destination</p>
              <p className="text-base font-bold text-slate-700 italic line-clamp-2">{order.shippingAddress}</p>
            </div>
          </div>
          <div className="space-y-4">
            {order.items.map((item, i) => {
              const p = state.products.find(prod => prod.id === item.productId);
              return (
                <div key={i} className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-2xl">
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center font-black">#</div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-black uppercase text-slate-900">{p?.name || 'Premium Asset'}</h4>
                  </div>
                  <div className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xl font-black">
                    × {item.quantity}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-16 p-8 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Scan item barcode or manually check-off</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Dispatch Hub</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Confirmed orders awaiting physical processing</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
             <Check className="w-4 h-4 text-emerald-600" />
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{confirmedOrders.length} Ready for Seal</span>
          </div>
          {confirmedOrders.length > 0 && (
            <button 
              onClick={toggleAll}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all"
            >
              {selectedIds.length === confirmedOrders.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-6 no-print">
        {confirmedOrders.map(order => (
          <div key={order.id} className={`bg-white p-8 rounded-[3rem] border transition-all hover:shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8 group ${selectedIds.includes(order.id) ? 'border-rose-500 bg-rose-50/10' : 'border-slate-100'}`}>
            <div className="flex items-center gap-6 w-full lg:w-auto">
              <button 
                onClick={(e) => toggleSelect(order.id, e)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${selectedIds.includes(order.id) ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-300'}`}
              >
                {selectedIds.includes(order.id) ? <CheckSquare className="w-5 h-5"/> : <Square className="w-5 h-5"/>}
              </button>
              
              <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center font-black italic shrink-0">
                {order.customerName.charAt(0)}
              </div>
              
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                   <p className="text-sm font-black uppercase text-slate-900 tracking-tight truncate">{order.customerName}</p>
                   <span className="text-[9px] font-black text-slate-300 uppercase shrink-0">#{order.id}</span>
                </div>
                <div className="flex flex-wrap gap-4">
                   <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs"><Phone className="w-3 h-3"/> {order.customerPhone}</div>
                   <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs truncate max-w-[200px]"><MapPin className="w-3 h-3"/> {order.shippingAddress}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                <button onClick={() => openPreview(order, 'invoice')} className="p-2.5 hover:bg-white rounded-xl text-slate-500 hover:text-slate-900 transition-all"><Eye className="w-4 h-4"/></button>
                <button onClick={() => openPreview(order, 'slip')} className="p-2.5 hover:bg-white rounded-xl text-slate-500 hover:text-rose-600 transition-all"><Truck className="w-4 h-4"/></button>
                <button onClick={() => openPreview(order, 'packing_list')} className="p-2.5 hover:bg-white rounded-xl text-slate-500 hover:text-indigo-600 transition-all"><ClipboardList className="w-4 h-4"/></button>
              </div>

              <button 
                disabled={isProcessing}
                onClick={() => shipOrder(order)}
                className="px-8 py-3.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4" />} Ship Order
              </button>
            </div>
          </div>
        ))}

        {confirmedOrders.length === 0 && (
          <div className="py-32 text-center bg-white rounded-[4rem] border border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <PackageCheck className="w-10 h-10 text-slate-200" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">No orders in Processing state</p>
          </div>
        )}
      </div>

      {/* BULK ACTION CONSOLE */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-950/95 backdrop-blur-2xl px-12 py-6 rounded-[3.5rem] border border-white/10 shadow-2xl flex items-center gap-12 animate-in slide-in-from-bottom-10 no-print">
          <div className="flex items-center gap-4 border-r border-white/10 pr-12">
            <div className="w-10 h-10 bg-rose-600 text-white rounded-2xl flex items-center justify-center font-black text-sm">{selectedIds.length}</div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Orders Selected</p>
          </div>
          
          <div className="flex gap-4">
             <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 mr-4">
               <button onClick={() => handleBulkPrint('invoice')} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"><Printer className="w-3 h-3"/> Invoices</button>
               <button onClick={() => handleBulkPrint('slip')} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"><Truck className="w-3 h-3"/> Slips</button>
               <button onClick={() => handleBulkPrint('packing_list')} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"><ClipboardList className="w-3 h-3"/> Pack-lists</button>
             </div>
             
             <button 
               disabled={isProcessing}
               onClick={handleBulkShip} 
               className="px-10 py-3.5 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
             >
               {isProcessing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>} 
               {state.steadfast.isEnabled ? 'Dispatch via Steadfast' : state.pathao.isEnabled ? 'Dispatch via Pathao' : 'Ship Local'}
             </button>
          </div>

          <button onClick={() => setSelectedIds([])} className="p-3 text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6"/></button>
        </div>
      )}

      {/* INDIVIDUAL PREVIEW MODAL */}
      {previewOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 no-print">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" onClick={() => setPreviewOrder(null)}></div>
          <div className="relative bg-white w-full max-w-5xl h-full flex flex-col rounded-[4rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="px-12 py-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <button onClick={() => setPreviewOrder(null)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all shadow-sm"><ArrowLeft className="w-5 h-5" /></button>
                  <h4 className="text-xl font-black uppercase text-slate-900 tracking-tight">{previewType.replace('_', ' ')} Preview</h4>
               </div>
               <div className="flex gap-4">
                  <button onClick={handlePrint} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-rose-600 transition-all"><Printer className="w-5 h-5" /> Print This</button>
                  <button onClick={() => setPreviewOrder(null)} className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"><X className="w-6 h-6" /></button>
               </div>
            </div>
            <div className="flex-grow overflow-y-auto p-12 bg-slate-100/30 scrollbar-hide">
               <div className="bg-white shadow-xl mx-auto print-target-content max-w-4xl">
                  {renderDocument(previewOrder, previewType)}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK PRINT RENDER ENGINE */}
      {bulkPrintMode && (
        <div className="hidden print:block absolute inset-0 bg-white z-[999999]">
           {confirmedOrders.filter(o => selectedIds.includes(o.id)).map(order => (
             <div key={order.id}>
                {renderDocument(order, bulkPrintMode, true)}
             </div>
           ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { display: none !important; }
          .print-target-content, .print-target-content *,
          .hidden.print\\:block, .hidden.print\\:block * { 
            display: block !important; 
            visibility: visible !important; 
          }
          .page-break-after-always { 
            page-break-after: always !important;
            margin-bottom: 20px !important;
          }
        }
      `}} />
    </div>
  );
};

export default DeliveryDispatch;
