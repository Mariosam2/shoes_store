import { Component, effect, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { Category, Filters, Vendor } from '../../shared/types';
import AppService from '../../services/app.service';
import { Router } from '@angular/router';
import { PaginationService } from '../../services/pagination.service';
import { FiltersService } from '../../services/filters.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-filters',
  imports: [MatExpansionModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {
  elementRef = inject(ElementRef);
  apiService = inject(ApiService);
  appService = inject(AppService);
  filtersService = inject(FiltersService);
  paginationService = inject(PaginationService);
  router = new Router();

  currentPage = this.paginationService.currentPage;
  pages = this.paginationService.pages;
  vendors = this.filtersService.vendors;
  categories = this.filtersService.categories;
  categoryFilters = this.filtersService.categoryFilters;
  vendorFilters = this.filtersService.vendorFilters;
  priceFilter = this.filtersService.priceFilter;
  isFiltering = this.filtersService.isFiltering;

  openPanel = signal<boolean>(false);

  changeVendors = async () => {
    const checkedCheckboxes = this.elementRef.nativeElement.querySelectorAll(
      '.vendor input[type="checkbox"]:checked'
    );

    this.vendorFilters.set(
      Array.from(
        checkedCheckboxes,
        (checkbox: HTMLInputElement) => checkbox.value
      )
    );
  };

  changeCategories = async () => {
    const checkedCheckboxes = this.elementRef.nativeElement.querySelectorAll(
      '.category input[type="checkbox"]:checked'
    );

    this.categoryFilters.set(
      Array.from(
        checkedCheckboxes,
        (checkbox: HTMLInputElement) => checkbox.value
      )
    );
  };

  changePrice = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.priceFilter.set(Number(target.value));
  };

  constructor() {
    effect(() => {
      const vendorFilters = this.vendorFilters();
      const categoryFilters = this.categoryFilters();
      const priceFilter = this.priceFilter();

      if (
        vendorFilters.length > 0 ||
        categoryFilters.length > 0 ||
        priceFilter > 0
      ) {
        this.isFiltering.set(true);
        this.currentPage.set(1);
      }
    });
  }

  async ngOnInit() {
    await this.apiService.getCategories();
    await this.apiService.getVendors();
  }
}
