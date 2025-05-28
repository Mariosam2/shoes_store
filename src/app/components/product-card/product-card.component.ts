import { Component, Input } from '@angular/core';
import { Product } from '../../types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product: Product | null = null;
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
    this.currentImage = this.product?.medias[0].path
      ? this.product?.medias[0].path
      : null;
  }
}
