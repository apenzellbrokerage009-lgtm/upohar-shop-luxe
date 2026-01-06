
import { ThemeConfig, HomeSection, Category, NavMenu } from './types';

export const INITIAL_THEME: ThemeConfig = {
  primaryColor: '#0f172a', 
  accentColor: '#e11d48',  
  backgroundColor: '#f8fafc', 
  fontFamily: 'Inter',
  borderRadius: 'large'
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Floral', slug: 'floral' },
  { id: 'cat-2', name: 'Gourmet', slug: 'gourmet' },
  { id: 'cat-3', name: 'Jewelry', slug: 'jewelry' },
  { id: 'cat-4', name: 'Personalized', slug: 'personalized' },
  { id: 'cat-5', name: 'Decor', slug: 'decor' }
];

export const CATEGORIES = INITIAL_CATEGORIES.map(cat => cat.name);

export const INITIAL_NAV_MENUS: NavMenu[] = [
  { id: 'm1', label: 'Home', href: 'landing' },
  { id: 'm2', label: 'Collections', href: 'shop' },
  { id: 'm3', label: 'About Luxe', href: 'about' },
  { id: 'm4', label: 'Concierge', href: 'contact' }
];

export const INITIAL_CUSTOM_PAGES: any[] = [
  {
    id: 'p1',
    title: 'About Upohar Luxe',
    slug: 'about',
    content: 'Upohar Luxe is Bangladesh\'s premier destination for luxury gifting, founded on the principle that every gift tells a story. We curate the world\'s finest roses, chocolates, and artisan goods to help you celebrate life\'s most precious moments.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p2',
    title: 'Gifting Concierge',
    slug: 'contact',
    content: 'Need help choosing the perfect gift? Our concierge team is available 24/7. Email: concierge@upoharluxe.com | WhatsApp: +880 1700-000000',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_HOME_SECTIONS: HomeSection[] = [
  { id: '1', type: 'new_arrivals', title: 'New Arrivals', limit: 4, isActive: true },
  { id: '2', type: 'best_sellers', title: 'Best Selling Gifts', limit: 4, isActive: true },
  { id: '3', type: 'category_showcase', title: 'Exquisite Florals', category: 'Floral', limit: 4, isActive: true }
];

export const INITIAL_PRODUCTS: any[] = [
  {
    id: '1',
    slug: 'eternal-crimson-rose-box',
    name: 'Eternal Crimson Rose Box',
    price: 4500,
    buyingPrice: 2800,
    category: 'Floral',
    shortDescription: '24 preserved red roses that last over a year.',
    fullDescription: 'Our signature Eternal Crimson Rose Box features 24 premium preserved roses sourced from the highlands of Ecuador. Each rose is hand-picked at its peak and undergoes a proprietary preservation process that maintains its natural beauty and texture for months.',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800'],
    stock: 25, rating: 4.8, reviews: 120, isFeatured: true, createdAt: new Date().toISOString(), salesCount: 50
  },
  {
    id: '2',
    slug: 'artisan-belgian-truffle-box',
    name: 'Artisan Belgian Truffle Box',
    price: 3200,
    buyingPrice: 1850,
    category: 'Gourmet',
    shortDescription: '16 pieces of hand-crafted exotic Belgian chocolates.',
    fullDescription: 'Indulge in our collection of 16 hand-crafted Belgian truffles. Made with 70% dark cocoa and filled with creamy ganache, these truffles offer a variety of flavors from sea salt caramel to dark raspberry.',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=800',
    images: ['https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=800'],
    stock: 50, rating: 4.9, reviews: 85, isFeatured: true, createdAt: new Date().toISOString(), salesCount: 120
  }
];

export const INITIAL_HERO: any = { 
  title: 'Elevate the Art of Gifting', 
  subtitle: 'Discover curated premium collections.', 
  image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040', 
  ctaText: 'Shop the Collection',
  logo: '' 
};

export const INITIAL_HEADER: any = { announcementText: '✨ 50% discount for this month! Order Now ✨', announcementBgColor: '#0f172a', announcementTextColor: '#ffffff', logoUrl: '', faviconUrl: '', isAnnouncementEnabled: true };

export const INITIAL_FOOTER: any = { 
  aboutText: 'Upohar Luxe is Bangladesh\'s premier destination for luxury gifting.', 
  address: 'Level 4, High-End Plaza, Gulshan 2, Dhaka', 
  phone: '+880 1700-000000', 
  email: 'concierge@upoharluxe.com', 
  copyright: '© 2024 Upohar Luxe.', 
  columns: [], 
  socials: [
    { platform: 'Facebook', url: 'https://facebook.com/upoharluxe' },
    { platform: 'Instagram', url: 'https://instagram.com/upoharluxe' }
  ] 
};
