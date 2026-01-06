
import React, { useState, useEffect, useRef } from 'react';
import { X, Truck, ShieldCheck, ShoppingBag, Phone, User, MapPin, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  quantity: number;
  onOrder: (data: { 
    name: string; 
    phone: string; 
    address: string; 
    deliveryCharge: number;
    ipAddress?: string;
    location?: { lat: number, lng: number }
  }) => void;
  onUpdateDraft: (data: { name: string; phone: string; address: string; draftId: string; deliveryCharge: number }) => void;
}

const DELIVERY_ZONES = [
  { id: 'inside', label: 'Inside Dhaka', fee: 60 },
  { id: 'sub', label: 'Sub Dhaka', fee: 80 },
  { id: 'outside', label: 'Outside Dhaka', fee: 120 }
];

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, product, quantity, onOrder, onUpdateDraft }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [selectedZone, setSelectedZone] = useState(DELIVERY_ZONES[0]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [trackingData, setTrackingData] = useState<{ ip?: string; loc?: { lat: number; lng: number } }>({});
  const draftIdRef = useRef<string>('');

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', phone: '', address: '' });
      setSelectedZone(DELIVERY_ZONES[0]);
      draftIdRef.current = 'DRAFT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      // Attempt to capture tracking data immediately
      captureTrackingData();
    }
  }, [isOpen]);

  const captureTrackingData = async () => {
    try {
      // 1. Capture IP
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      
      // 2. Capture Geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setTrackingData({
              ip: ipData.ip,
              loc: { lat: pos.coords.latitude, lng: pos.coords.longitude }
            });
          },
          () => setTrackingData(prev => ({ ...prev, ip: ipData.ip }))
        );
      } else {
        setTrackingData({ ip: ipData.ip });
      }
    } catch (e) {
      console.warn("Tracking Capture Failed", e);
    }
  };

  useEffect(() => {
    if (!isOpen || !product) return;
    if (!formData.name && !formData.phone && !formData.address) return;

    setIsSyncing(true);
    const timeout = setTimeout(() => {
      onUpdateDraft({ ...formData, draftId: draftIdRef.current, deliveryCharge: selectedZone.fee });
      setIsSyncing(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [formData, selectedZone, isOpen, product]);

  if (!isOpen || !product) return null;

  const subtotal = product.price * quantity;
  const total = subtotal + selectedZone.fee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    
    onOrder({ 
      ...formData, 
      deliveryCharge: selectedZone.fee,
      ipAddress: trackingData.ip,
      location: trackingData.loc
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xl h-full sm:h-auto sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom duration-300 flex flex-col">
        <div className="h-2 w-full bg-rose-800"></div>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-rose-100 hover:text-rose-800 rounded-full transition-all z-10">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-rose-800" />
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Checkout</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Verification System Active</p>
              </div>
            </div>
            {isSyncing && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-rose-800 animate-pulse bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                <RefreshCw className="w-3 h-3 animate-spin" /> SYNCING...
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-5">
              <img src={product.image} className="w-16 h-16 rounded-xl object-cover shadow-md" />
              <div className="flex-grow">
                <h4 className="font-bold text-slate-900 text-sm leading-tight">{product.name}</h4>
                <p className="text-xs font-medium text-slate-500">Qty: {quantity} × {product.price.toLocaleString()}৳</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-rose-800/20 font-medium" placeholder="Recipient Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Number</label>
                    <input required type="tel" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-rose-800/20 font-medium" placeholder="017XXXXXXXX" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Address</label>
                    <textarea required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-rose-800/20 h-24 resize-none font-medium text-sm" placeholder="House, Road, Area, District..." value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Delivery Location</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DELIVERY_ZONES.map(zone => (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => setSelectedZone(zone)}
                        className={`py-3 px-2 rounded-2xl border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 ${
                          selectedZone.id === zone.id 
                            ? 'bg-rose-800 text-white border-rose-800 shadow-lg shadow-rose-800/20' 
                            : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        {zone.label}
                        <span className={`font-black ${selectedZone.id === zone.id ? 'text-white' : 'text-rose-600'}`}>৳{zone.fee}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                   <span>Subtotal</span>
                   <span>{subtotal.toLocaleString()}৳</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                   <span>Delivery Fee</span>
                   <span className="text-rose-400">+{selectedZone.fee}৳</span>
                </div>
                <div className="h-px bg-white/10 mb-4"></div>
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Payable</p>
                   <p className="text-3xl font-black text-rose-500">{total.toLocaleString()}৳</p>
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-rose-800 hover:bg-rose-900 text-white rounded-full font-bold text-lg shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3">
                <CheckCircle2 className="w-5 h-5" /> Confirm Order Now
              </button>
            </form>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Cash on Delivery</div>
            <div className="flex items-center gap-2 tracking-tighter">Your IP: <span className="text-rose-600">{trackingData.ip || 'Detecting...'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
