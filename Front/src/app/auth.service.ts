import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private username: string | null = null;

  // Set the username after successful login
  setUser(username: string): void {
    this.username = username;
  }

  // Get the stored username
  getUser(): string | null {
    return this.username;
  }

  // Clear user data on logout or when needed
  clearUser(): void {
    this.username = null;
  }
}
