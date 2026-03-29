import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RentalRequest {
  codeCustomer: number;
  codeCar: number;
  startDate: string;
  endDate: string;
  goal: string;
}

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private readonly url = 'http://localhost:53191/api/rent';
  private selectedCarValue: any | null = null;

  constructor(private readonly http: HttpClient) {}

  setSelectedCar(car: any): void {
    this.selectedCarValue = car;
  }

  getSelectedCar(): any | null {
    return this.selectedCarValue;
  }

  createRental(request: RentalRequest): Observable<string> {
    return this.http.post(`${this.url}/InsertRent`, request, {
      responseType: 'text'
    });
  }

  getRents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/rents`);
  }

  insertRent(rent: any): Observable<string> {
    return this.http.post(`${this.url}/InsertRent`, rent, {
      responseType: 'text'
    });
  }

  updateRent(rent: any): Observable<string> {
    return this.http.put(`${this.url}/UpDateRent`, rent, {
      responseType: 'text'
    });
  }

  deleteRent(rent: any): Observable<string> {
    return this.http.delete(`${this.url}/DeleteRent`, {
      body: rent,
      responseType: 'text'
    });
  }

  getRentFromThisWeek(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/GetRentFromThisWeek`);
  }

  getRentFromLastMounth(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/GetRentFromLastMounth`);
  }

  getRentThatStartToday(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/GetRentThatStartToday`);
  }

  getRentThatStartOnDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/GetRentThatStartOnDate?date=${encodeURIComponent(date)}`);
  }

  getRentThatEndOnDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/GetRentThatEndOnDate?date=${encodeURIComponent(date)}`);
  }

  getRentThatAvailableFromToo(start: string, end: string): Observable<any[]> {
    const startQuery = encodeURIComponent(start);
    const endQuery = encodeURIComponent(end);
    return this.http.get<any[]>(`${this.url}/GetRentThatAvailableFromToo?start=${startQuery}&end=${endQuery}`);
  }

  getCarsByGaol(goal: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/GetCarsByGaol?goal=${encodeURIComponent(goal)}`);
  }

  getRentByCustomerId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/GetRentByCustomerid?id=${id}`);
  }

  getRentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/GetRentById?id=${id}`);
  }

  getRentOrderBy(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/GetRentOrderBy`);
  }
}
