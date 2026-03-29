import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CarService } from '../services/car';
import { RentalService } from '../services/rental.service';

@Component({
  selector: 'app-select-car',
  imports: [CommonModule, RouterLink],
  templateUrl: './select-car.html',
  styleUrl: './select-car.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCarComponent implements OnInit {
  cars: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly carService: CarService,
    private readonly rentalService: RentalService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.cars = cars ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'לא הצלחנו לטעון את מאגר הרכבים.';
        this.isLoading = false;
      }
    });
  }

  chooseCar(car: any): void {
    this.rentalService.setSelectedCar(car);
    this.router.navigate(['/rental-payment']);
  }
}
