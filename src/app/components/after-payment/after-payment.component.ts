import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
} from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import AppService from '../../services/app.service';
import { ShopService } from '../../services/shop.service';
import { PaymentService } from '../../services/payment.service';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-after-payment',
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './after-payment.component.html',
  styleUrl: './after-payment.component.css',
})
export class AfterPaymentComponent {
  shopService = inject(ShopService);
  activatedRoute = inject(ActivatedRoute);
  paymentService = inject(PaymentService);
  router = new Router();

  shopQueryParams = this.shopService.shopQueryParams;
  isSuccessfull: boolean;
  error: string | null;

  async ngOnInit() {
    const clientSecret = this.activatedRoute.snapshot.queryParams['session_id'];
    const stripe = await loadStripe(this.paymentService.stripePublic);
    const prova = await stripe?.retrievePaymentIntent(clientSecret);
    console.log(prova);
  }

  constructor() {
    const sessionID = this.activatedRoute.snapshot.queryParams['session_id'];
    const error = this.activatedRoute.snapshot.queryParams['error'];
    if (sessionID) {
      this.error = null;
      this.isSuccessfull = true;
    } else {
      this.error = error;
      this.isSuccessfull = false;
    }
  }
}
