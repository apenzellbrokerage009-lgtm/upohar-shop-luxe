
import { Product, Category, HeroSection } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Eternal Crimson Rose Box',
    price: 4500,
    category: 'Floral',
    shortDescription: '24 preserved red roses that last over a year.',
    fullDescription: 'Our signature Eternal Crimson Rose Box features 24 premium preserved roses sourced from the highlands of Ecuador. Using a proprietary non-toxic preservation process, these roses maintain their fresh-cut appearance and texture for at least 12 months without any water or sunlight.',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800',
      'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?q=80&w=800',
      'https://images.unsplash.com/photo-1582289545106-efecf907f21e?q=80&w=800'
    ],
    stock: 25,
    rating: 4.8,
    reviews: 120,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Artisan Belgian Truffle Box',
    price: 3200,
    category: 'Gourmet',
    shortDescription: '16 pieces of hand-crafted exotic Belgian chocolates.',
    fullDescription: 'Indulge in our collection of 16 hand-crafted Belgian truffles. Each piece is a masterpiece, featuring rare ingredients like Madagascar vanilla, Himalayan sea salt caramel, and Belgian dark chocolate ganache.',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=800',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800'
    ],
    stock: 50,
    rating: 4.9,
    reviews: 85,
    isFeatured: true
  }
];

export const INITIAL_HERO: HeroSection = {
  title: 'Elevate the Art of Gifting',
  subtitle: 'Discover curated premium collections for your most precious moments.',
  image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040',
  ctaText: 'Shop the Collection'
};

export const CATEGORIES: Category[] = ['Floral', 'Gourmet', 'Jewelry', 'Personalized', 'Decor'];
