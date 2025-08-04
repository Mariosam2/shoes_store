import { inject, Injectable, isDevMode, signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { prodEnvironment } from '../../environment/environtment.prod';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import {
  Appearance,
  loadStripe,
  Stripe,
  StripeCheckout,
} from '@stripe/stripe-js';
import { CreateCheckoutResponse } from '../shared/responses';
import { CartProduct } from '../shared/types';
import { isAxiosError } from '../shared/responses';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  apiService = inject(ApiService);
  router = new Router();

  paymentElementLoading = signal<boolean>(false);
  addressElementLoading = signal<boolean>(false);
  processingPayment = signal<boolean>(false);
  payingProducts = signal<CartProduct[]>([]);
  total = signal<number>(0);

  emailError = signal<string>('');
  checkout: StripeCheckout | null = null;
  stripe: Stripe | null = null;

  stripePublic: string = isDevMode()
    ? environment.stripePublic
    : prodEnvironment.stripePublic;
  stripeSecret: string = isDevMode()
    ? environment.stripeSecret
    : prodEnvironment.stripeSecret;

  createCheckoutSession = async (): Promise<string> => {
    return axios
      .post<CreateCheckoutResponse>(
        this.apiService.apiUrl + '/create-checkout-session',
        {
          items: this.payingProducts().map((product) => {
            return {
              productUUID: product.productUuid,
              quantity: product.quantity,
            };
          }),
        }
      )
      .then((res) => {
        return res.data.clientSecret;
      });
  };

  async loadStripeElements() {
    try {
      this.stripe = await loadStripe(this.stripePublic);
      const appearance: Appearance = {
        theme: 'stripe',
      };
      const checkout = await this.stripe?.initCheckout({
        fetchClientSecret: () => this.createCheckoutSession(),
        elementsOptions: { appearance },
      });
      if (checkout) {
        this.checkout = checkout;
        const paymentElement = this.checkout.createPaymentElement();

        paymentElement.mount('#payment-element');
        const addressElement = this.checkout.createShippingAddressElement();
        addressElement.mount('#address-element');
        paymentElement.on('ready', () => {
          this.apiService.delayLoadingFinish(this.paymentElementLoading);
        });
        addressElement.on('ready', () => {
          this.apiService.delayLoadingFinish(this.addressElementLoading);
        });
        this.total.set(parseFloat(this.checkout.session().total.total.amount));
      }

      //continute  with the stripe documentation
    } catch (error) {
      //redirect to an error component
      if (isAxiosError(error)) {
        this.router.navigateByUrl(
          `/error?status="${error.status}"&message="${error.message}"`
        );
      } else {
        this.router.navigateByUrl(
          `/error?message="${(error as Error).message}"`
        );
      }
    }
  }

  async payOrder(email: string) {
    this.processingPayment.set(true);
    const updateResult = await this.checkout?.updateEmail(email);
    const isValid = updateResult?.type !== 'error';
    if (isValid) {
      const checkoutResult = await this.checkout?.confirm();
      this.apiService.delayLoadingFinish(this.processingPayment);

      if (checkoutResult?.type === 'error') {
        this.apiService.delayLoadingFinish(this.processingPayment);
        if (checkoutResult.error.code === 'paymentFailed') {
          this.router.navigateByUrl(
            `/after-payment?error=${checkoutResult.error.message}`
          );
        }
      }
    } else {
      this.emailError.set(updateResult.error.message);
      this.apiService.delayLoadingFinish(this.processingPayment);
    }
  }
}
