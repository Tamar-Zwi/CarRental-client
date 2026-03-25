import { Routes } from '@angular/router';
import { CustomerLoginComponent } from './customer-login/customer-login';
import { RegisterCustomerComponent } from './register-customer/register-customer'; 
import { CarListComponent } from './car-list/car-list'; // הוספנו את הייבוא הזה
//hhhhh
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: CustomerLoginComponent },
  { path: 'register', component: RegisterCustomerComponent },
  { path: 'cars', component: CarListComponent } // הוספנו את הנתיב הזה
];