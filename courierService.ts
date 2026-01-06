
import { CourierStats, CourierProfile } from './types';

export const checkCustomerReliability = async (phone: string): Promise<CourierStats | null> => {
  if (!phone || phone.length < 10) return null;
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  
  try {
    const response = await fetch('/api/courier/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone })
    });

    if (!response.ok) throw new Error("Backend connection failed");
    
    const json = await response.json();

    if (json.status === 'success' || json.total_orders !== undefined) {
      const couriersList: CourierProfile[] = json.couriers || [];
      
      let s = Number(json.total_success || 0);
      let c = Number(json.total_cancel || 0);
      let t = Number(json.total_orders || (s + c));

      const successRate = t > 0 ? (s / t) * 100 : 0;
      const isRisk = c > 2 && (successRate < 70);

      return {
        phone: cleanPhone,
        couriers: couriersList,
        status: 'success',
        totalOrders: t,
        totalSuccess: s,
        totalCancel: c,
        successRate: successRate,
        isRisk: isRisk,
        history: t > 0 
          ? `Node.js Scan: Validated ${t} total transactions. Found ${c} breaches and ${s} successful delivery protocols.`
          : `No prior transaction history found in the Node.js central database.`
      };
    }
    return null;
  } catch (error) {
    console.error("Courier Service Error:", error);
    return null;
  }
};
