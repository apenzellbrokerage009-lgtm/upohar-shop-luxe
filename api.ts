
import { AppState, Product, Order, Expense } from './types';

class ApiService {
  private baseUrl = '/api';

  async fetchState(): Promise<AppState> {
    const res = await fetch(`${this.baseUrl}/state`);
    if (!res.ok) throw new Error("Backend offline");
    return res.json();
  }

  async syncFullState(state: AppState): Promise<void> {
    await fetch(`${this.baseUrl}/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
  }
}

export const api = new ApiService();
