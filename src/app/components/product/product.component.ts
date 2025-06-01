import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { isAxiosError, Product } from '../../types';
import AppService from '../../app.service';
import axios from 'axios';

interface ProductResponse {
  success: boolean;
  product: Product;
}
@Component({
  selector: 'app-product',
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  router = new Router();
  loading: boolean = false;
  product: Product | undefined = undefined;
  productUUID: string;
  appService = inject(AppService);
  currentImage: string | null = null;
  shopQueryParams: Params | null;
  getProduct = async () => {
    try {
      const response = await axios.get<ProductResponse>(
        this.appService.apiUrl + `/products/${this.productUUID}`
      );

      this.product = response.data.product;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    } catch (err) {
      setTimeout(() => {
        this.loading = false;
      }, 500);
      if (isAxiosError(err)) {
        this.router.navigateByUrl(
          `/error?status="${err.status}"&message="${err.message}"`
        );
      } else {
        this.router.navigateByUrl(`/error?message="${(err as Error).message}"`);
      }
    }
  };

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
    const cartItems = this.appService.getCartItems();

    const findCartItem = cartItems.find(
      (item) => item.productUuid === this.productUUID
    );
    if (findCartItem) {
      this.appService.addQuantityToCartItem(findCartItem.productUuid);
    } else {
      const newCartItem = {
        productUuid: product.productUuid,
        img: product.medias[0].path,
        title: product.title,
        price: product.price,
        quantity: 1,
      };

      this.appService.addCartItem(newCartItem);
    }
    this.appService.setCartIsOpen(true);
  }

  constructor(route: ActivatedRoute) {
    this.productUUID = route.snapshot.params['productUUID'];

    const shopQueryParams = localStorage.getItem('shopQueryParams');
    this.shopQueryParams = shopQueryParams ? JSON.parse(shopQueryParams) : null;

    this.appService.setShopQueryParams(this.shopQueryParams);
    this.appService.setIsShopUrlReady(true);
  }

  async ngOnInit() {
    if (this.appService.getProduct(this.productUUID)) {
      this.product = this.appService.getProduct(this.productUUID);
    } else {
      this.loading = true;
      await this.getProduct();
    }
  }
}
