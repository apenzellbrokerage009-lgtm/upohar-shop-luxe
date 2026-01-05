
export type Category = 'Floral' | 'Gourmet' | 'Jewelry' | 'Personalized' | 'Decor';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  image: string; // Keep for backwards compatibility/thumbnail
  stock: number;
  rating: number;
  reviews: number;
  isFeatured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

export interface NavMenu {
  id: string;
  label: string;
  href: string;
  isExternal: boolean;
}

export interface OrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
  customerEmail?: string;
  trackingCode?: string;
  courierUsed?: string;
}

export interface IncompleteOrder {
  id: string;
  name: string;
  phone: string;
  address: string;
  productId: string;
  productName: string;
  quantity: number;
  deliveryCharge?: number;
  timestamp: string;
  lastUpdated: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  name: string;
  avatar?: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  logo?: string;
}

export interface CustomPage {
  id: string;
  slug: string;
  productId: string;
  title: string;
  html: string;
  css: string;
  isActive: boolean;
}

export interface TrackingConfig {
  fbPixelId: string;
  fbAccessToken: string;
  fbTestCode: string;
  gtmId: string;
  gtmServerUrl: string;
  tiktokId: string;
  isEnabled: boolean;
}

export interface SteadfastConfig { apiKey: string; secretKey: string; isEnabled: boolean; }
export interface PathaoConfig { clientId: string; clientSecret: string; username: string; password: string; storeId: string; isEnabled: boolean; }

// Added CourierProfile and CourierStats to resolve missing exports used in courierService.ts
export interface CourierProfile {
  courier_name?: string;
  total_orders?: number;
  success_orders?: number;
  cancelled_orders?: number;
}

export interface CourierStats {
  phone: string;
  couriers: CourierProfile[];
  status: string;
  totalOrders: number;
  totalSuccess: number;
  totalCancel: number;
  successRate: number;
  isRisk: boolean;
  history: string;
}

export interface AppState {
  products: Product[];
  orders: Order[];
  incompleteOrders: IncompleteOrder[];
  blogPosts: BlogPost[];
  currentUser: User | null;
  hero: HeroSection;
  tracking: TrackingConfig;
  steadfast: SteadfastConfig;
  pathao: PathaoConfig;
  customPages: CustomPage[];
  navMenus: NavMenu[];
}
