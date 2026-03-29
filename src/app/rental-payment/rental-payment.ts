import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RentalRequest, RentalService } from '../services/rental.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-rental-payment',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './rental-payment.html',
  styleUrl: './rental-payment.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentalPaymentComponent {
  startDate = '';
  endDate = '';
  goal = '';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly rentalService: RentalService,
    public readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  get customerId(): number | null {
    return this.authService.customer()?.Id ?? null;
  }

  get selectedCar(): any | null {
    return this.rentalService.getSelectedCar();
  }

  submitRental(): void {
    this.successMessage = '';
    this.errorMessage = '';

    const carCode = Number(this.selectedCar?.code);
    if (!this.customerId || this.customerId <= 0) {
      this.errorMessage = 'יש להזין מספר לקוח תקין.';
      return;
    }

    if (!carCode) {
      this.errorMessage = 'לא נבחר רכב להשכרה.';
      return;
    }

    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'יש להזין תאריך התחלה ותאריך סיום.';
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      this.errorMessage = 'תאריכי השכרה לא תקינים. תאריך סיום חייב להיות אחרי תאריך התחלה.';
      return;
    }

    if (!this.goal.trim()) {
      this.errorMessage = 'יש להזין מטרת השכרה.';
      return;
    }

    const payload: RentalRequest = {
      codeCustomer: this.customerId,
      codeCar: carCode,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      goal: this.goal.trim()
    };

    this.isSubmitting = true;
    this.rentalService.createRental(payload).subscribe({
      next: () => {
        this.successMessage = 'התשלום נקלט וההשכרה בוצעה בהצלחה.';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'שגיאה בביצוע תשלום/השכרה. ודא שהשרת פעיל ונתיב ה-API קיים.';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
