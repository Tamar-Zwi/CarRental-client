import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CarService } from '../services/car';
import { RentalService } from '../services/rental.service';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-list.html',
  styleUrls: ['./car-list.css']
})
export class CarListComponent implements OnInit {
  cars: any[] = []; 
  errorMessage: string = '';
  isLoading: boolean = true;
  isSeeding: boolean = false;

  constructor(
    private carService: CarService, 
    private cdr: ChangeDetectorRef,
    private rentalService: RentalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.errorMessage = '';
    this.isLoading = true;

    this.carService.getAllCars().subscribe({
      next: (data) => {
        console.log('רכבים מהשרת:', data);
        this.cars = data || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        if (err.status === 0) {
          this.errorMessage = 'לא ניתן להתחבר לשרת. ודאי שה-API רץ על localhost:53191 וש-CORS תקין.';
        } else if (err.status === 404) {
          this.errorMessage = 'הנתיב לא נמצא: GET /api/car/getallcars';
        } else {
          this.errorMessage = `שגיאת שרת בטעינת רכבים: ${err.status} ${err.statusText}`;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  seedCars() {
    this.isSeeding = true;
    this.errorMessage = '';

    this.carService.seedCars().subscribe({
      next: () => {
        this.isSeeding = false;
        this.loadCars();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.errorMessage = 'נכשל מילוי רכבים אוטומטי. בדקי endpoint: POST /api/car/seeddata';
        this.isSeeding = false;
      }
    });
  }

  selectForRent(car: any) {
    this.rentalService.setSelectedCar(car);
    this.router.navigate(['/rental-payment']);
  }
}