import { inject, Injectable, isDevMode, signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { prodEnvironment } from '../../environment/environtment.prod';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import {
  Appearance,
  loadStripe,
  PaymentIntent,
  PaymentIntentResult,
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

  paymentLoading = signal<boolean>(true);
  addressLoading = signal<boolean>(true);
  processingPayment = signal<boolean>(false);
  payingProducts = signal<CartProduct[]>([]);
  total = signal<number>(0);

  emailError = signal<string>('');
  checkout = signal<StripeCheckout | null>(null);
  stripe: Stripe | null = null;
  orderPaymentIntent = signal<PaymentIntentResult | undefined>(undefined);

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
      })
      .catch((err) => {
        const message = 'An error occured while creating the checkout session';
        if (isAxiosError(err)) {
          this.router.navigateByUrl(
            `/error?status="${err.status}"&message="${message}"`
          );
        } else {
          this.router.navigateByUrl(`/error?message="${message}"`);
        }
        return message;
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
        this.checkout.set(checkout);

        const paymentElement = checkout.createPaymentElement();
        paymentElement.mount('#payment-element');

        const addressElement = checkout.createShippingAddressElement();
        addressElement.mount('#address-element');

        paymentElement.on('ready', () => {
          this.apiService.delayLoadingFinish(this.paymentLoading);
        });
        addressElement.on('ready', () => {
          this.apiService.delayLoadingFinish(this.addressLoading);
        });
        this.total.set(parseFloat(checkout.session().total.total.amount));
      }
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
    const updateResult = await this.checkout()?.updateEmail(email);
    const isValid = updateResult?.type !== 'error';
    if (isValid) {
      const checkoutResult = await this.checkout()?.confirm();
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
      console.log(updateResult.error.message);
      this.emailError.set(updateResult.error.message);
      this.apiService.delayLoadingFinish(this.processingPayment);
    }
  }
}
