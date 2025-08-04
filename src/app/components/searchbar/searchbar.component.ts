import { Component, effect, inject, input } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { debounce } from 'lodash';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-searchbar',
  imports: [RouterLink, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css',
})
export class SearchbarComponent {
  searchService = inject(SearchService);
  apiService = inject(ApiService);
  isHomeRoute = input<boolean>();

  query: string = '';
  showSearchedResults = this.searchService.showSearchedResults;
  searchedProducts = this.searchService.searchProducts;
  debouncedSearch = debounce(
    (query: string) => this.apiService.search(query),
    500
  );

  prova(productUuid: string) {
    this.apiService.getSingleProductAndPushRoute(productUuid);
    this.showSearchedResults.set(false);
  }

  ngOnInit() {
    window.addEventListener('click', (e: Event) => {
      const searchbar = document.querySelector('.searchbar');
      const target = e.target as HTMLElement;
      //console.log(target);
      if (searchbar && !searchbar?.contains(target)) {
        this.searchService.showSearchedResults.set(false);
      }
    });
  }
}
