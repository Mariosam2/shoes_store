import { afterNextRender, Component, inject, Input } from '@angular/core';
import {
  ActivationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import AppService from '../../app.service';
import { HttpResponse, SearchedProduct } from '../../types';
import axios from 'axios';
import { debounce } from 'lodash';

interface SearchResponse extends HttpResponse {
  results: {
    products: SearchedProduct[];
    categories: [];
  };
}

interface Link {
  path: string;
  title: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() isLoading: boolean = true;
  query: string = '';
  searchError: string | null = '';
  searchProducts: SearchedProduct[] = [];
  appService = inject(AppService);
  showNavbar: boolean = false;
  isHomeRoute: boolean = false;
  router = new Router();
  links: Link[] = [
    { path: '/home', title: 'home' },
    { path: '/shop', title: 'shop' },
  ];

  search = async () => {
    //console.log('search', this.query);
    if (this.query.trim() !== '') {
      try {
        const response = await axios.get<SearchResponse>(
          this.appService.apiUrl + `/products/search?query=${this.query}`
        );
        this.searchProducts = response.data.results.products;
        this.appService.setShowResults(true);
      } catch (error) {
        this.searchError = (error as Error).message;
      }
    }
  };

  debouncedSearch = debounce(this.search, 500);

  toggleCart() {
    this.appService.setCartIsOpen(!this.appService.getCartIsOpen());
  }

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

      window.addEventListener('click', (e: Event) => {
        const searchbar = document.querySelector('.searchbar');
        const target = e.target as Node;
        //console.log(target);
        if (searchbar && !searchbar?.contains(target)) {
          this.appService.setShowResults(false);
        }
      });
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
