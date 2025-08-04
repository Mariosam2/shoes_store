export class Product {
  productUuid: string = '';
  description: string = '';
  title: string = '';
  page: number = 1;
  price: number = 0;
  medias: Media[] | null = [];
  category: Category | null = null;
  sizes: Size[] = [];
  vendor: Vendor | null = null;
}

export class Filters {
  vendors: string[];
  categories: string[];
  price: number;

  constructor(vendors: string[], categories: string[], price: number) {
    this.vendors = vendors;
    this.categories = categories;
    this.price = price;
  }
}

export interface Link {
  path: string;
  title: string;
}

export interface SearchedProduct
  extends Pick<
    Product,
    'productUuid' | 'title' | 'price' | 'category' | 'sizes'
  > {
  image: string;
}

export interface CartProduct {
  productUuid: string;
  img: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Size {
  sizeNumber: number;
}

export interface Media {
  path: string;
}

export interface Category {
  categoryUuid: string;
  name: string;
}

export interface Vendor {
  vendorUuid: string;
  name: string;
}

export enum FiltersProps {
  'price',
  'vendors',
  'categories',
}
