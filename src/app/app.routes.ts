import { Routes } from '@angular/router';
import { CustomerLoginComponent } from './customer-login/customer-login';
import { RegisterCustomerComponent } from './register-customer/register-customer'; 
import { CarListComponent } from './car-list/car-list';
import { SelectCarComponent } from './select-car/select-car';
import { RentalPaymentComponent } from './rental-payment/rental-payment';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: CustomerLoginComponent },
  { path: 'register', component: RegisterCustomerComponent },
  { path: 'cars', component: CarListComponent },
  { path: 'choose-car', component: SelectCarComponent },
  { path: 'rental-payment', component: RentalPaymentComponent }
];