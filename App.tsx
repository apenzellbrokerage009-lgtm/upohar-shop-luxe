
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Product, Order, IncompleteOrder } from './types';
import { getDb, saveDb, getDefaultState } from './db';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
  
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutQty, setCheckoutQty] = useState(1);

  // Dynamic Theme Injector
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--var-primary', state.theme.primaryColor);
    root.style.setProperty('--var-accent', state.theme.accentColor);
    root.style.setProperty('--var-bg', state.theme.backgroundColor);
    
    document.body.className = `font-${state.theme.fontFamily.toLowerCase().replace(' ', '-')} rounded-mode-${state.theme.borderRadius}`;
    
    const styleId = 'dynamic-theme-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `
      .bg-var-primary { background-color: var(--var-primary); }
      .bg-var-accent { background-color: var(--var-accent); }
      .bg-var-bg { background-color: var(--var-bg); }
      .text-var-primary { color: var(--var-primary); }
      .text-var-accent { color: var(--var-accent); }
      .border-var-primary { border-color: var(--var-primary); }
      .border-var-accent { border-color: var(--var-accent); }
      body { font-family: '${state.theme.fontFamily}', sans-serif; }
    `;
  }, [state.theme]);

  useEffect(() => {
    const initApp = async () => {
      const dbState = await getDb();
      setState(dbState);
      setIsLoading(false);
      
      const path = window.location.hash.replace('#', '');
      if (path.startsWith('products/')) {
        const slug = path.split('/')[1];
        const p = dbState.products.find(prod => prod.slug === slug);
        if (p) { setSelectedProductId(p.id); setCurrentPage('product'); }
      } else if (path && path !== 'landing') {
        setCurrentPage(path);
      }
    };
    initApp();
  }, []);

  const handleNavigate = (page: string, slugOrId?: string) => {
    if (page === 'product' && slugOrId) {
      const product = state.products.find(p => p.slug === slugOrId || p.id === slugOrId);
      if (product) { setSelectedProductId(product.id); setCurrentPage('product'); }
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerCheckout = (product: Product, quantity: number = 1) => {
    setCheckoutProduct(product);
    setCheckoutQty(quantity);
    tracker.trackInitiateCheckout(product, quantity);
  };

  const handleUpdateDraft = (data: any) => {
    if (!checkoutProduct) return;
    
    setState(prev => {
      const others = prev.incompleteOrders.filter(o => o.id !== data.draftId);
      
      const draft: IncompleteOrder = {
        id: data.draftId,
        customerName: data.name || 'Prospect',
        customerPhone: data.phone || 'N/A',
        items: [{ productId: checkoutProduct.id, quantity: checkoutQty, price: checkoutProduct.price }],
        createdAt: new Date().toISOString(),
        status: 'abandoned'
      };

      if (!data.name && !data.phone) return prev;

      return {
        ...prev,
        incompleteOrders: [draft, ...others]
      };
    });
  };

  const handleConfirmOrder = (formData: any) => {
    if (!checkoutProduct) return;
    const subtotal = checkoutProduct.price * checkoutQty;
    const orderId = Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const newOrder: Order = {
      id: orderId,
      customerName: formData.name,
      customerPhone: formData.phone,
      items: [{ productId: checkoutProduct.id, quantity: checkoutQty, price: checkoutProduct.price }],
      total: subtotal + formData.deliveryCharge,
      deliveryCharge: formData.deliveryCharge,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress: formData.address,
      ipAddress: formData.ipAddress,
      location: formData.location
    };

    setState(prev => ({ 
      ...prev, 
      orders: [newOrder, ...prev.orders],
      incompleteOrders: prev.incompleteOrders.filter(o => o.customerPhone !== formData.phone)
    }));

    tracker.trackPurchase(newOrder);
    setCheckoutProduct(null);
    alert('✨ Order confirmed successfully!');
    handleNavigate('dashboard');
  };

  useEffect(() => {
    if (!isLoading) {
      const saveTimeout = setTimeout(() => saveDb(state), 1500);
      return () => clearTimeout(saveTimeout);
    }
  }, [state, isLoading]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen">
      <Navbar 
        user={state.currentUser} 
        onNavigate={handleNavigate} 
        cartCount={0}
        onLogout={() => setState(p => ({...p, currentUser: null}))}
        logo={state.hero.logo}
        menus={state.navMenus}
        onSearch={(q) => setSearchQuery(q)}
        config={state.header}
      />
      
      <main className="pb-32 lg:pb-0">
        {currentPage === 'landing' && (
          <LandingPage 
            hero={state.hero} 
            products={state.products}
            sections={state.homeSections}
            onProductClick={(slug) => handleNavigate('product', slug)}
            onNavigate={handleNavigate}
            onOrderNow={triggerCheckout}
          />
        )}
        {currentPage === 'shop' && (
          <ShopPage 
            products={state.products}
            categories={state.categories}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onProductClick={(slug) => handleNavigate('product', slug)}
            onOrderNow={triggerCheckout}
          />
        )}
        {currentPage === 'product' && (
          <ProductPage 
            product={state.products.find(p => p.id === selectedProductId)!}
            onOrderNow={triggerCheckout}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'admin' && (
          <AdminDashboard state={state} setState={setState} />
        )}
        {currentPage === 'dashboard' && (
          <CustomerDashboard 
            user={state.currentUser || { id: 'guest', name: 'Guest', role: 'customer', email: '' }}
            orders={state.orders}
            products={state.products}
          />
        )}
        {currentPage === 'login' && <LoginPage onLogin={(u) => { setState(p => ({...p, currentUser: u})); setCurrentPage('landing'); }} />}
      </main>

      {currentPage !== 'admin' && <Footer config={state.footer} onNavigate={handleNavigate} logo={state.hero.logo} />}

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
