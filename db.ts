
import { AppState, User } from './types';
import { api } from './api';
import { INITIAL_PRODUCTS, INITIAL_HERO, INITIAL_FOOTER, INITIAL_HEADER, INITIAL_THEME, INITIAL_HOME_SECTIONS, INITIAL_CATEGORIES, INITIAL_NAV_MENUS, INITIAL_CUSTOM_PAGES } from './constants';

export const MASTER_ADMIN: User = {
  id: 'master-1',
  name: 'Master Admin',
  email: 'admin@upoharluxe.com',
  role: 'admin',
  password: 'admin'
};

export const getDefaultState = (): AppState => ({
  products: INITIAL_PRODUCTS,
  categories: INITIAL_CATEGORIES,
  orders: [],
  incompleteOrders: [],
  expenses: [],
  employees: [],
  adminUsers: [MASTER_ADMIN],
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
  customPages: INITIAL_CUSTOM_PAGES,
  navMenus: INITIAL_NAV_MENUS,
  customLandings: []
});

export const getDb = async (): Promise<AppState> => {
  try {
    const remote = await api.fetchState();
    return { ...getDefaultState(), ...remote };
  } catch (error) {
    return getDefaultState();
  }
};

export const saveDb = async (state: AppState) => {
  try { await api.syncFullState(state); } catch (error) {}
};
