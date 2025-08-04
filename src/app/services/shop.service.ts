import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../shared/types';
import { Params, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ShopService {
  readonly SHOP_PATH: string = 'shop';
  paginatedProducts: Product[] = [];
  activeProduct = signal<Product>(new Product());
  shopLoading = signal<boolean>(false);
  singleProductLoading = signal<boolean>(false);
  shopQueryParams = signal<Params | null>(null);
  isShopUrlReady = signal<boolean>(false);

  addProducts(value: Product[]) {
    this.paginatedProducts = [...this.paginatedProducts, ...value];
  }

  setProducts(value: Product[]) {
    this.paginatedProducts = value;
  }

  getActiveProduct() {
    return this.activeProduct;
  }

  getProductsUntilPage(page: number) {
    return this.paginatedProducts.filter((product) => product.page <= page);
  }
}
