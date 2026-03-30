import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // אם המשתמש מחובר, מנע גישה
  if (authService.customer()) {
    router.navigate(['/rental-payment']);
    return false;
  }

  // משתמש לא מחובר - אפשר גישה
  return true;
};
