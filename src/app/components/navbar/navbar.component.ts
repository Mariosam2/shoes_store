import { afterNextRender, Component, inject, Input } from '@angular/core';
import {
  ActivationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import gsap from 'gsap';
import AppService from '../../app.service';

interface Link {
  path: string;
  title: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() isLoading: boolean = true;
  appService = inject(AppService);
  showNavbar: boolean = false;
  router = new Router();
  links: Link[] = [
    { path: '/home', title: 'home' },
    { path: '/shop', title: 'shop' },
  ];

  toggleCart() {
    this.appService.setCartIsOpen(!this.appService.getCartIsOpen());
  }

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        const path = event.snapshot.url[0].path;

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
