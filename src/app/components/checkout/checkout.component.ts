import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartItem } from '../../types';
import AppService from '../../app.service';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private activatedRoute = inject(ActivatedRoute);
  appService = inject(AppService);
  items: CartItem[];

  constructor() {
    this.items = JSON.parse(this.activatedRoute.snapshot.params['items']);
    console.log(this.items);
  }
}
