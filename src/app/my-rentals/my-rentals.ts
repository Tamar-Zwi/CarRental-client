import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RentalService } from '../services/rental.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-my-rentals',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-rentals.html',
  styleUrls: ['./my-rentals.css']
})
export class MyRentalsComponent implements OnInit {
  rentals: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    public readonly authService: AuthService,
    private readonly rentalService: RentalService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRentals();
  }

  loadRentals(): void {
    const customer = this.authService.customer();
    if (!customer) {
      this.errorMessage = 'יש להתחבר כדי לצפות בהזמנות.';
      return;
    }

    const customerId = customer.id || customer.Id;
    if (!customerId) {
      this.errorMessage = 'לא נמצא מזהה לקוח.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // ננסה לקבל את ההזמנות הספציפיות ללקוח
    this.rentalService.getRentsByCustomer(customerId).pipe(
      catchError((err) => {
        console.warn('API ספציפי ללקוח לא זמין, מנסה לקבל את כל ההזמנות:', err);
        // אם זה נכשל, ננסה לקבל את כל ההזמנות
        return this.rentalService.getRents();
      })
    ).subscribe({
      next: (rentals) => {
        console.log('השכרות שהתקבלו:', rentals);
        console.log('customerId שאני מחפש:', customerId);
        
        // נסנן רק את ההזמנות של הלקוח הנוכחי
        this.rentals = (rentals || []).filter((rental: any) => {
          const rentalCustomerId = rental.codeCustomer || rental.CodeCustomer;
          console.log('rental.codeCustomer:', rentalCustomerId, 'customerId:', customerId);
          return rentalCustomerId == customerId; // השוואה עם == כי אולי אחד מספר ואחד מחרוזת
        });
        
        console.log('השכרות מסוננות:', this.rentals);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('שגיאה בטעינת השכרות:', err);
        this.errorMessage = `שגיאה בטעינת ההזמנות: ${err.status || 'לא ידוע'}`;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'לא זמין';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateDuration(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)); // ימים
  }
}
