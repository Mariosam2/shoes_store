import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
} from '@angular/core';
import axios from 'axios';
import { HttpResponse, isAxiosError, Product } from '../../types';
import { ProductCardComponent } from '../product-card/product-card.component';
import AppService from '../../app.service';
import { filter, pairwise } from 'rxjs';
import { ActivationEnd, Params, Router } from '@angular/router';
import { FiltersComponent } from '../filters/filters.component';

interface ProductsResponse extends HttpResponse {
  products: Product[];
  pages: number;
}
@Component({
  selector: 'app-shop',
  imports: [ProductCardComponent, FiltersComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  elementRef = inject(ElementRef);
  pages: number | null = null;
  router = new Router();
  loadingMore: boolean;
  subscribed: boolean = false;
  currentPage: number = 1;
  appService = inject(AppService);
  loadMore = async () => {
    this.loadingMore = true;
    console.log(this.pages, this.currentPage);
    if (this.pages && this.currentPage < this.pages) {
      this.currentPage += 1;
      await this.getProducts(this.currentPage, true);
      const skeleton = document.querySelector('.skeleton');
      skeleton?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };
  getProducts = async (page: number, loadMore: boolean = false) => {
    try {
      const response = await axios.get<ProductsResponse>(
        this.appService.apiUrl + `/products?page=${page}`
      );

      //change to append products or smth to keep tack of the previous pages
      if (loadMore) {
        setTimeout(() => {
          this.loadingMore = false;
          this.appService.addProducts(response.data.products);
        }, 1000);
      } else {
        this.appService.setProducts(response.data.products);
      }
      if (!this.pages) {
        this.pages = response.data.pages;
      }
      setTimeout(() => {
        this.appService.setShopLoading(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        this.appService.setShopLoading(false);
      }, 1000);

      if (isAxiosError(err)) {
        this.router.navigateByUrl(
          `/error?status="${err.status}"&message="${err.message}"`
        );
      } else {
        this.router.navigateByUrl(`/error?message="${(err as Error).message}"`);
      }
    }
  };

  isObjEmpty(obj: Params) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }

    return true;
  }

  constructor(router: Router) {
    this.appService.setShopLoading(true);
    this.loadingMore = false;
    if (!this.appService.getIsSubscribedToShopRouteEvents()) {
      router.events
        .pipe(
          filter((e) => e instanceof ActivationEnd),
          pairwise()
        )
        .subscribe((events: ActivationEnd[]) => {
          const snapshot = events[0].snapshot;
          const path = snapshot.url[0].path;
          if (path === 'shop') {
            const queryParams = snapshot.queryParams;

            this.appService.setShopQueryParams(
              this.isObjEmpty(queryParams) ? null : queryParams
            );

            this.appService.setIsShopUrlReady(true);

            localStorage.setItem(
              'shopQueryParams',
              JSON.stringify(queryParams)
            );

            //console.log(path, queryParams);
            //console.log(localStorage);

            this.appService.setIsSubscribedToShopRouteEvents(true);
          }
        });
    }
  }

  async ngOnInit() {
    await this.getProducts(this.currentPage);
  }
}
