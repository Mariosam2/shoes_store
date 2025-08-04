import { inject, Injectable, isDevMode, WritableSignal } from '@angular/core';
import { environment } from '../../environment/environment';
import { prodEnvironment } from '../../environment/environtment.prod';
import axios from 'axios';
import {
  CategoryResponse,
  ProductsResponse,
  SearchResponse,
  SingleProductResponse,
  VendorResponse,
} from '../shared/responses';
import { PaginationService } from './pagination.service';
import { isAxiosError } from '../shared/responses';
import { Router } from '@angular/router';
import { Filters } from '../shared/types';
import { ShopService } from './shop.service';
import { SearchService } from './search.service';
import { FiltersService } from './filters.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  //Inject dependencies
  shopService = inject(ShopService);
  paginationService = inject(PaginationService);
  searchService = inject(SearchService);
  filtersService = inject(FiltersService);
  router = new Router();

  apiUrl: string = isDevMode() ? environment.apiURL : prodEnvironment.apiURL;

  delayLoadingFinish(loading: WritableSignal<boolean>) {
    setTimeout(() => {
      loading.set(false);
    }, 1000);
  }

  async GET_PRODUCTS(page: number): Promise<ProductsResponse> {
    const response = await axios.get<ProductsResponse>(
      this.apiUrl + `/products?page=${page}`
    );
    return response.data;
  }

  async GET_SINGLE_PRODUCT(productUUID: string) {
    const response = await axios.get<SingleProductResponse>(
      this.apiUrl + `/products/${productUUID}`
    );

    return response.data;
  }

  async FILTER_PRODUCTS(
    page: number,
    filters: Filters
  ): Promise<ProductsResponse> {
    const response = await axios.get<ProductsResponse>(
      this.apiUrl +
        `/filter?price=${filters.price}&vendors=${filters.vendors}&categories=${filters.categories}&page=${page}`
    );
    return response.data;
  }

  async SEARCH(query: string) {
    const response = await axios.get<SearchResponse>(
      this.apiUrl + `/products/search?query=${query}`
    );

    return response.data;
  }

  async GET_CATEGORIES() {
    const response = await axios.get<CategoryResponse>(
      this.apiUrl + '/categories'
    );

    return response.data;
  }

  async GET_VENDORS() {
    const response = await axios.get<VendorResponse>(this.apiUrl + '/vendors');
    return response.data;
  }

  getSingleProductAndPushRoute = async (productUUID: string) => {
    try {
      this.shopService.singleProductLoading;
      const singleProductResponse = await this.GET_SINGLE_PRODUCT(productUUID);
      this.shopService.activeProduct.set(singleProductResponse.product);
      this.delayLoadingFinish(this.shopService.singleProductLoading);
      this.router.navigateByUrl(`/product/${productUUID}`);
    } catch (error) {
      this.delayLoadingFinish(this.shopService.singleProductLoading);
      if (isAxiosError(error)) {
        this.router.navigateByUrl(
          `/error?status="${error.status}"&message="${error.message}"`
        );
      } else {
        this.router.navigateByUrl(
          `/error?message="${(error as Error).message}"`
        );
      }
    }
  };

  async getOrFilterProducts(page: number, filters?: Filters) {
    try {
      this.shopService.shopLoading.set(true);
      const productsResponse = filters
        ? await this.FILTER_PRODUCTS(page, filters)
        : await this.GET_PRODUCTS(page);

      if (page > 1) this.shopService.addProducts(productsResponse.products);
      else this.shopService.setProducts(productsResponse.products);

      this.paginationService.pages.set(productsResponse.pages);
      this.delayLoadingFinish(this.shopService.shopLoading);
    } catch (error) {
      this.delayLoadingFinish(this.shopService.shopLoading);
      if (isAxiosError(error)) {
        this.router.navigateByUrl(
          `/error?status="${error.status}"&message="${error.message}"`
        );
      } else {
        this.router.navigateByUrl(
          `/error?message="${(error as Error).message}"`
        );
      }
    }
  }

  async search(query: string) {
    console.log('search', query);
    this.searchService.searchError.set(null);
    console.log(query.trim() !== '');
    if (query.trim() !== '') {
      try {
        const searchResponse = await this.SEARCH(query);
        this.searchService.searchProducts.set(searchResponse.results.products);
        this.searchService.showSearchedResults.set(true);
      } catch (error) {
        console.log(error);
        this.searchService.searchError.set((error as Error).message);
      }
    }
  }

  getCategories = async () => {
    try {
      const categoriesResponse = await this.GET_CATEGORIES();
      this.filtersService.categories.set(categoriesResponse.categories);
    } catch (error) {
      if (isAxiosError(error)) {
        this.router.navigateByUrl(
          `/error?status="${error.status}"&message="${error.message}"`
        );
      } else {
        this.router.navigateByUrl(
          `/error?message="${(error as Error).message}"`
        );
      }
    }
  };

  getVendors = async () => {
    try {
      const vendorsResponse = await this.GET_VENDORS();
      this.filtersService.vendors.set(vendorsResponse.vendors);
    } catch (error) {
      if (isAxiosError(error)) {
        this.router.navigateByUrl(
          `/error?status="${error.status}"&message="${error.message}"`
        );
      } else {
        this.router.navigateByUrl(
          `/error?message="${(error as Error).message}"`
        );
      }
    }
  };
}
