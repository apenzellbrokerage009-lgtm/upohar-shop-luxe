
import { Order, SteadfastConfig, PathaoConfig } from './types';

export const dispatchToSteadfast = async (order: Order, config: SteadfastConfig) => {
  if (!config.apiKey || !config.secretKey) {
    throw new Error("Steadfast credentials incomplete.");
  }

  try {
    const response = await fetch('/api/courier/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courier: 'steadfast',
        order,
        config
      })
    });

    const result = await response.json();
    if (result.success) {
      return {
        success: true,
        trackingCode: result.tracking_code,
        status: 'Dispatched'
      };
    } else {
      throw new Error(result.message || "Steadfast dispatch failed.");
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const dispatchToPathao = async (order: Order, config: PathaoConfig) => {
  if (!config.clientId || !config.clientSecret) {
    throw new Error("Pathao credentials incomplete.");
  }

  try {
    const response = await fetch('/api/courier/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courier: 'pathao',
        order,
        config
      })
    });

    const result = await response.json();
    if (result.success) {
      return {
        success: true,
        trackingCode: result.tracking_code,
        status: 'Dispatched'
      };
    } else {
      throw new Error(result.message || "Pathao dispatch failed.");
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
};
