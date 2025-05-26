import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:productUUID', component: ShopComponent },
  { path: 'checkout', component: CheckoutComponent },
];
