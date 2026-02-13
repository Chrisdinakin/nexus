export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  subcategory: string;
  sport: string;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  badge?: 'NEW' | 'SALE' | 'BESTSELLER' | 'LIMITED';
  inStock: boolean;
  features?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Category {
  name: string;
  slug: string;
  image: string;
  subcategories: string[];
}

export interface Brand {
  name: string;
  logo: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
}
