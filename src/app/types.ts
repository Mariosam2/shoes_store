export interface Product {
  productUuid: string;
  description: string;
  title: string;
  price: number;
  medias: Media[];
  vendor: Vendor;
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

interface Media {
  path: string;
}

interface Vendor {
  vendorUuid: string;
  name: string;
}
