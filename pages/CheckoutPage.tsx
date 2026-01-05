
import React, { useState } from 'react';
import { Product, User, Order } from '../types';
// Added ShoppingBag and CheckCircle to imports
import { Trash2, ArrowRight, ShieldCheck, Truck, CreditCard, ShoppingBag, CheckCircle } from 'lucide-react';

interface CheckoutPageProps {
  cart: {product: Product, quantity: number}[];
  user: User | null;
  onRemove: (id: string) => void;
  onPlaceOrder: (data: Partial<Order>) => void;
  onNavigate: (page: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, user, onRemove, onPlaceOrder, onNavigate }) => {
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-32 text-center px-4">
        <div className="mb-8 text-6xl">🛒</div>
        <h2 className="text-3xl font-serif font-bold mb-4">Your bag is empty</h2>
        <p className="text-slate-500 mb-8">Discover our curated collections and find the perfect gift.</p>
        <button 
          onClick={() => onNavigate('shop')}
          className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Flow */}
        <div className="lg:col-span-8">
          
          <div className="flex items-center gap-4 mb-12">
            {[
              { id: 'cart', label: 'Bag', icon: ShoppingBag },
              { id: 'shipping', label: 'Shipping', icon: Truck },
              { id: 'payment', label: 'Payment', icon: CreditCard }
            ].map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 font-bold ${step === s.id ? 'text-rose-800' : 'text-slate-300'}`}>
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs ${step === s.id ? 'border-rose-800 bg-rose-50' : 'border-slate-200'}`}>
                    {i + 1}
                  </span>
                  {s.label}
                </div>
                {i < 2 && <div className="h-px w-8 bg-slate-100"></div>}
              </React.Fragment>
            ))}
          </div>

          {step === 'cart' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold">Your Bag</h2>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex gap-6 items-center p-4 bg-white rounded-2xl border border-slate-100">
                    <img src={item.product.image} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg">{item.product.name}</h4>
                      <p className="text-slate-400 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => onRemove(item.product.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setStep('shipping')}
                className="w-full py-4 bg-slate-900 text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-xl"
              >
                Proceed to Shipping <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'shipping' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold">Shipping Details</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <input 
                    type="email"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-rose-800"
                    placeholder="john@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Delivery Address</label>
                  <textarea 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-rose-800 h-32 resize-none"
                    placeholder="123 Luxury Avenue, Suite 4B..."
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
                <button 
                  disabled={!address || !email}
                  onClick={() => setStep('payment')}
                  className="w-full py-4 bg-slate-900 text-white rounded-full font-bold text-lg disabled:opacity-50 shadow-xl"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-serif font-bold">Secure Payment</h2>
              <div className="p-8 border border-slate-100 bg-slate-50/50 rounded-3xl space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200">
                  <CreditCard className="w-6 h-6 text-slate-400" />
                  <div className="flex-grow">
                    <p className="font-bold">Card Ending in 4242</p>
                    <p className="text-xs text-slate-400">Exp 12/28</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <button 
                  onClick={() => onPlaceOrder({ shippingAddress: address, customerEmail: email })}
                  className="w-full py-4 bg-rose-800 text-white rounded-full font-bold text-lg shadow-2xl hover:bg-rose-900 transition-all hover:scale-[1.01]"
                >
                  Complete Order - ${total.toFixed(2)}
                </button>
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <ShieldCheck className="w-4 h-4" /> 256-bit Secure Encryption
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="h-px bg-slate-100"></div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Truck className="w-4 h-4" /> Delivered by Wednesday, Oct 25
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <ShieldCheck className="w-4 h-4" /> 30-Day Happiness Guarantee
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
