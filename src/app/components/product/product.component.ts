import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../shared/types';
import AppService from '../../services/app.service';

import { ShopService } from '../../services/shop.service';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  appService = inject(AppService);
  apiService = inject(ApiService);
  shopService = inject(ShopService);
  cartService = inject(CartService);

  activeProduct = this.shopService.activeProduct;
  singleProductLoading = this.shopService.singleProductLoading;
  shopQueryParams = this.shopService.shopQueryParams;
  currentImage: string | null = null;

  setCurrentImage(e: MouseEvent) {
    const currentImageElement = (e.currentTarget as HTMLElement)
      .children[0] as HTMLElement;
    const layover = (e.currentTarget as HTMLElement).children[1] as HTMLElement;
    layover.style.opacity = '1';
    const currentImagePath = currentImageElement.getAttribute('src');
    if (typeof currentImagePath === 'string') {
      this.currentImage = currentImagePath;
    }
  }
  resetCurrentImage(e: MouseEvent) {
    const layover = (e.currentTarget as HTMLElement).children[1] as HTMLElement;
    layover.style.opacity = '0';
    this.currentImage = null;
  }

  addToCart(product: Product) {
    const foundCartProduct = this.cartService.findCartProduct(
      this.activeProduct().productUuid
    );

    if (foundCartProduct) {
      this.cartService.addQuantityToCartProduct(foundCartProduct.productUuid);
    } else {
      const newCartProduct = {
        productUuid: product.productUuid,
        img: product.medias ? product.medias[0].path : '',
        title: product.title,
        price: product.price,
        quantity: 1,
      };

      this.cartService.addCartProduct(newCartProduct);
    }
    this.cartService.openCart();
  }

  constructor() {
    const shopQueryParams = localStorage.getItem('shopQueryParams');
    this.shopService.shopQueryParams.set(
      shopQueryParams ? JSON.parse(shopQueryParams) : null
    );
  }
}
