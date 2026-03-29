import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

export interface Customer {
  Id: number;
  firstName: string;
  lastName: string;
  codeCity: number;
  email: string;
  numRents: number;
  codePayment: number;
  address: string;
  City?: any;
  Cities?: any;
  Payment?: any;
  Payments?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  url: string = 'http://localhost:53191/api/customer';

  constructor(private http: HttpClient) {}

  login(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}/login/${id}`);
  }

  checkIdExists(id: number): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.url}/checkid/${id}`);
  }

  register(customer: Customer): Observable<string> {
    return this.http.post(`${this.url}/insertclient`, customer, {
      responseType: 'text'
    });
  }

  getCustomerList(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url + '/getallclients');
  }

  getCustomerById(customerId: number): Observable<Customer> {
    return this.login(customerId).pipe(
      catchError(() => this.http.get<Customer>(`${this.url}/GetCostomerByID/${customerId}`))
    );
  }

  insertNewCustomer(customer: Customer): Observable<string> {
    return this.register(customer);
  }

  updateCustomer(customer: Customer): Observable<string> {
    return this.http.put(`${this.url}/UpDateClient/client`, customer, {
      responseType: 'text'
    });
  }

  deleteCustomer(customer: Customer): Observable<string> {
    return this.http.delete(`${this.url}`, {
      body: customer,
      responseType: 'text'
    });
  }

  getCustomersOrderByName(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}/GetCustomersOrderByName`);
  }

  getThreeV(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}/GetThreeV`);
  }

  getFromCity(city: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}/GetFromCity?city=${encodeURIComponent(city)}`);
  }

  getDetailsPayments(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/GetDeatailsPayments?id=${id}`);
  }
}
