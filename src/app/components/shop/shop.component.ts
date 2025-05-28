import { Component, inject } from '@angular/core';
import axios from 'axios';
import { Product } from '../../types';
import { ProductCardComponent } from '../product-card/product-card.component';
import AppService from '../../app.service';

interface ProductsResponse {
  success: boolean;
  products: Product[];
}
@Component({
  selector: 'app-shop',
  imports: [ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  products: Product[] = [];
  currentPage: number = 1;
  appService = inject(AppService);
  getProducts = async () => {
    try {
      const response = await axios.get<ProductsResponse>(
        this.appService.apiUrl + `/products?page=${this.currentPage}`
      );
      this.products = response.data.products;
    } catch (err) {
      //create a error component and redirect to it
      /* if (axios.isAxiosError(err)) {
        //with status and message
      } */
      //with message only
      //here err is instance of Error
    }
  };
  ngOnInit() {
    this.getProducts();
  }
}
