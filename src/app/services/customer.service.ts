import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Customer {
  Id: number;
  firstName: string;
  lastName: string;
  codeCity: number;
  email: string;
  numRents: number;
  codePayment: number;
  address: string;
  City: any;
  Payment: any;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  url: string = 'http://localhost:53191/api/customer';

  constructor(private http: HttpClient) {}

  getCustomerList(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url + '/GetCustomerList');
  }

getCustomerById(customerId: number): Observable<Customer> {
  return this.http.get<Customer>(`${this.url}/GetCostomerByID/${customerId}`);
}

  insertNewCustomer(customer: Customer): Observable<string> {
    return this.http.post(`${this.url}/insertclient`, customer, {
      responseType: 'text'
    });
  }
}
