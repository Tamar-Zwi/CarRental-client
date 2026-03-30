import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RentalRequest, RentalService } from '../services/rental.service';
import { AuthService } from '../services/auth.service';
import { CustomerService, Customer } from '../services/customer.service';

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

  // עריכת פרופיל
  isEditingProfile = false;
  editCreditCard = '';
  editValidity: number | null = null;
  editCvc: number | null = null;
  profileMessage = '';
  isSavingProfile = false;

  constructor(
    private readonly rentalService: RentalService,
    public readonly authService: AuthService,
    private readonly customerService: CustomerService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  get customerId(): number | null {
    const customer = this.authService.customer();
    return customer?.id ?? customer?.Id ?? null;
  }

  get selectedCar(): any | null {
    return this.rentalService.getSelectedCar();
  }

  getLastFourDigits(): string {
    const payment = this.authService.customer()?.Payments || this.authService.customer()?.Payment;
    if (!payment?.creaditCard) return '****';
    const card = payment.creaditCard;
    return card.slice(-4);
  }

  getPaymentValidity(): string {
    const payment = this.authService.customer()?.Payments || this.authService.customer()?.Payment;
    if (!payment?.validity) return 'לא זמין';
    return `${payment.validity}/20**`;
  }

  startEditingProfile(): void {
    const customer = this.authService.customer();
    if (!customer) return;

    const payment = customer.Payments || customer.Payment;
    this.editCreditCard = payment?.creaditCard || '';
    this.editValidity = payment?.validity || null;
    this.editCvc = payment?.cvc || null;
    this.isEditingProfile = true;
    this.profileMessage = '';
    this.cdr.markForCheck();
  }

  cancelEditingProfile(): void {
    this.isEditingProfile = false;
    this.editCreditCard = '';
    this.editValidity = null;
    this.editCvc = null;
    this.profileMessage = '';
    this.cdr.markForCheck();
  }

  saveProfile(): void {
    const customer = this.authService.customer();
    if (!customer) return;

    // בדיקות תקינות
    if (!this.editCreditCard || this.editCreditCard.length < 15) {
      this.profileMessage = 'יש להזין מספר כרטיס אשראי תקין (15-16 ספרות).';
      return;
    }
    if (!this.editValidity || this.editValidity < 1 || this.editValidity > 12) {
      this.profileMessage = 'יש להזין חודש תוקף תקין (1-12).';
      return;
    }
    if (!this.editCvc || this.editCvc < 100 || this.editCvc > 999) {
      this.profileMessage = 'יש להזין CVV/CVC תקין (3 ספרות).';
      return;
    }

    this.isSavingProfile = true;
    this.profileMessage = '';

    const updatedCustomer: Customer = {
      ...customer,
      id: customer.id || customer.Id || 0,
      Id: customer.id || customer.Id || 0,
      Payments: {
        creaditCard: this.editCreditCard,
        validity: this.editValidity,
        cvc: this.editCvc
      }
    };

    this.customerService.updateCustomer(updatedCustomer).subscribe({
      next: () => {
        this.authService.setCustomer(updatedCustomer);
        this.profileMessage = 'פרטי התשלום נשמרו בהצלחה!';
        this.isSavingProfile = false;
        this.isEditingProfile = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('שגיאה בשמירת פרופיל:', err);
        this.profileMessage = 'שגיאה בשמירת הפרטים. נסה שוב.';
        this.isSavingProfile = false;
        this.cdr.markForCheck();
      }
    });
  }

  submitRental(): void {
    this.successMessage = '';
    this.errorMessage = '';

    const customer = this.authService.customer();
    const payment = customer?.Payments || customer?.Payment;
    
    if (!payment || !payment.creaditCard) {
      this.errorMessage = 'יש להוסיף פרטי תשלום לפני ביצוע השכרה.';
      return;
    }

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
