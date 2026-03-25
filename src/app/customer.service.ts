import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getClientById(id: string): Observable<any> {
    // כתובת ה-API שלך (שנה לפי הצורך)
    return this.http.get(`/api/customer/${id}`);
  }
}
