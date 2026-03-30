import { Routes } from '@angular/router';
import { CustomerLoginComponent } from './customer-login/customer-login';
import { RegisterCustomerComponent } from './register-customer/register-customer'; 
import { CarListComponent } from './car-list/car-list';
import { RentalPaymentComponent } from './rental-payment/rental-payment';
import { MyRentalsComponent } from './my-rentals/my-rentals';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: CustomerLoginComponent },
  { path: 'register', component: RegisterCustomerComponent, canActivate: [guestGuard] },
  { path: 'cars', component: CarListComponent },
  { path: 'rental-payment', component: RentalPaymentComponent },
  { path: 'my-rentals', component: MyRentalsComponent }
];