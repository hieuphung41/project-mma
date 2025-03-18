export interface Image {
    url: string;
    alt: string;
  }
  
  export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    countInStock: number;
    category: string;
    brand: string;
    sizes: string[];
    colors: string[];
    collections: string;
    gender: string;
    images: Image[];
    isFeatured: boolean;
    isPublished: boolean;
  }
  
  export interface AuthUser {
    id: string;
    email: string;
    token: string;
  }
  export interface CartItem {
    product: string;
    name: string;
    image: string[];
    price: number;
    size: string;
    color: string;
    quantity: number;
  }