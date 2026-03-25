import { Component } from '@angular/core';
import { CustomerService, Customer } from '../services/customer.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './customer-login.html',
  styleUrls: ['./customer-login.css']
})
export class CustomerLoginComponent {
  customerId: number | null = null;
  customer: Customer | null = null;
  error: string | null = null;

  constructor(private customerService: CustomerService) {}

  onLogin() {
    this.error = null;
    this.customer = null;
    // ודא ש-customerId הוא מספר תקין
    const id = Number(this.customerId);
    if (!id || isNaN(id)) {
      this.error = 'יש להזין מספר לקוח תקין';
      return;
    }
    this.customerService.getCustomerById(id).subscribe({
      next: (result) => {
        this.customer = result;
        this.error = null;
      },
      error: () => {
        this.customer = null;
        this.error = 'לקוח לא נמצא';
      }
    });
  }
}
