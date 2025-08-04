import { afterNextRender, Component, inject, Input } from '@angular/core';
import {
  ActivationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import gsap from 'gsap';
import AppService from '../../services/app.service';
import { CartService } from '../../services/cart.service';
import { Link } from '../../shared/types';
import { SearchbarComponent } from '../searchbar/searchbar.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, SearchbarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  appService = inject(AppService);
  cartService = inject(CartService);

  @Input() isLoading: boolean = true;
  showNavbar: boolean = false;
  isHomeRoute: boolean = false;
  router = new Router();
  links: Link[] = [
    { path: '/home', title: 'home' },
    { path: '/shop', title: 'shop' },
  ];

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.isHomeRoute = false;
        const path = event.snapshot.url[0].path;
        if (path === 'home') {
          this.isHomeRoute = true;
        }

        if (path === 'checkout' || path === 'after-payment') {
          this.showNavbar = false;
        } else {
          this.showNavbar = true;
        }
      }
    });

    afterNextRender(() => {
      if (this.showNavbar) {
        gsap.fromTo('.logo', { opacity: 0 }, { duration: 0.5, opacity: 1 });
        gsap.fromTo(
          '.right-nav',
          { opacity: 0 },
          { duration: 0.5, opacity: 1 }
        );
      }
    });
  }
}
