import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import axios from 'axios';
import { AxiosError, isAxiosError, Product } from '../../types';
import { ProductCardComponent } from '../product-card/product-card.component';
import AppService from '../../app.service';
import { filter, pairwise } from 'rxjs';
import { ActivationEnd, Params, Router } from '@angular/router';

interface ProductsResponse {
  success: boolean;
  products: Product[];
}
@Component({
  selector: 'app-shop',
  imports: [ProductCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  router = new Router();
  loading: boolean;
  subscribed: boolean = false;
  currentPage: number = 1;
  appService = inject(AppService);
  getProducts = async () => {
    try {
      const response = await axios.get<ProductsResponse>(
        this.appService.apiUrl + `/products?page=${this.currentPage}`
      );
      this.appService.setProducts(response.data.products);
      setTimeout(() => {
        this.loading = false;
      }, 500);
    } catch (err) {
      setTimeout(() => {
        this.loading = false;
      }, 500);

      /*  if (isAxiosError(err)) {
        this.router.navigateByUrl(
          `/error?status="${err.status}"&message="${err.message}"`
        );
      } else {
        this.router.navigateByUrl(`/error?message="${(err as Error).message}"`);
      } */
      this.router.navigateByUrl(`/error?message="${(err as Error).message}"`);
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
    this.loading = true;
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

  ngOnInit() {
    this.getProducts();
  }
}
