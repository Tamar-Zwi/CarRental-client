import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AppBarService } from './services/app-bar.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('cars-app');

  constructor(
    public readonly appBarService: AppBarService,
    public readonly authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
  }
}