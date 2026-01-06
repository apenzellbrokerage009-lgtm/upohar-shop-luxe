
import express from 'express';
import { AppState, Order, Product, Expense } from './types';
import { INITIAL_PRODUCTS, INITIAL_HERO, INITIAL_FOOTER, INITIAL_HEADER, INITIAL_THEME, INITIAL_HOME_SECTIONS, INITIAL_CATEGORIES, INITIAL_DISCOUNT } from './constants';
import { GoogleGenAI } from "@google/genai";

/**
 * MONGODB INTEGRATION (Instructions):
 * 1. To use actual MongoDB, uncomment the mongoose code below.
 * 2. Set MONGODB_URI in your environment variables.
 * 3. The server currently uses an in-memory dbState for the demo.
 */
/*
import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/upoharluxe";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const StateSchema = new mongoose.Schema({ data: Object }, { timestamps: true });
const StateModel = mongoose.model('State', StateSchema);
*/

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }) as any);

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
  discount: INITIAL_DISCOUNT,
  customPages: [],
  navMenus: [],
  customLandings: []
};

app.get('/api/state', (req, res) => {
  res.json(dbState);
});

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

app.listen(PORT, () => console.log(`🚀 Upohar Luxe Backend (TS/Node) at http://localhost:${PORT}`));
