import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartProduct } from '../../shared/types';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartService = inject(CartService);
  total: number = 0;
  stringifiedCartProducts: string | null = null;
  @Input() cartProducts = this.cartService.getCartProducts();
  cartIsOpen = this.cartService.cartIsOpen;

  clearCart() {
    this.cartService.setCartProducts([]);
    this.cartService.closeCart();
  }

  calcTotal(cartProducts: CartProduct[]): string {
    let total = 0;
    for (let i = 0; i < cartProducts.length; i++) {
      const cartProduct = cartProducts[i];
      const subtotal = cartProduct.price * cartProduct.quantity;
      total += subtotal;
    }

    return total.toString();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['cartProducts'] &&
      changes['cartProducts'].currentValue.length > 0
    ) {
      const cartProducts = changes['cartProducts'].currentValue;
      this.stringifiedCartProducts = JSON.stringify(cartProducts);
      //console.log(this.stringifiedCartProducts);
      this.total = Number(parseFloat(this.calcTotal(cartProducts)).toFixed(2));
    }
  }
}
