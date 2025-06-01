import { Component, inject, Input, SimpleChanges } from '@angular/core';
import AppService from '../../app.service';
import { CartItem } from '../../types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  appService = inject(AppService);
  total: number = 0;
  @Input() cartItems: CartItem[] = [];
  stringifiedCartItems: string | null = null;

  closeCart() {
    this.appService.setCartIsOpen(false);
  }

  clearCart() {
    this.appService.setCartItems([]);
    this.appService.setCartIsOpen(false);
  }

  calcTotal(cartItems: CartItem[]): string {
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];
      const subtotal = cartItem.price * cartItem.quantity;
      total += subtotal;
    }

    return total.toString();
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
    if (changes['cartItems'] && changes['cartItems'].currentValue.length > 0) {
      const cartItems = changes['cartItems'].currentValue;
      this.stringifiedCartItems = JSON.stringify(cartItems);
      this.total = Number(parseFloat(this.calcTotal(cartItems)).toFixed(2));
    }
  }
}
