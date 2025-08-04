import { Component, inject, Input } from '@angular/core';
import { Product } from '../../shared/types';
import { Router } from '@angular/router';
import { PaginationService } from '../../services/pagination.service';
import { ShopService } from '../../services/shop.service';
import { ProductCardSkeletonComponent } from '../product-card-skeleton/product-card-skeleton.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-product-card',
  imports: [ProductCardSkeletonComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  apiService = inject(ApiService);
  paginationService = inject(PaginationService);
  shopService = inject(ShopService);
  router = new Router();
  @Input() product: Product | null = null;

  currentPage = this.paginationService.currentPage;
  shopLoading = this.shopService.shopLoading;
  currentImage: string | null;
  setCurrentImage(e: MouseEvent) {
    const currentImageElement = e.target as HTMLElement;
    const currentImagePath = currentImageElement.getAttribute('src');
    if (typeof currentImagePath === 'string') {
      this.currentImage = currentImagePath;
    }
  }
  resetCurrentImage() {
    this.currentImage = null;
  }

  constructor() {
    this.currentImage = this.product?.medias
      ? this.product?.medias[0].path
      : null;
  }
}
