import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import AppService from '../../services/app.service';
import { ShopService } from '../../services/shop.service';

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
  router = new Router();

  shopQueryParams = this.shopService.shopQueryParams;
  isSuccessfull: boolean;
  error: string | null;

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
