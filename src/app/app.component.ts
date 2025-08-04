import { Component, inject } from '@angular/core';
import { ActivationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import AppService from './services/app.service';
import { Router } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, LoaderComponent, CartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  cartService = inject(CartService);
  appService = inject(AppService);
  router: Router = new Router();

  appLoading = this.appService.appLoading;

  title = 'shoes_store';

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.cartService.closeCart();
        const url = event.snapshot.url[0];
        if (url.path === 'home') {
          this.appService.appLoading.set(true);
        }
      }
    });
    const cartProducts = localStorage.getItem('cartProducts');
    if (cartProducts) {
      this.cartService.setCartProducts(JSON.parse(cartProducts));
    }
  }
}
