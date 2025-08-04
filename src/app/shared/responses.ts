import { Category, Product, SearchedProduct, Vendor } from './types';

interface HttpResponse {
  success: boolean;
}

export interface AxiosError extends Error {
  status: number;
}

export const isAxiosError = (obj: unknown): obj is AxiosError => {
  if (obj) {
    return typeof (obj as AxiosError).status === 'number';
  }
  return false;
};

export interface ProductsResponse extends HttpResponse {
  products: Product[];
  pages: number;
}

export interface SingleProductResponse extends HttpResponse {
  product: Product;
}

export interface SearchResponse extends HttpResponse {
  results: {
    products: SearchedProduct[];
    categories: [];
  };
}

export interface CategoryResponse extends HttpResponse {
  categories: Category[];
}

export interface VendorResponse extends HttpResponse {
  vendors: Vendor[];
}

export interface CreateCheckoutResponse extends HttpResponse {
  clientSecret: string;
}
