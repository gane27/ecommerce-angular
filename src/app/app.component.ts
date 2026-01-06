import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { CartSidebarComponent } from './components/cart-sidebar/cart-sidebar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    CartSidebarComponent,
    FooterComponent
  ],
  styleUrls: ['./app.component.scss'],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <span class="company-name">Ecommerce</span>
      <span class="spacer"></span>
      <div class="toolbar-actions">
        <button mat-raised-button color="accent" (click)="navigateToSignIn()" *ngIf="!isAuthenticated()" class="sign-in-btn">
          <mat-icon>login</mat-icon>
          <span class="btn-label">Sign In</span>
        </button>
        <span *ngIf="isAuthenticated()" class="user-info">
          <span class="user-text">Welcome, {{ getCurrentUser() }}</span>
        </span>
        <button mat-icon-button (click)="toggleCart()" [matBadge]="cartItemCount" matBadgeColor="accent" class="cart-btn">
          <mat-icon>shopping_cart</mat-icon>
        </button>
      </div>
    </mat-toolbar>
    
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
    
    <app-footer></app-footer>
    
    <app-cart-sidebar [isOpen]="cartOpen"></app-cart-sidebar>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();
  isMobile = false;
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get cartOpen() {
    return this.cartService.cartOpen();
  }

  get cartItemCount() {
    return this.cartService.cartItemCount();
  }

  toggleCart() {
    this.cartService.toggleCart();
  }

  navigateToSignIn() {
    this.router.navigate(['/signin']);
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
}
