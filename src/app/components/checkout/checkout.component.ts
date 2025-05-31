import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartItem } from '../../types';
import AppService from '../../app.service';
import { FormsModule } from '@angular/forms'; //
import {
  Appearance,
  loadStripe,
  Stripe,
  StripeCheckout,
} from '@stripe/stripe-js';
import axios from 'axios';

interface CreateCheckoutResponse {
  success: boolean;
  clientSecret: string;
}

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private activatedRoute = inject(ActivatedRoute);
  router = new Router();
  email: string = '';
  emailError: string | null = null;
  checkout: StripeCheckout | null = null;
  appService = inject(AppService);
  stripe: Stripe | null = null;
  total: string | null = null;
  items: CartItem[];
  loadStripe = async () => {
    const stripe = await loadStripe(this.appService.stripePublic);
    this.stripe = stripe;
  };

  resetEmailError = () => {
    this.emailError = null;
  };

  payOrder = async (e: Event) => {
    e.preventDefault();

    const updateResult = await this.checkout?.updateEmail(this.email);
    const isValid = updateResult?.type !== 'error';
    if (isValid) {
      const checkoutResult = await this.checkout?.confirm();
      if (checkoutResult?.type === 'error') {
        this.router.navigateByUrl(
          `/after-payment?error=${checkoutResult.error.message}`
        );
      }
    } else {
      this.emailError = updateResult.error.message;
    }
  };

  createCheckoutSession = async (): Promise<string> => {
    return axios
      .post<CreateCheckoutResponse>(
        this.appService.apiUrl + '/create-checkout-session',
        {
          items: this.items.map((item) => {
            return {
              productUUID: item.productUuid,
              quantity: item.quantity,
            };
          }),
        }
      )
      .then((res) => {
        console.log(res);
        return res.data.clientSecret;
      });
  };

  async ngOnInit() {
    try {
      this.stripe = await loadStripe(this.appService.stripePublic);
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
        this.total = this.checkout.session().total.total.amount;
      }

      //continute  with the stripe documentation
    } catch (err) {
      //redirect to an error component
    }
  }

  constructor() {
    this.items = JSON.parse(this.activatedRoute.snapshot.params['items']);
  }
}
