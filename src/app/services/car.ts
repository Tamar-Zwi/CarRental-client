import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  url: string = 'http://localhost:53191/api/car';

  constructor(private http: HttpClient) {}

  // פונקציה לשליפת כל הרכבים מהשרת
  getAllCars(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/getallcars');
  }

  seedCars(): Observable<any> {
    return this.http.post<any>(`${this.url}/seeddata`, {});
  }

  insertCar(car: any): Observable<string> {
    return this.http.post(`${this.url}/insertcar/car`, car, {
      responseType: 'text'
    });
  }

  updateCar(id: number, car: any): Observable<string> {
    return this.http.put(`${this.url}/updatecar/${id}`, car, {
      responseType: 'text'
    });
  }

  deleteCar(id: number): Observable<string> {
    return this.http.delete(`${this.url}/deletecar/${id}`, {
      responseType: 'text'
    });
  }

  getCarsBySeats(numSeats: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/getcarsbyseats?numseats=${numSeats}`);
  }

  getCarsByLevel(level: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/getcarsbylevel?level=${encodeURIComponent(level)}`);
  }

  getCarsByPriceForDay(price: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/getcarsbypriceforDay?price=${price}`);
  }

  getCarsByAllCriterions(level: string, price: number, numSeats: number): Observable<any[]> {
    const levelQuery = encodeURIComponent(level);
    return this.http.get<any[]>(
      `${this.url}/getcarsbyallcriterions?level=${levelQuery}&price=${price}&numseats=${numSeats}`
    );
  }
}