
import { TrackingConfig, Order, Product } from './types';

class TrackingService {
  private config: TrackingConfig | null = null;
  private initialized = false;

  init(config: TrackingConfig) {
    if (!config || !config.isEnabled) return;
    this.config = config;
    
    // Ensure we don't double inject
    if (this.initialized) return;

    // 1. Browser-side Facebook Pixel
    if (config.fbPixelId) {
      this.injectFB(config.fbPixelId);
    }

    // 2. GTM Injection (Prioritizing Server-Side Container)
    if (config.gtmId) {
      this.injectGTM(config.gtmId, config.gtmServerUrl);
    }

    // 3. TikTok Pixel
    if (config.tiktokId) {
      this.injectTikTok(config.tiktokId);
    }

    this.initialized = true;
    console.log("🚀 Tracking Matrix Online (GTM/Pixel/CAPI)");
  }

  private async hashData(data: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(data.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private injectFB(id: string) {
    if (window.fbq) return;
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return; n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    (window as any).fbq('init', id);
    (window as any).fbq('track', 'PageView');
  }

  private injectGTM(id: string, serverUrl?: string) {
    if ((window as any).dataLayer) return;
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const f = document.getElementsByTagName('script')[0];
    const j = document.createElement('script');
    
    // Determine the loader URL: Default GTM or custom Server Container URL
    const baseUrl = serverUrl ? serverUrl.replace(/\/$/, '') : 'https://www.googletagmanager.com';
    j.async = true;
    j.src = `${baseUrl}/gtm.js?id=${id}`;
    f.parentNode?.insertBefore(j, f);
  }

  private injectTikTok(id: string) {
    const script = document.createElement('script');
    script.innerHTML = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n;var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${id}');
        ttq.page();
      }(window, document, 'ttq');
    `;
    document.head.appendChild(script);
  }

  private async sendToFBCAPI(eventName: string, eventId: string, userData: any, customData: any) {
    if (!this.config?.fbAccessToken || !this.config?.fbPixelId) return;

    try {
      const payload = {
        data: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: "website",
          user_data: userData,
          custom_data: customData,
        }],
        test_event_code: this.config.fbTestCode || undefined
      };

      await fetch(`https://graph.facebook.com/v18.0/${this.config.fbPixelId}/events?access_token=${this.config.fbAccessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("CAPI Connection Failed:", e);
    }
  }

  trackPageView(pageName: string) {
    if (!this.config?.isEnabled) return;
    if (window.fbq) window.fbq('track', 'PageView');
    if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'page_view', page_path: pageName });
    if ((window as any).ttq) (window as any).ttq.page();
  }

  trackViewContent(product: Product) {
    if (!this.config?.isEnabled) return;
    const eventId = `vc_${product.id}_${Date.now()}`;
    const data = { 
      content_name: product.name, 
      content_category: product.category, 
      content_ids: [product.id],
      content_type: 'product',
      value: product.price, 
      currency: 'BDT' 
    };

    if (window.fbq) window.fbq('track', 'ViewContent', data, { eventID: eventId });
    if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'view_item', ...data });
    
    this.sendToFBCAPI('ViewContent', eventId, {}, data);
  }

  async trackInitiateCheckout(product: Product, quantity: number) {
    if (!this.config?.isEnabled) return;
    const eventId = `ic_${product.id}_${Date.now()}`;
    const data = { 
      value: product.price * quantity, 
      currency: 'BDT',
      content_ids: [product.id],
      content_type: 'product',
      num_items: quantity
    };

    if (window.fbq) window.fbq('track', 'InitiateCheckout', data, { eventID: eventId });
    if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'begin_checkout', ...data });
    
    this.sendToFBCAPI('InitiateCheckout', eventId, {}, data);
  }

  async trackPurchase(order: Order) {
    if (!this.config?.isEnabled) return;
    const eventId = order.id;
    const hashedEmail = order.customerEmail ? await this.hashData(order.customerEmail) : null;
    const hashedPhone = await this.hashData(order.customerPhone);
    const hashedName = await this.hashData(order.customerName);

    const data = { 
      value: order.total, 
      currency: 'BDT', 
      order_id: order.id,
      content_ids: order.items.map(i => i.productId),
      content_type: 'product'
    };

    // Browser events
    if (window.fbq) window.fbq('track', 'Purchase', data, { eventID: eventId });
    if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'purchase', transaction_id: order.id, ...data });
    
    // Server events (CAPI)
    this.sendToFBCAPI('Purchase', eventId, {
      em: hashedEmail ? [hashedEmail] : undefined,
      ph: [hashedPhone],
      fn: [hashedName.split(' ')[0]],
      ln: [hashedName.split(' ').slice(1).join(' ')]
    }, data);
  }
}

export const tracker = new TrackingService();

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
    dataLayer: any[];
    ttq: any;
  }
}
