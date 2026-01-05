
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Product, Order, IncompleteOrder } from './types';
import { getDb, saveDb, getDefaultState } from './db';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import CheckoutModal from './components/CheckoutModal';
import MobileBottomNav from './components/MobileBottomNav';
import { tracker } from './trackingService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(getDefaultState());
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCustomPageId, setSelectedCustomPageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Checkout Modal State
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutQty, setCheckoutQty] = useState(1);

  // Initial Data Fetch
  useEffect(() => {
    const initApp = async () => {
      const dbState = await getDb();
      setState(dbState);
      setIsLoading(false);
      // Initialize tracking
      if (dbState.tracking) {
        tracker.init(dbState.tracking);
        tracker.trackPageView('Home');
      }
    };
    initApp();
  }, []);

  // Sync with tracker when tracking settings change in Admin
  useEffect(() => {
    if (!isLoading && state.tracking.isEnabled) {
      tracker.init(state.tracking);
    }
  }, [state.tracking, isLoading]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return state.products;
    return state.products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [state.products, searchQuery]);

  const handleNavigate = (page: string, id?: string) => {
    const customPage = state.customPages.find(p => p.slug === page);
    if (customPage) {
       setSelectedCustomPageId(customPage.id);
       setCurrentPage('custom');
       tracker.trackPageView(page);
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }
    setCurrentPage(page);
    if (page === 'product' && id) {
      setSelectedProductId(id);
      const product = state.products.find(p => p.id === id);
      if (product) tracker.trackViewContent(product);
    }
    tracker.trackPageView(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    setCurrentPage('landing');
  };

  const triggerCheckout = (product: Product, quantity: number = 1) => {
    setCheckoutProduct(product);
    setCheckoutQty(quantity);
    tracker.trackInitiateCheckout(product, quantity);
  };

  const handleUpdateDraft = (data: { name: string; phone: string; address: string; draftId: string; deliveryCharge: number }) => {
    if (!checkoutProduct) return;
    
    setState(prev => {
      const existingIdx = prev.incompleteOrders.findIndex(o => o.id === data.draftId);
      const newLead: IncompleteOrder = {
        id: data.draftId,
        name: data.name,
        phone: data.phone,
        address: data.address,
        productId: checkoutProduct.id,
        productName: checkoutProduct.name,
        quantity: checkoutQty,
        deliveryCharge: data.deliveryCharge,
        timestamp: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      if (existingIdx > -1) {
        const updatedLeads = [...prev.incompleteOrders];
        updatedLeads[existingIdx] = newLead;
        return { ...prev, incompleteOrders: updatedLeads };
      } else {
        return { ...prev, incompleteOrders: [newLead, ...prev.incompleteOrders] };
      }
    });
  };

  const handleConfirmOrder = (formData: { name: string; phone: string; address: string; deliveryCharge: number }) => {
    if (!checkoutProduct) return;
    const subtotal = checkoutProduct.price * checkoutQty;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      customerId: state.currentUser?.id || 'guest',
      customerName: formData.name,
      customerPhone: formData.phone,
      items: [{ productId: checkoutProduct.id, productName: checkoutProduct.name, quantity: checkoutQty, price: checkoutProduct.price }],
      subtotal,
      deliveryCharge: formData.deliveryCharge,
      total: subtotal + formData.deliveryCharge,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress: formData.address
    };
    
    setState(prev => {
      const saveTimeout = setTimeout(() => saveDb(state), 100);
      return { 
        ...prev, 
        orders: [newOrder, ...prev.orders],
        incompleteOrders: prev.incompleteOrders.filter(l => l.phone !== formData.phone)
      }
    });

    // Fire live purchase tracking
    tracker.trackPurchase(newOrder);

    setCheckoutProduct(null);
    alert('✨ Order confirmed successfully!');
    handleNavigate('dashboard');
  };

  // Save to Database on State Update (Debounced)
  useEffect(() => {
    if (!isLoading) {
      const saveTimeout = setTimeout(() => saveDb(state), 1500);
      return () => clearTimeout(saveTimeout);
    }
  }, [state, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Syncing with server...</p>
      </div>
    );
  }

  const selectedProduct = state.products.find(p => p.id === selectedProductId);

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        user={state.currentUser} 
        onNavigate={handleNavigate} 
        cartCount={0}
        onLogout={handleLogout}
        logo={state.hero.logo}
        menus={state.navMenus}
        onSearch={setSearchQuery}
      />
      
      <main className="pb-32 lg:pb-0">
        {currentPage === 'landing' && (
          <LandingPage 
            hero={state.hero} 
            featuredProducts={filteredProducts.filter(p => p.isFeatured)}
            onProductClick={(id) => handleNavigate('product', id)}
            onNavigate={handleNavigate}
            onOrderNow={triggerCheckout}
          />
        )}
        {currentPage === 'shop' && (
          <ShopPage 
            products={filteredProducts}
            onProductClick={(id) => handleNavigate('product', id)}
            onOrderNow={triggerCheckout}
          />
        )}
        {currentPage === 'product' && selectedProduct && (
          <ProductPage 
            product={selectedProduct}
            onOrderNow={triggerCheckout}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'admin' && state.currentUser?.role === 'admin' && (
          <AdminDashboard state={state} setState={setState} />
        )}
        {currentPage === 'dashboard' && (
          <CustomerDashboard 
            user={state.currentUser || { id: 'guest', name: 'Guest', role: 'customer', email: '' }}
            orders={state.orders.filter(o => o.customerId === (state.currentUser?.id || 'guest'))}
            products={state.products}
          />
        )}
        {currentPage === 'login' && <LoginPage onLogin={(u) => { setState(p => ({...p, currentUser: u})); setCurrentPage(u.role === 'admin' ? 'admin' : 'landing'); }} />}
        {currentPage === 'custom' && (
          <div>
            <style dangerouslySetInnerHTML={{ __html: state.customPages.find(p => p.id === selectedCustomPageId)?.css || '' }} />
            <div dangerouslySetInnerHTML={{ __html: state.customPages.find(p => p.id === selectedCustomPageId)?.html || '' }} />
          </div>
        )}
      </main>

      <CheckoutModal 
        isOpen={!!checkoutProduct}
        onClose={() => setCheckoutProduct(null)}
        product={checkoutProduct}
        quantity={checkoutQty}
        onOrder={handleConfirmOrder}
        onUpdateDraft={handleUpdateDraft}
      />

      <MobileBottomNav currentPage={currentPage} onNavigate={handleNavigate} userRole={state.currentUser?.role} />
    </div>
  );
};

export default App;
