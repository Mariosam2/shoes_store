import { Injectable, isDevMode } from '@angular/core';
import { environment } from '../environment/environment';
import { prodEnvironment } from '../environment/environtment.prod';
import { Params } from '@angular/router';
import { CartItem, Product } from './types';

@Injectable({
  providedIn: 'root',
})
class AppService {
  isLoading: boolean = false;
  step: number = 1;
  products: Product[] = [];
  apiUrl: string = isDevMode() ? environment.apiURL : prodEnvironment.apiURL;
  stripePublic: string = isDevMode()
    ? environment.stripePublic
    : prodEnvironment.stripePublic;
  stripeSecret: string = isDevMode()
    ? environment.stripeSecret
    : prodEnvironment.stripeSecret;
  shopPath: string = 'shop';
  shopQueryParams: Params | null = null;
  isShopUrlReady: boolean = false;
  isSubscribedToShopRouteEvents: boolean = false;
  cartItems: CartItem[] = [];
  cartIsOpen: boolean = false;

  addProducts(value: Product[]) {
    this.products = [...this.products, ...value];
  }

  setProducts(value: Product[]) {
    this.products = value;
  }

  getProduct(uuid: string) {
    return this.products.find((p) => p.productUuid === uuid);
  }

  getProducts() {
    return this.products;
  }

  getCartIsOpen() {
    return this.cartIsOpen;
  }

  setCartIsOpen(value: boolean) {
    this.cartIsOpen = value;
  }

  getCartItems() {
    return this.cartItems;
  }

  setCartItems(value: CartItem[]) {
    this.cartItems = value;
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  removeQuantityFromCartItem(uuid: string) {
    const findCartItem = this.cartItems.find(
      (item) => item.productUuid === uuid
    );

    if (findCartItem && findCartItem.quantity > 0) {
      if (findCartItem.quantity === 1) {
        this.cartItems = this.cartItems.filter(
          (item) => item.productUuid !== findCartItem.productUuid
        );
      }
      const idx = this.cartItems.indexOf(findCartItem);
      this.cartItems = this.cartItems.map((item, index) => {
        if (index === idx) {
          return {
            ...this.cartItems[idx],
            quantity: (this.cartItems[idx].quantity -= 1),
          };
        }

        return item;
      });
    }
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  addQuantityToCartItem(uuid: string) {
    const findCartItem = this.cartItems.find(
      (item) => item.productUuid === uuid
    );
    if (findCartItem) {
      const idx = this.cartItems.indexOf(findCartItem);
      this.cartItems = this.cartItems.map((item, index) => {
        if (index === idx) {
          return {
            ...this.cartItems[idx],
            quantity: (this.cartItems[idx].quantity += 1),
          };
        }

        return item;
      });
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  }

  addCartItem(value: CartItem) {
    this.cartItems = [...this.cartItems, value];
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  removeCartItem(uuid: string) {
    this.cartItems = this.cartItems.filter((item) => item.productUuid !== uuid);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  getIsSubscribedToShopRouteEvents() {
    return this.isSubscribedToShopRouteEvents;
  }

  setIsSubscribedToShopRouteEvents(value: boolean) {
    this.isSubscribedToShopRouteEvents = value;
  }

  getIsShopUrlReady() {
    return this.isShopUrlReady;
  }

  setIsShopUrlReady(value: boolean) {
    this.isShopUrlReady = value;
  }

  setShopQueryParams(value: Params | null) {
    this.shopQueryParams = value;
  }

  getShopQueryParams() {
    return this.shopQueryParams;
  }

  getShopPath() {
    return this.shopPath;
  }

  setShopPath(value: string) {
    this.shopPath = value;
  }

  setStep(value: number) {
    this.step = value;
  }

  getStep() {
    return this.step;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }
  getIsLoading() {
    return this.isLoading;
  }
}

export default AppService;
