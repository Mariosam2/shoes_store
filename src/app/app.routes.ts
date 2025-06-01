import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductComponent } from './components/product/product.component';
import { AfterPaymentComponent } from './components/after-payment/after-payment.component';
import { ErrorComponent } from './components/error/error.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:productUUID', component: ProductComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'after-payment', component: AfterPaymentComponent },
  { path: 'error', component: ErrorComponent },
];
