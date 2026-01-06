
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Product, Order, IncompleteOrder, CustomLandingPage, User } from './types';
import { getDb, saveDb, getDefaultState } from './db';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import CustomLandingView from './pages/CustomLandingView';
import OrderTrackingPage from './pages/OrderTrackingPage';
import CheckoutModal from './components/CheckoutModal';
import MobileBottomNav from './components/MobileBottomNav';
import ChatWidget from './components/ChatWidget';
import { tracker } from './trackingService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(getDefaultState());
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedLanding, setSelectedLanding] = useState<CustomLandingPage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutQty, setCheckoutQty] = useState(1);

  // Favicon Injector
  useEffect(() => {
    if (state.header.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = state.header.faviconUrl;
    }
  }, [state.header.faviconUrl]);

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
      } else if (path.startsWith('landing/')) {
        const slug = path.split('/')[1];
        const landing = dbState.customLandings.find(l => l.slug === slug);
        if (landing) { setSelectedLanding(landing); setCurrentPage('custom-landing'); }
      } else if (path.startsWith('track/')) {
        const orderId = path.split('/')[1];
        setTrackingOrderId(orderId);
        setCurrentPage('track');
      } else if (path && path !== 'landing') {
        setCurrentPage(path);
      }
    };
    initApp();
  }, []);

  const handleNavigate = (page: string, slugOrId?: string, bypassAuth: boolean = false) => {
    if (page !== 'track') setTrackingOrderId(null);
    
    if (!bypassAuth && (page === 'dashboard' || page === 'admin') && !state.currentUser) {
      setCurrentPage('login');
      return;
    }

    if (page === 'product' && slugOrId) {
      const product = state.products.find(p => p.slug === slugOrId || p.id === slugOrId);
      if (product) { setSelectedProductId(product.id); setCurrentPage('product'); }
    } else if (page === 'track') {
      if (slugOrId) setTrackingOrderId(slugOrId);
      setCurrentPage('track');
    } else if (page.startsWith('landing/') || (page === 'landing' && slugOrId)) {
      const slug = slugOrId || page.split('/')[1];
      const landing = state.customLandings.find(l => l.slug === slug);
      if (landing) { setSelectedLanding(landing); setCurrentPage('custom-landing'); }
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
        shippingAddress: data.address || '',
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
      customerId: state.currentUser?.id,
      customerName: formData.name,
      customerPhone: formData.phone,
      items: [{ productId: checkoutProduct.id, quantity: checkoutQty, price: checkoutProduct.price }],
      total: subtotal + (formData.deliveryCharge || 0),
      deliveryCharge: formData.deliveryCharge || 0,
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
    alert(`✨ Order confirmed! Your Order ID is: ${orderId}`);
    
    handleNavigate('track', orderId);
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
      {currentPage !== 'custom-landing' && (
        <Navbar 
          user={state.currentUser} 
          onNavigate={handleNavigate} 
          cartCount={0}
          onLogout={() => { setState(p => ({...p, currentUser: null})); setCurrentPage('landing'); }}
          logo={state.hero.logo}
          menus={state.navMenus}
          onSearch={(q) => setSearchQuery(q)}
          config={state.header}
        />
      )}
      
      <main className={currentPage === 'custom-landing' ? '' : 'pb-32 lg:pb-0'}>
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
        {currentPage === 'track' && (
          <OrderTrackingPage 
            orders={state.orders}
            products={state.products}
            initialOrderId={trackingOrderId}
          />
        )}
        {currentPage === 'custom-landing' && selectedLanding && (
          <CustomLandingView page={selectedLanding} />
        )}
        {currentPage === 'admin' && (
          <AdminDashboard state={state} setState={setState} />
        )}
        {currentPage === 'dashboard' && state.currentUser && (
          <CustomerDashboard 
            user={state.currentUser}
            orders={state.orders.filter(o => o.customerId === state.currentUser?.id || o.customerPhone === state.currentUser?.phone || o.customerEmail === state.currentUser?.email)}
            products={state.products}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'login' && (
          <LoginPage 
            onLogin={(u) => { 
              setState(p => ({...p, currentUser: u})); 
              handleNavigate(u.role === 'admin' ? 'admin' : 'dashboard', undefined, true); 
            }} 
            onRegister={(u) => { 
              setState(p => ({...p, currentUser: u})); 
              handleNavigate('dashboard', undefined, true); 
            }}
          />
        )}
      </main>

      {currentPage !== 'admin' && currentPage !== 'custom-landing' && <Footer config={state.footer} onNavigate={handleNavigate} logo={state.hero.logo} />}

      <CheckoutModal 
        isOpen={!!checkoutProduct}
        onClose={() => setCheckoutProduct(null)}
        product={checkoutProduct}
        quantity={checkoutQty}
        onOrder={handleConfirmOrder}
        onUpdateDraft={handleUpdateDraft}
        user={state.currentUser}
      />
      {currentPage !== 'custom-landing' && <MobileBottomNav currentPage={currentPage} onNavigate={handleNavigate} userRole={state.currentUser?.role} />}
      {currentPage !== 'admin' && <ChatWidget state={state} setState={setState} />}
    </div>
  );
};

export default App;
