export interface Product {
  productUuid: string;
  description: string;
  title: string;
  price: number;
  medias: Media[];
  category: Category;
  sizes: Size[];
  vendor: Vendor;
}

export interface SearchedProduct
  extends Pick<
    Product,
    'productUuid' | 'title' | 'price' | 'category' | 'sizes'
  > {
  image: string;
}

export interface HttpResponse {
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
export interface CartItem {
  productUuid: string;
  img: string;
  title: string;
  price: number;
  quantity: number;
}

interface Size {
  sizeNumber: number;
}

interface Media {
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
