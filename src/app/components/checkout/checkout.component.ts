import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; //
import { ApiService } from '../../services/api.service';
import { ShopService } from '../../services/shop.service';
import { PaymentService } from '../../services/payment.service';
import { CartProduct } from '../../shared/types';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  apiService = inject(ApiService);
  shopService = inject(ShopService);
  paymentService = inject(PaymentService);

  paymentLoading = this.paymentService.paymentLoading;
  addressLoading = this.paymentService.addressLoading;
  processingPayment = this.paymentService.processingPayment;

  payingProducts = this.paymentService.payingProducts;
  shopQueryParams = this.shopService.shopQueryParams;
  email: string = '';
  emailError = this.paymentService.emailError;
  total = this.paymentService.total;

  resetEmailError = () => {
    this.paymentService.emailError.set('');
  };

  async ngOnInit() {
    this.paymentLoading.set(true);
    this.addressLoading.set(true);
    await this.paymentService.loadStripeElements();
  }

  constructor(route: ActivatedRoute) {
    this.paymentService.payingProducts.set(
      JSON.parse(route.snapshot.params['products'])
    );
  }
}
