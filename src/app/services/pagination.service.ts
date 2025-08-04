import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  pages = signal<number>(1);
  currentPage = signal<number>(1);

  incrementCurrentPage() {
    if (this.pages() > 1 && this.currentPage < this.pages) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }
}
