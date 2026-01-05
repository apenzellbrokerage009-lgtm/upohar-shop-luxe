import { CourierStats, CourierProfile } from './types';

const PROXY_URL = 'courier-proxy.php';

export const checkCustomerReliability = async (phone: string): Promise<CourierStats | null> => {
  if (!phone || phone.length < 10) return null;
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  
  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone })
    });

    if (!response.ok) throw new Error("Proxy connection failed");
    
    const json = await response.json();

    // BD Courier API returns success in 'success' or 'status' fields
    // Standard structure: { status: 'success', total_orders: 10, total_success: 8, total_cancel: 2, couriers: [...] }
    if (json.status === 'success' || json.total_orders !== undefined) {
      const couriersList: CourierProfile[] = json.couriers || [];
      
      let s = Number(json.total_success || 0);
      let c = Number(json.total_cancel || 0);
      let t = Number(json.total_orders || (s + c));

      return {
        phone: cleanPhone,
        couriers: couriersList,
        status: 'success',
        totalOrders: t,
        totalSuccess: s,
        totalCancel: c,
        successRate: t > 0 ? (s / t) * 100 : 0,
        isRisk: c > 3 && (c / t > 0.3),
        history: `Customer has ${t} recorded orders (${s} Successful, ${c} Cancelled).`
      };
    }
    return null;
  } catch (error) {
    console.error("Fraud Check Error:", error);
    return null;
  }
};