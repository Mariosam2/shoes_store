import { Injectable, signal } from '@angular/core';
import { SearchedProduct } from '../shared/types';

@Injectable({ providedIn: 'root' })
export class SearchService {
  searchProducts = signal<SearchedProduct[]>([]);
  showSearchedResults = signal<boolean>(false);
  searchError = signal<string | null>(null);
}
