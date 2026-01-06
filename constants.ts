
import { ThemeConfig, HomeSection, Category, NavMenu, DiscountConfig } from './types';

export const INITIAL_THEME: ThemeConfig = {
  primaryColor: '#0f172a', 
  accentColor: '#e11d48',  
  backgroundColor: '#f8fafc', 
  fontFamily: 'Inter',
  borderRadius: 'large'
};

export const INITIAL_DISCOUNT: DiscountConfig = {
  isEnabled: true,
  percentage: 10,
  title: 'Wait! A Special Gift for You',
  subtitle: 'Complete your purchase now and get an extra 10% discount on this item.'
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Floral', slug: 'floral' },
  { id: 'cat-2', name: 'Gourmet', slug: 'gourmet' },
  { id: 'cat-3', name: 'Jewelry', slug: 'jewelry' },
  { id: 'cat-4', name: 'Personalized', slug: 'personalized' },
  { id: 'cat-5', name: 'Decor', slug: 'decor' },
  { id: 'cat-6', name: 'Fragrances', slug: 'fragrances' },
  { id: 'cat-7', name: 'Timepieces', slug: 'timepieces' },
  { id: 'cat-8', name: 'Leather Goods', slug: 'leather-goods' },
  { id: 'cat-9', name: 'Wellness', slug: 'wellness' },
  { id: 'cat-10', name: 'Stationery', slug: 'stationery' },
  { id: 'cat-11', name: 'Tech Luxe', slug: 'tech-luxe' },
  { id: 'cat-12', name: 'Hampers', slug: 'hampers' },
  { id: 'cat-13', name: 'Art', slug: 'art' },
  { id: 'cat-14', name: 'Baby Luxe', slug: 'baby-luxe' },
  { id: 'cat-15', name: 'Experiences', slug: 'experiences' }
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
    fullDescription: 'Our signature Eternal Crimson Rose Box features 24 premium preserved roses sourced from the highlands of Ecuador. Each rose is hand-picked at its peak and undergoes a proprietary preservation process.',
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
    fullDescription: 'Indulge in our collection of 16 hand-crafted Belgian truffles. Made with 70% dark cocoa and filled with creamy ganache.',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=800',
    images: ['https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=800'],
    stock: 50, rating: 4.9, reviews: 85, isFeatured: true, createdAt: new Date().toISOString(), salesCount: 120
  },
  // FRAGRANCES
  {
    id: 'p3', slug: 'royal-oud-essence', name: 'Royal Oud Essence', price: 12500, buyingPrice: 8500, category: 'Fragrances',
    shortDescription: 'Deep, woody Arabian oud fragrance.', fullDescription: 'A majestic blend of Cambodian Oud, sandalwood, and spices.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800', stock: 15, rating: 5, reviews: 40, createdAt: new Date().toISOString()
  },
  {
    id: 'p4', slug: 'midnight-jasmine-perfume', name: 'Midnight Jasmine Perfume', price: 8900, buyingPrice: 5500, category: 'Fragrances',
    shortDescription: 'Floral elegance in a crystal bottle.', fullDescription: 'Fresh jasmine petals harvested at dawn, blended with white musk.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800', stock: 20, rating: 4.7, reviews: 30, createdAt: new Date().toISOString()
  },
  {
    id: 'p5', slug: 'sandalwood-luxury-candle', name: 'Sandalwood Luxury Candle', price: 3500, buyingPrice: 1800, category: 'Fragrances',
    shortDescription: 'Hand-poured soy wax candle.', fullDescription: 'Fill your space with the calming aroma of aged sandalwood.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800', stock: 40, rating: 4.9, reviews: 55, createdAt: new Date().toISOString()
  },
  // TIMEPIECES
  {
    id: 'p6', slug: 'gold-heritage-chronograph', name: 'Gold Heritage Chronograph', price: 35000, buyingPrice: 22000, category: 'Timepieces',
    shortDescription: '18k gold plated executive watch.', fullDescription: 'Precision engineering meets timeless luxury.',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800', stock: 5, rating: 5, reviews: 12, isFeatured: true, createdAt: new Date().toISOString()
  },
  {
    id: 'p7', slug: 'minimalist-leather-watch', name: 'Minimalist Leather Watch', price: 12000, buyingPrice: 7000, category: 'Timepieces',
    shortDescription: 'Italian leather strap with sapphire glass.', fullDescription: 'Perfect for the modern professional.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800', stock: 15, rating: 4.8, reviews: 22, createdAt: new Date().toISOString()
  },
  // JEWELRY
  {
    id: 'p8', slug: 'diamond-solitaire-pendant', name: 'Diamond Solitaire Pendant', price: 45000, buyingPrice: 35000, category: 'Jewelry',
    shortDescription: '0.5 carat VVS diamond in white gold.', fullDescription: 'A classic symbol of elegance.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800', stock: 3, rating: 5, reviews: 8, isFeatured: true, createdAt: new Date().toISOString()
  },
  {
    id: 'p9', slug: 'pearl-drop-earrings', name: 'Pearl Drop Earrings', price: 15000, buyingPrice: 9000, category: 'Jewelry',
    shortDescription: 'Swarovski pearls with silver finish.', fullDescription: 'Timeless beauty for special evenings.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800', stock: 10, rating: 4.9, reviews: 18, createdAt: new Date().toISOString()
  },
  {
    id: 'p10', slug: 'rose-gold-cuff-bracelet', name: 'Rose Gold Cuff Bracelet', price: 7500, buyingPrice: 4500, category: 'Jewelry',
    shortDescription: 'Engraved minimalist cuff.', fullDescription: 'Modern rose gold plating with a mirror finish.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800', stock: 25, rating: 4.7, reviews: 45, createdAt: new Date().toISOString()
  },
  // LEATHER GOODS
  {
    id: 'p11', slug: 'italian-leather-wallet', name: 'Italian Leather Wallet', price: 5500, buyingPrice: 3000, category: 'Leather Goods',
    shortDescription: 'Hand-stitched full grain leather.', fullDescription: 'A slim design for the sophisticated man.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800', stock: 30, rating: 4.8, reviews: 60, createdAt: new Date().toISOString()
  },
  {
    id: 'p12', slug: 'executive-briefcase', name: 'Executive Briefcase', price: 18500, buyingPrice: 11000, category: 'Leather Goods',
    shortDescription: 'Premium leather laptop bag.', fullDescription: 'Carry your essentials in ultimate style.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800', stock: 8, rating: 4.9, reviews: 15, createdAt: new Date().toISOString()
  },
  {
    id: 'p13', slug: 'midnight-tote-bag', name: 'Midnight Tote Bag', price: 14500, buyingPrice: 8500, category: 'Leather Goods',
    shortDescription: 'Designer leather tote for women.', fullDescription: 'Handcrafted with premium pebbled leather.',
    image: 'https://images.unsplash.com/photo-1584917033904-493bb3c3cc08?q=80&w=800', stock: 12, rating: 4.7, reviews: 20, createdAt: new Date().toISOString()
  },
  // WELLNESS
  {
    id: 'p14', slug: 'zen-spa-hamper', name: 'Zen Spa Hamper', price: 6500, buyingPrice: 3500, category: 'Wellness',
    shortDescription: 'Ultimate relaxation kit.', fullDescription: 'Includes organic oils, bath salts, and silk robe.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800', stock: 20, rating: 4.9, reviews: 35, createdAt: new Date().toISOString()
  },
  {
    id: 'p15', slug: 'silk-sleep-mask-set', name: 'Silk Sleep Mask Set', price: 2800, buyingPrice: 1200, category: 'Wellness',
    shortDescription: '100% Mulberry silk for deep rest.', fullDescription: 'Available in champagne and midnight blue.',
    image: 'https://images.unsplash.com/photo-1590234024193-f11679093375?q=80&w=800', stock: 50, rating: 4.8, reviews: 80, createdAt: new Date().toISOString()
  },
  // STATIONERY
  {
    id: 'p16', slug: 'executive-fountain-pen', name: 'Executive Fountain Pen', price: 8500, buyingPrice: 4000, category: 'Stationery',
    shortDescription: 'Iridium-tipped nib with silver barrel.', fullDescription: 'Writes like a dream, feels like a legacy.',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800', stock: 15, rating: 5, reviews: 10, createdAt: new Date().toISOString()
  },
  {
    id: 'p17', slug: 'leather-journal-planner', name: 'Leather Journal Planner', price: 4200, buyingPrice: 2000, category: 'Stationery',
    shortDescription: 'Refillable premium paper journal.', fullDescription: 'Document your ideas in luxury.',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=800', stock: 40, rating: 4.7, reviews: 25, createdAt: new Date().toISOString()
  },
  // TECH LUXE
  {
    id: 'p18', slug: 'walnut-wireless-charger', name: 'Walnut Wireless Charger', price: 5800, buyingPrice: 3200, category: 'Tech Luxe',
    shortDescription: 'Handcrafted wood 15W fast charger.', fullDescription: 'A tech essential that looks like art.',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800', stock: 25, rating: 4.9, reviews: 40, createdAt: new Date().toISOString()
  },
  {
    id: 'p19', slug: 'leather-airpods-case', name: 'Leather AirPods Case', price: 2200, buyingPrice: 1000, category: 'Tech Luxe',
    shortDescription: 'Protective shell in premium leather.', fullDescription: 'Classic brown leather with brass clip.',
    image: 'https://images.unsplash.com/photo-1588421357574-87938a86fa28?q=80&w=800', stock: 60, rating: 4.6, reviews: 100, createdAt: new Date().toISOString()
  },
  // HAMPERS
  {
    id: 'p20', slug: 'connoisseur-tea-basket', name: 'Connoisseur Tea Basket', price: 7500, buyingPrice: 4000, category: 'Hampers',
    shortDescription: 'World\'s finest loose leaf teas.', fullDescription: 'Includes English Breakfast, Earl Grey, and Oolong.',
    image: 'https://images.unsplash.com/photo-1544787210-221831c93846?q=80&w=800', stock: 15, rating: 4.8, reviews: 28, createdAt: new Date().toISOString()
  },
  {
    id: 'p21', slug: 'artisan-cheese-board-kit', name: 'Artisan Cheese Board Kit', price: 12500, buyingPrice: 7500, category: 'Hampers',
    shortDescription: 'Curated cheeses and oak board.', fullDescription: 'The perfect gift for the ultimate host.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?q=80&w=800', stock: 10, rating: 4.9, reviews: 14, createdAt: new Date().toISOString()
  },
  // DECOR
  {
    id: 'p22', slug: 'crystal-geometric-vase', name: 'Crystal Geometric Vase', price: 9500, buyingPrice: 5000, category: 'Decor',
    shortDescription: 'Hand-cut lead crystal vase.', fullDescription: 'Refracts light beautifully in any room.',
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=800', stock: 12, rating: 4.7, reviews: 22, createdAt: new Date().toISOString()
  },
  {
    id: 'p23', slug: 'marble-coasters-set', name: 'Marble Coasters Set', price: 3200, buyingPrice: 1500, category: 'Decor',
    shortDescription: 'Italian Carrara marble set of 6.', fullDescription: 'Each piece has unique natural veining.',
    image: 'https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=800', stock: 35, rating: 4.8, reviews: 50, createdAt: new Date().toISOString()
  },
  // ART
  {
    id: 'p24', slug: 'abstract-canvas-series', name: 'Abstract Canvas Series', price: 28000, buyingPrice: 18000, category: 'Art',
    shortDescription: 'Original oil painting on canvas.', fullDescription: 'Vibrant textures and deep emotions.',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800', stock: 2, rating: 5, reviews: 5, isFeatured: true, createdAt: new Date().toISOString()
  },
  {
    id: 'p25', slug: 'sculptural-ceramic-bowl', name: 'Sculptural Ceramic Bowl', price: 11000, buyingPrice: 6000, category: 'Art',
    shortDescription: 'Artist-signed decorative piece.', fullDescription: 'Wabi-sabi inspired handmade pottery.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800', stock: 5, rating: 4.9, reviews: 12, createdAt: new Date().toISOString()
  },
  // BABY LUXE
  {
    id: 'p26', slug: 'cashmere-baby-blanket', name: 'Cashmere Baby Blanket', price: 9500, buyingPrice: 5500, category: 'Baby Luxe',
    shortDescription: 'Ultra-soft pure Mongolian cashmere.', fullDescription: 'The gentlest touch for newborns.',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=800', stock: 10, rating: 5, reviews: 15, createdAt: new Date().toISOString()
  },
  {
    id: 'p27', slug: 'silver-heirloom-rattle', name: 'Silver Heirloom Rattle', price: 12000, buyingPrice: 7000, category: 'Baby Luxe',
    shortDescription: 'Sterling silver classic rattle.', fullDescription: 'A gift that will be cherished for generations.',
    image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=800', stock: 5, rating: 4.9, reviews: 6, createdAt: new Date().toISOString()
  },
  // EXPERIENCES
  {
    id: 'p28', slug: 'gourmet-dining-voucher', name: 'Gourmet Dining Voucher', price: 15000, buyingPrice: 12000, category: 'Experiences',
    shortDescription: '5-course meal for two at Top Deck.', fullDescription: 'Fine dining experience under the stars.',
    image: 'https://images.unsplash.com/photo-1550966842-28c4602f8a81?q=80&w=800', stock: 100, rating: 5, reviews: 24, createdAt: new Date().toISOString()
  },
  {
    id: 'p29', slug: 'helicopter-city-tour', name: 'Helicopter City Tour', price: 45000, buyingPrice: 38000, category: 'Experiences',
    shortDescription: '20-minute private flight over Dhaka.', fullDescription: 'See the city from a new perspective.',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800', stock: 100, rating: 5, reviews: 10, isFeatured: true, createdAt: new Date().toISOString()
  },
  // MORE FLORAL
  {
    id: 'p30', slug: 'sunflower-radiance-bouquet', name: 'Sunflower Radiance Bouquet', price: 2500, buyingPrice: 1200, category: 'Floral',
    shortDescription: 'Bright sunflowers with seasonal fillers.', fullDescription: 'Bring sunshine to someone\'s day.',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800', stock: 30, rating: 4.6, reviews: 38, createdAt: new Date().toISOString()
  },
  {
    id: 'p31', slug: 'orchid-elegance-pot', name: 'Orchid Elegance Pot', price: 5500, buyingPrice: 2800, category: 'Floral',
    shortDescription: 'Twin stem white Phalaenopsis orchid.', fullDescription: 'A graceful addition to any interior.',
    image: 'https://images.unsplash.com/photo-1566996694954-90b052c413c4?q=80&w=800', stock: 15, rating: 4.8, reviews: 19, createdAt: new Date().toISOString()
  },
  // MORE GOURMET
  {
    id: 'p32', slug: 'macaron-tower-luxe', name: 'Macaron Tower Luxe', price: 4800, buyingPrice: 2500, category: 'Gourmet',
    shortDescription: '24 assorted French macarons.', fullDescription: 'Light, airy, and perfectly sweet.',
    image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=800', stock: 25, rating: 4.7, reviews: 42, createdAt: new Date().toISOString()
  },
  {
    id: 'p33', slug: 'dark-roast-coffee-trio', name: 'Dark Roast Coffee Trio', price: 3800, buyingPrice: 1800, category: 'Gourmet',
    shortDescription: 'Single origin roasted beans.', fullDescription: 'Sumatra, Ethiopia, and Brazil blends.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800', stock: 40, rating: 4.9, reviews: 31, createdAt: new Date().toISOString()
  },
  // PERSONALIZED
  {
    id: 'p34', slug: 'engraved-oak-photo-frame', name: 'Engraved Oak Photo Frame', price: 2800, buyingPrice: 1200, category: 'Personalized',
    shortDescription: 'Natural oak with custom text.', fullDescription: 'Cherish your memories in wood.',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800', stock: 50, rating: 4.8, reviews: 55, createdAt: new Date().toISOString()
  },
  {
    id: 'p35', slug: 'custom-initial-pendant', name: 'Custom Initial Pendant', price: 12500, buyingPrice: 7500, category: 'Personalized',
    shortDescription: 'Gold-plated script letter necklace.', fullDescription: 'Made just for you.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800', stock: 100, rating: 4.9, reviews: 20, createdAt: new Date().toISOString()
  },
  // MORE DECOR
  {
    id: 'p36', slug: 'brass-hand-statue', name: 'Brass Hand Statue', price: 6500, buyingPrice: 3500, category: 'Decor',
    shortDescription: 'Antique finished brass sculpture.', fullDescription: 'A statement piece for any desk.',
    image: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=800', stock: 10, rating: 4.7, reviews: 12, createdAt: new Date().toISOString()
  },
  {
    id: 'p37', slug: 'silk-velvet-cushion', name: 'Silk Velvet Cushion', price: 3500, buyingPrice: 1500, category: 'Decor',
    shortDescription: 'Rich emerald velvet with silk piping.', fullDescription: 'Unmatched comfort and luxury.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800', stock: 30, rating: 4.9, reviews: 27, createdAt: new Date().toISOString()
  },
  // FRAGRANCES (extra)
  {
    id: 'p38', slug: 'citrus-bloom-diffuser', name: 'Citrus Bloom Diffuser', price: 4200, buyingPrice: 2000, category: 'Fragrances',
    shortDescription: 'Reed diffuser with natural oils.', fullDescription: 'Long-lasting freshness for your home.',
    image: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=800', stock: 45, rating: 4.8, reviews: 33, createdAt: new Date().toISOString()
  },
  {
    id: 'p39', slug: 'ocean-mist-cologne', name: 'Ocean Mist Cologne', price: 6800, buyingPrice: 3800, category: 'Fragrances',
    shortDescription: 'Sporty and fresh daytime scent.', fullDescription: 'Sea breeze and citrus notes.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800', stock: 20, rating: 4.6, reviews: 18, createdAt: new Date().toISOString()
  },
  {
    id: 'p40', slug: 'vintage-wine-decanter', name: 'Vintage Wine Decanter', price: 8500, buyingPrice: 4500, category: 'Decor',
    shortDescription: 'Hand-blown aerating decanter.', fullDescription: 'Enhance your wine tasting experience.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800', stock: 15, rating: 4.9, reviews: 14, createdAt: new Date().toISOString()
  },
  {
    id: 'p41', slug: 'marble-bookends-set', name: 'Marble Bookends Set', price: 5500, buyingPrice: 2800, category: 'Decor',
    shortDescription: 'Heavy marble L-shaped bookends.', fullDescription: 'Elegant support for your library.',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800', stock: 10, rating: 4.8, reviews: 9, createdAt: new Date().toISOString()
  },
  {
    id: 'p42', slug: 'premium-sushi-kit', name: 'Premium Sushi Kit', price: 9800, buyingPrice: 6000, category: 'Gourmet',
    shortDescription: 'Professional grade sushi making tools.', fullDescription: 'Includes bamboo mats, knives, and rice spoon.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800', stock: 12, rating: 5, reviews: 7, createdAt: new Date().toISOString()
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
