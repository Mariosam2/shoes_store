import { Component, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  Category,
  HttpResponse,
  isAxiosError,
  Product,
  Vendor,
} from '../../types';
import axios from 'axios';
import AppService from '../../app.service';
import { Router } from '@angular/router';

interface VendorResponse extends HttpResponse {
  vendors: Vendor[];
}
interface CategoryResponse extends HttpResponse {
  categories: Category[];
}

interface FilterResponse {
  success: boolean;
  filteredResults: Product[];
}

@Component({
  selector: 'app-filters',
  imports: [MatExpansionModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {
  readonly panelOpenState = signal(false);
  elementRef = inject(ElementRef);
  router = new Router();
  appService = inject(AppService);
  vendorFilters: string[] = [];
  vendors: Vendor[] = [];
  categoryFilters: string[] = [];
  categories: Category[] = [];
  priceFilter: number = 0;

  filterProducts = async () => {
    try {
      this.appService.setShopLoading(true);
      const response = await axios.get<FilterResponse>(
        this.appService.apiUrl +
          `/filter?price=${this.priceFilter}&vendors=${this.vendorFilters}&categories=${this.categoryFilters}`
      );
      this.appService.setProducts(response.data.filteredResults);
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

  changeVendors = async () => {
    const checkedCheckboxes = this.elementRef.nativeElement.querySelectorAll(
      '.vendor input[type="checkbox"]:checked'
    );
    this.vendorFilters = Array.from(
      checkedCheckboxes,
      (checkbox: HTMLInputElement) => checkbox.value
    );

    await this.filterProducts();
  };

  changeCategories = async () => {
    const checkedCheckboxes = this.elementRef.nativeElement.querySelectorAll(
      '.category input[type="checkbox"]:checked'
    );
    this.categoryFilters = Array.from(
      checkedCheckboxes,
      (checkbox: HTMLInputElement) => checkbox.value
    );

    await this.filterProducts();
  };

  getCategories = async () => {
    try {
      const response = await axios.get<CategoryResponse>(
        this.appService.apiUrl + '/categories'
      );
      this.categories = response.data.categories;
    } catch (err) {
      if (isAxiosError(err)) {
        this.router.navigateByUrl(
          `/error?status="${err.status}"&message="${err.message}"`
        );
      } else {
        this.router.navigateByUrl(`/error?message="${(err as Error).message}"`);
      }
    }
  };
  getVendors = async () => {
    try {
      const response = await axios.get<VendorResponse>(
        this.appService.apiUrl + '/vendors'
      );
      this.vendors = response.data.vendors;
    } catch (err) {
      if (isAxiosError(err)) {
        this.router.navigateByUrl(
          `/error?status="${err.status}"&message="${err.message}"`
        );
      } else {
        this.router.navigateByUrl(`/error?message="${(err as Error).message}"`);
      }
    }
  };

  async ngOnInit() {
    await this.getVendors();
    await this.getCategories();
  }
}
