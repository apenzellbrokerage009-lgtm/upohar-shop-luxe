
import { AppState, NavMenu } from './types';
import { INITIAL_PRODUCTS, INITIAL_HERO } from './constants';

const API_URL = 'api.php';

const INITIAL_TRACKING = {
  fbPixelId: '', fbAccessToken: '', fbTestCode: '', gtmId: '', gtmServerUrl: '', tiktokId: '', isEnabled: false
};

const INITIAL_MENUS: NavMenu[] = [
  { id: '1', label: 'Home', href: 'landing', isExternal: false },
  { id: '2', label: 'Collection', href: 'shop', isExternal: false },
  { id: '3', label: 'Blog', href: 'blog', isExternal: false },
  { id: '4', label: 'Contact', href: '#', isExternal: true },
];

export const getDefaultState = (): AppState => ({
  products: INITIAL_PRODUCTS,
  orders: [],
  incompleteOrders: [],
  blogPosts: [],
  currentUser: null,
  hero: INITIAL_HERO,
  tracking: INITIAL_TRACKING,
  steadfast: { apiKey: '', secretKey: '', isEnabled: false },
  pathao: { clientId: '', clientSecret: '', username: '', password: '', storeId: '', isEnabled: false },
  customPages: [],
  navMenus: INITIAL_MENUS
});

/**
 * Fetches state from MySQL via PHP
 */
export const getDb = async (): Promise<AppState> => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (!data || Object.keys(data).length === 0) {
      return getDefaultState();
    }
    
    // Safety checks for arrays
    if (!data.products) data.products = INITIAL_PRODUCTS;
    if (!data.orders) data.orders = [];
    if (!data.incompleteOrders) data.incompleteOrders = [];
    if (!data.blogPosts) data.blogPosts = [];
    if (!data.customPages) data.customPages = [];
    if (!data.navMenus) data.navMenus = INITIAL_MENUS;
    
    return data;
  } catch (error) {
    console.warn("DB Load failed, using defaults:", error);
    return getDefaultState();
  }
};

/**
 * Saves state to MySQL via PHP
 */
export const saveDb = async (state: AppState) => {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
  } catch (error) {
    console.error("DB Save failed:", error);
  }
};
