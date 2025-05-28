import { Component, inject, isDevMode } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../types';
import AppService from '../../app.service';
import axios from 'axios';

interface ProductResponse {
  success: boolean;
  product: Product;
}

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  product: Product | null = null;
  productUUID: string;
  appService = inject(AppService);
  isLoading: boolean = true;
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

  constructor(route: ActivatedRoute) {
    this.productUUID = route.snapshot.params['productUUID'];
  }

  ngOnInit() {
    this.getProduct();
  }
}
