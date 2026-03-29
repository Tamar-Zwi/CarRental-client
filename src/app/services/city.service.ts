import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timeout, catchError, of, throwError } from 'rxjs';

export interface City {
  code: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private readonly url = 'http://localhost:53191/api/city';

  constructor(private readonly http: HttpClient) {}

  getAllCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.url}/getallcities`);
  }

  addCity(city: { name: string }): Observable<any> {
    console.log('CityService: שולח בקשה ל-', `${this.url}/insertcity`);
    console.log('CityService: נתונים:', city);
    
    // ניסיון ראשון: { name: "..." }
    return this.http.post<any>(`${this.url}/insertcity`, city).pipe(
      timeout(5000), // timeout אחרי 5 שניות
      catchError((error) => {
        console.error('CityService: ניסיון ראשון נכשל:', error);
        
        if (error.name === 'TimeoutError') {
          console.error('CityService: timeout - השרת לא הגיב תוך 5 שניות');
          return throwError(() => ({ status: 0, error: 'timeout', message: 'השרת לא הגיב' }));
        }
        
        // ניסיון שני: דילוג על /insertcity ו-POST ישירות עם השם בתור string
        console.log('CityService: מנסה פורמט אחר - שליחת string');
        return this.http.post<any>(`${this.url}/insertcity`, `"${city.name}"`, {
          headers: { 'Content-Type': 'application/json' }
        }).pipe(
          timeout(5000),
          catchError((error2) => {
            console.error('CityService: ניסיון שני נכשל:', error2);
            // מחזיר את השגיאה המקורית
            return throwError(() => error);
          })
        );
      })
    );
  }
}
  }
}
