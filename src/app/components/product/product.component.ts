import { Component, inject } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { Product } from '../../types';
import AppService from '../../app.service';
import axios from 'axios';

interface ProductResponse {
  success: boolean;
  product: Product;
}

@Component({
  selector: 'app-product',
  imports: [RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  product: Product | null = null;
  productUUID: string;
  appService = inject(AppService);
  isLoading: boolean = true;
  shopQueryParams: Params | null;
  getProduct = async () => {
    try {
      const response = await axios.get<ProductResponse>(
        this.appService.apiUrl + `/products/${this.productUUID}`
      );

      this.product = response.data.product;
      this.isLoading = false;
    } catch (e) {
      //create a error component and redirect to it
      /* if (axios.isAxiosError(err)) {
        //with status and message
      } */
      //with message only
      //here err is instance of Error

      this.isLoading = false;
    }
  };

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

  ngOnInit() {
    this.getProduct();
  }
}
