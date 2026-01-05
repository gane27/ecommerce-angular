import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedState = signal<boolean>(false);
  private currentUser = signal<string>('');

  constructor(private router: Router) {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.isAuthenticatedState.set(true);
      this.currentUser.set(savedUser);
    }
  }

  signIn(email: string, password: string): boolean {
    // Simple authentication - in real app, this would call an API
    if (email && password) {
      this.isAuthenticatedState.set(true);
      this.currentUser.set(email);
      localStorage.setItem('currentUser', email);
      return true;
    }
    return false;
  }

  signOut() {
    this.isAuthenticatedState.set(false);
    this.currentUser.set('');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedState();
  }

  getCurrentUser(): string {
    return this.currentUser();
  }
}
