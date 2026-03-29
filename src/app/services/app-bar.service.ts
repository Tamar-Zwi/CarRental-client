import { Injectable, signal } from '@angular/core';

export interface AppBarLink {
  label: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppBarService {
  readonly links = signal<AppBarLink[]>([
    { label: 'התחברות', path: '/login' },
    { label: 'הרשמה חדשה', path: '/register' },
    { label: 'מאגר רכבים', path: '/cars' },
    { label: 'בחירת רכב להשכרה', path: '/choose-car' },
    { label: 'תשלום וסגירת השכרה', path: '/rental-payment' }
  ]);
}
