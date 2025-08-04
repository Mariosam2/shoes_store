import { inject, Injectable, signal } from '@angular/core';
import { PaginationService } from './pagination.service';
import AppService from './app.service';
import { Category, Product, Vendor } from '../shared/types';
import { Router } from '@angular/router';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class FiltersService {
  //injecting dependencies
  appService = inject(AppService);
  paginationService = inject(PaginationService);
  router = new Router();

  //categories and vendors

  vendors = signal<Vendor[]>([]);
  categories = signal<Category[]>([]);

  //filters data
  categoryFilters = signal<string[]>([]);
  vendorFilters = signal<string[]>([]);
  priceFilter = signal<number>(0);
  isFiltering = signal<boolean>(false);
  filteredProducts: Product[] = [];
}
