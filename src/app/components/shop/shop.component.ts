import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
} from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FiltersComponent } from '../filters/filters.component';
import { ApiService } from '../../services/api.service';
import { PaginationService } from '../../services/pagination.service';
import { ShopService } from '../../services/shop.service';
import { Filters, Product } from '../../shared/types';
import { FiltersService } from '../../services/filters.service';
import { ProductCardSkeletonComponent } from '../product-card-skeleton/product-card-skeleton.component';
@Component({
  selector: 'app-shop',
  imports: [
    ProductCardComponent,
    FiltersComponent,
    ProductCardSkeletonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  elementRef = inject(ElementRef);
  apiService = inject(ApiService);
  shopService = inject(ShopService);
  paginationService = inject(PaginationService);
  filtersService = inject(FiltersService);

  categoryFilters = this.filtersService.categoryFilters;
  vendorFilters = this.filtersService.vendorFilters;
  priceFilter = this.filtersService.priceFilter;
  isFiltering = this.filtersService.isFiltering;
  currentPage = this.paginationService.currentPage;
  pages = this.paginationService.pages;
  shopLoading = this.shopService.shopLoading;
  dummyCards = new Array(4).fill(0);

  constructor() {
    effect(async () => {
      const currentPage = this.currentPage();
      const isFiltering = this.isFiltering();
      if (isFiltering) {
        this.apiService.getOrFilterProducts(
          currentPage,
          new Filters(
            this.vendorFilters(),
            this.categoryFilters(),
            this.priceFilter()
          )
        );
      } else {
        await this.apiService.getOrFilterProducts(currentPage);
      }
    });
  }
}
