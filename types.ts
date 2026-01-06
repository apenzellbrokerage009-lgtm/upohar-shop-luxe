
export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  buyingPrice: number;
  category: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  isFeatured?: boolean;
  createdAt?: string;
  salesCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export type UserRole = 'admin' | 'customer' | 'call_center' | 'packaging';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal?: number;
  deliveryCharge: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'call_not_received' | 'partial';
  createdAt: string;
  shippingAddress: string;
  paymentMethod?: string;
  ipAddress?: string;
  location?: { lat: number; lng: number };
}

export interface IncompleteOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress?: string;
  items: any[];
  createdAt: string;
  status: 'abandoned';
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  designation: string;
  salary: number;
  email: string;
  phone: string;
  joinedDate: string;
  status: 'Active' | 'Inactive';
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: 'Inter' | 'Playfair Display' | 'Montserrat' | 'Poppins';
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export interface HomeSection {
  id: string;
  type: 'new_arrivals' | 'best_sellers' | 'category_showcase';
  title: string;
  category?: string;
  limit: number;
  isActive: boolean;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  logo?: string;
}

export interface HeaderConfig {
  announcementText: string;
  announcementBgColor: string;
  announcementTextColor: string;
  logoUrl: string;
  faviconUrl: string;
  isAnnouncementEnabled: boolean;
}

export interface NavMenu {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface FooterConfig {
  aboutText: string;
  address: string;
  phone: string;
  email: string;
  copyright: string;
  columns: FooterColumn[];
  socials: SocialLink[];
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

export interface SteadfastConfig {
  apiKey: string;
  secretKey: string;
  isEnabled: boolean;
}

export interface PathaoConfig {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  storeId: string;
  isEnabled: boolean;
}

export interface CustomLandingPage {
  id: string;
  title: string;
  slug: string;
  html: string;
  css: string;
  js: string;
  productId?: string;
  createdAt: string;
}

export interface CourierProfile {
  courier: string;
  total_orders: number;
  total_success: number;
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
  categories: Category[];
  orders: Order[];
  incompleteOrders: IncompleteOrder[];
  expenses: Expense[];
  employees: Employee[];
  adminUsers: User[];
  customers: User[];
  attendance: any[];
  payroll: any[];
  blogPosts: any[];
  currentUser: User | null;
  hero: HeroSection;
  header: HeaderConfig;
  footer: FooterConfig;
  theme: ThemeConfig;
  homeSections: HomeSection[];
  tracking: TrackingConfig;
  steadfast: SteadfastConfig;
  pathao: PathaoConfig;
  customPages: any[];
  navMenus: NavMenu[];
  customLandings: CustomLandingPage[];
}
