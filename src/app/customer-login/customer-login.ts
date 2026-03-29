import { Component, ChangeDetectorRef } from '@angular/core';
import { CustomerService, Customer } from '../services/customer.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './customer-login.html',
  styleUrls: ['./customer-login.css']
})
export class CustomerLoginComponent {
  customerId: number | null = null;
  customer: Customer | null = null;
  error: string | null = null;
  rawResponse: string | null = null;  // לאבחון: תשובה גולמית מהשרת

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  onLogin() {
    this.error = null;
    this.customer = null;
    this.rawResponse = null;
    
    const id = Number(this.customerId);
    if (!id || isNaN(id)) {
      this.error = 'יש להזין מספר לקוח תקין';
      return;
    }

    this.customerService.getCustomerById(id).subscribe({
      next: (result: any) => {
        console.log('תשובת השרת:', result);
        this.rawResponse = JSON.stringify(result, null, 2);

        // אם קיבלנו תשובה כלשהי מהשרת שאינה null — הלקוח קיים
        if (result) {
          this.customer = result;
          this.authService.setCustomer(result);
          this.error = null;
          this.cdr.detectChanges();
        } else {
          this.customer = null;
          this.error = 'השרת החזיר ריק (null) — לקוח לא נמצא';
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/register']), 1500);
        }
      },
      error: (err: any) => {
        console.error('שגיאת השרת:', err);
        this.customer = null;
        this.rawResponse = `שגיאה ${err.status}: ${JSON.stringify(err.error)}`;
        this.error = `שגיאה מהשרת (${err.status}) — לקוח לא נמצא, מעביר לעמוד הרשמה...`;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/register']), 2000);
      }
    });
  }
}