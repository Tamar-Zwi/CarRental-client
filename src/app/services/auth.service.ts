import { Injectable, signal } from '@angular/core';
import { Customer } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _customer = signal<Customer | null>(null);
  readonly customer = this._customer.asReadonly();

  setCustomer(c: Customer): void {
    this._customer.set(c);
  }

  logout(): void {
    this._customer.set(null);
  }
}
