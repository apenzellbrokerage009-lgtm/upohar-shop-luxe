import { Order, SteadfastConfig, PathaoConfig } from './types';

/**
 * PROXY REQUIREMENT:
 * The 'courier-proxy.php' file must be in the same root directory as your site.
 */
const PROXY_URL = 'courier-proxy.php'; 

/**
 * Standardize phone to 11 digits
 */
const sanitizePhone = (phone: string): string => {
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 13 && clean.startsWith('880')) return clean.substring(2);
  if (clean.length === 11 && clean.startsWith('0')) return clean;
  return clean;
};

export const dispatchToSteadfast = async (order: Order, config: SteadfastConfig) => {
  if (!config.apiKey || !config.secretKey) {
    throw new Error("Steadfast API Key or Secret Key is missing in Integrations.");
  }

  const cleanPhone = sanitizePhone(order.customerPhone);
  
  const payload = {
    invoice: order.id,
    recipient_name: order.customerName,
    recipient_phone: cleanPhone,
    recipient_address: order.shippingAddress,
    cod_amount: Math.round(order.total),
    note: `Order from Upohar Luxe: ${order.items[0]?.productName || 'Gift'}`
  };

  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: 'https://portal.packzy.com/api/v1/create_order',
        method: 'POST',
        headers: {
          'Api-Key': config.apiKey,
          'Secret-Key': config.secretKey
        },
        data: payload
      })
    });

    const result = await response.json();

    if (result.status === 200 || result.success === true) {
      return {
        success: true,
        trackingCode: result.consignment?.tracking_code || result.tracking_code || order.id,
        status: 'Dispatched'
      };
    } else {
      throw new Error(result.message || "Steadfast API Error");
    }
  } catch (err: any) {
    throw new Error(err.message || "Steadfast dispatch failed.");
  }
};

export const dispatchToPathao = async (order: Order, config: PathaoConfig) => {
  if (!config.clientId || !config.clientSecret || !config.storeId) {
    throw new Error("Pathao credentials incomplete in Integrations.");
  }

  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: 'https://api-hermes.pathao.com/aladdin/api/v1/orders',
        method: 'POST',
        auth: {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          username: config.username,
          password: config.password
        },
        data: {
          store_id: config.storeId,
          merchant_order_id: order.id,
          recipient_name: order.customerName,
          recipient_phone: sanitizePhone(order.customerPhone),
          recipient_address: order.shippingAddress,
          recipient_city: 1, 
          recipient_zone: 1,
          recipient_area: 1,
          delivery_type: 48,
          item_type: 2,
          item_quantity: 1,
          amount_to_collect: Math.round(order.total),
          item_description: "Premium Gift"
        }
      })
    });

    const result = await response.json();
    if (result.type === 'success' || result.status === 'success') {
      return {
        success: true,
        trackingCode: result.data?.consignment_id || result.tracking_code,
        status: 'Dispatched'
      };
    } else {
      throw new Error(result.message || "Pathao Error");
    }
  } catch (err: any) {
    throw new Error(err.message || "Pathao dispatch failed.");
  }
};