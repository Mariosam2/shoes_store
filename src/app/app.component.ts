import { Component, inject } from '@angular/core';
import {
  ActivationEnd,
  RouteConfigLoadEnd,
  RouterOutlet,
} from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import AppService from './app.service';
import { Router } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, LoaderComponent, CartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  router: Router = new Router();
  title = 'shoes_store';
  appService = inject(AppService);
  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.appService.setCartIsOpen(false);
        const url = event.snapshot.url[0];
        if (url.path === 'home') {
          this.appService.setIsLoading(true);
        }
      }
    });
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      this.appService.setCartItems(JSON.parse(cartItems));
    }
  }
}
