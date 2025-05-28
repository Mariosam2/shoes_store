export interface Product {
  productUuid: string;
  description: string;
  title: string;
  price: number;
  medias: Media[];
  vendor: Vendor;
}

interface Media {
  path: string;
}

interface Vendor {
  vendorUuid: string;
  name: string;
}
