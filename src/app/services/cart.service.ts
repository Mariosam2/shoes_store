import { Injectable, signal } from '@angular/core';
import { CartProduct } from '../shared/types';

@Injectable({ providedIn: 'root' })
export class CartService {
  cartProducts: CartProduct[] = [];
  cartIsOpen = signal<boolean>(false);

  toggleCart() {
    this.cartIsOpen.set(!this.cartIsOpen());
  }

  closeCart() {
    this.cartIsOpen.set(false);
  }
  openCart() {
    this.cartIsOpen.set(true);
  }

  getCartProducts() {
    return this.cartProducts;
  }

  setCartProducts(value: CartProduct[]) {
    this.cartProducts = value;
    localStorage.setItem('cartProducts', JSON.stringify(this.cartProducts));
  }

  removeQuantityFromCartProduct(productUUID: string) {
    const foundCartProduct = this.findCartProduct(productUUID);

    if (foundCartProduct && foundCartProduct.quantity > 0) {
      if (foundCartProduct.quantity === 1) {
        this.cartProducts = this.cartProducts.filter(
          (product) => product.productUuid !== foundCartProduct.productUuid
        );
      }
      const idx = this.cartProducts.indexOf(foundCartProduct);
      this.cartProducts = this.cartProducts.map((product, index) => {
        if (index === idx) {
          return {
            ...this.cartProducts[idx],
            quantity: (this.cartProducts[idx].quantity -= 1),
          };
        }

        return product;
      });
    }
    localStorage.setItem('cartProducts', JSON.stringify(this.cartProducts));
  }

  addQuantityToCartProduct(productUUID: string) {
    const foundCartProduct = this.findCartProduct(productUUID);
    if (foundCartProduct) {
      const foundCartProductIdx = this.cartProducts.indexOf(foundCartProduct);
      this.cartProducts = this.cartProducts.map((product, index) => {
        if (index === foundCartProductIdx) {
          return {
            ...this.cartProducts[foundCartProductIdx],
            quantity: (this.cartProducts[foundCartProductIdx].quantity += 1),
          };
        }

        return product;
      });
      localStorage.setItem('cartProducts', JSON.stringify(this.cartProducts));
    }
  }

  addCartProduct(newCartProduct: CartProduct) {
    this.cartProducts = [...this.cartProducts, newCartProduct];
    localStorage.setItem('cartProducts', JSON.stringify(this.cartProducts));
  }

  removeCartProduct(productUUID: string) {
    this.cartProducts = this.cartProducts.filter(
      (product) => product.productUuid !== productUUID
    );
    localStorage.setItem('cartProducts', JSON.stringify(this.cartProducts));
  }

  findCartProduct(productUUID: string) {
    return this.cartProducts.find(
      (product) => product.productUuid === productUUID
    );
  }
}
