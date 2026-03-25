import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerLoginComponent } from './customer-login/customer-login';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomerLoginComponent, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('cars-app');
}