import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import AppService from '../../app.service';

@Component({
  selector: 'app-after-payment',
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './after-payment.component.html',
  styleUrl: './after-payment.component.css',
})
export class AfterPaymentComponent {
  router = new Router();
  appService = inject(AppService);
  activatedRoute = inject(ActivatedRoute);
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
  ngOnInit() {
    console.log(this.activatedRoute);
  }
}
