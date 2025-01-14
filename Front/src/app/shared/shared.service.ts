import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private email: string = localStorage.getItem('email') || '';

  setEmail(email: string): void {
    this.email = email;
    localStorage.setItem('email', email); // Stocker dans localStorage
  }

  getEmail(): string {
    return this.email;
  }
}
