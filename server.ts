
import express from 'express';
import { AppState, Order, Product, Expense } from './types';
// Added INITIAL_DISCOUNT to imports
import { INITIAL_PRODUCTS, INITIAL_HERO, INITIAL_FOOTER, INITIAL_HEADER, INITIAL_THEME, INITIAL_HOME_SECTIONS, INITIAL_CATEGORIES, INITIAL_DISCOUNT } from './constants';
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json() as any);

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let dbState: AppState = {
  products: INITIAL_PRODUCTS,
  categories: INITIAL_CATEGORIES,
  orders: [],
  incompleteOrders: [],
  expenses: [],
  employees: [],
  adminUsers: [{ id: 'master-1', name: 'Master Admin', email: 'admin@upoharluxe.com', role: 'admin', password: 'admin' }],
  customers: [],
  // Fix: Added missing chatSessions property to match AppState interface
  chatSessions: [],
  attendance: [],
  payroll: [],
  blogPosts: [],
  currentUser: null,
  hero: INITIAL_HERO,
  header: INITIAL_HEADER,
  footer: INITIAL_FOOTER,
  theme: INITIAL_THEME,
  homeSections: INITIAL_HOME_SECTIONS,
  tracking: { fbPixelId: '', fbAccessToken: '', fbTestCode: '', gtmId: '', gtmServerUrl: '', tiktokId: '', isEnabled: false },
  steadfast: { apiKey: '', secretKey: '', isEnabled: false },
  pathao: { clientId: '', clientSecret: '', username: '', password: '', storeId: '', isEnabled: false },
  // Added missing discount property
  discount: INITIAL_DISCOUNT,
  customPages: [],
  navMenus: [],
  customLandings: []
};

app.get('/api/state', (req, res) => res.json(dbState));
app.post('/api/state', (req, res) => {
  dbState = { ...dbState, ...req.body };
  res.json({ success: true });
});

app.post('/api/ai/description', async (req, res) => {
  const { productName, category } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a luxury marketing description for a gift called "${productName}" in the "${category}" category. Make it sound premium and elegant. Max 80 words.`,
    });
    res.json({ text: response.text });
  } catch (error) {
    res.status(500).json({ error: "AI Generation Failed" });
  }
});

app.post('/api/courier/check', async (req, res) => {
  const { phone } = req.body;
  try {
    const isMockRisk = phone.endsWith('000'); 
    res.json({
      status: 'success',
      total_orders: 15,
      total_success: isMockRisk ? 5 : 14,
      total_cancel: isMockRisk ? 10 : 1,
      couriers: [{ courier: 'Steadfast', total_orders: 10, total_success: 9 }]
    });
  } catch (error) {
    res.status(500).json({ error: "Courier Check Failed" });
  }
});

app.post('/api/courier/dispatch', async (req, res) => {
  const { courier, order, config } = req.body;
  try {
    if (!config.isEnabled) throw new Error(`${courier} is not enabled.`);
    res.json({
      success: true,
      tracking_code: `${courier.toUpperCase()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      message: "Dispatched successfully via Node.js Gateway"
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Upohar Luxe Node.js Backend flowing at http://localhost:${PORT}`));
